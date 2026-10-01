import { useEffect, useState } from "react";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const formatCurrency = (amount) => {
  if (!amount) return "N/A";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatList = (items, property = "name") =>
  items?.length ? items.map((item) => item[property]).join("  ·  ") : "N/A";

const getTrailer = (videos = []) =>
  videos.find((video) => video.site === "YouTube" && video.type === "Trailer" && video.key);

const MovieDetailsModal = ({ movie, onClose }) => {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    const loadMovieDetails = async () => {
      if (!API_KEY) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/movie/${movie.id}?append_to_response=videos`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        });

        if (response.ok) setDetails(await response.json());
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    loadMovieDetails();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [movie.id, onClose]);

  const movieDetails = details || movie;
  const releaseYear = movieDetails.release_date ? movieDetails.release_date.split("-")[0] : "N/A";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const trailer = getTrailer(movieDetails.videos?.results);

  return (
    <div className="movie-modal-backdrop" onClick={onClose}>
      <section
        className="movie-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="movie-modal-close" onClick={onClose} aria-label="Close movie details">
          X
        </button>

        <div className="movie-modal-poster">
          <img
            src={movie.poster_path ? `${IMAGE_BASE_URL}/${movie.poster_path}` : "/no-movie.png"}
            alt={`${movie.title} poster`}
          />
        </div>

        <div className="movie-modal-content">
          <p className="movie-modal-kicker">Movie details</p>
          <h2 id="movie-modal-title">{movie.title}</h2>
          <div className="movie-modal-meta" aria-label="Movie facts">
            <span>{releaseYear}</span>
            <span>{movie.original_language || "N/A"}</span>
            <span>{rating} / 10</span>
          </div>
          {trailer && (
            <a
              className="movie-modal-trailer"
              href={`https://www.youtube.com/watch?v=${trailer.key}`}
              target="_blank"
              rel="noreferrer"
            >
              <span aria-hidden="true">▶</span>
              Watch trailer
            </a>
          )}
          {isLoading ? (
            <p className="movie-modal-loading">Loading full movie details...</p>
          ) : (
            <div className="movie-modal-information">
              <div className="movie-modal-row movie-modal-overview-row">
                <dt>Overview</dt>
                <dd>{movieDetails.overview || "No synopsis available for this movie."}</dd>
              </div>
              <div className="movie-modal-row">
                <dt>Genres</dt>
                <dd>{formatList(movieDetails.genres)}</dd>
              </div>
              <div className="movie-modal-row">
                <dt>Release date</dt>
                <dd>{movieDetails.release_date || "N/A"}</dd>
              </div>
              <div className="movie-modal-row">
                <dt>Countries</dt>
                <dd>{formatList(movieDetails.production_countries)}</dd>
              </div>
              <div className="movie-modal-row">
                <dt>Status</dt>
                <dd>{movieDetails.status || "N/A"}</dd>
              </div>
              <div className="movie-modal-row">
                <dt>Languages</dt>
                <dd>{formatList(movieDetails.spoken_languages, "english_name")}</dd>
              </div>
              <div className="movie-modal-row">
                <dt>Budget</dt>
                <dd>{formatCurrency(movieDetails.budget)}</dd>
              </div>
              <div className="movie-modal-row">
                <dt>Revenue</dt>
                <dd>{formatCurrency(movieDetails.revenue)}</dd>
              </div>
              <div className="movie-modal-row">
                <dt>Tagline</dt>
                <dd>{movieDetails.tagline || "N/A"}</dd>
              </div>
              <div className="movie-modal-row">
                <dt>Production companies</dt>
                <dd>{formatList(movieDetails.production_companies)}</dd>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MovieDetailsModal;
