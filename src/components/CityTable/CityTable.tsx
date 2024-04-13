"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { City } from "@/types";
import { CityRow } from "../CityRow";
import { SearchInput } from "../SearchInput";
import { fetchCities } from "@/api";
import { sortCities } from "@/utils/sortCities";

const debounce = (func: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export const CityTable: React.FC = () => {
  const [allCities, setAllCities] = useState<City[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof City | null>(null);
  const [sortDirection, setSortDirection] = useState<
    "ascending" | "descending"
  >("ascending");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [start, setStart] = useState(0);
  const [nameFilter, setNameFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [timezoneFilter, setTimezoneFilter] = useState("");
  const tableRef = useRef<HTMLTableElement>(null);
  const observer = useRef<IntersectionObserver>();
  const ROWS_PER_PAGE = 100;

  const loadCities = useCallback(async () => {
    setLoading(true);
    const newCities = await fetchCities({
      cityName: nameFilter,
      countryName: countryFilter,
      start,
      limit: ROWS_PER_PAGE,
    });
    setHasMore(newCities.length > 0);
    if (start === 0) {
      setAllCities(newCities);
    } else {
      setAllCities((prev) => [...prev, ...newCities]);
    }
    setLoading(false);
  }, [countryFilter, nameFilter, start]);

  const debouncedLoadCities = useMemo(
    () => debounce(loadCities, 500),
    [loadCities]
  );

  useEffect(() => {
    debouncedLoadCities();
  }, [debouncedLoadCities]);

  const handleScroll = useCallback(() => {
    const { scrollTop, clientHeight, scrollHeight } = tableRef.current!;
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading && hasMore) {
      setStart((prevStart) => prevStart + ROWS_PER_PAGE);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    if (!hasMore) return;
    const table = tableRef.current;
    table?.addEventListener("scroll", handleScroll);
    return () => {
      table?.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, handleScroll]);

  const transformedCities = useMemo(() => {
    if (sortColumn) {
      return sortCities(allCities, sortColumn, sortDirection);
    } else {
      return allCities;
    }
  }, [allCities, sortColumn, sortDirection]);

  const handleSortChange = (column: keyof City) => {
    const isFilterInputFocused = document.activeElement?.tagName === "INPUT";

    if (isFilterInputFocused) return;

    if (sortColumn === column) {
      setSortDirection((prevDirection) =>
        prevDirection === "ascending" ? "descending" : "ascending"
      );
    } else {
      setSortColumn(column);
      setSortDirection("ascending");
    }
  };

  const getSortIndicator = (column: keyof City) => {
    if (sortColumn === column) {
      return sortDirection === "ascending" ? " 🔼" : " 🔽";
    }
    return " ⇅";
  };

  const lastCityElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setStart((prevStart) => prevStart + ROWS_PER_PAGE);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className="container mx-auto p-1">
      <SearchInput />
      <div className="overflow-x-auto">
        <table
          ref={tableRef}
          className="min-w-full divide-y divide-gray-200 mt-4 sm:table-fixed"
        >
          <thead className="bg-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th
                className="p-2 cursor-pointer relative"
                onClick={() => handleSortChange("name")}
              >
                <div className="flex flex-col">
                  <span className="mb-1">
                    City Name{getSortIndicator("name")}
                  </span>
                  <input
                    type="text"
                    value={nameFilter}
                    onChange={(e) => {
                      setStart(0);
                      setNameFilter(e.target.value);
                    }}
                    placeholder="Filter"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm font-normal focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </th>
              <th
                className="p-2 cursor-pointer relative"
                onClick={() => handleSortChange("country")}
              >
                <div className="flex flex-col">
                  <span className="mb-1">
                    Country{getSortIndicator("country")}
                  </span>
                  <input
                    type="text"
                    value={countryFilter}
                    onChange={(e) => {
                      setStart(0);
                      setCountryFilter(e.target.value);
                    }}
                    placeholder="Filter"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm font-normal focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </th>
              <th
                className="p-2 cursor-pointer relative"
                onClick={() => handleSortChange("timezone")}
              >
                <div className="flex flex-col">
                  <span className="mb-1">
                    Timezone{getSortIndicator("timezone")}
                  </span>
                  <input
                    type="text"
                    value={timezoneFilter}
                    onChange={(e) => setTimezoneFilter(e.target.value)}
                    placeholder="Filter"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm font-normal focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transformedCities.map((city, index) => (
              <CityRow
                ref={
                  index + 1 === transformedCities.length
                    ? lastCityElementRef
                    : null
                }
                key={city.id + city.name + city.country}
                city={city}
              />
            ))}
          </tbody>
        </table>
      </div>
      {loading && <p>Loading more cities...</p>}
    </div>
  );
};
