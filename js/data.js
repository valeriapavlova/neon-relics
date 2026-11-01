// js/data.js

// =============================================
// DATOS DE LA COLECCIÓN CÁPSULA
// 4 looks (personajes) y sus piezas. Todas las páginas leen de aquí.
// Las rutas de imagen viven solo en este archivo (fotos provisionales,
// se sustituirán por los nuevos personajes AI).
// =============================================

// Looks: cada uno es un personaje con 1–3 piezas (ids de PIECES)
export const LOOKS = [
    {
        id: 'gilded-signal',
        n: '01',
        name: 'Gilded Signal',
        character: 'The Sovereign',
        line: 'Gold that speaks before you do.',
        story: 'A ruler with no throne. She walks into a room and the room rearranges itself around a collar of gold and a red filter on the world.',
        mood: ['Crimson', 'Gold', 'Command'],
        img: 'assets/img/relics/02.webp',
        pieces: ['dominion-collar', 'signal-lenses'],
    },
    {
        id: 'sapphire-clarity',
        n: '02',
        name: 'Sapphire Clarity',
        character: 'The Clear Witness',
        line: 'Seeing clearly, and being seen.',
        story: 'She listens more than she speaks. Two halos of pearl frame the face, so whoever looks at her has to meet her eyes.',
        mood: ['Deep blue', 'Pearl', 'Silence'],
        img: 'assets/img/product/product-3/model_03.webp',
        pieces: ['halo-hoop', 'twin-halos'],
    },
    {
        id: 'obsidian-coil',
        n: '03',
        name: 'Obsidian Coil',
        character: 'The Archivist of Shadows',
        line: 'Power that absorbs light.',
        story: 'He keeps what others forget. A single coil of black stone around the throat, heavy enough to remind him of every name.',
        mood: ['Black', 'Gloss', 'Memory'],
        img: 'assets/img/product/product-5/modelo_05.webp',
        pieces: ['obsidian-choker'],
    },
    {
        id: 'midnight-constellation',
        n: '04',
        name: 'Midnight Constellation',
        character: 'The Night Cartographer',
        line: 'A map of the sky, worn close.',
        story: 'He navigates by stars nobody else can see. The gorget carries a thousand points of light, arranged like a private chart.',
        mood: ['Midnight', 'Sequin', 'Orbit'],
        img: 'assets/img/product/product-1/modelo_01.webp',
        pieces: ['constellation-gorget'],
    },
];

// Piezas: clave = id. `look` apunta al id del look al que pertenece.
// `price` en euros (número), para poder sumar totales.
export const PIECES = {
    'dominion-collar': {
        name: 'Dominion Chain Collar',
        look: 'gilded-signal',
        img: 'assets/img/product/product-2/collar-2.webp',
        price: 1240,
        material: 'Gold-plated brass',
        edition: '1 of 12',
        desc: 'Seven rows of Cuban links that sit high on the throat.',
    },
    'signal-lenses': {
        name: 'Signal Lenses',
        look: 'gilded-signal',
        img: 'assets/img/product/product-2/gafas-2.webp',
        price: 480,
        material: 'Gold frame, red lens',
        edition: '1 of 30',
        desc: 'Filters the world through your own wavelength.',
    },
    'halo-hoop': {
        name: 'Halo Hoop',
        look: 'sapphire-clarity',
        img: 'assets/img/product/product-3/earings_03_01.webp',
        price: 690,
        material: 'Freshwater pearls',
        edition: '1 of 20',
        desc: 'A single oversized hoop, worn on one side only.',
    },
    'twin-halos': {
        name: 'Twin Halos',
        look: 'sapphire-clarity',
        img: 'assets/img/product/product-3/earings_03_02.webp',
        price: 980,
        material: 'Freshwater pearls',
        edition: '1 of 20',
        desc: 'The pair. Symmetry for the days you want to be read.',
    },
    'obsidian-choker': {
        name: 'Obsidian Coil Choker',
        look: 'obsidian-coil',
        img: 'assets/img/product/product-5/collar_05.webp',
        price: 860,
        material: 'Polished obsidian beads',
        edition: '1 of 15',
        desc: 'Five strands of black stone, coiled tight.',
    },
    'constellation-gorget': {
        name: 'Constellation Gorget',
        look: 'midnight-constellation',
        img: 'assets/img/product/product-1/chaleco_02.webp',
        price: 1580,
        material: 'Hand-set sequins on silk',
        edition: '1 of 8',
        desc: 'A high collar embroidered like a star chart.',
    },
};
