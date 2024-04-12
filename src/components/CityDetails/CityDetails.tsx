"use client";

import React, { useState } from "react";
import { convertWindSpeedToKmh, convertWindSpeedToMph, getLocalTimeInfo, kelvinToCelsius, kelvinToFahrenheit } from "@/utils";
import { format, parseISO } from "date-fns";

import { WeatherContainer } from "../WeatherContainer";
import { WeatherForecastResponse } from "@/types";
import { WeatherIcon } from "../WeatherIcon";
import { useLocalTimeInfo } from "@/hooks";

interface CityDetailsProps {
  
  weatherData:WeatherForecastResponse
}

export const CityDetails: React.FC<CityDetailsProps> = ({  weatherData }) => {
  
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  
  const timezoneOffsetInSeconds = weatherData ? weatherData.city.timezone : 0; 
  const { time,  date } = useLocalTimeInfo(timezoneOffsetInSeconds);


  const firstData = weatherData.list[0];

  // Convert temperature and wind speed based on selected unit
  const temperature = unit === "C"
    ? kelvinToCelsius(firstData.main.temp)
    : kelvinToFahrenheit(firstData.main.temp);
  const windSpeed = unit === "C"
    ? convertWindSpeedToKmh(firstData.wind.speed)
    : convertWindSpeedToMph(convertWindSpeedToKmh(firstData.wind.speed));
  const windSpeedUnit = unit === "C" ? "km/h" : "mph";

  const { sunrise, sunset } = getLocalTimeInfo(weatherData.city.timezone, weatherData.city.sunrise, weatherData.city.sunset);

  return (
    <main className="flex flex-col w-full max-w-7xl mx-auto px-3 pt-4 pb-10">
      <section className="space-y-4">
        <div className="space-y-2">
          
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
           
          </WeatherContainer>
          <WeatherContainer className="gap-2 px-6 items-center">
            <div className="flex flex-row justify-between w-full">
              <div className="flex flex-col">
                <div className="flex gap-1 items-end">
                  <p className="text-2xl">{weatherData?.city.name},</p>
                  <p className="text-lg">{weatherData?.city.country}</p>
                </div>
                <h2 className="text-xs">
                  <p>Local Time: {time}</p>
                  <p>{date}</p>
                </h2>
              </div>
              <div className="flex flex-col justify-end text-xs">
                <p className="text-right">Sunrise: {sunrise}</p>
                <p className="text-right">Sunset: {sunset}</p>
              </div>
            </div>
          </WeatherContainer>


          <WeatherContainer className="gap-2 px-6 items-center">
            
            <div className="flex w-full gap-10 sm:gap-16 overflow-x-auto justify-between pt-3 ">
              {weatherData?.list.map((data, index) => {
                const date = parseISO(data.dt_txt);
                const time = format(date, "h:mm a");
                const temperature =  kelvinToCelsius(data?.main.temp ?? 273.15);
                return (
                  <div key={index} className="flex flex-col items-center justify-between gap-2 text-xs font-semibold">
                    <p className="whitespace-nowrap">{time}</p>
                    <WeatherIcon iconName={data.weather[0].icon} />
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
