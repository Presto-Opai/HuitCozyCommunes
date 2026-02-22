// ============================================================
//  SYSTEMS.JS — Systemes de jeu (jardin, construction, quetes...)
// ============================================================

// --- Inventory helpers ---
G.addItem = function(key, qty) {
    if (!G.state.inventory[key]) G.state.inventory[key] = 0;
    G.state.inventory[key] += qty;
};

G.removeItem = function(key, qty) {
    if (!G.state.inventory[key]) return false;
    if (G.state.inventory[key] < qty) return false;
    G.state.inventory[key] -= qty;
    if (G.state.inventory[key] <= 0) delete G.state.inventory[key];
    return true;
};

G.hasItem = function(key, qty) {
    return (G.state.inventory[key]||0) >= qty;
};

// --- Notification ---
G.notify = function(text, duration) {
    G.state.ui.notification = text;
    G.notifTimer = duration || 3;
};

// --- Turn system ---
G.advanceTurn = function() {
    const s = G.state;
    s.turn++;
    const seasonIdx = Math.floor(s.turn / DATA.TURNS_PER_SEASON) % 4;
    s.season = DATA.SEASONS[seasonIdx];
    G.updateGarden();
    G.updateBuildingProduction();
    G.checkQuests();
    if (s.turn % 10 === 0) G.checkNewVillagers();
    if (s.turn % 20 === 0) G.respawnResources();
    if (s.turn % 10 === 0) G.save();
};

// --- Garden system (avec waterCount) ---
G.updateGarden = function() {
    const s = G.state;
    if (s.season === 'hiver') return; // Rien ne pousse en hiver
    for (const p of s.garden.plots) {
        if (!p.crop || p.stage >= 5) continue;
        const crop = DATA.CROPS[p.crop];
        if (!crop) continue;
        const needed = crop.waterPerStage || 1;
        if ((p.waterCount || 0) >= needed) {
            p.turnsGrown = (p.turnsGrown||0) + 1;
            if (p.turnsGrown >= crop.growTime) {
                p.stage = Math.min(p.stage + 1, 5);
                p.turnsGrown = 0;
                p.waterCount = 0;
            }
        }
    }
};

G.plantSeed = function(plotIdx, seedKey) {
    const s = G.state;
    const plot = s.garden.plots[plotIdx];
    if (!plot || plot.crop) return false;
    const item = DATA.ITEMS[seedKey];
    if (!item || !item.crop) return false;
    if (!G.hasItem(seedKey, 1)) return false;
    const crop = DATA.CROPS[item.crop];
    // Verif saison stricte
    if (crop && crop.season && !crop.season.includes(s.season)) {
        const seasonsFr = { printemps: 'Printemps', ete: 'Été', automne: 'Automne', hiver: 'Hiver' };
        const saisonsDisplay = crop.season.map(ss => seasonsFr[ss] || ss).join(', ');
        G.notify(`Les ${crop.name} ne poussent qu'en ${saisonsDisplay}.`);
        return false;
    }
    if (s.season === 'hiver') {
        G.notify('On ne peut pas planter en hiver !');
        return false;
    }
    G.removeItem(seedKey, 1);
    plot.crop = item.crop;
    plot.stage = 1;
    plot.waterCount = 0;
    plot.turnsGrown = 0;
    G.advanceTurn();
    G.notify(`${crop.name} plantées !`);
    return true;
};

G.waterPlot = function(plotIdx) {
    const s = G.state;
    const plot = s.garden.plots[plotIdx];
    if (!plot || !plot.crop || plot.stage >= 5) return false;
    const crop = DATA.CROPS[plot.crop];
    const needed = crop ? (crop.waterPerStage||1) : 1;
    const current = plot.waterCount || 0;
    if (current >= needed) {
        G.notify('Déjà bien arrosé pour ce stade !');
        return false;
    }
    plot.waterCount = current + 1;
    // Compost bonus: high happiness gives a chance to double-water
    const compostBonus = s.happiness >= 20 && Math.random() < 0.18;
    if (compostBonus && plot.waterCount < needed) {
        plot.waterCount++;
        G.notify(`Arrosé ! Le compost aide (+1 bonus) (${plot.waterCount}/${needed}) ✿`);
    } else if (plot.waterCount >= needed) {
        G.notify(`Arrosé ! (${plot.waterCount}/${needed})`);
    } else {
        G.notify(`Arrosé (${plot.waterCount}/${needed})`);
    }
    G.advanceTurn();
    return true;
};

