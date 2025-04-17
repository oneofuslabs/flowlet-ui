/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getUser, logOut, setToken, setUser } from "@/utils/auth";
import { getJSON, postJSON } from "@/utils/loaders";

type AuthContextType = {
  user: User | null;
  signOut: () => Promise<void>;
  signIn: (credentials: { email: string; password: string }) => Promise<any>;
  signUp: (credentials: { email: string; password: string }) => Promise<any>;
  fetchUser: () => Promise<User>;
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

  return (
    <AuthContext.Provider
      value={{
        user: sessionUser,
        signOut,
        signIn,
        signUp,
        fetchUser,
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
