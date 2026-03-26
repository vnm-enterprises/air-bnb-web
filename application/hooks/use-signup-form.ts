"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/infrastructure/services/auth-service";
import { validateSignupForm } from "@/application/controllers/auth-form-controller";

export type SignupRole = "traveler" | "host";

function passwordStrength(password: string): { pct: number; label: string } {
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNum = /\d/.test(password);
  const hasSym = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (hasLower) score += 1;
  if (hasUpper) score += 1;
  if (hasNum) score += 1;
  if (hasSym) score += 1;

  const pct = Math.min(100, Math.round((score / 6) * 100));

  if (pct >= 70) {
    return { pct: Math.max(10, pct), label: "STRONG" };
  }

  if (pct >= 45) {
    return { pct: Math.max(10, pct), label: "MEDIUM" };
  }

  return { pct: Math.max(10, pct), label: "WEAK" };
}

export function useSignupForm() {
  const router = useRouter();
  const [role, setRole] = useState<SignupRole>("traveler");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const strength = useMemo(() => passwordStrength(password), [password]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    setError("");

    const validationError = validateSignupForm({
      name: normalizedName,
      email: normalizedEmail,
      password,
      agreedTerms,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const result = await signup({
        name: normalizedName,
        email: normalizedEmail,
        password,
        role,
      });

      if (!result.success) {
        setError(result.error || "Unable to create your account right now.");
        return;
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setPassword("");
      setAgreedTerms(false);

      setTimeout(() => {
        router.push(`/login?message=${encodeURIComponent("Please check your email to verify your account")}`);
      }, 1800);
    } catch {
      setError("Something went wrong while creating your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    role,
    setRole,
    showPassword,
    setShowPassword,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    agreedTerms,
    setAgreedTerms,
    loading,
    error,
    success,
    strength,
    handleSubmit,
  };
}
