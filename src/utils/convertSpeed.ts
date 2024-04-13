import { SpeedUnit } from "@/types";

export const convertWindSpeedToKmh = (speedInMetersPerSecond: number): number => {
  return Math.round(speedInMetersPerSecond * 3.6);
}

export const convertWindSpeedToMph = (speedInKmh: number): number => {
  return Math.round(speedInKmh / 1.609344);
}


export const convertSpeed = (speed: number, unit: SpeedUnit): number => {
  switch (unit) {
    case SpeedUnit.Kmh:
      return convertWindSpeedToKmh(speed);
    case SpeedUnit.Mph:
      // Since we receive speed in m/s and want it in mph, convert km/h to mph
      return convertWindSpeedToMph(convertWindSpeedToKmh(speed));
    default:
      throw new Error('Invalid speed unit');
  }
};