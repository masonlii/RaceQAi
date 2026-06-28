import { useState } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";

export default function SetupGenerator() {
  const { user } = useAuth();
  const [track, setTrack] = useState("");
  const [car, setCar] = useState("");
  const [weather, setWeather] = useState("");
  const [drivingStyle, setDrivingStyle] = useState("");
  const [setup, setSetup] = useState("");
  const [error, setError] = useState<string | null>(null);

  const generateSetup = () => {
    setSetup(`
Track: ${track}
Car: ${car}
Weather: ${weather}
Driving Style: ${drivingStyle}

Recommended Setup:

Front Wing: 6
Rear Wing: 8
Brake Bias: 54%
Tire Pressure: Medium

Notes:
This setup is optimized for ${weather} conditions and a ${drivingStyle} driving style.
    `.trim());
  };

  const saveSetup = async () => {
    if (!supabase || !user) {
      alert("You must be logged in.");
      return;
    }

    if (!setup || !track.trim() || !car.trim()) {
      alert("Enter track and car, then generate a setup first.");
      return;
    }

    const { error: insertError } = await supabase.from("setups").insert({
      user_id: user.id,
      name: `${track.trim()} — ${car.trim()}`,
      track: track.trim(),
      car: car.trim(),
      weather: weather.trim() || null,
      driving_style: drivingStyle.trim() || null,
      setup_data: setup,
      notes: setup,
    });

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setError(null);
    alert("Setup saved successfully!");
  };

  return (
    <div>
      <PageHeader
        eyebrow="AI tools"
        title="Setup generator"
        description="Generate a starter setup, then save it to your vault."
      />

      <div className="glass-card max-w-4xl p-6">
        <div className="space-y-4">
          <input
            className="field mb-0 w-full"
            placeholder="Track"
            value={track}
            onChange={(e) => setTrack(e.target.value)}
          />

          <input
            className="field mb-0 w-full"
            placeholder="Car"
            value={car}
            onChange={(e) => setCar(e.target.value)}
          />

          <input
            className="field mb-0 w-full"
            placeholder="Weather"
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
          />

          <input
            className="field mb-0 w-full"
            placeholder="Driving style"
            value={drivingStyle}
            onChange={(e) => setDrivingStyle(e.target.value)}
          />

          <div className="flex flex-wrap gap-4">
            <button type="button" className="btn btn-primary" onClick={generateSetup}>
              Generate setup
            </button>
            <button type="button" className="btn" onClick={saveSetup}>
              Save setup
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-rose-400" role="alert">
          {error}
        </p>
      )}

      {setup && (
        <div className="glass-card mt-6 max-w-4xl p-6">
          <h2 className="mb-4 text-2xl">Generated setup</h2>
          <pre className="whitespace-pre-wrap text-[var(--color-muted)]">
            {setup}
          </pre>
        </div>
      )}
    </div>
  );
}
