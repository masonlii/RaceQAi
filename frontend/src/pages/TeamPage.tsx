import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function TeamPage() {
  const { id } = useParams();

  const [team, setTeam] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    loadTeam();
  }, []);

  async function loadTeam() {
    const { data: teamData } = await supabase
      .from("teams")
      .select("*")
      .eq("id", id)
      .single();

    setTeam(teamData);

    const { data: memberData } = await supabase
      .from("team_members")
      .select(`
        id,
        role,
        profiles (
          email
        )
      `)
      .eq("team_id", id);

    setMembers(memberData || []);
  }


  async function inviteMember() {

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();


    if (!profile) {
      alert("User not found");
      return;
    }


    const { error } = await supabase
      .from("team_members")
      .insert([
        {
          team_id: id,
          user_id: profile.id,
          role: "member",
        },
      ]);


    if (error) {
      alert(error.message);
      return;
    }


    setEmail("");

    loadTeam();
  }


  if (!team) {
    return <div>Loading...</div>;
  }


  return (
    <div style={{ padding:"20px" }}>

      <Link to="/dashboard">
        ← Back
      </Link>


      <h1>{team.Name}</h1>


      <p>
        Team ID: {team.id}
      </p>


      <h2>Members</h2>


      <ul>
        {members.map((member)=>(
          <li key={member.id}>
            {member.role} - {member.profiles?.email}
          </li>
        ))}
      </ul>


      <hr />


      <h2>Invite Member</h2>


      <input
        type="email"
        placeholder="User email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />


      <button onClick={inviteMember}>
        Invite
      </button>


    </div>
  );
}