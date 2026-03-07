import api from './axios';

export interface Booking {
  id: number;
  property_id: number;
  user_id: number;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
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

export interface BookingsResponse {
  success: boolean;
  message: string;
  data: Booking[];
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
    console.error(`Error fetching booking ${id}:`, error);
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
  guests: number;
}): Promise<BookingResponse> {
  try {
    const response = await api.post<BookingResponse>('/api/v1/bookings', data);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
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
    const response = await api.post<BookingResponse>(`/api/v1/bookings/${id}/confirm`);
    return response.data;
  } catch (error) {
    console.error(`Error confirming booking ${id}:`, error);
    throw error;
  }
}

/**
 * Cancel a booking
 */
export async function cancelBooking(
  id: number,
  reason?: string
): Promise<BookingResponse> {
  try {
    const response = await api.post<BookingResponse>(`/api/v1/bookings/${id}/cancel`, {
      reason: reason || '',
    });
    return response.data;
  } catch (error) {
    console.error(`Error cancelling booking ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a booking
 */
export async function deleteBooking(id: number): Promise<any> {
  try {
    const response = await api.delete(`/api/v1/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting booking ${id}:`, error);
    throw error;
  }
}
