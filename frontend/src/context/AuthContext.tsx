import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { AUTH_ENABLED } from "../config";
import { supabase, isSupabaseConfigured } from "../services/supabase";

const DEV_USER = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "dev@raceiq.local",
} as User;

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(
    AUTH_ENABLED && isSupabaseConfigured
  );

  useEffect(() => {
    if (!AUTH_ENABLED || !supabase) return;

    const client = supabase;

    client.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = client.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);

        if (event === "SIGNED_IN" && newSession?.user) {
          await client.from("profiles").upsert({
            id: newSession.user.id,
            email: newSession.user.email ?? null,
          });
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!AUTH_ENABLED || !supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  const signInWithEmail = async (email: string) => {
    if (!AUTH_ENABLED || !supabase) return;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    if (!AUTH_ENABLED || !supabase) return;
    await supabase.auth.signOut();
  };

  const user = AUTH_ENABLED ? (session?.user ?? null) : DEV_USER;

  const value: AuthContextValue = {
    session,
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