G.harvestPlot = function(plotIdx) {
    const s = G.state;
    const plot = s.garden.plots[plotIdx];
    if (!plot || !plot.crop || plot.stage < 5) return false;
    const cropKey = plot.crop;
    const crop = DATA.CROPS[cropKey];
    G.addItem(cropKey, 2);
    const seedKey = Object.keys(DATA.ITEMS).find(k => DATA.ITEMS[k].crop === cropKey);
    if (seedKey && Math.random() > 0.35) G.addItem(seedKey, 1);
    if (!s.harvestedCrops.includes(cropKey)) s.harvestedCrops.push(cropKey);
    s.totalHarvests++;
    plot.crop = null;
    plot.stage = 0;
    plot.waterCount = 0;
    plot.turnsGrown = 0;
    G.advanceTurn();
    G.notify(`Récolte : ${crop.name} x2 !`);
    return true;
};

// --- Joueur est-il sur le potager ? ---
G.playerOnGarden = function() {
    const s = G.state;
    return s.garden.plots.some(p => p.x === s.player.x && p.y === s.player.y);
};

G.getPlayerGardenPlot = function() {
    const s = G.state;
    return s.garden.plots.findIndex(p => p.x === s.player.x && p.y === s.player.y);
};

// --- Building system ---
G.isBuildingUnlocked = function(typeKey) {
    const b = DATA.BUILDINGS[typeKey];
    if (!b) return false;
    const s = G.state;
    if (b.requires) {
        if (b.requires.happiness && s.happiness < b.requires.happiness) return false;
        if (b.requires.buildings && s.totalBuildings < b.requires.buildings) return false;
        if (b.requires.built_one_of) {
            const built = b.requires.built_one_of.some(bt =>
                s.placedBuildings.some(p => p.type === bt));
            if (!built) return false;
        }
    }
    return true;
};

G.canBuild = function(typeKey) {
    const b = DATA.BUILDINGS[typeKey];
    if (!b) return false;
    if (!G.isBuildingUnlocked(typeKey)) return false;
    for (const [res, qty] of Object.entries(b.cost)) {
        if (!G.hasItem(res, qty)) return false;
    }
    return true;
};

G.hasBuildingAt = function(x, y) {
    return G.state.placedBuildings.some(b => b.x === x && b.y === y);
};

G.buildStructure = function(typeKey) {
    const s = G.state;
    const b = DATA.BUILDINGS[typeKey];
    if (!b) { G.notify('Bâtiment inconnu !'); return false; }
    if (!G.isBuildingUnlocked(typeKey)) {
        G.notify('Ce bâtiment n\'est pas encore débloqué !');
        return false;
    }
    if (!G.canBuild(typeKey)) {
        G.notify('Pas assez de matériaux !');
        return false;
    }
    // Trouver la case devant le joueur
    const dirs = {up:{dx:0,dy:-1},down:{dx:0,dy:1},left:{dx:-1,dy:0},right:{dx:1,dy:0}};
    const d = dirs[s.player.dir] || {dx:0,dy:1};
    let bx = s.player.x + d.dx;
    let by = s.player.y + d.dy;
    const T = DATA.TILES;

    // Verifier que la case est valide
    const tryPlace = (x, y) => {
        if (x<0||x>=DATA.MAP_W||y<0||y>=DATA.MAP_H) return false;
        if (!DATA.WALKABLE.has(s.map[y][x])) return false;
        if (s.map[y][x]===T.GARDEN_SOIL) return false;
        if (G.hasBuildingAt(x, y)) return false;
        return true;
    };

    if (!tryPlace(bx, by)) {
        // Essayer les autres directions
        let found = false;
        for (const dd of [{dx:0,dy:1},{dx:0,dy:-1},{dx:1,dy:0},{dx:-1,dy:0}]) {
            const tx=s.player.x+dd.dx, ty=s.player.y+dd.dy;
            if (tryPlace(tx, ty)) { bx=tx; by=ty; found=true; break; }
        }
        if (!found) {
            G.notify('Pas de place pour construire ici!');
            return false;
        }
    }

    // Deduire le cout
    for (const [res, qty] of Object.entries(b.cost)) G.removeItem(res, qty);
    s.placedBuildings.push({type: typeKey, x: bx, y: by, builtTurn: s.turn});
    if (typeKey==='bike_path') s.map[by][bx] = T.BIKE_PATH;
    else if (typeKey==='bench') s.map[by][bx] = T.BENCH;
    s.happiness += b.happiness;
    s.totalBuildings++;
    G.advanceTurn();
    G.notify(`${b.name} construit(e) ! Bonheur +${b.happiness}`);
    return true;
};

// --- Production des batiments ---
G.updateBuildingProduction = function() {
    const s = G.state;
    for (const b of (s.placedBuildings||[])) {
        const bd = DATA.BUILDINGS[b.type];
        if (!bd || !bd.produces || !bd.produceTurns) continue;
        const age = s.turn - (b.builtTurn||0);
        if (age > 0 && age % bd.produceTurns === 0) {
            let produced = [];
            for (const [item, qty] of Object.entries(bd.produces)) {
                G.addItem(item, qty);
                produced.push(`${DATA.ITEMS[item]?.name||item} x${qty}`);
            }
            G.notify(`${bd.name} produit: ${produced.join(', ')}`, 3);
        }
    }
};

