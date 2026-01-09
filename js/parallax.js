//Opción 3: Solo CSS (más moderno, limitado)
// Si tu fondo es una imagen en un div, puedes usar:

/* .manifest__bg {
    will-change: transform;
    transition: transform 0.2s linear;
}
    */


window.addEventListener('scroll', function() {
  const wrapper = document.querySelector('.manifest__wrapper');
  if (!wrapper) return;
  const scrolled = window.scrollY;
  wrapper.style.backgroundPositionY = `${-scrolled * 0.3}px`;
});