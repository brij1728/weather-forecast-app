import Image from 'next/image';
import React from 'react';

interface WeatherIconProps {
  iconName: string;
  className?: string;
  title?: string;  
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ iconName, className, title, ...props }) => {
  const iconUrl = `${process.env.NEXT_PUBLIC_WEATHER_ICON_URL}${iconName}@4x.png`;
  return (
    <div {...props} className={`relative h-20 w-20 ${className}`}>
      <Image
        width={100}
        height={100}
        alt="weather-icon"
        title={title} 
        className="absolute h-full w-full"
        src={iconUrl}
      />
    </div>
  );
}
