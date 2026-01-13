
    const relics = [
        {
        id: '11',
        title: 'Scarlet Veil Choker',
        image: 'images/011.jpeg',
        alt: 'Scarlet Veil Choker - Metallic chain choker with cascading fringe',
        link: 'piece-11-scarlet-veil-choker.html'
        },
        {
        id: '03',
        title: 'Lunar Orbit Earrings',
        image: 'images/03.jpeg',
        alt: 'Lunar Orbit Earrings - Pearl-encrusted oval statement earrings',
        link: 'piece-03-lunar-orbit-earrings.html'
        },
        {
        id: '12',
        title: 'Interlocked Chain Earrings',
        image: 'images/012.jpeg',
        alt: 'Interlocked Chain Earrings - Bronze chain link statement earrings',
        link: 'piece-12-interlocked-chain-earrings.html'
        },
        {
        id: '02',
        title: 'Dominion Chain Collar',
        image: 'images/02.jpeg',
        alt: 'Dominion Chain Collar - Thick gold Cuban link chain necklace',
        link: 'piece-02-dominion-chain-collar.html'
        },
        {
        id: '05',
        title: 'Obsidian Coil Collar',
        image: 'images/05.jpeg',
        alt: 'Obsidian Coil Collar - Multi-layered black beaded statement collar necklace',
        link: 'piece-05-obsidian-coil-collar.html'
        },
        {
        id: '08',
        title: 'Void Relic Earrings',
        image: 'images/08.jpeg',
        alt: 'Void Relic Earrings - Ornate black pearl and gold drop earrings',
        link: 'piece-08-void-relic-earrings.html'
        },
        {
        id: '01',
        title: 'Midnight Constellation Collar',
        image: 'images/01.jpeg',
        alt: 'Midnight Constellation Collar - Multi-layered black crystal mesh statement collar',
        link: 'piece-01-midnight-constellation-collar.html'
        },
        {
        id: '06',
        title: 'Eclipse Stone Ear Cuff',
        image: 'images/06.jpeg',
        alt: 'Eclipse Stone Ear Cuff - Dark crystal ear cuff in gunmetal setting',
        link: 'piece-06-eclipse-stone-ear-cuff.html'
        },
        {
        id: '07',
        title: 'Signal Bar Earrings',
        image: 'images/07.jpeg',
        alt: 'Signal Bar Earrings - Minimalist gold vertical bar drop earrings',
        link: 'piece-07-signal-bar-earrings.html'
        },
        {
        id: '04',
        title: 'Celestial Mask Collar',
        image: 'images/04.jpeg',
        alt: 'Celestial Mask Collar - Multi-material beaded face mask and neck piece with golden halo',
        link: 'piece-04-celestial-mask-collar.html'
        }

    ];

    function createRelicCard(relic) {
        const article = document.createElement('article');
        article.className = 'relic-card';

    // Número + botón favoritos
        const favoriteWrapper = document.createElement('div');
        favoriteWrapper.className = 'favorite__wrapper';

        const idSpan = document.createElement('span');
        idSpan.className = 't--card';
        idSpan.textContent = relic.id;

        const favBtn = document.createElement('button');
        favBtn.className = 'btn favorite-btn';
        favBtn.setAttribute('aria-label', 'Add to wishlist');

        const favIcon = document.createElement('i');
        favIcon.className = 'ri-heart-add-2-line';
        favIcon.setAttribute('aria-hidden', 'true');

        favBtn.appendChild(favIcon);
        favoriteWrapper.append(idSpan, favBtn);

        // Link principal + imagen
        const linkWrapperTop = document.createElement('a');
        linkWrapperTop.className = 'relic-card__link';
        linkWrapperTop.href = relic.link;

        const figure = document.createElement('figure');
        figure.className = 'relic-card__media';

        const img = document.createElement('img');
        img.src = relic.image;
        img.alt = relic.alt;
        img.loading = 'lazy';

        figure.appendChild(img);
        linkWrapperTop.appendChild(figure);

        // Body
        const body = document.createElement('div');
        body.className = 'relic-card__body';

        const title = document.createElement('h3');
        title.className = 'relic-card__title';
        title.textContent = relic.title;

        const cartBtn = document.createElement('button');
        cartBtn.className = 'btn cart-btn';
        cartBtn.setAttribute('aria-label', 'Add to cart');

        const cartIcon = document.createElement('i');
        cartIcon.className = 'ri-arrow-right-circle-line';
        cartIcon.setAttribute('aria-hidden', 'true');

        cartBtn.appendChild(cartIcon);

        // Events for add to cart button
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addToCapsule(relic);
        });

        body.append(title, cartBtn);

        // Montar card completa
        article.append(favoriteWrapper, linkWrapperTop, body);

        return article;
    }

    function addToCapsule(relic) {
    // Aquí puedes guardar en localStorage, mostrar un mensaje, etc.

    let capsule = JSON.parse(localStorage.getItem('capsule')) || [];
    capsule.push(relic);
    localStorage.setItem('capsule', JSON.stringify(capsule));
    alert(`${relic.title} added to your capsule!`);
}

    export function renderRelics() {
        const track = document.querySelector('.slider__track');
        relics.forEach((relic) => {
        const card = createRelicCard(relic);
        track.appendChild(card);
        });
    }
