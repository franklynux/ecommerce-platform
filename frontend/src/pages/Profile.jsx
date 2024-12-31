import React from 'react';
import { useAuthGuard } from '../hooks/useAuthGuard';
import { useAuth } from '../hooks/useAuth';

const ProfilePage = () => {
  // Redirect to login if not authenticated
  const { isLoading } = useAuthGuard(true);
  const { user } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-lg mx-auto mt-8 p-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Name</label>
            <p className="mt-1">{user.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <p className="mt-1">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};