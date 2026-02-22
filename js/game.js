// ============================================================
//  GAME.JS — Boucle principale, input, initialisation
// ============================================================

// --- Cheat code buffer ---
G._cheatBuf = '';
G._cheatTimer = 0;

// --- Input handling ---
G.setupInput = function() {
    document.addEventListener('keydown', e => {
        G.keys[e.key] = true;
        G.handleKey(e.key, e);
    });
    document.addEventListener('keyup', e => {
        G.keys[e.key] = false;
        G.state.player.moving = false;
    });
    G.canvas.addEventListener('mousemove', e => {
        const rect = G.canvas.getBoundingClientRect();
        G.mouse.x = (e.clientX - rect.left) * (G.W / rect.width);
        G.mouse.y = (e.clientY - rect.top) * (G.H / rect.height);
    });
    G.canvas.addEventListener('click', e => {
        const rect = G.canvas.getBoundingClientRect();
        G.mouse.x = (e.clientX - rect.left) * (G.W / rect.width);
        G.mouse.y = (e.clientY - rect.top) * (G.H / rect.height);
        G.handleClick();
    });
};

G.handleKey = function(key, e) {
    const s = G.state;
    if (!s) return;

    // Title screen
    if (s.ui.screen === 'title') {
        if (key === 'Enter' || key === ' ') {
            G.startNewGame();
            e && e.preventDefault();
        }
        return;
    }

    // Victory screen
    if (s.ui.screen === 'victory') {
        if (key === 'Enter' || key === ' ') {
            G.startNewGame();
            e && e.preventDefault();
        }
        return;
    }

    // Animation fete : bloquer les touches
    if (s.fetePhase === 'animation') {
        e && e.preventDefault();
        return;
    }

    // Dialogue
    if (s.ui.dialogue) {
        if (key === ' ' || key === 'Enter') {
            G.advanceDialogue();
            e && e.preventDefault();
        }
        return;
    }

    // Seed selection submenu
    if (s.ui.menu === 'garden' && s.ui.gardenMode === 'plant') {
        const seeds = Object.entries(s.inventory).filter(([k,v]) => v>0 && k.startsWith('graine_'));
        if (key === 'ArrowUp' || key === 'z') {
            s.ui.cropSelect = Math.max(0, s.ui.cropSelect - 1);
        } else if (key === 'ArrowDown' || key === 's') {
            s.ui.cropSelect = Math.min(seeds.length - 1, s.ui.cropSelect + 1);
        } else if (key === ' ' || key === 'Enter') {
            if (seeds.length > 0 && seeds[s.ui.cropSelect]) {
                G.plantSeed(s.ui.gardenIndex, seeds[s.ui.cropSelect][0]);
                s.ui.gardenMode = null;
            }
            e && e.preventDefault();
        } else if (key === 'Escape') {
            s.ui.gardenMode = null;
        }
        return;
    }

    // Menus
    if (s.ui.menu) {
        if (key === 'Escape') {
            s.ui.menu = null;
            s.ui.gardenMode = null;
        } else if (s.ui.menu === 'build') {
            const entries = Object.entries(DATA.BUILDINGS);
            if (key === 'ArrowUp' || key === 'z') s.ui.menuIndex = Math.max(0, s.ui.menuIndex-1);
            if (key === 'ArrowDown' || key === 's') s.ui.menuIndex = Math.min(entries.length-1, s.ui.menuIndex+1);
            if (key === ' ' || key === 'Enter') {
                const [typeKey] = entries[s.ui.menuIndex] || [];
                if (typeKey) {
                    G.buildStructure(typeKey);
                    s.ui.menu = null;
                }
                e && e.preventDefault();
            }
        } else if (s.ui.menu === 'garden') {
            if (key === 'ArrowLeft' || key === 'q') s.ui.gardenIndex = Math.max(0, s.ui.gardenIndex-1);
            if (key === 'ArrowRight' || key === 'd') s.ui.gardenIndex = Math.min(s.garden.plots.length-1, s.ui.gardenIndex+1);
            if (key === 'ArrowUp' || key === 'z') s.ui.gardenIndex = Math.max(0, s.ui.gardenIndex-4);
            if (key === 'ArrowDown' || key === 's') s.ui.gardenIndex = Math.min(s.garden.plots.length-1, s.ui.gardenIndex+4);
            if (key === ' ' || key === 'Enter') {
                const p = s.garden.plots[s.ui.gardenIndex];
                if (p) {
                    if (!p.crop) {
                        s.ui.gardenMode = 'plant';
                        s.ui.cropSelect = 0;
                    } else if (p.stage >= 5) {
                        G.harvestPlot(s.ui.gardenIndex);
                    } else {
                        G.waterPlot(s.ui.gardenIndex);
                    }
                }
                e && e.preventDefault();
            }
        } else if (s.ui.menu === 'inventory') {
            const items = Object.entries(s.inventory).filter(([k,v])=>v>0);
            const maxVis = 14;
            if (!s.ui.inventoryScroll) s.ui.inventoryScroll = 0;
            if (key === 'ArrowUp' || key === 'z') {
                s.ui.menuIndex = Math.max(0, s.ui.menuIndex-1);
                if (s.ui.menuIndex < s.ui.inventoryScroll) s.ui.inventoryScroll = s.ui.menuIndex;
            }
            if (key === 'ArrowDown' || key === 's') {
                s.ui.menuIndex = Math.min(items.length-1, s.ui.menuIndex+1);
                if (s.ui.menuIndex >= s.ui.inventoryScroll+maxVis) s.ui.inventoryScroll = s.ui.menuIndex-maxVis+1;
            }
        }
        if (e) e.preventDefault();
        return;
    }

    // Cheat code detection: type "fete" quickly
    if (key.length === 1 && key.match(/[a-z]/i)) {
        const now = Date.now();
        if (now - G._cheatTimer > 2000) G._cheatBuf = '';
        G._cheatTimer = now;
        G._cheatBuf += key.toLowerCase();
        if (G._cheatBuf.length > 10) G._cheatBuf = G._cheatBuf.slice(-10);
        if (G._cheatBuf.endsWith('fete') && !s.feteActive) {
            G.cheatSkipToFete();
            G._cheatBuf = '';
            return;
        }
    }

    // Game keys
    switch(key) {
        case ' ':
        case 'Enter':
            G.interact();
            e && e.preventDefault();
            break;
        case 'i': case 'I':
            s.ui.menu = 'inventory'; s.ui.menuIndex = 0; break;
        case 'j': case 'J':
            s.ui.menu = 'quests'; break;
        case 'b': case 'B':
            s.ui.menu = 'build'; s.ui.menuIndex = 0; break;
        case 'g': case 'G':
            if (G.playerOnGarden()) {
                const idx = G.getPlayerGardenPlot();
                s.ui.menu = 'garden'; s.ui.gardenIndex = idx >= 0 ? idx : 0; s.ui.gardenMode = null;
            } else {
                G.notify('Rendez-vous au potager pour jardiner!');
            }
            break;
        case 'm': case 'M':
            s.ui.menu = 'map'; break;
        case 'r': case 'R':
            s.ui.menu = 'relations'; break;
    }
};

