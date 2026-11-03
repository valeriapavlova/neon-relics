// js/capsule.js

// =============================================
// CÁPSULA
// 1. Almacenamiento en localStorage + contador del header
// 2. Página capsule.html: archivo ordenado, notas, release/undo,
//    "Bring to viewing" / "Kept for later", resumen "The archive"
//    y formulario "Seal my capsule"
// =============================================

import { LOOKS, PIECES } from './data.js';
import { drawLines, revealStagger, flip, collapse } from './motion.js';

// =============================================
// 1. ALMACENAMIENTO
// =============================================

// Formato en localStorage: [{ id, note, status }]  (el orden = orden de elección)
// status: 'viewing' (se envía al sellar) | 'later' (se queda para después)
//         | 'requested' (ya enviada, esperando la visita privada)
const STORAGE_KEY = 'capsule';
const STATUSES = ['viewing', 'later', 'requested'];

// Formato antiguo: [{ id: '02', title, image, quantity, ... }]
// Los ids viejos que tienen equivalente en la colección cápsula se migran;
// el resto se descarta. La cantidad se ignora: cada reliquia es única.
const LEGACY_IDS = {
    '01': 'constellation-gorget', // Midnight Constellation Collar
    '02': 'dominion-collar',      // Dominion Chain Collar
    '03': 'halo-hoop',            // Sapphire Clarity Hoops
    '05': 'obsidian-choker',      // Obsidian Coil Collar
};

function normalize(list) {
    if (!Array.isArray(list)) return [];
    const seen = new Set();
    const clean = [];

    list.forEach((item) => {
        if (!item) return;
        const id = PIECES[item.id] ? item.id : LEGACY_IDS[item.id];
        if (!id || seen.has(id)) return;
        seen.add(id);
        clean.push({
            id,
            note: typeof item.note === 'string' ? item.note : '',
            // registros antiguos sin status → 'viewing'
            status: STATUSES.includes(item.status) ? item.status : 'viewing',
        });
    });

    return clean;
}

export function getCapsule() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const clean = normalize(JSON.parse(raw));
        // si venía en formato antiguo, guardarlo ya migrado
        if (JSON.stringify(clean) !== raw) saveCapsule(clean);
        return clean;
    } catch (e) {
        return [];
    }
}

export function saveCapsule(capsule) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalize(capsule)));
    } catch (e) {
        // localStorage no disponible (modo privado, bloqueado...)
    }
}

export function isInCapsule(id) {
    return getCapsule().some((item) => item.id === id);
}

// Añade piezas al final
export function addToCapsule(...ids) {
    const capsule = getCapsule();
    ids.forEach((id) => {
        if (PIECES[id] && !capsule.some((item) => item.id === id)) capsule.push({ id, note: '', status: 'viewing' });
    });
    saveCapsule(capsule);
    updateCapsuleCounter();
}

export function removeFromCapsule(id) {
    saveCapsule(getCapsule().filter((item) => item.id !== id));
    updateCapsuleCounter();
}

// Contador del header: número de reliquias
// Enlace .wishlist-counter → texto "Capsule" + círculo metálico con el número
export function updateCapsuleCounter() {
    const counterLink = document.querySelector('.wishlist-counter');
    if (!counterLink) return;

    const count = getCapsule().length;
    const badge = counterLink.querySelector('.wishlist-counter__badge');
    if (badge) badge.textContent = count;

    counterLink.setAttribute('aria-label', `Capsule, ${count} ${count === 1 ? 'relic' : 'relics'}`);
}

// =============================================
// 2. PÁGINA CAPSULE.HTML
// =============================================

const eur = (n) => '€' + n.toLocaleString('en-US');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pad = (n) => String(n).padStart(2, '0');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Estado de la página (solo en memoria)
let capsule = [];
let removed = null; // { item, index } para "Undo"
let sealed = null;  // { name } cuando la cápsula está sellada
let root = null;
let rowsShown = false; // las filas solo aparecen escalonadas la primera vez

// ---- aviso (toast) ----

let toastTimer;

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('toast--visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('toast--visible'), 2500);
}

// ---- render ----

function undoTemplate() {
    if (!removed) return '';
    return `
        <div class="archive-undo">
            <span>${esc(PIECES[removed.item.id].name)} released from your capsule.</span>
            <button type="button" class="archive-undo__btn" data-undo>Undo</button>
        </div>`;
}

