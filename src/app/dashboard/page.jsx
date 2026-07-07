import { redirect } from "next/navigation";
import { getTeamIdFromSession, clearTeamSession } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { submitTask, submitInquiry } from "./actions";

const CHESS_GLYPH = {
  pawn: "♙",
  knight: "♘",
  bishop: "♗",
  rook: "♖",
  queen: "♕",
  king: "♔",
};

async function logoutTeam() {
  "use server";
  await clearTeamSession();
  redirect("/login");
}

function ProgressBar({ label, current, max }) {
  const pct = max > 0 ? Math.min(Math.max((current / max) * 100, 0), 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs font-poppins text-white/40 mb-1">
        <span>{label.current}</span>
        <span>{label.next}</span>
      </div>
      <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-white/40 text-xs font-poppins mt-1">{max - current} pts to {label.next}</p>
    </div>
  );
}

export default async function DashboardPage({ searchParams }) {
  const teamId = await getTeamIdFromSession();
  if (!teamId) redirect("/login");

  const supabaseAdmin = getSupabaseAdmin();
  const { data: team } = await supabaseAdmin
    .from("teams")
    .select("id, team_name, track, points")
    .eq("id", teamId)
    .single();

  if (!team) redirect("/login");

  const { data: badge } = await supabaseAdmin
    .from("team_current_badge")
    .select("*")
    .eq("team_id", teamId)
    .single();

  const { data: badges } = await supabaseAdmin
    .from("badges")
    .select("*")
    .order("points_threshold", { ascending: true });

  const nextBadge = (badges || []).find((b) => b.points_threshold > team.points);

  const requestedWeek = searchParams?.week ? Number(searchParams.week) : null;
  const { data: weeks } = await supabaseAdmin
    .from("weeks")
    .select("*")
    .order("week_number", { ascending: true });

  const activeWeek =
    (requestedWeek && weeks?.find((w) => w.week_number === requestedWeek)) ||
    weeks?.find((w) => w.is_active) ||
    weeks?.[0];

  let workshops = [];
  let tasks = [];
  let submissionsByTask = {};
  let weekInquiries = [];

  if (activeWeek) {
   const [{ data: w }, { data: t }] = await Promise.all([
      supabaseAdmin
        .from("workshops")
        .select("*")
        .eq("week_id", activeWeek.id)
        .or(`track.is.null,track.eq.${team.track}`)
        .order("workshop_number", { ascending: true }),
      supabaseAdmin
        .from("tasks")
        .select("*")
        .eq("week_id", activeWeek.id)
        .order("created_at", { ascending: true }),
    ]);
    workshops = w || [];
    tasks = t || [];

    if (tasks.length) {
      const { data: subs } = await supabaseAdmin
        .from("submissions")
        .select("*")
        .eq("team_id", teamId)
        .in("task_id", tasks.map((t) => t.id));
      (subs || []).forEach((s) => (submissionsByTask[s.task_id] = s));
    }

    const { data: wi } = await supabaseAdmin
      .from("inquiries")
      .select("*")
      .eq("team_id", teamId)
      .eq("week_id", activeWeek.id)
      .order("created_at", { ascending: false });
    weekInquiries = wi || [];
  }

  const submittedCount = Object.values(submissionsByTask).filter((s) => s.status === "submitted").length;
  const reviewedCount = Object.values(submissionsByTask).filter((s) => s.status === "reviewed").length;
  const needsChangesCount = Object.values(submissionsByTask).filter((s) => s.status === "needs_changes").length;

  return (
    <div className="min-h-screen px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto flex flex-col gap-6 md:gap-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-header font-black uppercase text-white text-2xl md:text-3xl">
              {team.team_name}
            </h1>
            <p className="text-accent text-xs font-header font-black uppercase tracking-widest">
              {team.track}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`/dashboard`}
              className="text-white/30 hover:text-white text-xs font-poppins underline transition-colors"
            >
              Current week
            </a>
            <form action={logoutTeam}>
              <button className="text-white/40 hover:text-white text-sm font-poppins underline transition-colors">
                Log out
              </button>
            </form>
          </div>
        </div>

        {/* Badge + Points + Progress */}
        <div className="border border-white/10 backdrop-blur-md bg-black/20 rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-4 md:gap-5 mb-4">
            <div className="text-4xl md:text-5xl shrink-0 leading-none text-white">{CHESS_GLYPH[badge?.chess_piece] || "♙"}</div>
            <div className="min-w-0 flex-1">
              <p className="text-white/40 text-xs font-header font-black uppercase tracking-widest">Current Badge</p>
              <p className="font-header font-bold text-white text-lg md:text-xl">{badge?.name || "Pawn"}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-white/40 text-xs font-header font-black uppercase tracking-widest">Points</p>
              <p className="font-header font-black text-accent text-3xl md:text-4xl">{team.points}</p>
            </div>
          </div>
          {nextBadge && (
            <ProgressBar
              label={{ current: badge?.name || "Pawn", next: nextBadge.name }}
              current={team.points - (badge?.points_threshold ?? 0)}
              max={nextBadge.points_threshold - (badge?.points_threshold ?? 0)}
            />
          )}
        </div>

        {/* Task progress summary */}
        {tasks.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-white/10 backdrop-blur-md bg-black/20 rounded-xl p-3 md:p-4 text-center">
              <p className="font-header font-black text-white text-lg md:text-xl">{tasks.length}</p>
              <p className="text-white/40 text-[0.6rem] font-header font-black uppercase tracking-widest mt-0.5">Total Tasks</p>
            </div>
            <div className="border border-white/10 backdrop-blur-md bg-black/20 rounded-xl p-3 md:p-4 text-center">
              <p className="font-header font-black text-accent text-lg md:text-xl">{submittedCount + reviewedCount}</p>
              <p className="text-white/40 text-[0.6rem] font-header font-black uppercase tracking-widest mt-0.5">Submitted</p>
            </div>
            <div className="border border-white/10 backdrop-blur-md bg-black/20 rounded-xl p-3 md:p-4 text-center">
              <p className="font-header font-black text-green-400 text-lg md:text-xl">{reviewedCount}</p>
              <p className="text-white/40 text-[0.6rem] font-header font-black uppercase tracking-widest mt-0.5">Reviewed</p>
            </div>
          </div>
        )}

        {/* Week selector */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-accent text-xs font-header font-black uppercase tracking-widest">Week</h2>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(weeks || []).map((w) => (
              <a
                key={w.id}
                href={`/dashboard?week=${w.week_number}`}
                className={`px-4 py-2 rounded-xl text-sm font-poppins font-medium border transition-all ${
                  activeWeek?.id === w.id
                    ? "bg-accent text-black border-accent shadow-lg shadow-accent/20"
                    : "text-white/60 border-white/10 hover:border-accent/40 hover:text-white bg-black/20 backdrop-blur-md"
                }`}
              >
                Week {w.week_number}
              </a>
            ))}
          </div>
        </div>

        {activeWeek && (
          <>
            <div className="border-l-2 border-accent/40 pl-4">
              <h2 className="font-header font-bold text-white text-lg md:text-xl">{activeWeek.title}</h2>
              <p className="text-white/40 text-xs font-poppins mt-0.5">
                {activeWeek.start_date} &ndash; {activeWeek.end_date}
              </p>
            </div>

            {/* Workshops */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-accent text-xs font-header font-black uppercase tracking-widest">Workshops</h3>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {workshops.map((w) => (
                  <div
                    key={w.id}
                    className="border border-white/10 backdrop-blur-md bg-black/20 rounded-2xl p-5 hover:border-white/20 transition-colors"
                  >
                    <p className="text-white/30 text-[0.6rem] font-header font-black uppercase tracking-widest mb-1">
                      Workshop {w.workshop_number}
                    </p>
                    <p className="font-header font-bold text-white mb-1">{w.title}</p>
                    {w.speaker && (
                      <p className="text-white/40 text-xs font-poppins mb-3">with {w.speaker}</p>
                    )}
                    {w.recording_url ? (
                      <a
                        href={w.recording_url}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-sm font-poppins font-semibold text-black bg-accent px-4 py-1.5 rounded-lg hover:opacity-90 transition-all"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        Watch recording
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-poppins text-white/30 border border-white/10 px-3 py-1.5 rounded-lg">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" opacity="0.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                        Recording not uploaded yet
                      </span>
                    )}
                  </div>
                ))}
                {workshops.length === 0 && (
                  <p className="text-white/30 text-sm font-poppins col-span-full">
                    No workshops added for this week yet.
                  </p>
                )}
              </div>
            </div>

            {/* Tasks */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-accent text-xs font-header font-black uppercase tracking-widest">Weekly Missions</h3>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              <div className="flex flex-col gap-3">
                {tasks.map((task) => {
                  const sub = submissionsByTask[task.id];
                  return (
                    <div
                      key={task.id}
                      className="border border-white/10 backdrop-blur-md bg-black/20 rounded-2xl p-5 hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-header font-bold text-white">{task.title}</p>
                            {sub?.status === "reviewed" && (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            )}
                            {sub?.status === "needs_changes" && (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            )}
                          </div>
                          {task.description && (
                            <p className="text-white/50 text-sm font-poppins">{task.description}</p>
                          )}
                        </div>
                        <span className="shrink-0 text-xs font-poppins font-semibold text-accent border border-accent/30 bg-accent/10 px-2.5 py-1 rounded-full">
                          {task.points_value} pts
                        </span>
                      </div>

                      {sub ? (
                        <div className="text-sm font-poppins bg-white/5 rounded-lg px-3 py-2.5">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold ${
                              sub.status === "reviewed" ? "text-green-400" :
                              sub.status === "needs_changes" ? "text-red-400" : "text-accent"
                            }`}>
                              {sub.status === "submitted" ? "Awaiting review" :
                               sub.status === "reviewed" ? "Approved" : "Changes requested"}
                            </span>
                            {sub.status === "reviewed" && (
                              <span className="text-white/30">· {sub.points_awarded} pts awarded</span>
                            )}
                          </div>
                          <a href={sub.submission_url} target="_blank" className="text-accent underline break-all text-xs hover:text-white transition-colors">
                            {sub.submission_url}
                          </a>
                        </div>
                      ) : (
                        <form action={submitTask} className="mt-3 flex flex-col gap-2">
                          <input type="hidden" name="taskId" value={task.id} />
                          <input
                            name="submissionUrl"
                            placeholder="Link to your work (Drive, GitHub, etc.)"
                            required
                            className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-white text-sm font-poppins outline-none focus:border-accent transition-colors placeholder:text-white/30"
                          />
                          <textarea
                            name="notes"
                            placeholder="Notes for the reviewers (optional)"
                            rows={2}
                            className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-white text-sm font-poppins outline-none focus:border-accent transition-colors placeholder:text-white/30"
                          />
                          <button
                            type="submit"
                            className="self-start bg-accent text-black text-sm font-poppins font-semibold px-5 py-1.5 rounded-lg hover:opacity-90 transition-all flex items-center gap-1.5"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2z"/></svg>
                            Submit
                          </button>
                        </form>
                      )}
                    </div>
                  );
                })}
                {tasks.length === 0 && (
                  <p className="text-white/30 text-sm font-poppins">
                    No missions added for this week yet.
                  </p>
                )}
              </div>
            </div>

            {/* Inquiries */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-accent text-xs font-header font-black uppercase tracking-widest">Ask a Question</h3>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              <div className="border border-white/10 backdrop-blur-md bg-black/20 rounded-2xl p-5">
                {(weekInquiries || []).map((inq) => (
                  <div key={inq.id} className="mb-3 last:mb-0 border-b border-white/5 last:border-0 pb-3 last:pb-0">
                    <p className="text-white/80 text-sm font-poppins">{inq.question}</p>
                    {inq.answer ? (
                      <p className="text-green-300 text-xs font-poppins mt-1 bg-green-400/5 rounded-lg px-3 py-1.5">
                        <span className="text-green-400 font-semibold">Answer:</span> {inq.answer}
                      </p>
                    ) : (
                      <p className="text-white/30 text-xs font-poppins mt-1">Awaiting reply...</p>
                    )}
                  </div>
                ))}
                <form action={submitInquiry} className="flex flex-col gap-2 mt-3">
                  <input type="hidden" name="weekId" value={activeWeek.id} />
                  <textarea
                    name="question"
                    placeholder="Ask something about this week's workshops or missions..."
                    rows={2}
                    required
                    className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-white text-sm font-poppins outline-none focus:border-accent transition-colors placeholder:text-white/30"
                  />
                  <button
                    type="submit"
                    className="self-start bg-accent text-black text-sm font-poppins font-semibold px-5 py-1.5 rounded-lg hover:opacity-90 transition-all"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
