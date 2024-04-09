import { CityDetails } from '@/types';

export const sortCities = (cities: CityDetails[], sortColumn: keyof CityDetails, sortDirection: 'ascending' | 'descending'): CityDetails[] =>
  cities.slice().sort((a, b) => {
    const valueA = a[sortColumn];
    const valueB = b[sortColumn];
    return sortDirection === 'ascending' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  });
