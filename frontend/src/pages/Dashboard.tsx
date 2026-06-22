import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AUTH_ENABLED } from "../config";
import { supabase } from "../services/supabase";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";
import {
  ChevronRightIcon,
  GaugeIcon,
  UsersIcon,
  WrenchIcon,
} from "../components/icons";

export default function Dashboard() {
  const { user } = useAuth();
  const [teamCount, setTeamCount] = useState<number | null>(null);
  const [setupCount, setSetupCount] = useState<number | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("teams")
      .select("*", { count: "exact", head: true })
      .then(({ count }) => setTeamCount(count ?? 0));
    supabase
      .from("setups")
      .select("*", { count: "exact", head: true })
      .then(({ count }) => setSetupCount(count ?? 0));
  }, []);

  const signedInAs = AUTH_ENABLED
    ? (user?.email ?? "driver")
    : "preview mode";

  return (
    <div>
      <PageHeader
        eyebrow="Pit wall"
        title="Dashboard"
        description={`Session active · ${signedInAs}`}
      />

      <div className="animate-fade-up delay-1 mb-10 grid gap-4 sm:grid-cols-2">
        <StatCard
          to="/teams"
          icon={UsersIcon}
          label="Teams"
          value={teamCount}
          hint="Manage your squad"
        />
        <StatCard
          to="/setups"
          icon={GaugeIcon}
          label="Setups"
          value={setupCount}
          hint="Tune and share"
        />
      </div>

      <section className="animate-fade-up delay-2">
        <h2 className="mb-4 text-xl">Quick deploy</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <ActionCard
            to="/teams"
            icon={UsersIcon}
            title="Team management"
            body="Create squads, roster drivers, keep everyone locked in."
          />
          <ActionCard
            to="/setups"
            icon={WrenchIcon}
            title="Setup garage"
            body="Save quali and race setups per track. Share with the crew."
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  to,
  icon: Icon,
  label,
  value,
  hint,
}: {
  to: string;
  icon: typeof UsersIcon;
  label: string;
  value: number | null;
  hint: string;
}) {
  return (
    <Link to={to} className="glass-card glass-card-hover group block p-6 no-underline">
      <div className="mb-4 flex items-center justify-between">
        <div className="feature-icon mb-0">
          <Icon className="h-6 w-6" />
        </div>
        <ChevronRightIcon className="h-5 w-5 text-[var(--color-muted)] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white" />
      </div>
      <p className="stat-value">{value ?? "—"}</p>
      <p className="mt-1 font-semibold text-white">{label}</p>
      <p className="text-sm text-[var(--color-muted)]">{hint}</p>
    </Link>
  );
}

function ActionCard({
  to,
  icon: Icon,
  title,
  body,
}: {
  to: string;
  icon: typeof WrenchIcon;
  title: string;
  body: string;
}) {
  return (
    <Link
      to={to}
      className="glass-card glass-card-hover group flex items-start gap-4 p-5 no-underline"
    >
      <div className="feature-icon mb-0 shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="mb-1 text-lg">{title}</h3>
        <p className="text-sm text-[var(--color-muted)]">{body}</p>
      </div>
    </Link>
  );
}
