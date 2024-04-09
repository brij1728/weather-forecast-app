import { CityDetails } from '../types';

export const sortAndFilterCities = (
  cities: CityDetails[],
  filter: string,
  sortConfig: { key: keyof CityDetails; direction: 'ascending' | 'descending' } | null
): CityDetails[] => {
  let sortedAndFiltered = [...cities];

  if (filter) {
    sortedAndFiltered = sortedAndFiltered.filter(city =>
      city.name.toLowerCase().includes(filter.toLowerCase()) ||
      city.cou_name_en.toLowerCase().includes(filter.toLowerCase()) ||
      city.timezone.toLowerCase().includes(filter.toLowerCase())
    );
  }

  if (sortConfig !== null) {
    sortedAndFiltered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }

  return sortedAndFiltered;
};
