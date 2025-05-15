import { Route, Routes, useLocation } from "react-router-dom";

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
import Transactions from "./pages/Transactions";
import { useLayoutEffect } from "react";
import Rules from "./pages/Rules";
import Wallet from "./pages/Wallet";
import Stakes from "./pages/Stakes";

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

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useLayoutEffect(() => {
    console.log("location", location);
    // Scroll to the top of the page when the route changes
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return children;
};

export function AppRoutes() {
  return (
    <Wrapper>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/reset-password"
          element={<Verification resetPassword />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <RootLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/stakes" element={<Stakes />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Wrapper>
  );
}
