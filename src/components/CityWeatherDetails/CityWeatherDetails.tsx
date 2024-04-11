"use client";

import React, { useEffect, useState } from "react";
import {
  convertWindSpeedToKmh,
  convertWindSpeedToMph,
  kelvinToCelsius,
  kelvinToFahrenheit,
} from "@/utils";
import { format, parseISO } from "date-fns";

import { Spinner } from "../Spinner";
import { WeatherContainer } from "../WeatherContainer";
import { WeatherForecastResponse } from "@/types";
import { fetchWeatherData } from "@/api";

export const CityWeatherDetails = () => {
  const [city, setCity] = useState("Ballia");
  const [weatherData, setWeatherData] =useState < WeatherForecastResponse | null > (null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  const handleFetchWeather = async () => {
    if (!city) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await fetchWeatherData(city);
      setWeatherData(data);
    } catch (error) {
      setError("Failed to fetch weather data");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchWeather();
  }, [city]);

  if (loading) {
    return <Spinner />;
  }

  const firstData = weatherData?.list[0];
  let dayOfWeek = "";
  let formattedDate = "";
  if (firstData) {
    const date = parseISO(firstData.dt_txt);
    dayOfWeek = format(date, "EEEE");
    formattedDate = format(date, "dd.MM.yyyy");
  }

  // Convert temperature and wind speed based on selected unit
  const temperature =
    unit === "C"
      ? kelvinToCelsius(firstData?.main?.temp ?? 273.15)
      : kelvinToFahrenheit(firstData?.main?.temp ?? 273.15);
  const windSpeed =
    unit === "C"
      ? convertWindSpeedToKmh(firstData?.wind.speed ?? 0)
      : convertWindSpeedToMph(
          convertWindSpeedToKmh(firstData?.wind.speed ?? 0),
        );
  const windSpeedUnit = unit === "C" ? "km/h" : "mph";

  return (
    <main className="flex flex-col w-full max-w-7xl mx-auto px-3 pt-4 pb-10">
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="flex gap-1 text-2xl items-end">
            <p className="text-2xl">{dayOfWeek}</p>
            <p className="text-lg">({formattedDate})</p>
          </h2>
          <WeatherContainer className="gap-2 px-6 items-center">
            <div className="flex flex-col px-4">
              <div className="flex items-start">
                <span className="text-5xl ">{temperature.toFixed(0)}</span>
                <span
                  className={`cursor-pointer mx-2 ${unit === "C" ? "text-black" : "text-gray-400"}`}
                  onClick={() => setUnit("C")}
                >
                  °C
                </span>
                |
                <span
                  className={`cursor-pointer mx-2 ${unit === "F" ? "text-black" : "text-gray-400"}`}
                  onClick={() => setUnit("F")}
                >
                  °F
                </span>
              </div>
              <p className="text-xs space-x-1 whitespace-nowrap">
                <span>Feels like </span>
                <span>
                  {kelvinToCelsius(firstData?.main?.feels_like ?? 273.15)}°
                </span>
              </p>
              <p className="text-xs space-x-2">
                <span>
                  {kelvinToCelsius(firstData?.main?.temp_min ?? 273.15)}°↓
                </span>
                <span>
                  {kelvinToCelsius(firstData?.main?.temp_max ?? 273.15)}°↑
                </span>
              </p>
            </div>
            <div className="text-xs mt-4 md:mt-0">
              <p>Precipitation: {Math.round((firstData?.pop ?? 0) * 100)}%</p>
              <p>Humidity: {firstData?.main.humidity ?? 0}%</p>
              <p>
                Wind: {windSpeed.toFixed(1)} {windSpeedUnit}
              </p>
            </div>
			<div className="flex w-full gap-10 sm:gap-16 overflow-x-auto justify-between pt-3 ">
				{weatherData?.list.map((data, index) => {
					const date = parseISO(data.dt_txt);
					const time = format(date, "h:mm a");
					const temperature =  kelvinToCelsius(data?.main.temp ?? 273.15);
					return (
						<div key={index} className="flex flex-col items-center justify-between gap-2 text-xs font-semibold">
							<p className="whitespace-nowrap">{time}</p>
							<img
								src={`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
								alt={data.weather[0].description}
								className="w-10 h-10"
							/>
							<p className="text-xs">{temperature.toFixed(0)}°</p>
						</div>
					);

				
				})}
			</div>
          </WeatherContainer>
        </div>
      </section>
    </main>
  );
};
