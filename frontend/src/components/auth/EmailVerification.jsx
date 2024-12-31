import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const EmailVerification = ({ token }) => {
  const [status, setStatus] = useState('verifying');
  const { authFetch } = useAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await authFetch(`/api/auth/verify-email/${token}`, {
          method: 'POST',
        });

        if (response.ok) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (err) {
        setStatus('error');
      }
    };

    verifyEmail();
  }, [token, authFetch]);

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Email Verification</h2>
      
      {status === 'verifying' && (
        <div className="text-gray-600 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          Verifying your email address...
        </div>
      )}
      
      {status === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded">
          <p className="font-medium">Email Verified Successfully!</p>
          <p className="mt-2">Your email has been verified. You can now access all features of your account.</p>
        </div>
      )}
      
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          <p className="font-medium">Verification Failed</p>
          <p className="mt-2">The verification link appears to be invalid or has expired. 
            Please request a new verification email.</p>
        </div>
      )}
    </div>
  );
};