G.handleClick = function() {
    const s = G.state;
    if (!s) return;

    if (s.ui.screen === 'title') {
        const w = G.W, h = G.H;
        // Nouvelle Partie button
        if (G.mouse.y > h*0.4-22 && G.mouse.y < h*0.4+22 && G.mouse.x > w/2-120 && G.mouse.x < w/2+120) {
            G.startNewGame();
            return;
        }
        // Continuer button
        if (G.hasSave() && G.mouse.y > h*0.4+33 && G.mouse.y < h*0.4+77 && G.mouse.x > w/2-120 && G.mouse.x < w/2+120) {
            G.loadAndContinue();
            return;
        }
    }

    if (s.ui.screen === 'victory') {
        const w = G.W, h = G.H;
        // Bouton Rejouer
        const btnX = w/2-120, btnY = h*0.72, btnW = 240, btnH = 50;
        if (G.mouse.x > btnX && G.mouse.x < btnX+btnW && G.mouse.y > btnY && G.mouse.y < btnY+btnH) {
            G.startNewGame();
            return;
        }
    }
};

// --- Camera ---
G.updateCamera = function() {
    const s = G.state;
    const targetX = s.player.x * G.TILE - G.W/2 + G.TILE/2;
    const targetY = s.player.y * G.TILE - G.H/2 + G.TILE/2;
    if (!s.camera) s.camera = {x: targetX, y: targetY};
    s.camera.x = G.lerp(s.camera.x, targetX, 0.15);
    s.camera.y = G.lerp(s.camera.y, targetY, 0.15);
    s.camera.x = G.clamp(s.camera.x, 0, DATA.MAP_W*G.TILE - G.W);
    s.camera.y = G.clamp(s.camera.y, 0, DATA.MAP_H*G.TILE - G.H);
};

