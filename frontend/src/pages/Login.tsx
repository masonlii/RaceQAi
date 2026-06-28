import { FormEvent, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AUTH_ENABLED } from "../config";
import { isSupabaseConfigured } from "../services/supabase";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";

export default function Login() {
  const { user, signInWithGoogle, signInWithEmail, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  if (!AUTH_ENABLED) return <Navigate to="/dashboard" replace />;
  if (!isSupabaseConfigured) return <Navigate to="/" replace />;
  if (loading) return null;

  const handleGoogle = async () => {
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
      setBusy(false);
    }
  };

  const handleEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await signInWithEmail(email.trim());
      setEmailSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send magic link.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Pit access"
        title="Sign in"
        description="Use Google or a magic link to enter your garage."
      />

      <div className="glass-card mx-auto max-w-md p-6">
        {emailSent ? (
          <p className="text-[var(--color-muted)]">
            Check your inbox for a sign-in link, then come back here.
          </p>
        ) : (
          <div className="space-y-4">
            <button
              type="button"
              className="btn btn-primary w-full"
              onClick={handleGoogle}
              disabled={busy}
            >
              Continue with Google
            </button>

            <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[var(--color-muted)]">
              <span className="h-px flex-1 bg-[var(--color-border)]" />
              or
              <span className="h-px flex-1 bg-[var(--color-border)]" />
            </div>

            <form onSubmit={handleEmail} className="space-y-3">
              <input
                type="email"
                className="field w-full"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="btn w-full"
                disabled={busy}
              >
                Email magic link
              </button>
            </form>
          </div>
        )}

        {error && (
          <p className="mt-4 text-sm text-rose-400" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