// --- Quest system ---
G.checkQuests = function() {
    const s = G.state;
    for (const q of s.quests) {
        if (q.status === 'completed' || q.status === 'locked') continue;
        const qd = DATA.QUESTS.find(x => x.id === q.id);
        if (!qd) continue;

        let done = false;
        switch(qd.type) {
            case 'talk': {
                const npc = s.npcs.find(n => n.id === qd.target);
                if (npc && npc.talked) done = true;
                break;
            }
            case 'harvest':
                done = s.totalHarvests >= qd.target;
                break;
            case 'visit_all':
                done = s.visitedCommunes.length >= 8;
                break;
            case 'build':
                done = s.placedBuildings.some(b => b.type === qd.target);
                break;
            case 'harvest_types':
                done = s.harvestedCrops.length >= qd.target;
                break;
            case 'observe':
                done = s.observedAnimals.length >= qd.target;
                break;
            case 'observe_species':
                done = s.observedAnimals.includes(qd.target);
                break;
            case 'build_count':
                done = s.totalBuildings >= qd.target;
                break;
            case 'happiness':
                done = s.happiness >= qd.target;
                break;
            case 'collect_item':
                done = G.hasItem(qd.item, qd.qty);
                break;
            case 'fete_finale':
                // Geree manuellement via interactNPC avec le maire
                break;
        }

        if (done && q.status !== 'completed') {
            q.status = 'completed';
            if (qd.reward) {
                if (qd.reward.happiness) s.happiness += qd.reward.happiness;
                if (qd.reward.villagers) s.villagers += qd.reward.villagers;
                if (qd.reward.items) {
                    for (const [k,v] of Object.entries(qd.reward.items)) G.addItem(k,v);
                }
            }
            G.notify(`Quête terminée : ${qd.name} !`, 5);
            // Unlock chained quests
            if (qd.unlocks) {
                for (const uid of qd.unlocks) {
                    const uq = s.quests.find(q2 => q2.id === uid);
                    if (uq && uq.status === 'locked') {
                        uq.status = 'available';
                        setTimeout(() => G.notify(`Nouvelle quête disponible !`, 4), 1200);
                    }
                }
            }
        }
    }
    // Verifier si la quete finale est debloquee
    G.checkFinalQuestUnlock();
};

G.checkFinalQuestUnlock = function() {
    const s = G.state;
    const nonFinal = s.quests.filter(q => {
        const qd = DATA.QUESTS.find(x => x.id === q.id);
        return qd && !qd.isFinal && q.status !== 'locked';
    });
    const allDone = nonFinal.length > 0 && nonFinal.every(q => q.status === 'completed');
    if (allDone && !s._feteUnlocked) {
        s._feteUnlocked = true;
        G.notify('Toutes les quêtes sont terminées ! Objectif final : La Grande Fête !', 7);
    }
};

// --- Relationship system ---
G.getFriendship = function(npcId) {
    const rel = G.state.relationships;
    if (!rel[npcId]) rel[npcId] = { level: 0, trades: 0, giftGiven: false };
    return rel[npcId];
};

G.raiseFriendship = function(npc) {
    const s = G.state;
    const rel = G.getFriendship(npc.id);
    rel.trades++;
    const prev = rel.level;
    if (rel.trades >= 8) rel.level = 3;
    else if (rel.trades >= 4) rel.level = 2;
    else if (rel.trades >= 1) rel.level = 1;

    // Emit heart particles at NPC position
    G.emitHearts(npc.x, npc.y);

    // Friendship level-up gift
    if (rel.level > prev) {
        const labels = ['','Connaissance ♡','Ami(e) ♥','Meilleur(e) ami(e) ♥♥'];
        G.notify(`${npc.name.split(' ')[0]} : ${labels[rel.level]}`, 4);
        if (rel.level === 2 && !rel.giftGiven && npc.friendship_gift) {
            rel.giftGiven = true;
            for (const [k,v] of Object.entries(npc.friendship_gift)) G.addItem(k, v);
            const giftStr = Object.entries(npc.friendship_gift)
                .map(([k,v]) => `${DATA.ITEMS[k]?.name||k} x${v}`).join(', ');
            // Schedule a special dialogue after current one (queue via setTimeout trick)
            setTimeout(() => {
                G.state.ui.dialogue = {
                    name: npc.name,
                    lines: [
                        'Vous savez... vous êtes vraiment quelqu\'un de bien.',
                        'Tenez, un petit cadeau pour vous remercier de votre amitié.',
                        `[Cadeau d'amitié: ${giftStr}]`,
                    ],
                    index: 0, npcId: npc.id,
                    color: npc.color, hair: npc.hair,
                    friendship: rel.level,
                };
            }, 800);
        }
    }
};

