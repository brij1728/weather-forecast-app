import { useCallback, useEffect, useState } from 'react';

import { City } from '@/types';

interface Filters {
  name: string;
  country: string;
  timezone: string;
}

interface Sort {
  column: keyof City | null;
  direction: 'ascending' | 'descending';
}

interface FetchCitiesParams {
  start: number;
  filters: Filters;
  sort: Sort;
}


type FetchCitiesFunction = (params: FetchCitiesParams) => Promise<City[]>;

export const useCities = (fetchCitiesFunction: FetchCitiesFunction) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [start, setStart] = useState<number>(0);
  const [filters, setFilters] = useState<Filters>({ name: '', country: '', timezone: '' });
  const [sort, setSort] = useState<Sort>({ column: null, direction: 'ascending' });

  const loadCities = useCallback(async () => {
    setLoading(true);
    try {
      const newCities = await fetchCitiesFunction({ start, filters, sort });
      setCities(prev => start === 0 ? newCities : [...prev, ...newCities]);
      setHasMore(newCities.length >= 20);
    } catch (error) {
      console.error("Failed to fetch cities:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchCitiesFunction, start, filters, sort]);

  useEffect(() => {
    loadCities();
  }, [loadCities]);

   useEffect(() => {
    setStart(0);
    setCities([]);
    setHasMore(true);
    loadCities();
  }, [filters, sort, loadCities]);

  return { cities, loading, hasMore, setStart, filters, setFilters, sort, setSort };
};

