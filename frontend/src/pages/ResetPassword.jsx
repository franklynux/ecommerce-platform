import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResetPasswordForm } from '../components/auth';
import { useAuthGuard } from '../hooks/useAuthGuard';

const ResetPasswordPage = () => {
  // Redirect to home if already logged in
  useAuthGuard(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          Invalid or missing reset token.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <ResetPasswordForm token={token} />
    </div>
  );
};