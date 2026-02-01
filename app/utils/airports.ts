export interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
}

let AIRPORT_DATABASE: Airport[] = [];
let isLoaded = false;
let loadingPromise: Promise<Airport[]> | null = null;

async function loadAirports(): Promise<Airport[]> {
  if (isLoaded && AIRPORT_DATABASE.length > 0) {
    return AIRPORT_DATABASE;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    try {
      const response = await fetch("/data/airports.json", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "force-cache",
      });

      if (!response.ok) {
        console.error("Failed to load airports data:", response.status);
        return [];
      }

      const data = await response.json();
      
      if (data && data.airports && Array.isArray(data.airports)) {
        AIRPORT_DATABASE = data.airports;
        isLoaded = true;
        return AIRPORT_DATABASE;
      } else {
        console.error("Invalid airports data format");
        return [];
      }
    } catch (error) {
      console.error("Error loading airports:", error);
      return [];
    } finally {
      loadingPromise = null;
    }
  })();

  return loadingPromise;
}

export function getPopularAirports(): Airport[] {
  return AIRPORT_DATABASE.slice(0, 12);
}

export async function searchAirports(
  query: string,
  limit: number = 10,
): Promise<Airport[]> {
  try {
    const airports = await loadAirports();

    if (!airports || airports.length === 0) {
      console.warn("No airports loaded");
      return [];
    }

    if (!query || query.trim().length < 1) {
      return airports.slice(0, limit);
    }

    const upperQuery = query.toUpperCase().trim();

    const filtered = airports.filter(
      (airport) =>
        airport.iata.toUpperCase().includes(upperQuery) ||
        airport.name.toUpperCase().includes(upperQuery) ||
        airport.city.toUpperCase().includes(upperQuery) ||
        airport.country.toUpperCase().includes(upperQuery) ||
        airport.countryCode.toUpperCase().includes(upperQuery),
    );

    return filtered.slice(0, limit);
  } catch (error) {
    console.error("Error searching airports:", error);
    return [];
  }
}

export async function getAirportByCode(
  code: string,
): Promise<Airport | undefined> {
  const airports = await loadAirports();
  return airports.find((a) => a.iata === code.toUpperCase());
}
