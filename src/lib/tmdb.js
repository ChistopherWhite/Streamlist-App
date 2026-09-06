const API_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

// Vite only exposes env vars prefixed with VITE_ to client code, and only
// ever reads them from a local .env file that is never committed (see
// .env.example). If the key is missing, the Movies page shows setup
// instructions instead of silently failing on every request.
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export function hasTmdbApiKey() {
  return Boolean(API_KEY);
}

export function getPosterUrl(posterPath, size = "w342") {
  if (!posterPath) return null;
  return `${IMAGE_BASE}/${size}${posterPath}`;
}

/*
  Searches TMDB for movies matching `query`. Returns the parsed results
  array plus paging info so the caller can offer a "Load more" action.
  Throws on network failure or a non-OK response so the caller can show
  a friendly error state instead of an empty screen.
*/
export async function searchMovies(query, page = 1, { signal } = {}) {
  if (!hasTmdbApiKey()) {
    throw new Error("Missing TMDB API key. Add VITE_TMDB_API_KEY to your .env file.");
  }

  const url = new URL(`${API_BASE}/search/movie`);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("query", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("include_adult", "false");

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`TMDB request failed (${response.status}).`);
  }

  const data = await response.json();
  return {
    results: data.results ?? [],
    page: data.page ?? 1,
    totalPages: data.total_pages ?? 1,
  };
}
