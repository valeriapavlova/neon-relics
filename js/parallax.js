//Opción 3: Solo CSS (más moderno, limitado)
// Si tu fondo es una imagen en un div, puedes usar:

/* .manifest__bg {
    will-change: transform;
    transition: transform 0.2s linear;
}
   


window.addEventListener('scroll', function() {
  const wrapper = document.querySelector('.manifest__wrapper');
  if (!wrapper) return;
  const scrolled = window.scrollY;
  wrapper.style.backgroundPositionY = `${-scrolled * 0.3}px`;
});
 */

// js/parallax.js

export function setupRelicsParallax() {
    const track = document.querySelector('.slider__track');
    if (!track) return;

    const cards = Array.from(track.querySelectorAll('.relic-card'));

    function updateParallax() {
        const trackRect = track.getBoundingClientRect();
        const trackCenter = trackRect.left + trackRect.width / 2;

        cards.forEach((card) => {
            const img = card.querySelector('.relic-card__media img');
            if (!img) return;

            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;

            const normalized = (cardCenter - trackCenter) / trackRect.width;
            const maxShift = 24; // px, ajusta a gusto
            const translateY = normalized * maxShift;

            img.style.transform = `translateY(${translateY}px)`;
        });
    }

    track.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateParallax);
    });

    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateParallax);
    });

    // primera posición una vez renderizadas las cards
    updateParallax();
}
