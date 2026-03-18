import api from "./axios";

export interface SupportRequestPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SupportRequestResult {
  success: boolean;
  message: string;
}

const SUPPORT_ENDPOINT_CANDIDATES = [
  "/api/v1/support",
  "/api/v1/support/contact",
  "/api/v1/contact",
  "/api/v1/contact-us",
];

function getErrorStatus(error: unknown): number | null {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { status?: number } }).response;
    return typeof response?.status === "number" ? response.status : null;
  }

  return null;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    const apiMessage = response?.data?.message;

    if (typeof apiMessage === "string" && apiMessage.trim().length > 0) {
      return apiMessage;
    }
  }

  return fallback;
}

export async function submitSupportRequest(
  payload: SupportRequestPayload
): Promise<SupportRequestResult> {
  for (const endpoint of SUPPORT_ENDPOINT_CANDIDATES) {
    try {
      const response = await api.post(endpoint, payload);
      const message =
        response.data?.message ||
        "Your message has been sent. Our support team will contact you shortly.";

      return { success: true, message };
    } catch (error: unknown) {
      const status = getErrorStatus(error);

      if (status === 404 || status === 405) {
        continue;
      }

      return {
        success: false,
        message: getErrorMessage(
          error,
          "We could not send your message right now. Please try again."
        ),
      };
    }
  }

  return {
    success: false,
    message:
      "Support service is not available yet. Please contact support@propbnb.com directly.",
  };
}
