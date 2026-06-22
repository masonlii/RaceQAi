import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { AUTH_ENABLED } from "../config";
import { useAuth } from "../context/AuthContext";
import { isSupabaseConfigured } from "../services/supabase";
import LoadingState from "./LoadingState";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (!AUTH_ENABLED) return <>{children}</>;

  if (!isSupabaseConfigured) return <Navigate to="/" replace />;
  if (loading) return <LoadingState label="Syncing session" />;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
