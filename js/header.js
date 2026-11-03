// js/header.js
export function setupHeaderMenu() {
    const menuBtn = document.querySelector('.header__menu-btn');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeBtn = document.getElementById('menuClose');
    const menuLinks = menuOverlay?.querySelectorAll('.header__menu-nav a') || [];

    initHeaderInverse();

    if (!menuBtn || !menuOverlay || !closeBtn) return;

    const openMenu = () => menuOverlay.classList.add('is-open');
    const closeMenu = () => menuOverlay.classList.remove('is-open');

    menuBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    menuLinks.forEach(link => link.addEventListener('click', closeMenu));

        menuOverlay.addEventListener('click', (e) => {
        const isTablet = window.innerWidth <= 1024 && window.innerWidth >= 769;
        if (!isTablet) return;
        // Si el click es directamente en el overlay y no en el menú
        if (e.target === menuOverlay) {
            closeMenu();
        }
    });

}

// Header sobre secciones rojas u oscuras ([data-header="inverse"]):
// una "línea" a media altura del header detecta qué sección pasa por debajo
// y el header cambia el color del menú (.header--inverse)
function initHeaderInverse() {
    const header = document.querySelector('.header');
    const sections = [...document.querySelectorAll('[data-header="inverse"]')];
    if (!header || !sections.length || !('IntersectionObserver' in window)) return;

    const under = new Set();
    let observer;

    const update = () => header.classList.toggle('header--inverse', under.size > 0);

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
