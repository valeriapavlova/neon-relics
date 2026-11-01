// js/about.js

// =============================================
// PÁGINA ABOUT
// Vídeos decorativos de las tarjetas (006 y 008):
// solo se reproducen si el usuario no pide menos movimiento.
// Sin JS o con prefers-reduced-motion se ve el póster (imagen fija).
// =============================================

export function initAboutPage() {
    const videos = document.querySelectorAll('video[data-motion-video]');
    if (!videos.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function update() {
        videos.forEach((video) => {
            if (reduceMotion.matches) {
                video.pause();
            } else {
                // play() devuelve una promesa; si el navegador lo bloquea, se queda el póster
                video.play().catch(() => {});
            }
        });
    }

    update();
    reduceMotion.addEventListener('change', update);
}
