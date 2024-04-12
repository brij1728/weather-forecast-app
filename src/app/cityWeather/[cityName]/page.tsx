"use client";

import { useEffect, useState } from "react";

import { CityDetails } from "@/components/CityDetails/CityDetails";
import { Spinner } from "@/components";
import { WeatherForecastResponse } from "@/types";
import { fetchWeatherData } from "@/api";
import { usePathname } from "next/navigation";

export default function Page () {
    const pathname = usePathname();
	console.log(pathname);
    const cityName = pathname.split('/')[2]; 

    const [weatherData, setWeatherData] = useState<WeatherForecastResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!cityName) return;

        setLoading(true);
        fetchWeatherData(cityName)
            .then(data => {
                setWeatherData(data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch weather data');
                setLoading(false);
            });
    }, [cityName]);

    if (loading) return <Spinner />;
    if (error) return <p>Error: {error}</p>;
    if (!weatherData) return <p>No weather data available for {cityName}</p>;

    return (
       <CityDetails cityName={cityName} weatherData={weatherData} />
    );
};
