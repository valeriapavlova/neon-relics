// js/events.js
const events = [
    {
        date: '2026-02-14',
        displayDate: '2026 02 14',
        title: 'Coded Skin',
        text: 'Intimate presentation of new polished black pieces, designed for the night and the screen.',
    },
    {
        date: '2026-03-21',
        displayDate: '2026 03 21',
        title: 'Sapphire Static',
        text: 'Portraits in deep blue; an experimental session where the jewel dictates the posture.',
    },
    {
        date: '2026-05-19',
        displayDate: '2026 05 19',
        title: 'Halo Archive',
        text: 'Private viewing of collars and halos that will never reach open sale.',
    },
    {
        date: '2026-09-13',
        displayDate: '2026 09 13',
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

    events
        .filter((event) => new Date(event.date) >= today) // Only future events
        .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date ascending
        .forEach((event) => {
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
