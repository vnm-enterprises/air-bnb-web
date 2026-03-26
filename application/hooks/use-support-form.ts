"use client";

import { useMemo, useState } from "react";
import {
  normalizeSupportPayload,
  validateSupportPayload,
  type SupportBanner,
} from "@/application/controllers/support-controller";
import { supportService } from "@/infrastructure/services";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export function useSupportForm() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState<SupportBanner>(null);

  const quickTips = useMemo(
    () => [
      "Include booking ID for faster support.",
      "Describe the issue in one short paragraph.",
      "Attach dates and property details when possible.",
    ],
    []
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBanner(null);

    const payload = normalizeSupportPayload(form);
    const validationError = validateSupportPayload(payload);

    if (validationError) {
      setBanner({ type: "error", message: validationError });
      return;
    }

    setSubmitting(true);

    try {
      const result = await supportService.submitSupportRequest(payload);

      if (!result.success) {
        setBanner({ type: "error", message: result.message });
        return;
      }

      setBanner({ type: "success", message: result.message });
      setForm(initialForm);
    } catch {
      setBanner({
        type: "error",
        message: "Support service is currently unavailable. Please try again shortly.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    submitting,
    banner,
    quickTips,
    handleChange,
    handleSubmit,
  };
}
