import React, { useEffect, useState } from "react";

import { City } from "../../types";
import Link from "next/link";
import { fetchCities } from "../../api";

export const SearchInput: React.FC = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<City[]>([]);
  useEffect(() => {
    const loadSuggestions = async () => {
      if (query.length >= 2) {
        const fetchedSuggestions = await fetchCities({
          cityName: query,
        });
        setSuggestions(fetchedSuggestions);
      } else {
        setSuggestions([]);
      }
    };

    const timerId = setTimeout(loadSuggestions, 500); 
    return () => clearTimeout(timerId);
  }, [query]);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        placeholder="Search cities..."
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border rounded shadow"
      />
      {query.length >= 2 && suggestions.length > 0 && (
        <ul className="absolute z-10 list-none bg-white border rounded shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id} className="p-2 hover:bg-gray-100">
              <Link
                href={`/cityWeather/${suggestions[0].id}`}
                className="text-blue-500 hover:underline block"
              >
                {suggestion.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

