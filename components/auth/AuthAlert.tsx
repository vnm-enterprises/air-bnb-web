import { ReactNode } from "react";

type AuthAlertVariant = "error" | "success" | "info";

interface AuthAlertProps {
  variant?: AuthAlertVariant;
  children: ReactNode;
}

const variantClasses: Record<AuthAlertVariant, string> = {
  error: "border-red-200 bg-red-50 text-red-700",
  success: "border-green-200 bg-green-50 text-green-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
};

export default function AuthAlert({ variant = "info", children }: AuthAlertProps) {
  return (
    <div className={`rounded-md border p-3 text-sm font-medium ${variantClasses[variant]}`}>
      {children}
    </div>
  );
}
