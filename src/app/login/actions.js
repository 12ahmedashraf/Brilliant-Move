"use server";

import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { setTeamSession, clearTeamSession } from "@/lib/session";
import bcrypt from "bcryptjs";

export async function loginTeam(prevState, formData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!username || !password) return { error: "Username and password required." };

  const supabaseAdmin = getSupabaseAdmin();
  const { data: team, error } = await supabaseAdmin
    .from("teams")
    .select("id, password_hash")
    .eq("username", username)
    .single();

  if (error || !team) return { error: "Invalid credentials." };

  const valid = await bcrypt.compare(password, team.password_hash);
  if (!valid) return { error: "Invalid credentials." };

  await setTeamSession(team.id);
  redirect("/dashboard");
}

export async function logoutTeam() {
  await clearTeamSession();
  redirect("/login");
}
