"use client";

import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthAlert from "@/components/auth/AuthAlert";
import { useVerifyEmail } from "@/application/hooks/use-verify-email";

export function VerifyEmailFeature() {
  const { status, message } = useVerifyEmail();

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
