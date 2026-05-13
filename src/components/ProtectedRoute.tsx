import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  user: unknown;
  children: ReactNode;
}

export default function ProtectedRoute({ user, children }: ProtectedRouteProps) {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
