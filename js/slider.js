// slider.js

import { getCapsule, saveCapsule, updateCapsuleCounter } from './capsule.js';

const relics = [
    {
        id: '11',
        title: 'Scarlet Veil Choker',
        image: '../assets/img/relics/11.png',
        alt: 'Scarlet Veil Choker - Metallic chain choker with cascading fringe',
        link: 'product-card.html?id=11'
    },
    {
        id: '03',
        title: 'Lunar Orbit Earrings',
        image: '../assets/img/relics/03.png',
        alt: 'Lunar Orbit Earrings - Pearl-encrusted oval statement earrings',
        link: 'product-card.html?id=03'
    },
    {
        id: '01',
        title: 'Midnight Constellation Collar',
        image: '../assets/img/relics/01.png',
        alt: 'Midnight Constellation Collar - Multi-layered black crystal mesh statement collar',
        link: 'product-card.html?id=01'
    },
    {
        id: '02',
        title: 'Dominion Chain Collar',
        image: '../assets/img/relics/02.png',
        alt: 'Dominion Chain Collar - Thick gold Cuban link chain necklace',
        link: 'product-card.html?id=02'
    },
    {
        id: '05',
        title: 'Obsidian Coil Collar',
        image: '../assets/img/relics/05.png',
        alt: 'Obsidian Coil Collar - Multi-layered black beaded statement collar necklace',
        link: 'product-card.html?id=05'
    },
    {
        id: '08',
        title: 'Void Relic Earrings',
        image: '../assets/img/relics/08.png',
        alt: 'Void Relic Earrings - Ornate black pearl and gold drop earrings',
        link: 'product-card.html?id=08'
    },
    {
        id: '06',
        title: 'Eclipse Stone Ear Cuff',
        image: '../assets/img/relics/06.png',
        alt: 'Eclipse Stone Ear Cuff - Dark crystal ear cuff in gunmetal setting',
        link: 'product-card.html?id=06'
    },
    {
        id: '07',
        title: 'Signal Bar Earrings',
        image: '../assets/img/relics/07.png',
        alt: 'Signal Bar Earrings - Minimalist gold vertical bar drop earrings',
        link: 'product-card.html?id=07'
    },
    {
        id: '04',
        title: 'Celestial Mask Collar',
        image: '../assets/img/relics/04.png',
        alt: 'Celestial Mask Collar - Multi-material beaded face mask and neck piece with golden halo',
        link: 'product-card.html?id=04'
    },
    {
        id: '12',
        title: 'Interlocked Chain Earrings',
        image: '../assets/img/relics/12.png',
        alt: 'Interlocked Chain Earrings - Bronze chain link statement earrings',
        link: 'product-card.html?id=12'
    }
];



// ---- creación de card ----

function createRelicCard(relic) {
    const article = document.createElement('article');
    article.className = 'relic-card';
    article.dataset.id = relic.id;

    // Número + botón favoritos
    const favoriteWrapper = document.createElement('div');
    favoriteWrapper.className = 'favorite__wrapper';

    const idSpan = document.createElement('span');
    idSpan.className = 't--card';
    idSpan.textContent = relic.id;

    const favBtn = document.createElement('button');
    favBtn.className = 'btn btn--card favorite-btn';
    favBtn.setAttribute('aria-label', 'Add to wishlist');

    const favIcon = document.createElement('i');
    favIcon.className = 'ri-add-circle-line';
    favIcon.setAttribute('aria-hidden', 'true');

    favBtn.appendChild(favIcon);
    favoriteWrapper.append(idSpan, favBtn);

    // Link principal + imagen
    const linkWrapperTop = document.createElement('a');
    linkWrapperTop.className = 'relic-card__link';
    linkWrapperTop.href = relic.link;

    const figure = document.createElement('figure');
    figure.className = 'relic-card__media';

    const img = document.createElement('img');
    img.src = relic.image;
    img.alt = relic.alt;
    img.loading = 'lazy';

    figure.appendChild(img);
    linkWrapperTop.appendChild(figure);

    // Body
    const body = document.createElement('div');
    body.className = 'relic-card__body';

    const title = document.createElement('h3');
    title.className = 'relic-card__title t--card';
    title.textContent = relic.title;

    const cartBtn = document.createElement('button');
    cartBtn.className = 'btn btn--card cart-btn';
    cartBtn.setAttribute('aria-label', 'Add to cart');

    const cartIcon = document.createElement('i');
    cartIcon.className = 'ri-arrow-right-circle-line';
    cartIcon.setAttribute('aria-hidden', 'true');

    cartBtn.appendChild(cartIcon);

    body.append(title, cartBtn);

    // Montar card completa
    article.append(favoriteWrapper, linkWrapperTop, body);

    return article;
}


function setupRelicActions() {
    const track = document.querySelector('.slider__track');
    if (!track) return;

    // delegación de eventos para todos los botones de las cards
    track.addEventListener('click', (event) => {
        const cartBtn = event.target.closest('.cart-btn');
        if (!cartBtn) return;

        event.preventDefault();

        const card = event.target.closest('.relic-card');
        if (!card) return;

        const relicId = card.dataset.id;
        const relic = relics.find((r) => r.id === relicId);
        if (!relic) return;

        addToCapsule(relic);
        cartBtn.classList.add('cart-btn--active');
    });
}

/*
// ---- scroll lock en slider ----
function setupSliderScrollLock() {
    const section = document.querySelector('.relics');
    const track = document.querySelector('.slider__track');
    if (!section || !track) return;

    let isActive = false;

    function isSectionInView() {
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;

        // activamos cuando la sección está más o menos centrada en el viewport
        return rect.top < vh * 0.1 && rect.bottom > vh * 0.4;
    }

    function onWheel(e) {
        if (!isActive) return;

        const atStart = track.scrollLeft <= 0;
        const atEnd =
            Math.ceil(track.scrollLeft + track.clientWidth) >= track.scrollWidth;

        // deltaY > 0 scroll hacia abajo, < 0 hacia arriba
        if ((e.deltaY > 0 && !atEnd) || (e.deltaY < 0 && !atStart)) {
            e.preventDefault(); // bloquea scroll vertical
            track.scrollBy({
                left: e.deltaY,      // usamos la rueda vertical para mover en X
                behavior: 'smooth'
            });
        } else {
            // si ya estamos en el extremo y el usuario sigue scroll, liberamos vertical
            isActive = false;
        }
    }

    function onScroll() {
        if (isSectionInView()) {
            isActive = true;
        } else {
            isActive = false;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false });
}
*/

// ---- render + listeners ----

export function renderRelics() {
    const track = document.querySelector('.slider__track');
    if (!track) return;

    relics.forEach((relic, index) => {
        const card = createRelicCard(relic);
        card.classList.add(`relic-card--pos-${index + 1}`);
        track.appendChild(card);
    });

    setupRelicActions();
    updateCapsuleCounter(); // restaurar contador desde localStorage
   // setupSliderScrollLock();
}