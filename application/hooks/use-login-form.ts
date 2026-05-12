"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { validateLoginForm } from "@/application/controllers/auth-form-controller";
import { authService } from "@/infrastructure/services";

export function useLoginForm() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const queryParams = useMemo(() => {
    if (typeof window === "undefined") {
      return new URLSearchParams();
    }

    return new URLSearchParams(window.location.search);
  }, []);

  const infoMessage = queryParams.get("message") || "";
  const emailFromQuery = queryParams.get("email") || "";
  const showResendVerification =
    infoMessage === "Please check your email to verify your account" && !!emailFromQuery;

  useEffect(() => {
    if (emailFromQuery && !email) {
      setEmail(emailFromQuery);
    }
  }, [emailFromQuery, email]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const redirect = queryParams.get("redirect") || "/properties";
    router.push(redirect);
  }, [isAuthenticated, queryParams, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    setError("");

    const validationError = validateLoginForm(normalizedEmail, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setResendMessage("");

    try {
      const result = await login(normalizedEmail, password);

      if (!result.success) {
        setError(result.message || "Unable to sign in right now. Please try again.");
        return;
      }

      const redirect = new URLSearchParams(window.location.search).get("redirect") || "/properties";
      router.push(redirect);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    setError("");
    setResendMessage("");

    if (!normalizedEmail) {
      setError("Enter your email address first.");
      return;
    }

    setResendLoading(true);

    try {
      const result = await authService.resendVerificationEmail(normalizedEmail);

      if (!result.success) {
        setError(result.error || "Unable to resend verification email right now.");
        return;
      }

      setResendMessage(result.message || "Verification email sent. Please check your inbox and spam folder.");
    } finally {
      setResendLoading(false);
    }
  };

  return {
    showPassword,
    setShowPassword,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    resendLoading,
    error,
    infoMessage,
    resendMessage,
    showResendVerification,
    handleSubmit,
    handleResendVerification,
  };
}
