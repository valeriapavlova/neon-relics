// js/index.js
import { renderRelics } from './slider.js';
import { setupRelicsParallax } from './parallax.js';
import { renderEvents } from './events.js';
import { setupHeaderMenu } from './header.js';
import { initProductPage } from './product.js';

document.addEventListener('DOMContentLoaded', () => {
    // Siempre ejecutar header
    setupHeaderMenu();
    
    // Solo si estamos en index.html (página con slider)
    if (document.querySelector('.relics')) {
        renderRelics();
        setupRelicsParallax();
    }
    
    // Solo si hay eventos
    if (document.querySelector('.events')) {
        renderEvents();
    }
    
    // 👇 CAMBIAR ESTO: detectar si estamos en product-card.html
    if (window.location.pathname.includes('product-card')) { // 👈 Cambiar a 'product-card'
        initProductPage();
    }
});
