import { useLocalStorage } from "./useLocalStorage";

export const STREAMLIST_STORAGE_KEY = "streamlist:items";

/*
  Every page that touches the user's list — the StreamList home page
  and the Movies/TMDB search page — goes through this one hook instead
  of each keeping its own copy of the add/edit/delete/complete logic.
  That's the "reconstruct for consistency" piece: there is exactly one
  place that knows how an item is shaped and how it's persisted, so the
  two pages can't drift out of sync with each other.
*/
export function useStreamListItems() {
  const [items, setItems] = useLocalStorage(STREAMLIST_STORAGE_KEY, []);

  function addItem({ title, genre, platform, tmdbId = null, posterPath = null }) {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return { added: false, reason: "empty" };

    if (tmdbId != null && items.some((item) => item.tmdbId === tmdbId)) {
      return { added: false, reason: "duplicate" };
    }

    const entry = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      genre,
      platform,
      tmdbId,
      posterPath,
      completed: false,
      addedAt: new Date().toISOString(),
    };

    setItems((prev) => [entry, ...prev]);
    return { added: true, entry };
  }

  function updateItem(id, changes) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function toggleComplete(id) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  }

  function hasTmdbId(tmdbId) {
    return items.some((item) => item.tmdbId === tmdbId);
  }

  return { items, addItem, updateItem, removeItem, toggleComplete, hasTmdbId };
}
