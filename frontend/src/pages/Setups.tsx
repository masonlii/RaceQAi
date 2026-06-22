import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "../context/AuthContext";
import type { Setup, Team } from "../types";
import PageHeader from "../components/PageHeader";
import { SkeletonCards } from "../components/LoadingState";
import { GaugeIcon, TrashIcon, WrenchIcon } from "../components/icons";

const EMPTY_FORM = { name: "", car: "", track: "", notes: "", team_id: "" };
const STAGGER = ["delay-2", "delay-3", "delay-4", "delay-5"] as const;

export default function Setups() {
  const { user } = useAuth();
  const [setups, setSetups] = useState<Setup[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!supabase) return;
    const [setupRes, teamRes] = await Promise.all([
      supabase.from("setups").select("*").order("created_at", { ascending: false }),
      supabase.from("teams").select("*").order("name"),
    ]);
    if (setupRes.error) setError(setupRes.error.message);
    else setSetups(setupRes.data ?? []);
    if (!teamRes.error) setTeams(teamRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const [setupRes, teamRes] = await Promise.all([
        supabase
          .from("setups")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("teams").select("*").order("name"),
      ]);
      if (!active) return;
      if (setupRes.error) setError(setupRes.error.message);
      else setSetups(setupRes.data ?? []);
      if (!teamRes.error) setTeams(teamRes.data ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const update = (field: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const createSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !user) return;
    if (!form.name.trim() || !form.car.trim() || !form.track.trim()) {
      setError("Name, car, and track are required.");
      return;
    }
    setBusy(true);
    setError(null);
    const { error } = await supabase.from("setups").insert({
      user_id: user.id,
      name: form.name.trim(),
      car: form.car.trim(),
      track: form.track.trim(),
      notes: form.notes.trim() || null,
      team_id: form.team_id || null,
    });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setForm(EMPTY_FORM);
    load();
  };

  const deleteSetup = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from("setups").delete().eq("id", id);
    if (error) setError(error.message);
    else load();
  };

  return (
    <div>
      <PageHeader
        eyebrow="Setup garage"
        title="Setups"
        description="Save car configs per track. Quali, race, wet — all locked in."
      />

      <form
        onSubmit={createSetup}
        className="animate-fade-up delay-1 glass-card mb-6 p-6"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="feature-icon mb-0">
            <WrenchIcon className="h-5 w-5" />
          </div>
          <h2 className="text-lg">New setup</h2>
        </div>

        <div className="mb-3 grid gap-3 sm:grid-cols-2">
          <input
            className="field mb-0"
            placeholder="Setup name (e.g. Qualifying)"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            aria-label="Setup name"
          />
          <input
            className="field mb-0"
            placeholder="Car (e.g. Mazda MX-5)"
            value={form.car}
            onChange={(e) => update("car", e.target.value)}
            aria-label="Car"
          />
        </div>
        <div className="mb-3 grid gap-3 sm:grid-cols-2">
          <input
            className="field mb-0"
            placeholder="Track (e.g. Lime Rock)"
            value={form.track}
            onChange={(e) => update("track", e.target.value)}
            aria-label="Track"
          />
          <select
            className="field mb-0"
            value={form.team_id}
            onChange={(e) => update("team_id", e.target.value)}
            aria-label="Team"
          >
            <option value="">Personal (no team)</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <textarea
          className="field mb-4 min-h-24 resize-y"
          placeholder="Notes — tire pressures, camber, diff, whatever you're chasing"
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          aria-label="Setup notes"
        />
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save setup"}
        </button>
      </form>

      {error && (
        <p className="animate-fade-in mb-4 rounded-xl border border-[rgba(251,113,133,0.35)] bg-[rgba(251,113,133,0.1)] px-4 py-3 text-[var(--color-danger)]">
          {error}
        </p>
      )}

      {loading ? (
        <SkeletonCards count={3} />
      ) : setups.length === 0 ? (
        <div className="empty-state animate-fade-up delay-2">
          <div className="feature-icon">
            <GaugeIcon className="h-6 w-6" />
          </div>
          <h3 className="text-lg">Garage is empty</h3>
          <p className="text-[var(--color-muted)]">
            Drop your first setup above and stop re-typing pressures every session.
          </p>
        </div>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {setups.map((s, i) => (
            <li
              key={s.id}
              className={`list-row animate-fade-up ${STAGGER[Math.min(i, STAGGER.length - 1)]}`}
            >
              <div>
                <strong className="text-lg text-white">{s.name}</strong>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="chip text-[10px]">{s.car}</span>
                  <span className="text-sm text-[var(--color-muted)]">
                    @ {s.track}
                  </span>
                </div>
                {s.notes && (
                  <p className="mt-3 text-sm text-[var(--color-muted)]">
                    {s.notes}
                  </p>
                )}
              </div>
              <button
                className="btn btn-ghost btn-danger btn-sm shrink-0"
                onClick={() => deleteSetup(s.id)}
                type="button"
              >
                <TrashIcon className="h-4 w-4" />
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
