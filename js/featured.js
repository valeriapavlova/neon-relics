// js/featured.js

// =============================================
// SECCIÓN "FEATURED" (#collection)
// Cuadrícula escalonada con las 4 tarjetas de looks.
// Los datos vienen de js/data.js
// =============================================

import { LOOKS, PIECES } from './data.js';
import { revealStagger } from './motion.js';

// Números en palabras para el título ("six relics")
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

// Primera letra en mayúscula ("Four")
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Escapar texto antes de meterlo en el HTML
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function createLookCard(look) {
    const count = look.pieces.length;
    const thumbs = look.pieces
        .map((id) => PIECES[id])
        .filter(Boolean)
        .map((piece) => `<img src="${esc(piece.img)}" alt="" loading="lazy" width="56" height="56">`)
        .join('');

    return `
        <li class="looks__item reveal">
            <a class="look-card" href="product-card.html?look=${encodeURIComponent(look.id)}" data-look="${esc(look.id)}">
                <div class="look-card__meta">
                    <span>Look ${esc(look.n)}</span>
                    <span class="look-card__count">${count} ${count === 1 ? 'relic' : 'relics'}</span>
                </div>
                <div class="look-card__media">
                    <img class="look-card__portrait" src="${esc(look.img)}"
                        alt="${esc(look.character)}, wearing the ${esc(look.name)} look" loading="lazy">
                    <div class="look-card__pieces" aria-hidden="true">${thumbs}</div>
                </div>
                <div class="look-card__name">
                    <h3 class="look-card__title">${esc(look.name)}</h3>
                    <span class="look-card__arrow" aria-hidden="true">→</span>
                </div>
                <p class="look-card__line">${esc(look.character)}. ${esc(look.line)}</p>
            </a>
        </li>`;
}

// ---- Tarjeta → retrato (View Transitions entre páginas) ----
// Solo la foto del look que se abre (o al que se vuelve) lleva
// view-transition-name: look-<id>, el mismo que el retrato de product-card.html.

const lookFromUrl = (url) => {
    try {
        return new URL(url).searchParams.get('look');
    } catch (e) {
        return null;
    }
};

function nameCard(id) {
    if (!id) return;
    const card = [...document.querySelectorAll('.look-card[data-look]')].find((a) => a.dataset.look === id);
    const img = card?.querySelector('.look-card__portrait');
    if (img) img.style.viewTransitionName = `look-${id}`;
}

function isBackNavigation() {
    const activation = window.navigation?.activation;
    if (activation) return activation.navigationType === 'traverse';
    return performance.getEntriesByType('navigation')[0]?.type === 'back_forward';
}

// salida: la tarjeta pulsada
window.addEventListener('pageswap', (event) => {
    if (event.viewTransition && event.activation) nameCard(lookFromUrl(event.activation.entry.url));
});

// vuelta atrás desde la página de un look
window.addEventListener('pagereveal', (event) => {
    const from = window.navigation?.activation?.from;
    if (event.viewTransition && from && isBackNavigation()) nameCard(lookFromUrl(from.url));
});

export function renderFeaturedLooks() {
    const grid = document.querySelector('.looks');
    if (!grid) return;

    grid.innerHTML = LOOKS.map(createLookCard).join('');

    // Escalones que aparecen uno tras otro: 200 ms + 80 ms por tarjeta.
    // Al volver atrás desde un look, las tarjetas ya están en su sitio.
    revealStagger(grid.querySelectorAll('.looks__item'), { base: 200, step: 80, instant: isBackNavigation() });

    // Mantener el título sincronizado con los datos
    const total = Object.keys(PIECES).length;
    const looksCount = document.querySelector('[data-looks-count]');
    const relicsCount = document.querySelector('[data-relics-count]');
    if (looksCount) looksCount.textContent = capitalize(WORDS[LOOKS.length] || String(LOOKS.length));
    if (relicsCount) relicsCount.textContent = WORDS[total] || total;
}
