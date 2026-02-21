// ============================================================
//  UTILS.JS — Utilitaires et generation de carte
// ============================================================

const G = {
    TILE: 32, W: 960, H: 640,
    canvas: null, ctx: null,
    state: null, keys: {}, mouse: {x:0,y:0,click:false},
    lastMove: 0, notifTimer: 0, animTime: 0,
    playerBounce: 0,
};

// --- Math utilities ---
G.lerp = (a,b,t) => a+(b-a)*t;
G.clamp = (v,lo,hi) => Math.max(lo,Math.min(hi,v));
G.dist = (x1,y1,x2,y2) => Math.hypot(x2-x1,y2-y1);

G.hash = function(x,y) {
    let h = (x*374761393 + y*668265263 + 1013904223)|0;
    h = ((h^(h>>13))*1274126177)|0;
    return ((h^(h>>16))&0x7FFFFFFF)/0x7FFFFFFF;
};

G.noise = function(x,y) {
    const xi=Math.floor(x), yi=Math.floor(y);
    const xf=x-xi, yf=y-yi;
    const sx=xf*xf*(3-2*xf), sy=yf*yf*(3-2*yf);
    const n00=G.hash(xi,yi), n10=G.hash(xi+1,yi);
    const n01=G.hash(xi,yi+1), n11=G.hash(xi+1,yi+1);
    return (n00*(1-sx)+n10*sx)*(1-sy)+(n01*(1-sx)+n11*sx)*sy;
};

// --- Commune detection ---
G.getCommune = function(x,y) {
    let best=null, bestD=Infinity;
    for (const [k,c] of Object.entries(DATA.COMMUNES)) {
        const d = G.dist(x,y,c.cx,c.cy);
        if (d < bestD) { bestD=d; best=k; }
    }
    return best;
};

G.getCommuneName = function(x,y) {
    const k = G.getCommune(x,y);
    return k ? DATA.COMMUNES[k].name : '';
};

// --- Map generation ---
G.generateMap = function() {
    const T = DATA.TILES;
    const map = [];
    for (let y=0; y<DATA.MAP_H; y++) {
        map[y] = [];
        for (let x=0; x<DATA.MAP_W; x++) {
            const c = G.getCommune(x,y);
            const cd = DATA.COMMUNES[c];
            const n1 = G.noise(x*0.08, y*0.08);
            const n2 = G.noise(x*0.15+50, y*0.15+50);
            const n3 = G.noise(x*0.25+100, y*0.25+100);

            let tile = T.GRASS;
            // Commune-specific terrain
            switch(cd.terrain) {
                case 'forest':
                    tile = n1>0.35 ? T.TREE : (n2>0.5 ? T.TALL_GRASS : (n3>0.85 ? T.FLOWERS : T.GRASS));
                    if (n1>0.6) tile = T.DENSE_TREE;
                    break;
                case 'deep_forest':
                    tile = n1>0.25 ? T.TREE : (n2>0.4 ? T.TALL_GRASS : T.GRASS);
                    if (n1>0.5) tile = T.DENSE_TREE;
                    if (n3>0.9) tile = T.BUSH;
                    break;
                case 'farmland':
                    tile = n1>0.55 ? T.WHEAT : (n2>0.7 ? T.TREE : (n3>0.8 ? T.FLOWERS : T.GRASS));
                    break;
                case 'meadow':
                    tile = n3>0.6 ? T.FLOWERS : (n2>0.7 ? T.BUSH : (n1>0.65 ? T.TALL_GRASS : T.GRASS));
                    break;
                case 'highland':
                    tile = n1>0.5 ? T.ROCK : (n2>0.55 ? T.TREE : (n3>0.7 ? T.TALL_GRASS : T.GRASS));
                    break;
                case 'rocky':
                    tile = n1>0.45 ? T.ROCK : (n2>0.6 ? T.TREE : (n3>0.75 ? T.BUSH : T.GRASS));
                    break;
                case 'valley':
                    tile = n2>0.65 ? T.TALL_GRASS : (n3>0.75 ? T.FLOWERS : (n1>0.7 ? T.TREE : T.GRASS));
                    break;
                case 'village':
                    tile = n1>0.65 ? T.TREE : (n3>0.8 ? T.FLOWERS : T.GRASS);
                    break;
            }
            map[y][x] = tile;
        }
    }

    // River from north to south through center
    G.addRiver(map);
    // Paths between communes
    G.addPaths(map);
    // Village features at each commune center
    G.addVillages(map);

    return map;
};

