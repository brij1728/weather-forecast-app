import { CityTable } from "../components";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <p className="text-xl font-medium my-2">Weather Forecast App</p>
      <CityTable/>

    </main>
  );
}
