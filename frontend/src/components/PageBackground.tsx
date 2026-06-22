export default function PageBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-mesh absolute inset-0" />
      <div className="bg-grid absolute inset-0 opacity-40" />
      <div className="orb orb-purple absolute -left-32 top-[-10%] h-[520px] w-[520px]" />
      <div className="orb orb-rose absolute -right-24 top-[20%] h-[420px] w-[420px]" />
      <div className="orb orb-violet absolute bottom-[-15%] left-[30%] h-[480px] w-[480px]" />
      <div className="scanlines absolute inset-0" />
    </div>
  );
}
