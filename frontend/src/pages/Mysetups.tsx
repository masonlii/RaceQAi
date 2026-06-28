import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import type { Setup } from "../types";
import PageHeader from "../components/PageHeader";
import { SkeletonCards } from "../components/LoadingState";

export default function MySetups() {
  const [setups, setSetups] = useState<Setup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error: loadError } = await supabase
        .from("setups")
        .select("*")
        .order("created_at", { ascending: false });

      if (!active) return;

      if (loadError) setError(loadError.message);
      else setSetups(data ?? []);

      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Garage"
        title="My setups"
        description="Setups saved from the generator and your vault."
      />

      {error && (
        <p className="mb-4 text-sm text-rose-400" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <SkeletonCards count={3} />
      ) : setups.length === 0 ? (
        <p className="text-[var(--color-muted)]">No setups saved yet.</p>
      ) : (
        <div className="space-y-4">
          {setups.map((setup) => (
            <article key={setup.id} className="glass-card p-6">
              <h2 className="text-2xl font-bold">
                {setup.track} — {setup.car}
              </h2>

              {setup.weather && (
                <p className="text-[var(--color-muted)]">
                  Weather: {setup.weather}
                </p>
              )}

              {(setup.setup_data ?? setup.notes) && (
                <pre className="mt-4 whitespace-pre-wrap text-[var(--color-muted)]">
                  {setup.setup_data ?? setup.notes}
                </pre>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
