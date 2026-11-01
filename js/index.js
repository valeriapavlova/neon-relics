// js/index.js
import { renderFeaturedLooks } from './featured.js';
import { renderEvents } from './events.js';
import { setupHeaderMenu } from './header.js';
import { initProductPage } from './product.js';
import { updateCapsuleCounter, initCapsulePage } from './capsule.js';

document.addEventListener('DOMContentLoaded', () => {
    // Siempre ejecutar header
    setupHeaderMenu();

    // Solo si estamos en index.html (sección de looks)
    if (document.querySelector('.looks')) {
        renderFeaturedLooks();
        updateCapsuleCounter(); // restaurar contador desde localStorage
    }

    // Solo si hay eventos
    if (document.querySelector('.events')) {
        renderEvents();
    }

    // Solo en product-card.html
    if (window.location.pathname.includes('product-card')) {
        initProductPage();
    }

    // Solo en capsule.html
    if (document.getElementById('capsule-root')) {
        initCapsulePage();
    }
});
