import React from "react";

const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className="search">
        <div>
            <img src="search.svg" alt="Search" />

            <input
                type="text"
                placeholder="Search through thousands of movies"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm && (
              <button
                className="search-clear"
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchTerm("")}
              >
                X
              </button>
            )}
        </div>
    </div>
  );
};

export default Search;
