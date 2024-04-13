"use client";

import { CityDetails, Spinner } from "@/components";
import { useCallback, useEffect, useState } from "react";

import { WeatherForecastResponse } from "@/types";
import { fetchWeatherData, getCityById } from "@/api";
import { usePathname } from "next/navigation";

export default function Page() {
  const pathname = usePathname();
  const cityId = pathname.split("/")[2];

  const [weatherData, setWeatherData] =
    useState<WeatherForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCityWeather = useCallback(async (cityId: string) => {
    if (!cityId) return;
    setLoading(true);

    try {
      const city = await getCityById(cityId);
      if (!city) {
        throw new Error("City not found");
      }

      try {
        const data = await fetchWeatherData(city.coordinates);
        setWeatherData(data);
      } catch (err) {
        throw new Error("Failed to fetch weather data");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCityWeather(cityId);
    console.log(cityId);
  }, [cityId, fetchCityWeather]);

  if (loading) return <Spinner />;
  if (error) return <p>Error: {error}</p>;
  if (!weatherData) return <p>No weather data available for {cityId}</p>;

  return <CityDetails weatherData={weatherData} />;
}
