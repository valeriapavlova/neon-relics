// js/index.js
import { renderFeaturedLooks } from './featured.js';
import { renderEvents } from './events.js';
import { setupHeaderMenu } from './header.js';
import { initProductPage } from './product.js';
import { updateCapsuleCounter, initCapsulePage } from './capsule.js';
import { initMotionVideos } from './motion.js';
import { initNewsletterForm } from './newsletter.js';

document.addEventListener('DOMContentLoaded', () => {
    // Siempre ejecutar header
    setupHeaderMenu();
    updateCapsuleCounter(); // restaurar contador desde localStorage (todas las páginas)
    initMotionVideos(); // vídeos decorativos según prefers-reduced-motion (todas las páginas)

    // Solo si estamos en index.html (sección de looks)
    if (document.querySelector('.looks')) {
        renderFeaturedLooks();
    }

    // Solo si hay eventos
    if (document.querySelector('.events')) {
        renderEvents();
    }

    // Solo en product-card.html
    if (window.location.pathname.includes('product-card')) {
        initProductPage();
    }

    // Formulario "Join the inner frequency" (index.html y about.html)
    if (document.querySelector('.frequency .form')) {
        initNewsletterForm();
    }

    // Solo en capsule.html
    if (document.getElementById('capsule-root')) {
        initCapsulePage();
    }
});
