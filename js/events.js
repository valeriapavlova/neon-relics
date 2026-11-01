// js/events.js
const events = [
    {
        date: '2026-12-12',
        displayDate: '2026 12 12',
        title: 'Coded Skin',
        text: 'Intimate presentation of new polished black pieces, designed for the night and the screen.',
    },
    {
        date: '2027-02-14',
        displayDate: '2027 02 14',
        title: 'Sapphire Static',
        text: 'Portraits in deep blue; an experimental session where the jewel dictates the posture.',
    },
    {
        date: '2027-04-03',
        displayDate: '2027 04 03',
        title: 'Halo Archive',
        text: 'Private viewing of collars and halos that will never reach open sale.',
    },
    {
        date: '2027-06-21',
        displayDate: '2027 06 21',
        title: 'Orbit Ceremony',
        text: 'A single set of circular pieces, designed for those who spin off-center.',
    },
];

export function renderEvents() {
    const list = document.getElementById('events-list');
    if (!list) return;

    list.innerHTML = '';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Solo eventos futuros; si ya pasaron todos, mostramos los últimos 4
    // para que la sección nunca se quede vacía
    const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
    const upcoming = sorted.filter((event) => new Date(event.date) >= today);
    const visible = upcoming.length ? upcoming : sorted.slice(-4);

    visible.forEach((event) => {
            const li = document.createElement('li');
            li.className = 'events__item';

            const article = document.createElement('article');
            article.className = 'event';

            const date = document.createElement('p');
            date.className = 'event__date body-text--small';
            date.textContent = event.displayDate;

            const content = document.createElement('div');
            content.className = 'event__content';

            const title = document.createElement('h3');
            title.className = 'event__title t--event';
            title.textContent = event.title;

            const text = document.createElement('p');
            text.className = 'event__text body-text--small';
            text.textContent = event.text;

            content.append(title, text); // Wrap title and text in content div
            article.append(date, content); // Append date and content div to article
            li.appendChild(article); // Append article to list item
            list.appendChild(li); // Append list item to the events list
        });
}

// Image animation on scroll
/*
export function setupEventsImageAnimation() {
    const img = document.querySelector('.events__img-inner');
    if (!img || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    img.classList.add('events__img--floating');
                } else {
                    img.classList.remove('events__img--floating');
                }
            });
        },
        { threshold: 0.3 }
    );

    observer.observe(img);
}
*/
