export const convertWindSpeedToKmh = (speedInMetersPerSecond: number): number => {
  return Math.round(speedInMetersPerSecond * 3.6);
}

export const convertWindSpeedToMph = (speedInKmh: number): number => {
  return Math.round(speedInKmh / 1.609); // 1 km/h ≈ 0.621371 mph
};
