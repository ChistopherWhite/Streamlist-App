# StreamList — EZTechMovie

INT499 course project. A React app for EZTechMovie, a fictional cloud-based
streaming company.

## What's here (Week 4)

This milestone is an AI-assisted code review pass rather than new
features: the existing app was handed to an AI tool (Claude, read
directly against the project source — the same workflow as using
CodeGPT or Copilot Chat in VS Code) to find real problems in the
components, and the findings were reviewed and selectively acted on.

Full write-up, including what was fixed and what was intentionally
left alone (with reasoning), is in
[`AI_CODE_REVIEW.md`](./AI_CODE_REVIEW.md). Short version:

- **Fixed:** a race condition in the Movies page's debounced search
  that could let stale results reappear after the search box was
  cleared.
- **Fixed:** a suppressed React Hook lint warning in `MoviesPage`,
  resolved properly with `useCallback` instead of silencing it.
- **Fixed:** missing form labels and no Enter-to-save support on the
  inline ticket-edit form in `TicketCard`.
- **Reviewed, not changed:** lifting shared state into Context,
  syncing `localStorage` across browser tabs, and memoizing
  `TicketCard` — each flagged by the review but consciously skipped as
  premature for the app's current scope, with reasoning documented.

Speaker notes for the required video presentation — covering the
review process, what was implemented vs. skipped and why, and a
reflection on using AI for testing — are in
[`AI_TESTING_SPEAKER_NOTES.md`](./AI_TESTING_SPEAKER_NOTES.md).

## What's here (Week 3)

This milestone adds a real external API and fixes the app's biggest
usability gap from the first two weeks: a page refresh used to wipe out
everything the user had added.

### TMDB API integration
- New **Movies** page (`/movies`) is now fully built out, searching
  [The Movie Database](https://www.themoviedb.org/) (TMDB) instead of
  showing a placeholder.
- Search is debounced (fires ~400ms after you stop typing) and also
  works via a Search button / Enter key.
- Each result shows poster, title, release year, TMDB rating, a genre
  tag, and a trimmed synopsis, pulled straight from TMDB's
  `/search/movie` endpoint.
- An **"Add to StreamList"** button on every result adds that movie to
  the same list the StreamList home page reads from — so a title found
  through search shows up back home immediately, tagged `TMDB` as its
  platform. Titles already on the list show "On your list" and can't be
  added twice.
- If no TMDB API key is configured, the page shows setup instructions
  instead of a broken screen (see **Setup** below).

### localStorage persistence
- Every StreamList item (added manually or from TMDB) is now saved to
  `localStorage` the moment it changes — adds, edits, deletes, and
  watched/watching toggles are all persisted immediately.
- Refreshing the page, or closing and reopening the tab, restores the
  full list exactly as it was.

### Code reconstruction for consistency
This week's refactor centralizes logic that used to live only inside
`StreamListPage`, so the new Movies page doesn't duplicate it:
- **`src/hooks/useLocalStorage.js`** — a generic `useState`-plus-persistence
  hook.
- **`src/hooks/useStreamListItems.js`** — the single source of truth for
  the StreamList data: `addItem`, `updateItem`, `removeItem`,
  `toggleComplete`, and duplicate-checking (`hasTmdbId`). Both
  `StreamListPage` and `MoviesPage` call this same hook, so there's
  exactly one place that knows how an item is shaped and stored.
- **`src/lib/constants.js`** — genres, platforms, filters, and the TMDB
  genre-id-to-label map, previously duplicated inline.
- **`src/components/TicketCard.jsx`** — the ticket UI extracted out of
  `StreamListPage` into its own component.

## Setup

Requires Node.js 18+ and a free TMDB account.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Get a free TMDB API key at
   [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).
3. Copy `.env.example` to `.env` and paste in your key:
   ```bash
   cp .env.example .env
   ```
   ```
   VITE_TMDB_API_KEY=your_key_here
   ```
   `.env` is gitignored — your key is never committed.
4. Run the dev server:
   ```bash
   npm run dev
   ```

Without a key, the app still runs; the Movies page just shows setup
instructions instead of search results.

To build a production bundle:

```bash
npm run build
npm run preview
```

## Routes

- `/` — **StreamList** (home). Add, edit, delete, mark-complete, and
  filter titles. Fully persisted to `localStorage`.
- `/movies` — **Movies**. Search TMDB and add results to your list.
- `/cart` — **Cart**. Placeholder — content arrives in Week 4.
- `/about` — **About**. Placeholder — content arrives in Week 5.

## Project structure

```
streamlist/
├─ .env.example           # documents the required TMDB env var (not the real key)
├─ index.html
├─ VIDEO_SCRIPT.md         # walkthrough script/shot list for the video presentation
├─ src/
│  ├─ main.jsx             # entry point, wraps App in BrowserRouter
│  ├─ App.jsx              # route definitions + shared layout
│  ├─ index.css            # all styling (design tokens at the top)
│  ├─ hooks/
│  │  ├─ useLocalStorage.js     # generic persisted-state hook
│  │  └─ useStreamListItems.js  # shared CRUD logic for the StreamList data
│  ├─ lib/
│  │  ├─ tmdb.js            # TMDB fetch wrapper (search, image URLs)
│  │  └─ constants.js       # genres, platforms, filters, TMDB genre map
│  ├─ components/
│  │  ├─ Navbar.jsx         # top nav, react-icons, active-link highlighting
│  │  ├─ TicketCard.jsx     # a single StreamList entry (view + inline edit)
│  │  ├─ ComingSoon.jsx     # shared placeholder for Cart/About
│  │  └─ Icons.jsx          # legacy inline SVG set (still used by ComingSoon)
│  └─ pages/
│     ├─ StreamListPage.jsx # add/edit/delete/complete/filter, backed by the shared hook
│     ├─ MoviesPage.jsx     # TMDB search + "Add to StreamList"
│     ├─ CartPage.jsx
│     └─ AboutPage.jsx
└─ package.json
```

