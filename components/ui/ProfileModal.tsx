'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X } from 'lucide-react';
import { updateProfile } from '@/infrastructure/services/auth-service';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync name with user data when modal opens or user data changes
  useEffect(() => {
    if (isOpen && user?.name) {
      setName(user.name);
    }
  }, [isOpen, user?.name]);

  if (!isOpen) return null;

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



  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-slate-100 rounded-md"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Profile Settings</h2>
          <p className="text-sm text-slate-500 mb-6">Manage your account information</p>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm font-semibold">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700 text-sm font-semibold">{success}</p>
            </div>
          )}

          {/* Profile Information */}
          <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3 py-2 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-900 text-sm outline-none focus:border-slate-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Account Type
                </label>
                <input
                  type="text"
                  value={user?.roles?.includes('host') ? 'Host' : 'Traveler'}
                  disabled
                  className="w-full px-3 py-2 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-sm capitalize"
                />
              </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-md bg-[#2C5F5D] hover:bg-[#244f4d] disabled:opacity-50 transition text-white font-semibold text-sm"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full mt-6 py-2 rounded-md bg-red-50 hover:bg-red-100 transition text-red-600 font-semibold text-sm border border-red-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
