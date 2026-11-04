// js/header.js
import { renderMenuLooks, updateMenuCounts } from './menu.js';

// =============================================
// MENÚ MÓVIL (≤900)
// El botón "Menu ≡" abre un panel oscuro a pantalla completa; el header
// sigue encima (claro) y el botón pasa a "Close ✕".
// Accesibilidad: aria-expanded en el botón, el foco entra en el menú y
// vuelve al botón al cerrar, Esc cierra, el resto de la página queda
// inerte (inert) y sin scroll mientras el menú está abierto.
// =============================================

export function setupHeaderMenu() {
    initHeaderInverse();

    const header = document.querySelector('.header');
    const menuBtn = header?.querySelector('.header__menu-btn');
    const overlay = document.getElementById('menuOverlay');
    if (!menuBtn || !overlay) return;

    const label = menuBtn.querySelector('.header__menu-label');
    // lo que queda fuera del header: no se puede tabular ni leer con el menú abierto
    const outside = [...document.querySelectorAll('body > main, body > footer')];
    // a partir de 901 px el menú no existe: si se ensancha la ventana, se cierra
    const desktop = window.matchMedia('(min-width: 56.3125rem)');

    renderMenuLooks(overlay);

    const isOpen = () => menuBtn.getAttribute('aria-expanded') === 'true';

    function onKeydown(event) {
        if (event.key === 'Escape') closeMenu();
    }

    function openMenu() {
        updateMenuCounts(overlay);
        overlay.classList.add('is-open');
        header.classList.add('header--menu-open');
        document.documentElement.classList.add('is-menu-locked');
        outside.forEach((el) => { el.inert = true; });
        menuBtn.setAttribute('aria-expanded', 'true');
        if (label) label.textContent = 'Close';
        document.addEventListener('keydown', onKeydown);
        // el foco entra en el menú (primer enlace)
        overlay.querySelector('a')?.focus();
    }

    function closeMenu({ restoreFocus = true } = {}) {
        if (!isOpen()) return;
        overlay.classList.remove('is-open');
        header.classList.remove('header--menu-open');
        document.documentElement.classList.remove('is-menu-locked');
        outside.forEach((el) => { el.inert = false; });
        menuBtn.setAttribute('aria-expanded', 'false');
        if (label) label.textContent = 'Menu';
        document.removeEventListener('keydown', onKeydown);
        if (restoreFocus) menuBtn.focus();
    }

    menuBtn.addEventListener('click', () => (isOpen() ? closeMenu() : openMenu()));

    // Un enlace del menú (también los anclas de la misma página) cierra el menú;
    // el foco sigue al destino del enlace
    overlay.addEventListener('click', (event) => {
        if (event.target.closest('a')) closeMenu({ restoreFocus: false });
    });

    desktop.addEventListener('change', (event) => {
        if (event.matches) closeMenu({ restoreFocus: false });
    });
}

// Header sobre secciones rojas u oscuras ([data-header="inverse"]):
// una "línea" a media altura del header detecta qué sección pasa por debajo
// y el header cambia el color del menú (.header--inverse).
// En ≤900 el header tiene fondo opaco: sobre las secciones rojas se queda
// claro (fondo --c-bg, texto oscuro) y solo se invierte sobre las oscuras.
function initHeaderInverse() {
    const header = document.querySelector('.header');
    const sections = [...document.querySelectorAll('[data-header="inverse"]')];
    if (!header || !sections.length || !('IntersectionObserver' in window)) return;

    const under = new Set();
    const mobile = window.matchMedia('(max-width: 56.25rem)');
    let observer;

    const update = () => {
        const inverse = [...under].some((section) => !mobile.matches || !section.matches('.wrapper--red'));
        header.classList.toggle('header--inverse', inverse);
    };
    mobile.addEventListener('change', update);

    const observe = () => {
        observer?.disconnect();
        under.clear();
        const line = Math.round(header.offsetHeight / 2);
        observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) under.add(entry.target);
                else under.delete(entry.target);
            });
            update();
        }, { rootMargin: `-${line}px 0px -${Math.max(0, window.innerHeight - line - 1)}px 0px` });
        sections.forEach((section) => observer.observe(section));
    };

    observe();
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(observe, 150);
    });
}
