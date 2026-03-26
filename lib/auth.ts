/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './axios';
import { tokenStorage } from '@/infrastructure/security/token-storage';

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

export type SignupData = {
  name: string;
  email: string;
  password: string;
  role: 'traveler' | 'host';
};

function getApiErrorMessage(err: any, fallback: string): string {
  const apiMessage = err?.response?.data?.message;
  const status = err?.response?.status;

  if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) {
    return apiMessage;
  }

  if (status === 400 || status === 422) {
    return 'Please review the details and try again.';
  }

  if (status === 401) {
    return 'Invalid credentials. Please check your email and password.';
  }

  if (status === 403) {
    return 'This action is not allowed for your account.';
  }

  if (status === 404) {
    return 'The requested account resource could not be found.';
  }

  if (status === 409) {
    return 'This account action conflicts with existing data.';
  }

  if (status === 429) {
    return 'Too many attempts. Please wait a moment and try again.';
  }

  if (status >= 500) {
    return 'Server error. Please try again in a few minutes.';
  }

  return fallback;
}

export function setAccessToken(token: string) {
  tokenStorage.setAccessToken(token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function getAccessToken(): string | null {
  return tokenStorage.getAccessToken();
}

export function setRefreshToken(token: string) {
  tokenStorage.setRefreshToken(token);
}

export function getRefreshToken(): string | null {
  return tokenStorage.getRefreshToken();
}

export function clearAuthTokens() {
  tokenStorage.clearSession();
  try {
    delete api.defaults.headers.common['Authorization'];
  } catch {}
}

/**
 * Login user with email and password
 */
export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; data?: LoginResponse; error?: string }> {
  try {
    const res = await api.post('/api/v1/login', {
      email: email.trim().toLowerCase(),
      password,
    });
    const data = res.data as LoginResponse;

    tokenStorage.setSession({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    });
    api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;

    return { success: true, data };
  } catch (err: any) {
    const error = getApiErrorMessage(err, 'Unable to sign in right now.');
    return { success: false, error };
  }
}

/**
 * Register new user
 */
export async function signup(
  signupData: SignupData
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await api.post('/api/v1/register', {
      ...signupData,
      name: signupData.name.trim(),
      email: signupData.email.trim().toLowerCase(),
    });
    return { success: true, message: res.data?.message };
  } catch (err: any) {
    const error = getApiErrorMessage(err, 'Unable to create your account right now.');
    return { success: false, error };
  }
}

/**
 * Verify email with token
 */
export async function verifyEmail(token: string): Promise<{ success: boolean; error?: string }> {
  try {
    await api.get('/api/v1/verify-email', { params: { token } });
    return { success: true };
  } catch (err: any) {
    const error = getApiErrorMessage(err, 'Verification failed. The link may be expired or invalid.');
    return { success: false, error };
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    await api.post('/api/v1/forgot-password', { email: email.trim().toLowerCase() });
    return { success: true };
  } catch (err: any) {
    const error = getApiErrorMessage(err, 'Unable to send reset instructions right now.');
    return { success: false, error };
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(
  key: string,
  login: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await api.post('/api/v1/reset-password', {
      key,
      login,
      new_password: newPassword
    });
    return { success: true };
  } catch (err: any) {
    const error = getApiErrorMessage(err, 'Unable to reset password. Please request a new link.');
    return { success: false, error };
  }
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(): Promise<{ success: boolean; data?: LoginResponse; error?: string }> {
  try {
    const userId = tokenStorage.getUserId();
    const refreshToken = getRefreshToken();

    if (!userId || !refreshToken) {
      return { success: false, error: 'No refresh token found' };
    }

    const res = await api.post('/api/v1/refresh', {
      user_id: userId,
      refresh_token: refreshToken
    });

    const data = res.data as LoginResponse;
    setAccessToken(data.access_token);
    setRefreshToken(data.refresh_token);

    return { success: true, data };
  } catch (err: any) {
    clearAuthTokens();
    const error = getApiErrorMessage(err, 'Session refresh failed. Please sign in again.');
    return { success: false, error };
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    await api.post('/api/v1/logout');
  } catch {
    // Continue logout even if API fails
  } finally {
    clearAuthTokens();
  }
}

/**
 * Get current user profile
 */
export async function getCurrentUser() {
  try {
    const res = await api.get('/api/v1/me');
    return res.data;
  } catch (err: any) {
    throw err?.response?.data || new Error('Failed to fetch user');
  }
}

/**
 * Update user profile (name only)
 */
export async function updateProfile(data: { name?: string }) {
  try {
    const res = await api.post('/api/v1/profile', data);
    return {
      success: true,
      data: res.data,
      message: res.data?.message || 'Profile updated successfully'
    };
  } catch (err: any) {
    return {
      success: false,
      error: getApiErrorMessage(err, 'Failed to update profile')
    };
  }
}

/**
 * Change user password
 */
export async function changePassword(data: { password: string }) {
  try {
    const res = await api.post('/api/v1/profile', data);
    return {
      success: true,
      data: res.data,
      message: res.data?.message || 'Password changed successfully'
    };
  } catch (err: any) {
    return {
      success: false,
      error: getApiErrorMessage(err, 'Failed to change password')
    };
  }
}

/**
 * Upload profile image
 */
export async function uploadProfileImage(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post('/api/v1/profile/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return { success: true, data: res.data };
  } catch (err: any) {
    return { success: false, error: getApiErrorMessage(err, 'Failed to upload profile image') };
  }
}

/**
 * Delete account
 */
export async function deleteAccount(): Promise<{ success: boolean; error?: string }> {
  try {
    await api.delete('/api/v1/account');
    clearAuthTokens();
    return { success: true };
  } catch (err: any) {
    const error = getApiErrorMessage(err, 'Account deletion failed');
    return { success: false, error };
  }
}
