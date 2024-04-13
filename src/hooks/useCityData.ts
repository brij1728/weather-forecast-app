import { useCallback, useEffect, useState } from 'react';

import { City } from '../types';
import { fetchCities } from '../api';

interface UseCityDataProps {
  nameFilter: string;
  countryFilter: string;
  start: number;
  ROWS_PER_PAGE: number;
}

interface UseCityDataReturn {
  allCities: City[];
  loading: boolean;
  hasMore: boolean;
  loadCities: () => Promise<void>;
}

export const useCityData = ({ nameFilter, countryFilter, start, ROWS_PER_PAGE }: UseCityDataProps): UseCityDataReturn => {
  const [allCities, setAllCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loadCities = useCallback(async () => {
    setLoading(true);
    const newCities = await fetchCities({
      cityName: nameFilter,
      countryName: countryFilter,
      start,
      limit: ROWS_PER_PAGE,
    });
    setHasMore(newCities.length === ROWS_PER_PAGE);
    if (start === 0) {
      setAllCities(newCities);
    } else {
      setAllCities(prev => [...prev, ...newCities]);
    }
    setLoading(false);
  }, [nameFilter, countryFilter, start, ROWS_PER_PAGE]);

  useEffect(() => {
    loadCities();
  }, [loadCities]);

  return { allCities, loading, hasMore, loadCities };
};
