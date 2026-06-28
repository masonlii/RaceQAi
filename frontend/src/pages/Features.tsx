export default function Features() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-5xl font-bold mb-10">
        Features
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">
            AI Setup Generator
          </h2>

          <p>
            Generate race-ready setups based on
            car, track, weather, and driving style.
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">
            AI Race Engineer
          </h2>

          <p>
            Predict pit windows, fuel usage,
            tire wear, and race strategy.
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">
            Team Management
          </h2>

          <p>
            Manage drivers, teams, events,
            and shared race data.
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">
            Telemetry Analysis
          </h2>

          <p>
            Analyze performance data and
            identify areas for improvement.
          </p>
        </div>
      </div>
    </div>
  );
}