G.emitHearts = function(wx, wy) {
    const s = G.state;
    if (!s.camera) return;
    const cam = s.camera;
    const ts = G.TILE;
    const sx = (wx - cam.x/ts) * ts + ts/2;
    const sy = (wy - cam.y/ts) * ts;
    const colors = ['#FF6B8A','#FF9BAA','#FFB3C1','#FFD700'];
    for (let i = 0; i < 7; i++) {
        s.particles.push({
            sx: sx + (Math.random()-0.5)*22,
            sy: sy - 5,
            vx: (Math.random()-0.5)*18,
            vy: -(25+Math.random()*20),
            life: 1.0,
            decay: 0.55 + Math.random()*0.35,
            size: 5+Math.random()*4,
            color: colors[Math.floor(Math.random()*colors.length)],
            isHeart: true,
        });
    }
};

// --- Pick NPC re-visit dialogue ---
G.pickRevisitLine = function(npc) {
    const s = G.state;
    const rel = G.getFriendship(npc.id);
    // Friend quips at friendship level >= 2 (30% chance)
    if (rel.level >= 2 && npc.friend_quips && npc.friend_quips.length && Math.random() < 0.3) {
        return npc.friend_quips[Math.floor(Math.random() * npc.friend_quips.length)];
    }
    // Seasonal line
    if (npc.seasonal && npc.seasonal[s.season]) {
        if (Math.random() < 0.45) return npc.seasonal[s.season];
    }
    // Quips rotation
    if (npc.quips && npc.quips.length) {
        const idx = rel.trades % npc.quips.length;
        return npc.quips[idx];
    }
    return npc.dialogue[0] || 'Bonjour!';
};

