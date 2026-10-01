const MovieCard = ({ movie, onSelect }) => {
  const { title, vote_average, poster_path, release_date, original_language, overview } = movie;

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(movie);
    }
  };

  return (
    <div
      className="movie-card"
      onClick={() => onSelect(movie)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex="0"
      aria-label={`View details for ${title}`}
    >
      <div className="movie-card-poster">
        <img
          src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : "/no-movie.png" } alt={title}
        />
        <div className="movie-card-details">
          <p>{overview || "No synopsis available."}</p>
        </div>
      </div>
      <div className="mt-4">
        <h3>{title}</h3>
        <div className="content">
            <div className="rating">
                <img src="star.svg" alt="Star Icon"></img>
                <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
            </div>

            <span>•</span>
            <p className="lang">{original_language}</p>
            <span>•</span>
            <p className="year">{release_date ? release_date.split('-')[0] : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
