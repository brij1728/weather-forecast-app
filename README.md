
```markdown
# Weather Forecast Web Application

## Introduction
This web application provides a detailed weather forecast for cities around the world. It is built using Next.js with TypeScript, React, and Tailwind CSS, offering a modern, responsive user interface with real-time data.

### Project Link
- **Live Demo**: [Weather Forecast App](https://weather-forecast-app-ashen.vercel.app/)
- **Source Code**: [GitHub Repository](https://github.com/brij1728/weather-forecast-app)

## Features
### Cities Table
- Infinite scroll table displaying cities along with details like city name, country, and timezone.
- Real-time search-as-you-type functionality with autocomplete suggestions.
- Filter and sorting capabilities for each table column.
- Direct navigation to a detailed weather page by clicking on a city name.
- Support for opening the weather page in a new tab via right-click context menu.

### Weather Page
- Accessible by clicking a city name in the cities table.
- Utilizes the [OpenWeatherMap API](https://openweathermap.org) to fetch and display real-time weather information.
- Presents current weather details, including temperature, description, humidity, wind speed, and atmospheric pressure.
- Displays weather forecast data with temperature ranges, weather conditions, and precipitation probabilities.
- Innovative features like displaying the location on a map and unit conversion options (optional).

### Integration
- Shows basic weather data like day high/low on the cities table page after loading it on the weather page.

## Getting Started
1. Clone the repository:
   ```
   git clone https://github.com/brij1728/weather-forecast-app
   ```
2. Install the dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Editing
Edit the `app/page.tsx` file to modify the page. The page auto-updates as you edit the file.

## Fonts
This project uses `next/font` to automatically optimize and load `Inter`, a custom Google Font.

## Deployment
Deploy your own project with Vercel by following the [Next.js deployment documentation](https://nextjs.org/docs/deployment).



