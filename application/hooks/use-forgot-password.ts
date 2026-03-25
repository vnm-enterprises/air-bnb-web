"use client";

import { useState } from "react";
import { validateForgotPasswordEmail } from "@/application/controllers/auth-controller";
import { authService } from "@/infrastructure/services";

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    setError("");

    const validationError = validateForgotPasswordEmail(normalizedEmail);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const result = await authService.requestPasswordReset(normalizedEmail);

      if (!result.success) {
        setError(result.error || "Unable to send reset instructions right now.");
        return;
      }

      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setError("");
    setEmail("");
  };

  return {
    email,
    setEmail,
    loading,
    error,
    success,
    handleSubmit,
    resetForm,
  };
}
