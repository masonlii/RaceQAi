import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const login = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });

    if (error) {
      alert(error.message);
      return;
    }
  };

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN" && session?.user) {
      await supabase.from("profiles").upsert([
        {
          id: session.user.id,
          email: session.user.email,
        },
      ]);

      navigate("/dashboard");
    }
  });

  return (
    <div>
      <h1>Login</h1>

      <button onClick={login}>
        Login with GitHub
      </button>
    </div>
  );
}
