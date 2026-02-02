// ============================================================
//  DATA.JS — Données statiques du jeu
//  Les Huit Communes ~ Athis-Val-de-Rouvre
// ============================================================

const DATA = {
    MAP_W: 80,
    MAP_H: 60,
    TILE: 32,
    GOAL_VILLAGERS: 100,

    // --- Tiles ---
    TILES: {
        GRASS: 0, TALL_GRASS: 1, FLOWERS: 2, PATH: 3, ROAD: 4,
        WATER: 5, DEEP_WATER: 6, TREE: 7, DENSE_TREE: 8, ROCK: 9,
        FLOOR: 10, WALL: 11, BRIDGE: 12, FENCE: 13,
        GARDEN_SOIL: 14, WHEAT: 15, SAND: 16, BUSH: 17,
        ROOF_RED: 18, ROOF_BLUE: 19, DOOR: 20, SIGN: 21,
        BIKE_PATH: 22, BENCH: 23, WELL: 24, CHAPEL: 25
    },

    WALKABLE: new Set([0, 1, 2, 3, 4, 12, 14, 16, 20, 22, 23]),

    TILE_COLORS: {
        0:  ['#7EC850','#72B847','#84CE58'],
        1:  ['#6AAF3D','#5E9E35','#74BA45'],
        2:  ['#7EC850','#7EC850','#7EC850'],
        3:  ['#D4A574','#C89B6B','#DEAD7E'],
        4:  ['#B8A08A','#A89478','#C2AA94'],
        5:  ['#5B9BD5','#4F8BC5','#67A5DF'],
        6:  ['#3A7BBF','#2E6BAF','#4685C9'],
        7:  ['#7EC850','#7EC850','#7EC850'],
        8:  ['#5DA832','#5DA832','#5DA832'],
        9:  ['#A0A0A0','#909090','#B0B0B0'],
        10: ['#E8D5C0','#DEC8B2','#F2E0CE'],
        11: ['#C4A882','#B89B75','#D0B58F'],
        12: ['#B8956A','#A88560','#C8A574'],
        13: ['#8B6E4E','#7D6345','#996F57'],
        14: ['#8B6B3E','#7D5F35','#997747'],
        15: ['#E8D060','#DCC450','#F0DC6A'],
        16: ['#E8D5A0','#DEC990','#F2DFB0'],
        17: ['#5DA832','#5DA832','#5DA832'],
        18: ['#C65D3E','#B85235','#D06847'],
        19: ['#4A6FA5','#3F6298','#557CB2'],
        20: ['#8B6E4E','#7D6345','#996F57'],
        21: ['#D4A574','#D4A574','#D4A574'],
        22: ['#A0C8A0','#90B890','#B0D8B0'],
        23: ['#8B6E4E','#8B6E4E','#8B6E4E'],
        24: ['#909090','#909090','#909090'],
        25: ['#D0C0A0','#D0C0A0','#D0C0A0'],
    },

    // --- Les 8 vraies communes ---
    COMMUNES: {
        'athis': {
            name: 'Athis-de-l\'Orne',
            cx: 40, cy: 32,
            desc: 'Le bourg principal, coeur vivant de la communaute.',
            terrain: 'village',
            color: '#E8C850'
        },
        'ronfeugerai': {
            name: 'Ronfeugerai',
            cx: 40, cy: 8,
            desc: 'Un hameau tranquille au bord de la riviere.',
            terrain: 'valley',
            color: '#5B9BD5'
        },
        'carneille': {
            name: 'La Carneille',
            cx: 14, cy: 10,
            desc: 'Forets profondes et collines boisees.',
            terrain: 'forest',
            color: '#2D7A2D'
        },
        'taillebois': {
            name: 'Taillebois',
            cx: 8, cy: 38,
            desc: 'Au coeur de la foret, un havre de paix pour la faune.',
            terrain: 'deep_forest',
            color: '#1B5E1B'
        },
        'segrie': {
            name: 'Segrie-Fontaine',
            cx: 20, cy: 52,
            desc: 'Celebre pour ses sources et ses prairies fleuries.',
            terrain: 'meadow',
            color: '#FF88AA'
        },
        'breel': {
            name: 'Breel',
            cx: 65, cy: 12,
            desc: 'De vastes champs dores et des fermes accueillantes.',
            terrain: 'farmland',
            color: '#E8D060'
        },
        'tourailles': {
            name: 'Les Tourailles',
            cx: 72, cy: 35,
            desc: 'Un plateau venteux avec un panorama splendide.',
            terrain: 'highland',
            color: '#A0A0A0'
        },
        'ndrocher': {
            name: 'Notre-Dame-du-Rocher',
            cx: 58, cy: 50,
            desc: 'Rochers imposants et une chapelle historique.',
            terrain: 'rocky',
            color: '#B0A090'
        }
    },

    // --- Crops (waterPerStage = arrosages necessaires par stade) ---
    CROPS: {
        tomate:    { name: 'Tomates',         icon: '#FF4444', growTime: 4, season: ['ete'],             waterPerStage: 2, sellValue: 3 },
        carotte:   { name: 'Carottes',         icon: '#FF8800', growTime: 3, season: ['printemps','ete'], waterPerStage: 1, sellValue: 2 },
        salade:    { name: 'Salades',          icon: '#88DD44', growTime: 2, season: ['printemps'],       waterPerStage: 1, sellValue: 2 },
        courgette: { name: 'Courgettes',       icon: '#44AA22', growTime: 4, season: ['ete'],             waterPerStage: 2, sellValue: 3 },
        patate:    { name: 'Pommes de terre',  icon: '#C8A060', growTime: 5, season: ['printemps','ete'], waterPerStage: 1, sellValue: 4 },
        fraise:    { name: 'Fraises',          icon: '#FF3366', growTime: 3, season: ['printemps','ete'], waterPerStage: 2, sellValue: 5 },
        tournesol: { name: 'Tournesols',       icon: '#FFD700', growTime: 5, season: ['ete'],             waterPerStage: 2, sellValue: 6 },
        citrouille:{ name: 'Citrouilles',      icon: '#FF6600', growTime: 6, season: ['automne'],         waterPerStage: 2, sellValue: 7 },
    },

    CROP_STAGES: ['vide', 'seme', 'pousse', 'grandit', 'floraison', 'pret'],

    // --- Buildings (produces = ressources generees tous les produceTurns tours) ---
    BUILDINGS: {
        bike_path:  { name: 'Piste cyclable',   cost: {bois:3, pierre:2}, happiness: 3, desc: 'Un chemin vert pour les velos!' },
        bench:      { name: 'Banc public',       cost: {bois:2},           happiness: 1, desc: 'Pour se reposer et admirer le paysage.' },
        garden:     { name: 'Jardin partage',    cost: {bois:2, pierre:1}, happiness: 2, desc: 'Un espace fleuri pour tous.' },
        guesthouse: { name: 'Maison d\'hotes',   cost: {bois:5, pierre:5}, happiness: 4, desc: 'Accueille de nouveaux habitants.',
                      produces: {bois:1, pierre:1}, produceTurns: 15 },
        bakery:     { name: 'Boulangerie',       cost: {bois:4, pierre:4}, happiness: 5, desc: 'Du bon pain frais chaque matin!',
                      produces: {bois:1}, produceTurns: 12 },
        library:    { name: 'Bibliotheque',      cost: {bois:4, pierre:3}, happiness: 4, desc: 'Le savoir a portee de tous.',
                      produces: {pierre:1}, produceTurns: 12 },
        duck_pond:  { name: 'Mare aux canards',  cost: {pierre:3},         happiness: 3, desc: 'Coin-coin! Attire la faune.' },
        windmill:   { name: 'Moulin',            cost: {bois:6, pierre:4}, happiness: 5, desc: 'Transforme le ble en farine.',
                      produces: {bois:2}, produceTurns: 15 },
        fountain:   { name: 'Fontaine',          cost: {pierre:5},         happiness: 4, desc: 'Un point d\'eau rafraichissant.',
                      produces: {pierre:1}, produceTurns: 15 },
        flowerbed:  { name: 'Massif fleuri',     cost: {bois:1},           happiness: 2, desc: 'Des couleurs pour egayer le village.' },
    },

    // --- Items ---
    ITEMS: {
        bois:       { name: 'Bois',         icon: '#8B6E4E', desc: 'Du bois de construction.' },
        pierre:     { name: 'Pierre',       icon: '#909090', desc: 'De la bonne pierre solide.' },
        graine_t:   { name: 'Graines tomate',    icon: '#FF4444', crop: 'tomate' },
        graine_c:   { name: 'Graines carotte',   icon: '#FF8800', crop: 'carotte' },
        graine_s:   { name: 'Graines salade',    icon: '#88DD44', crop: 'salade' },
        graine_co:  { name: 'Graines courgette', icon: '#44AA22', crop: 'courgette' },
        graine_p:   { name: 'Graines patate',    icon: '#C8A060', crop: 'patate' },
        graine_f:   { name: 'Graines fraise',    icon: '#FF3366', crop: 'fraise' },
        graine_to:  { name: 'Graines tournesol', icon: '#FFD700', crop: 'tournesol' },
        graine_ci:  { name: 'Graines citrouille',icon: '#FF6600', crop: 'citrouille' },
        fleur:      { name: 'Fleurs',       icon: '#FF88AA', desc: 'Un joli bouquet.' },
        champignon: { name: 'Champignons',  icon: '#C4A060', desc: 'Des champignons forestiers.' },
        poisson:    { name: 'Poisson',      icon: '#5B9BD5', desc: 'Un beau poisson.' },
        miel:       { name: 'Miel',         icon: '#FFB347', desc: 'Du miel dore et sucre.' },
        pomme:      { name: 'Pommes',       icon: '#FF4444', desc: 'De belles pommes normandes.' },
        herbes:     { name: 'Herbes',       icon: '#66BB66', desc: 'Des herbes aromatiques.' },
    },

    // --- NPCs ---
    NPCS: [
        { id:'maire', name:'Marcel le Maire', commune:'athis', rx:2, ry:0, color:'#4A6FA5', hair:'#808080',
          dialogue: [
              'Bienvenue a Athis-Val-de-Rouvre, cher ami!',
              'Notre reve : attirer 100 habitants dans nos huit communes.',
              'Voici des graines et des materiaux pour bien demarrer.',
              'Explorez, cultivez, construisez... les gens viendront!',
              'Parlez aux habitants, ils echangent des recoltes contre des materiaux.',
          ],
          gives: { graine_t:3, graine_c:3, graine_s:3, graine_p:2, bois:8, pierre:5 },
          quest: 'welcome'
        },
        { id:'fermiere', name:'Josette la Fermiere', commune:'breel', rx:-1, ry:1, color:'#DD6644', hair:'#C8A060',
          dialogue: [
              'Bonjour! Les champs de Breel sont les plus beaux de Normandie!',
              'Ramenez-moi des tomates et je vous donnerai des graines rares.',
          ],
          gives: { graine_co:3, graine_to:2 },
          quest: 'fermiere',
          trade: { want:'tomate', wantQty:2, give:'graine_co', giveQty:2, give2:'graine_ci', giveQty2:1,
                   msg:'Mmh, belles tomates! Voici des graines en echange.' }
        },
        { id:'bucheron', name:'Henri le Bucheron', commune:'carneille', rx:1, ry:1, color:'#AA4444', hair:'#4A2810',
          dialogue: [
              'La foret de La Carneille est magnifique, non?',
              'Apportez-moi des patates et je vous coupe du bois!',
          ],
          gives: { bois:5 },
          quest: 'bucheron',
          trade: { want:'patate', wantQty:2, give:'bois', giveQty:4,
                   msg:'Des patates! J\'adore. Voila du bon bois pour vous!' }
        },
        { id:'herboriste', name:'Madeleine l\'Herboriste', commune:'segrie', rx:-1, ry:-1, color:'#88AA44', hair:'#AA6633',
          dialogue: [
              'Les sources de Segrie-Fontaine ont des vertus extraordinaires!',
              'Ramenez-moi des carottes, je vous donne mes meilleures herbes.',
          ],
          gives: { herbes:3, graine_f:3 },
          quest: 'herboriste',
          trade: { want:'carotte', wantQty:3, give:'herbes', giveQty:2, give2:'graine_f', giveQty2:1,
                   msg:'Des carottes fraiches! Tenez, herbes et graines de fraises.' }
        },
        { id:'pecheur', name:'Robert le Pecheur', commune:'ronfeugerai', rx:1, ry:2, color:'#5588AA', hair:'#444444',
          dialogue: [
              'La riviere de Ronfeugerai est pleine de truites!',
              'Apportez-moi du miel, le poisson adore ca comme appat!',
          ],
          gives: { poisson:2, bois:2 },
          quest: 'pecheur',
          trade: { want:'miel', wantQty:1, give:'poisson', giveQty:3,
                   msg:'Du miel! Mes truites vont adorer. Voici du poisson frais!' }
        },
        { id:'garde', name:'Sylvie la Garde', commune:'taillebois', rx:0, ry:1, color:'#557744', hair:'#884422',
          dialogue: [
              'Chut... Regardez la-bas, un cerf! Taillebois est un sanctuaire.',
              'Apportez-moi des champignons, je vous troque du bois.',
          ],
          quest: 'garde',
          gives: { bois:3 },
          trade: { want:'champignon', wantQty:2, give:'bois', giveQty:3,
                   msg:'Merci pour les champignons! Voici du bois mort ramasse.' }
        },
        { id:'meunier', name:'Augustin le Meunier', commune:'tourailles', rx:-2, ry:0, color:'#887766', hair:'#DDCC99',
          dialogue: [
              'Des Tourailles, on voit tout le pays! Quel panorama!',
              'Ramenez-moi des salades, je vous donne de la pierre.',
          ],
          gives: { graine_ci:2, pierre:3 },
          quest: 'meunier',
          trade: { want:'salade', wantQty:2, give:'pierre', giveQty:3,
                   msg:'Des salades! Parfait pour le dejeuner. Voici de la pierre.' }
        },
        { id:'soeur', name:'Soeur Therese', commune:'ndrocher', rx:0, ry:-1, color:'#555555', hair:'#FFFFFF',
          dialogue: [
              'La chapelle de Notre-Dame veille sur la vallee depuis des siecles.',
              'Si vous avez des citrouilles, je les echange contre de la pierre.',
          ],
          gives: { pierre:5 },
          quest: 'soeur',
          trade: { want:'citrouille', wantQty:1, give:'pierre', giveQty:4,
                   msg:'Une citrouille pour la soupe! Voici de belles pierres.' }
        },
        { id:'apiculteur', name:'Paul l\'Apiculteur', commune:'athis', rx:-4, ry:3, color:'#DDAA33', hair:'#664422',
          dialogue: [
              'Mes abeilles produisent le meilleur miel de la region!',
              'Ramenez-moi des fraises et je vous donne bois et pierre!',
          ],
          gives: { miel:3 },
          trade: { want:'fraise', wantQty:2, give:'bois', giveQty:2, give2:'pierre', giveQty2:2,
                   msg:'Des fraises! Mes abeilles vont se regaler. Tenez!' }
        },
    ],

    // --- Wildlife ---
    WILDLIFE: {
        cerf:      { name: 'Cerf',      color: '#AA7744', size: 1.2, speed: 0.3, communes: ['taillebois','carneille'] },
        biche:     { name: 'Biche',     color: '#BB8855', size: 1.0, speed: 0.3, communes: ['taillebois','carneille','segrie'] },
        lapin:     { name: 'Lapin',     color: '#C8B090', size: 0.5, speed: 0.6, communes: ['all'] },
        ecureuil:  { name: 'Ecureuil',  color: '#CC6633', size: 0.4, speed: 0.7, communes: ['carneille','taillebois','athis'] },
        renard:    { name: 'Renard',    color: '#DD6622', size: 0.8, speed: 0.4, communes: ['taillebois','carneille','breel'] },
        herisson:  { name: 'Herisson',  color: '#887755', size: 0.4, speed: 0.2, communes: ['all'] },
        canard:    { name: 'Canard',    color: '#338844', size: 0.5, speed: 0.3, communes: ['ronfeugerai','athis'] },
        papillon:  { name: 'Papillon',  color: '#FF88CC', size: 0.3, speed: 0.8, communes: ['segrie','breel','athis'] },
        chouette:  { name: 'Chouette',  color: '#998877', size: 0.6, speed: 0.2, communes: ['taillebois','ndrocher'] },
        martin:    { name: 'Martin-pecheur', color: '#2288CC', size: 0.4, speed: 0.7, communes: ['ronfeugerai','athis'] },
    },

    // --- Quests ---
    QUESTS: [
        { id:'welcome', name:'Bienvenue a Athis!',
          desc:'Parler au maire pour decouvrir la region.',
          type:'talk', target:'maire',
          reward:{happiness:2},
          rewardText:'Le maire vous a equipe pour demarrer!' },
        { id:'first_harvest', name:'Premiere Recolte',
          desc:'Faire pousser et recolter votre premier legume.',
          type:'harvest', target:1,
          reward:{happiness:3, items:{graine_p:2}},
          rewardText:'Quel bonheur de manger ses propres legumes!' },
        { id:'explorer', name:'Le Sentier des Huit Communes',
          desc:'Visiter les huit communes d\'Athis-Val-de-Rouvre.',
          type:'visit_all',
          reward:{happiness:10, items:{graine_to:3, graine_ci:3}},
          rewardText:'Vous connaissez maintenant tout le pays!' },
        { id:'piste_verte', name:'La Piste Verte',
          desc:'Construire votre premiere piste cyclable.',
          type:'build', target:'bike_path',
          reward:{happiness:5},
          rewardText:'Les cyclistes arrivent deja!' },
        { id:'potager_bonheur', name:'Le Potager du Bonheur',
          desc:'Recolter 5 types de legumes differents.',
          type:'harvest_types', target:5,
          reward:{happiness:8, items:{bois:5, pierre:5}},
          rewardText:'Votre potager est magnifique!' },
        { id:'observation', name:'Observateur de la Nature',
          desc:'Observer 5 especes animales differentes.',
          type:'observe', target:5,
          reward:{happiness:5},
          rewardText:'La faune vous fait confiance maintenant!' },
        { id:'batisseur', name:'Le Grand Batisseur',
          desc:'Construire 5 structures dans le village.',
          type:'build_count', target:5,
          reward:{happiness:10, villagers:2},
          rewardText:'Le village prend forme! De nouveaux habitants arrivent!' },
        { id:'village_fleuri', name:'Village Fleuri',
          desc:'Atteindre 30 points de bonheur.',
          type:'happiness', target:30,
          reward:{villagers:3},
          rewardText:'Athis-Val-de-Rouvre est devenu un village fleuri!' },
        { id:'fermiere', name:'Les Champs de Breel',
          desc:'Visiter Josette a Breel.',
          type:'talk', target:'fermiere',
          reward:{happiness:2},
          rewardText:'Josette vous a offert des graines rares!' },
        { id:'bucheron', name:'Le Bois de La Carneille',
          desc:'Rencontrer Henri dans la foret.',
          type:'talk', target:'bucheron',
          reward:{happiness:2},
          rewardText:'Henri est un bon ami a avoir!' },
        { id:'herboriste', name:'Les Sources de Segrie',
          desc:'Trouver Madeleine pres des sources.',
          type:'talk', target:'herboriste',
          reward:{happiness:2},
          rewardText:'Les herbes de Madeleine sentent merveilleusement bon!' },
        { id:'pecheur', name:'Peche a Ronfeugerai',
          desc:'Aller pecher avec Robert.',
          type:'talk', target:'pecheur',
          reward:{happiness:2},
          rewardText:'Robert est un pecheur hors pair!' },
        { id:'garde', name:'Le Sanctuaire de Taillebois',
          desc:'Rencontrer Sylvie la garde forestiere.',
          type:'talk', target:'garde',
          reward:{happiness:2},
          rewardText:'Taillebois recele des tresors de biodiversite!' },
        { id:'meunier', name:'Le Plateau des Tourailles',
          desc:'Monter voir Augustin aux Tourailles.',
          type:'talk', target:'meunier',
          reward:{happiness:2},
          rewardText:'Quel panorama!' },
        { id:'soeur', name:'La Chapelle du Rocher',
          desc:'Visiter Soeur Therese a la chapelle.',
          type:'talk', target:'soeur',
          reward:{happiness:2},
          rewardText:'Un lieu plein de serenite.' },
        // --- Quete finale, toujours en dernier ---
        { id:'fete', name:'La Grande Fete du Village',
          desc:'Rassembler 3 de chaque legume, inviter les habitants, et parler au Maire!',
          type:'fete_finale',
          isFinal: true,
          reward:{},
          rewardText:'FELICITATIONS! La fete bat son plein! Tout le monde danse!' },
    ],

    // --- Seasons ---
    SEASONS: ['printemps', 'ete', 'automne', 'hiver'],
    SEASON_COLORS: {
        printemps: { grass: '#7EC850', tree: '#4CAF50', sky: '#87CEEB' },
        ete:       { grass: '#5DA832', tree: '#2E7D32', sky: '#64B5F6' },
        automne:   { grass: '#C8A040', tree: '#E65100', sky: '#BCAAA4' },
        hiver:     { grass: '#C8D8C8', tree: '#78909C', sky: '#B0BEC5' },
    },
    TURNS_PER_SEASON: 25,

    FLOWER_COLORS: ['#FF6B8A','#FFB347','#FFE66D','#88DD44','#77CCFF','#CC88FF','#FF88CC','#FFFFFF'],

    // --- Resource spots ---
    RESOURCE_SPOTS: {
        'carneille':    [{rx:-3,ry:2,item:'bois',qty:3},{rx:4,ry:-1,item:'bois',qty:2},{rx:-1,ry:-3,item:'champignon',qty:2}],
        'taillebois':   [{rx:2,ry:-2,item:'bois',qty:3},{rx:-2,ry:3,item:'champignon',qty:2}],
        'tourailles':   [{rx:-3,ry:1,item:'pierre',qty:3},{rx:2,ry:2,item:'pierre',qty:2}],
        'ndrocher':     [{rx:1,ry:-2,item:'pierre',qty:3},{rx:-2,ry:1,item:'pierre',qty:2}],
        'segrie':       [{rx:2,ry:-1,item:'herbes',qty:2},{rx:-2,ry:2,item:'fleur',qty:2}],
        'breel':        [{rx:-3,ry:-1,item:'bois',qty:1},{rx:3,ry:1,item:'graine_p',qty:1}],
        'ronfeugerai':  [{rx:3,ry:0,item:'poisson',qty:2},{rx:-2,ry:2,item:'bois',qty:2}],
        'athis':        [{rx:5,ry:-3,item:'pomme',qty:2}],
    },
};
