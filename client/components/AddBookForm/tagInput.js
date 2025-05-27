"use client";

import { useState } from "react";

export default function TagInput() {
  const [inputValue, setInputValue] = useState("");
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const trimmed = inputValue.trim();
      if (!trimmed) return;

      if (genres.length >= 5) {
        setError("You can only add up to 5 genres.");
        return;
      }

      if (!genres.map((g) => g.toLowerCase()).includes(trimmed.toLowerCase())) {
        setGenres([...genres, trimmed]);
        setInputValue("");
        setError("");
      }
    }
  };

  const removeGenre = (index) => {
    const updated = [...genres];
    updated.splice(index, 1);
    setGenres(updated);
    setError(""); // clear error if any
  };

  return (
    <div>
      <label className="block text-sm/6 font-medium" htmlFor="genres">
        Genres
      </label>
      <div className="flex flex-wrap rounded-md outline-1 -outline-offset-1 outline-gray-300 p-2 space-x-2">
        <div className="flex flex-wrap items-center gap-2">
          {genres.map((genre, index) => (
            <div
              key={index}
              className="flex items-center bg-light-green text-dark-green px-2 py-1 rounded-full text-sm"
            >
              <span>{genre}</span>
              <button
                type="button"
                onClick={() => removeGenre(index)}
                className="ml-2 text-dark-green hover:text-black"
                aria-label={`Remove ${genre}`}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <input
          type="text"
          id="genres"
          placeholder="Add a genre"
          className="flex-1 border-none outline-none focus:ring-0 text-sm/6 bg-transparent"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {/* Hidden input to submit as JSON if in form */}
      <input type="hidden" name="genres" value={JSON.stringify(genres)} />
    </div>
  );
}
