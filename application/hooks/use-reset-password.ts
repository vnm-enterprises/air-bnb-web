"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { validateResetPassword } from "@/application/controllers/auth-controller";
import { authService } from "@/infrastructure/services";

export function useResetPassword() {
  const router = useRouter();

  const query = useMemo(() => {
    if (typeof window === "undefined") {
      return { key: "", login: "" };
    }

    const params = new URLSearchParams(window.location.search);
    return {
      key: params.get("key") || "",
      login: params.get("login") || "",
    };
  }, []);

  const invalidLink = !query.key || !query.login;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (invalidLink) {
      setError("This reset link is invalid or expired. Please request a new one.");
      return;
    }

    const validationError = validateResetPassword(password, confirmPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const result = await authService.resetPassword(query.key, query.login, password);

      if (!result.success) {
        setError(result.error || "Unable to reset password. Please request a new link.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login?message=Password reset successful. You can now sign in.");
      }, 1800);
    } finally {
      setLoading(false);
    }
  };

  return {
    invalidLink,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    error,
    success,
    handleSubmit,
  };
}
