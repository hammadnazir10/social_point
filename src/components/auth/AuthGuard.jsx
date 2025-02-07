import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Loader from '@/components/common/Loader';

/**
 * AuthGuard component to protect routes that require authentication
 * Redirects to login if user is not authenticated
 */
const AuthGuard = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : null;
};

export default AuthGuard;
