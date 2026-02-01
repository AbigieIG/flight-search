import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';


const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY || '';
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET || '';
const AMADEUS_AUTH_URL = 'https://test.api.amadeus.com/v1/security/oauth2/token';
const AMADEUS_FLIGHT_URL = 'https://test.api.amadeus.com/v2/shopping/flight-offers';


let cachedToken: { access_token: string; expires_at: number } | null = null;

async function getAccessToken(): Promise<string> {

  if (cachedToken && cachedToken.expires_at > Date.now()) {
    return cachedToken.access_token;
  }

  try {
    const response = await axios.post(
      AMADEUS_AUTH_URL,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: AMADEUS_API_KEY,
        client_secret: AMADEUS_API_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, expires_in } = response.data;
    

    cachedToken = {
      access_token,
      expires_at: Date.now() + (expires_in - 300) * 1000,
    };

    return access_token;
  } catch (error) {
    console.error('Error getting Amadeus access token:', error);
    throw new Error('Failed to authenticate with Amadeus API');
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = {
      origin: url.searchParams.get('origin'),
      destination: url.searchParams.get('destination'),
      departureDate: url.searchParams.get('departureDate'),
      returnDate: url.searchParams.get('returnDate'),
      adults: url.searchParams.get('adults'),
      children: url.searchParams.get('children'),
      infants: url.searchParams.get('infants'),
      travelClass: url.searchParams.get('travelClass'),
      nonStop: url.searchParams.get('nonStop'),
      currency: url.searchParams.get('currency'),
      maxPrice: url.searchParams.get('maxPrice'),
    };

    if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
      return NextResponse.json(
        { error: 'Missing required parameters: origin, destination, or departure date' },
        { status: 400 }
      );
    }

   
    const accessToken = await getAccessToken();

    
    const queryParams: Record<string, string> = {
      originLocationCode: searchParams.origin,
      destinationLocationCode: searchParams.destination,
      departureDate: searchParams.departureDate,
      adults: String(searchParams.adults || 1),
      currencyCode: searchParams.currency || 'USD',
      max: '50',
    };


    if (searchParams.returnDate) {
      queryParams.returnDate = searchParams.returnDate;
    }
    if (searchParams?.children !== undefined && Number(searchParams.children) > 0) {
      queryParams.children = String(searchParams.children);
    }
    if (searchParams?.infants !== undefined && Number(searchParams.infants) > 0) {
      queryParams.infants = String(searchParams.infants);
    }
    if (searchParams.travelClass) {
      queryParams.travelClass = searchParams.travelClass;
    }
    if (searchParams.nonStop) {
      queryParams.nonStop = 'true';
    }
    if (searchParams.maxPrice) {
      queryParams.maxPrice = String(searchParams.maxPrice);
    }

    
    const response = await axios.get(AMADEUS_FLIGHT_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: queryParams,
    });

    return NextResponse.json(response.data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error searching flights:', error.response?.data || error.message);
    
   
    if (error.response?.status === 400) {
      return NextResponse.json(
        { error: 'Invalid search parameters', details: error.response.data },
        { status: 400 }
      );
    }
    
    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'Authentication failed with Amadeus API' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to search flights', message: error.message },
      { status: 500 }
    );
  }
}