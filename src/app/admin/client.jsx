"use client";

import { useRouter } from "next/navigation";
import { useState, useActionState } from "react";
import {
  logoutAdmin,
  createWeek,
  deleteWeek,
  setActiveWeek,
  addWorkshop,
  deleteWorkshop,
  addTask,
  deleteTask,
  addTeam,
  reviewSubmission,
  resetTeamPassword,
  backfillPasswords,
  deleteTeam,
  answerInquiry,
} from "./actions";

const TRACKS = [
  "Science & Engineering",
  "AI & Programming",
  "Visual Arts & Literature",
  "Startups & Business",
];

function ResetPasswordButton({ teamId }) {
  const [newPassword, setNewPassword] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    setLoading(true);
    const fd = new FormData();
    fd.set("teamId", teamId);
    const result = await resetTeamPassword(fd);
    setLoading(false);
    if (result?.success) {
      setNewPassword(result.password);
    }
  }

  if (newPassword) {
    return (
      <span className="text-green-400 text-xs font-mono" title="New password">
        {newPassword}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleReset}
      disabled={loading}
      className="text-white/30 hover:text-accent text-[0.6rem] font-poppins underline transition-colors disabled:opacity-30"
    >
      {loading ? "..." : "Reset pwd"}
    </button>
  );
}

function DeleteTeamButton({ teamId, teamName }) {
  const router = useRouter();

  async function handleDelete() {
    if (!window.confirm(`Delete "${teamName}"? This cannot be undone.`)) return;
    const fd = new FormData();
    fd.set("teamId", teamId);
    await deleteTeam(fd);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-white/20 hover:text-red-400 text-[0.6rem] font-poppins underline transition-colors ml-2"
    >
      Delete
    </button>
  );
}

function AddTeamForm({ router, onClose }) {
  const [state, formAction, pending] = useActionState(addTeam, null);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input name="team_name" placeholder="Team Name" required className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-white text-sm font-poppins outline-none focus:border-accent transition-colors placeholder:text-white/30" />
      <select name="track" required className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-white text-sm font-poppins outline-none focus:border-accent transition-colors">
        <option value="">Select track</option>
        {TRACKS.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <button type="submit" disabled={pending} className="bg-accent text-black text-sm font-poppins font-semibold py-2 rounded-lg hover:opacity-90 transition-all disabled:opacity-50">
        {pending ? "Adding..." : "Add Team"}
      </button>
      {state?.error && (
        <p className="text-red-400 text-xs font-poppins bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{state.error}</p>
      )}
      {state?.success && (
        <div className="text-green-400 text-xs font-poppins bg-green-400/10 border border-green-400/20 rounded-lg px-3 py-2 space-y-0.5">
          <p className="font-semibold">{state.team_name} added!</p>
          <p>Username: <span className="font-mono text-white">{state.username}</span></p>
          <p>Password: <span className="font-mono text-white">{state.password}</span></p>
        </div>
      )}
      <div className="flex gap-2 mt-1">
        <button type="button" onClick={onClose} className="text-white/40 hover:text-white text-xs font-poppins underline transition-colors">
          Close
        </button>
      </div>
    </form>
  );
}

