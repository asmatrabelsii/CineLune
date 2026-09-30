import { useState, useEffect } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import RecommendationChat from "./components/RecommendationChat";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "", page = 1) => {
    setisLoading(true);
    setErrorMessage("");

    try {
      if (!API_KEY) {
        throw new Error("Missing VITE_TMDB_API_KEY environment variable");
      }

      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error(`TMDB request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data.response === "False") {
        setErrorMessage(data.error || "Failed to fetch movies.");
        setMovieList([]);
        return;
      }

      const results = data.results || [];

      setMovieList(results);
      setTotalPages(Math.min(data.total_pages || 1, 500));

      if (query && results.length > 0) {
        await updateSearchCount(query, results[0]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage(
        error.message.includes("VITE_TMDB_API_KEY")
          ? "Movie search is not configured. Add VITE_TMDB_API_KEY to the Vercel environment variables and redeploy."
          : "Failed to fetch movies. Please try again later."
      );
    } finally {
      setisLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  };

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  useEffect(() => {
    fetchMovies(debouncedSearchTerm, currentPage);
  }, [debouncedSearchTerm, currentPage]);

  const handleSearchTermChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: document.querySelector(".all-movies")?.offsetTop || 0, behavior: "smooth" });
  };

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header className="hero-header">
          <div className="topbar">
            <img className="logo" src="/logo.png" alt="CineLune logo" />
            <span className="live-status"><i /> Curated for tonight</span>
          </div>

          <div className="hero-copy">
            <div className="hero-art" aria-hidden="true">
              <div className="hero-art-glow" />
              <img src="/hero.jpg" alt="" />
              <span className="hero-stamp">ROLL<br />CREDITS</span>
              <span className="hero-caption">A world of stories<br />in every frame</span>
            </div>

            <div className="hero-message">
              <p className="eyebrow">Your next favorite movie is waiting</p>
              <h1>
                Find <span className="text-gradient">movies</span><br />
                worth staying up for.
              </h1>
              <p className="hero-description">From midnight classics to fresh releases, discover something that feels made for you.</p>
              <Search searchTerm={searchTerm} setSearchTerm={handleSearchTermChange} />
              <div className="hero-meta">
                <span><b>01</b> Browse by mood</span>
                <span><b>02</b> Find your story</span>
              </div>
            </div>
          </div>
        </header>

        {trendingMovies.length > 0 && !searchTerm.trim() && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}

          {!isLoading && !errorMessage && totalPages > 1 && (
            <nav className="pagination" aria-label="Movie pages">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span aria-live="polite">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </span>
              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </nav>
          )}
        </section>
      </div>

      <RecommendationChat movies={movieList} />
    </main>
  );
};

export default App;
