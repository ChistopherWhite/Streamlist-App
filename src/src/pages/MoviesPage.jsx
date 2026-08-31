import { useCallback, useEffect, useRef, useState } from "react";
import {
  PiMagnifyingGlassBold,
  PiPlusCircleBold,
  PiCheckCircleFill,
  PiWarningBold,
  PiFilmSlateBold,
  PiSparkleFill,
} from "react-icons/pi";
import { useStreamListItems } from "../hooks/useStreamListItems";
import { hasTmdbApiKey, searchMovies, getPosterUrl } from "../lib/tmdb";
import { primaryGenreLabel } from "../lib/constants";

/*
  Movies page — the TMDB-powered search screen. Results come straight
  from The Movie Database's /search/movie endpoint (themoviedb.org) and
  each card can add itself to the same StreamList the home page reads
  from, via the shared useStreamListItems hook.
*/
function MoviesPage() {
  const { addItem, hasTmdbId } = useStreamListItems();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("idle"); // idle | loading | error | done
  const [errorMessage, setErrorMessage] = useState("");
  const [toast, setToast] = useState(null);

  const debounceRef = useRef(null);
  const requestRef = useRef(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  // Search-as-you-type, debounced so we're not firing a request on
  // every keystroke — a short pause after typing stops is what
  // actually triggers the lookup.
  // Wrapped in useCallback so the effect below can safely list it as a
  // dependency instead of suppressing the exhaustive-deps lint rule —
  // the original version referenced this function from inside the
  // effect without either memoizing it or declaring it as a dependency.
  const runSearch = useCallback(async (searchTerm, pageNumber) => {
    if (requestRef.current) requestRef.current.abort();
    const controller = new AbortController();
    requestRef.current = controller;

    setStatus("loading");
    setErrorMessage("");

    try {
      const data = await searchMovies(searchTerm, pageNumber, { signal: controller.signal });
      setResults((prev) => (pageNumber === 1 ? data.results : [...prev, ...data.results]));
      setPage(data.page);
      setTotalPages(data.totalPages);
      setStatus("done");
    } catch (error) {
      if (error.name === "AbortError") return;
      setStatus("error");
      setErrorMessage(error.message || "Something went wrong searching TMDB.");
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      // AI review flagged this as a race condition: if a request from
      // a longer query is still in flight when the user deletes back
      // down below 2 characters, that request used to be left running.
      // It could resolve after we've already cleared the results here,
      // silently repopulating the grid with stale data. Aborting it
      // explicitly closes that window.
      if (requestRef.current) requestRef.current.abort();
      setResults([]);
      setStatus("idle");
      return;
    }

    debounceRef.current = setTimeout(() => {
      runSearch(trimmed, 1);
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query, runSearch]);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    runSearch(trimmed, 1);
  }

  function handleLoadMore() {
    runSearch(query.trim(), page + 1);
  }

  function handleAdd(movie) {
    const year = movie.release_date ? movie.release_date.slice(0, 4) : "";
    const result = addItem({
      title: year ? `${movie.title} (${year})` : movie.title,
      genre: primaryGenreLabel(movie.genre_ids),
      platform: "TMDB",
      tmdbId: movie.id,
      posterPath: movie.poster_path,
    });

    if (result.added) {
      setToast(`"${movie.title}" added to your list.`);
    } else if (result.reason === "duplicate") {
      setToast(`"${movie.title}" is already on your list.`);
    }
  }

  return (
    <>
      <div className="page-header">
        <p className="page-eyebrow">EZTechMovie / Week 3</p>
        <h1 className="page-title">Browse Movies</h1>
        <p className="page-subtitle">
          Search The Movie Database and add anything you find straight to your StreamList — no
          retyping titles by hand.
        </p>
      </div>

      {!hasTmdbApiKey() ? (
        <div className="api-key-warning">
          <PiWarningBold size={22} />
          <div>
            <p className="api-key-warning-title">TMDB API key not configured</p>
            <p>
              This page needs a free TMDB API key to search. Create a <code>.env</code> file in
              the project root (see <code>.env.example</code>) with:
            </p>
            <pre className="api-key-code">VITE_TMDB_API_KEY=your_key_here</pre>
            <p>
              Get a key at{" "}
              <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer">
                themoviedb.org/settings/api
              </a>{" "}
              (free account required), then restart <code>npm run dev</code>.
            </p>
          </div>
        </div>
      ) : (
        <>
          <form className="box-office" onSubmit={handleSubmit} noValidate>
            <p className="box-office-label">Search TMDB</p>
            <div className="search-row">
              <div className="field" style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="Search for a movie…"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  autoComplete="off"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                <PiMagnifyingGlassBold />
                Search
              </button>
            </div>
            <p className="form-hint" style={{ marginTop: 8 }}>
              Results update automatically as you type (2+ characters).
            </p>
          </form>

          {status === "loading" && results.length === 0 && (
            <div className="empty-state">
              <div className="spinner" />
              <p>Searching TMDB…</p>
            </div>
          )}

          {status === "error" && (
            <div className="empty-state">
              <PiWarningBold size={30} style={{ margin: "0 auto 12px" }} />
              <p>{errorMessage}</p>
            </div>
          )}

          {status === "idle" && results.length === 0 && (
            <div className="empty-state">
              <PiFilmSlateBold size={30} style={{ margin: "0 auto 12px" }} />
              <p>Start typing above to search thousands of titles on TMDB.</p>
            </div>
          )}

          {status === "done" && results.length === 0 && (
            <div className="empty-state">
              <PiSparkleFill size={30} style={{ margin: "0 auto 12px" }} />
              <p>No results for "{query}". Try a different title.</p>
            </div>
          )}

          {results.length > 0 && (
            <>
              <div className="movie-grid">
                {results.map((movie) => {
                  const alreadyAdded = hasTmdbId(movie.id);
                  const posterUrl = getPosterUrl(movie.poster_path);
                  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";

                  return (
                    <article className="movie-card" key={movie.id}>
                      <div className="movie-poster">
                        {posterUrl ? (
                          <img src={posterUrl} alt={`${movie.title} poster`} loading="lazy" />
                        ) : (
                          <div className="movie-poster-fallback">
                            <PiFilmSlateBold size={28} />
                          </div>
                        )}
                      </div>
                      <div className="movie-info">
                        <div className="movie-top-row">
                          <span className="movie-year">{year}</span>
                          <span className="genre-tag-dark">{primaryGenreLabel(movie.genre_ids)}</span>
                        </div>
                        <h3 className="movie-title">{movie.title}</h3>
                        {movie.vote_average > 0 && (
                          <span className="movie-rating">★ {movie.vote_average.toFixed(1)}</span>
                        )}
                        <p className="movie-overview">
                          {movie.overview ? movie.overview.slice(0, 140) + (movie.overview.length > 140 ? "…" : "") : "No synopsis available."}
                        </p>
                        <button
                          type="button"
                          className={"btn btn-sm" + (alreadyAdded ? " btn-ghost" : " btn-primary")}
                          onClick={() => handleAdd(movie)}
                          disabled={alreadyAdded}
                        >
                          {alreadyAdded ? (
                            <>
                              <PiCheckCircleFill /> On your list
                            </>
                          ) : (
                            <>
                              <PiPlusCircleBold /> Add to StreamList
                            </>
                          )}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              {page < totalPages && (
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <button type="button" className="btn btn-ghost" onClick={handleLoadMore} disabled={status === "loading"}>
                    {status === "loading" ? "Loading…" : "Load more results"}
                  </button>
                </div>
              )}
            </>
          )}
        </>
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

export default MoviesPage;
