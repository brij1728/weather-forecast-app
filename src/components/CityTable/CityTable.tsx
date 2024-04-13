"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debounce, sortCities } from '@/utils';

import { City } from '@/types';
import { CityRow } from '../CityRow';
import { SearchInput } from '../SearchInput';
import { Spinner } from '../Spinner';
import { TableHeader } from '../TableHeader';
import { useCityData } from '@/hooks';

export const CityTable: React.FC = () => {
  const [sortColumn, setSortColumn] = useState<keyof City | null>(null);
  const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('ascending');
  const [nameFilter, setNameFilter] = useState<string>('');
  const [countryFilter, setCountryFilter] = useState<string>('');
  const [timezoneFilter, setTimezoneFilter] = useState<string>('');
  const tableRef = useRef<HTMLTableElement>(null);
  const observer = useRef<IntersectionObserver>();
  const [start, setStart] = useState<number>(0);
  const ROWS_PER_PAGE = 100;

  const { allCities, loading, hasMore, loadCities } = useCityData({ nameFilter, countryFilter, start, ROWS_PER_PAGE });

  const debouncedLoadCities = useMemo(
    () => debounce(loadCities, 500),
    [loadCities]
  );

  useEffect(() => {
    debouncedLoadCities();
  }, [debouncedLoadCities]);

  const handleScroll = useCallback(() => {
    const { scrollTop, clientHeight, scrollHeight } = tableRef.current!;
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading && hasMore) {
      setStart((prevStart) => prevStart + ROWS_PER_PAGE);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    if (!hasMore) return;
    const table = tableRef.current;
    table?.addEventListener("scroll", handleScroll);
    return () => {
      table?.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, handleScroll]);

  const transformedCities = useMemo(() => {
    if (sortColumn) {
      return sortCities(allCities, sortColumn, sortDirection);
    } else {
      return allCities;
    }
  }, [allCities, sortColumn, sortDirection]);

  const handleSortChange = (column: keyof City) => {
    const isFilterInputFocused = document.activeElement?.tagName === "INPUT";

    if (isFilterInputFocused) return;

    if (sortColumn === column) {
      setSortDirection((prevDirection) =>
        prevDirection === "ascending" ? "descending" : "ascending"
      );
    } else {
      setSortColumn(column);
      setSortDirection("ascending");
    }
  };

  const lastCityElementRef = useCallback((node: HTMLTableRowElement) => {
	if (loading) return;
	if (observer.current) observer.current.disconnect();
	observer.current = new IntersectionObserver(entries => {
	  if (entries[0].isIntersecting && hasMore) {
		setStart(prevStart => prevStart + ROWS_PER_PAGE);
	  }
	});
	if (node) observer.current.observe(node);
  }, [loading, hasMore, ROWS_PER_PAGE]);

  return (
    <div className="container mx-auto p-1">
      <SearchInput />
      <div className="overflow-x-auto">
        <table ref={tableRef} className="min-w-full divide-y divide-gray-200 mt-4">
          <thead className="bg-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
            <tr>
              <TableHeader
                label="name"
                value={nameFilter}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onFilterChange={setNameFilter}
                onSortChange={() => handleSortChange('name')}
              />
              <TableHeader
                label="country"
                value={countryFilter}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onFilterChange={setCountryFilter}
                onSortChange={() => handleSortChange('country')}
              />
              <TableHeader
                label="timezone"
                value={timezoneFilter}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onFilterChange={setTimezoneFilter}
                onSortChange={() => handleSortChange('timezone')}
              />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transformedCities.map((city, index) => (
              <CityRow key={city.id} city={city} ref={index + 1 === transformedCities.length ? lastCityElementRef : null} />
            ))}
          </tbody>
        </table>
      </div>
      {loading && <Spinner/>}
    </div>
  );
};
