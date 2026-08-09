import { useState } from "react";
import { PlusIcon, TrashIcon, TicketIcon, SparkIcon } from "../components/Icons.jsx";

const GENRES = ["Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Documentary", "Animation", "Thriller"];
const PLATFORMS = ["EZTechMovie Original", "Netflix", "Prime Video", "Disney+", "Hulu", "Max"];

const EMPTY_FORM = { title: "", genre: GENRES[0], platform: PLATFORMS[0] };

/*
  Homepage of the app. Collects a title from the user, prints the raw
  input to the console (per the Week 1 brief), and renders every
  submitted title as a ticket in the list below. All state lives in
  this component for now — Weeks 2-3 will move it up into shared
  app state once Movies/Cart come online.
*/
function StreamListPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

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
      addedAt: new Date(),
    };

    setItems((prev) => [entry, ...prev]);
    console.log("StreamList — full list:", [entry, ...items]);

    setError("");
    setForm((prev) => ({ ...EMPTY_FORM, genre: prev.genre, platform: prev.platform }));
  }

  function handleRemove(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <>
      <div className="page-header">
        <p className="page-eyebrow">EZTechMovie / Week 1</p>
        <h1 className="page-title">Your StreamList</h1>
        <p className="page-subtitle">
          Add a title, tell us the genre and where it streams, and it lands on your list below —
          each one printed to the console the moment you add it.
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
            <PlusIcon />
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

      {items.length === 0 ? (
        <div className="empty-state">
          <SparkIcon style={{ margin: "0 auto 12px" }} />
          <p>Nothing here yet — add a title above and it'll show up as a ticket.</p>
        </div>
      ) : (
        <div className="ticket-grid">
          {items.map((item) => (
            <article className="ticket" key={item.id}>
              <div className="ticket-body">
                <div className="ticket-top-row">
                  <span>{item.platform}</span>
                  <span className="ticket-genre-tag">{item.genre}</span>
                </div>
                <h3 className="ticket-title">{item.title}</h3>
                <div className="ticket-sub">
                  <span>
                    Added{" "}
                    {item.addedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
              <div className="ticket-stub">
                <TicketIcon style={{ width: 18, height: 18, color: "#7a7258" }} />
                <span className="ticket-admit">Admit One</span>
                <button
                  type="button"
                  className="ticket-remove"
                  onClick={() => handleRemove(item.id)}
                  aria-label={`Remove ${item.title} from your list`}
                >
                  <TrashIcon />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

export default StreamListPage;
