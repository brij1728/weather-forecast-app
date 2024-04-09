"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { CityDetails } from '@/types';
import {CityRow} from '../CityRow';
import {SearchInput} from '../SearchInput';
import { fetchCities } from '@/api';
import { v4 as uuidv4 } from 'uuid';

export const CityTable: React.FC = () => {
  const [allCities, setAllCities] = useState<CityDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('name'); // default sort column
  const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('ascending');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [start, setStart] = useState(0);

  const observer = useRef<IntersectionObserver>();
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

  useEffect(() => {
    setLoading(true);
    const loadCities = async () => {
      const newCities = await fetchCities(searchTerm, start);
      setAllCities(prev => start === 0 ? newCities : [...prev, ...newCities]);
      setLoading(false);
      if (newCities.length < 20) setHasMore(false);
    };

    loadCities();
  }, [searchTerm, start]);

  const transformedCities = useMemo(() => {
    return allCities
      .sort((a, b) => {
        if (!sortColumn) return 0;
        const valueA = a[sortColumn as keyof CityDetails];
        const valueB = b[sortColumn as keyof CityDetails];
        if (valueA < valueB) return sortDirection === 'ascending' ? -1 : 1;
        if (valueA > valueB) return sortDirection === 'ascending' ? 1 : -1;
        return 0;
      })
      .map(cityDetail => ({
        id: uuidv4(),
        name: cityDetail.name,
        country: cityDetail.cou_name_en,
        timezone: cityDetail.timezone,
      }));
  }, [allCities, sortColumn, sortDirection]);

  const handleSortChange = (column: keyof CityDetails) => {
    if (sortColumn === column) {
      setSortDirection(prevDirection => prevDirection === 'ascending' ? 'descending' : 'ascending');
    } else {
      setSortColumn(column);
      setSortDirection('ascending');
    }
  };

  const getSortIndicator = (column: string) => {
    if (sortColumn === column) {
      return sortDirection === 'ascending' ? ' 🔼' : ' 🔽';
    }
    return ' ⇅'; 
  };

  return (
    <div className="container mx-auto p-4">
      <SearchInput onSearch={(query: string) => {
        setSearchTerm(query);
        setStart(0);
        setAllCities([]);
        setHasMore(true);
      }} />
      <table className="min-w-full divide-y divide-gray-200 mt-4">
        <thead className="bg-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
          <tr>
            <th className="p-2 cursor-pointer" onClick={() => handleSortChange('name')}>
              City Name{getSortIndicator('name')}
            </th>
            <th className="p-2 cursor-pointer" onClick={() => handleSortChange('cou_name_en')}>
              Country{getSortIndicator('cou_name_en')}
            </th>
            <th className="p-2 cursor-pointer" onClick={() => handleSortChange('timezone')}>
              Timezone{getSortIndicator('timezone')}
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
      {loading && <p>Loading more cities...</p>}
    </div>
  );
};
