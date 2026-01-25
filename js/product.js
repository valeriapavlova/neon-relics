// js/product.js

// con ayuda de AI (perplexity)

import { getCapsule, saveCapsule, updateCapsuleCounter } from './capsule.js';

// =============================================
// 1. ARRAY DE RELICS (extendido con más datos)

const relicsData = [
    {
    id: '01',
    title: 'Midnight Constellation Collar',
    tagline: 'Multi-layered black crystal mesh that commands the room.',
    price: '€890',
    mood: 'Obsidian',
    collection: 'Midnight Constellation',
    type: 'Collar',
    chapterTitle: 'MIDNIGHT CONSTELLATION CHAPTER',
    chapterDescription: 'The Midnight Constellation chapter brings together pieces that evoke the mystery of a starlit sky. Each relic is designed for those who thrive in the shadows, turning silence into their most powerful statement. Darkness is not absence—it is depth.',
    
    images: {
        image1: 'assets/img/product/product-1/modelo_01.webp', 
        video: 'assets/videos/product/14.webm',
        image2: 'assets/img/product/product-1/chaleco_01.webp', 
        image3: 'assets/img/product/product-1/chaleco_02.webp',
        image4: 'assets/img/product/product-1/modelo_01_02.webp',
    },
    
    thumbnails: [
        'assets/img/product/product-1/chaleco_01.webp',
        'assets/img/product/product-1/chaleco_02.webp',
        'assets/img/product/product-1/modelo_01_02.webp'
    ],
    
    description: 'A statement collar constructed from thousands of hand-set black crystals arranged in a cascading mesh formation that covers the shoulders and chest. The Midnight Constellation Collar is architectural armor—each crystal catches and refracts light to create the illusion of a starlit night sky mapped across your body. The piece is both rigid and flexible, maintaining its dramatic silhouette while allowing natural movement. Handcrafted on a lightweight mesh base with gunmetal findings, it transforms the wearer into a living constellation.',
    
    ritualNotes: 'Wear when you need to embody mystery without explanation. This collar is not decoration—it is transformation. Put it on slowly, feeling the weight settle across your shoulders like a mantle. The crystals absorb ambient light and reflect it back, creating a halo effect that makes you both approachable and untouchable. Reserve for moments when your presence alone should communicate everything.',
    
    shipping: 'Each relic is packaged in a minimal black box with obsidian-black interior lining. Due to the delicate nature of the crystals, this piece ships with extra protective wrapping. Delivery within 5-7 business days. Worldwide shipping available with full insurance coverage. Customs fees may apply for international orders.'
}
,
    {
        id: '02',
        title: 'Dominion Chain Collar',
        tagline: 'Thick gold cuban links that broadcast authority.',
        price: '€1,240',
        mood: 'Crimson',
        collection: 'Dominion Chain',
        type: 'Collar',
        chapterTitle: 'DOMINION CHAIN CHAPTER',
        chapterDescription: 'The Dominion Chain chapter is for those who refuse to be subtle. Gold, weight, presence. These pieces are worn by people who understand that true power doesn\'t whisper—it simply exists.',
        images: {
            image1: 'assets/img/relics/02.webp',
            video: 'assets/videos/product/product-video-2.mp4',
            image2: 'assets/img/product/product-2/collar-2.png',
            image3: 'assets/img/product/product-2/gafas-2.png',
            image4: 'assets/img/product/product-2/jacket-2.png'
        },
        thumbnails: [
            'assets/img/product/product-2/collar-2-small.jpg',
            'assets/img/product/product-2/gafas-2-small.jpg',
            'assets/img/product/product-2/jacket-2-small.jpg'
        ],
        description: 'A thick gold Cuban link chain necklace that demands attention without asking for it. Each link is precision-crafted to create a seamless flow of gold that sits heavy on your collarbone. This is not jewelry—this is territory.',
        ritualNotes: 'Worn when making declarations. The weight of the chain is intentional—it grounds you, reminds you of the gravity of your presence. Wear it when you need to remember your own authority.',
        shipping: 'Delivered in signature black packaging with gold foil details. Ships within 2-4 business days. International shipping available with full insurance coverage.'
    },

    {
    id: '03',
    title: 'Sapphire Clarity Hoops',
    tagline: 'Geometric brilliance that speaks without words.',
    price: '€480',
    mood: 'Sapphire',
    collection: 'Sapphire Clarity',
    type: 'Earrings',
    chapterTitle: 'SAPPHIRE CLARITY CHAPTER',
    chapterDescription: 'The Sapphire Clarity chapter is for those who believe in transparent power. These relics celebrate the beauty of seeing clearly and being seen—without apology, without shadow. Crystal-cut geometry meets quiet confidence. Wear them when you want the world to understand your depth.',
    
    images: {
        image1: 'assets/img/product/product-3/model_03.webp', 
        video: 'assets/videos/product/3.webm',
        image2: 'assets/img/product/product-3/earings_03_01.webp',
        image3: 'assets/img/product/product-3/earings_03_02.webp',
        image4: 'assets/img/product/product-3/hoodie_03.webp',
    },
    
    thumbnails: [
        'assets/img/product/product-3/model_03.webp',
        'assets/img/product/product-3/earings_03_01.webp',
        'assets/img/product/product-3/hoodie_03.webp',
    ],
    
    description: 'A pair of substantial oval hoop earrings completely encrusted with hand-cut cubic zirconia that mimics the clarity and brilliance of diamonds. Each stone is individually set in polished silver, creating a luminous surface that refracts light from every angle. The hoops are weightless despite their architectural presence—engineered for comfort but designed for impact. When light hits them, they create a subtle halo effect around the face, drawing attention upward and inward.',
    
    ritualNotes: 'Wear these when you need to be crystal clear about your intentions. The geometric precision of the stones mirrors the clarity of your thoughts. Put them on before important conversations, negotiations, or moments when you refuse to be misunderstood. The light they catch serves as a reminder: your clarity is your power.',
    
    shipping: 'Each relic is packaged in a minimal black box with sapphire-blue interior lining. Ships within 3-5 business days. Worldwide delivery available. Customs fees may apply for international orders.'
},
{
    id: '05',
    title: 'Obsidian Sequin Blazer',
    tagline: 'Structured darkness that catches light only when you move.',
    price: '€1,650',
    mood: 'Obsidian',
    collection: 'Obsidian Coil',
    type: 'Blazer',
    chapterTitle: 'OBSIDIAN COIL CHAPTER',
    chapterDescription: 'The Obsidian Coil chapter is for those who understand that darkness is not absence—it is depth. These relics are crafted from black materials that absorb light and reflect mystery. Wear them when you want to be a question mark, not an answer. Power does not always shine; sometimes it absorbs.',
    
    images: {
        image1: 'assets/img/product/product-5/modelo_05.webp', 
        video: 'assets/videos/product/5.webm',
        image2: 'assets/img/product/product-5/jacket_front.webp',
        image3: 'assets/img/product/product-5/jacket_back.webp',
        image4: 'assets/img/product/product-5/collar_05.webp'
    },
    
    thumbnails: [
        'assets/img/product/product-5/modelo_05.webp',
        'assets/img/product/product-5/jacket_front.webp',
        'assets/img/product/product-5/collar_05.webp'
    ],
    
    description: 'A tailored blazer featuring black sequin-embellished shoulders and sleeves paired with matte black vinyl lapels and body. The Obsidian Sequin Blazer balances structured masculinity with subtle glam—the sequins create a constellation effect across the upper body, catching light only when you move. The vinyl sections provide sharp, clean lines that contrast with the textured sequins. This piece is designed for those who refuse to choose between power and beauty.',
    
    ritualNotes: 'Wear when you need to command a room without raising your voice. The sequins shimmer with movement, ensuring you\'re never truly still—even in silence, you create visual rhythm. The structured shoulders remind you to stand tall; the darkness reminds you that not everything needs to be explained. Perfect for evening events, important meetings, or any moment where you want people to remember you left.',
    
    shipping: 'Due to the delicate sequin work, this piece ships in a reinforced garment bag with tissue paper protection. Delivery within 5-7 business days. International shipping available with climate-controlled transport. Dry clean only care instructions included.'
},
{
    id: '11',
    title: 'Scarlet Veil Choker',
    tagline: 'Cascading silver chains that shield and signal simultaneously.',
    price: '€680',
    mood: 'Crimson',
    collection: 'Scarlet Veil',
    type: 'Choker',
    chapterTitle: 'SCARLET VEIL CHAPTER',
    chapterDescription: 'The Scarlet Veil chapter is for those who understand that concealment is power. These relics blur the line between hiding and displaying, between mystery and magnetism. Wear them when you want the world to wonder what lies beneath.',
    
        images: {
        image1: 'assets/img/product/product-11/modelo_11.webp', 
        video: 'assets/videos/product/11.webm',
        image2: 'assets/img/product/product-11/choker_front.webp',
        image3: 'assets/img/product/product-11/choker_back.webp',
        image4: 'assets/img/product/product-11/collar_11.webp'
    },
    
    thumbnails: [
        'assets/img/product/product-11/modelo_11.webp',
        'assets/img/product/product-11/choker_front.webp',
        'assets/img/product/product-11/collar_11.webp'
    ],

    description: 'A statement choker of interlocking silver chain fringe that cascades from a sculptural collar base. The Scarlet Veil Choker sits between armor and ornament—a piece that frames the body while simultaneously obscuring it. Each link catches light and movement, creating an effect of controlled chaos. Handcrafted in polished silver with precision-cut chain segments that move independently, allowing for subtle shifts in shape and presence.',
    
    ritualNotes: 'Wear when you need to disappear while being seen. The weight of the chains grounds you; the fringe reminds you of your edges. Perfect for moments when silence is your loudest statement—meetings where you observe more than you speak, spaces where your presence speaks before your voice.',
    
    shipping: 'Each relic is packaged in a minimal black box with crimson interior lining. Ships within 3-5 business days. Worldwide delivery available. Customs fees may apply for international orders.'
}






];

