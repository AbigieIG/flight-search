"use client";

import { useState } from "react";
import { SearchParams } from "../types/flight";
import { searchAirports, type Airport } from "../utils/airports";
import {
  ChevronDown,
  Plane,
  Users,
  DollarSign,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  loading: boolean;
}

export default function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [formData, setFormData] = useState<SearchParams>({
    originLocationCode: "",
    destinationLocationCode: "",
    departureDate: "",
    returnDate: "",
    adults: 1,
    children: 0,
    infants: 0,
    travelClass: "ECONOMY",
    nonStop: false,
    currencyCode: "USD",
    maxPrice: 1000,
    max: 50,
  });

  const [tripType, setTripType] = useState<"roundTrip" | "oneWay">("roundTrip");
  const [originSuggestions, setOriginSuggestions] = useState<Airport[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<
    Airport[]
  >([]);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [showPassengers, setShowPassengers] = useState(false);
  const [showCabin, setShowCabin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = { ...formData };
    if (tripType === "oneWay") {
      delete params.returnDate;
    }
    onSearch(params);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? parseInt(value) || 0
            : value,
    }));
  };

  const handleOriginChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      originLocationCode: value,
    }));

    if (value && value.trim().length > 0) {
      try {
        const results = await searchAirports(value, 8);
        setOriginSuggestions(results);
        setShowOriginDropdown(results.length > 0);
      } catch (error) {
        console.error("Error searching airports:", error);
        setOriginSuggestions([]);
        setShowOriginDropdown(false);
      }
    } else {
      setOriginSuggestions([]);
      setShowOriginDropdown(false);
    }
  };

  const handleDestinationChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      destinationLocationCode: value,
    }));

    if (value && value.trim().length > 0) {
      try {
        const results = await searchAirports(value, 8);
        setDestinationSuggestions(results);
        setShowDestinationDropdown(results.length > 0);
      } catch (error) {
        console.error("Error searching airports:", error);
        setDestinationSuggestions([]);
        setShowDestinationDropdown(false);
      }
    } else {
      setDestinationSuggestions([]);
      setShowDestinationDropdown(false);
    }
  };

  const selectAirport = (airport: Airport, type: "origin" | "destination") => {
    if (type === "origin") {
      setFormData((prev) => ({
        ...prev,
        originLocationCode: airport.iata,
      }));
      setShowOriginDropdown(false);
      setOriginSuggestions([]);
    } else {
      setFormData((prev) => ({
        ...prev,
        destinationLocationCode: airport.iata,
      }));
      setShowDestinationDropdown(false);
      setDestinationSuggestions([]);
    }
  };

  const cabinOptions = [
    { value: "ECONOMY", label: "Economy" },
    { value: "PREMIUM_ECONOMY", label: "Premium Economy" },
    { value: "BUSINESS", label: "Business" },
    { value: "FIRST", label: "First Class" },
  ];

  const tripTypeOptions = [
    { value: "roundTrip", label: "Round trip" },
    { value: "oneWay", label: "One way" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 max-w-7xl mx-auto"
    >
      {/* Trip Type & Passengers Row */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Trip Type Pills */}
        <div className="flex bg-gray-100 rounded-full p-1">
          {tripTypeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                setTripType(option.value as "roundTrip" | "oneWay")
              }
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                tripType === option.value
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Passengers Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPassengers(!showPassengers)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          >
            <Users className="w-4 h-4" />
            <span>
              {formData.adults +
                (formData.children || 0) +
                (formData.infants || 0)}{" "}
              {formData.adults +
                (formData.children || 0) +
                (formData.infants || 0) ===
              1
                ? "passenger"
                : "passengers"}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showPassengers ? "rotate-180" : ""}`}
            />
          </button>

          {showPassengers && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowPassengers(false)}
              />
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-6 w-80">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Adults</p>
                      <p className="text-xs text-gray-500">Age 12+</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            adults: Math.max(1, prev.adults - 1),
                          }))
                        }
                        disabled={formData.adults <= 1}
                        className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-medium text-gray-900">
                        {formData.adults}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            adults: Math.min(9, prev.adults + 1),
                          }))
                        }
                        disabled={formData.adults >= 9}
                        className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">Children</p>
                      <p className="text-xs text-gray-500">Age 2–11</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            children: Math.max(0, (prev.children || 0) - 1),
                          }))
                        }
                        disabled={(formData.children || 0) <= 0}
                        className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-medium text-gray-900">
                        {formData.children || 0}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            children: Math.min(9, (prev.children || 0) + 1),
                          }))
                        }
                        disabled={(formData.children || 0) >= 9}
                        className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">Infants</p>
                      <p className="text-xs text-gray-500">Under 2</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            infants: Math.max(0, (prev.infants || 0) - 1),
                          }))
                        }
                        disabled={(formData.infants || 0) <= 0}
                        className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-medium text-gray-900">
                        {formData.infants || 0}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            infants: Math.min(9, (prev.infants || 0) + 1),
                          }))
                        }
                        disabled={(formData.infants || 0) >= 9}
                        className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCabin(!showCabin)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          >
            <span className="flex items-center gap-2">
              <ChartNoAxesColumnIncreasing className="w-4 h-4" />
              {
                cabinOptions.find((c) => c.value === formData.travelClass)
                  ?.label
              }
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showCabin ? "rotate-180" : ""}`}
            />
          </button>

          {showCabin && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowCabin(false)}
              />
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 min-w-56 overflow-hidden">
                {cabinOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        travelClass: option.value as never,
                      }));
                      setShowCabin(false);
                    }}
                    className={`w-full text-left px-6 py-3.5 text-sm transition-colors ${
                      formData.travelClass === option.value
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-300">
          <div className={`relative ${showOriginDropdown ? "z-50" : "z-30"}`}>
            <div className="px-5 py-4">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                From
              </label>
              <input
                type="text"
                value={formData.originLocationCode}
                onChange={handleOriginChange}
                onFocus={() => setShowOriginDropdown(true)}
                placeholder="Airport code"
                className="w-full text-base font-medium text-gray-900 placeholder-gray-400 outline-none bg-transparent"
                required
              />
            </div>
            {showOriginDropdown && originSuggestions.length > 0 && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowOriginDropdown(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 max-h-72 overflow-y-auto">
                  {originSuggestions.map((airport, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectAirport(airport, "origin")}
                      className="w-full text-left px-5 py-3.5 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {airport.iata}
                          </div>
                          <div className="text-sm text-gray-600 mt-0.5">
                            {airport.name}
                          </div>
                        </div>
                        <Plane className="w-4 h-4 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="relative z-30">
            <div className="px-5 py-4">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                To
              </label>
              <input
                type="text"
                value={formData.destinationLocationCode}
                onChange={handleDestinationChange}
                onFocus={() => setShowDestinationDropdown(true)}
                placeholder="Airport code"
                className="w-full text-base font-medium text-gray-900 placeholder-gray-400 outline-none bg-transparent"
                required
              />
            </div>
            {showDestinationDropdown && destinationSuggestions.length > 0 && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDestinationDropdown(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 max-h-72 overflow-y-auto">
                  {destinationSuggestions.map((airport, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectAirport(airport, "destination")}
                      className="w-full text-left px-5 py-3.5 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {airport.iata}
                          </div>
                          <div className="text-sm text-gray-600 mt-0.5">
                            {airport.name}
                          </div>
                        </div>
                        <Plane className="w-4 h-4 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="px-5 py-4">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Depart
            </label>
            <div className="relative">
              <input
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full text-base font-medium text-gray-900 outline-none bg-transparent cursor-pointer"
                required
              />
            </div>
          </div>

          {/* Return Date */}
          <div className="px-5 py-4">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Return
            </label>
            <div className="relative">
              {tripType === "roundTrip" ? (
                <input
                  type="date"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleChange}
                  min={
                    formData.departureDate ||
                    new Date().toISOString().split("T")[0]
                  }
                  className="w-full text-base font-medium text-gray-900 outline-none bg-transparent cursor-pointer"
                  required
                />
              ) : (
                <div className="text-base font-medium text-gray-400">
                  One way
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-6">
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              name="nonStop"
              checked={formData.nonStop}
              onChange={handleChange}
              className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-colors"
            />
          </div>
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
            Nonstop only
          </span>
        </label>

        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
          <DollarSign className="w-4 h-4 text-gray-500" />
          <input
            type="number"
            name="maxPrice"
            value={formData.maxPrice}
            onChange={handleChange}
            min="0"
            placeholder="Max price"
            className="w-24 text-sm font-medium text-gray-900 bg-transparent outline-none placeholder-gray-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-3 text-base"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin w-5 h-5"
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
            Searching flights...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Search
          </>
        )}
      </button>
    </form>
  );
}
