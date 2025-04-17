import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

// Layouts
import RootLayout from "./components/RootLayout";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { logOut, setToken, setUser } from "./utils/auth";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "./context/auth.context";

const Verification = () => {
  const { hash } = useLocation();
  const { fetchUser } = useAuth();
  const navigate = useNavigate();

  const verificationMutation = useMutation({
    mutationFn: async () => {
      const params = new URLSearchParams(hash.slice(1));
      const accessToken = params.get("access_token");
      if (accessToken) {
        setToken(accessToken);
        const user = await fetchUser();
        setUser(user);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    },
  });

  useEffect(() => {
    verificationMutation.mutate();
  }, []);

  return <div>Verifying...</div>;
};

const Logout = () => {
  logOut();
  return <div>Logging out...</div>;
};

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/verification" element={<Verification />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RootLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
