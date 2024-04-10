"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { CityDetails } from '@/types';
import { CityRow } from '../CityRow';
import { SearchInput } from '../SearchInput';
import { fetchCities } from '@/api';
import { sortCities } from '@/utils/sortCities';
import { v4 as uuidv4 } from 'uuid';

const debounce = (func: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export const CityTable: React.FC = () => {
  const [allCities, setAllCities] = useState<CityDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof CityDetails | null>(null);
  const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('ascending');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [start, setStart] = useState(0);
  const [nameFilter, setNameFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [timezoneFilter, setTimezoneFilter] = useState('');
  const tableRef = useRef<HTMLTableElement>(null);
  const observer = useRef<IntersectionObserver>();

  const loadCities = async () => {
    setLoading(true);
    const newCities = await fetchCities(searchTerm, start);
    if (start === 0) {
      setAllCities(newCities);
    } else {
      setAllCities(prev => [...prev, ...newCities]);
    }
    setLoading(false);
    if (newCities.length < 20) setHasMore(false);
  };



  const debouncedLoadCities = useMemo(() => debounce(loadCities, 500), []);

  useEffect(() => {
    debouncedLoadCities();
  }, [debouncedLoadCities]);

  const handleScroll = useCallback(() => {
    const { scrollTop, clientHeight, scrollHeight } = tableRef.current!;
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading && hasMore) {
      setStart(prevStart => prevStart + 20);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    if (!hasMore) return;
    const table = tableRef.current;
    table?.addEventListener('scroll', handleScroll);
    return () => {
      table?.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore, handleScroll]);

  const filteredCities = useMemo(() => {
    let filtered = [...allCities];
    if (nameFilter) {
      filtered = filtered.filter(city => city.name.toLowerCase().includes(nameFilter.toLowerCase()));
    }
    if (countryFilter) {
      filtered = filtered.filter(city => city.cou_name_en.toLowerCase().includes(countryFilter.toLowerCase()));
    }
    if (timezoneFilter) {
      filtered = filtered.filter(city => city.timezone.toLowerCase().includes(timezoneFilter.toLowerCase()));
    }
    return filtered;
  }, [allCities, nameFilter, countryFilter, timezoneFilter]);

  const transformedCities = useMemo(() => {
    if (sortColumn) {
      return sortCities(filteredCities, sortColumn, sortDirection).map(cityDetail => ({
        id: uuidv4(),
        name: cityDetail.name,
        country: cityDetail.cou_name_en,
        timezone: cityDetail.timezone,
      }));
    } else {
      return filteredCities.map(cityDetail => ({
        id: uuidv4(),
        name: cityDetail.name,
        country: cityDetail.cou_name_en,
        timezone: cityDetail.timezone,
      }));
    }
  }, [filteredCities, sortColumn, sortDirection]);

  const handleSortChange = (column: keyof CityDetails) => {
    if (sortColumn === column) {
      setSortDirection(prevDirection => prevDirection === 'ascending' ? 'descending' : 'ascending');
    } else {
      setSortColumn(column);
      setSortDirection('ascending');
    }
  };

  const getSortIndicator = (column: keyof CityDetails) => {
    if (sortColumn === column) {
      return sortDirection === 'ascending' ? ' 🔼' : ' 🔽';
    }
    return ' ⇅'; 
  };

  const lastCityElementRef = useCallback((node: HTMLElement | null) => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setStart(prevStart => prevStart + 20);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  return (
    <div className="container mx-auto p-1">
      <SearchInput onSearch={(query: string) => {
        setSearchTerm(query);
        setStart(0);
        setAllCities([]);
        setHasMore(true);
      }} />
      <div className="overflow-x-auto">
        <table ref={tableRef} className="min-w-full divide-y divide-gray-200 mt-4 sm:table-fixed">
          <thead className="bg-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th className="p-2 cursor-pointer relative" onClick={() => handleSortChange('name')}>
                <div className="flex flex-col">
                  <span className="mb-1">City Name{getSortIndicator('name')}</span>
                  <input 
                    type="text"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    placeholder="Filter"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm font-normalfocus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </th>
              <th className="p-2 cursor-pointer relative" onClick={() => handleSortChange('cou_name_en')}>
                <div className="flex flex-col">
                  <span className="mb-1">Country{getSortIndicator('cou_name_en')}</span>
                  <input 
                    type="text"
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    placeholder="Filter"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm font-normal focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </th>
              <th className="p-2 cursor-pointer relative" onClick={() => handleSortChange('timezone')}>
                <div className="flex flex-col">
                  <span className="mb-1">Timezone{getSortIndicator('timezone')}</span>
                  <input 
                    type="text"
                    value={timezoneFilter}
                    onChange={(e) => setTimezoneFilter(e.target.value)}
                    placeholder="Filter"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm font-normal focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transformedCities.map((city, index) => (
              <CityRow 
                ref={index + 1 === transformedCities.length ? lastCityElementRef : null} 
                key={city.id}
                city={city}
              />
            ))}
          </tbody>
        </table>
      </div>
      {loading && <p>Loading more cities...</p>}
    </div>
  );
};
