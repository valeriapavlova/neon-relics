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

// js/parallax.js

export function setupRelicsParallax() {
    const track = document.querySelector('.slider__track');
    if (!track) return;

    const cards = Array.from(track.querySelectorAll('.relic-card'));

    function updateParallax() {
        const scrollLeft = track.scrollLeft;
        const maxShift = 40; // más fuerte que antes

        cards.forEach((card) => {
            const img = card.querySelector('.relic-card__media img');
            if (!img) return;

            // desplazamiento según posición horizontal de la card
            const cardOffset = card.offsetLeft - scrollLeft;
            const factor = cardOffset / track.clientWidth; // ~ -1..1

            const translateY = factor * maxShift;
            img.style.transform = `translateX(-5%) translateY(${translateY}px)`;
        });
    }

    track.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateParallax);
    });

    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateParallax);
    });

    // primer posicionamiento
    updateParallax();
}
