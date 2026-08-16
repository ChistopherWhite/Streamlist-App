# StreamList — EZTechMovie

INT499 course project. A React app for EZTechMovie, a fictional cloud-based
streaming company.

## What's here (Week 2)

Building on the Week 1 shell (routing, navigation, the basic add-title form),
this milestone makes the StreamList page fully interactive:

- **Every submitted title is displayed on the page** as a "ticket" card, not
  just logged to the console.
- **Edit, delete, and mark-complete** on every ticket:
  - *Complete* — a single click toggles a title between "Watching" and
    "Watched" (dims the ticket, strikes through the title, tags it).
  - *Edit* — turns the ticket into an inline form (title, genre, platform)
    with Save/Cancel, so you never leave the page to fix a typo.
  - *Delete* — asks for a one-click confirmation ("Remove? ✓ ✗") before
    removing anything, so a stray click can't wipe out a title.
- **Filter tabs** (All / Watching / Watched) with live counts, so the list
  stays useful as it grows.
- **Toast confirmations** — a small "added / updated / removed" message
  appears after each action and clears itself after ~2.4 seconds.
- **The add-title form still clears itself** the moment a title is accepted,
  and the genre/platform the user last picked are preserved for the next
  entry.
- **Icon library installed**: [react-icons](https://react-icons.github.io/react-icons/)
  (Phosphor + Material Design sets) replaces one-off hand-drawn SVGs for the
  nav bar and every ticket action (edit/delete/complete/save/cancel/filter),
  and the Google Fonts stylesheet (Bebas Neue, Inter, JetBrains Mono) from
  Week 1 is still in place for typography.
- **Navigation** is unchanged in structure from Week 1 — the same
  React Router–driven menu (StreamList, Movies, Cart, About) — but the icons
  in it now come from the installed icon library too, so the whole app pulls
  from one consistent icon set.

Routes:
- `/` — **StreamList** (home). Full add/edit/delete/complete/filter flow described above.
- `/movies` — **Movies**. Placeholder — content arrives in Week 4.
- `/cart` — **Cart**. Placeholder — content arrives in Week 4.
- `/about` — **About**. Placeholder — content arrives in Week 5.

## Project structure

```
streamlist/
├─ index.html
├─ src/
│  ├─ main.jsx           # entry point, wraps App in BrowserRouter
│  ├─ App.jsx             # route definitions + shared layout
│  ├─ index.css           # all styling (design tokens at the top)
│  ├─ components/
│  │  ├─ Navbar.jsx       # top nav, react-icons, active-link highlighting
│  │  ├─ ComingSoon.jsx   # shared placeholder for Movies/Cart/About
│  │  └─ Icons.jsx        # legacy inline SVG set (still used by ComingSoon)
│  └─ pages/
│     ├─ StreamListPage.jsx   # add / edit / delete / complete / filter / toast
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

## State variables in StreamListPage

| State | Holds |
|---|---|
| `form` | the controlled add-title form (title, genre, platform) |
| `items` | the master list of everything the user has added |
| `error` | validation message shown when the title field is empty |
| `editingId` | id of the ticket currently in edit mode, or `null` |
| `editDraft` | the in-progress values for whichever ticket is being edited |
| `pendingDeleteId` | id of the ticket showing the "remove this?" confirm step |
| `filter` | which subset of items (`all` / `watching` / `watched`) is shown |
| `toast` | the short-lived confirmation message shown after an action |

## Notes for grading / next weeks

- State for the StreamList still lives inside `StreamListPage.jsx`. As
  Movies and Cart get built out in Week 4, this will likely move up into
  `App.jsx` (or context) so items can be shared across pages, e.g. adding a
  movie to the cart.
- Movies, Cart, and About are intentionally empty per the assignment —
  each renders a `ComingSoon` placeholder that names the week it'll be built.

