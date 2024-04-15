import { LuEye, LuSunrise, LuSunset } from 'react-icons/lu';

import { FiDroplet } from 'react-icons/fi';
import { ImMeter } from 'react-icons/im';
import { MdAir } from 'react-icons/md';
import React from 'react';

export interface WeatherInfoDetailsProps {
	visibility: string;
	pressure: string;
	humidity: string;
	windSpeed: string;
	sunRise: string;
	sunSet: string;
	className?: string;
	style?: React.CSSProperties;
}



export const WeatherInfoDetails  = ({className,style, ...props}: WeatherInfoDetailsProps) => {
  const {
	visibility = "25km",
	pressure = "1013 hPa",
	humidity = "65%",
	windSpeed = "3.1 km/h",
	sunRise = "6:00 AM",
	sunSet = "6:00 PM"
  } = props;
  
  return (
	<div className={`flex flex-col sm:flex-row justify-between items-stretch w-full gap-4 ${className}`} style={style}>
		<SingleWeatherDetails icon={<LuEye/>} infoName={"Visibility"}  value={visibility}/>
		<SingleWeatherDetails icon={<ImMeter/>} infoName={"Pressure"} value={pressure}/>
		<SingleWeatherDetails icon={<FiDroplet/>} infoName={"Humidity"} value={humidity}/>
		<SingleWeatherDetails icon={<MdAir/>} infoName={"Wind Speed"} value={windSpeed}/>
		<SingleWeatherDetails icon={<LuSunrise/>} infoName={"Sunrise"} value={sunRise}/>
		<SingleWeatherDetails icon={<LuSunset/>} infoName={"Sunset"} value={sunSet}/>

		

	</div>
  )
}


interface SingleWeatherDetailsProps {
  infoName: string;
  icon: React.ReactNode;
  value: string;
}

const SingleWeatherDetails  = (props: SingleWeatherDetailsProps) => {
  return (
	<div className="flex flex-row sm:flex-col flex-grow w-full justify-between items-center text-xs font-semibold gap-16 sm:gap-4 m  text-white/80">
		<p className="whitespace-nowrap my-4">{props.infoName}</p>
		<div className="text-3xl ">
			{props.icon}
		</div>
		<p className="text-xs">{props.value}</p>
	</div>
  )
}