export const GENRES = [
  "Action",
  "Comedy",
  "Drama",
  "Sci-Fi",
  "Horror",
  "Documentary",
  "Animation",
  "Thriller",
];

export const PLATFORMS = [
  "EZTechMovie Original",
  "Netflix",
  "Prime Video",
  "Disney+",
  "Hulu",
  "Max",
  "TMDB",
];

export const FILTERS = [
  { id: "all", label: "All" },
  { id: "watching", label: "Watching" },
  { id: "watched", label: "Watched" },
];

// TMDB's movie genre ids are stable, publicly documented values
// (https://developer.themoviedb.org/reference/genre-movie-list). Mapping
// them here means a TMDB search result can be tagged with the same kind
// of genre label used for manually added titles.
export const TMDB_GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export function primaryGenreLabel(genreIds) {
  if (!genreIds || genreIds.length === 0) return "Unrated";
  return TMDB_GENRE_MAP[genreIds[0]] ?? "Other";
}
