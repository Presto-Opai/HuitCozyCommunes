// ============================================================
//  RENDER.JS — Dessin et rendu du jeu
// ============================================================

// --- Sprite drawing helpers ---
// isWoman: if true, draw longer hair / dress silhouette
G.drawChar = function(ctx, sx, sy, s, bodyCol, hairCol, dir, bounce, isWoman) {
    const b = bounce||0;
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.13)';
    ctx.beginPath();
    ctx.ellipse(sx+s/2, sy+s*0.92, s*0.28, s*0.07, 0, 0, Math.PI*2);
    ctx.fill();
    // Legs / skirt base for women
    if (isWoman) {
        // Dress / skirt shape
        ctx.fillStyle = bodyCol;
        ctx.beginPath();
        ctx.moveTo(sx+s*0.22, sy+s*0.68-b*2);
        ctx.lineTo(sx+s*0.16, sy+s*0.9-b*2);
        ctx.lineTo(sx+s*0.84, sy+s*0.9-b*2);
        ctx.lineTo(sx+s*0.78, sy+s*0.68-b*2);
        ctx.closePath();
        ctx.fill();
    } else {
        ctx.fillStyle = '#5A7A5A';
        const legOff = Math.sin(b*8)*s*0.03;
        ctx.fillRect(sx+s*0.3, sy+s*0.66-b*2+legOff, s*0.14, s*0.22);
        ctx.fillRect(sx+s*0.56, sy+s*0.66-b*2-legOff, s*0.14, s*0.22);
    }
    // Body
    ctx.fillStyle = bodyCol;
    ctx.beginPath();
    ctx.roundRect(sx+s*0.22, sy+s*0.36-b*2, s*0.56, s*0.34, s*0.06);
    ctx.fill();
    // Arms
    ctx.fillStyle = bodyCol;
    ctx.fillRect(sx+s*0.14, sy+s*0.4-b*2, s*0.1, s*0.2);
    ctx.fillRect(sx+s*0.76, sy+s*0.4-b*2, s*0.1, s*0.2);
    // Hands
    ctx.fillStyle = '#FFD5B5';
    ctx.beginPath();
    ctx.arc(sx+s*0.19, sy+s*0.6-b*2, s*0.05, 0, Math.PI*2);
    ctx.arc(sx+s*0.81, sy+s*0.6-b*2, s*0.05, 0, Math.PI*2);
    ctx.fill();
    // Head
    ctx.fillStyle = '#FFD5B5';
    ctx.beginPath();
    ctx.arc(sx+s/2, sy+s*0.26-b*2, s*0.19, 0, Math.PI*2);
    ctx.fill();
    // Hair
    ctx.fillStyle = hairCol;
    ctx.beginPath();
    ctx.arc(sx+s/2, sy+s*0.22-b*2, s*0.2, Math.PI*0.9, Math.PI*2.1);
    ctx.fill();
    ctx.fillRect(sx+s*0.3, sy+s*0.1-b*2, s*0.4, s*0.1);
    if (isWoman) {
        // Long hair sides
        ctx.beginPath();
        ctx.ellipse(sx+s*0.28, sy+s*0.3-b*2, s*0.07, s*0.14, -0.15, 0, Math.PI*2);
        ctx.ellipse(sx+s*0.72, sy+s*0.3-b*2, s*0.07, s*0.14, 0.15, 0, Math.PI*2);
        ctx.fill();
        // Braid or tail hint at back
        if (dir !== 'up') {
            ctx.beginPath();
            ctx.ellipse(sx+s*0.73, sy+s*0.38-b*2, s*0.045, s*0.09, 0.2, 0, Math.PI*2);
            ctx.fill();
        }
    }
    // Eyes
    if (dir !== 'up') {
        ctx.fillStyle = '#3A2A1A';
        const ex = dir==='left'?-0.04:dir==='right'?0.04:0;
        ctx.beginPath();
        ctx.arc(sx+s*0.4+ex*s, sy+s*0.27-b*2, s*0.035, 0, Math.PI*2);
        ctx.arc(sx+s*0.6+ex*s, sy+s*0.27-b*2, s*0.035, 0, Math.PI*2);
        ctx.fill();
    }
    // Blush
    ctx.fillStyle = 'rgba(255,150,150,0.35)';
    ctx.beginPath();
    ctx.ellipse(sx+s*0.34, sy+s*0.32-b*2, s*0.06, s*0.03, 0, 0, Math.PI*2);
    ctx.ellipse(sx+s*0.66, sy+s*0.32-b*2, s*0.06, s*0.03, 0, 0, Math.PI*2);
    ctx.fill();
};

G.drawTree = function(ctx, sx, sy, s, season, variant) {
    const v = (variant||0)*0.1;
    const sc = DATA.SEASON_COLORS[season]||DATA.SEASON_COLORS.printemps;
    // Trunk
    ctx.fillStyle = '#6B4423';
    ctx.fillRect(sx+s*0.4, sy+s*0.5, s*0.2, s*0.4);
    // Canopy
    ctx.fillStyle = sc.tree;
    ctx.beginPath();
    ctx.arc(sx+s*0.5, sy+s*0.32+v, s*0.34, 0, Math.PI*2);
    ctx.fill();
    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.arc(sx+s*0.42, sy+s*0.24+v, s*0.14, 0, Math.PI*2);
    ctx.fill();
    // Fruits in season
    if (season==='ete'||season==='automne') {
        ctx.fillStyle = season==='ete'?'#FF4444':'#FF8800';
        for (let i=0;i<3;i++) {
            const fx=sx+s*(0.32+G.hash(sx+i,sy)*0.36);
            const fy=sy+s*(0.2+G.hash(sy+i,sx)*0.25);
            ctx.beginPath(); ctx.arc(fx,fy,s*0.04,0,Math.PI*2); ctx.fill();
        }
    }
};

