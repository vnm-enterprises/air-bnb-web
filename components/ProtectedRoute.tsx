'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requiredRoles?: UserRole[];
  redirectTo?: string;
  unauthorizedRedirectTo?: string;
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredRoles,
  redirectTo = '/login',
  unauthorizedRedirectTo = '/properties',
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, hasRole } = useAuth();
  const router = useRouter();

  const roleRequirements = requiredRoles || (requiredRole ? [requiredRole] : []);
  const hasRequiredRole =
    roleRequirements.length === 0 || roleRequirements.some((role) => hasRole(role));

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }

    if (!hasRequiredRole) {
      router.replace(unauthorizedRedirectTo);
    }
  }, [hasRequiredRole, isAuthenticated, loading, redirectTo, router, unauthorizedRedirectTo]);

  if (loading) {
    return fallback || <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!hasRequiredRole) {
    return null;
  }

  return <>{children}</>;
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C5F5D]" />
    </div>
  );
}
