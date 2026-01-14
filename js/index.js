// js/index.js


import { renderRelics } from './slider.js';
import { setupRelicsParallax } from './parallax.js';
import { renderEvents } from './events.js';
import { setupHeaderMenu } from './header.js';


document.addEventListener('DOMContentLoaded', () => {
renderRelics();
setupRelicsParallax();
renderEvents();
setupHeaderMenu();
});