// =============================================
// 2. FUNCIONES AUXILIARES
// =============================================
// Obtener parámetro de la URL

function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// =============================================
// 3. RENDER PRODUCT DATA
// =============================================

function renderProductData(relic) {
    // Heading section
    const headingTitle = document.querySelector('.heading__title');
    const headingDescription = document.querySelector('.heading__description');
    const moodTag = document.getElementById('product-mood-tag');
    const collectionTag = document.getElementById('product-collection-tag');
    const typeTag = document.getElementById('product-type-tag');

    if (headingTitle) headingTitle.textContent = relic.chapterTitle;
    if (headingDescription) headingDescription.textContent = relic.chapterDescription;
    if (moodTag) moodTag.textContent = relic.mood;
    if (collectionTag) collectionTag.textContent = relic.collection;
    if (typeTag) typeTag.textContent = relic.type;

    // Gallery images
    const image1 = document.getElementById('product-image-1');
    const videoElement = document.getElementById('product-video-1');
    const image2 = document.getElementById('product-image-2');
    const image3 = document.getElementById('product-image-3');
    const image4 = document.getElementById('product-image-4');

    if (image1) image1.src = relic.images.image1;
    if (videoElement) {
        videoElement.src = relic.images.video;
        videoElement.setAttribute('autoplay', '');
        videoElement.setAttribute('loop', '');
        videoElement.setAttribute('muted', '');
        videoElement.setAttribute('playsinline', '');
        videoElement.load();
    }
    if (image2) image2.src = relic.images.image2;
    if (image3) image3.src = relic.images.image3;
    if (image4) image4.src = relic.images.image4;

    // Product card - Breadcrumb
    const productCollection = document.getElementById('product-collection');
    const productType = document.getElementById('product-type');
    if (productCollection) productCollection.textContent = relic.collection;
    if (productType) productType.textContent = relic.type;

    // Thumbnails
    relic.thumbnails.forEach((thumb, index) => {
        const thumbImg = document.getElementById(`thumbnail-${index + 1}`);
        if (thumbImg) thumbImg.src = thumb;
    });

    // Product info
    const productTitle = document.getElementById('product-title');
    const productTagline = document.getElementById('product-tagline');
    const productPrice = document.getElementById('product-price');

    if (productTitle) productTitle.textContent = relic.title;
    if (productTagline) productTagline.textContent = relic.tagline;
    if (productPrice) productPrice.textContent = relic.price;

// Tabs content
    const descriptionContent = document.getElementById('tab-description-content');
    const ritualContent = document.getElementById('tab-ritual-content');
    const shippingContent = document.getElementById('tab-shipping-content');

    if (descriptionContent) 
        console.log('Asignando descripción:', relic.description);
    descriptionContent.textContent = relic.description;
    if (ritualContent) ritualContent.textContent = relic.ritualNotes;
    if (shippingContent) shippingContent.textContent = relic.shipping;
}


