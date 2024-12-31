import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';

const EmailVerification = ({ token }) => {
  const [status, setStatus] = useState('verifying');
  const { verifyEmail } = useAuth();

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
      } catch (err) {
        setStatus('error');
      }
    };

    verify();
  }, [token, verifyEmail]);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="text-gray-600">
            Verifying your email...
          </div>
        );
      case 'success':
        return (
          <div className="bg-green-50 text-green-600 p-3 rounded">
            Your email has been verified successfully. You can now access all features.
          </div>
        );
      case 'error':
        return (
          <div className="bg-red-50 text-red-600 p-3 rounded">
            Failed to verify email. The link may have expired or is invalid.
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Email Verification</h2>
      {renderContent()}
    </div>
  );
};

export { LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm, EmailVerification };