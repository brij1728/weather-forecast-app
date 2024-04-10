"use client";

import React, { useEffect, useState } from 'react';

import { fetchCities } from '../../api';

interface Props {
  onSearch: (query: string) => void;
}

export const SearchInput: React.FC<Props> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const loadSuggestions = async () => {
      if (query.length >= 2) {
        const fetchedSuggestions = await fetchCities(query);
        const suggestionNames = fetchedSuggestions
          .map(city => city.name)
          .filter(name => name.toLowerCase().includes(query.toLowerCase()));
        setSuggestions(suggestionNames);
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
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSearch(suggestion);
                setQuery('');
                setSuggestions([]);
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
