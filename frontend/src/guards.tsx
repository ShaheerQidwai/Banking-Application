import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './auth';

export function UserGuard() {
  const { session } = useAuth();
  if (!session || session.role !== 'user') {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export function AdminGuard() {
  const { session } = useAuth();
  if (!session || session.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
