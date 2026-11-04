// js/motion.js

// =============================================
// VÍDEOS DECORATIVOS (todas las páginas)
// Los <video data-motion-video> solo se reproducen si el usuario
// no pide menos movimiento. Sin JS o con prefers-reduced-motion
// se ve el póster (imagen fija).
// =============================================

export function initMotionVideos() {
    const videos = [...document.querySelectorAll('video[data-motion-video]')];
    if (!videos.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Sin IntersectionObserver se tratan todos como visibles
    const visible = new Set('IntersectionObserver' in window ? [] : videos);

    // Solo suena el vídeo que está en pantalla: con preload="none" así
    // tampoco se descargan los que el usuario no llega a ver
    function update(video) {
        if (reduceMotion.matches || !visible.has(video)) {
            video.pause();
        } else {
            // play() devuelve una promesa; si el navegador lo bloquea, se queda el póster
            video.play().catch(() => {});
        }
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) visible.add(entry.target);
                else visible.delete(entry.target);
                update(entry.target);
            });
        }, { rootMargin: '10% 0px' });
        videos.forEach((video) => observer.observe(video));
    }

    videos.forEach(update);
    // Si el usuario cambia el ajuste con la página abierta, se aplica al momento
    reduceMotion.addEventListener('change', () => videos.forEach(update));
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

// Margen inferior: el elemento tiene que subir un poco por encima del borde
// de la pantalla (así no se anima mientras aún no se ve)
const IN_VIEW = '0px 0px -12% 0px';

// Llama a callback una sola vez, cuando el elemento entra en pantalla
export function onceVisible(el, callback, threshold = 0.2, rootMargin = IN_VIEW) {
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
    }, { threshold, rootMargin });
    observer.observe(el);
}

// =============================================
// TÍTULOS POR LÍNEAS
// Cada línea va dentro de un contenedor con overflow:hidden y el texto
// sube desde translate 0 105% (--dur-title); 110 ms de retraso entre líneas.
// Al terminar se devuelve el texto normal (para que el salto de línea
// siga funcionando si cambia el ancho de la ventana).
// =============================================

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const LINE_STAGGER = 110;
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
    // el ancho se fija mientras dura la animación: un título que se ajusta
    // a su contenido (p. ej. centrado) no cambia de tamaño al dividirlo
    el.style.width = getComputedStyle(el).width;

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
    el.classList.add('lines--ready', 'lines--split');

    // 3. Arrancar en el siguiente frame (para que la transición se vea)
    requestAnimationFrame(() => {
        setTimeout(() => el.classList.add('lines--in'), delay);
    });

    // 4. Al terminar, el HTML original otra vez
    const restore = () => {
        if (!el.classList.contains('lines--ready')) return;
        el.innerHTML = html;
        el.removeAttribute('aria-label');
        el.style.removeProperty('width');
        el.classList.remove('lines--split');
    };
    const total = delay + cssMs('--dur-title', 900) + (lines.length - 1) * LINE_STAGGER + 150;
    setTimeout(restore, total);
}

// Devuelve una promesa que se cumple cuando el título empieza a subir
// (después de esperar a las fuentes)
export function revealLines(el, delay = 0) {
    if (!el || !prefersMotion()) return Promise.resolve();
    // esperar a las fuentes: con otra fuente los cortes de línea serían otros
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    return fonts.then(() => splitAndReveal(el, delay));
}

// Hero de la home: primero aparece el vídeo (fade 400 ms) y luego el h1.
// Es el primer pantallazo, así que no espera al scroll.
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

// =============================================
// HERO DE ABOUT
// Primero el h1 (por líneas) y después las tarjetas, una a una:
// suben 32 px con 140 ms entre ellas y un pequeño desfase distinto
// para cada una, así "flotan" en vez de salir en fila. Todo en ~1,6 s.
// Empieza cuando el h1 está de verdad en pantalla (en escritorio
// queda por debajo del primer pantallazo).
// =============================================

const CARD_STEP = 140;
// desfase de cada tarjeta (ms): menor que el paso, el orden se mantiene
const CARD_JITTER = [0, 40, -20, 30, -10, 20];
const HERO_CARDS_AFTER = 200;

