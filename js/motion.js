// js/motion.js

// =============================================
// VÍDEOS DECORATIVOS (todas las páginas)
// Los <video data-motion-video> solo se reproducen si el usuario
// no pide menos movimiento. Sin JS o con prefers-reduced-motion
// se ve el póster (imagen fija).
// =============================================

export function initMotionVideos() {
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
    // Si el usuario cambia el ajuste con la página abierta, se aplica al momento
    reduceMotion.addEventListener('change', update);
}