// --- NPC interaction (avec echange) ---
G.interactNPC = function(npc) {
    const s = G.state;

    // --- Mode fete : invitations et declenchement ---
    if (s.feteActive && s.fetePhase === 'gather') {
        // Parler au Maire quand tout est pret
        if (npc.id === 'maire') {
            // Premiere visite pendant la fete : donner les graines manquantes
            if (!s.feteSeeds) {
                s.feteSeeds = true;
                const seedMap = {
                    'tomate':'graine_t','carotte':'graine_c','salade':'graine_s',
                    'courgette':'graine_co','patate':'graine_p','fraise':'graine_f',
                    'tournesol':'graine_to','citrouille':'graine_ci'
                };
                const gift = {};
                for (const [crop, seedKey] of Object.entries(seedMap)) {
                    const veggiesHave = s.inventory[crop] || 0;
                    const seedsHave = s.inventory[seedKey] || 0;
                    const harvestsNeeded = Math.max(0, Math.ceil((3 - veggiesHave) / 2));
                    const seedsNeeded = Math.max(0, harvestsNeeded - seedsHave);
                    if (seedsNeeded > 0) {
                        G.addItem(seedKey, seedsNeeded);
                        gift[seedKey] = seedsNeeded;
                    }
                }
                const giftEntries = Object.entries(gift);
                const lines = [
                    'La fete approche! Il va falloir un sacre festin.',
                    'Cultivez 3 de chaque legume et invitez tous les habitants!',
                    'Pas besoin de m\'inviter, je serai la de toute facon!',
                ];
                if (giftEntries.length > 0) {
                    lines.splice(1, 0, 'Voici des graines pour vous aider a preparer tout ca.');
                    const giftStr = giftEntries.map(([k,v]) => `${DATA.ITEMS[k]?.name||k} x${v}`).join(', ');
                    lines.push(`[Recu: ${giftStr}]`);
                } else {
                    lines.splice(1, 0, 'Vous avez deja toutes les graines qu\'il vous faut!');
                }
                s.ui.dialogue = {
                    name: npc.name,
                    lines: lines,
                    index: 0, npcId: npc.id,
                };
                return;
            }

            const cond = G.checkFeteConditions();
            if (cond.ready) {
                // Consommer les legumes (3 de chaque)
                const crops = Object.keys(DATA.CROPS);
                for (const crop of crops) {
                    G.removeItem(crop, 3);
                }
                s.fetePhase = 'animation';
                s.feteTimer = 0;
                // Marquer la quete comme terminee
                const fq = s.quests.find(q => q.id === 'fete');
                if (fq) fq.status = 'completed';
                G.notify('Quete reussie : Fete au Village!', 5);
                s.ui.dialogue = {
                    name: npc.name,
                    lines: ['Magnifique! Tout est pret!', 'Que la fete commence!'],
                    index: 0, npcId: npc.id,
                };
                return;
            } else {
                // Maire dit ce qu'il manque
                const invitableNpcs = DATA.NPCS.filter(n => n.id !== 'maire');
                const invitedCount = s.feteInvited.filter(id => id !== 'maire').length;
                const lines = ['Hmm, il manque encore des choses pour la fete...'];
                if (!cond.veggies) lines.push('Il faut 3 de chaque legume (8 types).');
                if (!cond.npcs) lines.push(`Il faut inviter tous les habitants (${invitedCount}/${invitableNpcs.length}).`);
                if (cond.veggies && cond.npcs) lines.push('Revenez me voir quand tout sera pret!');
                s.ui.dialogue = {
                    name: npc.name,
                    lines: lines,
                    index: 0, npcId: npc.id,
                };
                return;
            }
        }

        // Inviter un NPC pas encore invite (le maire est exclu, on le gere au-dessus)
        if (!s.feteInvited.includes(npc.id)) {
            s.feteInvited.push(npc.id);
            const invitableNpcs = DATA.NPCS.filter(n => n.id !== 'maire');
            const invitedCount = s.feteInvited.filter(id => id !== 'maire').length;
            const remaining = invitableNpcs.length - invitedCount;
            s.ui.dialogue = {
                name: npc.name,
                lines: [
                    'Une fete au village? Quelle bonne idee!',
                    'Comptez sur moi, j\'y serai!',
                    remaining > 0 ? `[Invite! Encore ${remaining} habitant(s) a inviter]` : '[Invite! Tous les habitants sont invites!]',
                ],
                index: 0, npcId: npc.id,
            };
            return;
        } else {
            // Deja invite
            s.ui.dialogue = {
                name: npc.name,
                lines: ['J\'ai hate que la fete commence!'],
                index: 0, npcId: npc.id,
            };
            return;
        }
    }

    // Premier contact : dialogue + cadeaux
    if (!npc.talked) {
        // Donner les items AVANT le dialogue pour qu'ils soient dans l'inventaire
        if (npc.gives) {
            for (const [k,v] of Object.entries(npc.gives)) G.addItem(k,v);
            const giftStr = Object.entries(npc.gives).map(([k,v]) => `${DATA.ITEMS[k]?.name||k} x${v}`).join(', ');
            s.ui.dialogue = {
                name: npc.name,
                lines: [...npc.dialogue, `✓ Cadeau reçu: ${giftStr}`],
                index: 0, npcId: npc.id,
                color: npc.color, hair: npc.hair, friendship: 0,
            };
        } else {
            s.ui.dialogue = {
                name: npc.name,
                lines: [...npc.dialogue],
                index: 0, npcId: npc.id,
                color: npc.color, hair: npc.hair, friendship: 0,
            };
        }
        npc.talked = true;
        npc.gaveLoot = true;
        return;
    }

    // Visites suivantes : proposer l'échange si disponible
    const rel = G.getFriendship(npc.id);
    const greeting = G.pickRevisitLine(npc);

    if (npc.trade) {
        const t = npc.trade;
        if (G.hasItem(t.want, t.wantQty)) {
            G.removeItem(t.want, t.wantQty);
            G.addItem(t.give, t.giveQty);
            if (t.give2) G.addItem(t.give2, t.giveQty2);
            const gotStr = `${DATA.ITEMS[t.give]?.name||t.give} x${t.giveQty}` +
                (t.give2 ? ` + ${DATA.ITEMS[t.give2]?.name||t.give2} x${t.giveQty2}` : '');
            s.ui.dialogue = {
                name: npc.name,
                lines: [t.msg, `✓ Échange: −${DATA.ITEMS[t.want]?.name||t.want} ×${t.wantQty}  →  +${gotStr}`],
                index: 0, npcId: npc.id,
                color: npc.color, hair: npc.hair, friendship: rel.level,
            };
            G.raiseFriendship(npc);
        } else {
            const wantName = DATA.ITEMS[t.want]?.name || t.want;
            const giveName = DATA.ITEMS[t.give]?.name || t.give;
            const noTradeLines = [greeting];
            noTradeLines.push(`Ramenez-moi ${t.wantQty} ${wantName} et je vous donnerai ${t.giveQty} ${giveName}!`);
            s.ui.dialogue = {
                name: npc.name,
                lines: noTradeLines,
                index: 0, npcId: npc.id,
                color: npc.color, hair: npc.hair, friendship: rel.level,
            };
        }
        return;
    }

    // Pas d'échange : bavarder avec un quip
    s.ui.dialogue = {
        name: npc.name,
        lines: [greeting],
        index: 0, npcId: npc.id,
        color: npc.color, hair: npc.hair, friendship: rel.level,
    };
};

