// js/product.js

// con ayuda de AI (perplexity)

import { getCapsule, saveCapsule, updateCapsuleCounter } from './capsule.js';

// =============================================
// 1. ARRAY DE RELICS (extendido con más datos)

const relicsData = [
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
