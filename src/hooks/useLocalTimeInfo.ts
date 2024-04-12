import React, { useEffect, useState } from 'react';

import { dateFormat } from '@/utils';
import { format } from 'date-fns';

interface LocalTimeInfo {
  time: string;
  day: string;
  date: string;
}

export const useLocalTimeInfo = (timezoneOffsetInSeconds: number): LocalTimeInfo => {
  const [localTimeInfo, setLocalTimeInfo] = useState<LocalTimeInfo>({
    time: '',
    day: '',
    date: ''
  });

  useEffect(() => {
    const updateLocalTime = () => {
      const now = new Date();
      const timestamp = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
      const adjustedTime = new Date(timestamp + (timezoneOffsetInSeconds * 1000));

      const formattedTime = format(adjustedTime, 'HH:mm:ss');
      const formattedDay = format(adjustedTime, 'EEEE');
      const dayOfMonth = format(adjustedTime, 'd');
      const formattedDate = `${formattedDay}, ${dateFormat(parseInt(dayOfMonth))} ${format(adjustedTime, 'MMMM')} ${format(adjustedTime, 'yyyy')}`;

      setLocalTimeInfo({
        time: formattedTime,
        day: formattedDay,
        date: formattedDate
      });
    };

    const timerId = setInterval(updateLocalTime, 1000);
    updateLocalTime();
    return () => clearInterval(timerId);
  }, [timezoneOffsetInSeconds]);

  return localTimeInfo;
};
