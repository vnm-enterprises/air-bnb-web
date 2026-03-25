import {
  createPaymentIntent,
  createStripePaymentIntent,
  getPaymentGatewayConfig,
  getPaymentStatus,
  markPaymentComplete,
  type PaymentGatewayConfigResponse,
  type PaymentIntentResponse,
  type PaymentResponse,
} from "@/lib/paymentApi";

export {
  markPaymentComplete,
  getPaymentStatus,
  createPaymentIntent,
  createStripePaymentIntent,
  getPaymentGatewayConfig,
};

export type { PaymentResponse, PaymentIntentResponse, PaymentGatewayConfigResponse };

export const paymentService = {
  markPaymentComplete,
  getPaymentStatus,
  createPaymentIntent,
  createStripePaymentIntent,
  getPaymentGatewayConfig,
};
