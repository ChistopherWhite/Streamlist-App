import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PiPlusCircleBold, PiSparkleFill, PiFunnelBold } from "react-icons/pi";
import { useStreamListItems } from "../hooks/useStreamListItems";
import { GENRES, PLATFORMS, FILTERS } from "../lib/constants";
import TicketCard from "../components/TicketCard";

const EMPTY_FORM = { title: "", genre: GENRES[0], platform: PLATFORMS[0] };

/*
  Homepage of the app. Collects a title from the user, prints the raw
  input to the console, and renders every submitted title as a ticket
  below. Item state itself (add/edit/delete/complete, plus persistence)
  now lives in useStreamListItems, which is shared with the Movies page
  so both routes read and write the exact same localStorage-backed list.

    form            - the controlled add-title form
    editingId       - id of the ticket currently in edit mode, or null
    editDraft       - the in-progress values for whichever ticket is being edited
    pendingDeleteId - id of the ticket showing the "remove this?" confirm step
    filter          - which subset of items ("all" | "watching" | "watched") is shown
    toast           - a short-lived confirmation message shown after an action
*/
function StreamListPage() {
  const { items, addItem, updateItem, removeItem, toggleComplete } = useStreamListItems();

  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState(EMPTY_FORM);

  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    // The assignment asks the StreamList component to take the
    // user's input and display it on the console.
    console.log("StreamList input:", form);

    const result = addItem(form);
    if (!result.added) {
      setError("Enter a title before adding it to your list.");
      return;
    }

    setError("");
    // Clear the form the moment the title is accepted, so the field
    // is ready for the next entry without any manual clearing.
    setForm((prev) => ({ ...EMPTY_FORM, genre: prev.genre, platform: prev.platform }));
    setToast(`"${result.entry.title}" added to your list.`);
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditDraft({ title: item.title, genre: item.genre, platform: item.platform });
    setPendingDeleteId(null);
  }

  function handleEditChange(event) {
    const { name, value } = event.target;
    setEditDraft((prev) => ({ ...prev, [name]: value }));
  }

  function saveEdit(id) {
    const title = editDraft.title.trim();
    if (!title) return;
    updateItem(id, { ...editDraft, title });
    setEditingId(null);
    setToast("Title updated.");
  }

  function handleToggleComplete(item) {
    toggleComplete(item.id);
    setToast(item.completed ? "Back to your watching list." : `Marked "${item.title}" as watched.`);
  }

  function confirmDelete(item) {
    removeItem(item.id);
    setPendingDeleteId(null);
    setToast(`"${item.title}" removed.`);
  }

  const visibleItems = items.filter((item) => {
    if (filter === "watching") return !item.completed;
    if (filter === "watched") return item.completed;
    return true;
  });

  const watchingCount = items.filter((item) => !item.completed).length;
  const watchedCount = items.length - watchingCount;

  return (
    <>
      <div className="page-header">
        <p className="page-eyebrow">EZTechMovie / Week 3</p>
        <h1 className="page-title">Your StreamList</h1>
        <p className="page-subtitle">
          Add a title, tell us the genre and where it streams, and it lands on your list below.
          Everything here is saved automatically, so refreshing the page won't lose your list.
        </p>
      </div>

      <form className="box-office" onSubmit={handleSubmit} noValidate>
        <p className="box-office-label">Add to your list</p>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. The Last Reel"
              value={form.title}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          <div className="field">
            <label htmlFor="genre">Genre</label>
            <select id="genre" name="genre" value={form.genre} onChange={handleChange}>
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="platform">Streaming on</label>
            <select id="platform" name="platform" value={form.platform} onChange={handleChange}>
              {PLATFORMS.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="form-actions">
          <span className="form-hint">
            Prefer browsing? Add titles straight from the <Link to="/movies">Movies</Link> page instead.
          </span>
          <button type="submit" className="btn btn-primary">
            <PiPlusCircleBold />
            Add title
          </button>
        </div>
      </form>

      <div className="list-meta">
        <h2>On your list</h2>
        <span className="count">
          {items.length} {items.length === 1 ? "title" : "titles"}
        </span>
      </div>

      <div className="filter-tabs">
        <PiFunnelBold className="filter-icon" />
        {FILTERS.map((f) => {
          const count = f.id === "all" ? items.length : f.id === "watching" ? watchingCount : watchedCount;
          return (
            <button
              key={f.id}
              type="button"
              className={"filter-tab" + (filter === f.id ? " active" : "")}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
              <span className="filter-count">{count}</span>
            </button>
          );
        })}
      </div>

      {visibleItems.length === 0 ? (
        <div className="empty-state">
          <PiSparkleFill style={{ margin: "0 auto 12px" }} size={30} />
          <p>
            {items.length === 0
              ? "Nothing here yet — add a title above and it'll show up as a ticket."
              : "Nothing matches this filter yet."}
          </p>
        </div>
      ) : (
        <div className="ticket-grid">
          {visibleItems.map((item) => (
            <TicketCard
              key={item.id}
              item={item}
              isEditing={editingId === item.id}
              editDraft={editDraft}
              onEditChange={handleEditChange}
              onStartEdit={() => startEdit(item)}
              onSaveEdit={() => saveEdit(item.id)}
              onCancelEdit={() => setEditingId(null)}
              onToggleComplete={() => handleToggleComplete(item)}
              isConfirmingDelete={pendingDeleteId === item.id}
              onRequestDelete={() => {
                setPendingDeleteId(item.id);
                setEditingId(null);
              }}
              onConfirmDelete={() => confirmDelete(item)}
              onCancelDelete={() => setPendingDeleteId(null)}
            />
          ))}
        </div>
      )}

      {toast && (
        <div className="toast" role="status">
          <PiSparkleFill />
          {toast}
        </div>
      )}
    </>
  );
}

export default StreamListPage;
