// js/capsule.js

// con ayuda de AI (perplexity) - pero revisado y adaptado

// ---- helpers capsule / contador ----


export function getCapsule() {
    return JSON.parse(localStorage.getItem('capsule')) || [];
}

export function saveCapsule(capsule) {
    localStorage.setItem('capsule', JSON.stringify(capsule));
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

    const count = getCapsule().reduce((sum, item) => sum + (item.quantity || 1), 0);
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
        const card = document.createElement('article');
        card.className = 'relic-card capsule-card';
        card.dataset.id = item.id;

        card.innerHTML = `
    <a href="${item.link || `product-card.html?id=${item.id}`}" class="relic-card__link">
        <figure class="relic-card__media">
            <img src="${item.image}" alt="${item.alt || item.title}" loading="lazy">
        </figure>
    </a>
    <div class="relic-card__body">
        <h3 class="relic-card__title t--card">${item.title}</h3>
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
            const capsuleNow = getCapsule().filter((item) => item.id !== id);
            saveCapsule(capsuleNow);
            updateCapsuleCounter();
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