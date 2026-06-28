import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../services/supabase";
import type { Team } from "../types";
import PageHeader from "../components/PageHeader";

type TeamMember = {
  id: string;
  role: string;
  profiles: { email: string | null } | { email: string | null }[] | null;
};

function memberEmail(member: TeamMember) {
  if (Array.isArray(member.profiles)) {
    return member.profiles[0]?.email ?? "Unknown";
  }
  return member.profiles?.email ?? "Unknown";
}

export default function TeamPage() {
  const { id } = useParams();
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTeam = useCallback(async () => {
    if (!supabase || !id) {
      setLoading(false);
      return;
    }

    setError(null);

    const { data: teamData, error: teamError } = await supabase
      .from("teams")
      .select("*")
      .eq("id", id)
      .single();

    if (teamError) {
      setError(teamError.message);
      setLoading(false);
      return;
    }

    setTeam(teamData);

    const { data: memberData, error: memberError } = await supabase
      .from("team_members")
      .select(`
        id,
        role,
        profiles (
          email
        )
      `)
      .eq("team_id", id);

    if (memberError) setError(memberError.message);
    else setMembers(memberData ?? []);

    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  async function inviteMember() {
    if (!supabase || !id) return;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email.trim())
      .maybeSingle();

    if (profileError) {
      setError(profileError.message);
      return;
    }

    if (!profile) {
      setError("No user found with that email. They need to sign in once first.");
      return;
    }

    const { error: inviteError } = await supabase.from("team_members").insert({
      team_id: id,
      user_id: profile.id,
      role: "member",
    });

    if (inviteError) {
      setError(inviteError.message);
      return;
    }

    setEmail("");
    loadTeam();
  }

  if (loading) {
    return <p className="text-[var(--color-muted)]">Loading team…</p>;
  }

  if (!team) {
    return <p className="text-rose-400">{error ?? "Team not found."}</p>;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Squad"
        title={team.name}
        description={`Team ID: ${team.id}`}
        action={
          <Link to="/teams" className="btn btn-sm">
            ← Back to teams
          </Link>
        }
      />

      {error && (
        <p className="mb-4 text-sm text-rose-400" role="alert">
          {error}
        </p>
      )}

      <section className="glass-card mb-6 p-6">
        <h2 className="mb-4 text-xl">Members</h2>
        {members.length === 0 ? (
          <p className="text-[var(--color-muted)]">No members yet.</p>
        ) : (
          <ul className="space-y-2">
            {members.map((member) => (
              <li key={member.id}>
                {member.role} — {memberEmail(member)}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="glass-card p-6">
        <h2 className="mb-4 text-xl">Invite member</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            className="field mb-0 flex-1"
            placeholder="User email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="button" className="btn btn-primary" onClick={inviteMember}>
            Invite
          </button>
        </div>
      </section>
    </div>
  );
}
