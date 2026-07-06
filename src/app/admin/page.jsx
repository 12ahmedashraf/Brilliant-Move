import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { AdminClient } from "./client";

export default async function AdminPage({ searchParams }) {
  if (!(await isAdmin())) redirect("/admin/login");

  const supabaseAdmin = getSupabaseAdmin();

  const tracksReq = supabaseAdmin.from("teams").select("track", { count: "exact", head: false }).neq("track", null);
  const weeksReq = supabaseAdmin.from("weeks").select("*").order("week_number", { ascending: true });
  const teamsReq = supabaseAdmin.from("teams").select("id, team_name, track, username, password_plaintext, points").order("team_name", { ascending: true });

  const [{ data: tracksRaw }, { data: weeks }, { data: teams }] = await Promise.all([
    tracksReq,
    weeksReq,
    teamsReq,
  ]);

  const tracks = [...new Set((tracksRaw || []).map((t) => t.track).filter(Boolean))].sort();

  const { data: inquiries } = await supabaseAdmin
    .from("inquiries")
    .select("*, teams!inner(id, team_name, track), weeks!inner(id, week_number, title)")
    .order("created_at", { ascending: false });

  const workshopsByWeek = {};
  const tasksByWeek = {};

  if (weeks?.length) {
    for (const week of weeks) {
      const [{ data: w }, { data: t }] = await Promise.all([
        supabaseAdmin.from("workshops").select("*").eq("week_id", week.id).order("workshop_number"),
        supabaseAdmin.from("tasks").select("*").eq("week_id", week.id).order("created_at"),
      ]);
      workshopsByWeek[week.id] = w || [];
      tasksByWeek[week.id] = t || [];
    }
  }

  const filters = await searchParams;
  const weekFilter = filters?.week || "";
  const trackFilter = filters?.track || "";
  const teamFilter = filters?.team || "";
  const statusFilter = filters?.status || "";

  let subQuery = supabaseAdmin
    .from("submissions")
    .select("*, tasks!inner(id, title, points_value, week_id), teams!inner(id, team_name, track, points)")
    .order("submitted_at", { ascending: false });

  if (statusFilter) subQuery = subQuery.eq("status", statusFilter);
  if (teamFilter) subQuery = subQuery.eq("team_id", teamFilter);
  if (trackFilter) subQuery = subQuery.eq("teams.track", trackFilter);
  if (weekFilter) subQuery = subQuery.eq("tasks.week_id", weekFilter);

  const { data: subs } = await subQuery;

  const totalTeams = teams?.length || 0;
  const pendingSubs = subs?.filter((s) => s.status === "submitted").length || 0;
  const reviewedSubs = subs?.filter((s) => s.status === "reviewed").length || 0;
  const totalPointsAll = teams?.reduce((sum, t) => sum + (t.points || 0), 0) || 0;

  const subsByWeek = {};
  const weekNames = {};
  if (weeks) for (const w of weeks) weekNames[w.id] = w;

  for (const sub of subs || []) {
    const wid = sub.tasks?.week_id;
    if (!wid) continue;
    if (!subsByWeek[wid]) subsByWeek[wid] = [];
    subsByWeek[wid].push(sub);
  }

  const activeFilterCount = [weekFilter, trackFilter, teamFilter, statusFilter].filter(Boolean).length;

  return (
    <AdminClient
      weeks={weeks || []}
      teams={teams || []}
      tracks={tracks}
      inquiries={inquiries || []}
      workshopsByWeek={workshopsByWeek}
      tasksByWeek={tasksByWeek}
      subsByWeek={subsByWeek}
      weekNames={weekNames}
      totalTeams={totalTeams}
      pendingSubs={pendingSubs}
      reviewedSubs={reviewedSubs}
      totalPointsAll={totalPointsAll}
      weekFilter={weekFilter}
      trackFilter={trackFilter}
      teamFilter={teamFilter}
      statusFilter={statusFilter}
      activeFilterCount={activeFilterCount}
    />
  );
}
