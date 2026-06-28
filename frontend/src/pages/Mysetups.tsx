import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function MySetups() {
  const [setups, setSetups] = useState<any[]>([]);

  useEffect(() => {
    loadSetups();
  }, []);

  async function loadSetups() {
    const { data, error } = await supabase
      .from("setups")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSetups(data);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-5xl font-bold mb-8">
        My Setups
      </h1>

      <div className="space-y-4">
        {setups.map((setup) => (
          <div
            key={setup.id}
            className="bg-slate-900 p-6 rounded-xl"
          >
            <h2 className="text-2xl font-bold">
              {setup.track} - {setup.car}
            </h2>

            <p className="text-slate-400">
              Weather: {setup.weather}
            </p>

            <pre className="mt-4 whitespace-pre-wrap">
              {setup.setup_data}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}