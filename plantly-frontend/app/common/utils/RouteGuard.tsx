//import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '~/auth/AuthContext';

// Guard that only allows authenticated users
export const RequireAuth = () => {
  const {currentUser, loading} = useAuth();
  const location = useLocation();

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );
  }

  if (!currentUser) {
    // Save the current location they were trying to go to
    return <Navigate to="/login" state={{from: location}} replace/>;
  }

  return <Outlet/>;
};

interface RequireRoleProps {
  allowedRoles: Array<'user' | 'admin'>;
}

// Guard that only allows users with specific roles
export const RequireRole = ({allowedRoles}: RequireRoleProps) => {
  const {currentUser} = useAuth();

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    // If they don't have permission, send them to the dashboard
    return <Navigate to="/dashboard" replace/>;
  }

  return <Outlet/>;
};

// Guard that redirects authenticated users from public routes to dashboard
export const RedirectIfLoggedIn = () => {
  const {currentUser} = useAuth();

  if (currentUser) {
    // If they're logged in, redirect to dashboard
    return <Navigate to="/dashboard" replace/>;
  }

  return <Outlet/>;
};