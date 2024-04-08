import React from 'react';

interface Props {
  onSearch: (query: string) => void;
}

export const SearchInput: React.FC<Props> = ({ onSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search cities..."
      onChange={(e) => onSearch(e.target.value)}
      className="p-2 border rounded shadow"
    />
  );
};