G.addRiver = function(map) {
    const T = DATA.TILES;
    let rx = 41;
    for (let y=0; y<DATA.MAP_H; y++) {
        rx += Math.round(G.noise(y*0.1+200, 0)*2 - 1);
        rx = G.clamp(rx, 35, 45);
        for (let dx=-1; dx<=1; dx++) {
            const x = rx+dx;
            if (x>=0 && x<DATA.MAP_W) {
                map[y][x] = dx===0 ? T.DEEP_WATER : T.WATER;
            }
        }
        // Wider in some places
        if (G.noise(y*0.05, 500) > 0.6) {
            if (rx-2>=0) map[y][rx-2] = T.WATER;
            if (rx+2<DATA.MAP_W) map[y][rx+2] = T.WATER;
        }
    }
    // Bridges at path crossings (added in addPaths)
};

G.addPaths = function(map) {
    const T = DATA.TILES;
    const communes = Object.values(DATA.COMMUNES);
    const athis = DATA.COMMUNES.athis;

    // Connect each commune to Athis
    for (const c of communes) {
        if (c === athis) continue;
        G.drawPath(map, athis.cx, athis.cy, c.cx, c.cy);
    }
    // A few extra connections
    G.drawPath(map, DATA.COMMUNES.carneille.cx, DATA.COMMUNES.carneille.cy,
               DATA.COMMUNES.ronfeugerai.cx, DATA.COMMUNES.ronfeugerai.cy);
    G.drawPath(map, DATA.COMMUNES.breel.cx, DATA.COMMUNES.breel.cy,
               DATA.COMMUNES.tourailles.cx, DATA.COMMUNES.tourailles.cy);
    G.drawPath(map, DATA.COMMUNES.segrie.cx, DATA.COMMUNES.segrie.cy,
               DATA.COMMUNES.ndrocher.cx, DATA.COMMUNES.ndrocher.cy);
};

G.drawPath = function(map, x1,y1, x2,y2) {
    const T = DATA.TILES;
    let x=x1, y=y1;
    while (x!==x2 || y!==y2) {
        if (map[y][x] === T.WATER || map[y][x] === T.DEEP_WATER) {
            map[y][x] = T.BRIDGE;
        } else if (map[y][x] !== T.BRIDGE) {
            map[y][x] = T.PATH;
        }
        // Move toward target with slight bias for more natural paths
        if (Math.abs(x-x2) > Math.abs(y-y2)) {
            x += x<x2 ? 1 : -1;
        } else if (y !== y2) {
            y += y<y2 ? 1 : -1;
        } else {
            x += x<x2 ? 1 : -1;
        }
    }
    map[y2][x2] = T.PATH;
};

G.addVillages = function(map) {
    const T = DATA.TILES;
    for (const [key, c] of Object.entries(DATA.COMMUNES)) {
        const cx=c.cx, cy=c.cy;
        // Small building cluster at each commune center
        // Main building
        G.placeBuilding(map, cx-1, cy-2, 3, 2);
        // Sign post
        if (cy+3 < DATA.MAP_H) map[cy+3][cx] = T.SIGN;
        // Clear area around center
        for (let dy=-1; dy<=1; dy++) {
            for (let dx=-2; dx<=2; dx++) {
                const tx=cx+dx, ty=cy+dy;
                if (tx>=0&&tx<DATA.MAP_W&&ty>=0&&ty<DATA.MAP_H) {
                    if (map[ty][tx]===T.TREE||map[ty][tx]===T.DENSE_TREE||map[ty][tx]===T.ROCK||map[ty][tx]===T.BUSH) {
                        map[ty][tx] = T.GRASS;
                    }
                }
            }
        }
        // Paths around center
        for (let dx=-3;dx<=3;dx++) {
            const tx=cx+dx;
            if (tx>=0&&tx<DATA.MAP_W&&cy+2<DATA.MAP_H) {
                if (map[cy+2][tx]!==T.WATER&&map[cy+2][tx]!==T.DEEP_WATER)
                    map[cy+2][tx] = T.PATH;
            }
        }
    }
    // Athis special: garden plots
    const ac = DATA.COMMUNES.athis;
    for (let dy=0; dy<2; dy++) {
        for (let dx=0; dx<4; dx++) {
            const gx=ac.cx-5+dx, gy=ac.cy+4+dy;
            if (gx>=0&&gx<DATA.MAP_W&&gy>=0&&gy<DATA.MAP_H) {
                map[gy][gx] = T.GARDEN_SOIL;
            }
        }
    }
    // Fence around garden
    for (let dx=-1;dx<=4;dx++) {
        const gx=ac.cx-5+dx;
        const gy1=ac.cy+3, gy2=ac.cy+6;
        if (gx>=0&&gx<DATA.MAP_W) {
            if (gy1>=0&&gy1<DATA.MAP_H&&map[gy1][gx]!==T.PATH) map[gy1][gx]=T.FENCE;
            if (gy2>=0&&gy2<DATA.MAP_H) map[gy2][gx]=T.FENCE;
        }
    }
    for (let dy=0;dy<=2;dy++) {
        const gy=ac.cy+3+dy;
        const gx1=ac.cx-6, gx2=ac.cx-1;
        if (gy>=0&&gy<DATA.MAP_H) {
            if (gx1>=0) map[gy][gx1]=T.FENCE;
            if (gx2<DATA.MAP_W) map[gy][gx2]=T.FENCE;
        }
    }

    // Well at Athis
    if (ac.cy+1<DATA.MAP_H && ac.cx+3<DATA.MAP_W) map[ac.cy+1][ac.cx+3] = T.WELL;

    // Chapel at ND-Rocher
    const nd = DATA.COMMUNES.ndrocher;
    G.placeBuilding(map, nd.cx+2, nd.cy-2, 3, 3);
    if (nd.cy-3>=0 && nd.cx+3<DATA.MAP_W) map[nd.cy-3][nd.cx+3] = T.CHAPEL;
};