function FilterBar({ label, options, current, paramKey }) {
  const router = useRouter();

  return (
    <select
      value={current}
      onChange={(e) => {
        const params = new URLSearchParams(window.location.search);
        if (e.target.value) params.set(paramKey, e.target.value);
        else params.delete(paramKey);
        router.push(`/admin?${params.toString()}`);
      }}
      className="rounded-lg bg-black/40 border border-white/10 px-3 py-1.5 text-white text-xs font-poppins outline-none focus:border-accent transition-colors min-w-[100px]"
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function AdminClient({
  weeks,
  teams,
  tracks,
  inquiries,
  workshopsByWeek,
  tasksByWeek,
  subsByWeek,
  weekNames,
  totalTeams,
  pendingSubs,
  reviewedSubs,
  totalPointsAll,
  weekFilter,
  trackFilter,
  teamFilter,
  statusFilter,
  activeFilterCount,
}) {
  const router = useRouter();
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState(() => {
    const init = {};
    for (const w of weeks) init[w.id] = false;
    return init;
  });

  return (
    <div className="min-h-screen px-4 py-8 md:py-12">
      <div className="max-w-6xl mx-auto flex flex-col gap-8 md:gap-12">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-header font-black uppercase text-white text-2xl md:text-3xl">
              Admin
            </h1>
            <p className="text-accent text-xs font-header font-black uppercase tracking-widest">
              Dashboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin")}
              className="text-white/40 hover:text-white text-xs font-poppins underline transition-colors"
            >
              Clear filters
            </button>
            <form action={logoutAdmin}>
              <button className="text-white/40 hover:text-white text-sm font-poppins underline transition-colors">
                Log out
              </button>
            </form>
          </div>
        </div>

        {/* Stats overview row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="border border-white/10 backdrop-blur-md bg-black/20 rounded-xl p-4">
            <p className="text-white/40 text-[0.65rem] font-header font-black uppercase tracking-widest mb-0.5">Teams</p>
            <p className="font-header font-black text-white text-2xl">{totalTeams}</p>
          </div>
          <div className="border border-white/10 backdrop-blur-md bg-black/20 rounded-xl p-4">
            <p className="text-white/40 text-[0.65rem] font-header font-black uppercase tracking-widest mb-0.5">Pending</p>
            <p className="font-header font-black text-accent text-2xl">{pendingSubs}</p>
          </div>
          <div className="border border-white/10 backdrop-blur-md bg-black/20 rounded-xl p-4">
            <p className="text-white/40 text-[0.65rem] font-header font-black uppercase tracking-widest mb-0.5">Reviewed</p>
            <p className="font-header font-black text-green-400 text-2xl">{reviewedSubs}</p>
          </div>
          <div className="border border-white/10 backdrop-blur-md bg-black/20 rounded-xl p-4">
            <p className="text-white/40 text-[0.65rem] font-header font-black uppercase tracking-widest mb-0.5">Total Pts</p>
            <p className="font-header font-black text-white text-2xl">{totalPointsAll}</p>
          </div>
        </div>

        {/* Teams */}
        <section className="border border-white/10 backdrop-blur-md bg-black/20 rounded-2xl p-5 md:p-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <h2 className="font-header font-bold text-white text-lg">Teams</h2>
              <p className="text-white/40 text-xs font-poppins">Add or view participating teams.</p>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAddTeam((v) => !v)}
                className="text-xs font-poppins text-accent border border-accent/30 px-3 py-1.5 rounded-lg hover:bg-accent/10 transition-colors"
              >
                + Add Team
              </button>
              {showAddTeam && (
                <div className="absolute mt-2 right-0 z-60 w-72 border border-white/10 backdrop-blur-md bg-black/90 rounded-xl p-4">
                  <AddTeamForm router={router} onClose={() => setShowAddTeam(false)} />
                </div>
              )}
            </div>
            <form action={async () => { await backfillPasswords(); router.refresh(); }}>
              <button type="submit" className="text-[0.6rem] font-poppins text-white/30 hover:text-accent underline transition-colors">
                Backfill passwords
              </button>
            </form>
          </div>

          <div className="overflow-x-auto -mx-5 md:-mx-6">
            <div className="inline-block min-w-full align-middle px-5 md:px-6">
              <table className="w-full text-sm font-poppins">
                <thead>
                  <tr className="text-white/40 text-xs uppercase tracking-widest border-b border-white/10">
                    <th className="text-left py-2 pr-3 font-medium">Team</th>
                    <th className="text-left py-2 pr-3 font-medium hidden sm:table-cell">Track</th>
                    <th className="text-left py-2 pr-3 font-medium">Username</th>
                    <th className="text-left py-2 pr-3 font-medium">Password</th>
                    <th className="text-right py-2 font-medium">Points</th>
                    <th className="text-right py-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((t) => (
                    <tr key={t.id} className="border-b border-white/5 text-white hover:bg-white/5 transition-colors">
                      <td className="py-2 pr-3 font-medium">{t.team_name}</td>
                      <td className="py-2 pr-3 text-white/60 hidden sm:table-cell">{t.track}</td>
                      <td className="py-2 pr-3 text-white/40 font-mono text-xs">{t.username}</td>
                      <td className="py-2 pr-3 text-white/30 font-mono text-xs">{t.password_plaintext || "—"}</td>
                      <td className="py-2 text-right text-accent font-semibold">{t.points}</td>
                      <td className="py-2 text-right">
                        <ResetPasswordButton teamId={t.id} />
                        <DeleteTeamButton teamId={t.id} teamName={t.team_name} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Weeks */}
        <section className="border border-white/10 backdrop-blur-md bg-black/20 rounded-2xl p-5 md:p-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <h2 className="font-header font-bold text-white text-lg">Weeks</h2>
              <p className="text-white/40 text-xs font-poppins">Manage weeks, workshops, and tasks.</p>
            </div>
            <details className="group relative">
              <summary className="text-xs font-poppins text-accent border border-accent/30 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-accent/10 transition-colors list-none">
                + Add Week
              </summary>
              <div className="absolute mt-2 right-0 z-60 w-72 border border-white/10 backdrop-blur-md bg-black/90 rounded-xl p-4">
                <form action={async (fd) => { await createWeek(fd); router.refresh(); }} className="flex flex-col gap-2">
                  <input name="week_number" type="number" placeholder="Week #" required className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-white text-sm font-poppins outline-none focus:border-accent transition-colors placeholder:text-white/30" />
                  <input name="title" placeholder="Title" required className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-white text-sm font-poppins outline-none focus:border-accent transition-colors placeholder:text-white/30" />
                  <input name="start_date" placeholder="Start date" className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-white text-sm font-poppins outline-none focus:border-accent transition-colors placeholder:text-white/30" />
                  <input name="end_date" placeholder="End date" className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-white text-sm font-poppins outline-none focus:border-accent transition-colors placeholder:text-white/30" />
                  <button type="submit" className="bg-accent text-black text-sm font-poppins font-semibold py-2 rounded-lg hover:opacity-90 transition-all">
                    Add Week
                  </button>
                </form>
              </div>
            </details>
          </div>

          {weeks.map((week) => {
            const isExpanded = expandedWeeks[week.id] ?? false;
            return (
              <div key={week.id} className="mb-3 last:mb-0 border border-white/5 rounded-xl overflow-hidden">
                <div className="flex items-stretch">
                  <div
                    onClick={() => setExpandedWeeks((prev) => ({ ...prev, [week.id]: !prev[week.id] }))}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedWeeks((prev) => ({ ...prev, [week.id]: !prev[week.id] })); } }}
                    className="flex-1 flex items-center justify-between gap-3 px-4 md:px-5 py-3 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-header font-bold text-white text-sm">
                          Week {week.week_number}: {week.title}
                        </span>
                        {week.is_active && (
                          <span className="text-[0.6rem] font-header font-black uppercase tracking-widest text-black bg-accent px-1.5 py-0.5 rounded">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-white/40 text-xs font-poppins">
                        {week.start_date} &ndash; {week.end_date}
                        <span className="ml-3 text-white/20">
                          {(workshopsByWeek[week.id]?.length || 0)} workshops &middot; {(tasksByWeek[week.id]?.length || 0)} tasks
                        </span>
                      </p>
                    </div>
                    <span className="text-white/30 text-sm shrink-0">{isExpanded ? "▲" : "▼"}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 md:px-5 py-3 shrink-0 border-l border-white/5">
                    {!week.is_active && (
                      <form action={async (fd) => { await setActiveWeek(fd); router.refresh(); }}>
                        <input type="hidden" name="weekId" value={week.id} />
                        <button className="text-[0.6rem] font-header font-black uppercase tracking-widest text-accent border border-accent/30 px-2 py-1 rounded-lg hover:bg-accent/10 transition-colors">
                          Set Active
                        </button>
                      </form>
                    )}
                    <form action={async (fd) => { await deleteWeek(fd); router.refresh(); }}>
                      <input type="hidden" name="weekId" value={week.id} />
                      <button className="text-[0.6rem] font-header font-black uppercase tracking-widest text-red-400 border border-red-400/30 px-2 py-1 rounded-lg hover:bg-red-400/10 transition-colors">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-white/5 px-4 md:px-5 py-4">
                    {/* Workshops */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white/50 text-xs font-header font-black uppercase tracking-widest">Workshops</h4>
                        <details className="group relative">
                          <summary className="text-[0.6rem] font-header font-black uppercase tracking-widest text-accent border border-accent/30 px-2 py-1 rounded-lg cursor-pointer hover:bg-accent/10 transition-colors list-none">
                            + Add
                          </summary>
                          <div className="absolute mt-1 right-0 z-60 w-64 border border-white/10 backdrop-blur-md bg-black/90 rounded-xl p-3">
                            <form action={async (fd) => { await addWorkshop(fd); router.refresh(); }} className="flex flex-col gap-2">
  <input type="hidden" name="weekId" value={week.id} />
  <input name="workshop_number" type="number" placeholder="# (1 or 2)" required className="rounded-lg bg-black/40 border border-white/10 px-2 py-1.5 text-white text-xs font-poppins outline-none focus:border-accent transition-colors placeholder:text-white/30" />
  <input name="title" placeholder="Workshop title" required className="rounded-lg bg-black/40 border border-white/10 px-2 py-1.5 text-white text-xs font-poppins outline-none focus:border-accent transition-colors placeholder:text-white/30" />
  <select name="track" defaultValue="" className="rounded-lg bg-black/40 border border-white/10 px-2 py-1.5 text-white text-xs font-poppins outline-none focus:border-accent transition-colors">
    <option value="">All Tracks</option>
    {TRACKS.map((t) => <option key={t} value={t}>{t}</option>)}
  </select>
  <input name="speaker" placeholder="Speaker" className="rounded-lg bg-black/40 border border-white/10 px-2 py-1.5 text-white text-xs font-poppins outline-none focus:border-accent transition-colors placeholder:text-white/30" />
  <input name="recording_url" placeholder="Recording URL" className="rounded-lg bg-black/40 border border-white/10 px-2 py-1.5 text-white text-xs font-poppins outline-none focus:border-accent transition-colors placeholder:text-white/30" />
  <button type="submit" className="bg-accent text-black text-xs font-poppins font-semibold py-1.5 rounded-lg hover:opacity-90 transition-all">
    Add Workshop
  </button>
</form>
                          </div>
                        </details>
                      </div>
                      <div className="flex flex-col gap-1">
                        {workshopsByWeek[week.id]?.map((ws) => (
  <div key={ws.id} className="flex items-center gap-2 text-sm font-poppins text-white/70 bg-white/5 rounded-lg px-3 py-2">
    <span className="text-white/40 shrink-0 font-mono text-xs">WS{ws.workshop_number}</span>
    <span className="truncate flex-1">{ws.title}</span>
    <span className="shrink-0 text-[0.55rem] font-header font-black uppercase tracking-widest text-accent/70 border border-accent/20 px-1.5 py-0.5 rounded">
      {ws.track || "All Tracks"}
    </span>
    {ws.speaker && <span className="text-white/40 hidden xs:inline shrink-0 text-xs">({ws.speaker})</span>}    <div className="flex items-center gap-1.5 shrink-0">
                              {ws.recording_url ? (
                                <a href={ws.recording_url} target="_blank" className="text-accent underline text-xs hover:text-white transition-colors">recording</a>
                              ) : (
                                <span className="text-white/20 text-xs">no recording</span>
                              )}
                              <form action={async (fd) => { await deleteWorkshop(fd); router.refresh(); }}>
                                <input type="hidden" name="workshopId" value={ws.id} />
                                <button className="text-red-400/60 hover:text-red-400 text-xs px-1.5 py-0.5 rounded hover:bg-red-400/10 transition-colors">&times;</button>
                              </form>
                            </div>
                          </div>
                        ))}
                        {(!workshopsByWeek[week.id] || workshopsByWeek[week.id].length === 0) && (
                          <p className="text-white/20 text-xs font-poppins">No workshops yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Tasks */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white/50 text-xs font-header font-black uppercase tracking-widest">Tasks</h4>
                        <details className="group relative">
                          <summary className="text-[0.6rem] font-header font-black uppercase tracking-widest text-accent border border-accent/30 px-2 py-1 rounded-lg cursor-pointer hover:bg-accent/10 transition-colors list-none">
                            + Add
                          </summary>
                          <div className="absolute mt-1 right-0 z-60 w-64 border border-white/10 backdrop-blur-md bg-black/90 rounded-xl p-3">
                            <form action={async (fd) => { await addTask(fd); router.refresh(); }} className="flex flex-col gap-2">
                              <input type="hidden" name="weekId" value={week.id} />
                              <input name="title" placeholder="Task title" required className="rounded-lg bg-black/40 border border-white/10 px-2 py-1.5 text-white text-xs font-poppins outline-none focus:border-accent transition-colors placeholder:text-white/30" />
                              <input name="description" placeholder="Description" className="rounded-lg bg-black/40 border border-white/10 px-2 py-1.5 text-white text-xs font-poppins outline-none focus:border-accent transition-colors placeholder:text-white/30" />
                              <input name="points_value" type="number" placeholder="Points" defaultValue={10} className="rounded-lg bg-black/40 border border-white/10 px-2 py-1.5 text-white text-xs font-poppins outline-none focus:border-accent transition-colors placeholder:text-white/30" />
                              <button type="submit" className="bg-accent text-black text-xs font-poppins font-semibold py-1.5 rounded-lg hover:opacity-90 transition-all">
                                Add Task
                              </button>
                            </form>
                          </div>
                        </details>
                      </div>
                      <div className="flex flex-col gap-1">
                        {tasksByWeek[week.id]?.map((task) => (
                          <div key={task.id} className="flex items-center gap-2 text-sm font-poppins text-white/70 bg-white/5 rounded-lg px-3 py-2">
                            <span className="text-accent font-semibold shrink-0 font-mono text-xs">{task.points_value}pts</span>
                            <span className="truncate flex-1">{task.title}</span>
                            {task.description && <span className="text-white/40 text-xs hidden md:inline truncate max-w-[200px]">&mdash; {task.description}</span>}
                            <form action={async (fd) => { await deleteTask(fd); router.refresh(); }} className="shrink-0">
                              <input type="hidden" name="taskId" value={task.id} />
                              <button className="text-red-400/60 hover:text-red-400 text-xs px-1.5 py-0.5 rounded hover:bg-red-400/10 transition-colors">&times;</button>
                            </form>
                          </div>
                        ))}
                        {(!tasksByWeek[week.id] || tasksByWeek[week.id].length === 0) && (
                          <p className="text-white/20 text-xs font-poppins">No tasks yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* Submissions */}
        <section className="border border-white/10 backdrop-blur-md bg-black/20 rounded-2xl p-5 md:p-6">
          <div className="mb-4">
            <h2 className="font-header font-bold text-white text-lg">Submissions</h2>
            <p className="text-white/40 text-xs font-poppins">Review and award points.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-5 p-3 bg-white/5 rounded-xl">
            <FilterBar
              label="All Weeks"
              paramKey="week"
              current={weekFilter}
              options={weeks.map((w) => ({ value: w.id, label: `Week ${w.week_number}` }))}
            />
            <FilterBar
              label="All Tracks"
              paramKey="track"
              current={trackFilter}
              options={tracks.map((t) => ({ value: t, label: t }))}
            />
            <FilterBar
              label="All Teams"
              paramKey="team"
              current={teamFilter}
              options={teams.map((t) => ({ value: t.id, label: t.team_name }))}
            />
            <FilterBar
              label="All Statuses"
              paramKey="status"
              current={statusFilter}
              options={[
                { value: "submitted", label: "Submitted" },
                { value: "reviewed", label: "Reviewed" },
                { value: "needs_changes", label: "Needs Changes" },
              ]}
            />
            {activeFilterCount > 0 && (
              <span className="text-white/30 text-xs font-poppins self-center ml-auto">{activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active</span>
            )}
          </div>

          {Object.keys(subsByWeek).length === 0 ? (
            <p className="text-white/30 text-sm font-poppins">No submissions match your filters.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {Object.entries(subsByWeek).map(([weekId, weekSubs]) => {
                const week = weekNames[weekId];
                if (!week) return null;
                return (
                  <div key={weekId}>
                    <h3 className="font-header font-bold text-white text-sm mb-3 flex items-center gap-2">
                      Week {week.week_number}: {week.title}
                      <span className="text-white/30 font-poppins text-xs font-normal">({weekSubs.length})</span>
                    </h3>
                    <div className="flex flex-col gap-3">
                      {weekSubs.map((sub) => (
                        <div key={sub.id} className="border border-white/5 rounded-xl p-4">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-header font-bold text-white text-sm">{sub.teams?.team_name}</span>
                                <span className="text-[0.55rem] font-header font-black uppercase tracking-widest text-accent/70 border border-accent/20 px-1.5 py-0.5 rounded">{sub.teams?.track}</span>
                                <span className="text-[0.55rem] font-header font-black uppercase tracking-widest text-blue-400 border border-blue-400/20 px-1.5 py-0.5 rounded">{sub.teams?.points || 0} pts</span>
                                <span className="text-white/30 text-xs font-poppins">·</span>
                                <span className="text-white/50 text-xs font-poppins">{sub.tasks?.title}</span>
                                <span className="text-white/20 text-xs font-poppins">·</span>
                                <span className="text-white/30 text-xs font-poppins">{new Date(sub.submitted_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                              </div>
                            </div>
                            <span className={`shrink-0 w-fit text-[0.6rem] font-header font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                              sub.status === "reviewed" ? "text-green-400 bg-green-400/10 border border-green-400/30" :
                              sub.status === "needs_changes" ? "text-red-400 bg-red-400/10 border border-red-400/30" :
                              "text-accent bg-accent/10 border border-accent/30"
                            }`}>
                              {sub.status}
                            </span>
                          </div>
                          <a href={sub.submission_url} target="_blank" className="text-accent text-xs font-poppins underline break-all block mb-2 hover:text-white transition-colors">
                            {sub.submission_url}
                          </a>
                          {sub.notes && (
                            <p className="text-white/40 text-xs font-poppins mb-3 bg-white/5 rounded-lg px-3 py-2">
                              <span className="text-white/30">Notes:</span> {sub.notes}
                            </p>
                          )}

                          <form action={async (fd) => { await reviewSubmission(fd); router.refresh(); }} className="flex flex-wrap gap-2 items-end mt-3">
                            <input type="hidden" name="submissionId" value={sub.id} />
                            <select name="status" defaultValue={sub.status} className="rounded-lg bg-black/40 border border-white/10 px-2 py-1.5 text-white text-xs font-poppins outline-none focus:border-accent transition-colors">
                              <option value="reviewed">Approve</option>
                              <option value="needs_changes">Needs Changes</option>
                              <option value="submitted">Keep as Submitted</option>
                            </select>
                            <input name="points_awarded" type="number" placeholder="Points" defaultValue={sub.points_awarded || sub.tasks?.points_value || 0} className="w-20 rounded-lg bg-black/40 border border-white/10 px-2 py-1.5 text-white text-xs font-poppins outline-none focus:border-accent transition-colors placeholder:text-white/30" />
                            <input name="reviewer_notes" placeholder="Review notes" defaultValue={sub.reviewer_notes || ""} className="flex-1 min-w-[140px] rounded-lg bg-black/40 border border-white/10 px-2 py-1.5 text-white text-xs font-poppins outline-none focus:border-accent transition-colors placeholder:text-white/30" />
                            <button type="submit" className="bg-accent text-black text-xs font-poppins font-semibold px-4 py-1.5 rounded-lg hover:opacity-90 transition-all">
                              Save
                            </button>
                          </form>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Inquiries */}
        <section className="border border-white/10 backdrop-blur-md bg-black/20 rounded-2xl p-5 md:p-6">
          <div className="mb-4">
            <h2 className="font-header font-bold text-white text-lg">Inquiries</h2>
            <p className="text-white/40 text-xs font-poppins">Questions from teams, grouped by week.</p>
          </div>

          {inquiries.length === 0 ? (
            <p className="text-white/30 text-sm font-poppins">No inquiries yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {inquiries.map((inq) => (
                <div key={inq.id} className="border border-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-header font-bold text-white text-sm">{inq.teams?.team_name}</span>
                    <span className="text-[0.55rem] font-header font-black uppercase tracking-widest text-accent/70 border border-accent/20 px-1.5 py-0.5 rounded">{inq.teams?.track}</span>
                    <span className="text-white/30 text-xs font-poppins">·</span>
                    <span className="text-white/50 text-xs font-poppins">Week {inq.weeks?.week_number}: {inq.weeks?.title}</span>
                    <span className="text-white/30 text-xs font-poppins">·</span>
                    <span className="text-white/30 text-xs font-poppins">{new Date(inq.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <p className="text-white/80 text-sm font-poppins mb-3 bg-white/5 rounded-lg px-3 py-2">{inq.question}</p>
                  {inq.answer ? (
                    <div className="text-green-300 text-xs font-poppins bg-green-400/5 border border-green-400/10 rounded-lg px-3 py-2">
                      <span className="text-green-400 font-semibold">Answer:</span> {inq.answer}
                    </div>
                  ) : (
                    <form action={async (fd) => { await answerInquiry(fd); router.refresh(); }} className="flex gap-2">
                      <input type="hidden" name="inquiryId" value={inq.id} />
                      <input name="answer" placeholder="Write your answer..." required className="flex-1 rounded-lg bg-black/40 border border-white/10 px-3 py-1.5 text-white text-xs font-poppins outline-none focus:border-accent transition-colors placeholder:text-white/30" />
                      <button type="submit" className="bg-accent text-black text-xs font-poppins font-semibold px-4 py-1.5 rounded-lg hover:opacity-90 transition-all shrink-0">
                        Reply
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
