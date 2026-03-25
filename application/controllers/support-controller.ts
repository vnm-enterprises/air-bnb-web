import { isValidEmail } from "./validation";
import type { SupportRequestPayload } from "@/infrastructure/services/support-service";

export type SupportBanner = {
  type: "success" | "error";
  message: string;
} | null;

export function normalizeSupportPayload(payload: SupportRequestPayload): SupportRequestPayload {
  return {
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    subject: payload.subject.trim(),
    message: payload.message.trim(),
  };
}

export function validateSupportPayload(payload: SupportRequestPayload): string {
  if (!payload.name || !payload.email || !payload.subject || !payload.message) {
    return "Please complete all required fields.";
  }

  if (!isValidEmail(payload.email)) {
    return "Please enter a valid email address.";
  }

  return "";
}
