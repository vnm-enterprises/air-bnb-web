"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { verifyEmail } from "@/lib/auth";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthAlert from "@/components/auth/AuthAlert";

export default function VerifyEmailPage() {
  const token = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return new URLSearchParams(window.location.search).get("token") || "";
  }, []);

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error"
  );
  const [message, setMessage] = useState(
    token ? "Verifying your email address..." : "No verification token was provided."
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    const runVerification = async () => {
      const result = await verifyEmail(token);

      if (result.success) {
        setStatus("success");
        setMessage("Your email has been verified. You can now sign in.");
        return;
      }

      setStatus("error");
      setMessage(result.error || "Verification failed. The link may be expired or invalid.");
    };

    void runVerification();
  }, [token]);

  return (
    <AuthLayout
      title="Verify Email"
      subtitle="We are checking your verification link."
      sideTitle="One quick security step"
      sideDescription="Email verification keeps your account secure and helps us prevent abuse."
      footer={
        status === "success" ? (
          <Link href="/login" className="font-semibold text-[#2C5F5D] hover:underline">
            Continue to Login
          </Link>
        ) : (
          <Link href="/signup" className="font-semibold text-[#2C5F5D] hover:underline">
            Back to Sign Up
          </Link>
        )
      }
    >
      {status === "loading" && <AuthAlert variant="info">{message}</AuthAlert>}
      {status === "success" && <AuthAlert variant="success">{message}</AuthAlert>}
      {status === "error" && <AuthAlert variant="error">{message}</AuthAlert>}
    </AuthLayout>
  );
}
