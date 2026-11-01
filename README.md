# NEON RELICS

**Jewelry for quiet dominion.** Tienda online conceptual de joyería: una landing de alto impacto con varias secciones funcionales, diseñada en Figma y maquetada a mano con HTML, CSS y JavaScript vanilla.

🔗 **Demo:** [valeriapavlova.github.io/neon-relics](https://valeriapavlova.github.io/neon-relics/)

Proyecto final del módulo de Front-end — Máster en Diseño Web, UX/UI y Marketing Digital (CEI Valencia).
Diseño y desarrollo: **Valeriia Pavlova**.

---

## Páginas

| Página | Contenido |
|---|---|
| `index.html` | Hero con vídeos, manifiesto, slider de relics destacados, teaser de la cápsula, calendario de drops, about teaser y newsletter |
| `product-card.html` | Ficha de producto dinámica (`?id=`): galería, vídeo, miniaturas, selector de cantidad, pestañas y "add to capsule" |
| `capsule.html` | La cápsula personal: el carrito conceptual con las piezas guardadas |

## Funcionalidades

1. **Slider de relics** — carrusel con navegación prev/next y sistema de favoritos.
2. **Sistema de cápsula** — añadir y eliminar piezas en una lista personal persistente (`localStorage`).
3. **Ficha de producto dinámica** — un único template que se rellena desde un array de datos en JS según el parámetro de la URL.
4. **Calendario de eventos** — generado dinámicamente desde JavaScript.
5. **Newsletter** — validación en cliente con mensajes de éxito/error.
6. **Diseño responsive** — 1440, 1024, 768 y 375 px.

## Stack

- HTML5 semántico
- CSS3 con custom properties, nesting y media queries
- JavaScript vanilla (ES6+), sin frameworks
- Figma para el diseño y el sistema visual
- GitHub Pages para el despliegue

## Sistema visual

**Tipografía** (Google Fonts)
- **Unbounded** 500 / 600 — titulares, títulos de sección, links destacados
- **Jost** 400 / 500 / 600 — textos, subtítulos, botones, navegación

**Colores** (definidos como custom properties en `:root`)

| Token | Valor | Uso |
|---|---|---|
| `--c-bg` | `#D8DFE6` | Fondo base |
| `--c-primary` | `#CC230F` | Acento principal (rojo) |
| `--c-text` | `#0F1821` | Texto principal |
| `--c-bg-soft` | `#DEE3E9` | Fondo secundario |
| `--c-primary-dark` | `#A41F10` | Hover / estados activos |
| `--c-primary-soft` | `#E08C82` | Acento suave |
| `--c-text-muted` | `#82868B` | Texto secundario |

## Estructura

```
neon-relics/
├── index.html
├── product-card.html
├── capsule.html
├── css/styles.css
├── js/
│   ├── index.js      # punto de entrada (módulos ES)
│   ├── header.js     # menú de navegación
│   ├── slider.js     # carrusel de relics
│   ├── product.js    # datos y render de la ficha de producto
│   ├── capsule.js    # lógica de la cápsula (localStorage)
│   ├── events.js     # calendario de drops
│   └── parallax.js   # efecto parallax
└── assets/           # imágenes (WebP), vídeos (WebM + MP4), SVG
```

## Rendimiento

Los vídeos están comprimidos (WebM/VP9 con alternativa MP4/H.264 para Safari) y las imágenes se sirven en WebP con `loading="lazy"`.

## Ejecutar en local

No necesita build. Basta con abrir `index.html` o servir la carpeta:

```bash
npx serve .
```

---

© Valeriia Pavlova — proyecto conceptual con fines educativos.
