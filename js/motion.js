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

// =============================================
// HELPERS DE MOVIMIENTO
// La clase .has-motion la pone un script en el <head> antes de pintar.
// Todos los estados iniciales "ocultos" del CSS cuelgan de esa clase:
// sin JS o con prefers-reduced-motion todo se ve al momento.
// =============================================

export function prefersMotion() {
    return document.documentElement.classList.contains('has-motion')
        && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Llama a callback una sola vez, cuando el elemento entra en pantalla
export function onceVisible(el, callback, threshold = 0.2) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
        callback(el);
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            callback(entry.target);
        });
    }, { threshold });
    observer.observe(el);
}
