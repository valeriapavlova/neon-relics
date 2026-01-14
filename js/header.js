// js/header.js
export function setupHeaderMenu() {
    const menuBtn = document.querySelector('.header__menu-btn');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeBtn = document.getElementById('menuClose');
    const menuLinks = menuOverlay?.querySelectorAll('.header__menu-nav a') || [];

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