G.placeBuilding = function(map, bx, by, w, h) {
    const T = DATA.TILES;
    for (let dy=0; dy<h; dy++) {
        for (let dx=0; dx<w; dx++) {
            const tx=bx+dx, ty=by+dy;
            if (tx>=0&&tx<DATA.MAP_W&&ty>=0&&ty<DATA.MAP_H) {
                if (dy===0) map[ty][tx] = T.ROOF_RED;
                else if (dy===h-1 && dx===Math.floor(w/2)) map[ty][tx] = T.DOOR;
                else map[ty][tx] = T.WALL;
            }
        }
    }
};

// --- Default state factory ---
G.defaultState = function() {
    const ac = DATA.COMMUNES.athis;
    const gardenPlots = [];
    for (let dy=0;dy<2;dy++) {
        for (let dx=0;dx<4;dx++) {
            gardenPlots.push({
                x: ac.cx-5+dx, y: ac.cy+4+dy,
                crop: null, stage: 0, waterCount: 0, turnsGrown: 0
            });
        }
    }
    // Init NPCs with world positions
    const npcs = DATA.NPCS.map(n => {
        const c = DATA.COMMUNES[n.commune];
        return { ...n, x: c.cx + n.rx, y: c.cy + n.ry, talked: false, gaveLoot: false };
    });

    return {
        player: { x: ac.cx, y: ac.cy+1, dir: 'down' },
        map: G.generateMap(),
        placedBuildings: [],
        garden: { plots: gardenPlots },
        inventory: {},
        quests: DATA.QUESTS.map(q => ({id:q.id, status:'available'})),
        npcs: npcs,
        wildlife: [],
        resources: [],
        turn: 0,
        season: 'printemps',
        happiness: 0,
        villagers: 3,
        visitedCommunes: ['athis'],
        observedAnimals: [],
        harvestedCrops: [],
        totalHarvests: 0,
        totalBuildings: 0,
        arrivalIndex: 0,
        ui: {
            screen: 'title',
            menu: null,
            dialogue: null,
            notification: null,
            buildMode: false,
            menuIndex: 0,
            gardenIndex: 0,
            gardenMode: null,
            cropSelect: 0,
        },
        particles: [],
        relationships: {},
        feteActive: false,
        feteInvited: [],
        fetePhase: null,
        feteTimer: 0,
        feteSeeds: false,
    };
};

// --- Save / Load ---
G.save = function() {
    try {
        const s = {...G.state};
        s.particles = [];
        s.wildlife = [];
        localStorage.setItem('athis_save', JSON.stringify(s));
    } catch(e) { console.warn('Save failed', e); }
};

G.load = function() {
    try {
        const raw = localStorage.getItem('athis_save');
        if (!raw) return null;
        const s = JSON.parse(raw);
        // Regenerate map (not saved to save space)
        // Actually we do save it since it's modified by buildings
        return s;
    } catch(e) { console.warn('Load failed', e); return null; }
};

G.hasSave = function() {
    return !!localStorage.getItem('athis_save');
};