// =============================================
// 4. TABS SYSTEM
// =============================================

function setupTabs() {
    const tabButtons = document.querySelectorAll('.product-tab');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => {
                btn.classList.remove('product-tab--active');
                btn.setAttribute('aria-selected', 'false');
            });
            tabPanels.forEach(panel => panel.classList.remove('tab-panel--active'));

            // Add active class to clicked button and corresponding panel
            button.classList.add('product-tab--active');
            button.setAttribute('aria-selected', 'true');

            const targetPanel = document.getElementById(`tab-${targetTab}`);
            if (targetPanel) targetPanel.classList.add('tab-panel--active');
        });
    });
}


// =============================================
// 5. QUANTITY SELECTOR
// =============================================

function setupQuantitySelector() {
    const minusBtn = document.querySelector('.quantity-btn--minus');
    const plusBtn = document.querySelector('.quantity-btn--plus');
    const input = document.getElementById('quantity-input');

    if (!minusBtn || !plusBtn || !input) return;

    minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(input.value) || 1;
        if (currentValue > 1) {
            input.value = currentValue - 1;
        }
    });

    plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(input.value) || 1;
        const maxValue = parseInt(input.max) || 99;
        if (currentValue < maxValue) {
            input.value = currentValue + 1;
        }
    });

    // Validar input manual
    input.addEventListener('input', () => {
        let value = parseInt(input.value) || 1;
        const min = parseInt(input.min) || 1;
        const max = parseInt(input.max) || 99;

        if (value < min) value = min;
        if (value > max) value = max;

        input.value = value;
    });
}

