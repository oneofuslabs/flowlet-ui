import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth.context";
interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();

  const { session, loading } = useAuth();

  // Check for access token in localStorage
  const hasAccessToken = !!session && !loading;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!hasAccessToken) {
    // Redirect to login while saving the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If there are children, render them, otherwise render the Outlet
  return children ?? <Outlet />;
};