const cardDelay = (i, base = 0) => base + i * CARD_STEP + CARD_JITTER[i % CARD_JITTER.length];

function initAboutHero(hero) {
    const title = hero.querySelector('[data-reveal-lines]');
    const cards = [...hero.querySelectorAll('.about-hero__card')];

    if (!prefersMotion() || !('IntersectionObserver' in window)) {
        cards.forEach((card) => card.classList.add('is-settled'));
        return;
    }

    onceVisible(title, () => {
        revealLines(title).then(() => {
            const duration = cssMs('--dur-card', 900);
            cards.forEach((card, i) => breathe(card, cardDelay(i, HERO_CARDS_AFTER), duration));
        });
    }, 0.5);
}

// Todos los títulos con [data-reveal-lines] de la página.
// Solo el h1 del hero de la home sale al cargar; los demás, cuando se ven.
export function initTitleReveals() {
    const aboutHero = document.querySelector('.about-hero');
    if (aboutHero) initAboutHero(aboutHero);
    if (!prefersMotion()) return;

    document.querySelectorAll('[data-reveal-lines]').forEach((title) => {
        const hero = title.closest('.hero');
        if (hero) revealHeroTitle(title, hero);
        else if (!title.closest('.about-hero')) onceVisible(title, () => revealLines(title), 0.5);
    });
}

// =============================================
// LÍNEAS DIVISORIAS
// Se dibujan (scaleX 0 → 1) cuando el bloque entra en pantalla
// (threshold 0.2), con +120 ms entre líneas vecinas. Cada grupo se
// dibuja una sola vez: si la zona se vuelve a pintar (p. ej. "The archive"
// tras cada cambio), las líneas nuevas aparecen ya dibujadas.
// Al terminar, la línea queda .is-settled (el formulario vuelve a su borde).
// =============================================

const LINE_SELECTOR = '.piece, .vitrine__cta, .ledger__total-label, .ledger__total, .visit__row, .event, .form__field';
const DRAW_STAGGER = 120;
const drawnGroups = new Set();

export function drawLines(container, group, { base = 0 } = {}) {
    if (!container) return;
    const lines = [...container.querySelectorAll(LINE_SELECTOR)];
    if (!lines.length) return;

    if (!prefersMotion() || drawnGroups.has(group) || !('IntersectionObserver' in window)) {
        lines.forEach((line) => line.classList.add('is-drawn', 'is-static', 'is-settled'));
        return;
    }

    onceVisible(container, () => {
        drawnGroups.add(group);
        const duration = cssMs('--dur-draw', 900);
        // en orden del documento, cada una 120 ms después de la anterior
        lines.forEach((line, i) => {
            const delay = base + i * DRAW_STAGGER;
            line.style.setProperty('--draw-delay', `${delay}ms`);
            line.classList.add('is-drawn');
            setTimeout(() => line.classList.add('is-settled'), delay + duration + 50);
        });
    }, 0.2);
}

// =============================================
// APARICIÓN ESCALONADA
// Los elementos con la clase .reveal (opacity 0 + translate) aparecen
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
                    if (event.target !== item || event.propertyName !== 'translate') return;
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
        // "translate" y no "transform": no pisa el transform propio de la fila
        el.animate([{ translate: `0 ${dy}px` }, { translate: '0 0' }], { duration, easing });
    });
}

// Plegar un elemento antes de quitarlo (opacity + scale vertical, 200 ms).
// Devuelve una promesa; sin movimiento se resuelve al momento.
export function collapse(el, duration = 200) {
    if (!el || !prefersMotion()) return Promise.resolve();
    el.style.transformOrigin = 'center top';
    const animation = el.animate(
        [{ opacity: 1, scale: '1 1' }, { opacity: 0, scale: '1 0.6' }],
        { duration, easing: easeReveal(), fill: 'forwards' },
    );
    return animation.finished.catch(() => {});
}

