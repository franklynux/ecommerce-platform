import React from 'react';
import { ForgotPasswordForm } from '../components/auth';
import { useAuthGuard } from '../hooks/useAuthGuard';

const ForgotPasswordPage = () => {
  // Redirect to home if already logged in
  useAuthGuard(false);

  return (
    <div className="max-w-md mx-auto mt-8">
      <ForgotPasswordForm />
    </div>
  );
};