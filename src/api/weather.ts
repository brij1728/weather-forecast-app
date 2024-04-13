import { WeatherForecastResponse } from "@/types";

export const fetchWeatherData = async ({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}): Promise<WeatherForecastResponse> => {
  const url = new URL(`${process.env.NEXT_PUBLIC_WEATHER_API_URL}`);
  url.searchParams.append("lat", lat.toString());
  url.searchParams.append("lon", lon.toString());
  url.searchParams.append(
    "APPID",
    process.env.NEXT_PUBLIC_WEATHER_API_KEY || ""
  );
  url.searchParams.append("cnt", "56");

  try {
    const response = await fetch(url);
    const data: WeatherForecastResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch weather data", error);
    return {} as WeatherForecastResponse;
  }
};
