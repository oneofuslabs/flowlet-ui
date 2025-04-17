import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getToken } from "../utils/auth";
interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();

  // Check for access token in localStorage
  const hasAccessToken = !!getToken();

  if (!hasAccessToken) {
    // Redirect to login while saving the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If there are children, render them, otherwise render the Outlet
  return children ?? <Outlet />;
};
