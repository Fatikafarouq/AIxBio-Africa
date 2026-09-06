import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { Ey, H2, Txt } from "./CoursePrimitives";

const localTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "your local timezone";
  } catch {
    return "your local timezone";
  }
};

const formatLocalDateTime = value => {
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short"
    }).format(new Date(value));
  } catch {
    return new Date(value).toLocaleString();
  }
};

const googleDate = value =>
  new Date(value)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");

const googleCalendarUrl = ({ session, group, moduleTitle }) => {
  const start = new Date(session.session_date);
  const duration = Number(group?.session_duration_minutes) || 60;
  const end = new Date(start.getTime() + duration * 60 * 1000);

  const text = `AIxBio Africa — Module ${session.module_id} Live Session`;
  const details = [
    moduleTitle || `Module ${session.module_id}`,
    group?.name ? `Group: ${group.name}` : "",
    group?.meeting_url ? `Join live session: ${group.meeting_url}` : "",
    "Introduction to AI & Biosecurity in Africa — AIxBio Africa"
  ].filter(Boolean).join("\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text,
    dates: `${googleDate(start)}/${googleDate(end)}`,
    details
  });

  if (group?.meeting_url) params.set("location", group.meeting_url);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export default function LiveSessionsPanel({ courseModules = [] }) {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setLoading(true);
      setLoadError("");

      const { data: userData, error: userError } = await supabase.auth.getUser();
      const user = userData?.user;

      if (userError || !user) {
        if (alive) {
          setGroup(null);
          setLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from("cohort_members")
        .select(`
          role,
          status,
          group_id,
          cohort_groups(
            id,
            name,
            timezone_label,
            meeting_url,
            session_duration_minutes,
            group_sessions(
              id,
              module_id,
              session_date
            )
          )
        `)
        .eq("user_id", user.id)
        .eq("status", "accepted")
        .maybeSingle();

      if (!alive) return;

      if (error) {
        setLoadError(error.message || "Could not load your live-session schedule.");
        setGroup(null);
      } else {
        setGroup(data?.cohort_groups || null);
      }

      setLoading(false);
    };

    load();
    return () => { alive = false; };
  }, []);

  const sessions = useMemo(
    () => [...(group?.group_sessions || [])].sort(
      (a, b) => new Date(a.session_date) - new Date(b.session_date)
    ),
    [group]
  );

  const moduleTitle = moduleId =>
    courseModules.find(m => Number(m.id) === Number(moduleId))?.title || `Module ${moduleId}`;

  const now = Date.now();
  const nextSession = sessions.find(s => new Date(s.session_date).getTime() >= now) || null;
  const tz = localTimeZone();

  // Admin previews and unassigned accounts should not get a distracting empty block.
  if (!loading && !group && !loadError) return null;

  return (
    <div className="reveal" style={{ marginBottom:42 }}>
      <Ey label="Live Sessions"/>
      <H2 s={{ marginBottom:10 }}>Your group schedule</H2>

      {loading ? (
        <Txt muted>Loading your live-session schedule…</Txt>
      ) : loadError ? (
        <div className="err">{loadError}</div>
      ) : (
        <>
          <div style={{
            background:"#1C1B18",
            padding:"24px 24px 22px",
            marginBottom:18
          }}>
            <div style={{
              fontFamily:"'Figtree',sans-serif",
              fontSize:10.5,
              fontWeight:700,
              color:"#B8102A",
              letterSpacing:".14em",
              textTransform:"uppercase",
              marginBottom:8
            }}>
              {nextSession ? "Next Live Session" : "Live Session Schedule"}
            </div>

            {nextSession ? (
              <>
                <h3 style={{
                  fontFamily:"'Cormorant Garamond',serif",
                  fontSize:24,
                  fontWeight:600,
                  color:"#fff",
                  lineHeight:1.25,
                  marginBottom:8
                }}>
                  Module {nextSession.module_id} — {moduleTitle(nextSession.module_id)}
                </h3>

                <div style={{
                  fontFamily:"'Figtree',sans-serif",
                  fontSize:14,
                  color:"rgba(255,255,255,.78)",
                  lineHeight:1.65,
                  marginBottom:4
                }}>
                  {formatLocalDateTime(nextSession.session_date)}
                </div>

                <div style={{
                  fontFamily:"'Figtree',sans-serif",
                  fontSize:12.5,
                  color:"rgba(255,255,255,.48)",
                  lineHeight:1.6,
                  marginBottom:18
                }}>
                  Shown in your local timezone: {tz}
                  {group.timezone_label ? ` · Group timezone: ${group.timezone_label}` : ""}
                  {group.session_duration_minutes ? ` · ${group.session_duration_minutes} minutes` : ""}
                </div>

                <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
                  {group.meeting_url ? (
                    <a
                      href={group.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="br"
                      style={{ textDecoration:"none",display:"inline-block",padding:"11px 18px" }}
                    >
                      Join Live Session →
                    </a>
                  ) : (
                    <span style={{
                      display:"inline-flex",
                      alignItems:"center",
                      padding:"11px 16px",
                      border:"1px solid rgba(255,255,255,.14)",
                      color:"rgba(255,255,255,.55)",
                      fontFamily:"'Figtree',sans-serif",
                      fontSize:12.5
                    }}>
                      Meeting link will be added soon
                    </span>
                  )}

                  <a
                    href={googleCalendarUrl({
                      session:nextSession,
                      group,
                      moduleTitle:moduleTitle(nextSession.module_id)
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration:"none",
                      display:"inline-block",
                      padding:"10px 16px",
                      border:"1px solid rgba(255,255,255,.24)",
                      color:"#fff",
                      fontFamily:"'Figtree',sans-serif",
                      fontSize:12.5,
                      fontWeight:700
                    }}
                  >
                    Add to Google Calendar ↗
                  </a>
                </div>
              </>
            ) : (
              <Txt s={{ color:"rgba(255,255,255,.65)" }}>
                There are no upcoming live sessions for this group.
              </Txt>
            )}
          </div>

          <div style={{
            border:"1px solid var(--brd)",
            background:"#fff",
            padding:"20px 22px"
          }}>
            <div style={{
              display:"flex",
              justifyContent:"space-between",
              gap:14,
              flexWrap:"wrap",
              alignItems:"baseline",
              marginBottom:6
            }}>
              <div>
                <div style={{
                  fontFamily:"'Figtree',sans-serif",
                  fontSize:10.5,
                  fontWeight:700,
                  color:"#5A5956",
                  letterSpacing:".12em",
                  textTransform:"uppercase",
                  marginBottom:4
                }}>
                  Full Schedule
                </div>
                <div style={{
                  fontFamily:"'Cormorant Garamond',serif",
                  fontSize:20,
                  fontWeight:600,
                  color:"#1A1917"
                }}>
                  {group.name}
                </div>
              </div>
              <div style={{
                fontFamily:"'Figtree',sans-serif",
                fontSize:12,
                color:"#8A8884"
              }}>
                Times shown in {tz}
              </div>
            </div>

            {sessions.length === 0 ? (
              <Txt muted s={{ marginTop:14 }}>No live sessions have been scheduled yet.</Txt>
            ) : (
              <div style={{ marginTop:12 }}>
                {sessions.map((session, index) => {
                  const start = new Date(session.session_date).getTime();
                  const isPast = start < now;
                  const isNext = nextSession?.id === session.id;

                  return (
                    <div
                      key={session.id}
                      style={{
                        display:"grid",
                        gridTemplateColumns:"1fr auto",
                        gap:16,
                        alignItems:"center",
                        padding:"16px 0",
                        borderTop:index===0?"1px solid var(--brd)":"1px solid var(--brd)"
                      }}
                    >
                      <div>
                        <div style={{
                          display:"flex",
                          gap:8,
                          alignItems:"center",
                          flexWrap:"wrap",
                          marginBottom:4
                        }}>
                          <strong style={{
                            fontFamily:"'Figtree',sans-serif",
                            fontSize:13.5,
                            color:"#1A1917"
                          }}>
                            Module {session.module_id}
                          </strong>
                          {isNext && <span className="tag tr">Next</span>}
                          {isPast && !isNext && <span className="tag tb">Past</span>}
                        </div>

                        <div style={{
                          fontFamily:"'Cormorant Garamond',serif",
                          fontSize:17,
                          fontWeight:600,
                          color:"#1A1917",
                          marginBottom:3
                        }}>
                          {moduleTitle(session.module_id)}
                        </div>

                        <Txt muted s={{ fontSize:12.8 }}>
                          {formatLocalDateTime(session.session_date)}
                        </Txt>
                      </div>

                      <div style={{
                        display:"flex",
                        gap:8,
                        flexWrap:"wrap",
                        justifyContent:"flex-end"
                      }}>
                        {!isPast && group.meeting_url && (
                          <a
                            href={group.meeting_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bo"
                            style={{ textDecoration:"none",whiteSpace:"nowrap" }}
                          >
                            Join →
                          </a>
                        )}
                        {!isPast && (
                          <a
                            href={googleCalendarUrl({
                              session,
                              group,
                              moduleTitle:moduleTitle(session.module_id)
                            })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bo"
                            style={{ textDecoration:"none",whiteSpace:"nowrap" }}
                          >
                            Add to Calendar ↗
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
