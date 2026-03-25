import {
  submitSupportRequest,
  type SupportRequestPayload,
  type SupportRequestResult,
} from "@/lib/supportApi";

export { submitSupportRequest };

export type { SupportRequestPayload, SupportRequestResult };

export const supportService = {
  submitSupportRequest,
};
