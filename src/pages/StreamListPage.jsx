import { useEffect, useState } from "react";
import {
  PiPlusCircleBold,
  PiPencilSimpleBold,
  PiTrashBold,
  PiCheckCircleFill,
  PiCircleBold,
  PiCheckBold,
  PiXBold,
  PiTicketBold,
  PiSparkleFill,
  PiFunnelBold,
} from "react-icons/pi";

const GENRES = ["Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Documentary", "Animation", "Thriller"];
const PLATFORMS = ["EZTechMovie Original", "Netflix", "Prime Video", "Disney+", "Hulu", "Max"];

const EMPTY_FORM = { title: "", genre: GENRES[0], platform: PLATFORMS[0] };

const FILTERS = [
  { id: "all", label: "All" },
  { id: "watching", label: "Watching" },
  { id: "watched", label: "Watched" },
];

/*
  Homepage of the app. Collects a title from the user, prints the raw
  input to the console, and renders every submitted title as a ticket
  below. Several pieces of state work together so a title can be
  edited, marked watched, or removed without ever leaving the page:

    form            - the controlled add-title form
    items           - the master list of everything the user has added
    editingId       - id of the ticket currently in edit mode (or null)
    editDraft       - the in-progress values for whichever ticket is being edited
    pendingDeleteId - id of the ticket showing the "remove this?" confirm step
    filter          - which subset of items ("all" | "watching" | "watched") is shown
    toast           - a short-lived confirmation message shown after an action
*/
function StreamListPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState(EMPTY_FORM);

  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState(null);

  // Auto-dismiss the toast a couple seconds after it appears, so
  // confirmations don't pile up or require the user to clear them.
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

    const title = form.title.trim();

    // The assignment asks the StreamList component to take the
    // user's input and display it on the console.
    console.log("StreamList input:", { title, genre: form.genre, platform: form.platform });

    if (!title) {
      setError("Enter a title before adding it to your list.");
      return;
    }

    const entry = {
      id: crypto.randomUUID(),
      title,
      genre: form.genre,
      platform: form.platform,
      completed: false,
      addedAt: new Date(),
    };

    setItems((prev) => [entry, ...prev]);
    setError("");
    // Clear the form the moment the title is accepted, so the field
    // is ready for the next entry without any manual clearing.
    setForm((prev) => ({ ...EMPTY_FORM, genre: prev.genre, platform: prev.platform }));
    setToast(`"${title}" added to your list.`);
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

    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...editDraft, title } : item))
    );
    setEditingId(null);
    setToast("Title updated.");
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function toggleComplete(item) {
    setItems((prev) =>
      prev.map((entry) =>
        entry.id === item.id ? { ...entry, completed: !entry.completed } : entry
      )
    );
    setToast(item.completed ? `Back to your watching list.` : `Marked "${item.title}" as watched.`);
  }

  function requestDelete(id) {
    setPendingDeleteId(id);
    setEditingId(null);
  }

  function confirmDelete(item) {
    setItems((prev) => prev.filter((entry) => entry.id !== item.id));
    setPendingDeleteId(null);
    setToast(`"${item.title}" removed.`);
  }

  function cancelDelete() {
    setPendingDeleteId(null);
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
        <p className="page-eyebrow">EZTechMovie / Week 2</p>
        <h1 className="page-title">Your StreamList</h1>
        <p className="page-subtitle">
          Add a title, tell us the genre and where it streams, and it lands on your list below.
          Mark titles watched, edit details, or remove them right from the ticket.
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
          <span className="form-hint">Every submission is logged to the browser console.</span>
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
          {visibleItems.map((item) => {
            const isEditing = editingId === item.id;
            const isConfirmingDelete = pendingDeleteId === item.id;

            return (
              <article className={"ticket" + (item.completed ? " completed" : "")} key={item.id}>
                <div className="ticket-body">
                  {isEditing ? (
                    <div className="ticket-edit-form">
                      <input
                        className="ticket-edit-input"
                        name="title"
                        value={editDraft.title}
                        onChange={handleEditChange}
                        autoFocus
                      />
                      <div className="ticket-edit-row">
                        <select name="genre" value={editDraft.genre} onChange={handleEditChange}>
                          {GENRES.map((genre) => (
                            <option key={genre} value={genre}>
                              {genre}
                            </option>
                          ))}
                        </select>
                        <select name="platform" value={editDraft.platform} onChange={handleEditChange}>
                          {PLATFORMS.map((platform) => (
                            <option key={platform} value={platform}>
                              {platform}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="ticket-edit-actions">
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => saveEdit(item.id)}>
                          <PiCheckBold /> Save
                        </button>
                        <button type="button" className="btn btn-ghost btn-sm" onClick={cancelEdit}>
                          <PiXBold /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="ticket-top-row">
                        <span>{item.platform}</span>
                        <span className="ticket-genre-tag">{item.genre}</span>
                        {item.completed && <span className="ticket-watched-tag">Watched</span>}
                      </div>
                      <h3 className="ticket-title">{item.title}</h3>
                      <div className="ticket-sub">
                        <span>
                          Added{" "}
                          {item.addedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      <div className="ticket-actions">
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() => toggleComplete(item)}
                          aria-label={item.completed ? `Mark ${item.title} as still watching` : `Mark ${item.title} as watched`}
                          title={item.completed ? "Mark as watching" : "Mark as watched"}
                        >
                          {item.completed ? <PiCheckCircleFill /> : <PiCircleBold />}
                        </button>
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() => startEdit(item)}
                          aria-label={`Edit ${item.title}`}
                          title="Edit"
                        >
                          <PiPencilSimpleBold />
                        </button>

                        {isConfirmingDelete ? (
                          <span className="confirm-row">
                            <span className="confirm-label">Remove?</span>
                            <button type="button" className="icon-btn danger" onClick={() => confirmDelete(item)} aria-label="Confirm remove" title="Confirm">
                              <PiCheckBold />
                            </button>
                            <button type="button" className="icon-btn" onClick={cancelDelete} aria-label="Cancel remove" title="Cancel">
                              <PiXBold />
                            </button>
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="icon-btn"
                            onClick={() => requestDelete(item.id)}
                            aria-label={`Remove ${item.title} from your list`}
                            title="Remove"
                          >
                            <PiTrashBold />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div className="ticket-stub">
                  <PiTicketBold style={{ width: 18, height: 18, color: "#7a7258" }} />
                  <span className="ticket-admit">{item.completed ? "Watched" : "Admit One"}</span>
                </div>
              </article>
            );
          })}
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