G.advanceDialogue = function() {
    const d = G.state.ui.dialogue;
    if (!d) return;
    d.index++;
    if (d.index >= d.lines.length) {
        G.state.ui.dialogue = null;
        G.checkQuests();
    }
};

// --- Wildlife system ---
G.spawnWildlife = function() {
    const s = G.state;
    s.wildlife = [];
    for (const [type, data] of Object.entries(DATA.WILDLIFE)) {
        const count = type==='papillon'?4:type==='lapin'||type==='herisson'?3:2;
        for (let i=0; i<count; i++) {
            const validCommunes = data.communes.includes('all')
                ? Object.keys(DATA.COMMUNES)
                : data.communes;
            const ck = validCommunes[Math.floor(Math.random()*validCommunes.length)];
            const c = DATA.COMMUNES[ck];
            if (!c) continue;
            const wx = c.cx + (Math.random()-0.5)*16;
            const wy = c.cy + (Math.random()-0.5)*12;
            s.wildlife.push({
                type, x: wx, y: wy, tx: wx, ty: wy,
                timer: Math.random()*3, fleeing: false,
            });
        }
    }
};

G.updateWildlife = function(dt) {
    const s = G.state;
    const px = s.player.x, py = s.player.y;
    for (const w of s.wildlife) {
        const wdata = DATA.WILDLIFE[w.type];
        const isDomestic = !!(wdata?.domestic);
        const dToPlayer = G.dist(w.x, w.y, px, py);
        // Auto-observe only for non-domestic animals (domestic need Space press)
        if (dToPlayer < 4 && !s.observedAnimals.includes(w.type) && !isDomestic) {
            s.observedAnimals.push(w.type);
            G.notify(`Vous observez : ${wdata?.name||w.type} !`, 3);
            G.checkQuests();
        }
        // Only non-domestic animals flee
        if (dToPlayer < 2.5 && !isDomestic) {
            const angle = Math.atan2(w.y-py, w.x-px);
            w.tx = w.x + Math.cos(angle)*8;
            w.ty = w.y + Math.sin(angle)*8;
            w.fleeing = true;
        }
        w.timer -= dt;
        if (w.timer <= 0 && !w.fleeing) {
            const wander = isDomestic ? 3 : 6;
            w.tx = w.x + (Math.random()-0.5)*wander;
            w.ty = w.y + (Math.random()-0.5)*wander;
            w.tx = G.clamp(w.tx, 1, DATA.MAP_W-2);
            w.ty = G.clamp(w.ty, 1, DATA.MAP_H-2);
            w.timer = (isDomestic ? 3 : 2) + Math.random()*4;
        }
        const speed = (wdata?.speed||0.3) * dt * 2;
        const dx = w.tx - w.x, dy = w.ty - w.y;
        const d = Math.hypot(dx, dy);
        if (d > 0.1) { w.x += (dx/d)*speed; w.y += (dy/d)*speed; }
        else { w.fleeing = false; }
        w.x = G.clamp(w.x, 0, DATA.MAP_W-1);
        w.y = G.clamp(w.y, 0, DATA.MAP_H-1);
    }
};

// --- Particles ---
G.spawnParticles = function() {
    const s = G.state;
    if (s.particles.length > 30) return;
    if (Math.random() > 0.95) {
        const px = s.camera.x/G.TILE + Math.random()*30;
        const py = s.camera.y/G.TILE + Math.random()*20;
        s.particles.push({
            sx: px*G.TILE - s.camera.x, sy: py*G.TILE - s.camera.y,
            vx: (Math.random()-0.5)*20, vy: -10-Math.random()*20,
            life: 1, decay: 0.3+Math.random()*0.3,
            size: 2+Math.random()*2,
            color: DATA.FLOWER_COLORS[Math.floor(Math.random()*DATA.FLOWER_COLORS.length)],
        });
    }
};

G.updateParticles = function(dt) {
    const s = G.state;
    for (let i=s.particles.length-1; i>=0; i--) {
        const p = s.particles[i];
        p.sx += p.vx*dt; p.sy += p.vy*dt;
        // Hearts float up gently; other particles fall with gravity
        p.vy += (p.isHeart ? 4 : 15) * dt;
        p.life -= p.decay*dt;
        if (p.life <= 0) s.particles.splice(i, 1);
    }
};

// --- New villagers ---
G.ARRIVAL_SEQ = [1,1,1,2,2,3,2,3,2,1,4,1,2,2,3,3,5,1,2,2,1,1,2,2,3,3,2,3,2];

