import { City } from "@/types";

export const sortCities = (
  cities: City[],
  sortColumn: keyof City,
  sortDirection: "ascending" | "descending"
): City[] =>
  cities.slice().sort((a, b) => {
    const valueA = a[sortColumn];
    const valueB = b[sortColumn];
    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortDirection === "ascending" ? valueA - valueB : valueB - valueA;
    } else if (typeof valueA === "string" && typeof valueB === "string") {
      return sortDirection === "ascending"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else {
      return 0;
    }
  });