function emptyTemplate() {
    return `
        ${undoTemplate()}
        <div class="archive-empty">
            <h2 class="archive-empty__title">The archive is empty</h2>
            <p class="archive-empty__text body-text">Open a look and keep the pieces that speak for you. They will wait here, in the order you choose.</p>
            <a class="btn btn--primary" href="index.html#collection">See the four looks</a>
        </div>`;
}

// Selector segmentado [ Viewing | Later ]; las piezas ya enviadas no se cambian
const SEGMENTS = [['viewing', 'Viewing'], ['later', 'Later']];

function statusTemplate(item, piece) {
    if (item.status === 'requested') {
        return `<span class="archive-entry__status archive-entry__status--requested">Requested · awaiting viewing</span>`;
    }
    const buttons = SEGMENTS.map(([value, label]) => `
            <button type="button" class="archive-entry__segment" data-status="${esc(item.id)}" data-value="${value}"
                aria-pressed="${item.status === value}">${label}</button>`).join('');
    return `
        <div class="archive-entry__segmented" role="group" aria-label="Status of ${esc(piece.name)}">${buttons}
        </div>`;
}

function entryTemplate(item, i) {
    const piece = PIECES[item.id];
    const look = LOOKS.find((l) => l.id === piece.look);
    const last = i === capsule.length - 1;

    return `
        <li class="archive-entry archive-entry--${item.status}${rowsShown ? '' : ' reveal'}" draggable="true" data-index="${i}" data-id="${esc(item.id)}">
            <span class="archive-entry__handle" aria-hidden="true" title="Drag to reorder">⋮⋮</span>
            <span class="archive-entry__index">${pad(i + 1)}</span>
            <a class="archive-entry__media" href="product-card.html?look=${encodeURIComponent(piece.look)}" draggable="false">
                <img src="${esc(piece.img)}" alt="${esc(piece.name)}" loading="lazy" draggable="false">
            </a>
            <div class="archive-entry__text">
                <h3 class="archive-entry__name">${esc(piece.name)}</h3>
                <p class="archive-entry__from">From ${esc(look ? look.name : '')} · ${esc(piece.edition)}</p>
                ${item.status === 'later' ? '<p class="archive-entry__status">Kept for later</p>' : ''}
                <textarea class="archive-entry__note" rows="1" data-note="${esc(item.id)}"
                    aria-label="Why ${esc(piece.name)} resonates with you" placeholder="Why it resonates…">${esc(item.note)}</textarea>
            </div>
            <div class="archive-entry__controls">
                <button type="button" class="archive-entry__move" data-move="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''}
                    aria-label="Move ${esc(piece.name)} up">↑</button>
                <button type="button" class="archive-entry__move" data-move="${i}" data-dir="1" ${last ? 'disabled' : ''}
                    aria-label="Move ${esc(piece.name)} down">↓</button>
                <span class="archive-entry__price">${eur(piece.price)}</span>
                ${statusTemplate(item, piece)}
                <button type="button" class="archive-entry__release" data-remove="${esc(item.id)}"
                    aria-label="Release ${esc(piece.name)}">Release</button>
            </div>
        </li>`;
}

const byStatus = (status) => capsule.filter((item) => item.status === status);
const sumOf = (items) => items.reduce((sum, item) => sum + PIECES[item.id].price, 0);

