type LoadingStateProps = {
  label?: string;
};

export default function LoadingState({ label = "Loading" }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="loader-ring" aria-hidden />
      <p className="text-sm uppercase tracking-[0.2em] text-muted">{label}…</p>
    </div>
  );
}

export function SkeletonCards({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card animate-pulse p-5">
          <div className="mb-3 h-4 w-1/3 rounded bg-white/10" />
          <div className="mb-2 h-3 w-full rounded bg-white/10" />
          <div className="h-3 w-2/3 rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}
