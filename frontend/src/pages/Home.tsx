import { Link } from "react-router-dom";
import { AUTH_ENABLED } from "../config";
import { isSupabaseConfigured } from "../services/supabase";
import { useAuth } from "../context/AuthContext";
import {
  ChevronRightIcon,
  GaugeIcon,
  SparklesIcon,
  UsersIcon,
  WrenchIcon,
  ZapIcon,
} from "../components/icons";

const STAGGER = ["delay-1", "delay-2", "delay-3", "delay-4", "delay-5"] as const;

const FEATURES = [
  {
    title: "Squad HQ",
    body: "Build your team, roster drivers, and stay synced across every split.",
    icon: UsersIcon,
    span: "md:col-span-2",
    accent: "from-violet-500/20 to-fuchsia-500/10",
  },
  {
    title: "Setup Vault",
    body: "Drop quali, race, and wet setups per track. Share with the crew instantly.",
    icon: WrenchIcon,
    span: "",
    accent: "from-rose-500/20 to-orange-500/10",
  },
  {
    title: "AI Race Engineer",
    body: "Get setup tweaks tuned to car, track, weather, and your driving style.",
    icon: SparklesIcon,
    span: "md:col-span-2",
    accent: "from-cyan-500/15 to-violet-500/15",
  },
  {
    title: "Live Telemetry",
    body: "Track pressures, temps, and lap trends — coming soon for the full send.",
    icon: GaugeIcon,
    span: "",
    accent: "from-emerald-500/15 to-cyan-500/10",
  },
] as const;

export default function Home() {
  const { user } = useAuth();

  const ctaHref = AUTH_ENABLED
    ? user
      ? "/dashboard"
      : "/login"
    : "/dashboard";

  return (
    <div className="pb-8">
      <section className="relative mb-16 overflow-hidden text-center">
        <div className="hero-glow" aria-hidden />
        <div
          className="speed-line top-[28%] w-[40%] left-[10%]"
          aria-hidden
        />
        <div
          className="speed-line top-[62%] w-[55%] right-[5%]"
          style={{ animationDelay: "1.5s" }}
          aria-hidden
        />

        <div className="animate-fade-up relative mx-auto max-w-4xl px-2 pt-8 sm:pt-12">
          <div className="chip mx-auto mb-6 w-fit">
            <ZapIcon className="h-3.5 w-3.5" />
            Built for iRacing grinders
          </div>

          <h1 className="mb-4 text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Your AI{" "}
            <span className="text-gradient">Race Engineer</span>
            <br />
            for the grid
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-[var(--color-muted)] sm:text-xl">
            Teams, setups, and smart tuning — built for the sim racers who
            actually care about lap time. No boomer spreadsheets required.
          </p>

          {isSupabaseConfigured || !AUTH_ENABLED ? (
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to={ctaHref} className="btn btn-primary btn-lg group">
                {AUTH_ENABLED && user ? "Enter the pit" : "Hit the track"}
                <ChevronRightIcon className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link to="/setups" className="btn btn-lg">
                Browse setups
              </Link>
            </div>
          ) : (
            <SetupNotice />
          )}
        </div>
      </section>

      <section className="animate-fade-up delay-2 mb-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Feature grid</p>
            <h2 className="text-2xl md:text-3xl">Everything in one pit wall</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </section>

      <section className="animate-fade-up delay-3 glass-card overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="eyebrow">Why RaceIQ</p>
            <h2 className="text-2xl md:text-3xl">Built different. Built fast.</h2>
            <p className="mt-2 max-w-xl text-[var(--color-muted)]">
              From rookies chasing their first sub-50 to league vets dialing
              in tire temps — RaceIQ keeps your whole operation in sync.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <StatBlock label="Tracks" value="100+" />
            <StatBlock label="Setups" value="∞" />
            <StatBlock label="Vibes" value="Immaculate" />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[number];
  index: number;
}) {
  const Icon = feature.icon;

  return (
    <article
      className={`glass-card glass-card-hover group relative overflow-hidden p-6 ${feature.span} animate-fade-up ${STAGGER[Math.min(index, STAGGER.length - 1)]}`}
    >
      <div
        aria-hidden
        className={`absolute inset-0 bg-gradient-to-br opacity-60 ${feature.accent}`}
      />
      <div className="relative">
        <div className="feature-icon transition-colors duration-200 group-hover:border-[rgba(244,63,94,0.45)] group-hover:text-white">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-xl">{feature.title}</h3>
        <p className="text-[var(--color-muted)]">{feature.body}</p>
      </div>
    </article>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="stat-value text-2xl md:text-3xl">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-widest text-[var(--color-muted)]">
        {label}
      </p>
    </div>
  );
}

function SetupNotice() {
  return (
    <div className="glass-card mx-auto max-w-xl border-[rgba(124,58,237,0.35)] p-6 text-left">
      <div className="feature-icon mb-4 w-fit">
        <WrenchIcon className="h-6 w-6" />
      </div>
      <h3 className="text-xl">Connect your backend</h3>
      <p className="mt-2 text-[var(--color-muted)]">
        Hook up Supabase to unlock teams and setups. Copy{" "}
        <code>frontend/.env.example</code> to <code>frontend/.env</code> and
        paste your project keys — takes two minutes.
      </p>
    </div>
  );
}
