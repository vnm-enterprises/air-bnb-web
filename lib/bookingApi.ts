import api from './axios';

export interface Booking {
  id: number;
  property_id: number;
  user_id: number;
  traveler_id?: number;
  traveler_name?: string;
  check_in: string;
  check_out: string;
  guests: number;
  guest_count?: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status?: string;
  created_at: string;
  updated_at: string;
  property?: {
    title: string;
    location: string;
    image: string;
  };
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data: Booking;
}

export interface CreateBookingResponse {
  success: boolean;
  message: string;
  data: {
    booking_id: number;
  };
}

export interface BookingsPagination {
  total: number;
  pages: number;
  current: number;
}

export interface BookingsResponse {
  success: boolean;
  message: string;
  data: {
    bookings: number[];
    pagination: BookingsPagination;
  };
}

export interface DeleteBookingResponse {
  success: boolean;
  message?: string;
}

/**
 * Fetch all bookings (admin only)
 */
export async function getAllBookings(params?: {
  page?: number;
  per_page?: number;
  status?: string;
}): Promise<BookingsResponse> {
  try {
    const response = await api.get<BookingsResponse>('/api/v1/bookings', {
      params: params || {},
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
}

/**
 * Fetch current user's bookings (traveler)
 */
export async function getUserBookings(params?: {
  page?: number;
  per_page?: number;
  status?: string;
}): Promise<BookingsResponse> {
  try {
    const response = await api.get<BookingsResponse>('/api/v1/users/me/bookings', {
      params: params || {},
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
}

/**
 * Fetch host's bookings (host only)
 */
export async function getHostBookings(params?: {
  page?: number;
  per_page?: number;
  status?: string;
}): Promise<BookingsResponse> {
  try {
    const response = await api.get<BookingsResponse>('/api/v1/host/bookings', {
      params: params || {},
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching host bookings:', error);
    throw error;
  }
}

/**
 * Fetch a single booking by ID
 */
export async function getBookingById(id: number): Promise<BookingResponse> {
  try {
    const response = await api.get<BookingResponse>(`/api/v1/bookings/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Create a new booking
 */
export async function createBooking(data: {
  property_id: number;
  check_in: string;
  check_out: string;
  guest_count?: number;
  guests?: number;
}): Promise<CreateBookingResponse> {
  try {
    const response = await api.post<CreateBookingResponse>('/api/v1/bookings', {
      property_id: data.property_id,
      check_in: data.check_in,
      check_out: data.check_out,
      guest_count: data.guest_count ?? data.guests ?? 1,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Update a booking
 */
export async function updateBooking(
  id: number,
  data: Partial<Booking>
): Promise<BookingResponse> {
  try {
    const response = await api.put<BookingResponse>(`/api/v1/bookings/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating booking ${id}:`, error);
    throw error;
  }
}

/**
 * Confirm a pending booking
 */
export async function confirmBooking(id: number): Promise<BookingResponse> {
  try {
    const response = await api.post<BookingResponse>(`/api/v1/bookings/${id}/approved`);
    return response.data;
  } catch (error) {
    console.error(`Error confirming booking ${id}:`, error);
    throw error;
  }
}

/**
 * Cancel a booking (traveler only)
 */
export async function cancelBooking(id: number): Promise<BookingResponse> {
  try {
    const response = await api.post<BookingResponse>(`/api/v1/bookings/${id}/cancelled`);
    return response.data;
  } catch (error) {
    console.error(`Error cancelling booking ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a booking
 */
export async function deleteBooking(id: number): Promise<DeleteBookingResponse> {
  try {
    const response = await api.delete<DeleteBookingResponse>(`/api/v1/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting booking ${id}:`, error);
    throw error;
  }
}
