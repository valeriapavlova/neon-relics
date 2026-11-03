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

// Duración de un token de :root ("700ms" → 700)
export function cssMs(name, fallback) {
    const value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    return Number.isFinite(value) ? value : fallback;
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

// Palabras del título; los <br> se guardan como null (salto forzado)
function wordsOf(el) {
    const words = [];
    el.childNodes.forEach((node) => {
        if (node.nodeName === 'BR') words.push(null);
        else node.textContent.split(/\s+/).filter(Boolean).forEach((w) => words.push(w));
    });
    return words;
}

function splitAndReveal(el, delay) {
    // se guarda el HTML original (p. ej. los <span> con contadores y los <br>)
    const html = el.innerHTML;
    const text = el.textContent.trim().replace(/\s+/g, ' ');

    // 1. Palabras sueltas para saber dónde corta cada línea
    el.innerHTML = wordsOf(el).map((w) => (w === null ? '<br>' : `<span class="lines__word">${esc(w)}</span>`)).join(' ');
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

    // 4. Al terminar, el HTML original otra vez
    const restore = () => {
        if (!el.classList.contains('lines--ready')) return;
        el.innerHTML = html;
        el.removeAttribute('aria-label');
    };
    const total = delay + cssMs('--dur-reveal', 700) + (lines.length - 1) * LINE_STAGGER + 150;
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

const LINE_SELECTOR = '.piece, .vitrine__cta, .ledger__total-label, .ledger__total, .visit__row';
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

export function revealStagger(items, { base = 0, step = 80, threshold = 0.15, instant = false } = {}) {
    const list = [...items];
    if (!list.length) return;

    if (instant || !prefersMotion() || !('IntersectionObserver' in window)) {
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
                // al terminar se quitan las clases: no pisan otros estados (p. ej. al arrastrar)
                item.addEventListener('transitionend', function done(event) {
                    if (event.target !== item || event.propertyName !== 'transform') return;
                    item.removeEventListener('transitionend', done);
                    item.classList.remove('reveal', 'is-revealed');
                    item.style.removeProperty('--reveal-delay');
                });
            });
    }, { threshold });

    list.forEach((item) => observer.observe(item));
}

// =============================================
// FLIP: las filas se deslizan a su nuevo sitio
// 1) recordar dónde estaba cada elemento (por data-<key>)
// 2) cambiar el DOM  3) animar desde la posición vieja hasta la nueva
// =============================================

const easeReveal = () =>
    getComputedStyle(document.documentElement).getPropertyValue('--ease-reveal').trim() || 'ease-out';

export function flip(container, selector, key, change, duration = 200) {
    if (!container || !prefersMotion()) {
        change();
        return;
    }

    const before = new Map();
    container.querySelectorAll(selector).forEach((el) => before.set(el.dataset[key], el.getBoundingClientRect().top));

    change();

    const easing = easeReveal();
    container.querySelectorAll(selector).forEach((el) => {
        const top = before.get(el.dataset[key]);
        if (top === undefined) return;
        const dy = top - el.getBoundingClientRect().top;
        if (Math.abs(dy) < 1) return;
        el.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration, easing });
    });
}

// Plegar un elemento antes de quitarlo (opacity + scaleY, 200 ms).
// Devuelve una promesa; sin movimiento se resuelve al momento.
export function collapse(el, duration = 200) {
    if (!el || !prefersMotion()) return Promise.resolve();
    el.style.transformOrigin = 'center top';
    const animation = el.animate(
        [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scaleY(0.6)' }],
        { duration, easing: easeReveal(), fill: 'forwards' },
    );
    return animation.finished.catch(() => {});
}

// =============================================
// "RESPIRACIÓN" DE LAS SECCIONES
// Basta con poner data-reveal en la sección. Al entrar en pantalla
// (threshold 0.2, una sola vez por elemento):
//   - h2: por líneas, como el h1 del hero
//   - .subtitle, .eyebrow, .body-text, .body-text--big: opacity + 16 px,
//     600 ms, 120 ms después del título y 80 ms entre elementos
//   - img y video: opacity + scale(1.06) → 1, 900 ms, 100 ms entre ellos;
//     si la imagen va sola en su caja, la caja recorta (overflow: clip)
// Lo que esté dentro de [data-reveal-skip] no se toca (tiene su propio
// movimiento). Los estados ocultos están en el CSS (bloque MOTION).
// =============================================

const BREATH_TEXT = '.subtitle, .eyebrow, .body-text, .body-text--big';
const BREATH_MEDIA = 'img, video';
const TEXT_AFTER_TITLE = 120;
const TEXT_STEP = 80;
const MEDIA_STEP = 100;
const TEXT_DUR = 600;
const MEDIA_DUR = 900;

// El elemento aparece; al terminar se quitan las clases para no pisar
// sus propios estilos (hover, transform, etc.)
function breathe(el, delay, duration) {
    el.style.setProperty('--breath-delay', `${delay}ms`);
    el.classList.add('is-in');
    setTimeout(() => {
        el.classList.add('is-settled');
        el.classList.remove('is-in');
        el.style.removeProperty('--breath-delay');
        el.parentElement?.classList.remove('breath-clip');
    }, delay + duration + 50);
}

function initSection(section) {
    const own = (el) => !el.closest('[data-reveal-skip]');
    const titles = [...section.querySelectorAll('h2')].filter(own);
    const texts = [...section.querySelectorAll(BREATH_TEXT)].filter(own);
    const media = [...section.querySelectorAll(BREATH_MEDIA)].filter(own);

    if (!prefersMotion() || !('IntersectionObserver' in window)) {
        titles.forEach((title) => title.classList.add('lines--ready'));
        [...texts, ...media].forEach((el) => el.classList.add('is-settled'));
        return;
    }

    // La imagen sola en su caja: la caja recorta el zoom
    media.forEach((el) => {
        const box = el.parentElement;
        const alone = [...box.children].every((child) => child === el || child.tagName === 'SOURCE');
        if (alone) box.classList.add('breath-clip');
    });

    // El subtítulo de un heading-block sale con su título (aunque esté encima)
    const followers = new Map(titles.map((title) => [title, []]));
    const free = texts.filter((text) => {
        const title = text.closest('.heading-block')?.querySelector('h2');
        if (!title || !followers.has(title)) return true;
        followers.get(title).push(text);
        return false;
    });

    const order = [...titles, ...free, ...media];
    const byDocument = (a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
    let titleAt = null;

    const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target);
        if (!visible.length) return;
        visible.sort(byDocument);

        const now = performance.now();
        const titlesNow = visible.filter((el) => followers.has(el));
        if (titlesNow.length) titleAt = now;
        // texto: 120 ms después del último título (si acaba de salir)
        const textBase = titleAt === null ? 0 : Math.max(0, TEXT_AFTER_TITLE - (now - titleAt));
        const textQueue = [];
        let mediaIndex = 0;

        visible.forEach((el) => {
            observer.unobserve(el);
            if (followers.has(el)) {
                revealLines(el);
                textQueue.push(...followers.get(el));
            } else if (el.matches(BREATH_MEDIA)) {
                breathe(el, mediaIndex++ * MEDIA_STEP, MEDIA_DUR);
            } else {
                textQueue.push(el);
            }
        });

        textQueue.sort(byDocument).forEach((el, i) => breathe(el, textBase + i * TEXT_STEP, TEXT_DUR));
    }, { threshold: 0.2 });

    order.forEach((el) => observer.observe(el));
}

export function initSectionReveals() {
    document.querySelectorAll('[data-reveal]').forEach(initSection);
}
