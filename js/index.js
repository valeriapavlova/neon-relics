// js/index.js

import { renderRelics } from './slider.js';
import { setupRelicsParallax } from './parallax.js';
import { renderEvents } from './events.js';

document.addEventListener('DOMContentLoaded', () => {
    renderRelics();
    setupRelicsParallax();
    renderEvents();
});
