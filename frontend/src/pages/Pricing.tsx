export default function Pricing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-5xl font-bold text-center mb-12">
        Pricing
      </h1>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-slate-900 p-8 rounded-xl">
          <h2 className="text-2xl font-bold">Free</h2>
          <p className="text-4xl font-bold mt-4">$0</p>

          <ul className="mt-6 space-y-2">
            <li>1 Driver</li>
            <li>Basic Setup Generator</li>
            <li>5 AI Requests Per Day</li>
          </ul>
        </div>

        <div className="bg-blue-600 p-8 rounded-xl">
          <h2 className="text-2xl font-bold">Pro</h2>
          <p className="text-4xl font-bold mt-4">$19/mo</p>

          <ul className="mt-6 space-y-2">
            <li>Unlimited AI Requests</li>
            <li>AI Race Engineer</li>
            <li>Telemetry Analysis</li>
            <li>Unlimited Setups</li>
          </ul>
        </div>

        <div className="bg-slate-900 p-8 rounded-xl">
          <h2 className="text-2xl font-bold">Team</h2>
          <p className="text-4xl font-bold mt-4">$99/mo</p>

          <ul className="mt-6 space-y-2">
            <li>Multi-Driver Teams</li>
            <li>Shared Setups</li>
            <li>Team Dashboard</li>
            <li>Advanced Strategy AI</li>
          </ul>
        </div>
      </div>
    </div>
  );
}