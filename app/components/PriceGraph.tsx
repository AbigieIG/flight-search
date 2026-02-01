"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FlightOffer } from "../types/flight";

interface PriceGraphProps {
  flights: FlightOffer[];
  filteredFlights: FlightOffer[];
}

export default function PriceGraph({
  flights,
  filteredFlights,
}: PriceGraphProps) {
  const priceDistributionData = useMemo(() => {
    if (filteredFlights.length === 0) return [];

    const prices = filteredFlights.map((f) => parseFloat(f.price.total));
    const minPrice = Math.floor(Math.min(...prices) / 100) * 100;
    const maxPrice = Math.ceil(Math.max(...prices) / 100) * 100;
    const bucketSize = Math.max(100, Math.floor((maxPrice - minPrice) / 10));

    const buckets: Record<string, number> = {};

    for (let price = minPrice; price <= maxPrice; price += bucketSize) {
      const bucketLabel = `$${price}-${price + bucketSize}`;
      buckets[bucketLabel] = 0;
    }

    prices.forEach((price) => {
      const bucket = Math.floor((price - minPrice) / bucketSize);
      const bucketLabel = `$${minPrice + bucket * bucketSize}-${minPrice + (bucket + 1) * bucketSize}`;
      if (buckets[bucketLabel] !== undefined) {
        buckets[bucketLabel] += 1;
      }
    });

    return Object.entries(buckets).map(([range, count]) => ({
      range,
      count,
    }));
  }, [filteredFlights]);

  if (flights.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-6">
        Price Distribution
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={priceDistributionData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="range"
            tick={{ fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
            formatter={(value) => `${value} flights`}
          />
          <Bar
            dataKey="count"
            fill="#3b82f6"
            radius={[8, 8, 0, 0]}
            animationDuration={300}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
