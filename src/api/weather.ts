import { WeatherForecastResponse } from "@/types";

export const fetchWeatherData = async (city: string): Promise<WeatherForecastResponse> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_WEATHER_API_URL}&q=${encodeURIComponent(city)}&APPID=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&cnt=56`;
  try {
	const response = await fetch(apiUrl);
	const data: WeatherForecastResponse = await response.json();
	return data;
  } catch (error) {
	console.error("Failed to fetch weather data", error);
	return {} as WeatherForecastResponse;
  }
}