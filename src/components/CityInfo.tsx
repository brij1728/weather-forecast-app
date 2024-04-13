"use client";

import React, { useState } from "react";
import { TemperatureUnit, WeatherForecastResponse } from "@/types";
import { convertTemperature, kelvinToCelsius } from "@/utils";
import { format, parseISO } from "date-fns";

import { WeatherContainer } from "./WeatherContainer";
import { WeatherIcon } from "./WeatherIcon";
import { useLocalTimeInfo } from "@/hooks";

interface CityDetailsProps {
  weatherData: WeatherForecastResponse;
}

export const CityInfo: React.FC<CityDetailsProps> = ({ weatherData }) => {
  const [unit, setUnit] = useState<TemperatureUnit>(TemperatureUnit.Celsius);

  const timezoneOffsetInSeconds = weatherData.city.timezone; 
  const { time, date } = useLocalTimeInfo(timezoneOffsetInSeconds);
  const firstData = weatherData.list[0];

  const temperature = convertTemperature(firstData.main.temp, unit);
  const feelsLikeTemperature = convertTemperature(firstData.main.feels_like, unit);

  return (
    <main className="flex flex-col w-full max-w-7xl mx-auto px-3 pt-4 pb-10 space-y-6">
      <div className="rounded-lg shadow-lg overflow-hidden">
        <div className="relative p-6 flex items-center" style={{ background: 'linear-gradient(135deg, #4568DC 0%, #B06AB3 50%, #DE5959 100%)' }}>
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-xl text-white font-semibold">{weatherData.city.name}</h2>
              <p className="text-sm text-gray-300">{weatherData.city.country}</p>
            </div>
            <div className="text-right">
              <WeatherIcon iconName={firstData.weather[0].icon} className="text-white text-6xl" />
              <p className="text-3xl text-white font-bold">{temperature}°</p>
              <p className="text-sm text-gray-300">RealFeel® {feelsLikeTemperature}°</p>
            </div>
          </div>
        </div>
      </div>

      <WeatherContainer className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <div className="flex gap-8">
          {weatherData.list.map((data, index) => {
            const localTime = format(parseISO(data.dt_txt), "h:mm a");
            const temp = kelvinToCelsius(data.main.temp);
            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <WeatherIcon iconName={data.weather[0].icon} />
                <p className="text-lg font-semibold">{temp.toFixed(0)}°</p>
                <p className="text-sm text-gray-600">{localTime}</p>
              </div>
            );
          })}
        </div>
      </WeatherContainer>
    </main>
  );
};
