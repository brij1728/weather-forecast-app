export const convertWindSpeedToKmh = (speedInMetersPerSecond: number): number => {
  return Math.round(speedInMetersPerSecond * 3.6);
}