// =============================================
// "RESPIRACIÓN" DE LAS SECCIONES
// Basta con poner data-reveal en la sección. Cada elemento aparece una
// sola vez, cuando entra de verdad en pantalla (onceVisible), y cada tipo
// tiene su manera (los estados ocultos están en el CSS, bloque MOTION):
//   - h2: por líneas, como el h1 del hero (--dur-title, 110 ms por línea)
//   - textos (.subtitle, .eyebrow, .body-text): suben 20 px, --dur-text,
//     150 ms después del título y 100 ms entre ellos
//   - fotos y figuras (img, video): suben 48 px, --dur-media, 120 ms entre ellas
//   - tarjetas (.about-card): suben 32 px, --dur-card, 140 ms entre ellas con
//     un pequeño desfase; el texto que va junto a una tarjeta sale con ella
// Lo que esté dentro de [data-reveal-skip] no se toca.
// =============================================

const BREATH_TEXT = '.subtitle, .eyebrow, .body-text, .body-text--big';
const BREATH_MEDIA = 'img, video';
const BREATH_CARD = '.about-card';
const TEXT_AFTER_TITLE = 150;
const TEXT_STEP = 100;
const MEDIA_STEP = 120;

// El elemento aparece; al terminar se marca .is-settled. El estado final
// es el natural del elemento (opacity 1, sin translate): no salta nada.
function breathe(el, delay, duration) {
    el.style.setProperty('--breath-delay', `${delay}ms`);
    el.classList.add('is-in');
    setTimeout(() => {
        el.classList.add('is-settled');
        el.classList.remove('is-in');
        el.style.removeProperty('--breath-delay');
    }, delay + duration + 50);
}

function initSection(section) {
    const own = (el) => !el.closest('[data-reveal-skip]');
    const titles = [...section.querySelectorAll('h2')].filter(own);
    const cards = [...section.querySelectorAll(BREATH_CARD)].filter(own);
    const texts = [...section.querySelectorAll(BREATH_TEXT)].filter(own);
    const media = [...section.querySelectorAll(BREATH_MEDIA)].filter((el) => own(el) && !el.closest(BREATH_CARD));

    if (!prefersMotion() || !('IntersectionObserver' in window)) {
        titles.forEach((title) => title.classList.add('lines--ready'));
        [...texts, ...media, ...cards].forEach((el) => el.classList.add('is-settled'));
        return;
    }

    const durText = cssMs('--dur-text', 800);
    const durMedia = cssMs('--dur-media', 1100);
    const durCard = cssMs('--dur-card', 900);

    // Quién sale con quién: el subtítulo de un heading-block sale con su
    // título (aunque esté encima) y el texto junto a una tarjeta, con la tarjeta
    const followers = new Map([...titles, ...cards].map((el) => [el, []]));
    const free = texts.filter((text) => {
        const leader = text.closest('.heading-block')?.querySelector('h2')
            || text.parentElement.querySelector(`:scope > ${BREATH_CARD}`);
        if (!leader || !followers.has(leader)) return true;
        followers.get(leader).push(text);
        return false;
    });

    const byDocument = (a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
    let titleAt = null;

    const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target);
        if (!visible.length) return;
        visible.sort(byDocument);

        const now = performance.now();
        if (visible.some((el) => el.tagName === 'H2')) titleAt = now;
        // lo que va detrás del título espera a que el título haya empezado
        const afterTitle = titleAt === null ? 0 : Math.max(0, TEXT_AFTER_TITLE - (now - titleAt));
        const textQueue = [];
        let mediaIndex = 0;
        let cardIndex = 0;

        visible.forEach((el) => {
            observer.unobserve(el);
            if (el.tagName === 'H2') {
                revealLines(el);
                textQueue.push(...followers.get(el));
            } else if (el.matches(BREATH_CARD)) {
                const delay = cardDelay(cardIndex++, afterTitle);
                breathe(el, delay, durCard);
                followers.get(el).forEach((text) => breathe(text, delay + TEXT_AFTER_TITLE, durText));
            } else if (el.matches(BREATH_MEDIA)) {
                breathe(el, afterTitle + mediaIndex++ * MEDIA_STEP, durMedia);
            } else {
                textQueue.push(el);
            }
        });

        textQueue.sort(byDocument).forEach((el, i) => breathe(el, afterTitle + i * TEXT_STEP, durText));
    }, { threshold: 0, rootMargin: IN_VIEW });

    [...titles, ...cards, ...free, ...media].forEach((el) => observer.observe(el));
}

export function initSectionReveals() {
    document.querySelectorAll('[data-reveal]').forEach(initSection);
}
