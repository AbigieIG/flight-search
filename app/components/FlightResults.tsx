"use client";

import { FlightOffer } from "../types/flight";
import FlightCard from "./FlightCard";

interface FlightResultsProps {
  flights: FlightOffer[];
  loading: boolean;
  totalResults: number;
  filteredResults: number;
  carriers?: Record<string, string>;
  aircraft?: Record<string, string>;
}

export default function FlightResults({
  flights,
  loading,
  totalResults,
  filteredResults,
  carriers = {},
  aircraft = {},
}: FlightResultsProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <svg
            className="animate-spin h-12 w-12 text-blue-600 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600 text-lg">Searching for flights...</p>
        </div>
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="p-12 text-center">
        <svg
          className="mx-auto h-16 w-16 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {filteredResults === 0 && totalResults === 0
            ? "No Flights Available"
            : "No Flights Match Your Filters"}
        </h3>
        <p className="text-gray-600">
          {filteredResults === 0 && totalResults === 0
            ? "No flights found for your search criteria. Try adjusting your dates or locations."
            : "Try adjusting your filters to see more results"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {filteredResults} {filteredResults === 1 ? "Flight" : "Flights"}{" "}
            Found
          </h3>
          {filteredResults !== totalResults && (
            <p className="text-sm text-gray-600">
              Filtered from {totalResults} total results
            </p>
          )}
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>
          <span>Sorted by: Best Value</span>
        </div>
      </div>

      <div className="space-y-4">
        {flights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            carriers={carriers}
            aircraft={aircraft}
          />
        ))}
      </div>
    </div>
  );
}
