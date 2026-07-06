"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdmin, clearAdminSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function createWeek(formData) {
  if (!(await isAdmin())) return { error: "Unauthorized." };
  const supabaseAdmin = getSupabaseAdmin();

  const weekNumber = Number(formData.get("week_number"));
  const title = String(formData.get("title") || "").trim();
  const startDate = String(formData.get("start_date") || "").trim();
  const endDate = String(formData.get("end_date") || "").trim();

  if (!weekNumber || !title) return { error: "Week number and title required." };

  const { error } = await supabaseAdmin.from("weeks").upsert(
    { week_number: weekNumber, title, start_date: startDate, end_date: endDate },
    { onConflict: "week_number" }
  );

  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteWeek(formData) {
  if (!(await isAdmin())) return { error: "Unauthorized." };
  const supabaseAdmin = getSupabaseAdmin();

  const weekId = formData.get("weekId");
  await supabaseAdmin.from("weeks").delete().eq("id", weekId);
  revalidatePath("/admin");
  return { success: true };
}

export async function setActiveWeek(formData) {
  if (!(await isAdmin())) return { error: "Unauthorized." };
  const supabaseAdmin = getSupabaseAdmin();

  const weekId = formData.get("weekId");

  await supabaseAdmin.from("weeks").update({ is_active: false }).neq("id", "none");
  await supabaseAdmin.from("weeks").update({ is_active: true }).eq("id", weekId);

  revalidatePath("/admin");
  return { success: true };
}

export async function addWorkshop(formData) {
  if (!(await isAdmin())) return { error: "Unauthorized." };
  const supabaseAdmin = getSupabaseAdmin();

  const weekId = formData.get("weekId");
  const workshopNumber = Number(formData.get("workshop_number"));
  const title = String(formData.get("title") || "").trim();
  const speaker = String(formData.get("speaker") || "").trim();
  const recordingUrl = String(formData.get("recording_url") || "").trim();

  if (!weekId || !workshopNumber || !title) return { error: "Required fields missing." };

  const { error } = await supabaseAdmin.from("workshops").upsert(
    {
      week_id: weekId,
      workshop_number: workshopNumber,
      title,
      speaker: speaker || null,
      recording_url: recordingUrl || null,
    },
    { onConflict: "week_id,workshop_number" }
  );

  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteWorkshop(formData) {
  if (!(await isAdmin())) return { error: "Unauthorized." };
  const supabaseAdmin = getSupabaseAdmin();

  const workshopId = formData.get("workshopId");
  await supabaseAdmin.from("workshops").delete().eq("id", workshopId);
  revalidatePath("/admin");
  return { success: true };
}

export async function addTask(formData) {
  if (!(await isAdmin())) return { error: "Unauthorized." };
  const supabaseAdmin = getSupabaseAdmin();

  const weekId = formData.get("weekId");
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const pointsValue = Number(formData.get("points_value")) || 10;

  if (!weekId || !title) return { error: "Title required." };

  const { error } = await supabaseAdmin.from("tasks").insert({
    week_id: weekId,
    title,
    description: description || null,
    points_value: pointsValue,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteTask(formData) {
  if (!(await isAdmin())) return { error: "Unauthorized." };
  const supabaseAdmin = getSupabaseAdmin();

  const taskId = formData.get("taskId");
  await supabaseAdmin.from("tasks").delete().eq("id", taskId);
  revalidatePath("/admin");
  return { success: true };
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 20);
}

function randomPassword(length = 8) {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < length; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export async function addTeam(prevState, formData) {
  if (!(await isAdmin())) return { error: "Unauthorized." };
  const supabaseAdmin = getSupabaseAdmin();

  const teamName = String(formData.get("team_name") || "").trim();
  const track = String(formData.get("track") || "").trim();

  if (!teamName || !track) return { error: "Team name and track required." };

  const username = slugify(teamName) + "_" + Math.random().toString(36).slice(2, 6);
  const password = randomPassword();
  const password_hash = await bcrypt.hash(password, 10);

  const { error } = await supabaseAdmin.from("teams").insert({
    team_name: teamName,
    track,
    username,
    password_hash,
    password_plaintext: password,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: true, username, password, team_name: teamName };
}

export async function reviewSubmission(formData) {
  if (!(await isAdmin())) return { error: "Unauthorized." };
  const supabaseAdmin = getSupabaseAdmin();

  const submissionId = formData.get("submissionId");
  const status = formData.get("status");
  const pointsAwarded = Number(formData.get("points_awarded")) || 0;
  const reviewerNotes = String(formData.get("reviewer_notes") || "").trim();

  const { data: sub } = await supabaseAdmin
    .from("submissions")
    .select("*, tasks!inner(points_value)")
    .eq("id", submissionId)
    .single();

  if (!sub) return { error: "Submission not found." };

  const { error } = await supabaseAdmin
    .from("submissions")
    .update({
      status,
      points_awarded: pointsAwarded,
      reviewed_at: new Date().toISOString(),
      reviewer_notes: reviewerNotes || null,
    })
    .eq("id", submissionId);

  if (error) return { error: error.message };

  const { data: teamSubs } = await supabaseAdmin
    .from("submissions")
    .select("points_awarded")
    .eq("team_id", sub.team_id)
    .eq("status", "reviewed");

  const totalPoints = (teamSubs || []).reduce((sum, s) => sum + (s.points_awarded || 0), 0);

  await supabaseAdmin.from("teams").update({ points: totalPoints }).eq("id", sub.team_id);

  revalidatePath("/admin");
  return { success: true };
}

export async function resetTeamPassword(formData) {
  if (!(await isAdmin())) return { error: "Unauthorized." };
  const supabaseAdmin = getSupabaseAdmin();

  const teamId = formData.get("teamId");
  if (!teamId) return { error: "Team ID required." };

  const newPassword = randomPassword();
  const password_hash = await bcrypt.hash(newPassword, 10);

  const { error } = await supabaseAdmin
    .from("teams")
    .update({ password_hash, password_plaintext: newPassword })
    .eq("id", teamId);

  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: true, password: newPassword };
}

export async function backfillPasswords() {
  if (!(await isAdmin())) return { error: "Unauthorized." };
  const supabaseAdmin = getSupabaseAdmin();

  const { data: teams } = await supabaseAdmin
    .from("teams")
    .select("id")
    .is("password_plaintext", null);

  if (!teams?.length) return { success: true, count: 0 };

  for (const team of teams) {
    const newPassword = randomPassword();
    const password_hash = await bcrypt.hash(newPassword, 10);
    await supabaseAdmin
      .from("teams")
      .update({ password_hash, password_plaintext: newPassword })
      .eq("id", team.id);
  }

  revalidatePath("/admin");
  return { success: true, count: teams.length };
}

export async function deleteTeam(formData) {
  if (!(await isAdmin())) return { error: "Unauthorized." };
  const supabaseAdmin = getSupabaseAdmin();

  const teamId = formData.get("teamId");
  if (!teamId) return { error: "Team ID required." };

  const { error } = await supabaseAdmin.from("teams").delete().eq("id", teamId);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: true };
}

export async function answerInquiry(formData) {
  if (!(await isAdmin())) return { error: "Unauthorized." };
  const supabaseAdmin = getSupabaseAdmin();

  const inquiryId = formData.get("inquiryId");
  const answer = String(formData.get("answer") || "").trim();
  if (!inquiryId || !answer) return { error: "Inquiry ID and answer required." };

  const { error } = await supabaseAdmin
    .from("inquiries")
    .update({ answer, answered_at: new Date().toISOString() })
    .eq("id", inquiryId);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: true };
}
