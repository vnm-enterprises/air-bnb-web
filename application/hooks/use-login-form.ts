"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { validateLoginForm } from "@/application/controllers/auth-form-controller";

export function useLoginForm() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const infoMessage = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return new URLSearchParams(window.location.search).get("message") || "";
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const redirect = new URLSearchParams(window.location.search).get("redirect") || "/properties";
    router.push(redirect);
  }, [isAuthenticated, router]);

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

  return {
    showPassword,
    setShowPassword,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    infoMessage,
    handleSubmit,
  };
}
