"use client";

import { useState, useEffect, useMemo } from "react";
import { FlightOffer, FilterOptions } from "../types/flight";
import { ChevronDown } from "lucide-react";

interface FilterPanelProps {
  flights: FlightOffer[];
  onFilterChange: (filters: FilterOptions) => void;
}

export default function FilterPanel({
  flights,
  onFilterChange,
}: FilterPanelProps) {
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [departureTimeRange, setDepartureTimeRange] = useState<
    [number, number] | undefined
  >(undefined);

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["price"]),
  );

  const airlines = useMemo(() => {
    const airlineSet = new Set<string>();
    flights.forEach((flight) => {
      flight.validatingAirlineCodes.forEach((code) => airlineSet.add(code));
    });
    return Array.from(airlineSet).sort();
  }, [flights]);

  const priceRange = useMemo(() => {
    if (flights.length === 0) return { min: 0, max: 1000 };
    const prices = flights.map((f) => parseFloat(f.price.total));
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [flights]);

  useEffect(() => {
    onFilterChange({
      maxPrice,
      airlines: selectedAirlines.length > 0 ? selectedAirlines : undefined,
      departureTime: departureTimeRange,
    });
  }, [maxPrice, selectedAirlines, departureTimeRange, onFilterChange]);

  const handleAirlineToggle = (airline: string) => {
    setSelectedAirlines((prev) =>
      prev.includes(airline)
        ? prev.filter((a) => a !== airline)
        : [...prev, airline],
    );
  };

  const handleReset = () => {
    setMaxPrice(undefined);
    setSelectedAirlines([]);
    setDepartureTimeRange(undefined);
  };

  const toggleSection = (section: string) => {
    const newSections = new Set(expandedSections);
    if (newSections.has(section)) {
      newSections.delete(section);
    } else {
      newSections.add(section);
    }
    setExpandedSections(newSections);
  };

  const timeSlots = [
    { label: "Morning (6AM-12PM)", value: [6, 12] },
    { label: "Afternoon (12PM-6PM)", value: [12, 18] },
    { label: "Evening (6PM-12AM)", value: [18, 24] },
    { label: "Night (12AM-6AM)", value: [0, 6] },
  ];

  // Active filters count
  const activeFiltersCount = [
    maxPrice ? 1 : 0,
    selectedAirlines.length > 0 ? 1 : 0,
    departureTimeRange ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg sticky top-4 md:sticky md:top-4">
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">
            Filters
          </h2>
          {activeFiltersCount > 0 && (
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-xs font-bold">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <button
          onClick={handleReset}
          className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Reset
        </button>
      </div>

      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-gray-50 transition"
        >
          <label className="text-sm md:text-base font-semibold text-gray-700">
            Max Price
          </label>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              expandedSections.has("price") ? "rotate-180" : ""
            }`}
          />
        </button>
        {expandedSections.has("price") && (
          <div className="px-4 md:px-6 pb-4 md:pb-6">
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={maxPrice || priceRange.max}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between mt-3 text-xs md:text-sm text-gray-600">
              <span>${priceRange.min}</span>
              <span className="font-semibold text-blue-600">
                ${maxPrice || priceRange.max}
              </span>
              <span>${priceRange.max}</span>
            </div>
          </div>
        )}
      </div>
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("airlines")}
          className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-gray-50 transition"
        >
          <label className="text-sm md:text-base font-semibold text-gray-700">
            Airlines{" "}
            {selectedAirlines.length > 0 && `(${selectedAirlines.length})`}
          </label>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              expandedSections.has("airlines") ? "rotate-180" : ""
            }`}
          />
        </button>
        {expandedSections.has("airlines") && (
          <div className="px-4 md:px-6 pb-4 md:pb-6 space-y-2 max-h-48 md:max-h-64 overflow-y-auto">
            {airlines.length === 0 ? (
              <p className="text-sm text-gray-500">No airlines available</p>
            ) : (
              airlines.map((airline) => (
                <label
                  key={airline}
                  className="flex items-center cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedAirlines.includes(airline)}
                    onChange={() => handleAirlineToggle(airline)}
                    className="mr-3 w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {airline}
                  </span>
                </label>
              ))
            )}
          </div>
        )}
      </div>
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("time")}
          className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-gray-50 transition"
        >
          <label className="text-sm md:text-base font-semibold text-gray-700">
            Departure Time
          </label>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              expandedSections.has("time") ? "rotate-180" : ""
            }`}
          />
        </button>
        {expandedSections.has("time") && (
          <div className="px-4 md:px-6 pb-4 md:pb-6 space-y-2">
            {timeSlots.map((slot, index) => (
              <label
                key={index}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="radio"
                  name="departureTime"
                  checked={
                    departureTimeRange?.[0] === slot.value[0] &&
                    departureTimeRange?.[1] === slot.value[1]
                  }
                  onChange={() =>
                    setDepartureTimeRange(slot.value as [number, number])
                  }
                  className="mr-3 w-4 h-4 text-blue-600 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {slot.label}
                </span>
              </label>
            ))}
            <label className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="departureTime"
                checked={departureTimeRange === undefined}
                onChange={() => setDepartureTimeRange(undefined)}
                className="mr-3 w-4 h-4 text-blue-600 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                Any time
              </span>
            </label>
          </div>
        )}
      </div>

      {activeFiltersCount > 0 && (
        <div className="p-4 md:p-6 bg-blue-50">
          <div className="text-xs md:text-sm font-semibold text-gray-700 mb-2">
            Applied:
          </div>
          <div className="flex flex-wrap gap-2">
            {maxPrice && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Max ${maxPrice}
              </span>
            )}
            {selectedAirlines.length > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {selectedAirlines.length} airline
                {selectedAirlines.length > 1 ? "s" : ""}
              </span>
            )}
            {departureTimeRange && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Time set
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
