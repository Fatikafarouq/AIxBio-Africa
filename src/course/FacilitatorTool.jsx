/* ══════════════════════════════════════════════════════
   Facilitator Tool — matches the design system already
   defined in App.jsx (Sec, PageHdr, Ey, H2, Txt, .tag,
   .chip, .tab-b, etc.). Import these components into
   App.jsx and wire into the `page` state / `go()` router
   the rest of the site already uses.

   Expects: import { courseMeta, courseModules } from "./facilitatorModules";
   (the data file already generated — 6 modules, full
   facilitator content, no participant split needed here.)
   ══════════════════════════════════════════════════════ */

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { Sec, PageHdr, Ey, H2, Txt } from "./CoursePrimitives";
import LiveSessionsPanel from "./LiveSessionsPanel";

/* These primitives already exist in App.jsx — this file assumes
   they're imported/in-scope wherever it's used, exactly like every
   other page component in App.jsx does. If you split this into its
   own module, export Sec/PageHdr/Ey/H2/Txt/AfricaSvg from App.jsx
   (or a shared primitives file) and import them here instead of
   redefining them. */


/* ══════════ FACILITATOR ATTENDANCE ═══════════════════ */

const AttendanceButton = ({ active, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      border: active ? "1px solid #B8102A" : "1px solid var(--brd)",
      background: active ? "rgba(184,16,42,.08)" : "#fff",
      color: active ? "#B8102A" : "#5A5956",
      fontFamily: "'Figtree',sans-serif",
      fontSize: 11.5,
      fontWeight: 700,
      padding: "8px 10px",
      cursor: "pointer"
    }}
  >
    {children}
  </button>
);

