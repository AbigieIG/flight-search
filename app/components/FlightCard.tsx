"use client";

import { useState } from "react";
import { FlightOffer, Segment } from "../types/flight";
import {
  parseDuration,
  formatTime,
  formatDate,
  calculateStops,
  formatPrice,
  getAirlineNames,
} from "../utils/flightUtils";
import { Plane, Clock, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

interface FlightCardProps {
  flight: FlightOffer;
  carriers: Record<string, string>;
  aircraft: Record<string, string>;
}

export default function FlightCard({
  flight,
  carriers,
  aircraft,
}: FlightCardProps) {
  const [expanded, setExpanded] = useState(false);
  const price = parseFloat(flight.price.total);

  const renderSegment = (
    segment: Segment,
    index: number,
    isReturn: boolean = false,
  ) => {
    const departureTime = formatTime(segment.departure.at);
    const arrivalTime = formatTime(segment.arrival.at);
    const departureDate = formatDate(segment.departure.at);
    const arrivalDate = formatDate(segment.arrival.at);
    const duration = parseDuration(segment.duration);
    const airlineName = carriers[segment.carrierCode] || segment.carrierCode;
    const aircraftName =
      aircraft[segment.aircraft.code] || segment.aircraft.code;

    return (
      <div
        key={segment.id}
        className="py-3 border-b border-gray-200 last:border-b-0"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Plane className="w-4 h-4 text-slate-700" />
              <span className="font-medium text-gray-900">{airlineName}</span>
              <span className="text-sm text-gray-500">
                {segment.carrierCode} {segment.number}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 items-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {departureTime}
                </div>
                <div className="text-sm text-gray-600">
                  {segment.departure.iataCode}
                </div>
                <div className="text-xs text-gray-500">{departureDate}</div>
                {segment.departure.terminal && (
                  <div className="text-xs text-gray-500">
                    Terminal {segment.departure.terminal}
                  </div>
                )}
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="h-px bg-gray-300 flex-1"></div>
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div className="h-px bg-gray-300 flex-1"></div>
                </div>
                <div className="text-sm text-gray-600">{duration}</div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {arrivalTime}
                </div>
                <div className="text-sm text-gray-600">
                  {segment.arrival.iataCode}
                </div>
                <div className="text-xs text-gray-500">{arrivalDate}</div>
                {segment.arrival.terminal && (
                  <div className="text-xs text-gray-500">
                    Terminal {segment.arrival.terminal}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-500">
              Aircraft: {aircraftName}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const outbound = flight.itineraries[0];
  const firstSegment = outbound.segments[0];
  const lastSegment = outbound.segments[outbound.segments.length - 1];
  const stops = calculateStops(outbound.segments);

  const returnItinerary = flight.itineraries[1];

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-slate-700">
                {getAirlineNames(flight.validatingAirlineCodes, carriers)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-4 items-center">
              <div>
                <div className="text-xl md:text-2xl font-bold text-gray-900">
                  {formatTime(firstSegment.departure.at)}
                </div>
                <div className="text-sm text-gray-600">
                  {firstSegment.departure.iataCode}
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="h-px bg-slate-300 flex-1"></div>
                  <Plane className="w-4 h-4 text-slate-400 transform rotate-90" />
                  <div className="h-px bg-slate-300 flex-1"></div>
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  {parseDuration(outbound.duration)}
                </div>
                <div className="text-xs text-gray-500">
                  {stops === 0
                    ? "Nonstop"
                    : `${stops} ${stops === 1 ? "stop" : "stops"}`}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl md:text-2xl font-bold text-gray-900">
                  {formatTime(lastSegment.arrival.at)}
                </div>
                <div className="text-sm text-gray-600">
                  {lastSegment.arrival.iataCode}
                </div>
              </div>
            </div>

            {returnItinerary && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-2 md:gap-4 items-center">
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-gray-900">
                      {formatTime(returnItinerary.segments[0].departure.at)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {returnItinerary.segments[0].departure.iataCode}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <div className="h-px bg-slate-300 flex-1"></div>
                      <Plane className="w-4 h-4 text-slate-400 transform -rotate-90" />
                      <div className="h-px bg-slate-300 flex-1"></div>
                    </div>
                    <div className="text-xs md:text-sm text-gray-600">
                      {parseDuration(returnItinerary.duration)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {calculateStops(returnItinerary.segments) === 0
                        ? "Nonstop"
                        : `${calculateStops(returnItinerary.segments)} ${
                            calculateStops(returnItinerary.segments) === 1
                              ? "stop"
                              : "stops"
                          }`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl md:text-2xl font-bold text-gray-900">
                      {formatTime(
                        returnItinerary.segments[
                          returnItinerary.segments.length - 1
                        ].arrival.at,
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {
                        returnItinerary.segments[
                          returnItinerary.segments.length - 1
                        ].arrival.iataCode
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2 border-t border-gray-200 md:border-t-0 md:border-l md:pl-6 pt-4 md:pt-0">
            <div className="flex-1 md:flex-none text-center md:text-right">
              <div className="text-2xl md:text-3xl font-bold text-slate-700">
                {formatPrice(price, flight.price.currency)}
              </div>
              <div
                className={`text-xs font-medium ${
                  flight.numberOfBookableSeats <= 2
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                {flight.numberOfBookableSeats} seat
                {flight.numberOfBookableSeats !== 1 ? "s" : ""} left
              </div>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
            >
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="bg-gray-50 p-4 md:p-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Flight Details</h3>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <ArrowRight className="w-5 h-5 text-red-600" />
              <h4 className="font-medium text-gray-900">
                Outbound: {firstSegment.departure.iataCode} →{" "}
                {lastSegment.arrival.iataCode}
              </h4>
            </div>
            <div className="bg-white rounded-lg p-4">
              {outbound.segments.map((segment, index) =>
                renderSegment(segment, index),
              )}
            </div>
          </div>

          {/* Return segments */}
          {returnItinerary && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ArrowRight className="w-5 h-5 text-red-600 transform rotate-180" />
                <h4 className="font-medium text-gray-900">
                  Return: {returnItinerary.segments[0].departure.iataCode} →{" "}
                  {
                    returnItinerary.segments[
                      returnItinerary.segments.length - 1
                    ].arrival.iataCode
                  }
                </h4>
              </div>
              <div className="bg-white rounded-lg p-4">
                {returnItinerary.segments.map((segment, index) =>
                  renderSegment(segment, index, true),
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
