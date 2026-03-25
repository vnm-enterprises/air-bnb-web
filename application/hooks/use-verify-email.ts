"use client";

import { useEffect, useMemo, useState } from "react";
import { authService } from "@/infrastructure/services";

export function useVerifyEmail() {
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
      const result = await authService.verifyEmail(token);

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

  return { token, status, message };
}
