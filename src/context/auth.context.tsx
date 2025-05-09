/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User, AuthError } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  getSession: () => Promise<Session>;
  getUser: () => Promise<User>;
  signOut: () => Promise<{ error: AuthError | null }>;
  signIn: (credentials: { email: string; password: string }) => Promise<any>;
  signUp: (credentials: { email: string; password: string }) => Promise<any>;
  requestPasswordReset: (email: string) => Promise<any>;
  updatePassword: (password: string) => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setSession(session ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log({ _event, session });
      setUser(session?.user ?? null);
      setSession(session ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => await supabase.auth.signOut();

  const signIn = async (credentials: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    return console.log(data, error);
  };

  const signUp = async (credentials: { email: string; password: string }) =>
    await supabase.auth.signUp({
      ...credentials,
      options: {
        emailRedirectTo: `${window.location.origin}/verification`,
      },
    });

  const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error(error);
      throw error;
    }
    if (!data.session) {
      throw new Error("No session found");
    }
    return data.session;
  };

  const getUser = async () => {
    const session = await getSession();
    return session.user;
  };

  const requestPasswordReset = async (email: string) =>
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

  const updatePassword = async (password: string) =>
    await supabase.auth.updateUser({ password });

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        getSession,
        getUser,
        signOut,
        signIn,
        signUp,
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
