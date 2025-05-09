import { Route, Routes } from "react-router-dom";

// Layouts
import RootLayout from "./components/root-layout";

// Pages
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/protected-route";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ForgotPassword, ResetPassword } from "./pages/ForgotPassword";
import { useAuth } from "./context/auth.context";

const Verification = ({
  resetPassword = false,
}: {
  resetPassword?: boolean;
}) => {
  if (resetPassword) {
    return <ResetPassword />;
  }

  return <div>Verifying...</div>;
};

const Logout = () => {
  const { signOut } = useAuth();
  signOut();
  return <div>Logging out...</div>;
};

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/verification" element={<Verification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<Verification resetPassword />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RootLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