// --- Main update ---
G.update = function(dt) {
    const s = G.state;
    if (!s || (s.ui.screen !== 'game' && s.ui.screen !== 'victory')) return;

    // Animation de la fete : bloquer le mouvement
    if (s.fetePhase === 'animation') {
        G.updateFeteAnimation(dt);
        G.updateCamera();
        G.updateParticles(dt);
        // Notification timer
        if (G.notifTimer > 0) {
            G.notifTimer -= dt;
            if (G.notifTimer <= 0) G.notifTimer = 0;
        }
        return;
    }

    // Movement with held keys
    const now = performance.now();
    if (now - G.lastMove > 130) {
        let dx=0, dy=0;
        if (G.keys['ArrowLeft'] || G.keys['q'] || G.keys['a']) dx=-1;
        else if (G.keys['ArrowRight'] || G.keys['d']) dx=1;
        else if (G.keys['ArrowUp'] || G.keys['z'] || G.keys['w']) dy=-1;
        else if (G.keys['ArrowDown'] || G.keys['s']) dy=1;

        if ((dx||dy) && !s.ui.menu && !s.ui.dialogue) {
            G.movePlayer(dx, dy);
            G.lastMove = now;
            G.playerBounce = 1; // trigger bounce
        }
    }
    // Decay bounce
    if (G.playerBounce > 0) G.playerBounce = Math.max(0, G.playerBounce - 6 * (1/60));

    G.updateCamera();
    G.updateWildlife(dt);
    G.updateParticles(dt);
    G.spawnParticles();

    // Notification timer
    if (G.notifTimer > 0) {
        G.notifTimer -= dt;
        if (G.notifTimer <= 0) {
            G.notifTimer = 0;
        }
    }
};

// --- Game loop ---
G.lastTime = 0;
G.gameLoop = function(timestamp) {
    const dt = Math.min((timestamp - G.lastTime) / 1000, 0.1);
    G.lastTime = timestamp;
    G.animTime += dt;

    G.update(dt);

    // Render
    G.ctx.clearRect(0, 0, G.W, G.H);

    if (G.state.ui.screen === 'title') {
        G.renderTitleScreen();
    } else if (G.state.ui.screen === 'victory') {
        G.renderVictoryScreen();
    } else {
        G.renderGame();
        G.renderDialogue();
        G.renderMenu();
        G.renderHUD();
        G.renderNotification();
    }

    requestAnimationFrame(G.gameLoop);
};

// --- Start new game ---
G.startNewGame = function() {
    G.state = G.defaultState();
    G.state.ui.screen = 'game';
    G.placeResources();
    G.spawnWildlife();
    // Center camera immediately
    G.state.camera = {
        x: G.state.player.x * G.TILE - G.W/2 + G.TILE/2,
        y: G.state.player.y * G.TILE - G.H/2 + G.TILE/2,
    };
    // Welcome notification
    setTimeout(() => {
        G.notify('Bienvenue! Parlez au Maire (!) pour commencer.', 6);
    }, 500);
};

