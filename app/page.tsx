"use client";

import { useState, useCallback, useMemo } from "react";
import {
  SearchParams,
  FlightOffer,
  FilterOptions,
  FlightSearchResponse,
} from "./types/flight";
import SearchForm from "./components/SearchForm";
import FlightResults from "./components/FlightResults";
import FilterPanel from "./components/FilterPanel";
import PriceGraph from "./components/PriceGraph";
import axios from "axios";
import { Search } from "lucide-react";

export default function Home() {
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [responseData, setResponseData] = useState<FlightSearchResponse | null>(
    null,
  );

  const filteredFlights = useMemo(() => {
    let result = [...flights];

    if (filters.maxPrice !== undefined) {
      result = result.filter((flight) => {
        const price = parseFloat(flight.price.total);
        return price <= filters.maxPrice!;
      });
    }

    if (filters.airlines && filters.airlines.length > 0) {
      result = result.filter((flight) =>
        flight.validatingAirlineCodes.some((code) =>
          filters.airlines!.includes(code),
        ),
      );
    }

    if (filters.departureTime) {
      result = result.filter((flight) => {
        const departureTime = new Date(
          flight.itineraries[0].segments[0].departure.at,
        );
        const hour = departureTime.getHours();
        return (
          hour >= filters.departureTime![0] && hour < filters.departureTime![1]
        );
      });
    }

    return result;
  }, [flights, filters]);

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    setSearchPerformed(true);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("origin", params.originLocationCode);
      queryParams.append("destination", params.destinationLocationCode);
      queryParams.append("departureDate", params.departureDate);
      queryParams.append("returnDate", params.returnDate || "");
      queryParams.append("adults", String(params.adults));
      queryParams.append("children", String(params.children));
      queryParams.append("infants", String(params.infants));
      queryParams.append("travelClass", params.travelClass || "");
      queryParams.append("nonStop", String(params.nonStop));
      queryParams.append("currency", params.currencyCode || "");
      queryParams.append("maxPrice", String(params.maxPrice));

      const response = await axios.get(`/api/search?${queryParams.toString()}`);

      if (response.data.data) {
        setFlights(response.data.data);
        setResponseData(response.data);
      } else {
        setError("No flights found for your search criteria");
        setFlights([]);
      }
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Failed to search flights. Please try again.";
      setError(errorMessage);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      <header
        style={{
          backgroundImage: "url('/images/flight.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative text-white shadow-lg overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-r from-indigo-950 via-blue-600/70  to-blue-900/65"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Flight Search</h1>
          <p className="text-blue-100 text-lg">
            Find and book the best flights for your journey
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4 md:p-6 flex items-start gap-3">
            <svg
              className="w-6 h-6 text-red-600 shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-red-800 font-semibold">Search Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {searchPerformed && (
          <>
            {flights.length > 0 && (
              <div className="mb-8">
                <PriceGraph flights={flights} filteredFlights={filteredFlights} />
              </div>
            )}

            {flights.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <aside className="lg:col-span-1">
                  <FilterPanel
                    flights={flights}
                    onFilterChange={handleFilterChange}
                  />
                </aside>

                <section className="lg:col-span-3">
                  <FlightResults
                    flights={filteredFlights}
                    loading={loading}
                    totalResults={flights.length}
                    filteredResults={filteredFlights.length}
                    carriers={responseData?.dictionaries?.carriers || {}}
                    aircraft={responseData?.dictionaries?.aircraft || {}}
                  />
                </section>
              </div>
            ) : (
              <FlightResults
                flights={filteredFlights}
                loading={loading}
                totalResults={flights.length}
                filteredResults={filteredFlights.length}
                carriers={responseData?.dictionaries?.carriers || {}}
                aircraft={responseData?.dictionaries?.aircraft || {}}
              />
            )}
          </>
        )}

      
        {!searchPerformed && !loading && (
          <div className="p-12 md:p-16 text-center">
            <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Ready to search?
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              Fill in your travel details above and press search to find the
              best flights
            </p>
            <p className="text-gray-500 text-sm">
              We&apos;ll help you compare prices, schedules, and airlines to
              find your perfect flight
            </p>
          </div>
        )}
      </div>



      {/* Footer */}
      <footer className="bg-indigo-950 text-gray-300 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">About</h3>
              <p className="text-sm">
                Your trusted flight search engine for finding the best deals on
                airfare.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Features</h3>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Advanced Filters
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Best Price Guarantee
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    24/7 Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <p className="text-sm">
                support@flightsearch.com
                <br />
                +1 (555) 123-4567
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Flight Search. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