G.drawBush = function(ctx, sx, sy, s, season) {
    const sc = DATA.SEASON_COLORS[season]||DATA.SEASON_COLORS.printemps;
    ctx.fillStyle = sc.tree;
    ctx.beginPath();
    ctx.ellipse(sx+s*0.5, sy+s*0.6, s*0.35, s*0.25, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.ellipse(sx+s*0.4, sy+s*0.5, s*0.15, s*0.12, 0, 0, Math.PI*2);
    ctx.fill();
};

G.drawFlower = function(ctx, sx, sy, s, colorIdx) {
    const col = DATA.FLOWER_COLORS[colorIdx%DATA.FLOWER_COLORS.length];
    // Stem
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(sx+s*0.47, sy+s*0.5, s*0.06, s*0.35);
    // Petals
    ctx.fillStyle = col;
    for (let i=0; i<5; i++) {
        const a = (i/5)*Math.PI*2;
        ctx.beginPath();
        ctx.arc(sx+s*0.5+Math.cos(a)*s*0.1, sy+s*0.42+Math.sin(a)*s*0.1, s*0.07, 0, Math.PI*2);
        ctx.fill();
    }
    // Center
    ctx.fillStyle = '#FFD700';
    ctx.beginPath(); ctx.arc(sx+s*0.5, sy+s*0.42, s*0.06, 0, Math.PI*2); ctx.fill();
};

G.drawWater = function(ctx, sx, sy, s, deep, time) {
    ctx.fillStyle = deep ? '#3A7BBF' : '#5B9BD5';
    ctx.fillRect(sx, sy, s, s);
    // Animated ripples
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    const off = Math.sin(time*2 + sx*0.1)*s*0.3;
    ctx.fillRect(sx+off, sy+s*0.3, s*0.3, s*0.06);
    ctx.fillRect(sx+s*0.5-off*0.5, sy+s*0.7, s*0.25, s*0.06);
};

G.drawAnimal = function(ctx, sx, sy, s, type, frame) {
    const data = DATA.WILDLIFE[type];
    if (!data) return;
    const sz = s * (data.size||0.5);
    const cx = sx+s/2, cy = sy+s/2;
    const col = data.color;

    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath();
    ctx.ellipse(cx, cy+sz*0.45, sz*0.3, sz*0.08, 0, 0, Math.PI*2);
    ctx.fill();

    switch(type) {
        case 'cerf': case 'biche':
            // Body
            ctx.fillStyle = col;
            ctx.beginPath();
            ctx.ellipse(cx, cy, sz*0.35, sz*0.22, 0, 0, Math.PI*2);
            ctx.fill();
            // Head
            ctx.beginPath();
            ctx.arc(cx+sz*0.3, cy-sz*0.15, sz*0.13, 0, Math.PI*2);
            ctx.fill();
            // Legs
            ctx.fillRect(cx-sz*0.2, cy+sz*0.15, sz*0.06, sz*0.25);
            ctx.fillRect(cx+sz*0.1, cy+sz*0.15, sz*0.06, sz*0.25);
            // Antlers for cerf
            if (type==='cerf') {
                ctx.strokeStyle = '#8B6E4E'; ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(cx+sz*0.3, cy-sz*0.25);
                ctx.lineTo(cx+sz*0.35, cy-sz*0.45);
                ctx.lineTo(cx+sz*0.45, cy-sz*0.4);
                ctx.moveTo(cx+sz*0.25, cy-sz*0.25);
                ctx.lineTo(cx+sz*0.2, cy-sz*0.42);
                ctx.lineTo(cx+sz*0.12, cy-sz*0.38);
                ctx.stroke();
            }
            break;
        case 'lapin':
            ctx.fillStyle = col;
            ctx.beginPath();
            ctx.ellipse(cx, cy+sz*0.1, sz*0.2, sz*0.18, 0, 0, Math.PI*2);
            ctx.fill();
            // Ears
            ctx.beginPath();
            ctx.ellipse(cx-sz*0.08, cy-sz*0.2, sz*0.05, sz*0.15, -0.2, 0, Math.PI*2);
            ctx.ellipse(cx+sz*0.08, cy-sz*0.2, sz*0.05, sz*0.15, 0.2, 0, Math.PI*2);
            ctx.fill();
            // Tail
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath(); ctx.arc(cx-sz*0.18, cy+sz*0.1, sz*0.06, 0, Math.PI*2); ctx.fill();
            break;
        case 'renard':
            ctx.fillStyle = col;
            ctx.beginPath();
            ctx.ellipse(cx, cy, sz*0.3, sz*0.18, 0, 0, Math.PI*2);
            ctx.fill();
            // Head
            ctx.beginPath(); ctx.arc(cx+sz*0.25, cy-sz*0.08, sz*0.12, 0, Math.PI*2); ctx.fill();
            // Ears
            ctx.beginPath();
            ctx.moveTo(cx+sz*0.2, cy-sz*0.18);
            ctx.lineTo(cx+sz*0.15, cy-sz*0.35);
            ctx.lineTo(cx+sz*0.28, cy-sz*0.2);
            ctx.fill();
            // Tail
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.ellipse(cx-sz*0.35, cy+sz*0.05, sz*0.15, sz*0.07, -0.3, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = col;
            ctx.beginPath();
            ctx.ellipse(cx-sz*0.3, cy+sz*0.03, sz*0.12, sz*0.06, -0.3, 0, Math.PI*2);
            ctx.fill();
            break;
        case 'ecureuil':
            ctx.fillStyle = col;
            ctx.beginPath(); ctx.arc(cx, cy, sz*0.15, 0, Math.PI*2); ctx.fill();
            // Tail (big fluffy)
            ctx.beginPath();
            ctx.ellipse(cx-sz*0.15, cy-sz*0.15, sz*0.18, sz*0.1, -0.8, 0, Math.PI*2);
            ctx.fill();
            break;
        case 'canard':
            ctx.fillStyle = col;
            ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.05, sz*0.18, sz*0.14, 0, 0, Math.PI*2); ctx.fill();
            // Head
            ctx.fillStyle = '#226633';
            ctx.beginPath(); ctx.arc(cx+sz*0.15, cy-sz*0.1, sz*0.09, 0, Math.PI*2); ctx.fill();
            // Beak
            ctx.fillStyle = '#FFAA00';
            ctx.beginPath();
            ctx.moveTo(cx+sz*0.24, cy-sz*0.08);
            ctx.lineTo(cx+sz*0.38, cy-sz*0.06);
            ctx.lineTo(cx+sz*0.24, cy-sz*0.02);
            ctx.fill();
            break;
        case 'papillon':
            const bf = Math.sin(frame*10)*0.3;
            ctx.fillStyle = col;
            ctx.beginPath();
            ctx.ellipse(cx-sz*0.1, cy, sz*0.12, sz*0.08*(1+bf), -0.3, 0, Math.PI*2);
            ctx.ellipse(cx+sz*0.1, cy, sz*0.12, sz*0.08*(1+bf), 0.3, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#333';
            ctx.fillRect(cx-sz*0.02, cy-sz*0.1, sz*0.04, sz*0.2);
            break;
        case 'herisson':
            ctx.fillStyle = '#887755';
            ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.05, sz*0.2, sz*0.14, 0, 0, Math.PI*2); ctx.fill();
            // Spikes
            ctx.fillStyle = '#665544';
            for (let i=0;i<6;i++) {
                const a = Math.PI+i*0.35-0.9;
                ctx.beginPath();
                ctx.moveTo(cx+Math.cos(a)*sz*0.15, cy+Math.sin(a)*sz*0.1);
                ctx.lineTo(cx+Math.cos(a)*sz*0.28, cy+Math.sin(a)*sz*0.2);
                ctx.lineTo(cx+Math.cos(a+0.2)*sz*0.15, cy+Math.sin(a+0.2)*sz*0.1);
                ctx.fill();
            }
            break;
        case 'pie': case 'corneille':
            ctx.fillStyle = col;
            ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.05, sz*0.22, sz*0.13, 0, 0, Math.PI*2); ctx.fill(); // body
            ctx.beginPath(); ctx.arc(cx+sz*0.2, cy-sz*0.04, sz*0.1, 0, Math.PI*2); ctx.fill(); // head
            if (type==='pie') { // white patches
                ctx.fillStyle='#FFFFFF';
                ctx.beginPath(); ctx.ellipse(cx-sz*0.06, cy+sz*0.02, sz*0.09, sz*0.05, 0, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(cx+sz*0.12, cy+sz*0.1, sz*0.05, sz*0.03, 0, 0, Math.PI*2); ctx.fill();
            }
            ctx.fillStyle = col;
            ctx.beginPath(); ctx.moveTo(cx-sz*0.18,cy); ctx.lineTo(cx-sz*0.34,cy+sz*0.14); ctx.lineTo(cx+sz*0.05,cy+sz*0.07); ctx.fill(); // wing
            ctx.fillStyle='#666600';
            ctx.beginPath(); ctx.moveTo(cx+sz*0.28,cy-sz*0.04); ctx.lineTo(cx+sz*0.42,cy-sz*0.01); ctx.lineTo(cx+sz*0.28,cy+sz*0.02); ctx.fill(); // beak
            break;
        case 'poule':
            ctx.fillStyle = col;
            ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.08, sz*0.25, sz*0.18, 0, 0, Math.PI*2); ctx.fill(); // body
            ctx.beginPath(); ctx.arc(cx+sz*0.22, cy-sz*0.1, sz*0.12, 0, Math.PI*2); ctx.fill(); // head
            ctx.fillStyle='#CC2222'; // red comb
            ctx.beginPath(); ctx.arc(cx+sz*0.22, cy-sz*0.22, sz*0.06, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle='#FFAA00'; // beak
            ctx.beginPath(); ctx.moveTo(cx+sz*0.32,cy-sz*0.08); ctx.lineTo(cx+sz*0.44,cy-sz*0.05); ctx.lineTo(cx+sz*0.32,cy-sz*0.02); ctx.fill();
            ctx.fillStyle = col;
            ctx.beginPath(); ctx.moveTo(cx-sz*0.22,cy); ctx.lineTo(cx-sz*0.4,cy-sz*0.18); ctx.lineTo(cx-sz*0.35,cy+sz*0.06); ctx.fill(); // tail
            break;
        case 'vache':
            ctx.fillStyle = col;
            ctx.beginPath(); ctx.ellipse(cx, cy, sz*0.42, sz*0.28, 0, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(cx+sz*0.4, cy-sz*0.18, sz*0.18, 0, Math.PI*2); ctx.fill(); // head
            ctx.fillStyle='#8B5E3C'; // patches
            ctx.beginPath(); ctx.ellipse(cx-sz*0.1, cy-sz*0.05, sz*0.12, sz*0.1, 0.3, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(cx+sz*0.15, cy+sz*0.1, sz*0.08, sz*0.07, -0.2, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = col;
            ctx.fillRect(cx-sz*0.3,cy+sz*0.22,sz*0.07,sz*0.22); ctx.fillRect(cx-sz*0.12,cy+sz*0.22,sz*0.07,sz*0.22);
            ctx.fillRect(cx+sz*0.06,cy+sz*0.22,sz*0.07,sz*0.22); ctx.fillRect(cx+sz*0.24,cy+sz*0.22,sz*0.07,sz*0.22);
            ctx.fillStyle='#EEEECC'; // horns
            ctx.fillRect(cx+sz*0.34,cy-sz*0.36,sz*0.04,sz*0.14); ctx.fillRect(cx+sz*0.44,cy-sz*0.36,sz*0.04,sz*0.14);
            break;
        case 'mouton':
            ctx.fillStyle = '#F0F0E8';
            ctx.beginPath(); ctx.ellipse(cx, cy, sz*0.32, sz*0.26, 0, 0, Math.PI*2); ctx.fill();
            for (let fi=0;fi<5;fi++) { // fluffy bumps
                const fa=fi*Math.PI*2/5;
                ctx.beginPath(); ctx.arc(cx+Math.cos(fa)*sz*0.22, cy+Math.sin(fa)*sz*0.17, sz*0.1, 0, Math.PI*2); ctx.fill();
            }
            ctx.fillStyle='#887766'; // dark face + legs
            ctx.beginPath(); ctx.arc(cx+sz*0.3, cy-sz*0.12, sz*0.12, 0, Math.PI*2); ctx.fill();
            ctx.fillRect(cx-sz*0.22,cy+sz*0.18,sz*0.06,sz*0.2); ctx.fillRect(cx-sz*0.06,cy+sz*0.18,sz*0.06,sz*0.2);
            ctx.fillRect(cx+sz*0.08,cy+sz*0.18,sz*0.06,sz*0.2); ctx.fillRect(cx+sz*0.22,cy+sz*0.18,sz*0.06,sz*0.2);
            break;
        case 'chevre':
            ctx.fillStyle = col;
            ctx.beginPath(); ctx.ellipse(cx, cy+sz*0.05, sz*0.28, sz*0.2, 0, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(cx+sz*0.25, cy-sz*0.12, sz*0.14, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle='#CCBBAA'; // beard
            ctx.beginPath(); ctx.ellipse(cx+sz*0.25, cy+sz*0.04, sz*0.04, sz*0.1, 0, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle='#998877'; ctx.lineWidth=1.5; // horns
            ctx.beginPath(); ctx.moveTo(cx+sz*0.2,cy-sz*0.24); ctx.lineTo(cx+sz*0.14,cy-sz*0.38); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx+sz*0.3,cy-sz*0.24); ctx.lineTo(cx+sz*0.36,cy-sz*0.38); ctx.stroke();
            ctx.fillStyle = col;
            ctx.fillRect(cx-sz*0.2,cy+sz*0.18,sz*0.06,sz*0.22); ctx.fillRect(cx-sz*0.05,cy+sz*0.18,sz*0.06,sz*0.22);
            ctx.fillRect(cx+sz*0.1,cy+sz*0.18,sz*0.06,sz*0.22); ctx.fillRect(cx+sz*0.25,cy+sz*0.18,sz*0.06,sz*0.22);
            break;
        default:
            ctx.fillStyle = col;
            ctx.beginPath(); ctx.arc(cx, cy, sz*0.15, 0, Math.PI*2); ctx.fill();
    }
    // Eyes (small dot for all)
    ctx.fillStyle = '#222';
    ctx.beginPath();
    if (type==='cerf'||type==='biche') ctx.arc(cx+sz*0.33,cy-sz*0.15,sz*0.025,0,Math.PI*2);
    else if (type==='renard') ctx.arc(cx+sz*0.28,cy-sz*0.1,sz*0.025,0,Math.PI*2);
    else if (type==='canard') ctx.arc(cx+sz*0.18,cy-sz*0.12,sz*0.025,0,Math.PI*2);
    else ctx.arc(cx+sz*0.06,cy-sz*0.02,sz*0.025,0,Math.PI*2);
    ctx.fill();
};

G.drawCrop = function(ctx, sx, sy, s, cropKey, stage) {
    const crop = DATA.CROPS[cropKey];
    if (!crop) return;
    const col = crop.icon;
    switch(stage) {
        case 1: // seme
            ctx.fillStyle = '#6B4423';
            ctx.beginPath(); ctx.arc(sx+s*0.5,sy+s*0.7,s*0.06,0,Math.PI*2); ctx.fill();
            break;
        case 2: // pousse
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(sx+s*0.47,sy+s*0.5,s*0.06,s*0.3);
            ctx.beginPath(); ctx.arc(sx+s*0.5,sy+s*0.48,s*0.06,0,Math.PI*2); ctx.fill();
            break;
        case 3: // grandit
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(sx+s*0.47,sy+s*0.35,s*0.06,s*0.45);
            ctx.beginPath(); ctx.arc(sx+s*0.5,sy+s*0.32,s*0.1,0,Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(sx+s*0.38,sy+s*0.45,s*0.06,0,Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(sx+s*0.62,sy+s*0.45,s*0.06,0,Math.PI*2); ctx.fill();
            break;
        case 4: // floraison
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(sx+s*0.47,sy+s*0.25,s*0.06,s*0.55);
            ctx.beginPath(); ctx.arc(sx+s*0.5,sy+s*0.22,s*0.12,0,Math.PI*2); ctx.fill();
            ctx.fillStyle = col;
            ctx.beginPath(); ctx.arc(sx+s*0.5,sy+s*0.2,s*0.06,0,Math.PI*2); ctx.fill();
            break;
        case 5: // pret
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(sx+s*0.47,sy+s*0.2,s*0.06,s*0.6);
            ctx.beginPath(); ctx.arc(sx+s*0.5,sy+s*0.18,s*0.13,0,Math.PI*2); ctx.fill();
            ctx.fillStyle = col;
            ctx.globalAlpha = 0.9;
            ctx.beginPath(); ctx.arc(sx+s*0.5,sy+s*0.16,s*0.1,0,Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(sx+s*0.38,sy+s*0.3,s*0.06,0,Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(sx+s*0.62,sy+s*0.3,s*0.06,0,Math.PI*2); ctx.fill();
            ctx.globalAlpha = 1;
            // Sparkle
            ctx.fillStyle = '#FFFFFF';
            const sp = Math.sin(G.animTime*5)*s*0.02;
            ctx.beginPath(); ctx.arc(sx+s*0.6,sy+s*0.12+sp,s*0.025,0,Math.PI*2); ctx.fill();
            break;
    }
};

G.drawBuildingSprite = function(ctx, sx, sy, s, type) {
    switch(type) {
        case 'bike_path':
            ctx.fillStyle = '#A0C8A0';
            ctx.fillRect(sx+s*0.1, sy+s*0.3, s*0.8, s*0.4);
            ctx.strokeStyle='#FFF'; ctx.lineWidth=1; ctx.setLineDash([3,3]);
            ctx.beginPath(); ctx.moveTo(sx+s*0.1,sy+s/2); ctx.lineTo(sx+s*0.9,sy+s/2); ctx.stroke();
            ctx.setLineDash([]);
            break;
        case 'bench':
            ctx.fillStyle = '#8B6E4E';
            ctx.fillRect(sx+s*0.15,sy+s*0.55,s*0.7,s*0.08);
            ctx.fillRect(sx+s*0.2,sy+s*0.63,s*0.06,s*0.2);
            ctx.fillRect(sx+s*0.74,sy+s*0.63,s*0.06,s*0.2);
            ctx.fillRect(sx+s*0.15,sy+s*0.4,s*0.7,s*0.06);
            break;
        case 'garden':
            for (let i=0;i<4;i++) {
                ctx.fillStyle = DATA.FLOWER_COLORS[i*2];
                ctx.beginPath();
                ctx.arc(sx+s*0.25+i%2*s*0.4, sy+s*0.35+Math.floor(i/2)*s*0.3, s*0.1, 0, Math.PI*2);
                ctx.fill();
            }
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(sx+s*0.1,sy+s*0.7,s*0.8,s*0.15);
            break;
        case 'guesthouse':
            ctx.fillStyle = '#F5E6D3'; ctx.fillRect(sx+s*0.15,sy+s*0.35,s*0.7,s*0.5);
            ctx.fillStyle = '#C65D3E';
            ctx.beginPath(); ctx.moveTo(sx+s*0.1,sy+s*0.38); ctx.lineTo(sx+s*0.5,sy+s*0.12); ctx.lineTo(sx+s*0.9,sy+s*0.38); ctx.fill();
            ctx.fillStyle = '#8B6E4E'; ctx.fillRect(sx+s*0.4,sy+s*0.6,s*0.2,s*0.25);
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(sx+s*0.2,sy+s*0.45,s*0.12,s*0.12);
            ctx.fillRect(sx+s*0.68,sy+s*0.45,s*0.12,s*0.12);
            break;
        case 'bakery':
            ctx.fillStyle = '#F5E6D3'; ctx.fillRect(sx+s*0.15,sy+s*0.35,s*0.7,s*0.5);
            ctx.fillStyle = '#E8C850';
            ctx.beginPath(); ctx.moveTo(sx+s*0.1,sy+s*0.38); ctx.lineTo(sx+s*0.5,sy+s*0.12); ctx.lineTo(sx+s*0.9,sy+s*0.38); ctx.fill();
            ctx.fillStyle = '#8B6E4E'; ctx.fillRect(sx+s*0.4,sy+s*0.6,s*0.2,s*0.25);
            // Smoke
            ctx.fillStyle = 'rgba(200,200,200,0.5)';
            const smoke = Math.sin(G.animTime*2)*s*0.05;
            ctx.beginPath(); ctx.arc(sx+s*0.7,sy+s*0.1+smoke,s*0.06,0,Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(sx+s*0.72,sy-smoke,s*0.04,0,Math.PI*2); ctx.fill();
            break;
        case 'library':
            ctx.fillStyle = '#E8D5C0'; ctx.fillRect(sx+s*0.15,sy+s*0.35,s*0.7,s*0.5);
            ctx.fillStyle = '#4A6FA5';
            ctx.beginPath(); ctx.moveTo(sx+s*0.1,sy+s*0.38); ctx.lineTo(sx+s*0.5,sy+s*0.12); ctx.lineTo(sx+s*0.9,sy+s*0.38); ctx.fill();
            ctx.fillStyle = '#8B6E4E'; ctx.fillRect(sx+s*0.38,sy+s*0.55,s*0.24,s*0.3);
            break;
        case 'duck_pond':
            ctx.fillStyle = '#5B9BD5';
            ctx.beginPath(); ctx.ellipse(sx+s/2,sy+s*0.55,s*0.4,s*0.25,0,0,Math.PI*2); ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.beginPath(); ctx.ellipse(sx+s*0.4,sy+s*0.5,s*0.12,s*0.06,0,0,Math.PI*2); ctx.fill();
            break;
        case 'windmill':
            ctx.fillStyle = '#F5E6D3'; ctx.fillRect(sx+s*0.3,sy+s*0.3,s*0.4,s*0.55);
            ctx.fillStyle = '#C65D3E';
            ctx.beginPath(); ctx.moveTo(sx+s*0.25,sy+s*0.33); ctx.lineTo(sx+s*0.5,sy+s*0.15); ctx.lineTo(sx+s*0.75,sy+s*0.33); ctx.fill();
            // Blades
            ctx.strokeStyle = '#8B6E4E'; ctx.lineWidth = 2;
            const a = G.animTime*1.5;
            for (let i=0;i<4;i++) {
                const ba = a+i*Math.PI/2;
                ctx.beginPath();
                ctx.moveTo(sx+s*0.5,sy+s*0.3);
                ctx.lineTo(sx+s*0.5+Math.cos(ba)*s*0.3, sy+s*0.3+Math.sin(ba)*s*0.25);
                ctx.stroke();
            }
            break;
        case 'fountain':
            ctx.fillStyle = '#A0A0A0';
            ctx.beginPath(); ctx.ellipse(sx+s/2,sy+s*0.6,s*0.35,s*0.15,0,0,Math.PI*2); ctx.fill();
            ctx.fillStyle = '#5B9BD5';
            ctx.beginPath(); ctx.ellipse(sx+s/2,sy+s*0.58,s*0.28,s*0.1,0,0,Math.PI*2); ctx.fill();
            // Water jet
            ctx.fillStyle = 'rgba(91,155,213,0.6)';
            const jh = Math.sin(G.animTime*3)*s*0.05;
            ctx.beginPath(); ctx.arc(sx+s/2,sy+s*0.35+jh,s*0.04,0,Math.PI*2); ctx.fill();
            ctx.fillRect(sx+s*0.48,sy+s*0.35+jh,s*0.04,s*0.2);
            break;
        case 'flowerbed':
            for (let i=0;i<6;i++) {
                ctx.fillStyle = DATA.FLOWER_COLORS[(i*3)%DATA.FLOWER_COLORS.length];
                ctx.beginPath();
                ctx.arc(sx+s*(0.15+i*0.13), sy+s*(0.4+Math.sin(i)*0.15), s*0.08, 0, Math.PI*2);
                ctx.fill();
            }
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(sx+s*0.05,sy+s*0.7,s*0.9,s*0.1);
            break;
        case 'chaumiere':
            // Thatched cottage
            ctx.fillStyle = '#EAD5B0'; ctx.fillRect(sx+s*0.15,sy+s*0.42,s*0.7,s*0.43);
            ctx.fillStyle = '#7A5E2A'; // thatched roof
            ctx.beginPath(); ctx.moveTo(sx+s*0.05,sy+s*0.46); ctx.lineTo(sx+s*0.5,sy+s*0.1); ctx.lineTo(sx+s*0.95,sy+s*0.46); ctx.fill();
            ctx.strokeStyle='rgba(160,110,40,0.35)'; ctx.lineWidth=1;
            for (let r=0;r<3;r++) { ctx.beginPath(); ctx.moveTo(sx+s*(0.1+r*0.04),sy+s*(0.42-r*0.05)); ctx.lineTo(sx+s*(0.9-r*0.04),sy+s*(0.42-r*0.05)); ctx.stroke(); }
            ctx.fillStyle='#7A5A3A'; ctx.fillRect(sx+s*0.41,sy+s*0.6,s*0.18,s*0.25);
            break;
        case 'maison':
            // Norman half-timber house
            ctx.fillStyle = '#F0E8D8'; ctx.fillRect(sx+s*0.12,sy+s*0.35,s*0.76,s*0.5);
            ctx.fillStyle = '#C65D3E'; // red roof
            ctx.beginPath(); ctx.moveTo(sx+s*0.08,sy+s*0.38); ctx.lineTo(sx+s*0.5,sy+s*0.1); ctx.lineTo(sx+s*0.92,sy+s*0.38); ctx.fill();
            ctx.strokeStyle='#5D3A1A'; ctx.lineWidth=2;
            ctx.beginPath(); ctx.moveTo(sx+s*0.12,sy+s*0.6); ctx.lineTo(sx+s*0.88,sy+s*0.6); ctx.stroke(); // horizontal beam
            ctx.beginPath(); ctx.moveTo(sx+s*0.5,sy+s*0.35); ctx.lineTo(sx+s*0.5,sy+s*0.85); ctx.stroke(); // vertical
            ctx.beginPath(); ctx.moveTo(sx+s*0.12,sy+s*0.52); ctx.lineTo(sx+s*0.34,sy+s*0.35); ctx.stroke(); // diagonal left
            ctx.beginPath(); ctx.moveTo(sx+s*0.88,sy+s*0.52); ctx.lineTo(sx+s*0.66,sy+s*0.35); ctx.stroke(); // diagonal right
            ctx.fillStyle='#8B6E4E'; ctx.fillRect(sx+s*0.4,sy+s*0.62,s*0.2,s*0.23);
            ctx.fillStyle='#87CEEB'; ctx.fillRect(sx+s*0.17,sy+s*0.43,s*0.14,s*0.13); ctx.fillRect(sx+s*0.69,sy+s*0.43,s*0.14,s*0.13);
            break;
        case 'gite':
            // Rural gite - welcoming facade
            ctx.fillStyle = '#E8D8C0'; ctx.fillRect(sx+s*0.1,sy+s*0.38,s*0.8,s*0.47);
            ctx.fillStyle = '#B05030';
            ctx.beginPath(); ctx.moveTo(sx+s*0.06,sy+s*0.42); ctx.lineTo(sx+s*0.5,sy+s*0.12); ctx.lineTo(sx+s*0.94,sy+s*0.42); ctx.fill();
            ctx.fillStyle='#8B6E4E'; ctx.fillRect(sx+s*0.41,sy+s*0.6,s*0.18,s*0.25);
            ctx.fillStyle='#87CEEB'; ctx.fillRect(sx+s*0.15,sy+s*0.46,s*0.14,s*0.12); ctx.fillRect(sx+s*0.71,sy+s*0.46,s*0.14,s*0.12);
            // Bienvenue sign
            ctx.fillStyle='rgba(232,200,80,0.8)'; ctx.fillRect(sx+s*0.38,sy+s*0.22,s*0.24,s*0.1);
            ctx.fillStyle='#5A3A10'; ctx.font='bold 6px "Segoe UI", sans-serif'; ctx.textAlign='center';
            ctx.fillText('GÎTE', sx+s*0.5, sy+s*0.3); ctx.textAlign='left';
            break;
        case 'ferme':
            // Renovated farm - large barn
            ctx.fillStyle = '#E4D0A8'; ctx.fillRect(sx+s*0.06,sy+s*0.28,s*0.88,s*0.57);
            ctx.fillStyle = '#7A5030';
            ctx.beginPath(); ctx.moveTo(sx+s*0.02,sy+s*0.32); ctx.lineTo(sx+s*0.5,sy+s*0.04); ctx.lineTo(sx+s*0.98,sy+s*0.32); ctx.fill();
            ctx.fillStyle='#7D5B38'; ctx.fillRect(sx+s*0.3,sy+s*0.54,s*0.4,s*0.31); // big barn doors
            ctx.fillStyle='#634830'; ctx.fillRect(sx+s*0.485,sy+s*0.54,s*0.03,s*0.31); // door split
            ctx.fillStyle='#87CEEB'; ctx.fillRect(sx+s*0.1,sy+s*0.38,s*0.12,s*0.1); ctx.fillRect(sx+s*0.78,sy+s*0.38,s*0.12,s*0.1);
            // Silo tower
            ctx.fillStyle='#BCA060'; ctx.fillRect(sx+s*0.79,sy+s*0.14,s*0.14,s*0.57);
            ctx.beginPath(); ctx.ellipse(sx+s*0.86,sy+s*0.14,s*0.07,s*0.04,0,0,Math.PI*2); ctx.fill();
            break;
    }
};

// --- Main rendering ---
G.renderTitleScreen = function() {
    const ctx = G.ctx, w = G.W, h = G.H, t = G.animTime;
    // Sky gradient — dusk-to-dawn cozy
    const grd = ctx.createLinearGradient(0,0,0,h);
    grd.addColorStop(0,'#A8D8EA'); grd.addColorStop(0.45,'#C8E8C0'); grd.addColorStop(1,'#7EC850');
    ctx.fillStyle = grd; ctx.fillRect(0,0,w,h);

    // Clouds
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    const clouds = [{x:0.15,y:0.1,r:55},{x:0.5,y:0.07,r:70},{x:0.82,y:0.12,r:45}];
    for (const cl of clouds) {
        const cx = (cl.x*w + Math.sin(t*0.08 + cl.r)*18)|0;
        const cy = (cl.y*h)|0;
        ctx.beginPath(); ctx.arc(cx,cy,cl.r,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx+cl.r*0.6,cy+8,cl.r*0.65,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx-cl.r*0.55,cy+10,cl.r*0.55,0,Math.PI*2); ctx.fill();
    }

    // Hills (back)
    ctx.fillStyle = '#78BF45';
    ctx.beginPath(); ctx.moveTo(0,h*0.52);
    for (let x=0;x<=w;x+=20) ctx.lineTo(x, h*0.52+Math.sin(x*0.008+1)*40+Math.sin(x*0.015)*20);
    ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.fill();
    // Hills (front)
    ctx.fillStyle = '#5DA832';
    ctx.beginPath(); ctx.moveTo(0,h*0.63);
    for (let x=0;x<=w;x+=20) ctx.lineTo(x, h*0.63+Math.sin(x*0.01+2)*28+Math.sin(x*0.02)*14);
    ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.fill();

    // Trees
    for (let i=0;i<13;i++) {
        const tx = i*80+10, ty = h*0.48+Math.sin(i*1.5)*28+18;
        G.drawTree(ctx, tx, ty, 50, 'printemps', i);
    }

    // Animated animals
    G.drawAnimal(ctx, (Math.sin(t*0.3)*180+w*0.38)|0, h*0.61, 40, 'lapin', t);
    G.drawAnimal(ctx, w*0.72, h*0.53, 52, 'cerf', t);
    G.drawAnimal(ctx, (Math.sin(t*0.5)*90+w*0.28)|0, h*0.69, 36, 'papillon', t);
    G.drawAnimal(ctx, (Math.sin(t*0.2)*60+w*0.6)|0, h*0.72, 30, 'lapin', t);

    // Dandelion seeds drifting upward
    for (let i=0;i<22;i++) {
        const seed_x = ((G.hash(i,0)*w + t*18*(0.4+G.hash(i,1)*0.6) + i*137) % w)|0;
        const seed_y = (((1 - ((t*0.04*(0.5+G.hash(i,2)*0.5) + G.hash(i,3)) % 1)) * h * 0.85 + h * 0.1))|0;
        const alpha = 0.25 + Math.sin(t*1.2+i)*0.15;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath(); ctx.arc(seed_x, seed_y, 1.5, 0, Math.PI*2); ctx.fill();
        // tiny stem
        ctx.strokeStyle = `rgba(255,255,255,${alpha*0.6})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(seed_x, seed_y); ctx.lineTo(seed_x, seed_y+5); ctx.stroke();
    }

    // Title glow
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.shadowColor = 'rgba(120,200,80,0.55)';
    ctx.shadowBlur = 32;
    ctx.fillStyle='rgba(0,0,0,0.18)';
    ctx.font='bold 52px "Segoe UI", sans-serif';
    ctx.fillText('Les Huit Communes', w/2+3, h*0.2+3);
    // Shimmer: base color + animated highlight band
    const shimmerX = (Math.sin(t*0.8)*w*0.6 + w/2)|0;
    const titleGrd = ctx.createLinearGradient(shimmerX-120, 0, shimmerX+120, 0);
    titleGrd.addColorStop(0,'#F5E6D3');
    titleGrd.addColorStop(0.5,'#FFFDF0');
    titleGrd.addColorStop(1,'#F5E6D3');
    ctx.fillStyle = titleGrd;
    ctx.font='bold 50px "Segoe UI", sans-serif';
    ctx.fillText('Les Huit Communes', w/2, h*0.2);
    ctx.shadowBlur = 0;
    ctx.fillStyle='#D8C8A8';
    ctx.font='italic 21px "Segoe UI", sans-serif';
    ctx.fillText('~ Athis-Val-de-Rouvre ~', w/2, h*0.2+48);

    // Menu options
    const opts = ['Nouvelle Partie'];
    if (G.hasSave()) opts.push('Continuer');
    for (let i=0;i<opts.length;i++) {
        const oy = h*0.4+i*58;
        const hover = G.mouse.y>oy-22 && G.mouse.y<oy+22 && G.mouse.x>w/2-130 && G.mouse.x<w/2+130;
        // Button shadow
        ctx.fillStyle='rgba(0,0,0,0.22)';
        ctx.beginPath(); ctx.roundRect(w/2-128,oy-19,260,46,10); ctx.fill();
        ctx.fillStyle = hover ? 'rgba(60,42,22,0.96)' : 'rgba(42,28,14,0.82)';
        ctx.beginPath(); ctx.roundRect(w/2-130,oy-22,260,46,10); ctx.fill();
        ctx.strokeStyle = hover ? '#E8C850' : '#C4A882';
        ctx.lineWidth = hover ? 2 : 1.5;
        ctx.beginPath(); ctx.roundRect(w/2-130,oy-22,260,46,10); ctx.stroke();
        ctx.fillStyle = hover ? '#FFE8A0' : '#F5E6D3';
        ctx.font = hover ? 'bold 20px "Segoe UI", sans-serif' : '19px "Segoe UI", sans-serif';
        ctx.fillText(opts[i], w/2, oy);
    }

    // Footer
    ctx.fillStyle='rgba(245,230,211,0.45)';
    ctx.font='13px "Segoe UI", sans-serif';
    ctx.fillText('Un jeu cozy dans la campagne normande  ✿', w/2, h*0.92);
    ctx.textAlign='left';
};

G.renderGame = function() {
    const ctx=G.ctx, s=G.state, T=DATA.TILES, ts=G.TILE;
    const cam = s.camera || {x:0,y:0};
    const season = s.season;
    const sc = DATA.SEASON_COLORS[season];

    // Sky tint
    ctx.fillStyle = sc.sky;
    ctx.fillRect(0,0,G.W,G.H);

    // Visible range
    const startX = Math.floor(cam.x/ts);
    const startY = Math.floor(cam.y/ts);
    const endX = startX + Math.ceil(G.W/ts) + 1;
    const endY = startY + Math.ceil(G.H/ts) + 1;
    const offX = -(cam.x % ts);
    const offY = -(cam.y % ts);

    // --- Draw ground tiles ---
    for (let ty=startY; ty<=endY; ty++) {
        for (let tx=startX; tx<=endX; tx++) {
            if (tx<0||tx>=DATA.MAP_W||ty<0||ty>=DATA.MAP_H) continue;
            const tile = s.map[ty][tx];
            const sx = (tx-startX)*ts+offX;
            const sy = (ty-startY)*ts+offY;
            const colors = DATA.TILE_COLORS[tile];

            if (tile===T.WATER || tile===T.DEEP_WATER) {
                G.drawWater(ctx, sx, sy, ts, tile===T.DEEP_WATER, G.animTime+tx*0.5);
                continue;
            }

            // Base color with variation
            if (colors) {
                const ci = (G.hash(tx,ty)*3)|0;
                ctx.fillStyle = colors[G.clamp(ci,0,2)];
            } else {
                ctx.fillStyle = '#7EC850';
            }
            ctx.fillRect(sx, sy, ts, ts);

            // Grass variation for green tiles
            if (tile===T.GRASS || tile===T.TALL_GRASS) {
                const gc = season==='hiver' ? '#B8C8B8' : sc.grass;
                ctx.fillStyle = gc;
                if (G.hash(tx*7,ty*13)>0.7) {
                    ctx.fillRect(sx+ts*0.2, sy+ts*0.6, 2, ts*0.2);
                    ctx.fillRect(sx+ts*0.7, sy+ts*0.4, 2, ts*0.25);
                }
            }

            // Special decorations
            if (tile===T.FLOWERS) {
                const fi = (G.hash(tx+5,ty+5)*8)|0;
                G.drawFlower(ctx, sx, sy, ts, fi);
            }
            if (tile===T.GARDEN_SOIL) {
                // Furrows
                ctx.fillStyle='#7D5F35';
                for (let r=0;r<3;r++) ctx.fillRect(sx+2,sy+r*ts*0.33+4,ts-4,2);
            }
            if (tile===T.SIGN) {
                ctx.fillStyle='#8B6E4E';
                ctx.fillRect(sx+ts*0.45,sy+ts*0.3,ts*0.1,ts*0.55);
                ctx.fillRect(sx+ts*0.2,sy+ts*0.2,ts*0.6,ts*0.25);
                ctx.fillStyle='#F5E6D3';
                ctx.font='9px "Segoe UI", sans-serif'; ctx.textAlign='center';
                const cn = G.getCommuneName(tx,ty);
                ctx.fillText(cn.substring(0,8), sx+ts/2, sy+ts*0.38);
                ctx.textAlign='left';
            }
            if (tile===T.WELL) {
                ctx.fillStyle='#909090';
                ctx.beginPath(); ctx.ellipse(sx+ts/2,sy+ts*0.6,ts*0.35,ts*0.18,0,0,Math.PI*2); ctx.fill();
                ctx.fillStyle='#5B9BD5';
                ctx.beginPath(); ctx.ellipse(sx+ts/2,sy+ts*0.58,ts*0.25,ts*0.1,0,0,Math.PI*2); ctx.fill();
                ctx.fillStyle='#8B6E4E';
                ctx.fillRect(sx+ts*0.2,sy+ts*0.15,ts*0.05,ts*0.5);
                ctx.fillRect(sx+ts*0.75,sy+ts*0.15,ts*0.05,ts*0.5);
                ctx.fillRect(sx+ts*0.2,sy+ts*0.15,ts*0.6,ts*0.05);
            }
            if (tile===T.BRIDGE) {
                ctx.fillStyle='#B8956A';
                ctx.fillRect(sx,sy,ts,ts);
                ctx.fillStyle='#A08560';
                ctx.fillRect(sx,sy,ts,3); ctx.fillRect(sx,sy+ts-3,ts,3);
            }
            if (tile===T.BENCH) {
                G.drawBuildingSprite(ctx,sx,sy,ts,'bench');
            }
            if (tile===T.CHAPEL) {
                ctx.fillStyle='#D0C0A0'; ctx.fillRect(sx+ts*0.2,sy+ts*0.3,ts*0.6,ts*0.55);
                ctx.fillStyle='#8B6E4E';
                ctx.beginPath(); ctx.moveTo(sx+ts*0.15,sy+ts*0.33); ctx.lineTo(sx+ts*0.5,sy+ts*0.1); ctx.lineTo(sx+ts*0.85,sy+ts*0.33); ctx.fill();
                ctx.fillStyle='#FFD700';
                ctx.beginPath(); ctx.moveTo(sx+ts*0.48,sy+ts*0.02); ctx.lineTo(sx+ts*0.52,sy+ts*0.02); ctx.lineTo(sx+ts*0.52,sy+ts*0.12); ctx.lineTo(sx+ts*0.56,sy+ts*0.08); ctx.lineTo(sx+ts*0.56,sy+ts*0.12); ctx.lineTo(sx+ts*0.44,sy+ts*0.12); ctx.lineTo(sx+ts*0.44,sy+ts*0.08); ctx.lineTo(sx+ts*0.48,sy+ts*0.12); ctx.closePath(); ctx.fill();
            }
            if (tile===T.BIKE_PATH) {
                G.drawBuildingSprite(ctx,sx,sy,ts,'bike_path');
            }
        }
    }

    // --- Draw trees/bushes (separate pass for depth) ---
    for (let ty=startY; ty<=endY; ty++) {
        for (let tx=startX; tx<=endX; tx++) {
            if (tx<0||tx>=DATA.MAP_W||ty<0||ty>=DATA.MAP_H) continue;
            const tile = s.map[ty][tx];
            const sx = (tx-startX)*ts+offX;
            const sy = (ty-startY)*ts+offY;
            if (tile===T.TREE||tile===T.DENSE_TREE) {
                const sway = Math.sin(G.animTime*1.5+tx+ty)*1.5;
                G.drawTree(ctx, sx+sway, sy-ts*0.3, ts*1.1, season, (tx*7+ty*13)%10);
            }
            if (tile===T.BUSH) G.drawBush(ctx, sx, sy, ts, season);
        }
    }

    // --- Draw garden crops + indicator ---
    if (s.garden && s.garden.plots) {
        const playerNearGarden = s.garden.plots.some(p =>
            Math.abs(p.x-s.player.x)<=2 && Math.abs(p.y-s.player.y)<=2);
        const playerOnGarden = s.garden.plots.some(p =>
            p.x===s.player.x && p.y===s.player.y);
        for (const p of s.garden.plots) {
            if (p.x<startX||p.x>endX||p.y<startY||p.y>endY) continue;
            const sx = (p.x-startX)*ts+offX;
            const sy = (p.y-startY)*ts+offY;
            // Bordure pulsante quand le joueur est proche
            if (playerNearGarden) {
                const pulse = 0.3 + Math.sin(G.animTime*3)*0.15;
                ctx.strokeStyle = `rgba(126,200,80,${pulse})`;
                ctx.lineWidth = 2;
                ctx.strokeRect(sx+1,sy+1,ts-2,ts-2);
            }
            if (p.crop && p.stage > 0) {
                G.drawCrop(ctx, sx, sy, ts, p.crop, p.stage);
            }
            // Water count indicator
            if (p.crop && p.stage>0 && p.stage<5) {
                const crop = DATA.CROPS[p.crop];
                const needed = crop?(crop.waterPerStage||1):1;
                const wc = p.waterCount||0;
                for (let d=0;d<needed;d++) {
                    ctx.fillStyle = d<wc ? 'rgba(91,155,213,0.7)' : 'rgba(91,155,213,0.2)';
                    ctx.beginPath(); ctx.arc(sx+8+d*8,sy+ts-6,3,0,Math.PI*2); ctx.fill();
                }
            }
        }
        // Texte indicateur au-dessus du potager
        if (playerNearGarden && !playerOnGarden) {
            const gp = s.garden.plots[0];
            const gsx = (gp.x-startX)*ts+offX;
            const gsy = (gp.y-startY)*ts+offY;
            ctx.fillStyle='rgba(42,31,20,0.8)';
            ctx.beginPath(); ctx.roundRect(gsx-10,gsy-28,130,22,4); ctx.fill();
            ctx.fillStyle='#7EC850'; ctx.font='bold 12px "Segoe UI", sans-serif';
            ctx.fillText('Potager [marchez dessus]', gsx-5, gsy-13);
        }
        if (playerOnGarden) {
            const gsx = (s.player.x-startX)*ts+offX;
            const gsy = (s.player.y-startY)*ts+offY;
            ctx.fillStyle='rgba(42,31,20,0.8)';
            ctx.beginPath(); ctx.roundRect(gsx-20,gsy-28,120,22,4); ctx.fill();
            ctx.fillStyle='#FFD700'; ctx.font='bold 12px "Segoe UI", sans-serif';
            ctx.fillText('[Espace] ou [G]', gsx-15, gsy-13);
        }
    }

    // --- Draw placed buildings ---
    for (const b of (s.placedBuildings||[])) {
        if (b.x<startX-1||b.x>endX+1||b.y<startY-1||b.y>endY+1) continue;
        const sx = (b.x-startX)*ts+offX;
        const sy = (b.y-startY)*ts+offY;
        G.drawBuildingSprite(ctx, sx, sy, ts, b.type);
    }

    // --- Draw resources ---
    for (const r of (s.resources||[])) {
        if (r.qty<=0) continue;
        if (r.x<startX||r.x>endX||r.y<startY||r.y>endY) continue;
        const sx = (r.x-startX)*ts+offX;
        const sy = (r.y-startY)*ts+offY;
        const item = DATA.ITEMS[r.item];
        if (!item) continue;
        // Sparkle
        ctx.fillStyle = 'rgba(255,255,200,0.5)';
        const sp = Math.sin(G.animTime*3+r.x+r.y);
        ctx.beginPath(); ctx.arc(sx+ts/2+sp*3, sy+ts*0.3, 3, 0, Math.PI*2); ctx.fill();
        // Item icon
        ctx.fillStyle = item.icon;
        ctx.beginPath(); ctx.arc(sx+ts/2, sy+ts*0.5, ts*0.2, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle='#FFF'; ctx.font='10px "Segoe UI", sans-serif'; ctx.textAlign='center';
        ctx.fillText(r.item.substring(0,3), sx+ts/2, sy+ts*0.55);
        ctx.textAlign='left';
    }

    // --- Draw wildlife ---
    for (const w of (s.wildlife||[])) {
        const wx = (w.x-cam.x/ts)*ts;
        const wy = (w.y-cam.y/ts)*ts;
        if (wx<-ts||wx>G.W+ts||wy<-ts||wy>G.H+ts) continue;
        G.drawAnimal(ctx, wx, wy, ts, w.type, G.animTime);
        // Observe hint for nearby domestic animals
        const wdata = DATA.WILDLIFE[w.type];
        if (wdata?.domestic && G.dist(w.x, w.y, s.player.x, s.player.y) < 2) {
            const already = s.observedAnimals.includes(w.type);
            const hintText = already ? `${wdata.name} ♥` : `[Espace] Observer`;
            ctx.fillStyle='rgba(30,18,8,0.85)';
            ctx.beginPath(); ctx.roundRect(wx+ts*0.5-45, wy-20, 90, 17, 4); ctx.fill();
            ctx.fillStyle = already ? '#88CC66' : '#FFD700';
            ctx.font='bold 10px "Segoe UI", sans-serif'; ctx.textAlign='center';
            ctx.fillText(hintText, wx+ts*0.5, wy-7);
            ctx.textAlign='left';
        }
    }

    // --- Draw NPCs ---
    for (const npc of s.npcs) {
        if (npc.x<startX-1||npc.x>endX+1||npc.y<startY-1||npc.y>endY+1) continue;
        const sx = (npc.x-startX)*ts+offX;
        const sy = (npc.y-startY)*ts+offY;
        const rel = s.relationships ? (s.relationships[npc.id]||{level:0}) : {level:0};

        // Friendship glow under NPC feet
        if (rel.level >= 2) {
            const glowAlpha = 0.12 + Math.sin(G.animTime*2)*0.06;
            const gc = rel.level >= 3 ? `rgba(255,215,0,${glowAlpha})` : `rgba(255,130,160,${glowAlpha})`;
            ctx.fillStyle = gc;
            ctx.beginPath(); ctx.ellipse(sx+ts/2, sy+ts*0.9, ts*0.42, ts*0.12, 0, 0, Math.PI*2); ctx.fill();
        }

        G.drawChar(ctx, sx, sy-4, ts, npc.color, npc.hair, 'down', 0);

        // Name tag
        ctx.font='11px "Segoe UI", sans-serif'; ctx.textAlign='center';
        const nm = npc.name.split(' ')[0];
        const tw = ctx.measureText(nm).width;
        ctx.fillStyle = rel.level >= 3 ? 'rgba(80,55,10,0.85)' : 'rgba(42,31,20,0.75)';
        ctx.beginPath(); ctx.roundRect(sx+ts/2-tw/2-4, sy-15, tw+8, 14, 7); ctx.fill();
        ctx.fillStyle = rel.level >= 2 ? '#FFD9A0' : '#F5E6D3';
        ctx.fillText(nm, sx+ts/2, sy-5);
        ctx.textAlign='left';

        // Quest indicator: bouncing glowing !
        if (!npc.talked && npc.quest) {
            const bounce = Math.sin(G.animTime*3)*3;
            const pulse = 0.5+Math.sin(G.animTime*4)*0.3;
            // Glow circle
            ctx.fillStyle = `rgba(255,215,0,${pulse*0.35})`;
            ctx.beginPath(); ctx.arc(sx+ts/2, sy-22+bounce, 10, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle='#FFD700'; ctx.font='bold 15px "Segoe UI", sans-serif'; ctx.textAlign='center';
            ctx.shadowColor='rgba(255,200,0,0.8)'; ctx.shadowBlur=8;
            ctx.fillText('!', sx+ts/2, sy-17+bounce);
            ctx.shadowBlur=0; ctx.textAlign='left';
        }

        // Friendship heart floating above (level 1+)
        if (rel.level >= 1 && npc.talked) {
            const fhOff = Math.sin(G.animTime*1.8 + npc.x)*3;
            const fAlpha = 0.55 + Math.sin(G.animTime*2)*0.2;
            const heartChar = rel.level >= 3 ? '♥' : rel.level >= 2 ? '♥' : '♡';
            const heartCol = rel.level >= 3 ? `rgba(255,215,0,${fAlpha})` : `rgba(255,110,140,${fAlpha})`;
            ctx.fillStyle = heartCol;
            ctx.font = rel.level >= 2 ? 'bold 11px "Segoe UI", sans-serif' : '11px "Segoe UI", sans-serif';
            ctx.textAlign='center';
            ctx.fillText(heartChar, sx+ts*0.82, sy-20+fhOff);
            ctx.textAlign='left';
        }
    }

    // --- Draw player ---
    const px = (s.player.x-startX)*ts+offX;
    const py = (s.player.y-startY)*ts+offY;
    G.drawChar(ctx, px, py-6, ts, '#6A7EC8', '#A03040', s.player.dir, G.playerBounce||0, true);

    // --- Particles ---
    for (const p of s.particles) {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        if (p.isHeart) {
            ctx.font = `bold ${Math.round(p.size*2.2)}px "Segoe UI", sans-serif`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('♥', p.sx, p.sy);
            ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        } else {
            ctx.beginPath(); ctx.arc(p.sx, p.sy, p.size, 0, Math.PI*2); ctx.fill();
        }
    }
    ctx.globalAlpha = 1;

    // --- Vignette overlay ---
    const vgrd = ctx.createRadialGradient(G.W/2, G.H/2, G.H*0.25, G.W/2, G.H/2, G.W*0.75);
    vgrd.addColorStop(0, 'rgba(0,0,0,0)');
    vgrd.addColorStop(1, 'rgba(0,0,0,0.32)');
    ctx.fillStyle = vgrd;
    ctx.fillRect(0, 0, G.W, G.H);
};

G.renderDialogue = function() {
    const ctx=G.ctx, d=G.state.ui.dialogue;
    if (!d) return;
    const bx=50, by=G.H-165, bw=G.W-100, bh=148;

    // Drop shadow
    ctx.fillStyle='rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.roundRect(bx+4,by+4,bw,bh,12); ctx.fill();

    // Box
    ctx.fillStyle='rgba(28,18,8,0.95)';
    ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,12); ctx.fill();
    ctx.strokeStyle='#C4A882'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,12); ctx.stroke();
    // Inner accent line at top
    ctx.strokeStyle='rgba(232,200,80,0.25)';
    ctx.lineWidth=1;
    ctx.beginPath(); ctx.roundRect(bx+3,by+3,bw-6,bh-6,10); ctx.stroke();

    // Portrait circle
    const pr=32, pcx=bx+20+pr, pcy=by+bh/2;
    // Glow ring based on friendship
    const friendship = d.friendship || 0;
    if (friendship > 0) {
        const friendColors = ['','rgba(255,150,170,0.5)','rgba(255,100,140,0.6)','rgba(255,215,0,0.7)'];
        ctx.strokeStyle = friendColors[friendship] || 'transparent';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(pcx,pcy,pr+5,0,Math.PI*2); ctx.stroke();
    }
    ctx.fillStyle='rgba(60,40,20,0.8)';
    ctx.beginPath(); ctx.arc(pcx,pcy,pr,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle = friendship >= 2 ? '#FFB3C1' : '#C4A882';
    ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.arc(pcx,pcy,pr,0,Math.PI*2); ctx.stroke();
    // Tiny character in portrait
    G.drawChar(ctx, pcx-pr*0.55, pcy-pr*0.9, pr*1.1, d.color||'#A07050', d.hair||'#664422', 'down', 0);

    // Friendship hearts above portrait
    if (friendship > 0) {
        const heartColors = ['','#FF9BAA','#FF4466','#FFD700'];
        ctx.font = 'bold 11px "Segoe UI", sans-serif';
        const hearts = '♥'.repeat(friendship) + '♡'.repeat(3-friendship);
        ctx.fillStyle = heartColors[friendship] || '#FF9BAA';
        ctx.textAlign = 'center';
        ctx.fillText(hearts, pcx, by+13);
        ctx.textAlign = 'left';
    }

    const tx = bx+20+pr*2+14;
    const maxW = bw - (tx-bx) - 24;

    // Name badge — first name only to avoid overflow
    const firstName = d.name.split(' ')[0];
    ctx.font = 'bold 14px "Segoe UI", sans-serif';
    const firstNameW = ctx.measureText(firstName).width + 20;
    ctx.fillStyle='rgba(80,55,20,0.7)';
    ctx.beginPath(); ctx.roundRect(tx, by+12, firstNameW, 22, 11); ctx.fill();
    ctx.fillStyle='#E8C850';
    ctx.fillText(firstName, tx+10, by+27);

    // Full name / profession as subtle subtitle
    if (d.name !== firstName) {
        ctx.fillStyle='rgba(196,168,130,0.65)';
        ctx.font='italic 11px "Segoe UI", sans-serif';
        ctx.fillText(d.name, tx+4, by+45);
    }

    // Text with word-wrap
    const textStartY = d.name !== firstName ? by+62 : by+52;
    ctx.fillStyle='#F5E6D3'; ctx.font='14px "Segoe UI", sans-serif';
    const line = d.lines[d.index]||'';
    const words = line.split(' ');
    let ly = textStartY, lx = tx, currentLine = '';
    for (const word of words) {
        const test = currentLine + (currentLine?' ':'') + word;
        if (ctx.measureText(test).width > maxW && currentLine) {
            ctx.fillText(currentLine, lx, ly);
            ly += 21; currentLine = word;
        } else { currentLine = test; }
    }
    if (currentLine) ctx.fillText(currentLine, lx, ly);

    // Continue prompt — animated bounce
    const bounce = Math.sin(G.animTime*3)*2;
    ctx.fillStyle='rgba(245,230,211,0.55)';
    ctx.font='11px "Segoe UI", sans-serif';
    const ctxt = d.index < d.lines.length-1 ? '[ Espace ] Suivant ▶' : '[ Espace ] Fermer ✕';
    ctx.fillText(ctxt, bx+bw-185, by+bh-14+bounce);
};

G.renderMenu = function() {
    const ctx=G.ctx, ui=G.state.ui, s=G.state;
    if (!ui.menu) return;
    const mx=100, my=60, mw=G.W-200, mh=G.H-120;
    // Background overlay
    ctx.fillStyle='rgba(0,0,0,0.5)';
    ctx.fillRect(0,0,G.W,G.H);
    // Menu box
    ctx.fillStyle='rgba(42,31,20,0.95)';
    ctx.beginPath(); ctx.roundRect(mx,my,mw,mh,12); ctx.fill();
    ctx.strokeStyle='#C4A882'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.roundRect(mx,my,mw,mh,12); ctx.stroke();

    ctx.textAlign='center';
    let title='';
    switch(ui.menu) {
        case 'inventory': title='✦ Inventaire'; break;
        case 'quests': title='✦ Quêtes'; break;
        case 'build': title='✦ Construire'; break;
        case 'garden': title='✦ Potager'; break;
        case 'map': title='✦ Carte des Communes'; break;
        case 'relations': title='✦ Relations & Amitiés'; break;
    }
    ctx.fillStyle='#E8C850'; ctx.font='bold 22px "Segoe UI", sans-serif';
    ctx.fillText(title, G.W/2, my+35);
    ctx.textAlign='left';

    const contentY = my+55, contentX = mx+25, contentW = mw-50;

    if (ui.menu==='inventory') {
        const items = Object.entries(s.inventory).filter(([k,v])=>v>0);
        if (items.length===0) {
            ctx.fillStyle='#C4A882'; ctx.font='15px "Segoe UI", sans-serif';
            ctx.fillText('Votre inventaire est vide.', contentX, contentY+20);
        }
        const maxVisible = Math.floor((mh-100)/32);
        const scroll = ui.inventoryScroll||0;
        const visible = items.slice(scroll, scroll+maxVisible);
        visible.forEach(([key,qty], vi) => {
            const i = vi + scroll;
            const item = DATA.ITEMS[key]||DATA.CROPS[key]||{name:key,icon:'#AAA'};
            const iy = contentY+10+vi*32;
            const sel = i===ui.menuIndex;
            if (sel) { ctx.fillStyle='rgba(200,180,140,0.15)'; ctx.fillRect(contentX-5,iy-8,contentW,28); }
            ctx.fillStyle=item.icon||'#AAA';
            ctx.beginPath(); ctx.arc(contentX+12, iy+5, 8, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle='#F5E6D3'; ctx.font='15px "Segoe UI", sans-serif';
            ctx.fillText(`${item.name||key}  x${qty}`, contentX+30, iy+9);
        });
        // Scroll indicators
        if (scroll>0) { ctx.fillStyle='#C4A882'; ctx.font='12px "Segoe UI", sans-serif'; ctx.fillText('▲ ...', contentX, contentY); }
        if (scroll+maxVisible<items.length) { ctx.fillStyle='#C4A882'; ctx.font='12px "Segoe UI", sans-serif'; ctx.fillText('▼ ...', contentX, my+mh-30); }
        ctx.fillStyle='#C4A882'; ctx.font='11px "Segoe UI", sans-serif';
        ctx.fillText(`${items.length} objet(s)  [Haut/Bas] Defiler  [Echap] Fermer`, contentX, my+mh-12);
    }

    if (ui.menu==='quests') {
        if (s.feteActive) {
            // Mode fete : n'afficher QUE la quete fete avec sous-conditions
            const qd = DATA.QUESTS.find(x => x.id === 'fete');
            const fq = s.quests.find(q => q.id === 'fete');
            const done = fq && fq.status === 'completed';
            const cond = G.checkFeteConditions ? G.checkFeteConditions() : { veggies: false, npcs: false };

            const pulse = 0.4+Math.sin(G.animTime*2)*0.2;
            ctx.fillStyle = done ? 'rgba(100,200,100,0.15)' : `rgba(255,215,0,${pulse})`;
            ctx.fillRect(contentX-5,contentY+2,contentW,36);
            if (!done) {
                ctx.strokeStyle='#FFD700'; ctx.lineWidth=2;
                ctx.strokeRect(contentX-5,contentY+2,contentW,36);
            }
            ctx.fillStyle = done ? '#88CC66' : '#FFD700';
            ctx.font='bold 16px "Segoe UI", sans-serif';
            ctx.fillText((done?'✓ ':'')+(qd?'★ '+qd.name+' ★':'Fête au Village'), contentX, contentY+20);
            ctx.fillStyle = done ? '#88AA66' : '#FFF';
            ctx.font='12px "Segoe UI", sans-serif';
            ctx.fillText(qd?qd.desc:'', contentX+20, contentY+34);

            // Sous-conditions
            const subY = contentY + 60;
            const crops = Object.keys(DATA.CROPS);
            const veggieDetails = crops.map(c => {
                const qty = s.inventory[c] || 0;
                const ok = qty >= 3;
                return { name: DATA.CROPS[c].name, qty, ok };
            });

            // Legumes
            ctx.fillStyle = cond.veggies ? '#88CC66' : '#E8C850';
            ctx.font = 'bold 14px "Segoe UI", sans-serif';
            ctx.fillText((cond.veggies ? '✓ ' : '○ ') + 'Ramasser 3 de chaque légume', contentX, subY);

            ctx.font = '12px "Segoe UI", sans-serif';
            let vegRow = 0;
            for (let i = 0; i < veggieDetails.length; i++) {
                const v = veggieDetails[i];
                const col2 = i % 2;
                const row = Math.floor(i / 2);
                const vx = contentX + 20 + col2 * 260;
                const vy = subY + 18 + row * 18;
                ctx.fillStyle = v.ok ? '#88AA66' : '#C4A882';
                ctx.fillText(`${v.name}: ${v.qty}/3 ${v.ok ? '✓' : ''}`, vx, vy);
                vegRow = row;
            }

            const npcY = subY + 18 + (vegRow + 1) * 18 + 10;
            const invitableNpcs = DATA.NPCS.filter(n => n.id !== 'maire');
            const invitedCount = s.feteInvited.filter(id => id !== 'maire').length;
            ctx.fillStyle = cond.npcs ? '#88CC66' : '#E8C850';
            ctx.font = 'bold 14px "Segoe UI", sans-serif';
            ctx.fillText((cond.npcs ? '✓ ' : '○ ') + `Inviter les habitants (${invitedCount}/${invitableNpcs.length})`, contentX, npcY);

            // Liste des NPCs invites (sans le maire)
            ctx.font = '12px "Segoe UI", sans-serif';
            for (let i = 0; i < invitableNpcs.length; i++) {
                const npc = invitableNpcs[i];
                const invited = s.feteInvited.includes(npc.id);
                const col2 = i % 3;
                const row = Math.floor(i / 3);
                const nx = contentX + 20 + col2 * 200;
                const ny = npcY + 18 + row * 18;
                ctx.fillStyle = invited ? '#88AA66' : '#886666';
                ctx.fillText(`${invited ? '✓' : '○'} ${npc.name.split(' ')[0]}`, nx, ny);
            }

            const maireY = npcY + 18 + Math.ceil(invitableNpcs.length / 3) * 18 + 10;
            const maireReady = cond.veggies && cond.npcs;
            ctx.fillStyle = maireReady ? '#88CC66' : (done ? '#88CC66' : '#888');
            ctx.font = 'bold 14px "Segoe UI", sans-serif';
            ctx.fillText((done ? '✓ ' : '○ ') + 'Parler au Maire pour lancer la fête', contentX, maireY);
        } else {
            // Affichage normal des quetes
            const nonFinal = s.quests.filter(q => { const qd=DATA.QUESTS.find(x=>x.id===q.id); return qd&&!qd.isFinal&&q.status!=='locked'; });
            const allNonFinalDone = nonFinal.length > 0 && nonFinal.every(q => q.status==='completed');
            let yi=0;
            for (const q of s.quests) {
                const qd = DATA.QUESTS.find(x=>x.id===q.id);
                if (!qd) continue;
                const isLocked = q.status === 'locked';
                const iy = contentY+10+yi*40;
                if (iy > my+mh-30) break;
                const done = q.status==='completed';
                const isFinal = qd.isFinal;
                // Highlight special pour la quete finale
                if (isFinal && allNonFinalDone && !done) {
                    const pulse2 = 0.4+Math.sin(G.animTime*2)*0.2;
                    ctx.fillStyle = `rgba(255,215,0,${pulse2})`;
                    ctx.fillRect(contentX-5,iy-8,contentW,36);
                    ctx.strokeStyle='#FFD700'; ctx.lineWidth=2;
                    ctx.strokeRect(contentX-5,iy-8,contentW,36);
                    ctx.fillStyle='#FFD700'; ctx.font='bold 14px "Segoe UI", sans-serif';
                    ctx.fillText('★ '+qd.name+' ★', contentX, iy+8);
                    ctx.fillStyle='#FFF'; ctx.font='bold 12px "Segoe UI", sans-serif';
                    ctx.fillText(qd.desc, contentX+20, iy+24);
                } else if (isLocked) {
                    ctx.globalAlpha = 0.38;
                    ctx.fillStyle = 'rgba(80,60,40,0.15)';
                    ctx.fillRect(contentX-5,iy-8,contentW,36);
                    ctx.fillStyle = '#887766';
                    ctx.font='bold 13px "Segoe UI", sans-serif';
                    ctx.fillText('🔒 ' + qd.name, contentX, iy+8);
                    ctx.fillStyle = '#665544';
                    ctx.font='11px "Segoe UI", sans-serif';
                    ctx.fillText(qd.desc, contentX+20, iy+24);
                    ctx.globalAlpha = 1;
                } else {
                    ctx.fillStyle = done?'rgba(100,200,100,0.15)':'rgba(200,180,140,0.08)';
                    ctx.fillRect(contentX-5,iy-8,contentW,36);
                    ctx.fillStyle = done?'#88CC66':(isFinal?'#888':'#E8C850');
                    ctx.font='bold 14px "Segoe UI", sans-serif';
                    ctx.fillText((done?'✓ ':'○ ')+qd.name, contentX, iy+8);
                    ctx.fillStyle = done?'#88AA66':'#C4A882';
                    ctx.font='12px "Segoe UI", sans-serif';
                    ctx.fillText(qd.desc, contentX+20, iy+24);
                }
                yi++;
            }
        }
    }

    if (ui.menu==='build') {
        const entries = Object.entries(DATA.BUILDINGS);
        let curY = contentY + 8;
        let prevTier = 0;
        const tierNames = {1:'⭐ Fondations', 2:'⭐⭐ Communauté', 3:'⭐⭐⭐ Village', 4:'⭐⭐⭐⭐ Prestige'};
        entries.forEach(([key, b], i) => {
            // Tier header
            if (b.tier !== prevTier) {
                prevTier = b.tier;
                if (curY + 20 > my+mh-30) return;
                if (curY > contentY+8) {
                    ctx.fillStyle='rgba(196,168,130,0.2)';
                    ctx.fillRect(contentX-5, curY, contentW, 1);
                    curY += 6;
                }
                ctx.fillStyle='rgba(196,168,130,0.6)';
                ctx.font='bold 11px "Segoe UI", sans-serif';
                ctx.fillText(tierNames[b.tier]||`Tier ${b.tier}`, contentX, curY+10);
                curY += 18;
            }
            if (curY + 32 > my+mh-30) return;
            const sel = i === ui.menuIndex;
            const unlocked = G.isBuildingUnlocked ? G.isBuildingUnlocked(key) : true;
            let canAfford = true;
            const costStr = Object.entries(b.cost).map(([k,v]) => {
                if ((s.inventory[k]||0) < v) canAfford = false;
                return `${DATA.ITEMS[k]?.name||k}:${v}`;
            }).join(', ');
            if (sel) { ctx.fillStyle='rgba(200,180,140,0.2)'; ctx.fillRect(contentX-5, curY-4, contentW, 30); }
            if (!unlocked) ctx.globalAlpha = 0.45;
            ctx.fillStyle = !unlocked ? '#A89070' : canAfford ? (sel?'#F5E6D3':'#C4A882') : '#886666';
            ctx.font = 'bold 13px "Segoe UI", sans-serif';
            ctx.fillText((sel?'▶ ':'')+b.name, contentX, curY+8);
            if (!unlocked) {
                let hint = [];
                if (b.requires.happiness) hint.push(`♥ ${b.requires.happiness}`);
                if (b.requires.buildings) hint.push(`${b.requires.buildings} bâtiments`);
                if (b.requires.built_one_of) hint.push(`après: ${b.requires.built_one_of.join('/')}`);
                ctx.fillStyle = '#887766';
                ctx.font = '10px "Segoe UI", sans-serif';
                ctx.fillText(`🔒 Débloque avec ${hint.join(', ')}`, contentX+20, curY+21);
            } else {
                ctx.fillStyle = canAfford ? '#A89070' : '#886666';
                ctx.font = '11px "Segoe UI", sans-serif';
                ctx.fillText(`Coût: ${costStr}  ·  ♥ +${b.happiness}${b.attractsVillagers?' · +'+b.attractsVillagers+' hab.':''}`, contentX+20, curY+21);
            }
            ctx.globalAlpha = 1;
            curY += 32;
        });
        ctx.fillStyle='#C4A882'; ctx.font='11px "Segoe UI", sans-serif';
        ctx.fillText('[↑↓] Choisir  [Espace] Construire  [Echap] Fermer', contentX, my+mh-12);
    }

    if (ui.menu==='garden') {
        s.garden.plots.forEach((p,i) => {
            const col = i%4, row = Math.floor(i/4);
            const gx = contentX+col*170, gy = contentY+10+row*185;
            const sel = i===ui.gardenIndex;
            // Card bg
            ctx.fillStyle = sel?'rgba(200,180,140,0.22)':'rgba(80,60,40,0.28)';
            ctx.beginPath(); ctx.roundRect(gx,gy,158,170,7); ctx.fill();
            if (sel) {
                ctx.strokeStyle='#E8C850'; ctx.lineWidth=2;
                ctx.beginPath(); ctx.roundRect(gx,gy,158,170,7); ctx.stroke();
            }
            // Plot soil preview area
            ctx.fillStyle='#7D5F35'; ctx.beginPath(); ctx.roundRect(gx+8,gy+8,142,82,4); ctx.fill();
            // Soil texture rows
            ctx.fillStyle='rgba(0,0,0,0.12)';
            for (let r=0;r<3;r++) ctx.fillRect(gx+12, gy+12+r*26, 134, 3);
            if (p.crop && p.stage>0) G.drawCrop(ctx, gx+54, gy+8, 50, p.crop, p.stage);
            // Stage badge
            if (p.crop) {
                const stageColors = ['','#C8A060','#7EC850','#5DA832','#FFD700','#FF8800'];
                ctx.fillStyle = stageColors[p.stage]||'#C4A882';
                ctx.beginPath(); ctx.roundRect(gx+8,gy+94,48,14,7); ctx.fill();
                ctx.fillStyle='#1A0F08'; ctx.font='bold 11px "Segoe UI", sans-serif'; ctx.textAlign='center';
                ctx.fillText(DATA.CROP_STAGES[p.stage]||'?', gx+32, gy+104);
                ctx.textAlign='left';
            }
            // Crop name
            ctx.fillStyle = p.crop ? '#F5E6D3' : '#A89070';
            ctx.font = 'bold 12px "Segoe UI", sans-serif';
            const cropD = p.crop ? DATA.CROPS[p.crop] : null;
            ctx.fillText(cropD ? cropD.name : 'Parcelle vide', gx+10, gy+122);
            if (p.crop && p.stage>0 && p.stage<5) {
                // Water progress bar
                const needed = cropD ? (cropD.waterPerStage||1) : 1;
                const wc = p.waterCount||0;
                const barW = 138, barH = 8;
                ctx.fillStyle='rgba(91,155,213,0.2)';
                ctx.beginPath(); ctx.roundRect(gx+10,gy+130,barW,barH,4); ctx.fill();
                if (wc > 0) {
                    ctx.fillStyle='rgba(91,155,213,0.85)';
                    ctx.beginPath(); ctx.roundRect(gx+10,gy+130,(barW*wc/needed)|0,barH,4); ctx.fill();
                }
                ctx.fillStyle='rgba(136,204,255,0.7)'; ctx.font='11px "Segoe UI", sans-serif';
                ctx.fillText(`💧 ${wc}/${needed}`, gx+10, gy+152);
                if (sel && wc<needed) {
                    ctx.fillStyle='#7EC850'; ctx.font='bold 11px "Segoe UI", sans-serif';
                    ctx.fillText('[Espace] Arroser', gx+10, gy+165);
                }
            } else if (p.crop && p.stage>=5) {
                ctx.fillStyle='#FFD700'; ctx.font='bold 11px "Segoe UI", sans-serif';
                const sp = Math.sin(G.animTime*4)*1;
                ctx.fillText('✦ Prêt à récolter !', gx+10, gy+140+sp);
                if (sel) ctx.fillText('[Espace] Récolter', gx+10, gy+157);
            } else if (!p.crop) {
                if (sel) { ctx.fillStyle='#7EC850'; ctx.font='11px "Segoe UI", sans-serif'; ctx.fillText('[Espace] Planter', gx+10, gy+140); }
            }
        });
        // Seed selection sub-menu
        if (ui.gardenMode==='plant') {
            const seeds = Object.entries(s.inventory).filter(([k,v])=>v>0&&k.startsWith('graine_'));
            const boxH = Math.max(200, Math.min(340, 80 + seeds.length * 32));
            const boxY = G.H/2 - boxH/2;
            ctx.fillStyle='rgba(42,31,20,0.95)';
            ctx.beginPath(); ctx.roundRect(G.W/2-165, boxY, 330, boxH, 8); ctx.fill();
            ctx.strokeStyle='#C4A882'; ctx.lineWidth=2;
            ctx.beginPath(); ctx.roundRect(G.W/2-165, boxY, 330, boxH, 8); ctx.stroke();
            ctx.fillStyle='#E8C850'; ctx.font='bold 16px "Segoe UI", sans-serif'; ctx.textAlign='center';
            ctx.fillText('Choisir une graine', G.W/2, boxY+26);
            ctx.strokeStyle='rgba(196,168,130,0.25)'; ctx.lineWidth=1;
            ctx.beginPath(); ctx.moveTo(G.W/2-150, boxY+38); ctx.lineTo(G.W/2+150, boxY+38); ctx.stroke();
            ctx.textAlign='left';
            const seasonsFr = { printemps: 'Prin.', ete: 'Été', automne: 'Aut.', hiver: 'Hiver' };
            if (seeds.length===0) {
                ctx.fillStyle='#C4A882'; ctx.font='14px "Segoe UI", sans-serif'; ctx.textAlign='center';
                ctx.fillText('Aucune graine disponible !', G.W/2, boxY+80);
                ctx.textAlign='left';
            }
            seeds.forEach(([key,qty],i) => {
                const iy = boxY + 52 + i*30;
                const sel2 = i===ui.cropSelect;
                const item = DATA.ITEMS[key];
                const crop = item?.crop ? DATA.CROPS[item.crop] : null;
                const canPlant = crop && crop.season ? crop.season.includes(s.season) : true;
                if (sel2) {
                    ctx.fillStyle='rgba(200,180,140,0.2)'; ctx.beginPath();
                    ctx.roundRect(G.W/2-155, iy-8, 310, 26, 4); ctx.fill();
                    ctx.strokeStyle='rgba(232,200,80,0.4)'; ctx.lineWidth=1;
                    ctx.beginPath(); ctx.roundRect(G.W/2-155, iy-8, 310, 26, 4); ctx.stroke();
                }
                ctx.fillStyle=item?.icon||'#AAA';
                ctx.beginPath(); ctx.arc(G.W/2-138, iy+5, 6, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = !canPlant ? '#885555' : (sel2?'#F5E6D3':'#C4A882');
                ctx.font='13px "Segoe UI", sans-serif';
                const seasonTag = crop&&crop.season ? ` · ${crop.season.map(ss=>seasonsFr[ss]||ss).join('/')}` : '';
                ctx.fillText(`${item?.name||key}  x${qty}${seasonTag}`, G.W/2-122, iy+9);
                if (!canPlant) {
                    ctx.fillStyle='rgba(255,80,80,0.7)'; ctx.font='11px "Segoe UI", sans-serif';
                    ctx.fillText('hors saison', G.W/2+60, iy+9);
                }
            });
            ctx.fillStyle='rgba(196,168,130,0.45)'; ctx.font='11px "Segoe UI", sans-serif'; ctx.textAlign='center';
            ctx.fillText('[↑↓] Choisir  [Espace] Planter  [Échap] Annuler', G.W/2, boxY+boxH-10);
            ctx.textAlign='left';
        }
        ctx.fillStyle='#C4A882'; ctx.font='12px "Segoe UI", sans-serif'; ctx.textAlign='left';
        ctx.fillText('[Fleches] Naviguer  [Espace] Action  [Echap] Fermer', contentX, my+mh-15);
    }

    if (ui.menu==='map') {
        const mapCx=G.W/2, mapCy=G.H/2+14, scale=5.5;
        const sc2 = DATA.SEASON_COLORS[s.season];
        // Map background panel
        ctx.fillStyle = sc2.grass;
        ctx.beginPath(); ctx.roundRect(mx+20,my+50,mw-40,mh-70,8); ctx.fill();
        ctx.strokeStyle='rgba(196,168,130,0.3)'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.roundRect(mx+20,my+50,mw-40,mh-70,8); ctx.stroke();

        // Commune road connections (draw first, behind dots)
        const communeList = Object.entries(DATA.COMMUNES);
        ctx.strokeStyle='rgba(180,150,100,0.35)'; ctx.lineWidth=1.5; ctx.setLineDash([4,5]);
        for (let i=0;i<communeList.length;i++) {
            for (let j=i+1;j<communeList.length;j++) {
                const [,ca]=communeList[i], [,cb]=communeList[j];
                const dist2 = G.dist(ca.cx,ca.cy,cb.cx,cb.cy);
                if (dist2 < 35) { // draw path between close communes
                    const ax=mapCx+(ca.cx-DATA.MAP_W/2)*scale, ay=mapCy+(ca.cy-DATA.MAP_H/2)*scale;
                    const bx2=mapCx+(cb.cx-DATA.MAP_W/2)*scale, by2=mapCy+(cb.cy-DATA.MAP_H/2)*scale;
                    ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(bx2,by2); ctx.stroke();
                }
            }
        }
        ctx.setLineDash([]);

        // River
        ctx.strokeStyle='#5B9BD5'; ctx.lineWidth=3.5;
        ctx.beginPath();
        ctx.moveTo(mapCx+41*scale-DATA.MAP_W/2*scale, mapCy+0*scale-DATA.MAP_H/2*scale);
        ctx.lineTo(mapCx+40*scale-DATA.MAP_W/2*scale, mapCy+60*scale-DATA.MAP_H/2*scale);
        ctx.stroke();

        // Communes
        for (const [k,c] of Object.entries(DATA.COMMUNES)) {
            const cx2 = mapCx+(c.cx-DATA.MAP_W/2)*scale;
            const cy2 = mapCy+(c.cy-DATA.MAP_H/2)*scale;
            const visited = s.visitedCommunes.includes(k);
            // Drop shadow
            ctx.fillStyle='rgba(0,0,0,0.25)';
            ctx.beginPath(); ctx.arc(cx2+1,cy2+2,13,0,Math.PI*2); ctx.fill();
            ctx.fillStyle = visited ? c.color : '#555';
            ctx.beginPath(); ctx.arc(cx2,cy2,13,0,Math.PI*2); ctx.fill();
            // Glow ring for visited
            if (visited) {
                ctx.strokeStyle=c.color; ctx.lineWidth=2; ctx.globalAlpha=0.35;
                ctx.beginPath(); ctx.arc(cx2,cy2,17,0,Math.PI*2); ctx.stroke();
                ctx.globalAlpha=1;
            }
            ctx.strokeStyle = visited?'rgba(255,255,255,0.5)':'#444'; ctx.lineWidth=1;
            ctx.beginPath(); ctx.arc(cx2,cy2,13,0,Math.PI*2); ctx.stroke();
            ctx.fillStyle=visited?'#FFF':'#888'; ctx.font='bold 11px "Segoe UI", sans-serif'; ctx.textAlign='center';
            ctx.fillText(c.name.split(' ')[0].split('-')[0], cx2, cy2+3);
            // Unvisited label
            if (!visited) {
                ctx.fillStyle='rgba(180,150,100,0.6)'; ctx.font='10px "Segoe UI", sans-serif';
                ctx.fillText('?', cx2, cy2+3);
            }
        }

        // Player marker with pulsing ring
        const ppx = mapCx+(s.player.x-DATA.MAP_W/2)*scale;
        const ppy = mapCy+(s.player.y-DATA.MAP_H/2)*scale;
        const pulse2 = 5+Math.sin(G.animTime*3)*2;
        ctx.strokeStyle='rgba(255,80,80,0.45)'; ctx.lineWidth=2;
        ctx.beginPath(); ctx.arc(ppx,ppy,pulse2,0,Math.PI*2); ctx.stroke();
        ctx.fillStyle='#FF5555';
        ctx.beginPath(); ctx.arc(ppx,ppy,5,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle='#FFF'; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.arc(ppx,ppy,5,0,Math.PI*2); ctx.stroke();

        // Legend
        ctx.textAlign='left';
        const visited = s.visitedCommunes.length;
        ctx.fillStyle=visited>=8?'#88CC66':'#C4A882'; ctx.font='12px "Segoe UI", sans-serif';
        ctx.fillText(`Communes visitées: ${visited}/8  ${visited>=8?'✓':''}`, contentX, my+mh-20);
        ctx.fillStyle='rgba(196,168,130,0.5)'; ctx.font='11px "Segoe UI", sans-serif';
        ctx.fillText('● Vous   ○ Non visitée', contentX+220, my+mh-20);
        ctx.textAlign='left';
    }

    if (ui.menu==='relations') {
        const npcs = DATA.NPCS;
        const cols = 3;
        const cardW = Math.floor(contentW / cols) - 8;
        const cardH = 100;
        npcs.forEach((npc, i) => {
            const col2 = i % cols;
            const row = Math.floor(i / cols);
            const cx2 = contentX + col2 * (cardW + 8);
            const cy2 = contentY + 10 + row * (cardH + 8);
            if (cy2 + cardH > my+mh-30) return;
            const rel = G.getFriendship(npc.id);
            const stateNpc = s.npcs ? s.npcs.find(n => n.id === npc.id) : null;
            // Card bg
            const cardAlpha = rel.level >= 3 ? 'rgba(80,55,10,0.5)' : rel.level >= 1 ? 'rgba(60,40,20,0.45)' : 'rgba(40,28,16,0.35)';
            ctx.fillStyle = cardAlpha;
            ctx.beginPath(); ctx.roundRect(cx2, cy2, cardW, cardH, 6); ctx.fill();
            ctx.strokeStyle = rel.level >= 3 ? '#FFD700' : rel.level >= 2 ? '#FF6688' : rel.level >= 1 ? 'rgba(255,180,180,0.4)' : 'rgba(196,168,130,0.2)';
            ctx.lineWidth = rel.level >= 1 ? 1.5 : 1;
            ctx.beginPath(); ctx.roundRect(cx2, cy2, cardW, cardH, 6); ctx.stroke();
            // Portrait
            const pr2 = 24;
            const pcx3 = cx2 + pr2 + 10;
            const pcy3 = cy2 + cardH/2;
            ctx.fillStyle = 'rgba(60,40,20,0.7)';
            ctx.beginPath(); ctx.arc(pcx3, pcy3, pr2, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = rel.level >= 3 ? '#FFD700' : rel.level >= 2 ? '#FF4466' : '#C4A882';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(pcx3, pcy3, pr2, 0, Math.PI*2); ctx.stroke();
            G.drawChar(ctx, pcx3-pr2*0.5, pcy3-pr2*0.9, pr2, npc.color, npc.hair, 'down', 0);
            // Name
            const tx3 = cx2 + pr2*2 + 18;
            ctx.fillStyle = rel.level >= 1 ? '#F5E6D3' : '#A89070';
            ctx.font = 'bold 12px "Segoe UI", sans-serif';
            ctx.fillText(npc.name.split(' ')[0], tx3, cy2+20);
            ctx.fillStyle = 'rgba(196,168,130,0.65)';
            ctx.font = 'italic 10px "Segoe UI", sans-serif';
            const commune = DATA.COMMUNES[npc.commune];
            ctx.fillText(commune ? commune.name.split('-')[0] : '', tx3, cy2+34);
            // Friendship hearts
            const heartColors2 = ['#555','#FF9BAA','#FF4466','#FFD700'];
            ctx.fillStyle = heartColors2[rel.level] || '#555';
            ctx.font = '13px "Segoe UI", sans-serif';
            const hearts2 = rel.level > 0 ? '♥'.repeat(rel.level)+'♡'.repeat(3-rel.level) : '♡♡♡';
            ctx.fillText(hearts2, tx3, cy2+54);
            // Friendship label
            const fLabels = ['Inconnu(e)','Connaissance ♡','Ami(e) ♥','Meilleur(e) ami(e) ♥♥'];
            ctx.fillStyle = heartColors2[rel.level] || '#555';
            ctx.font = '10px "Segoe UI", sans-serif';
            ctx.fillText(fLabels[rel.level]||'Inconnu(e)', tx3, cy2+68);
            // Met status
            if (stateNpc && !stateNpc.talked) {
                ctx.fillStyle = 'rgba(255,215,0,0.65)';
                ctx.font = '9px "Segoe UI", sans-serif';
                ctx.fillText('! À rencontrer', tx3, cy2+84);
            } else if (rel.trades > 0) {
                ctx.fillStyle = 'rgba(196,168,130,0.4)';
                ctx.font = '9px "Segoe UI", sans-serif';
                ctx.fillText(`${rel.trades} échange(s)`, tx3, cy2+84);
            }
        });
        ctx.fillStyle='#C4A882'; ctx.font='11px "Segoe UI", sans-serif';
        ctx.fillText('[R] ou [Echap] Fermer', contentX, my+mh-12);
    }

    // Escape hint
    if (ui.menu!=='garden' || ui.gardenMode!=='plant') {
        ctx.fillStyle='rgba(245,230,211,0.4)'; ctx.font='11px "Segoe UI", sans-serif';
        ctx.textAlign='right';
        ctx.fillText('[Echap] Fermer', mx+mw-15, my+mh-8);
        ctx.textAlign='left';
    }
};

G.renderNotification = function() {
    const el = document.getElementById('notification');
    if (G.notifTimer > 0) {
        el.classList.remove('hidden');
        el.textContent = G.state.ui.notification || '';
    } else {
        el.classList.add('hidden');
    }
};

G.renderHUD = function() {
    const s = G.state;
    const communeName = G.getCommuneName(s.player.x, s.player.y);
    document.getElementById('hud-commune').textContent = '📍 ' + communeName;
    const seasonIcons = {printemps:'🌱',ete:'☀',automne:'🍂',hiver:'❄'};
    const seasonNames = {printemps:'Printemps',ete:'Été',automne:'Automne',hiver:'Hiver'};
    document.getElementById('hud-season').textContent = (seasonIcons[s.season]||'') + ' ' + (seasonNames[s.season]||s.season);
    document.getElementById('hud-turn').textContent = 'Tour ' + s.turn;
    document.getElementById('hud-happiness').textContent = '♥ ' + s.happiness;
    document.getElementById('hud-villagers').textContent = '⌂ ' + s.villagers + '/' + DATA.GOAL_VILLAGERS;
    const hint = G.getVillagerHint();
    document.getElementById('hud-hint').textContent = hint ? '💬 ' + hint : '';
};

G.renderVictoryScreen = function() {
    const ctx = G.ctx, w = G.W, h = G.H, t = G.animTime;

    // D'abord afficher le jeu en fond
    G.renderGame();

    // Fond vert semi-transparent
    ctx.fillStyle = 'rgba(40, 120, 40, 0.75)';
    ctx.fillRect(0, 0, w, h);

    // Particules festives
    for (let i = 0; i < 20; i++) {
        const px = (Math.sin(t * 0.4 + i * 1.7) * w * 0.4 + w / 2) | 0;
        const py = (Math.sin(t * 0.6 + i * 2.3) * h * 0.35 + h / 2) | 0;
        ctx.fillStyle = DATA.FLOWER_COLORS[i % DATA.FLOWER_COLORS.length];
        ctx.globalAlpha = 0.5 + Math.sin(t * 2 + i) * 0.3;
        ctx.beginPath();
        ctx.arc(px, py, 4 + Math.sin(t + i) * 2, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Titre de felicitations
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Ombre
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.font = 'bold 48px "Segoe UI", sans-serif';
    ctx.fillText('FELICITATIONS!', w / 2 + 3, h * 0.25 + 3);
    // Texte
    ctx.fillStyle = '#FFD700';
    ctx.fillText('FELICITATIONS!', w / 2, h * 0.25);

    ctx.fillStyle = '#F5E6D3';
    ctx.font = '24px "Segoe UI", sans-serif';
    ctx.fillText('La Grande Fete du Village bat son plein!', w / 2, h * 0.35);

    ctx.font = '20px "Segoe UI", sans-serif';
    ctx.fillText('Athis-Val-de-Rouvre est devenu un village', w / 2, h * 0.45);
    ctx.fillText('prospere et heureux grace a vous!', w / 2, h * 0.50);

    // Stats
    const s = G.state;
    ctx.fillStyle = '#E8C850';
    ctx.font = '18px "Segoe UI", sans-serif';
    ctx.fillText(`${s.villagers} habitants  |  ${s.happiness} bonheur  |  ${s.totalBuildings} batiments  |  Tour ${s.turn}`, w / 2, h * 0.60);

    // Bouton Rejouer
    const btnX = w / 2 - 120, btnY = h * 0.72, btnW = 240, btnH = 50;
    const hover = G.mouse.x > btnX && G.mouse.x < btnX + btnW && G.mouse.y > btnY && G.mouse.y < btnY + btnH;
    ctx.fillStyle = hover ? 'rgba(42,31,20,0.95)' : 'rgba(42,31,20,0.8)';
    ctx.beginPath();
    ctx.roundRect(btnX, btnY, btnW, btnH, 10);
    ctx.fill();
    ctx.strokeStyle = '#C4A882';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(btnX, btnY, btnW, btnH, 10);
    ctx.stroke();
    ctx.fillStyle = '#F5E6D3';
    ctx.font = hover ? 'bold 22px "Segoe UI", sans-serif' : '20px "Segoe UI", sans-serif';
    ctx.fillText('Rejouer', w / 2, btnY + btnH / 2);

    // Footer
    ctx.fillStyle = 'rgba(245,230,211,0.5)';
    ctx.font = '14px "Segoe UI", sans-serif';
    ctx.fillText('Merci d\'avoir joue!', w / 2, h * 0.88);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
};
