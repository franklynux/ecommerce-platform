import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useAuthGuard = (shouldBeAuthenticated = true) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (shouldBeAuthenticated && !user) {
        navigate('/login');
      } else if (!shouldBeAuthenticated && user) {
        navigate('/');
      }
    }
  }, [user, isLoading, shouldBeAuthenticated, navigate]);

  return { isLoading };
};
