"use client";

import React, { useState } from "react";
import { SpeedUnit, TemperatureUnit, WeatherForecastResponse } from "@/types";
import { convertMetersToKilometers, convertSpeed, convertTemperature, getLocalTimeInfo } from "@/utils";
import { format, parseISO } from "date-fns";

import { ForecastWeatherDetails } from "./ForecastWeatherDetails";
import { WeatherContainer } from "./WeatherContainer";
import { WeatherIcon } from "./WeatherIcon";
import { WeatherInfoDetails } from "./WeatherInfoDetails";
import { useLocalTimeInfo } from "@/hooks";

interface CityDetailsProps {
  weatherData: WeatherForecastResponse;
}

export const CityInfo: React.FC<CityDetailsProps> = ({ weatherData }) => {
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>(TemperatureUnit.Celsius);
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>(SpeedUnit.Kmh);

  const timezoneOffsetInSeconds = weatherData ? weatherData.city.timezone : 0;
  const { time, date } = useLocalTimeInfo(timezoneOffsetInSeconds);

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

  const uniqueDates = weatherData.list.reduce((acc, data) => {
    const date = data.dt_txt.split(" ")[0];
    if (!acc.includes(date)) {
      acc.push(date);
    }
    return acc;
  }, [] as string[]);


  const forecastData = weatherData.list.filter(data => {
    const [dateStr, timeStr] = data.dt_txt.split(" ");
    const [hourStr] = timeStr.split(":");
    const hour = parseInt(hourStr, 10);
    return hour < 6 && uniqueDates.includes(dateStr);
  });
  console.log(forecastData);


  return (
    <main className="flex flex-col w-full max-w-7xl mx-auto px-3 pt-4 pb-10 space-y-6">
      <div className="rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 flex items-center" style={{ background: 'linear-gradient(135deg, #4568DC 0%, #B06AB3 50%, #DE5959 100%)' }}>
          <div className="flex flex-col items-center justify-center w-full text-white">
            <div className="whitespace-nowrap">
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
                <p className="text-white text-xs mt-4">Local Time: {time}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-lg shadow-lg overflow-hidden" style={{ background: 'linear-gradient(135deg, #4568DC 0%, #B06AB3 50%, #DE5959 100%)' }}>
      </div>

      {/* <WeatherContainer className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <div className="flex w-full gap-10 sm:gap-16 overflow-x-auto justify-between pt-3 ">
          {weatherData?.list.map((data, index) => {
            const date = parseISO(data.dt_txt);
            const time = format(date, "h:mm a");
            const temperature = convertTemperature((data?.main.temp ?? 273.15), temperatureUnit);
            return (
              <div key={index} className="flex flex-col items-center justify-between gap-2 text-xs font-semibold">
                <p className="whitespace-nowrap">{time}</p>
                <WeatherIcon iconName={data.weather[0].icon} />
                <p className="text-xs">{temperature.toFixed(0)}°</p>
              </div>
            );
          })}
        </div>
      </WeatherContainer> */}
      <WeatherContainer className="px-6 gap-4 overflow-x-auto justify-between" style={{ background: 'linear-gradient(135deg, #4568DC 0%, #B06AB3 50%, #DE5959 100%)' }}>
        <WeatherInfoDetails
          visibility={`${convertMetersToKilometers(firstData?.visibility)}`}
          pressure={`${firstData?.main.pressure ?? 0} hPa`}
          humidity={`${firstData?.main.humidity ?? 0}%`}
          windSpeed={`${windSpeed.toFixed(1)} ${windSpeedUnit}`}
          sunRise={sunrise}
          sunSet={sunset}
        />
      </WeatherContainer>
      <section className="flex flex-col w-full gap-4">
        <p className="text-2xl">Forecast (7 days)</p>
        <WeatherContainer className="px-6 flex-col gap-4 overflow-x-auto justify-between" style={{ background: 'linear-gradient(135deg, #4568DC 0%, #B06AB3 50%, #DE5959 100%)' }}>
          {forecastData.map((data, index) => {
            const date = parseISO(data.dt_txt);
            const time = format(date, "h:mm a");
            const temperature = convertTemperature((data?.main.temp ?? 273.15), temperatureUnit);
            const feelsLikeTemperature = convertTemperature((data?.main.feels_like ?? 273.15), temperatureUnit);
            const windSpeed = `${convertSpeed(data.wind.speed, speedUnit).toFixed(1)} ${windSpeedUnit}`;
            return (
              <ForecastWeatherDetails
                key={index}
                weatherIcon={data.weather[0].icon}
                date={format(date, "dd.MM")}
                day={format(date, "EEEE")}
                temp={temperature}
                feelsLike={feelsLikeTemperature}
                tempMin={data.main.temp_min}
                tempMax={data.main.temp_max}
                description={data.weather[0].description}
                visibility={convertMetersToKilometers(data.visibility)}
                pressure={`${data.main.pressure} hPa`}
                humidity={`${data.main.humidity}%`}
                windSpeed={windSpeed}
                sunRise={sunrise}
                sunSet={sunset}
              />
            );
          })}
        </WeatherContainer>
      </section>
    </main>
  );
};
