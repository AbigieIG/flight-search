import { FlightOffer, Segment } from "../types/flight";

export function parseDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?/);
  if (!match) return duration;

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;

  if (hours && minutes) {
    return `${hours}h ${minutes}m`;
  } else if (hours) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function calculateStops(segments: Segment[]): number {
  return Math.max(0, segments.length - 1);
}

export function getDepartureHour(segments: Segment[]): number {
  if (segments.length === 0) return 0;
  const date = new Date(segments[0].departure.at);
  return date.getHours();
}

export function getTimeOfDayLabel(hour: number): string {
  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Afternoon";
  if (hour >= 17 && hour < 21) return "Evening";
  return "Night";
}

export function formatPrice(price: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getAirlineNames(
  carrierCodes: string[],
  carriers: Record<string, string>,
): string {
  return carrierCodes.map((code) => carriers[code] || code).join(", ");
}

export function getUniqueAirlines(
  flights: FlightOffer[],
  carriers: Record<string, string>,
): { code: string; name: string; count: number }[] {
  const airlineMap = new Map<string, { name: string; count: number }>();

  flights.forEach((flight) => {
    flight.validatingAirlineCodes.forEach((code) => {
      const existing = airlineMap.get(code);
      if (existing) {
        existing.count++;
      } else {
        airlineMap.set(code, {
          name: carriers[code] || code,
          count: 1,
        });
      }
    });
  });

  return Array.from(airlineMap.entries())
    .map(([code, data]) => ({
      code,
      name: data.name,
      count: data.count,
    }))
    .sort((a, b) => b.count - a.count);
}

export function calculatePriceStats(flights: FlightOffer[]): {
  min: number;
  max: number;
  avg: number;
} {
  if (flights.length === 0) {
    return { min: 0, max: 0, avg: 0 };
  }

  const prices = flights.map((f) => parseFloat(f.price.total));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;

  return { min, max, avg };
}

export function groupFlightsByPriceRange(
  flights: FlightOffer[],
  bucketSize: number = 50,
): { price: number; count: number }[] {
  if (flights.length === 0) return [];

  const prices = flights.map((f) => parseFloat(f.price.total));
  const minPrice = Math.floor(Math.min(...prices) / bucketSize) * bucketSize;
  const maxPrice = Math.ceil(Math.max(...prices) / bucketSize) * bucketSize;

  const buckets = new Map<number, number>();

  for (let price = minPrice; price <= maxPrice; price += bucketSize) {
    buckets.set(price, 0);
  }

  flights.forEach((flight) => {
    const price = parseFloat(flight.price.total);
    const bucket = Math.floor(price / bucketSize) * bucketSize;
    buckets.set(bucket, (buckets.get(bucket) || 0) + 1);
  });

  return Array.from(buckets.entries())
    .map(([price, count]) => ({ price, count }))
    .sort((a, b) => a.price - b.price);
}

export function isValidIATACode(code: string): boolean {
  return /^[A-Z]{3}$/.test(code);
}

export function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getMinSearchDate(): string {
  return formatDateForInput(new Date());
}

export function getMaxSearchDate(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return formatDateForInput(date);
}
