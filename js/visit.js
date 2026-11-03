// js/visit.js
// Bloque "Visit the atelier" (index.html y about.html).
// El retrato de la vitrina es el del look 03: la ruta vive solo en js/data.js,
// así al cambiar las fotos de los personajes se actualiza aquí también.

import { LOOKS } from './data.js';
import { drawLines } from './motion.js';

const VISIT_LOOK = '03';

export function initVisit() {
    const section = document.querySelector('.visit');
    if (!section) return;

    const holder = section.querySelector('[data-visit-portrait]');
    const look = LOOKS.find((item) => item.n === VISIT_LOOK);
    if (holder && look) {
        const img = document.createElement('img');
        img.src = look.img;
        img.alt = `${look.character}, wearing the ${look.name} look`;
        img.loading = 'lazy';
        img.width = 600;
        img.height = 800;
        holder.append(img);
    }

    // Líneas finas entre las filas de la lista (se dibujan al entrar en pantalla)
    drawLines(section.querySelector('.visit__list'), 'visit');
}