// =============================================
// 6. THUMBNAILS GALLERY


// =============================================
// 7. ADD TO CAPSULE
// =============================================

function setupAddToCapsule(relic) {
    const addBtn = document.getElementById('add-to-capsule');
    if (!addBtn) return;

    addBtn.addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('quantity-input')?.value) || 1;

        // Preparar item para la cápsula
        const capsuleItem = {
            id: relic.id,
            title: relic.title,
            price: relic.price,
            image: relic.images.image1,
            quantity: quantity
        };

        // Obtener cápsula actual
        let capsule = getCapsule();

        // Verificar si ya existe
        const existingIndex = capsule.findIndex(item => item.id === relic.id);

        if (existingIndex !== -1) {
            capsule[existingIndex].quantity += quantity;
        } else {
            capsule.push(capsuleItem);
        }

        saveCapsule(capsule);
        updateCapsuleCounter();

        // Feedback visual
        addBtn.classList.add('btn-add-capsule--added');
        const originalText = addBtn.querySelector('.btn-text').textContent;
        addBtn.querySelector('.btn-text').textContent = 'added to capsule';

        setTimeout(() => {
            addBtn.classList.remove('btn-add-capsule--added');
            addBtn.querySelector('.btn-text').textContent = originalText;
        }, 2000);

        console.log('✅ Added to capsule:', capsuleItem);
    });
}


// =============================================
// 8. MAIN INIT FUNCTION (EXPORT)
// =============================================

export function initProductPage() {
    // 1. Obtener ID del producto de la URL
    const productId = getUrlParameter('id');
    
    if (!productId) {
        console.error('No product ID found in URL');
        return;
    }

    // 2. Buscar el relic en el array
    const relic = relicsData.find(r => r.id === productId);
    
    if (!relic) {
        console.error(`Product with ID ${productId} not found`);
        return;
    }

    console.log('✅ Loading product:', relic.title);

    // 3. Renderizar datos del producto
    renderProductData(relic);

    // 4. Setup interactividad
    setupTabs();
    setupQuantitySelector();
    setupAddToCapsule(relic);
    
    // 5. Actualizar contador inicial
    updateCapsuleCounter();
}