// --- Load and continue ---
G.loadAndContinue = function() {
    const saved = G.load();
    if (saved) {
        G.state = saved;
        G.state.ui.screen = 'game';
        G.state.ui.menu = null;
        G.state.ui.dialogue = null;
        G.state.particles = [];
        // Backward compat: fete state fields
        if (G.state.feteActive === undefined) G.state.feteActive = false;
        if (!G.state.feteInvited) G.state.feteInvited = [];
        if (G.state.fetePhase === undefined) G.state.fetePhase = null;
        if (G.state.feteTimer === undefined) G.state.feteTimer = 0;
        if (!G.state.relationships) G.state.relationships = {};
        // Regenerate wildlife
        G.spawnWildlife();
        // Re-place resources if missing
        if (!G.state.resources || G.state.resources.length === 0) {
            G.placeResources();
        }
        // Ensure camera exists
        if (!G.state.camera) {
            G.state.camera = {
                x: G.state.player.x * G.TILE - G.W/2,
                y: G.state.player.y * G.TILE - G.H/2,
            };
        }
        G.notify('Partie chargée !', 3);
    } else {
        G.startNewGame();
    }
};

// --- Cheat: skip to Fete du Village ---
G.cheatSkipToFete = function() {
    const s = G.state;

    // Mark all non-final quests as completed
    for (const q of s.quests) {
        const qd = DATA.QUESTS.find(x => x.id === q.id);
        if (qd && !qd.isFinal) q.status = 'completed';
    }

    // Set villagers to goal
    s.villagers = DATA.GOAL_VILLAGERS;
    s.happiness = 500;
    s.totalBuildings = 10;
    s.totalHarvests = 30;
    s.arrivalIndex = 99;

    // Visit all communes
    s.visitedCommunes = Object.keys(DATA.COMMUNES);

    // All crop types harvested
    s.harvestedCrops = Object.keys(DATA.CROPS);

    // Observe enough animals
    s.observedAnimals = Object.keys(DATA.WILDLIFE).slice(0, 5);

    // Mark all NPCs as talked
    for (const npc of s.npcs) {
        npc.talked = true;
        npc.gaveLoot = true;
    }

    // Activate the fete
    s.feteActive = true;
    s.fetePhase = 'gather';
    s.feteInvited = [];
    s.feteSeeds = false;

    // Replace quests list to include fete
    const hasFete = s.quests.some(q => q.id === 'fete');
    if (!hasFete) {
        s.quests.push({ id: 'fete', status: 'available' });
    }

    // Close any open menus
    s.ui.menu = null;
    s.ui.dialogue = null;

    G.notify('CHEAT: Fete du Village activee! Parlez au Maire.', 7);
};

// --- Init ---
G.init = function() {
    G.canvas = document.getElementById('game-canvas');
    G.ctx = G.canvas.getContext('2d');
    G.canvas.width = G.W;
    G.canvas.height = G.H;

    // Check roundRect support (polyfill for older browsers)
    if (!G.ctx.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function(x,y,w,h,r) {
            if (typeof r === 'number') r = {tl:r,tr:r,br:r,bl:r};
            this.moveTo(x+r.tl, y);
            this.lineTo(x+w-r.tr, y);
            this.quadraticCurveTo(x+w, y, x+w, y+r.tr);
            this.lineTo(x+w, y+h-r.br);
            this.quadraticCurveTo(x+w, y+h, x+w-r.br, y+h);
            this.lineTo(x+r.bl, y+h);
            this.quadraticCurveTo(x, y+h, x, y+h-r.bl);
            this.lineTo(x, y+r.tl);
            this.quadraticCurveTo(x, y, x+r.tl, y);
            this.closePath();
            return this;
        };
    }

    G.state = G.defaultState(); // Start at title screen
    G.setupInput();

    // Start loop
    G.lastTime = performance.now();
    requestAnimationFrame(G.gameLoop);
};

// --- Launch ---
window.addEventListener('load', G.init);