function ledgerTemplate() {
    const looks = new Set(capsule.map((item) => PIECES[item.id].look)).size;
    const viewing = byStatus('viewing');
    const later = byStatus('later');
    const requested = byStatus('requested');
    const none = viewing.length === 0;

    const action = sealed
        ? `
            <div class="ledger__sealed" role="status" tabindex="-1" data-sealed>
                <p class="ledger__sealed-title">Capsule sealed</p>
                <p>${esc(sealed.name)}, your ${sealed.count} ${sealed.count === 1 ? 'relic is' : 'relics are'} set aside under your name. In the real atelier, an invitation to a private viewing would follow.</p>
                ${later.length ? `<p>${later.length} kept for later ${later.length === 1 ? 'stays' : 'stay'} in your capsule. Seal ${later.length === 1 ? 'it' : 'them'} whenever you are ready.</p>` : ''}
            </div>
            <button type="button" class="vitrine__btn" data-reopen>Open the capsule again</button>`
        : `
            <p class="ledger__text">Relics are not sold on impulse. Seal your capsule to request a private viewing, where each piece is fitted in person.</p>
            <form class="seal-form" id="seal-form" novalidate>
                <div class="seal-form__field">
                    <label class="seal-form__label" for="seal-name">Name</label>
                    <input class="seal-form__input" id="seal-name" name="name" type="text" autocomplete="name" required
                        aria-describedby="seal-name-error">
                    <span class="seal-form__error" id="seal-name-error" hidden>Add your name so we know who to expect.</span>
                </div>
                <div class="seal-form__field">
                    <label class="seal-form__label" for="seal-email">Email</label>
                    <input class="seal-form__input" id="seal-email" name="email" type="email" autocomplete="email" required
                        aria-describedby="seal-email-error">
                    <span class="seal-form__error" id="seal-email-error" hidden>Use an email like name@domain.com.</span>
                </div>
                <button type="submit" class="vitrine__btn vitrine__btn--filled" ${none ? 'disabled aria-describedby="seal-hint"' : ''}>Seal my capsule</button>
                ${none ? '<p class="seal-form__hint" id="seal-hint">Choose at least one relic to bring to the viewing.</p>' : ''}
            </form>`;

    return `
        <aside class="vitrine ledger" aria-labelledby="ledger-title">
            <h2 class="ledger__title" id="ledger-title">The archive</h2>
            <dl class="ledger__list">
                <dt>Relics kept</dt><dd>${capsule.length} of ${Object.keys(PIECES).length}</dd>
                <dt>Looks represented</dt><dd>${looks} of ${LOOKS.length}</dd>
                <dt>Kept for later</dt><dd>${later.length}</dd>
                ${requested.length ? `<dt>Awaiting viewing</dt><dd>${requested.length} · ${eur(sumOf(requested))}</dd>` : ''}
                <dt class="ledger__total-label">To be fitted</dt><dd class="ledger__total">${viewing.length} · ${eur(sumOf(viewing))}</dd>
            </dl>
            ${action}
        </aside>`;
}

// focus: selector del elemento que debe recibir el foco tras pintar
function render(focus) {
    if (!root) return;

    if (!capsule.length) {
        root.innerHTML = emptyTemplate();
    } else {
        root.innerHTML = `
            <div class="archive-page__list">
                <ol class="archive" aria-label="Capsule, in your order">
                    ${capsule.map(entryTemplate).join('')}
                </ol>
                ${undoTemplate()}
            </div>
            ${ledgerTemplate()}`;
    }

    root.querySelectorAll('[data-note]').forEach(autosize);
    if (!rowsShown && capsule.length) {
        revealStagger(root.querySelectorAll('.archive-entry'), { step: 80 });
        rowsShown = true;
    }
    drawLines(root.querySelector('.ledger'), 'ledger');
    if (focus) root.querySelector(focus)?.focus();
}

// ---- acciones ----

// Guardar, actualizar contador y volver a pintar
function commit(focus) {
    saveCapsule(capsule);
    updateCapsuleCounter();
    render(focus);
}

// Igual que commit(), pero las filas se deslizan a su nuevo sitio (FLIP, 200 ms)
function commitWithFlip(focus) {
    flip(root, '.archive-entry', 'id', () => commit(focus));
}

function move(from, to) {
    if (to < 0 || to >= capsule.length || from === to) return false;
    const [item] = capsule.splice(from, 1);
    capsule.splice(to, 0, item);
    sealed = null;
    return true;
}

let releasing = false; // evita dobles clics mientras la fila se pliega

function release(id) {
    const index = capsule.findIndex((item) => item.id === id);
    if (index < 0 || releasing) return;
    releasing = true;

    // la fila se pliega y las de abajo suben a su sitio (FLIP)
    const row = [...root.querySelectorAll('.archive-entry')].find((li) => li.dataset.id === id);
    collapse(row).then(() => {
        releasing = false;
        removed = { item: capsule[index], index };
        capsule.splice(index, 1);
        sealed = null;
        commitWithFlip('[data-undo]');
        showToast(`${PIECES[id].name} released`);
    });
}

// viewing ↔ later; el orden de la lista no cambia
// Clic en el segmento ya elegido: no hace nada
function setStatus(id, status) {
    const item = capsule.find((x) => x.id === id);
    if (!item || item.status === 'requested' || item.status === status) return;
    if (status !== 'viewing' && status !== 'later') return;
    item.status = status;
    sealed = null;
    commit(`[data-status="${id}"][data-value="${status}"]`);
    showToast(item.status === 'later'
        ? `${PIECES[id].name} kept for later`
        : `${PIECES[id].name} brought to the viewing`);
}

