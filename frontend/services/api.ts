import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

const api = axios.create({ baseURL: BASE });

// ── Places ──────────────────────────────────────────────────────────────────

export interface ApiPlace {
  id: string;
  city: string;
  name: string;
  location: string;
  category: string;
  description: string;
  emoji: string;
  rating: number;
  timings: string;
  ticketPrice: number;
  ticketPriceChild?: number;
  priceDetails: string;
  bookingLink?: string;
  officialInfoLink?: string;
  dishesToTry?: string[];
  bestTimeToVisit: string;
  nearestMetro?: string;
  highlights: string[];
}

export async function fetchPlaces(city: string, category?: string, search?: string): Promise<ApiPlace[]> {
  const params: Record<string, string> = { city };
  if (category && category !== 'all') params.category = category;
  if (search) params.search = search;
  const { data } = await api.get<ApiPlace[]>('/places', { params });
  return data;
}

export async function fetchPlace(id: string): Promise<ApiPlace> {
  const { data } = await api.get<ApiPlace>(`/places/${id}`);
  return data;
}

// ── Cities ───────────────────────────────────────────────────────────────────

export interface ApiCity {
  id: string;
  name: string;
  state: string;
  emoji: string;
  places: number;
  active: boolean;
}

export async function fetchCities(): Promise<ApiCity[]> {
  const { data } = await api.get<ApiCity[]>('/cities');
  return data;
}

// ── Legacy Booking API ─────────────────────────────────────────────────────────
// Direct booking is disabled in the current TourDesk flow. Use bookingLink from ApiPlace
// to redirect users to the official portal instead.


export interface BookingPayload {
  place_id: string;
  visit_date: string;   // YYYY-MM-DD
  adults: number;
  children: number;
  name: string;
  phone: string;
  email: string;
}

export interface BookingResult {
  id: string;
  place_name: string;
  city: string;
  visit_date: string;
  adults: number;
  children: number;
  total: number;
  is_free: boolean;
  booked_at: string;
}

export async function createBooking(payload: BookingPayload): Promise<BookingResult> {
  const { data } = await api.post<BookingResult>('/bookings', payload);
  return data;
}
