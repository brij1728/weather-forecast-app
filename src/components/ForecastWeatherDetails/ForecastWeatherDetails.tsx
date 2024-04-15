import { WeatherInfoDetails, WeatherInfoDetailsProps } from '../WeatherInfoDetails';

import React from 'react';
import { WeatherContainer } from '../WeatherContainer';
import { WeatherIcon } from '../WeatherIcon';

interface ForecastWeatherDetailsProps extends WeatherInfoDetailsProps {
  weatherIcon: string;
  date: string;
  day: string;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  description: string;
}

export const ForecastWeatherDetails = (props: ForecastWeatherDetailsProps) => {
  return (
    <WeatherContainer className="gap-4 flex-col sm:flex-row">
      <section className="flex gap-4 items-center px-4">
        <div>
          <WeatherIcon iconName={props.weatherIcon} />
          <p>{props.date}</p>
          <p className="text-sm">{props.day}</p>
        </div>
        <div className="flex flex-col px-4">
          <span className="text-5xl">{props.temp}°</span>
          <p className="whitespace-nowrap">
            <span className="text-xs space-x-1">Feels like </span>
            <span>{props.feelsLike}°</span>
          </p>
          <p className="capitalize">{props.description}</p>
        </div>
      </section>
      <section className="flex gap-4 items-center justify-between sm:px-4 sm:pr-10 w-full overflow-x-auto">
        <WeatherInfoDetails {...props} className="border rounded-xl p-4 shadow-sm linear-gradient-bg"
          style={{ background: 'linear-gradient(135deg, #4568DC 0%, #B06AB3 50%, #DE5959 100%)' }}/>
      </section>
    </WeatherContainer>
  );
};
