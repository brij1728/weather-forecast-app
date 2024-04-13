import { CityTable } from "../components";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between">
      <div className="flex-shrink">
        <p className="text-xl font-medium my-2">Weather Forecast App</p>
      </div>
      <div className="flex-grow">
        <CityTable />
      </div>
    </main>
  );
}
