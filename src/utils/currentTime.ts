import { format } from 'date-fns';

interface LocalTimeInfo {
  time: string;  
  day: string;  
  date: string;  
}

export const getLocalTimeInfo = (timezoneOffsetInSeconds: number): LocalTimeInfo => {
  const now = new Date();
  // Adjust the time to the local timezone
  const timestamp = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const adjustedTime = new Date(timestamp + (timezoneOffsetInSeconds * 1000));

  // Format the adjusted local time
  const formattedTime = format(adjustedTime, 'HH:mm:ss');
  const formattedDay = format(adjustedTime, 'EEEE');
  const formattedDate = format(adjustedTime, 'dd.MM.yyyy');

  return {
    time: formattedTime,
    day: formattedDay,
    date: formattedDate,
  };
};