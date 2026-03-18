'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { changePassword, updateProfile } from '@/lib/auth';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const primaryRole = user?.roles?.[0];
  const roleLabel = primaryRole
    ? `${primaryRole.charAt(0).toUpperCase()}${primaryRole.slice(1)}`
    : '';

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setName(user?.name || '');
      setLoading(false);
    }
  }, [isAuthenticated, user, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    try {
      const result = await updateProfile({ name: name.trim() });
      if (!result.success) {
        throw new Error(result.error || 'Failed to update profile');
      }

      setSuccess(result.message || 'Profile updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!currentPassword) {
      setError('Current password is required');
      return;
    }
    if (!newPassword) {
      setError('New password is required');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }
    if (!/\d/.test(newPassword)) {
      setError('Password must contain at least one number');
      return;
    }
    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      setError('Password must contain at least one special character');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await changePassword({ password: newPassword });
      if (!result.success) {
        throw new Error(result.error || 'Failed to change password');
      }

      setSuccess(result.message || 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f4f4]">
        <div className="animate-spin w-12 h-12 border-4 border-slate-200 border-t-[#2C5F5D] rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f4f4] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
          <p className="text-slate-600 mt-2">Manage your account information and security</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-4 px-6 font-semibold text-center transition ${
                activeTab === 'profile'
                  ? 'border-b-2 border-[#2C5F5D] text-[#2C5F5D]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 py-4 px-6 font-semibold text-center transition ${
                activeTab === 'password'
                  ? 'border-b-2 border-[#2C5F5D] text-[#2C5F5D]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Change Password
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-semibold">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-semibold">{success}</p>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-[#2C5F5D] focus:outline-none"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    User Type
                  </label>
                  <input
                    type="text"
                    value={roleLabel}
                    disabled
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed capitalize"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-[#2C5F5D] text-white font-semibold rounded-lg hover:bg-[#244f4d] disabled:opacity-50 transition"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-slate-200 rounded-lg focus:border-[#2C5F5D] focus:outline-none"
                      placeholder="Enter your current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showCurrentPw ? (
                        <EyeOff className="w-4 h-4 text-slate-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-slate-200 rounded-lg focus:border-[#2C5F5D] focus:outline-none"
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showNewPw ? (
                        <EyeOff className="w-4 h-4 text-slate-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                  </div>

                  {/* Password requirements */}
                  <div className="mt-3 text-xs space-y-1 text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className={newPassword.length >= 8 ? 'text-green-600' : 'text-slate-400'}>
                        {newPassword.length >= 8 ? '✓' : '○'}
                      </span>
                      <span>At least 8 characters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-slate-400'}>
                        {/[A-Z]/.test(newPassword) ? '✓' : '○'}
                      </span>
                      <span>Contains uppercase letter</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={/\d/.test(newPassword) ? 'text-green-600' : 'text-slate-400'}>
                        {/\d/.test(newPassword) ? '✓' : '○'}
                      </span>
                      <span>Contains number</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-600' : 'text-slate-400'}>
                        {/[^A-Za-z0-9]/.test(newPassword) ? '✓' : '○'}
                      </span>
                      <span>Contains special character</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPw ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-slate-200 rounded-lg focus:border-[#2C5F5D] focus:outline-none"
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPw(!showConfirmPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPw ? (
                        <EyeOff className="w-4 h-4 text-slate-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-[#2C5F5D] text-white font-semibold rounded-lg hover:bg-[#244f4d] disabled:opacity-50 transition"
                >
                  {loading ? 'Changing Password...' : 'Change Password'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Logout */}
        <div className="mt-6 flex gap-4 justify-center">
          <Link href="/properties" className="text-[#2C5F5D] font-semibold hover:underline">
            ← Back to Properties
          </Link>
          <button
            onClick={handleLogout}
            className="px-6 py-2 text-red-600 font-semibold hover:text-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
