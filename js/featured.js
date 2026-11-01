// js/featured.js

// =============================================
// SECCIÓN "FEATURED" (#collection)
// Cuadrícula escalonada con las 4 tarjetas de looks.
// Los datos vienen de js/data.js
// =============================================

import { LOOKS, PIECES } from './data.js';

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
        <li class="looks__item">
            <a class="look-card" href="product-card.html?look=${encodeURIComponent(look.id)}">
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

export function renderFeaturedLooks() {
    const grid = document.querySelector('.looks');
    if (!grid) return;

    grid.innerHTML = LOOKS.map(createLookCard).join('');

    // Mantener el título sincronizado con los datos
    const total = Object.keys(PIECES).length;
    const looksCount = document.querySelector('[data-looks-count]');
    const relicsCount = document.querySelector('[data-relics-count]');
    if (looksCount) looksCount.textContent = capitalize(WORDS[LOOKS.length] || String(LOOKS.length));
    if (relicsCount) relicsCount.textContent = WORDS[total] || total;
}
