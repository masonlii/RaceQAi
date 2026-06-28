import { useState } from "react";
import { supabase } from "../services/supabase";

export default function SetupGenerator() {
  const [track, setTrack] = useState("");
  const [car, setCar] = useState("");
  const [weather, setWeather] = useState("");
  const [drivingStyle, setDrivingStyle] = useState("");
  const [setup, setSetup] = useState("");

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
    `);
  };

  const saveSetup = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("You must be logged in.");
      return;
    }

    if (!setup) {
      alert("Generate a setup first.");
      return;
    }

    const { error } = await supabase
      .from("setups")
      .insert([
        {
          user_id: userData.user.id,
          track,
          car,
          weather,
          driving_style: drivingStyle,
          setup_data: setup,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Setup saved successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8">
          AI Setup Generator
        </h1>

        <div className="bg-slate-900 p-6 rounded-xl">
          <div className="space-y-4">

            <input
              className="w-full p-3 rounded bg-slate-800"
              placeholder="Track"
              value={track}
              onChange={(e) => setTrack(e.target.value)}
            />

            <input
              className="w-full p-3 rounded bg-slate-800"
              placeholder="Car"
              value={car}
              onChange={(e) => setCar(e.target.value)}
            />

            <input
              className="w-full p-3 rounded bg-slate-800"
              placeholder="Weather"
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
            />

            <input
              className="w-full p-3 rounded bg-slate-800"
              placeholder="Driving Style"
              value={drivingStyle}
              onChange={(e) => setDrivingStyle(e.target.value)}
            />

            <div className="flex gap-4">
              <button
                onClick={generateSetup}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
              >
                Generate Setup
              </button>

              <button
                onClick={saveSetup}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg"
              >
                Save Setup
              </button>
            </div>

          </div>
        </div>

        {setup && (
          <div className="bg-slate-900 p-6 rounded-xl mt-8">
            <h2 className="text-2xl font-bold mb-4">
              Generated Setup
            </h2>

            <pre className="whitespace-pre-wrap text-slate-300">
              {setup}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}