"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getTeamIdFromSession } from "@/lib/session";

export async function submitTask(formData) {
  const teamId = await getTeamIdFromSession();
  if (!teamId) return { error: "Not logged in." };

  const taskId = formData.get("taskId");
  const submissionUrl = String(formData.get("submissionUrl") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!submissionUrl) return { error: "Please add a link to your work." };

  const supabaseAdmin = getSupabaseAdmin();
  const { error } = await supabaseAdmin.from("submissions").upsert(
    {
      task_id: taskId,
      team_id: teamId,
      submission_url: submissionUrl,
      notes,
      status: "submitted",
      submitted_at: new Date().toISOString(),
    },
    { onConflict: "task_id,team_id" }
  );

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}

export async function submitInquiry(formData) {
  const teamId = await getTeamIdFromSession();
  if (!teamId) return { error: "Not logged in." };

  const weekId = formData.get("weekId");
  const question = String(formData.get("question") || "").trim();
  if (!weekId || !question) return { error: "Week and question required." };

  const supabaseAdmin = getSupabaseAdmin();
  const { error } = await supabaseAdmin.from("inquiries").insert({
    team_id: teamId,
    week_id: weekId,
    question,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  return { success: true };
}
