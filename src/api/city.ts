import { CityDetails, CitySearchResponse } from "@/types";

export const fetchCities = async (searchTerm: string = '', start: number = 0): Promise<CityDetails[]> => {
  const rowsPerPage = 20; 
  const apiUrl = `${process.env.NEXT_PUBLIC_CITY_API_URL || ''}&q=${encodeURIComponent(searchTerm)}&start=${start}`;
  
  try {
    const response = await fetch("https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100");
    const data: CitySearchResponse = await response.json();
    console.log(data);
    return data.results.map((city) => ({
      ...city,
    }));
  } catch (error) {
    console.error("Failed to fetch cities", error);
    return [];
  }
};
