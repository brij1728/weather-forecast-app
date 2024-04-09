"use client";

import { City, CityDetails } from '../../types';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { CityRow } from '../CityRow';
import { SearchInput } from '../SearchInput';
import { fetchCities } from '../../api';

export const CityTable: React.FC = () => {
  const [cities, setCities] = useState<CityDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [start, setStart] = useState(0); 
  const [loading, setLoading] = useState(false); 
  const [hasMore, setHasMore] = useState(true); 

  const observer = useRef<IntersectionObserver>();
  const lastCityElementRef = useCallback((node: HTMLElement | null) => {
  if (loading) return;
  if (observer.current) observer.current.disconnect();
  observer.current = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && hasMore) {
      setStart(prevStart => prevStart + 50);
    }
  });
  if (node) observer.current.observe(node);
}, [loading, hasMore]);


  useEffect(() => {
    setLoading(true);
    const loadCities = async () => {
      const newCities = await fetchCities(searchTerm, start);
      setCities(prev => [...prev, ...newCities]);
      setLoading(false);
      if (newCities.length === 0) {
        setHasMore(false);
      }
    };

    loadCities();
  }, [searchTerm, start]);

  const transformedCities: City[] = cities.map(cityDetails => ({
    name: cityDetails.name,
    country: cityDetails.cou_name_en, 
    timezone: cityDetails.timezone,
    id: cityDetails.geoname_id, 
  }));
  return (
    <div className="container mx-auto p-4">
      <SearchInput onSearch={(query: string) => {
        setSearchTerm(query);
        setStart(0);
        setCities([]); 
        setHasMore(true);
      }} />
      <table className="min-w-full divide-y divide-gray-200 mt-4">
        <thead>
          <tr className="bg-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
            <th className="p-2">City Name</th>
            <th className="p-2">Country</th>
            <th className="p-2">Timezone</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transformedCities.map((city, index) => (
            <CityRow ref={index + 1 === cities.length ? lastCityElementRef : undefined} key={city.id} city={city} />
          ))}
        </tbody>
      </table>
      {loading && <p>Loading more cities...</p>}
    </div>
  );
};
