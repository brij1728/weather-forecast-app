import { CityDetails, CitySearchResponse } from "@/types";

export const fetchCities = async (searchTerm: string = '', start: number = 0): Promise<CityDetails[]> => {
  const rowsPerPage = 20; 
  const apiUrl = `${process.env.NEXT_PUBLIC_CITY_API_URL || ''}&q=${encodeURIComponent(searchTerm)}&start=${start}`;
  
  try {
    const response = await fetch(apiUrl);
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
