import React from 'react';

interface FilterInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const FilterInput: React.FC<FilterInputProps> = ({ value, onChange, placeholder }) => {
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value); 
    };
  return (
    <input
      type="text"
      value={value}
      onChange={e => handleChange}
      placeholder={placeholder}
      className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
    />
  );
};