const FacilitatorAttendance = () => {
  const [dashboard, setDashboard] = useState({ groups: [] });
  const [groupId, setGroupId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [draft, setDraft] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    const { data, error: e } = await supabase.rpc("get_facilitator_attendance_dashboard");
    if (e) {
      setError(e.message);
      setDashboard({ groups: [] });
      setLoading(false);
      return;
    }
    const next = data || { groups: [] };
    setDashboard(next);
    const firstGroup = next.groups?.[0];
    setGroupId(current => current && next.groups?.some(g => g.id === current) ? current : (firstGroup?.id || ""));
    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const group = useMemo(
    () => dashboard.groups?.find(g => g.id === groupId) || null,
    [dashboard, groupId]
  );

  const sessions = useMemo(
    () => [...(group?.sessions || [])].sort((a, b) => new Date(a.session_date) - new Date(b.session_date)),
    [group]
  );

  useEffect(() => {
    if (!sessions.length) {
      setSessionId("");
      return;
    }
    setSessionId(current => current && sessions.some(s => s.id === current) ? current : sessions[0].id);
  }, [groupId, sessions.length]);

  const session = sessions.find(s => s.id === sessionId) || null;
  const participants = group?.participants || [];

  useEffect(() => {
    if (!group || !sessionId) {
      setDraft({});
      return;
    }
    const next = {};
    participants.forEach(p => {
      const saved = (group.attendance || []).find(a => a.session_id === sessionId && a.user_id === p.user_id);
      next[p.user_id] = saved
        ? { status: saved.status, exercise_status: saved.exercise_status || (saved.status === "present" ? "not_completed" : "not_applicable") }
        : { status: "", exercise_status: "not_applicable" };
    });
    setDraft(next);
    setMessage("");
  }, [groupId, sessionId, dashboard]);

  const setAttendance = (userId, status) => {
    setDraft(d => ({
      ...d,
      [userId]: {
        status,
        exercise_status:
          status === "present"
            ? (d[userId]?.exercise_status === "completed" ? "completed" : "not_completed")
            : "not_applicable"
      }
    }));
    setMessage("");
  };

  const setExercise = (userId, exercise_status) => {
    setDraft(d => ({
      ...d,
      [userId]: {
        status: d[userId]?.status || "present",
        exercise_status
      }
    }));
    setMessage("");
  };

  const save = async () => {
    if (!sessionId) return;
    const incomplete = participants.find(p => !draft[p.user_id]?.status);
    if (incomplete) {
      setError("Mark attendance for every participant before saving.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    for (const participant of participants) {
      const row = draft[participant.user_id];
      const { error: e } = await supabase.rpc("mark_session_attendance", {
        p_session_id: sessionId,
        p_participant_user_id: participant.user_id,
        p_status: row.status,
        p_exercise_status: row.status === "present" ? row.exercise_status : "not_applicable"
      });
      if (e) {
        setError(e.message);
        setSaving(false);
        return;
      }
    }

    await loadDashboard();
    setSaving(false);
    setMessage("Attendance saved.");
  };

  const attendanceComplete = Boolean(
    sessionId &&
    participants.length &&
    participants.every(p =>
      (group?.attendance || []).some(a => a.session_id === sessionId && a.user_id === p.user_id)
    )
  );

  const nextModuleId = session && session.module_id < 6 ? session.module_id + 1 : null;
  const nextModuleUnlocked = Boolean(
    nextModuleId && (group?.unlocked_modules || [1]).includes(nextModuleId)
  );

  const unlockNext = async () => {
    if (!groupId || !session || !nextModuleId) return;

    setUnlocking(true);
    setError("");
    setMessage("");

    const { error: e } = await supabase.rpc("unlock_next_module_for_group", {
      p_group_id: groupId,
      p_current_module_id: session.module_id
    });

    if (e) {
      setError(e.message);
      setUnlocking(false);
      return;
    }

    await loadDashboard();
    setUnlocking(false);
    setMessage(`Module ${nextModuleId} is now unlocked for participants.`);
  };

  return (
    <div className="reveal" style={{ marginBottom: 52, paddingTop: 8 }}>
      <Ey label="Facilitator Attendance" />
      <H2 s={{ marginBottom: 10 }}>Live session register</H2>
      <Txt muted s={{ maxWidth: 760, fontSize: 13.5, marginBottom: 22 }}>
        Record attendance after each live session and confirm whether each present participant completed the pre-session exercise.
      </Txt>

      {loading ? (
        <Txt muted>Loading your assigned group…</Txt>
      ) : error && !dashboard.groups?.length ? (
        <div className="err">{error}</div>
      ) : !dashboard.groups?.length ? (
        <div style={{ border: "1px solid var(--brd)", background: "#F7F6F2", padding: "18px 20px" }}>
          <Txt muted s={{ fontSize: 13.5 }}>
            No facilitator group is assigned to this account yet. Attendance controls will appear once a cohort group is assigned to you.
          </Txt>
        </div>
      ) : (
        <>
          <div className="g2" style={{ display: "grid", gridTemplateColumns: dashboard.groups.length > 1 ? "1fr 1fr" : "1fr", gap: 14, marginBottom: 20 }}>
            {dashboard.groups.length > 1 && (
              <div>
                <div style={{ fontFamily: "'Figtree',sans-serif", fontSize: 10.5, fontWeight: 700, color: "#5A5956", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 7 }}>Group</div>
                <select value={groupId} onChange={e => setGroupId(e.target.value)}>
                  {dashboard.groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
            )}
            <div>
              <div style={{ fontFamily: "'Figtree',sans-serif", fontSize: 10.5, fontWeight: 700, color: "#5A5956", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 7 }}>Live session</div>
              <select value={sessionId} onChange={e => setSessionId(e.target.value)}>
                {sessions.map(s => (
                  <option key={s.id} value={s.id}>
                    Module {s.module_id} · {new Date(s.session_date).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {group && (
            <div style={{ marginBottom: 14, fontSize: 12.5, color: "#5A5956" }}>
              <strong style={{ color: "#1A1917" }}>{group.name}</strong>
              {group.timezone_label ? ` · ${group.timezone_label}` : ""}
              {session ? ` · Module ${session.module_id}` : ""}
            </div>
          )}

          {!sessions.length ? (
            <Txt muted>No live sessions have been scheduled for this group yet.</Txt>
          ) : !participants.length ? (
            <Txt muted>No accepted participants are assigned to this group yet.</Txt>
          ) : (
            <div style={{ borderTop: "1px solid var(--brd)" }}>
              {participants.map(participant => {
                const row = draft[participant.user_id] || { status: "", exercise_status: "not_applicable" };
                return (
                  <div key={participant.user_id} style={{ padding: "18px 0", borderBottom: "1px solid var(--brd)" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "minmax(180px,1fr) minmax(260px,1.35fr) minmax(210px,1fr)", gap: 18, alignItems: "center" }}>
                      <div>
                        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 600, color: "#1A1917" }}>
                          {participant.full_name || participant.email || "Participant"}
                        </div>
                        {participant.email && <div style={{ fontSize: 11.5, color: "#8A8884", marginTop: 2 }}>{participant.email}</div>}
                      </div>

                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#8A8884", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 7 }}>Attendance</div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <AttendanceButton active={row.status === "present"} onClick={() => setAttendance(participant.user_id, "present")}>Present</AttendanceButton>
                          <AttendanceButton active={row.status === "absent"} onClick={() => setAttendance(participant.user_id, "absent")}>Absent</AttendanceButton>
                          <AttendanceButton active={row.status === "excused"} onClick={() => setAttendance(participant.user_id, "excused")}>Excused</AttendanceButton>
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#8A8884", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 7 }}>Pre-session exercise</div>
                        {row.status === "present" ? (
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            <AttendanceButton active={row.exercise_status === "completed"} onClick={() => setExercise(participant.user_id, "completed")}>Completed</AttendanceButton>
                            <AttendanceButton active={row.exercise_status === "not_completed"} onClick={() => setExercise(participant.user_id, "not_completed")}>Not completed</AttendanceButton>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12.5, color: "#8A8884" }}>—</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {error && <div className="err" style={{ marginTop: 14 }}>{error}</div>}
          {message && <div style={{ marginTop: 14, fontSize: 13, fontWeight: 700, color: "#1A6B46" }}>{message}</div>}
          {!!participants.length && !!sessions.length && (
            <button className="br" onClick={save} disabled={saving} style={{ marginTop: 18, opacity: saving ? .65 : 1 }}>
              {saving ? "Saving…" : "Save attendance"}
            </button>
          )}

          {session?.module_id < 6 && attendanceComplete && (
            <div style={{ marginTop: 18, padding: "18px 20px", border: "1px solid var(--brd)", background: "#F7F6F2" }}>
              {nextModuleUnlocked ? (
                <Txt s={{ fontSize: 13.5, color: "#1A6B46", fontWeight: 700 }}>
                  Module {nextModuleId} is already unlocked for participants ✓
                </Txt>
              ) : (
                <>
                  <Txt muted s={{ fontSize: 13.5, marginBottom: 12 }}>
                    Attendance for Module {session.module_id} is saved. When your group is ready to move forward, unlock the next module.
                  </Txt>
                  <button className="br" onClick={unlockNext} disabled={unlocking} style={{ opacity: unlocking ? .65 : 1 }}>
                    {unlocking ? "Unlocking…" : `Unlock Module ${nextModuleId} for participants`}
                  </button>
                </>
              )}
            </div>
          )}

          {session?.module_id === 6 && attendanceComplete && (
            <div style={{ marginTop: 18, padding: "18px 20px", border: "1px solid var(--brd)", background: "#F7F6F2" }}>
              <Txt muted s={{ fontSize: 13.5 }}>
                Module 6 attendance is saved. Capstone access is calculated automatically for each participant from attendance and pre-session exercise completion.
              </Txt>
            </div>
          )}
        </>
      )}
    </div>
  );
};


/* ══════════ MODULE LIST (hub) ══════════════════════════ */

export const FacilitatorHub = ({ go, courseMeta, courseModules }) => (
  <>
    <PageHdr
      label="Facilitator Guide"
      title={courseMeta.title}
      sub={courseMeta.subtitle}
    />
    <Sec bg="#fff">
      {/* Course-level context */}
      <div className="reveal" style={{ marginBottom: 48 }}>
        <Ey label="Course Overview" />
        <H2 s={{ marginBottom: 18 }}>Purpose</H2>
        <Txt s={{ marginBottom: 24, maxWidth: 760 }}>{courseMeta.purpose}</Txt>
        <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: "#F7F6F2", border: "1px solid var(--brd)", padding: "20px 22px" }}>
            <div style={{ fontFamily: "'Figtree',sans-serif", fontSize: 10.5, fontWeight: 700, color: "#5A5956", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 10 }}>Who It's For</div>
            <Txt muted s={{ fontSize: 13.5 }}>{courseMeta.whoItsFor}</Txt>
          </div>
          <div style={{ background: "#F7F6F2", border: "1px solid var(--brd)", padding: "20px 22px" }}>
            <div style={{ fontFamily: "'Figtree',sans-serif", fontSize: 10.5, fontWeight: 700, color: "#5A5956", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 10 }}>Learning Journey</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {courseMeta.learningJourney.map((step, i) => (
                <span key={step} className="tag tb">{i + 1}. {step}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <LiveSessionsPanel courseModules={courseModules} />

      <FacilitatorAttendance />

      {/* Module list */}
      <div className="reveal">
        <Ey label="Modules" />
        <H2 s={{ marginBottom: 28 }}>Six Sessions</H2>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {courseModules.map((m, i) => (
            <div
              key={m.id}
              className="reveal lft"
              onClick={() => go("facilitator-module", { slug: m.slug })}
              style={{ display: "grid", gridTemplateColumns: "56px 1fr auto", gap: 24, padding: "24px 0", borderTop: "1px solid var(--brd)", cursor: "pointer", alignItems: "center" }}
            >
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 13, fontWeight: 600, color: "rgba(26,25,23,.22)" }}>
                {String(m.id).padStart(2, "0")}
              </span>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 600, color: "#1A1917" }}>{m.title}</h3>
                  <span className="tag tr">Module {m.id}</span>
                </div>
                <Txt muted s={{ fontSize: 14 }}>{m.overview}</Txt>
              </div>
              <span style={{ color: "#B8102A", fontSize: 18, flexShrink: 0 }}>→</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--brd)" }} />
        </div>
      </div>
    </Sec>
  </>
);

/* ══════════ MODULE DETAIL ══════════════════════════════ */

const FacilitatorSectionLabel = ({ children }) => (
  <div style={{ fontFamily: "'Figtree',sans-serif", fontSize: 10, fontWeight: 700, color: "#5A5956", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 12 }}>
    {children}
  </div>
);

const DiscussionBlockList = ({ blocks }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 40 }}>
    {blocks.map((b, i) => (
      <div key={b.title} style={{ padding: "18px 0", borderTop: i > 0 ? "1px solid var(--brd)" : "none" }}>
        <h4 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 600, color: "#1A1917", marginBottom: 8 }}>{b.title}</h4>
        {b.points.map((p, j) => (
          <div key={j} style={{ display: "flex", gap: 10, marginBottom: 6 }}>
            <span style={{ color: "#B8102A", fontWeight: 700, flexShrink: 0 }}>—</span>
            <Txt muted s={{ fontSize: 14, lineHeight: 1.6 }}>{p}</Txt>
          </div>
        ))}
      </div>
    ))}
  </div>
);

const ResourceRow = ({ r }) => (
  <a
    href={r.url}
    target="_blank"
    rel="noopener noreferrer"
    style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 0", borderTop: "1px solid var(--brd)", textDecoration: "none" }}
  >
    <span className={`chip ${r.type === "watch" ? "cp" : "cg"}`} style={{ flexShrink: 0, marginTop: 2 }}>
      {r.label}{r.core === false ? " · Optional" : ""}
    </span>
    <div>
      <div style={{ fontFamily: "'Figtree',sans-serif", fontSize: 14, fontWeight: 600, color: "#1A1917", marginBottom: 3 }}>{r.title}</div>
      {r.purpose && <Txt muted s={{ fontSize: 13, lineHeight: 1.55 }}>{r.purpose}</Txt>}
      {r.note && <Txt s={{ fontSize: 12.5, fontStyle: "italic", color: "#8A8884", marginTop: 4 }}>{r.note}</Txt>}
    </div>
  </a>
);

export const FacilitatorModuleDetail = ({ slug, go, courseModules }) => {
  const m = courseModules.find(mod => mod.slug === slug);
  const [notesOpen, setNotesOpen] = useState(true);

  if (!m) return <Sec bg="#fff"><Txt>Module not found.</Txt></Sec>;

  const idx = courseModules.findIndex(mod => mod.slug === slug);
  const prev = courseModules[idx - 1];
  const next = courseModules[idx + 1];

  return (
    <>
      <PageHdr label={`Module ${m.id} of 6`} title={m.title} sub={m.tagline} />
      <Sec bg="#fff">
        <div style={{ maxWidth: 780 }}>
          {/* Overview */}
          <div className="reveal" style={{ marginBottom: 36 }}>
            <FacilitatorSectionLabel>Overview</FacilitatorSectionLabel>
            <Txt s={{ fontSize: 15.5, lineHeight: 1.78 }}>{m.overview}</Txt>
          </div>

          {/* Discussion blocks */}
          {m.discussionBlocks && (
            <div className="reveal" style={{ marginBottom: 8 }}>
              <FacilitatorSectionLabel>Discussion Blocks</FacilitatorSectionLabel>
              <DiscussionBlockList blocks={m.discussionBlocks} />
            </div>
          )}

          {/* Key idea (Module 4 only) */}
          {m.keyIdea && (
            <div className="reveal" style={{ borderLeft: "2.5px solid #B8102A", paddingLeft: 22, marginBottom: 36 }}>
              <Txt s={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontStyle: "italic", color: "#1A1917", lineHeight: 1.5 }}>{m.keyIdea}</Txt>
            </div>
          )}

          {/* Discussion format (Modules 3 & 4) */}
          {m.discussionFormat && (
            <div className="reveal" style={{ background: "#F7F6F2", border: "1px solid var(--brd)", padding: "22px 24px", marginBottom: 36 }}>
              <FacilitatorSectionLabel>Discussion Format</FacilitatorSectionLabel>
              <Txt muted s={{ fontSize: 13.5, marginBottom: 12 }}>{m.discussionFormat.note}</Txt>
              {m.discussionFormat.instructions.map((ins, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6 }}>
                  <span style={{ color: "#B8102A", fontWeight: 700, flexShrink: 0 }}>—</span>
                  <Txt muted s={{ fontSize: 13.5, lineHeight: 1.6 }}>{ins}</Txt>
                </div>
              ))}
              {m.discussionFormat.guidingQuestions && (
                <>
                  <div style={{ fontFamily: "'Figtree',sans-serif", fontSize: 11, fontWeight: 700, color: "#B8102A", letterSpacing: ".06em", textTransform: "uppercase", marginTop: 14, marginBottom: 8 }}>Guiding Questions</div>
                  {m.discussionFormat.guidingQuestions.map((q, i) => (
                    <Txt key={i} muted s={{ fontSize: 13.5, marginBottom: 4 }}>{q}</Txt>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Case study */}
          {m.caseStudy && (
            <div className="reveal" style={{ marginBottom: 36 }}>
              <FacilitatorSectionLabel>Case Study</FacilitatorSectionLabel>
              <h4 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontWeight: 600, color: "#1A1917", marginBottom: 12 }}>{m.caseStudy.title}</h4>
              {m.caseStudy.purpose && m.caseStudy.purpose.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6 }}>
                  <span style={{ color: "#B8102A", fontWeight: 700, flexShrink: 0 }}>—</span>
                  <Txt muted s={{ fontSize: 13.5, lineHeight: 1.6 }}>{p}</Txt>
                </div>
              ))}
              {m.caseStudy.discussion && <Txt muted s={{ fontSize: 13.5, marginTop: 10 }}>{m.caseStudy.discussion}</Txt>}
              {m.caseStudy.note && <Txt s={{ fontSize: 12.5, fontStyle: "italic", color: "#8A8884", marginTop: 8 }}>{m.caseStudy.note}</Txt>}
              {m.caseStudy.resource && (
                <a href={m.caseStudy.resource.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 12, fontFamily: "'Figtree',sans-serif", fontSize: 12.5, fontWeight: 700, color: "#B8102A", textDecoration: "none", borderBottom: "1px solid rgba(184,16,42,.35)" }}>
                  {m.caseStudy.resource.label || "View source"} ↗
                </a>
              )}
              {m.caseStudy.prepPrompts && (
                <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 14 }}>
                  {m.caseStudy.prepPrompts.map((pp, i) => (
                    <div key={i} style={{ background: "#F7F6F2", border: "1px solid var(--brd)", padding: "16px 18px" }}>
                      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15.5, fontWeight: 600, color: "#1A1917", marginBottom: 5 }}>{pp.title}</div>
                      <Txt muted s={{ fontSize: 13, lineHeight: 1.6 }}>{pp.detail}</Txt>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Standard resources */}
          {m.resources && (
            <div className="reveal" style={{ marginBottom: 36 }}>
              <FacilitatorSectionLabel>Resources</FacilitatorSectionLabel>
              <div>{m.resources.map((r, i) => <ResourceRow key={i} r={r} />)}</div>
            </div>
          )}

          {/* Topic resources (Modules 3 & 4) */}
          {m.topicResources && (
            <div className="reveal" style={{ marginBottom: 36 }}>
              <FacilitatorSectionLabel>Topic Resources</FacilitatorSectionLabel>
              {m.topicResources.map((r, i) => (
                <div key={i} style={{ padding: "14px 0", borderTop: i > 0 ? "1px solid var(--brd)" : "none" }}>
                  <div style={{ fontFamily: "'Figtree',sans-serif", fontSize: 11, fontWeight: 700, color: "#B8102A", letterSpacing: ".04em", textTransform: "uppercase", marginBottom: 5 }}>{r.topic}</div>
                  <ResourceRow r={{ ...r, type: r.label === "Video" ? "watch" : "read" }} />
                </div>
              ))}
            </div>
          )}

          {/* Pre-session prep */}
          {m.preSessionPrep && m.preSessionPrep.length > 0 && (
            <div className="reveal" style={{ background: "#F7F6F2", border: "1px solid var(--brd)", padding: "20px 22px", marginBottom: 36 }}>
              <FacilitatorSectionLabel>Pre-Session Prep (for participants)</FacilitatorSectionLabel>
              {m.preSessionPrep.map((p, i) => <Txt key={i} muted s={{ fontSize: 13.5, marginBottom: 6 }}>{p}</Txt>)}
            </div>
          )}
          {m.preSessionPrepNote && (
            <Txt s={{ fontSize: 12.5, fontStyle: "italic", color: "#8A8884", marginBottom: 36 }}>{m.preSessionPrepNote}</Txt>
          )}

          {/* ── FACILITATOR NOTES — visually distinct, dark panel ── */}
          {m.facilitatorNotes && (
            <div className="reveal" style={{ background: "#1C1B18", padding: "26px 26px 22px", marginBottom: 24, position: "relative" }}>
              <button
                onClick={() => setNotesOpen(o => !o)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: notesOpen ? 18 : 0 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 22, height: 1.5, background: "#B8102A" }} />
                  <span style={{ fontFamily: "'Figtree',sans-serif", fontSize: 10.5, fontWeight: 700, color: "#B8102A", letterSpacing: ".2em", textTransform: "uppercase" }}>Facilitator Notes Only</span>
                </div>
                <span aria-hidden="true" style={{ color: "rgba(255,255,255,.5)", fontSize: 16, transform: notesOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}>↓</span>
              </button>
              {notesOpen && (
                <>
                  {m.facilitatorNotes.map((n, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                      <span style={{ color: "#B8102A", fontWeight: 700, flexShrink: 0 }}>—</span>
                      <Txt s={{ fontSize: 13.5, lineHeight: 1.65, color: "rgba(255,255,255,.72)" }}>{n}</Txt>
                    </div>
                  ))}
                  {m.moduleLearningFlow && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,.1)" }}>
                      <div style={{ fontFamily: "'Figtree',sans-serif", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.4)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>Module Learning Flow</div>
                      <Txt s={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,.6)", fontStyle: "italic" }}>{m.moduleLearningFlow}</Txt>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Prev / next + back to hub */}
          <div className="reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 40, paddingTop: 28, borderTop: "1px solid var(--brd)", flexWrap: "wrap", gap: 12 }}>
            <button className="bo" onClick={() => go("facilitator")}>← All Modules</button>
            <div style={{ display: "flex", gap: 10 }}>
              {prev && <button className="bo" onClick={() => go("facilitator-module", { slug: prev.slug })}>← Module {prev.id}</button>}
              {next && <button className="br" onClick={() => go("facilitator-module", { slug: next.slug })}>Module {next.id} →</button>}
            </div>
          </div>
        </div>
      </Sec>
    </>
  );
};
