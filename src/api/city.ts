import { CityDetails, CitySearchResponse } from "@/types";

export const fetchCities = async (searchTerm: string = ''): Promise<CityDetails[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_CITY_API_URL || ''; 
  const url = `${apiUrl}&q=${searchTerm}`;
  
  try {
    const response = await fetch(url);
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