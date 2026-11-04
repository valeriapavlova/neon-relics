// js/menu.js

// =============================================
// MENÚ MÓVIL: contenido que sale de los datos
// La estructura del panel está en el HTML de cada página; aquí se rellenan
// la fila de looks (js/data.js) y los contadores de Collection y Capsule.
// =============================================

import { LOOKS, PIECES } from './data.js';
import { getCapsule } from './capsule.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

// Fila de looks con scroll-snap: foto, "Look 01" y cuántas reliquias lleva
export function renderMenuLooks(overlay) {
    const strip = overlay.querySelector('[data-menu-looks]');
    if (!strip) return;

    strip.innerHTML = LOOKS.map((look) => {
        const pieces = look.pieces.filter((id) => PIECES[id]).length;
        return `
        <li class="menu__look">
            <a class="menu__look-link" href="product-card.html?look=${encodeURIComponent(look.id)}">
                <span class="menu__look-photo"><img src="${esc(look.img)}" alt="" loading="lazy" width="256" height="341"></span>
                <span class="menu__look-name">Look ${esc(look.n)}<span class="visually-hidden">: ${esc(look.name)}</span></span>
                <span class="menu__look-count">${plural(pieces, 'relic')}</span>
            </a>
        </li>`;
    }).join('');
}

// Contadores: se leen cada vez que se abre el menú (la cápsula puede haber cambiado)
export function updateMenuCounts(overlay) {
    const looks = overlay.querySelector('[data-menu-count="looks"]');
    const relics = overlay.querySelector('[data-menu-count="relics"]');
    if (looks) looks.textContent = plural(LOOKS.length, 'look');
    if (relics) {
        const count = getCapsule().length;
        relics.textContent = count ? plural(count, 'relic') : '';
    }
}
