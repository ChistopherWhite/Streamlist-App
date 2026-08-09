[README.md](https://github.com/user-attachments/files/30866812/README.md)
# StreamList — EZTechMovie

INT499 course project, Week 1. A React app for EZTechMovie, a fictional
cloud-based streaming company. This first milestone builds the app shell:
routing, navigation, and the StreamList home page.

## What's here (Week 1)

- **React Router** navigation with four routes, all reachable from the top nav:
  - `/` — **StreamList** (home). A form takes a title, genre, and streaming
    platform; each submission is printed to the browser console
    (`console.log`) and added to the on-page list, rendered as ticket cards.
  - `/movies` — **Movies**. Placeholder only — content arrives in Week 4.
  - `/cart` — **Cart**. Placeholder only — content arrives in Week 4.
  - `/about` — **About**. Placeholder only — content arrives in Week 5.
- Custom CSS design (no UI framework): a dark "cinema" theme with a
  ticket-stub motif for list entries. Icons are hand-drawn inline SVGs in
  `src/components/Icons.jsx` (Material-Symbols-style outline set), and
  display/body/mono type comes from Google Fonts (Bebas Neue, Inter,
  JetBrains Mono).

## Project structure

```
streamlist/
├─ index.html
├─ src/
│  ├─ main.jsx           # entry point, wraps App in BrowserRouter
│  ├─ App.jsx             # route definitions + shared layout
│  ├─ index.css           # all styling (design tokens at the top)
│  ├─ components/
│  │  ├─ Navbar.jsx       # top nav, active-link highlighting
│  │  ├─ ComingSoon.jsx   # shared placeholder for Movies/Cart/About
│  │  └─ Icons.jsx        # inline SVG icon set
│  └─ pages/
│     ├─ StreamListPage.jsx
│     ├─ MoviesPage.jsx
│     ├─ CartPage.jsx
│     └─ AboutPage.jsx
└─ package.json
```

## Run it locally

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build a production bundle:

```bash
npm run build
npm run preview
```

## Notes for grading / next weeks

- State for the StreamList currently lives inside `StreamListPage.jsx`. As
  Movies and Cart get built out in Week 4, this will likely move up into
  `App.jsx` (or a small context) so items can be shared across pages, e.g.
  adding a movie to the cart.
- Movies, Cart, and About are intentionally empty per the assignment —
  each renders a `ComingSoon` placeholder that names the week it'll be built.
