export const kelvinToFahrenheit = (kelvin: number): number => {
  const fahrenheit = (kelvin - 273.15) * (9/5) + 32;
  return Math.round(fahrenheit);
}

export const kelvinToCelsius = (kelvin: number): number => {
  const celsius = kelvin - 273.15;
  return Math.round(celsius);
}
