"use client";

import React, { useEffect, useState } from 'react'
import { convertWindSpeedToKmh, kelvinToCelsius } from '@/utils';
import { format, parse, parseISO } from 'date-fns';

import { Spinner } from '../Spinner';
import { WeatherContainer } from '../WeatherContainer';
import { WeatherForecastResponse } from '@/types'
import { fetchWeatherData } from '@/api'

export const CityWeatherDetails = () => {
	const [city, setCity] = useState('Ballia');
	const [weatherData, setWeatherData] = useState<WeatherForecastResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	
	const handleFetchWeather = async () => {
        if (!city) {
            return;
        }
        setLoading(true);
        setError('');
        try {
            const data = await fetchWeatherData(city);
			console.log(data);
            setWeatherData(data);
        } catch (error) {
            setError('Failed to fetch weather data');
            setWeatherData(null); 
        } finally {
            setLoading(false);
        }
    };

	useEffect(() => {
		handleFetchWeather()
	}
	, [city]);
	
	console.log(weatherData?.city?.name);

	if (loading) {
		return <Spinner />;
	}

  const firstData = weatherData?.list[0];
  let dayOfWeek = '';
  let formattedDate = '';
  if (firstData) {
    const date = parse(firstData.dt_txt, 'yyyy-MM-dd HH:mm:ss', new Date());
    dayOfWeek = format(date, "EEEE");
    formattedDate = format(date, "dd.MM.yyyy");
  }
	
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
						<span className="text-5xl ">{kelvinToCelsius(firstData?.main?.temp ?? 273.15) }°</span>
						<p className="text-xs space-x-1 whitespace-nowrap">
							<span>Feels like </span>
							<span>{kelvinToCelsius(firstData?.main?.feels_like ?? 273.15)}°</span>
						</p>
						<p className="text-xs space-x-2">
						  	<span>{kelvinToCelsius(firstData?.main?.temp_min ?? 273.15)}°↓</span>
							<span>{kelvinToCelsius(firstData?.main?.temp_max ?? 273.15)}°↑</span>
						</p>

					</div>
					<div className="text-xs mt-4 md:mt-0">
						<p>Precipitation: {Math.round((firstData?.pop ?? 0) * 100)}%</p>
						<p>Humidity: {firstData?.main.humidity ?? 0}%</p>
						<p>Wind: {convertWindSpeedToKmh(firstData?.wind.speed ?? 0)} km/h</p>
					</div>

				</WeatherContainer>
			</div>
		</section>
		<section className="flex flex-col w-full max-w-7xl mx-auto px-3 pt-4 pb-10">
		</section>
	</main>
  )
}
