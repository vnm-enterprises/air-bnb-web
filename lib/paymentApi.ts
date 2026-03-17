import api from './axios';

export interface PaymentResponse {
  success: boolean;
  message: string;
  data: {
    payment_status: string;
    booking_id?: number;
    payment_intent_id?: string | null;
    gateway?: string;
    gateway_status?: string | null;
  };
}

export interface PaymentIntentResponse {
  success: boolean;
  message: string;
  data: {
    client_secret: string | null;
    payment_intent_id: string | null;
    amount: number;
    amount_minor: number;
    currency: string;
    status: string;
    gateway_status?: string | null;
    gateway: string;
  };
}

export interface PaymentGatewayConfigResponse {
  success: boolean;
  message: string;
  data: {
    gateway: string;
    stripe_enabled: boolean;
    publishable_key: string | null;
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

/**
 * Create a payment intent using the active backend gateway.
 */
export async function createPaymentIntent(bookingId: number): Promise<PaymentIntentResponse> {
  try {
    const response = await api.post<PaymentIntentResponse>('/api/v1/payments/intent', {
      booking_id: bookingId,
    });
    return response.data;
  } catch (error) {
    console.error(`Error creating payment intent for booking ${bookingId}:`, error);
    throw error;
  }
}

/**
 * Create a Stripe payment intent explicitly.
 */
export async function createStripePaymentIntent(bookingId: number): Promise<PaymentIntentResponse> {
  try {
    const response = await api.post<PaymentIntentResponse>('/api/v1/payments/stripe/intent', {
      booking_id: bookingId,
    });
    return response.data;
  } catch (error) {
    console.error(`Error creating Stripe payment intent for booking ${bookingId}:`, error);
    throw error;
  }
}

/**
 * Get gateway configuration needed by the frontend payment flow.
 */
export async function getPaymentGatewayConfig(): Promise<PaymentGatewayConfigResponse> {
  try {
    const response = await api.get<PaymentGatewayConfigResponse>('/api/v1/payments/config');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment gateway config:', error);
    throw error;
  }
}
