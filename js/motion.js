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

// =============================================
// TÍTULOS POR LÍNEAS
// Cada línea va dentro de un contenedor con overflow:hidden y el texto
// sube desde translateY(105%); 90 ms de retraso entre líneas.
// Al terminar se devuelve el texto normal (para que el salto de línea
// siga funcionando si cambia el ancho de la ventana).
// =============================================

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const LINE_STAGGER = 90;
const HERO_VIDEO_FADE = 400;
const HERO_VIDEO_WAIT = 1000; // si el vídeo no arranca (móvil, red lenta), no esperar más

function splitAndReveal(el, delay) {
    const text = el.textContent.trim().replace(/\s+/g, ' ');

    // 1. Palabras sueltas para saber dónde corta cada línea
    el.innerHTML = text.split(' ').map((w) => `<span class="lines__word">${esc(w)}</span>`).join(' ');
    const lines = [];
    let top = null;
    el.querySelectorAll('.lines__word').forEach((word) => {
        if (word.offsetTop !== top) {
            lines.push([]);
            top = word.offsetTop;
        }
        lines[lines.length - 1].push(word.textContent);
    });

    // 2. Una caja por línea; el lector de pantalla lee el aria-label
    el.setAttribute('aria-label', text);
    el.innerHTML = lines.map((words, i) => `
        <span class="lines__line" aria-hidden="true"><span class="lines__inner" style="--line: ${i}">${esc(words.join(' '))}</span></span>`).join('');
    el.classList.add('lines--ready');

    // 3. Arrancar en el siguiente frame (para que la transición se vea)
    requestAnimationFrame(() => {
        setTimeout(() => el.classList.add('lines--in'), delay);
    });

    // 4. Al terminar, texto normal otra vez
    const restore = () => {
        if (!el.classList.contains('lines--ready')) return;
        el.textContent = text;
        el.removeAttribute('aria-label');
    };
    const total = delay + 700 + (lines.length - 1) * LINE_STAGGER + 150;
    setTimeout(restore, total);
}

export function revealLines(el, delay = 0) {
    if (!el) return;
    if (!prefersMotion()) return;
    // esperar a las fuentes: con otra fuente los cortes de línea serían otros
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    fonts.then(() => splitAndReveal(el, delay));
}

// Hero (index y about): primero aparece el vídeo (fade 400 ms) y luego el h1
function revealHeroTitle(title, hero) {
    const videos = [...hero.querySelectorAll('video[data-motion-video]')];
    let started = false;

    const start = () => {
        if (started) return;
        started = true;
        videos.forEach((video) => video.classList.add('is-shown'));
        revealLines(title, HERO_VIDEO_FADE);
    };

    videos.forEach((video) => video.addEventListener('playing', start, { once: true }));
    setTimeout(start, videos.length ? HERO_VIDEO_WAIT : 0);
}

// Todos los títulos con [data-reveal-lines] de la página
export function initTitleReveals() {
    if (!prefersMotion()) return;
    document.querySelectorAll('[data-reveal-lines]').forEach((title) => {
        const hero = title.closest('.hero, .about-hero');
        if (hero) revealHeroTitle(title, hero);
        else revealLines(title);
    });
}

// =============================================
// LÍNEAS DIVISORIAS
// Se dibujan (scaleX 0 → 1) al entrar en pantalla (threshold 0.4),
// con +120 ms entre líneas vecinas. Cada grupo se dibuja una sola vez:
// si la zona se vuelve a pintar (p. ej. "The archive" tras cada cambio),
// las líneas nuevas aparecen ya dibujadas.
// =============================================

const LINE_SELECTOR = '.piece, .vitrine__cta, .ledger__total-label, .ledger__total';
const DRAW_STAGGER = 120;
const drawnGroups = new Set();

export function drawLines(container, group) {
    if (!container) return;
    const lines = [...container.querySelectorAll(LINE_SELECTOR)];
    if (!lines.length) return;

    if (!prefersMotion() || drawnGroups.has(group) || !('IntersectionObserver' in window)) {
        lines.forEach((line) => line.classList.add('is-drawn', 'is-static'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target);
        if (!visible.length) return;
        drawnGroups.add(group);
        // en orden del documento, cada una 120 ms después de la anterior
        visible
            .sort((a, b) => lines.indexOf(a) - lines.indexOf(b))
            .forEach((line, i) => {
                observer.unobserve(line);
                line.style.setProperty('--draw-delay', `${i * DRAW_STAGGER}ms`);
                line.classList.add('is-drawn');
            });
    }, { threshold: 0.4 });

    lines.forEach((line) => observer.observe(line));
}

// =============================================
// APARICIÓN ESCALONADA
// Los elementos con la clase .reveal (opacity 0 + translateY) aparecen
// al entrar en pantalla: base ms + step ms por cada uno del mismo grupo
// visible. Se usa en "Featured" y en las filas de la cápsula.
// =============================================

export function revealStagger(items, { base = 0, step = 80, threshold = 0.15 } = {}) {
    const list = [...items];
    if (!list.length) return;

    if (!prefersMotion() || !('IntersectionObserver' in window)) {
        list.forEach((item) => item.classList.add('is-revealed', 'is-static'));
        return;
    }

    const pending = new Set(list);
    // fila de la cuadrícula: el top sin el margin-top de los escalones
    const rowOf = (item) => item.offsetTop - parseFloat(getComputedStyle(item).marginTop || 0);

    const observer = new IntersectionObserver((entries) => {
        const rows = new Set(entries.filter((entry) => entry.isIntersecting).map((entry) => rowOf(entry.target)));
        if (!rows.size) return;
        // Un mismo grupo = toda la fila (en "Featured" los 4 escalones de
        // escritorio salen en orden aunque cada uno esté a otra altura)
        list
            .filter((item) => pending.has(item) && rows.has(rowOf(item)))
            .forEach((item, i) => {
                pending.delete(item);
                observer.unobserve(item);
                item.style.setProperty('--reveal-delay', `${base + i * step}ms`);
                item.classList.add('is-revealed');
            });
    }, { threshold });

    list.forEach((item) => observer.observe(item));
}
