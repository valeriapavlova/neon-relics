// js/capsule.js

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