function undo() {
    if (!removed) return;
    const { item, index } = removed;
    capsule.splice(Math.min(index, capsule.length), 0, item);
    removed = null;
    commit(`[data-remove="${item.id}"]`);
    showToast('Restored to your capsule');
}

function autosize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
}

function handleSubmit(event) {
    if (event.target.id !== 'seal-form') return;
    event.preventDefault();

    const name = root.querySelector('#seal-name');
    const email = root.querySelector('#seal-email');
    const okName = name.value.trim().length > 1;
    const okEmail = EMAIL_RE.test(email.value.trim());

    // mostrar / ocultar errores
    [[name, okName], [email, okEmail]].forEach(([input, ok]) => {
        input.setAttribute('aria-invalid', String(!ok));
        document.getElementById(`${input.id}-error`).hidden = ok;
    });

    if (!okName) return name.focus();
    if (!okEmail) return email.focus();

    const viewing = byStatus('viewing');
    if (!viewing.length) return;
    viewing.forEach((item) => { item.status = 'requested'; });
    sealed = { name: name.value.trim(), count: viewing.length };
    saveCapsule(capsule);
    render('[data-sealed]');
    showToast('Capsule sealed');
}

function handleClick(event) {
    const btn = event.target.closest('button');
    if (!btn || !root.contains(btn)) return;

    if (btn.dataset.move !== undefined) {
        const from = Number(btn.dataset.move);
        const dir = Number(btn.dataset.dir);
        const to = from + dir;
        if (!move(from, to)) return;
        // mantener el foco en la misma flecha; si queda desactivada, en la otra
        const same = `[data-move="${to}"][data-dir="${dir}"]`;
        const other = `[data-move="${to}"][data-dir="${-dir}"]`;
        const edge = to === 0 || to === capsule.length - 1;
        commitWithFlip(edge ? other : same);
    } else if (btn.dataset.status) {
        setStatus(btn.dataset.status, btn.dataset.value);
    } else if (btn.dataset.remove) {
        release(btn.dataset.remove);
    } else if (btn.dataset.undo !== undefined) {
        undo();
    } else if (btn.dataset.reopen !== undefined) {
        sealed = null;
        render('#seal-name');
    }
}

function handleInput(event) {
    const id = event.target.dataset?.note;
    if (!id) return;
    const item = capsule.find((x) => x.id === id);
    if (item) {
        item.note = event.target.value;
        saveCapsule(capsule);
    }
    autosize(event.target);
}

// ---- drag & drop (escritorio; en teclado y móvil se usan ↑↓) ----

function setupDragAndDrop() {
    let from = null;
    const entry = (event) => event.target.closest?.('.archive-entry');

    root.addEventListener('dragstart', (event) => {
        const li = entry(event);
        if (!li) return;
        from = Number(li.dataset.index);
        li.classList.add('archive-entry--dragging');
        event.dataTransfer.effectAllowed = 'move';
        try {
            event.dataTransfer.setData('text/plain', String(from));
        } catch (e) {
            // algunos navegadores no permiten setData
        }
    });

    root.addEventListener('dragover', (event) => {
        const li = entry(event);
        if (!li || from === null) return;
        event.preventDefault();
        root.querySelectorAll('.archive-entry--over').forEach((x) => x !== li && x.classList.remove('archive-entry--over'));
        li.classList.add('archive-entry--over');
    });

    root.addEventListener('drop', (event) => {
        const li = entry(event);
        if (!li || from === null) return;
        event.preventDefault();
        const to = Number(li.dataset.index);
        const name = PIECES[capsule[from].id].name;
        if (move(from, to)) {
            commitWithFlip();
            showToast(`${name} moved to position ${to + 1}`);
        }
        from = null;
    });

    root.addEventListener('dragend', () => {
        from = null;
        root.querySelectorAll('.archive-entry--dragging, .archive-entry--over')
            .forEach((x) => x.classList.remove('archive-entry--dragging', 'archive-entry--over'));
    });
}

// ---- init ----

export function initCapsulePage() {
    root = document.getElementById('capsule-root');
    if (!root) return;

    capsule = getCapsule();
    render();
    updateCapsuleCounter();

    root.addEventListener('click', handleClick);
    root.addEventListener('input', handleInput);
    root.addEventListener('submit', handleSubmit);
    setupDragAndDrop();

    // ajustar alturas de las notas si cambia el ancho
    window.addEventListener('resize', () => root.querySelectorAll('[data-note]').forEach(autosize));
}
