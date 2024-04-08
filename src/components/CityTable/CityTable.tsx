"use client";

import { City, CityDetails } from '../../types';
import React, { useEffect, useState } from 'react';

import { CityRow } from '../CityRow';
import { SearchInput } from '../SearchInput';
import { fetchCities } from '../../api';

export const CityTable: React.FC = () => {
  const [cities, setCities] = useState<CityDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadCities = async () => {
      const fetchedCities = await fetchCities(searchTerm);
      setCities(fetchedCities);
    };

    const timer = setTimeout(() => {
      loadCities();
    }, 500); 

    return () => clearTimeout(timer); 
  }, [searchTerm]);


  const transformedCities: City[] = cities.map(cityDetails => ({
    name: cityDetails.name,
    country: cityDetails.cou_name_en, 
    timezone: cityDetails.timezone,
    id: cityDetails.geoname_id, 
  }));

  return (
    <div className="container mx-auto p-4">
      <SearchInput onSearch={(query: string) => setSearchTerm(query)} />
      <table className="min-w-full divide-y divide-gray-200 mt-4">
        <thead>
          <tr className="bg-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
            <th className="p-2">City Name</th>
            <th className="p-2">Country</th>
            <th className="p-2">Timezone</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transformedCities.map((city) => (
            <CityRow key={city.id} city={city} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

