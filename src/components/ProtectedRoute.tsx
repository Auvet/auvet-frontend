import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getToken } from '@/utils/storage';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const token = getToken();
  const hasToken = !!session.token || !!token;

  if (!hasToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

