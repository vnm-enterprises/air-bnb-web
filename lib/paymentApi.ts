import api from './axios';

export interface PaymentResponse {
  success: boolean;
  message: string;
  data: {
    payment_status: string;
    booking_id?: number;
  };
}

/**
 * Mark a booking's payment as completed (for testing/development)
 */
export async function markPaymentComplete(bookingId: number): Promise<PaymentResponse> {
  try {
    const response = await api.post<PaymentResponse>(`/api/v1/payments/${bookingId}/complete`);
    return response.data;
  } catch (error) {
    console.error(`Error marking payment complete for booking ${bookingId}:`, error);
    throw error;
  }
}

/**
 * Get payment status for a booking
 */
export async function getPaymentStatus(bookingId: number): Promise<PaymentResponse> {
  try {
    const response = await api.get<PaymentResponse>(`/api/v1/payments/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching payment status for booking ${bookingId}:`, error);
    throw error;
  }
}
