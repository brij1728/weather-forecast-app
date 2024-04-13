import { City, CityDetails, CitySearchResponse } from "@/types";

const mapCity = (city: CityDetails): City => ({
  name: city.name,
  country: city.cou_name_en,
  timezone: city.timezone,
  id: city.geoname_id,
  coordinates: city.coordinates,
});

export const fetchCities = async ({
  cityName,
  countryName,
  start,
  limit,
  orderBy = "name",
  orderDirection = "asc",
}: {
  cityName?: string;
  countryName?: string;
  start?: number;
  limit?: number;
  orderBy?: keyof CityDetails;
  orderDirection?: "asc" | "desc";
}): Promise<City[]> => {
  cityName = cityName?.trim() ?? "";
  countryName = countryName?.trim() ?? "";
  start = start ?? 0;
  limit = limit ?? 20;

  if (!process.env.NEXT_PUBLIC_CITY_API_URL) {
    console.error("NEXT_PUBLIC_CITY_API_URL is not defined");
    return [];
  }

  const url = new URL(process.env.NEXT_PUBLIC_CITY_API_URL);

  const whereClauses: string[] = [];
  if (countryName) {
    whereClauses.push(`search(cou_name_en, "${countryName}")`);
  }
  if (cityName) {
    whereClauses.push(`search(name, "${cityName}")`);
  }

  if (whereClauses.length > 0) {
    const whereClause = whereClauses.join(" AND ");
    url.searchParams.append("where", whereClause);
  }

  if (orderBy) {
    url.searchParams.append(
      "order_by",
      `${orderBy} ${orderDirection ?? "asc"}`
    );
  }

  if (start) {
    url.searchParams.append("start", start.toString());
  }
  url.searchParams.append("limit", limit.toString());

  try {
    const response = await fetch(url);
    const data: CitySearchResponse = await response.json();
    console.log(data);
    return data.results.map(mapCity);
  } catch (error) {
    console.error("Failed to fetch cities", error);
    return [];
  }
};

export const getCityById = async (id: string): Promise<City | null> => {
  if (!process.env.NEXT_PUBLIC_CITY_API_URL) {
    console.error("NEXT_PUBLIC_CITY_API_URL is not defined");
    return null;
  }

  const url = new URL(`${process.env.NEXT_PUBLIC_CITY_API_URL}`);
  url.searchParams.append("refine", `geoname_id:${id}`);

  try {
    const response = await fetch(url);
    const data: CitySearchResponse = await response.json();
    if (data.results.length === 0) {
      return null;
    }
    return data.results.map(mapCity)[0];
  } catch (error) {
    console.error("Failed to fetch city", error);
    return null;
  }
};
