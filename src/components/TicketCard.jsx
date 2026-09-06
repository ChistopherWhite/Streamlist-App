import {
  PiPencilSimpleBold,
  PiTrashBold,
  PiCheckCircleFill,
  PiCircleBold,
  PiCheckBold,
  PiXBold,
  PiTicketBold,
} from "react-icons/pi";
import { GENRES, PLATFORMS } from "../lib/constants";

/*
  Renders a single StreamList entry as a ticket, in either its normal
  state or an inline edit form. Extracted out of StreamListPage so the
  same ticket presentation could later be reused anywhere else a list
  item needs to be shown (e.g. a future Cart page) without copying markup.
*/
function TicketCard({
  item,
  isEditing,
  editDraft,
  onEditChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onToggleComplete,
  isConfirmingDelete,
  onRequestDelete,
  onConfirmDelete,
  onCancelDelete,
}) {
  return (
    <article className={"ticket" + (item.completed ? " completed" : "")}>
      <div className="ticket-body">
        {isEditing ? (
          <form
            className="ticket-edit-form"
            onSubmit={(event) => {
              event.preventDefault();
              onSaveEdit();
            }}
          >
            <label className="sr-only" htmlFor={`edit-title-${item.id}`}>
              Title
            </label>
            <input
              id={`edit-title-${item.id}`}
              className="ticket-edit-input"
              name="title"
              value={editDraft.title}
              onChange={onEditChange}
              autoFocus
            />
            <div className="ticket-edit-row">
              <label className="sr-only" htmlFor={`edit-genre-${item.id}`}>
                Genre
              </label>
              <select id={`edit-genre-${item.id}`} name="genre" value={editDraft.genre} onChange={onEditChange}>
                {GENRES.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
              <label className="sr-only" htmlFor={`edit-platform-${item.id}`}>
                Streaming on
              </label>
              <select id={`edit-platform-${item.id}`} name="platform" value={editDraft.platform} onChange={onEditChange}>
                {PLATFORMS.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </div>
            <div className="ticket-edit-actions">
              <button type="submit" className="btn btn-primary btn-sm">
                <PiCheckBold /> Save
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={onCancelEdit}>
                <PiXBold /> Cancel
              </button>
            </div>
          </form>
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
                {new Date(item.addedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            <div className="ticket-actions">
              <button
                type="button"
                className="icon-btn"
                onClick={onToggleComplete}
                aria-label={item.completed ? `Mark ${item.title} as still watching` : `Mark ${item.title} as watched`}
                title={item.completed ? "Mark as watching" : "Mark as watched"}
              >
                {item.completed ? <PiCheckCircleFill /> : <PiCircleBold />}
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={onStartEdit}
                aria-label={`Edit ${item.title}`}
                title="Edit"
              >
                <PiPencilSimpleBold />
              </button>

              {isConfirmingDelete ? (
                <span className="confirm-row">
                  <span className="confirm-label">Remove?</span>
                  <button type="button" className="icon-btn danger" onClick={onConfirmDelete} aria-label="Confirm remove" title="Confirm">
                    <PiCheckBold />
                  </button>
                  <button type="button" className="icon-btn" onClick={onCancelDelete} aria-label="Cancel remove" title="Cancel">
                    <PiXBold />
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  className="icon-btn"
                  onClick={onRequestDelete}
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
}

export default TicketCard;
