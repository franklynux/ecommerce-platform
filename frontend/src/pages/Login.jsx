import React from 'react';
import { LoginForm } from '../components/auth';
import { useAuthGuard } from '../hooks/useAuthGuard';

const LoginPage = () => {
  // Redirect to home if already logged in
  useAuthGuard(false);

  return (
    <div className="max-w-md mx-auto mt-8 p-6">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <LoginForm />
    </div>
  );
};