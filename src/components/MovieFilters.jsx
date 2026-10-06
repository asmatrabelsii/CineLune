const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 14, name: "Fantasy" },
  { id: 27, name: "Horror" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science fiction" },
  { id: 53, name: "Thriller" },
];

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "IN", name: "India" },
];

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "hi", name: "Hindi" },
];

const SORT_OPTIONS = [
  { value: "popularity.desc", name: "Most popular" },
  { value: "vote_average.desc", name: "Highest rated" },
  { value: "primary_release_date.desc", name: "Newest releases" },
  { value: "primary_release_date.asc", name: "Oldest releases" },
  { value: "title.asc", name: "Title A-Z" },
];

const RELEASE_YEARS = Array.from({ length: 47 }, (_, index) => new Date().getFullYear() - index);

const MovieFilters = ({ filters, onChange, onClear }) => {
  const hasFilters = Object.values(filters).some(Boolean);

  const updateFilter = (name) => (event) => onChange(name, event.target.value);

  return (
    <div className="movie-filters" aria-label="Filter movies">
      <label>
        <span>Genre</span>
        <select value={filters.genre} onChange={updateFilter("genre")}>
          <option value="">All genres</option>
          {GENRES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Country</span>
        <select value={filters.country} onChange={updateFilter("country")}>
          <option value="">All countries</option>
          {COUNTRIES.map((item) => (
            <option key={item.code} value={item.code}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Year</span>
        <select value={filters.year} onChange={updateFilter("year")}>
          <option value="">Any year</option>
          {RELEASE_YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Rating</span>
        <select value={filters.rating} onChange={updateFilter("rating")}>
          <option value="">Any rating</option>
          {[5, 6, 7, 8].map((rating) => (
            <option key={rating} value={rating}>
              {rating}+ stars
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Language</span>
        <select value={filters.language} onChange={updateFilter("language")}>
          <option value="">Any language</option>
          {LANGUAGES.map((item) => (
            <option key={item.code} value={item.code}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Sort by</span>
        <select value={filters.sort} onChange={updateFilter("sort")}>
          {SORT_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      {hasFilters && (
        <button type="button" className="clear-filters" onClick={onClear}>
          Clear filters
        </button>
      )}
    </div>
  );
};

export default MovieFilters;