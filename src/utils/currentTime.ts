import { format } from 'date-fns';

const convertToLocalTime = (timestamp: number, timezoneOffsetInSeconds: number): string => {
  const localTime = new Date((timestamp + timezoneOffsetInSeconds) * 1000);
  return format(localTime, 'HH:mm:ss');
};

interface LocalTimeInfo {
  currentTime: string;
  day: string;
  date: string;
  sunrise: string;
  sunset: string;
}

export const getLocalTimeInfo = (timezoneOffsetInSeconds: number, sunriseTimestamp: number, sunsetTimestamp: number): LocalTimeInfo => {
  const now = new Date();
 
  const timestamp = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const adjustedTime = new Date(timestamp + (timezoneOffsetInSeconds * 1000));

  
  const formattedTime = format(adjustedTime, 'HH:mm:ss');
  const formattedDay = format(adjustedTime, 'EEEE');
  const formattedDate = format(adjustedTime, 'dd.MM.yyyy');

 
  const formattedSunrise = convertToLocalTime(sunriseTimestamp, 0);
  const formattedSunset = convertToLocalTime(sunsetTimestamp, 0); 

  return {
    currentTime: formattedTime,
    day: formattedDay,
    date: formattedDate,
    sunrise: formattedSunrise,
    sunset: formattedSunset,
  };
};
