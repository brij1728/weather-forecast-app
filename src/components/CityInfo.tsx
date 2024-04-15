"use client";

import React, { useState } from "react";
import { SpeedUnit, TemperatureUnit, WeatherForecastResponse } from "@/types";
import { convertSpeed, convertTemperature, getLocalTimeInfo, kelvinToCelsius } from "@/utils";
import { format, parseISO } from "date-fns";

import { WeatherContainer } from "./WeatherContainer";
import { WeatherIcon } from "./WeatherIcon";
import { useLocalTimeInfo } from "@/hooks";

interface CityDetailsProps {
  weatherData: WeatherForecastResponse;
}

export const CityInfo: React.FC<CityDetailsProps> = ({ weatherData }) => {
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>(TemperatureUnit.Celsius);
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>(SpeedUnit.Kmh);

  
  const timezoneOffsetInSeconds = weatherData ? weatherData.city.timezone : 0; 
  const { time,  date } = useLocalTimeInfo(timezoneOffsetInSeconds);


  const firstData = weatherData.list[0];

  const temperature = convertTemperature(firstData.main.temp, temperatureUnit);
  const feelsLikeTemperature = convertTemperature(firstData.main.feels_like, temperatureUnit);

  const windSpeed = convertSpeed(firstData.wind.speed, speedUnit);
  const windSpeedUnit = speedUnit === SpeedUnit.Kmh ? "km/h" : "mph";

  const toggleTemperatureUnit = () => {
    const newTempUnit = temperatureUnit === TemperatureUnit.Celsius ? TemperatureUnit.Fahrenheit : TemperatureUnit.Celsius;
    setTemperatureUnit(newTempUnit);

    const newSpeedUnit = newTempUnit === TemperatureUnit.Celsius ? SpeedUnit.Kmh : SpeedUnit.Mph;
    setSpeedUnit(newSpeedUnit);
  };

  const { sunrise, sunset } = getLocalTimeInfo(weatherData.city.timezone, weatherData.city.sunrise, weatherData.city.sunset);

  return (
    <main className="flex flex-col w-full max-w-7xl mx-auto px-3 pt-4 pb-10 space-y-6">
      <div className="rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 flex items-center" style={{ background: 'linear-gradient(135deg, #4568DC 0%, #B06AB3 50%, #DE5959 100%)' }}>
          <div className="flex flex-col items-center justify-center w-full text-white">
            <div className="whitespace-nowrap ">
              <span className="text-xl text-white font-semibold pr-2">{weatherData.city.name}</span>
              <span className="text-sm text-gray-300">({weatherData.city.country})</span>
            </div>
            <div className=" text-white text-xs">
              <span>{date}</span>
            </div>
            <div className="my-4">
              
              <WeatherIcon
              iconName={firstData.weather[0].icon}
              className="text-xs capitalize"
              title={firstData.weather[0].description}
              />

              <div className="flex flex-col">
              <p className="flex whitespace-nowrap">
                <span className="text-5xl ">{temperature}</span>
                <span
                  className={`cursor-pointer mx-2 ${temperatureUnit === "C" ? "text-white" : "text-gray-400"}`}
                  onClick={toggleTemperatureUnit}
                >
                  °C
                </span>
                |
                <span
                  className={`cursor-pointer mx-2 ${temperatureUnit === "F" ? "text-white" : "text-gray-400"}`}
                  onClick={toggleTemperatureUnit}
                >
                  °F
                </span>
              </p>
              <p className=" whitespace-nowrap">
                <span className="text-xs space-x-1">Feels like </span>
                <span>
                  {feelsLikeTemperature}°
                </span>
              </p>
              <p className="text-xs space-x-2">
                <span>
                  {convertTemperature((firstData?.main?.temp_min ?? 273.15), temperatureUnit)}°↓
                </span>
                <span>
                  {convertTemperature((firstData?.main?.temp_max ?? 273.15), temperatureUnit)}°↑
                </span>
              </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-lg shadow-lg overflow-hidden" style={{ background: 'linear-gradient(135deg, #4568DC 0%, #B06AB3 50%, #DE5959 100%)' }}>
  <div className="flex justify-between items-center text-xs p-4">
    <div>
      <p className="text-white">Local Time: {time}</p>
      <p className="text-white">Sunrise: {sunrise}</p>
      <p className="text-white">Sunset: {sunset}</p>
    </div>
    <div className="text-white">
      <p>Precipitation: {Math.round((firstData?.pop ?? 0) * 100)}%</p>
      <p>Humidity: {firstData?.main.humidity ?? 0}%</p>
      <p>Wind: {windSpeed.toFixed(1)} {windSpeedUnit}</p>
    </div>
  </div>
</div>

    
      <WeatherContainer className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
       <div className="flex w-full gap-10 sm:gap-16 overflow-x-auto justify-between pt-3 ">
              {weatherData?.list.map((data, index) => {
                const date = parseISO(data.dt_txt);
                const time = format(date, "h:mm a");
                const temperature =  convertTemperature((data?.main.temp ?? 273.15), temperatureUnit);
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
    </main>
  );
};
