/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './axios';

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

export function setAccessToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
}

export function setRefreshToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('refresh_token', token);
  }
}

export function getRefreshToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token');
  }
  return null;
}

export function clearAuthTokens() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    try {
      delete api.defaults.headers.common['Authorization'];
    } catch {}
  }
}

/**
 * Login user with email and password
 */
export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; data?: LoginResponse; error?: string }> {
  try {
    const res = await api.post('/api/v1/login', { email, password });
    const data = res.data as LoginResponse;

    setAccessToken(data.access_token);
    setRefreshToken(data.refresh_token);

    return { success: true, data };
  } catch (err: any) {
    const error = err?.response?.data?.message || 'Login failed';
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
    const res = await api.post('/api/v1/register', signupData);
    return { success: true, message: res.data?.message };
  } catch (err: any) {
    const error = err?.response?.data?.message || 'Signup failed';
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
    const error = err?.response?.data?.message || 'Verification failed';
    return { success: false, error };
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    await api.post('/api/v1/forgot-password', { email });
    return { success: true };
  } catch (err: any) {
    const error = err?.response?.data?.message || 'Request failed';
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
    const error = err?.response?.data?.message || 'Password reset failed';
    return { success: false, error };
  }
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(): Promise<{ success: boolean; data?: LoginResponse; error?: string }> {
  try {
    const userId = localStorage.getItem('user_id');
    const refreshToken = getRefreshToken();

    if (!userId || !refreshToken) {
      return { success: false, error: 'No refresh token found' };
    }

    const res = await api.post('/api/v1/refresh', {
      user_id: parseInt(userId),
      refresh_token: refreshToken
    });

    const data = res.data as LoginResponse;
    setAccessToken(data.access_token);
    setRefreshToken(data.refresh_token);

    return { success: true, data };
  } catch (err: any) {
    clearAuthTokens();
    const error = err?.response?.data?.message || 'Token refresh failed';
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
      error: err?.response?.data?.message || 'Failed to update profile'
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
      error: err?.response?.data?.message || 'Failed to change password'
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
    return { success: false, error: err?.response?.data?.message };
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
    const error = err?.response?.data?.message || 'Account deletion failed';
    return { success: false, error };
  }
}