G.checkNewVillagers = function() {
    const s = G.state;
    if (s.feteActive) return; // Plus d'arrivees pendant la fete

    const threshold = s.villagers * 4;
    const needBuildings = Math.max(1, s.villagers - 3);
    const needHappiness = s.happiness < threshold;
    const needMore = s.totalBuildings < needBuildings;

    if (needHappiness || needMore) {
        // Conditions not met — reset sequence
        s.arrivalIndex = 0;
        return;
    }

    // Conditions met — pick count from sequence
    const seq = G.ARRIVAL_SEQ;
    // attractsVillagers bonus from buildings
    let attracts = 0;
    for (const b of (s.placedBuildings||[])) {
        const bd = DATA.BUILDINGS[b.type];
        if (bd && bd.attractsVillagers) attracts += bd.attractsVillagers;
    }
    const attractBonus = Math.min(3, Math.floor(attracts / 2));
    const base = s.arrivalIndex < seq.length ? seq[s.arrivalIndex] : 2;
    const count = base + attractBonus;
    s.arrivalIndex++;
    s.villagers += count;
    if (s.villagers > DATA.GOAL_VILLAGERS) s.villagers = DATA.GOAL_VILLAGERS;

    if (count === 1) {
        G.notify(`Un nouvel habitant s'installe ! (${s.villagers}/${DATA.GOAL_VILLAGERS})`, 5);
    } else {
        G.notify(`${count} nouveaux habitants s'installent ! (${s.villagers}/${DATA.GOAL_VILLAGERS})`, 5);
    }

    // Declenchement de la fete a 100 habitants
    if (s.villagers >= DATA.GOAL_VILLAGERS && !s.feteActive) {
        s.feteActive = true;
        s.fetePhase = 'gather';
        s.quests = [{ id: 'fete', status: 'available' }];
        G.notify('Nouvelle Quete - Fete au Village!', 7);
    }
};

G.getVillagerHint = function() {
    const s = G.state;
    if (s.villagers >= DATA.GOAL_VILLAGERS) return '';
    const threshold = s.villagers * 4;
    const needBuildings = Math.max(1, s.villagers - 3);
    const lowHappy = s.happiness < threshold;
    const lowBuild = s.totalBuildings < needBuildings;
    if (lowHappy && lowBuild) return `Il faudrait plus de bonheur (${s.happiness}/${threshold}) et de batiments (${s.totalBuildings}/${needBuildings})`;
    if (lowHappy) return `Un peu plus de bonheur attirerait du monde (${s.happiness}/${threshold})`;
    if (lowBuild) return `Construisez plus pour accueillir du monde (${s.totalBuildings}/${needBuildings})`;
    return 'De nouveaux habitants arrivent bientot!';
};

// --- Resource placement ---
G.placeResources = function() {
    const s = G.state;
    s.resources = [];
    for (const [commune, spots] of Object.entries(DATA.RESOURCE_SPOTS)) {
        const c = DATA.COMMUNES[commune];
        if (!c) continue;
        for (const spot of spots) {
            const rx = c.cx + spot.rx, ry = c.cy + spot.ry;
            if (rx>=0&&rx<DATA.MAP_W&&ry>=0&&ry<DATA.MAP_H) {
                if (DATA.WALKABLE.has(s.map[ry][rx])) {
                    s.resources.push({x:rx, y:ry, item:spot.item, qty:spot.qty, maxQty:spot.qty});
                }
            }
        }
    }
};

G.respawnResources = function() {
    for (const r of G.state.resources) { if (r.qty < r.maxQty) r.qty = r.maxQty; }
};

G.collectResource = function(x, y) {
    const s = G.state;
    for (const r of s.resources) {
        if (r.x === x && r.y === y && r.qty > 0) {
            G.addItem(r.item, r.qty);
            const item = DATA.ITEMS[r.item];
            G.notify(`Ramasse: ${item?.name||r.item} x${r.qty}`, 2);
            r.qty = 0;
            return true;
        }
    }
    return false;
};

// --- Fete conditions check ---
G.checkFeteConditions = function() {
    const s = G.state;
    const crops = Object.keys(DATA.CROPS);
    const veggies = crops.every(crop => (s.inventory[crop] || 0) >= 3);
    const invitableNpcs = DATA.NPCS.filter(n => n.id !== 'maire');
    const invitedCount = s.feteInvited.filter(id => id !== 'maire').length;
    const npcs = invitedCount >= invitableNpcs.length;
    return { veggies, npcs, ready: veggies && npcs };
};

