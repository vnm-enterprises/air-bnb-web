"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { changePassword, updateProfile } from "@/infrastructure/services/auth-service";
import { validatePasswordChange, validateProfileName } from "@/application/controllers/auth-form-controller";

export function useProfileSettings() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/profile");
      return;
    }

    setName(user?.name || "");
    setLoading(false);
  }, [isAuthenticated, router, user]);

  const handleUpdateProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const validationError = validateProfileName(trimmedName);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const result = await updateProfile({ name: trimmedName });

      if (!result.success) {
        setError(result.error || "Failed to update profile");
        return;
      }

      setSuccess(result.message || "Profile updated successfully!");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validatePasswordChange({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const result = await changePassword({ password: newPassword });

      if (!result.success) {
        setError(result.error || "Failed to change password");
        return;
      }

      setSuccess(result.message || "Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return {
    user,
    loading,
    name,
    setName,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showCurrentPw,
    setShowCurrentPw,
    showNewPw,
    setShowNewPw,
    showConfirmPw,
    setShowConfirmPw,
    error,
    success,
    activeTab,
    setActiveTab,
    handleUpdateProfile,
    handleChangePassword,
    handleLogout,
  };
}
