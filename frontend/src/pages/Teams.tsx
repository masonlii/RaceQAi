import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "../context/AuthContext";
import type { Team } from "../types";
import PageHeader from "../components/PageHeader";
import { SkeletonCards } from "../components/LoadingState";
import { TrashIcon, UsersIcon } from "../components/icons";

const STAGGER = ["delay-2", "delay-3", "delay-4", "delay-5"] as const;

export default function Teams() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const loadTeams = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setTeams(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .order("created_at", { ascending: false });
      if (!active) return;
      if (error) setError(error.message);
      else setTeams(data ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const createTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !user || !name.trim()) return;
    setBusy(true);
    setError(null);
    const { error } = await supabase
      .from("teams")
      .insert({ name: name.trim(), owner_id: user.id });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setName("");
    loadTeams();
  };

  const deleteTeam = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from("teams").delete().eq("id", id);
    if (error) setError(error.message);
    else loadTeams();
  };

  return (
    <div>
      <PageHeader
        eyebrow="Squad HQ"
        title="Teams"
        description="Build your roster and keep every driver on the same page."
      />

      <form
        onSubmit={createTeam}
        className="animate-fade-up delay-1 glass-card mb-6 flex flex-col gap-3 p-5 sm:flex-row sm:items-center"
      >
        <div className="feature-icon mb-0 shrink-0 self-start sm:self-center">
          <UsersIcon className="h-5 w-5" />
        </div>
        <input
          className="field mb-0 flex-1"
          placeholder="Team name (e.g. Apex Sim Racing)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="New team name"
        />
        <button className="btn btn-primary shrink-0" type="submit" disabled={busy}>
          {busy ? "Creating…" : "Create team"}
        </button>
      </form>

      {error && (
        <p className="animate-fade-in mb-4 rounded-xl border border-[rgba(251,113,133,0.35)] bg-[rgba(251,113,133,0.1)] px-4 py-3 text-[var(--color-danger)]">
          {error}
        </p>
      )}

      {loading ? (
        <SkeletonCards count={2} />
      ) : teams.length === 0 ? (
        <div className="empty-state animate-fade-up delay-2">
          <div className="feature-icon">
            <UsersIcon className="h-6 w-6" />
          </div>
          <h3 className="text-lg">No teams yet</h3>
          <p className="text-[var(--color-muted)]">
            Create your first squad above and start stacking wins.
          </p>
        </div>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {teams.map((team, i) => (
            <li
              key={team.id}
              className={`list-row animate-fade-up ${STAGGER[Math.min(i, STAGGER.length - 1)]}`}
            >
              <div>
                <strong className="text-lg text-white">{team.name}</strong>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  Created {new Date(team.created_at).toLocaleDateString()}
                </p>
              </div>
              {team.owner_id === user?.id && (
                <button
                  className="btn btn-ghost btn-danger btn-sm"
                  onClick={() => deleteTeam(team.id)}
                  type="button"
                >
                  <TrashIcon className="h-4 w-4" />
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
