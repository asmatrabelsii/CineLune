import { useState } from "react";

const MOOD_GENRES = {
  action: [28, 12],
  adventure: [12, 14],
  comedy: [35],
  dramatic: [18],
  drama: [18],
  family: [10751, 16],
  fantasy: [14],
  horror: [27],
  romance: [10749],
  romantic: [10749],
  "sci-fi": [878],
  "science fiction": [878],
  thriller: [53, 9648],
};

const QUICK_PROMPTS = ["Something funny", "A good thriller", "A movie for tonight"];

const getRecommendationScore = (movie, terms, genreIds) => {
  const searchableText = `${movie.title || ""} ${movie.overview || ""}`.toLowerCase();
  const matchingTerms = terms.reduce(
    (score, term) => score + (searchableText.includes(term) ? 2 : 0),
    0,
  );
  const matchingGenres = (movie.genre_ids || []).filter((id) => genreIds.includes(id)).length;

  return matchingTerms + matchingGenres * 4 + (movie.vote_average || 0) / 10;
};

const RecommendationChat = ({ movies }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "Tell me what kind of night you are having and I will find a movie for it.",
    },
  ]);

  const recommendMovies = (prompt) => {
    const normalizedPrompt = prompt.toLowerCase();
    const terms = normalizedPrompt.split(/[^a-z0-9]+/).filter((term) => term.length > 2);
    const genreIds = Object.entries(MOOD_GENRES)
      .filter(([mood]) => normalizedPrompt.includes(mood))
      .flatMap(([, ids]) => ids);
    const rankedMovies = [...movies]
      .map((movie) => ({
        movie,
        score: getRecommendationScore(movie, terms, genreIds),
      }))
      .sort((first, second) => second.score - first.score)
      .slice(0, 3)
      .map(({ movie }) => movie);

    return rankedMovies;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const prompt = input.trim();

    if (!prompt) return;

    const recommendations = recommendMovies(prompt);
    const response = recommendations.length
      ? "Here are a few picks from the movies currently loaded for you."
      : "I do not have enough movies loaded for that yet. Try browsing the catalog or asking for a mood like comedy, horror, or sci-fi.";

    setMessages((currentMessages) => [
      ...currentMessages,
      { id: Date.now(), role: "user", text: prompt },
      { id: Date.now() + 1, role: "assistant", text: response, movies: recommendations },
    ]);
    setInput("");
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
  };

  return (
    <div className="recommendation-chat">
      {isOpen && (
        <section className="chat-panel" aria-label="Movie recommendation assistant">
          <header className="chat-header">
            <div>
              <p className="chat-kicker">CineLune assistant</p>
              <h2>Find your next watch</h2>
            </div>
            <button type="button" className="chat-close" onClick={() => setIsOpen(false)} aria-label="Close chat">
              X
            </button>
          </header>

          <div className="chat-messages" aria-live="polite">
            {messages.map((message) => (
              <div className={`chat-message ${message.role}`} key={message.id}>
                <p>{message.text}</p>
                {message.movies?.length > 0 && (
                  <ul className="chat-recommendations">
                    {message.movies.map((movie) => (
                      <li key={movie.id}>
                        <img
                          src={movie.poster_path ? `https://image.tmdb.org/t/p/w92/${movie.poster_path}` : "/no-movie.png"}
                          alt=""
                        />
                        <span>{movie.title}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="chat-prompts">
            {QUICK_PROMPTS.map((prompt) => (
              <button type="button" key={prompt} onClick={() => handleQuickPrompt(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <form className="chat-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask for a movie mood..."
              aria-label="Ask for a movie recommendation"
            />
            <button type="submit" aria-label="Send recommendation request">Send</button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="chat-launcher"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close movie recommendations" : "Open movie recommendations"}
      >
        <span aria-hidden="true">✦</span>
        <span>Recommend a movie</span>
      </button>
    </div>
  );
};

export default RecommendationChat;
