/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getUser, logOut, setToken, setUser } from "@/utils/auth";
import { getJSON, postJSON } from "@/utils/loaders";
import { getBrowserClient } from "@/lib/supabase";
type AuthContextType = {
  user: User | null;
  signOut: () => Promise<void>;
  signIn: (credentials: { email: string; password: string }) => Promise<any>;
  signUp: (credentials: { email: string; password: string }) => Promise<any>;
  fetchUser: () => Promise<User>;
  requestPasswordReset: (email: string) => Promise<any>;
  updatePassword: (password: string) => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [sessionUser, setSessionUser] = useState<User | null>(null);

  useEffect(() => {
    // Check active sessions and sets the user
    if (getUser()) {
      setSessionUser(getUser());
    }
  }, []);

  const signOut = async () => {
    logOut();
  };

  const signIn = async (credentials: { email: string; password: string }) => {
    const data = await postJSON("/api/v1/auth/login", credentials);
    setSessionUser(data.user);
    setUser(data.user);
    setToken(data.session.access_token);
    return data;
  };

  const signUp = async (credentials: { email: string; password: string }) =>
    await postJSON("/api/v1/auth/register", credentials);

  const fetchUser = async (): Promise<User> => {
    const { user } = await getJSON("/api/v1/auth/me");
    setSessionUser(user);
    setUser(user);
    return user;
  };

  const requestPasswordReset = async (email: string) =>
    await getBrowserClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

  const updatePassword = async (password: string) =>
    await getBrowserClient().auth.updateUser({ password });

  return (
    <AuthContext.Provider
      value={{
        user: sessionUser,
        signOut,
        signIn,
        signUp,
        fetchUser,
        requestPasswordReset,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
