// js/product.js

// =============================================
// PÁGINA DE LOOK (product-card.html?look=<id>)
// Retrato del personaje, historia, piezas del look y navegación.
// Los datos vienen de js/data.js
// =============================================

import { LOOKS, PIECES } from './data.js';
import { isInCapsule, addToCapsule, removeFromCapsule, updateCapsuleCounter } from './capsule.js';

// ---- helpers ----

const eur = (n) => '€' + n.toLocaleString('en-US');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pad = (n) => String(n).padStart(2, '0');
const lookUrl = (look) => `product-card.html?look=${encodeURIComponent(look.id)}`;

// ---- aviso (toast) ----

let toastTimer;

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('toast--visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('toast--visible'), 2500);
}

// ---- render ----

function createPiece(id) {
    const piece = PIECES[id];
    return `
        <li class="piece">
            <div class="piece__media">
                <img src="${esc(piece.img)}" alt="${esc(piece.name)}" loading="lazy">
            </div>
            <div class="piece__body">
                <h3 class="piece__name">${esc(piece.name)}</h3>
                <p class="piece__desc">${esc(piece.desc)}</p>
                <p class="piece__spec"><span>${esc(piece.material)}</span><span>${esc(piece.edition)}</span></p>
            </div>
            <div class="piece__action">
                <span class="piece__price">${eur(piece.price)}</span>
                <button type="button" class="vitrine__btn" data-toggle="${esc(id)}" aria-pressed="false">Keep in capsule</button>
            </div>
        </li>`;
}

function renderLook(root, index) {
    const look = LOOKS[index];
    const prev = LOOKS[(index - 1 + LOOKS.length) % LOOKS.length];
    const next = LOOKS[(index + 1) % LOOKS.length];
    const pieces = look.pieces.filter((id) => PIECES[id]);
    const lookTotal = pieces.reduce((sum, id) => sum + PIECES[id].price, 0);

    root.innerHTML = `
        <div class="look__portrait">
            <img src="${esc(look.img)}" alt="${esc(look.character)}, wearing the ${esc(look.name)} look">
            <span class="look__num">Look ${esc(look.n)} / ${pad(LOOKS.length)}</span>
        </div>

        <div class="look__info">
            <header class="look__header">
                <p class="look__character">${esc(look.character)}</p>
                <h1 class="look__title">${esc(look.name)}</h1>
            </header>

            <ul class="look__tags" aria-label="Mood">
                ${look.mood.map((m) => `<li class="tag body-text--small">${esc(m)}</li>`).join('')}
            </ul>

            <p class="look__story body-text">${esc(look.story)}</p>

            <section class="vitrine" aria-labelledby="vitrine-title">
                <div class="vitrine__head">
                    <h2 class="vitrine__title" id="vitrine-title">Worn in this look</h2>
                    <span class="vitrine__count" data-kept-count></span>
                </div>

                <ul class="vitrine__list">
                    ${pieces.map(createPiece).join('')}
                </ul>

                ${pieces.length > 1 ? `
                <div class="vitrine__cta">
                    <span class="vitrine__total">The full look · ${eur(lookTotal)}</span>
                    <button type="button" class="vitrine__btn" data-all>Keep the whole look</button>
                </div>` : ''}
            </section>

            <nav class="look-nav" aria-label="Other looks">
                <a class="look-nav__link" href="${lookUrl(prev)}">
                    <span class="look-nav__label">← Look ${esc(prev.n)}</span>
                    <span class="look-nav__name">${esc(prev.name)}</span>
                </a>
                <a class="look-nav__link look-nav__link--next" href="${lookUrl(next)}">
                    <span class="look-nav__label">Look ${esc(next.n)} →</span>
                    <span class="look-nav__name">${esc(next.name)}</span>
                </a>
            </nav>
        </div>`;
}

// Actualiza botones y contador sin volver a pintar (así no se pierde el foco)
function syncState(root, look) {
    const pieces = look.pieces.filter((id) => PIECES[id]);
    const kept = pieces.filter(isInCapsule).length;

    root.querySelectorAll('[data-toggle]').forEach((btn) => {
        const inCapsule = isInCapsule(btn.dataset.toggle);
        btn.setAttribute('aria-pressed', String(inCapsule));
        btn.textContent = inCapsule ? 'In capsule ✓' : 'Keep in capsule';
    });

    const count = root.querySelector('[data-kept-count]');
    if (count) count.textContent = `${kept} / ${pieces.length} in your capsule`;

    const allBtn = root.querySelector('[data-all]');
    if (allBtn) {
        const all = kept === pieces.length;
        allBtn.setAttribute('aria-disabled', String(all));
        allBtn.textContent = all ? 'Whole look kept' : 'Keep the whole look';
    }
}

// ---- init ----

export function initProductPage() {
    const root = document.getElementById('look');
    if (!root) return;

    const id = new URLSearchParams(window.location.search).get('look');
    const index = LOOKS.findIndex((l) => l.id === id);

    // Si el look no existe, volver a la colección
    if (index < 0) {
        window.location.replace('index.html#collection');
        return;
    }

    const look = LOOKS[index];
    document.title = `${look.name} — NEON RELICS`;

    renderLook(root, index);
    syncState(root, look);
    updateCapsuleCounter();

    root.addEventListener('click', (event) => {
        const toggleBtn = event.target.closest('[data-toggle]');
        const allBtn = event.target.closest('[data-all]');

        if (toggleBtn) {
            const pieceId = toggleBtn.dataset.toggle;
            const name = PIECES[pieceId].name;
            if (isInCapsule(pieceId)) {
                removeFromCapsule(pieceId);
                showToast(`${name} released`);
            } else {
                addToCapsule(pieceId);
                showToast(`${name} kept in your capsule`);
            }
        } else if (allBtn && allBtn.getAttribute('aria-disabled') !== 'true') {
            addToCapsule(...look.pieces);
            showToast('The whole look is in your capsule');
        } else {
            return;
        }

        syncState(root, look);
    });
}
