import { City } from "@/types";
import React from 'react';

interface TableHeaderProps {
  label: keyof City;
  value: string;
  sortColumn: keyof City | null;
  sortDirection: 'ascending' | 'descending';
  onFilterChange: (value: string) => void;
  onSortChange: () => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  label,
  value,
  sortColumn,
  sortDirection,
  onFilterChange,
  onSortChange
}) => {
  const sortIndicator = sortColumn === label
    ? sortDirection === 'ascending' ? ' 🔼' : ' 🔽'
    : ' ⇅'; 

  return (
    <th className="p-2 cursor-pointer relative" onClick={onSortChange}>
      <div className="flex flex-col">
        <span className="mb-1">
          {label}{sortIndicator}
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onFilterChange(e.target.value)}
          placeholder={`Filter by ${label}`}
          className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm font-normal focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </th>
  );
};
