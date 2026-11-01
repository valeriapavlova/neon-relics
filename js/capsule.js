// js/capsule.js

// con ayuda de AI (perplexity) - pero revisado y adaptado

import { LOOKS, PIECES } from './data.js';

// ---- helpers capsule / contador ----

// Formato en localStorage: [{ id, note }]
// El formato antiguo ({ id, title, image, quantity... }) usaba ids de los
// 12 productos viejos que ya no existen en PIECES, así que se descarta.
const STORAGE_KEY = 'capsule';

function normalize(list) {
    if (!Array.isArray(list)) return [];
    const seen = new Set();
    return list
        .filter((item) => item && PIECES[item.id] && !seen.has(item.id) && seen.add(item.id))
        .map((item) => ({ id: item.id, note: typeof item.note === 'string' ? item.note : '' }));
}

export function getCapsule() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const list = JSON.parse(raw);
        const clean = normalize(list);
        // si había datos del formato antiguo, guardar ya limpio
        if (clean.length !== list.length) saveCapsule(clean);
        return clean;
    } catch (e) {
        return [];
    }
}

export function saveCapsule(capsule) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalize(capsule)));
    } catch (e) {
        // localStorage no disponible (modo privado, bloqueado...)
    }
}

export function isInCapsule(id) {
    return getCapsule().some((item) => item.id === id);
}

// Añade piezas al final (el orden = orden de elección)
export function addToCapsule(...ids) {
    const capsule = getCapsule();
    ids.forEach((id) => {
        if (PIECES[id] && !capsule.some((item) => item.id === id)) capsule.push({ id, note: '' });
    });
    saveCapsule(capsule);
    updateCapsuleCounter();
}

export function removeFromCapsule(id) {
    saveCapsule(getCapsule().filter((item) => item.id !== id));
    updateCapsuleCounter();
}

export function updateCapsuleCounter() {
    const counterBtn = document.querySelector('.wishlist-counter');
    if (!counterBtn) return;

    let badge = counterBtn.querySelector('.wishlist-counter__badge');
    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'wishlist-counter__badge';
        counterBtn.appendChild(badge);
    }

    const count = getCapsule().length;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
}

// ---- RENDER CAPSULE PAGE ----

function renderCapsuleList() {
    const listEl = document.getElementById('capsule-list');
    const emptyEl = document.getElementById('capsule-empty');

    if (!listEl || !emptyEl) return;

    const capsule = getCapsule();
    listEl.innerHTML = '';

    if (capsule.length === 0) {
        emptyEl.style.display = 'block';
        return;
    }

    emptyEl.style.display = 'none';

    capsule.forEach((item) => {
        const piece = PIECES[item.id];
        const look = LOOKS.find((l) => l.id === piece.look);
        const card = document.createElement('article');
        card.className = 'relic-card capsule-card';
        card.dataset.id = item.id;

        card.innerHTML = `
    <a href="product-card.html?look=${piece.look}" class="relic-card__link">
        <figure class="relic-card__media">
            <img src="${piece.img}" alt="${piece.name}${look ? `, from the ${look.name} look` : ''}" loading="lazy">
        </figure>
    </a>
    <div class="relic-card__body">
        <h3 class="relic-card__title t--card">${piece.name}</h3>
        <button type="button" class="btn btn--card capsule-remove-btn" aria-label="Remove from capsule">
            <i class="ri-close-circle-line" aria-hidden="true"></i>
        </button>
    </div>
    `;

        listEl.appendChild(card);
    });

    // delegación para eliminar
    listEl.addEventListener(
        'click',
        (event) => {
            const removeBtn = event.target.closest('.capsule-remove-btn');
            if (!removeBtn) return;

            const card = removeBtn.closest('.relic-card');
            if (!card) return;

            const id = card.dataset.id;
            removeFromCapsule(id);
            renderCapsuleList();
        },
        { once: true }
    );
}

function setupClearButton() {
    const clearBtn = document.getElementById('capsule-clear');
    if (!clearBtn) return;

    clearBtn.addEventListener('click', () => {
        saveCapsule([]);
        updateCapsuleCounter();
        renderCapsuleList();
    });
}

// init solo cuando estemos en capsule.html
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page !== 'capsule') return;
    renderCapsuleList();
    updateCapsuleCounter();
    setupClearButton();
});