// --- Fete dance animation ---
G.updateFeteAnimation = function(dt) {
    const s = G.state;
    s.feteTimer += dt;

    // Teleporter les NPCs en cercle autour du joueur
    const px = s.player.x;
    const py = s.player.y;
    const radius = 3;
    const angleOffset = s.feteTimer * 0.8; // Vitesse de rotation

    for (let i = 0; i < s.npcs.length; i++) {
        const npc = s.npcs[i];
        const angle = angleOffset + (i / s.npcs.length) * Math.PI * 2;
        npc.x = px + Math.cos(angle) * radius;
        npc.y = py + Math.sin(angle) * radius;
    }

    // Particules festives
    if (Math.random() > 0.7) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 4;
        s.particles.push({
            sx: (px + Math.cos(angle) * dist) * G.TILE - (s.camera ? s.camera.x : 0),
            sy: (py + Math.sin(angle) * dist) * G.TILE - (s.camera ? s.camera.y : 0),
            vx: (Math.random() - 0.5) * 40,
            vy: -20 - Math.random() * 30,
            life: 1,
            decay: 0.4 + Math.random() * 0.3,
            size: 3 + Math.random() * 3,
            color: DATA.FLOWER_COLORS[Math.floor(Math.random() * DATA.FLOWER_COLORS.length)],
        });
    }

    // Fin de l'animation apres ~6 secondes
    if (s.feteTimer >= 6) {
        s.fetePhase = 'victory';
        s.ui.screen = 'victory';
    }
};

// --- Player interaction ---
G.interact = function() {
    const s = G.state;
    const dirs = {up:{dx:0,dy:-1},down:{dx:0,dy:1},left:{dx:-1,dy:0},right:{dx:1,dy:0}};
    const d = dirs[s.player.dir];
    const tx = s.player.x + d.dx;
    const ty = s.player.y + d.dy;

    // Check NPC (devant ou adjacent)
    for (const npc of s.npcs) {
        if (npc.x === tx && npc.y === ty) { G.interactNPC(npc); return; }
    }

    // Check for nearby domestic animal (Space to observe)
    const nearDomestic = s.wildlife ? s.wildlife.find(w => {
        const wdata = DATA.WILDLIFE[w.type];
        return wdata?.domestic && G.dist(w.x, w.y, s.player.x, s.player.y) < 2;
    }) : null;
    if (nearDomestic) {
        const wdata = DATA.WILDLIFE[nearDomestic.type];
        if (!s.observedAnimals.includes(nearDomestic.type)) {
            s.observedAnimals.push(nearDomestic.type);
            G.notify(`Vous observez : ${wdata.name} ! Quel calme...`, 3);
            G.checkQuests();
        } else {
            G.notify(`${wdata.name}... quelle sérénité. ♥`, 2);
        }
        return;
    }

    // Check resource devant ou sous les pieds
    if (G.collectResource(s.player.x, s.player.y)) return;
    if (G.collectResource(tx, ty)) return;

    // Check jardin UNIQUEMENT si le joueur est DESSUS
    const plotIdx = G.getPlayerGardenPlot();
    if (plotIdx >= 0) {
        const p = s.garden.plots[plotIdx];
        if (!p.crop) {
            s.ui.menu = 'garden'; s.ui.gardenIndex = plotIdx;
            s.ui.gardenMode = 'plant'; s.ui.cropSelect = 0;
            return;
        }
        if (p.stage >= 5) { G.harvestPlot(plotIdx); return; }
        const crop = DATA.CROPS[p.crop];
        const needed = crop ? (crop.waterPerStage||1) : 1;
        if ((p.waterCount||0) < needed) { G.waterPlot(plotIdx); return; }
        G.notify('Ca pousse doucement...');
        return;
    }
};

// --- Move player ---
G.movePlayer = function(dx, dy) {
    const s = G.state;
    if (s.ui.dialogue || s.ui.menu) return;

    const nx = s.player.x + dx;
    const ny = s.player.y + dy;

    if (dx<0) s.player.dir='left';
    else if (dx>0) s.player.dir='right';
    else if (dy<0) s.player.dir='up';
    else if (dy>0) s.player.dir='down';

    if (nx<0||nx>=DATA.MAP_W||ny<0||ny>=DATA.MAP_H) return;
    const tile = s.map[ny][nx];
    if (!DATA.WALKABLE.has(tile) && tile !== DATA.TILES.GARDEN_SOIL) return;
    for (const npc of s.npcs) { if (npc.x===nx && npc.y===ny) return; }

    s.player.x = nx;
    s.player.y = ny;
    s.player.moving = true;

    const commune = G.getCommune(nx, ny);
    if (commune && !s.visitedCommunes.includes(commune)) {
        s.visitedCommunes.push(commune);
        const cName = DATA.COMMUNES[commune].name;
        const prefix = cName.startsWith('Les ') ? 'aux ' + cName.slice(4) : 'à ' + cName;
        G.notify(`Bienvenue ${prefix} !`, 3);
        G.checkQuests();
    }

    G.collectResource(nx, ny);

    s._stepCount = (s._stepCount||0) + 1;
    if (s._stepCount >= 5) { s._stepCount = 0; G.advanceTurn(); }
};
