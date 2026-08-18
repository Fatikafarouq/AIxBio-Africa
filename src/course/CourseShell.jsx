import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { courseMeta, coursePreviewModules } from "./courseMeta";
import { PageHdr, Sec, Ey, H2, Txt, FF } from "./CoursePrimitives";
import { FacilitatorHub, FacilitatorModuleDetail } from "./FacilitatorTool";
import { ParticipantHub, ParticipantModuleDetail } from "./ParticipantTool";

const COURSE_LAUNCHED = import.meta.env.VITE_COURSE_LAUNCHED === "true";

const ComingSoon = () => (
  <div className="pat-dk" style={{ minHeight:"100vh",background:"#1C1B18",display:"flex",alignItems:"center",justifyContent:"center",padding:"100px 24px 40px" }}>
    <div style={{ maxWidth:620,textAlign:"center" }}>
      <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:10.5,fontWeight:700,color:"#B8102A",letterSpacing:".2em",textTransform:"uppercase",marginBottom:18 }}>AIxBio Africa Courses</div>
      <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(34px,5vw,64px)",fontWeight:600,color:"#fff",lineHeight:1.1 }}>Coming soon.</h1>
      <p style={{ fontFamily:"'Figtree',sans-serif",fontSize:15,color:"rgba(255,255,255,.55)",lineHeight:1.7,marginTop:16 }}>Introduction to AI &amp; Biosecurity in Africa is being prepared for launch.</p>
    </div>
  </div>
);

const Landing = ({ go }) => {
  const [open,setOpen]=useState(false);
  return (
    <>
      <PageHdr label="Course" title={courseMeta.title} sub={courseMeta.purpose}/>
      <Sec bg="#fff">
        <div className="g2" style={{ display:"grid",gridTemplateColumns:"1.15fr .85fr",gap:60,alignItems:"start" }}>
          <div>
            <div className="reveal" style={{ marginBottom:38 }}>
              <Ey label="Who this course is for"/>
              <Txt s={{ fontSize:16 }}>{courseMeta.whoItsFor}</Txt>
            </div>
            <div className="reveal">
              <Ey label="By the end"/>
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                {courseMeta.outcomes.map((o,i)=><div key={i} style={{ display:"flex",gap:11 }}><span style={{ color:"#B8102A",fontWeight:700 }}>—</span><Txt muted s={{ fontSize:14.5 }}>{o}</Txt></div>)}
              </div>
            </div>
          </div>
          <aside className="reveal d2" style={{ background:"#F7F6F2",border:"1px solid var(--brd)",padding:"26px" }}>
            <Ey label="Applications"/>
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:600,color:"#1A1917",marginBottom:10 }}>Join the course</h3>
            <Txt muted s={{ fontSize:14,marginBottom:20 }}>Choose whether to apply as a participant or facilitator after signing in.</Txt>
            <button className="br" style={{ width:"100%" }} onClick={()=>go("course-apply")}>Apply</button>
          </aside>
        </div>
        <div className="reveal" style={{ marginTop:54,borderTop:"1px solid var(--brd)",paddingTop:30 }}>
          <button className="bn" onClick={()=>setOpen(v=>!v)} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",textAlign:"left",padding:"8px 0" }}>
            <H2 s={{ fontSize:25 }}>Browse curriculum</H2><span style={{ color:"#B8102A",fontSize:18,transform:open?"rotate(180deg)":"none" }}>↓</span>
          </button>
          {open&&<div style={{ marginTop:16 }}>{coursePreviewModules.map(m=><div key={m.id} style={{ padding:"18px 0",borderTop:"1px solid var(--brd)" }}><h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:600,color:"#1A1917",marginBottom:5 }}>{m.id}. {m.title}</h3><Txt muted s={{ fontSize:13.5 }}>{m.overview}</Txt></div>)}</div>}
        </div>
      </Sec>
    </>
  );
};

const WEEK_DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const AVAILABILITY_PERIODS = [
  { id:"morning", label:"Morning", time:"8:00–12:00" },
  { id:"afternoon", label:"Afternoon", time:"12:00–17:00" },
  { id:"evening", label:"Evening", time:"17:00–21:00" },
];

const emptyParticipantAnswers = {
  full_name:"",
  country:"",
  current_role:"",
  institution:"",
  background:"",
  motivation:"",
  learning_goal:"",
  commitment:"",
  timezone:"",
  additional:"",
};

const emptyFacilitatorAnswers = {
  full_name:"",
  country:"",
  current_role:"",
  institution:"",
  background:"",
  motivation:"",
  facilitation_experience:"",
  relevant_experience:"",
  mixed_levels:"",
  commitment:"",
  timezone:"",
  weekly_availability:{},
  additional:"",
};

const answerLabel = key => ({
  full_name:"Full name",
  country:"Country of residence",
  current_role:"Current role / occupation",
  institution:"Institution / organization",
  background:"Background / short bio",
  motivation:"Motivation",
  learning_goal:"What they hope to do with the course",
  commitment:"Commitment",
  timezone:"Timezone",
  facilitation_experience:"Facilitation experience",
  relevant_experience:"Relevant AI / biosecurity experience",
  mixed_levels:"Working with mixed levels of technical knowledge",
  weekly_availability:"Weekly availability",
  additional:"Anything else",
}[key] || key.replaceAll("_"," "));

const AvailabilityGrid = ({ value, onChange }) => {
  const toggle=(day,period)=>{
    const current=value?.[day]||[];
    const next=current.includes(period) ? current.filter(x=>x!==period) : [...current,period];
    onChange({...value,[day]:next});
  };

  return (
    <div style={{ marginBottom:22 }}>
      <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:12,fontWeight:700,color:"#1A1917",marginBottom:7 }}>Weekly availability</div>
      <Txt muted s={{ fontSize:13.5,marginBottom:14 }}>
        Select all periods when you are generally available for a recurring weekly 60–90 minute session. Use your local timezone.
      </Txt>
      <div style={{ overflowX:"auto",border:"1px solid var(--brd)",background:"#fff" }}>
        <div style={{ minWidth:620 }}>
          <div style={{ display:"grid",gridTemplateColumns:"1.25fr repeat(3,1fr)",background:"#F7F6F2",borderBottom:"1px solid var(--brd)" }}>
            <div style={{ padding:"11px 12px",fontSize:11,fontWeight:700,color:"#5A5956",textTransform:"uppercase",letterSpacing:".06em" }}>Day</div>
            {AVAILABILITY_PERIODS.map(p=><div key={p.id} style={{ padding:"11px 12px",fontSize:11,fontWeight:700,color:"#5A5956",textAlign:"center" }}>{p.label}<div style={{ fontSize:10,fontWeight:500,marginTop:2 }}>{p.time}</div></div>)}
          </div>
          {WEEK_DAYS.map(day=>(
            <div key={day} style={{ display:"grid",gridTemplateColumns:"1.25fr repeat(3,1fr)",borderBottom:day==="Sunday"?"none":"1px solid var(--brd)",alignItems:"center" }}>
              <div style={{ padding:"12px",fontSize:13,fontWeight:600,color:"#1A1917" }}>{day}</div>
              {AVAILABILITY_PERIODS.map(p=>{
                const checked=(value?.[day]||[]).includes(p.id);
                return (
                  <label key={p.id} style={{ display:"flex",justifyContent:"center",alignItems:"center",padding:"12px",cursor:"pointer" }}>
                    <input type="checkbox" checked={checked} onChange={()=>toggle(day,p.id)} aria-label={`${day} ${p.label}`}/>
                  </label>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ApplicationPage = ({ session, openAuth }) => {
  const [role,setRole]=useState("");
  const [answers,setAnswers]=useState(emptyParticipantAnswers);
  const [status,setStatus]=useState("");
  const [error,setError]=useState("");
  const [existing,setExisting]=useState(null);

  useEffect(()=>{
    if(!session?.user) return;
    supabase.from("applications").select("id,role,status,created_at").eq("user_id",session.user.id).order("created_at",{ascending:false}).limit(1).maybeSingle().then(({data})=>setExisting(data||null));
  },[session?.user?.id]);

  const chooseRole=r=>{
    setRole(r);
    setError("");
    setAnswers(r==="facilitator" ? {...emptyFacilitatorAnswers} : {...emptyParticipantAnswers});
  };

  if(!session) return (
    <>
      <PageHdr label="Course Application" title="Sign in to apply" sub="Your AIxBio Africa account is used for the application and, if accepted, course access."/>
      <Sec bg="#fff"><div style={{ maxWidth:520 }}><button className="br" onClick={openAuth}>Sign in to apply</button></div></Sec>
    </>
  );

  if(status==="done") return <><PageHdr label="Application" title="Thanks — you'll hear back soon."/><Sec bg="#fff"><Txt muted>Your application has been submitted for review. There is no automatic acceptance.</Txt></Sec></>;
  if(existing) return <><PageHdr label="Application" title={existing.status==="pending"?"Your application is under review.":`Application ${existing.status}.`}/><Sec bg="#fff"><Txt muted>You applied as a {existing.role}. We’ll use this account for any course access attached to your application.</Txt></Sec></>;

  const update=(key,value)=>setAnswers(a=>({...a,[key]:value}));

  const submit=async()=>{
    const participantRequired=["full_name","country","current_role","background","motivation","learning_goal","commitment","timezone"];
    const facilitatorRequired=["full_name","country","current_role","background","motivation","facilitation_experience","relevant_experience","mixed_levels","commitment","timezone"];
    const required=role==="facilitator"?facilitatorRequired:participantRequired;
    const missing=required.some(key=>!String(answers[key]||"").trim());

    if(!role||missing){
      setError("Please complete all required fields.");
      return;
    }
    if(answers.commitment!=="Yes"){
      setError(role==="facilitator"
        ? "Facilitators must be able to commit to preparing for and facilitating all 6 live sessions."
        : "Participants must be able to commit to attending at least 4 of the 6 live sessions and completing the required preparation.");
      return;
    }
    if(role==="facilitator"){
      const selected=Object.values(answers.weekly_availability||{}).flat();
      if(selected.length===0){
        setError("Please select at least one weekly availability period.");
        return;
      }
    }

    const {error:e}=await supabase.from("applications").insert({user_id:session.user.id,role,answers});
    if(e){setError(e.message);return;}
    setStatus("done");
  };

  return (
    <>
      <PageHdr label="Course Application" title="Choose how you want to take part"/>
      <Sec bg="#fff">
        <div style={{ maxWidth:820 }}>
          {!role ? (
            <div className="g2" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:18 }}>
              {[["facilitator","Apply as a Facilitator","Lead a small course group and guide the six facilitated sessions."],["participant","Apply as a Participant","Join a facilitated group and work through the six-module course."]].map(([r,t,d])=>(
                <button key={r} onClick={()=>chooseRole(r)} style={{ textAlign:"left",background:"#F7F6F2",border:"1px solid var(--brd)",padding:"26px",cursor:"pointer" }}>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:"#1A1917",marginBottom:8 }}>{t}</h3>
                  <Txt muted s={{ fontSize:13.5 }}>{d}</Txt>
                </button>
              ))}
            </div>
          ):(
            <div>
              <button className="bn" onClick={()=>{setRole("");setError("");}} style={{ color:"#B8102A",fontWeight:600,fontSize:12.5,marginBottom:22 }}>← Change role</button>
              <H2 s={{ marginBottom:8 }}>{role==="facilitator"?"Facilitator":"Participant"} application</H2>
              <Txt muted s={{ fontSize:13.5,marginBottom:26 }}>Fields marked optional may be left blank.</Txt>

              <FF label="Full name"><input value={answers.full_name} onChange={e=>update("full_name",e.target.value)}/></FF>
              <FF label="Country of residence"><input value={answers.country} onChange={e=>update("country",e.target.value)}/></FF>
              <FF label={role==="facilitator"?"Current role / position":"Current role or occupation"}><input value={answers.current_role} onChange={e=>update("current_role",e.target.value)}/></FF>
              <FF label="Institution / organization (optional)"><input value={answers.institution} onChange={e=>update("institution",e.target.value)}/></FF>
              <FF label="Tell us briefly about yourself and your background"><textarea value={answers.background} onChange={e=>update("background",e.target.value)} placeholder="A short bio covering where you are coming from academically, professionally, or otherwise."/></FF>

              {role==="participant" ? (
                <>
                  <FF label="Why are you interested in AI and biosecurity, and why do you want to join this course?"><textarea value={answers.motivation} onChange={e=>update("motivation",e.target.value)}/></FF>
                  <FF label="What do you hope to do with what you learn from the course?"><textarea value={answers.learning_goal} onChange={e=>update("learning_goal",e.target.value)}/></FF>
                  <FF label="Can you commit to attending at least 4 of the 6 live sessions and completing the required pre-session preparation?">
                    <select value={answers.commitment} onChange={e=>update("commitment",e.target.value)}>
                      <option value="">Choose an answer</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </FF>
                  <FF label="What timezone are you based in?"><input value={answers.timezone} onChange={e=>update("timezone",e.target.value)} placeholder="e.g. WAT / UTC+1"/></FF>
                  <FF label="Is there anything else you would like us to know? (optional)"><textarea value={answers.additional} onChange={e=>update("additional",e.target.value)}/></FF>
                </>
              ):(
                <>
                  <FF label="Why are you interested in facilitating this course?"><textarea value={answers.motivation} onChange={e=>update("motivation",e.target.value)}/></FF>
                  <FF label="What experience do you have facilitating discussions, teaching, mentoring, workshops, communities, or group learning?"><textarea value={answers.facilitation_experience} onChange={e=>update("facilitation_experience",e.target.value)}/></FF>
                  <FF label="What experience or knowledge do you have that is relevant to AI, biosecurity, biology, public health, technology policy, governance, research, or African science and technology contexts?"><textarea value={answers.relevant_experience} onChange={e=>update("relevant_experience",e.target.value)}/></FF>
                  <FF label="How would you handle a discussion where participants have very different levels of technical knowledge?"><textarea value={answers.mixed_levels} onChange={e=>update("mixed_levels",e.target.value)}/></FF>
                  <FF label="Can you commit to preparing for and facilitating all 6 live sessions for your assigned group, including attendance and pre-session exercise tracking?">
                    <select value={answers.commitment} onChange={e=>update("commitment",e.target.value)}>
                      <option value="">Choose an answer</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </FF>
                  <FF label="What timezone are you based in?"><input value={answers.timezone} onChange={e=>update("timezone",e.target.value)} placeholder="e.g. WAT / UTC+1"/></FF>
                  <AvailabilityGrid value={answers.weekly_availability} onChange={value=>update("weekly_availability",value)}/>
                  <FF label="Is there anything else you would like us to know? (optional)"><textarea value={answers.additional} onChange={e=>update("additional",e.target.value)}/></FF>
                </>
              )}

              {error&&<div className="err" style={{ marginBottom:12 }}>{error}</div>}
              <button className="br" onClick={submit}>Submit application</button>
            </div>
          )}
        </div>
      </Sec>
    </>
  );
};
const AccessMessage = ({ session, openAuth, text }) => (
  <>
    <PageHdr label="Course Access" title={!session?"Sign in to continue":"Your application is still under review"}/>
    <Sec bg="#fff"><div style={{ maxWidth:540 }}><Txt muted s={{ marginBottom:22 }}>{text || (!session?"Sign in with the account you used to apply.":"Course access will appear here once your application is accepted and you are assigned to a cohort group.")}</Txt>{!session&&<button className="br" onClick={openAuth}>Sign in</button>}</div></Sec>
  </>
);

const RoleTool = ({ role, page, params, session, isAdmin, go, openAuth }) => {
  const [payload,setPayload]=useState(null);
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    let alive=true;
    if(!session){setLoading(false);return;}
    setLoading(true);
    supabase.functions.invoke("course-content",{body:{role}}).then(({data,error:e})=>{
      if(!alive)return;
      if(e){setError(data?.error || e.message);setPayload(null);} else {setPayload(data);setError("");}
      setLoading(false);
    });
    return()=>{alive=false;};
  },[session?.access_token,role,isAdmin]);

  if(!session) return <AccessMessage session={session} openAuth={openAuth}/>;
  if(loading) return <><PageHdr label="Course Access" title="Loading course…"/><Sec bg="#fff"><Txt muted>Checking your course access.</Txt></Sec></>;
  if(error||!payload) return <AccessMessage session={session} openAuth={openAuth} text={error||undefined}/>;

  if(role==="facilitator"){
    return page==="facilitator-module"
      ? <FacilitatorModuleDetail slug={params.slug} go={go} courseModules={payload.courseModules}/>
      : <FacilitatorHub go={go} courseMeta={payload.courseMeta} courseModules={payload.courseModules}/>;
  }
  return page==="participant-module"
    ? <ParticipantModuleDetail
        slug={params.slug}
        go={go}
        courseModules={payload.courseModules}
        progress={payload.progress}
        capstone={payload.capstone}
      />
    : <ParticipantHub
        go={go}
        courseMeta={payload.courseMeta}
        courseModules={payload.courseModules}
        progress={payload.progress}
        capstone={payload.capstone}
      />;
};

const AdminDashboard = ({ go }) => {
  const [tab,setTab]=useState("applications");
  const [applications,setApplications]=useState([]);
  const [cohorts,setCohorts]=useState([]);
  const [groups,setGroups]=useState([]);
  const [members,setMembers]=useState([]);
  const [facilitators,setFacilitators]=useState([]);
  const [selectedCohort,setSelectedCohort]=useState("");
  const [newCohort,setNewCohort]=useState({name:"",start_date:""});
  const [newGroup,setNewGroup]=useState({cohort_id:"",name:"",timezone_label:"",facilitator_user_id:"",dates:["","","","","",""]});
  const [error,setError]=useState("");

  const load=async()=>{
    setError("");
    const [a,c,g,m,f]=await Promise.all([
      supabase.rpc("admin_list_applications"),
      supabase.from("cohorts").select("*").order("start_date",{ascending:false}),
      supabase.from("cohort_groups").select("*,group_sessions(*)").order("name"),
      supabase.from("cohort_members").select("*"),
      supabase.rpc("admin_list_accepted_facilitators"),
    ]);
    const first=[a,c,g,m,f].find(x=>x.error);
    if(first?.error){setError(first.error.message);return;}
    setApplications(a.data||[]); setCohorts(c.data||[]); setGroups(g.data||[]); setMembers(m.data||[]); setFacilitators(f.data||[]);
    if(!selectedCohort && c.data?.[0]) setSelectedCohort(c.data[0].id);
  };

  useEffect(()=>{load();},[]);

  const decide=async(app,status)=>{
    let groupId=null;
    if(status==="accepted"){
      groupId=window.prompt("Paste the cohort group ID to assign this person to:");
      if(!groupId)return;
    }
    const {error:e}=await supabase.rpc("admin_decide_application",{p_application_id:app.id,p_status:status,p_group_id:groupId});
    if(e){setError(e.message);return;}
    await load();
  };

  const createCohort=async()=>{
    if(!newCohort.name.trim())return;
    const {error:e}=await supabase.from("cohorts").insert({name:newCohort.name,start_date:newCohort.start_date||null,status:"setup"});
    if(e){setError(e.message);return;}
    setNewCohort({name:"",start_date:""}); await load();
  };

  const createGroup=async()=>{
    if(!newGroup.cohort_id||!newGroup.name.trim()||newGroup.dates.some(d=>!d)){setError("Choose a cohort, name the group, and enter all six session dates.");return;}
    const {data:g,error:e}=await supabase.from("cohort_groups").insert({cohort_id:newGroup.cohort_id,name:newGroup.name,timezone_label:newGroup.timezone_label||null,facilitator_user_id:newGroup.facilitator_user_id||null}).select().single();
    if(e){setError(e.message);return;}
    const rows=newGroup.dates.map((d,i)=>({group_id:g.id,module_id:i+1,session_date:new Date(d).toISOString()}));
    const {error:se}=await supabase.from("group_sessions").insert(rows);
    if(se){setError(se.message);return;}
    setNewGroup({cohort_id:"",name:"",timezone_label:"",facilitator_user_id:"",dates:["","","","","",""]}); await load();
  };

  const selectedGroups=groups.filter(g=>g.cohort_id===selectedCohort);
  const facilitatorName=id=>facilitators.find(f=>f.user_id===id)?.full_name || (id?"Assigned facilitator":"Unassigned");
  const now=Date.now();

  return (
    <>
      <div style={{ background:"#1C1B18",padding:"128px 44px 0" }}>
        <div style={{ maxWidth:1160,margin:"0 auto" }}>
          <Ey label="Course Admin"/>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(26px,3vw,40px)",fontWeight:600,color:"#fff" }}>Introduction to AI &amp; Biosecurity in Africa</h1>
          <div style={{ display:"flex",marginTop:24,borderBottom:"1px solid rgba(255,255,255,.08)",overflowX:"auto" }}>
            {[["applications","Applications"],["cohorts","Cohorts"],["groups","Groups & Schedule"],["oversight","Oversight"],["preview","View as"]].map(([id,l])=><button key={id} className="nb" onClick={()=>setTab(id)} style={{ color:tab===id?"#fff":"rgba(255,255,255,.38)",borderBottom:tab===id?"2px solid #B8102A":"2px solid transparent",padding:"11px 18px",fontSize:13,marginBottom:-1 }}>{l}</button>)}
          </div>
        </div>
      </div>
      <Sec bg="#fff">
        {error&&<div className="err" style={{ marginBottom:18 }}>{error}</div>}
        {tab==="applications"&&<div>
          <H2 s={{ marginBottom:20 }}>Applications review</H2>
          {applications.filter(a=>a.status==="pending").length===0?<Txt muted>No pending applications.</Txt>:applications.filter(a=>a.status==="pending").map(a=><div key={a.id} style={{ border:"1px solid var(--brd)",padding:"20px 22px",marginBottom:12 }}>
            <div style={{ display:"flex",justifyContent:"space-between",gap:18,flexWrap:"wrap" }}>
              <div><h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600 }}>{a.full_name}</h3><Txt muted s={{ fontSize:13 }}>{a.email} · {a.role} · {new Date(a.created_at).toLocaleDateString()}</Txt></div>
              <div style={{ display:"flex",gap:8 }}><button className="br" onClick={()=>decide(a,"accepted")}>Accept & assign group</button><button className="bo" onClick={()=>decide(a,"rejected")}>Reject</button></div>
            </div>
            <div style={{ marginTop:14,background:"#F7F6F2",padding:"14px 16px" }}>{Object.entries(a.answers||{}).filter(([,v])=>v!==""&&v!=null).map(([k,v])=>{
              if(k==="weekly_availability"){
                const rows=Object.entries(v||{}).filter(([,periods])=>periods?.length);
                return <div key={k} style={{ marginBottom:10 }}><strong style={{ fontSize:12 }}>{answerLabel(k)}:</strong><div style={{ marginTop:5 }}>{rows.length?rows.map(([day,periods])=><div key={day} style={{ fontSize:13.5,color:"#5A5956",marginBottom:3 }}><span style={{ fontWeight:600 }}>{day}:</span> {periods.map(p=>AVAILABILITY_PERIODS.find(x=>x.id===p)?.label||p).join(", ")}</div>):<span style={{ fontSize:13.5,color:"#5A5956" }}>None selected</span>}</div></div>;
              }
              return <div key={k} style={{ marginBottom:8 }}><strong style={{ fontSize:12 }}>{answerLabel(k)}:</strong> <span style={{ fontSize:13.5,color:"#5A5956" }}>{String(v)}</span></div>;
            })}</div>
          </div>)}
        </div>}
        {tab==="cohorts"&&<div style={{ maxWidth:650 }}><H2 s={{ marginBottom:20 }}>Create cohort</H2><FF label="Cohort name"><input value={newCohort.name} onChange={e=>setNewCohort(x=>({...x,name:e.target.value}))} placeholder="Intro Course — Cohort 1"/></FF><FF label="Start date"><input type="date" value={newCohort.start_date} onChange={e=>setNewCohort(x=>({...x,start_date:e.target.value}))}/></FF><button className="br" onClick={createCohort}>Create cohort</button><div style={{ marginTop:30 }}>{cohorts.map(c=><div key={c.id} style={{ borderTop:"1px solid var(--brd)",padding:"14px 0" }}><strong>{c.name}</strong><div style={{ fontSize:12.5,color:"#5A5956" }}>{c.start_date||"No start date"} · {c.status} · ID: {c.id}</div></div>)}</div></div>}
        {tab==="groups"&&<div style={{ maxWidth:760 }}><H2 s={{ marginBottom:20 }}>Create group & six-session schedule</H2><FF label="Cohort"><select value={newGroup.cohort_id} onChange={e=>setNewGroup(x=>({...x,cohort_id:e.target.value}))}><option value="">Choose cohort</option>{cohorts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></FF><FF label="Group name"><input value={newGroup.name} onChange={e=>setNewGroup(x=>({...x,name:e.target.value}))} placeholder="West/Central Africa"/></FF><FF label="Timezone label"><input value={newGroup.timezone_label} onChange={e=>setNewGroup(x=>({...x,timezone_label:e.target.value}))} placeholder="WAT / UTC+1"/></FF><FF label="Facilitator (optional until accepted)"><select value={newGroup.facilitator_user_id} onChange={e=>setNewGroup(x=>({...x,facilitator_user_id:e.target.value}))}><option value="">Unassigned</option>{facilitators.map(f=><option key={f.user_id} value={f.user_id}>{f.full_name} — {f.email}</option>)}</select></FF>{newGroup.dates.map((d,i)=><FF key={i} label={`Module ${i+1} session`}><input type="datetime-local" value={d} onChange={e=>setNewGroup(x=>({...x,dates:x.dates.map((v,j)=>j===i?e.target.value:v)}))}/></FF>)}<button className="br" onClick={createGroup}>Create group & schedule</button><div style={{ marginTop:30 }}>{groups.map(g=><div key={g.id} style={{ borderTop:"1px solid var(--brd)",padding:"14px 0" }}><strong>{g.name}</strong><div style={{ fontSize:12.5,color:"#5A5956" }}>{g.timezone_label||"No timezone"} · ID: {g.id}</div></div>)}</div></div>}
        {tab==="oversight"&&<div><div style={{ display:"flex",justifyContent:"space-between",gap:16,alignItems:"end",marginBottom:24,flexWrap:"wrap" }}><H2>Oversight</H2><select style={{ maxWidth:320 }} value={selectedCohort} onChange={e=>setSelectedCohort(e.target.value)}><option value="">Choose cohort</option>{cohorts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div className="g3" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16 }}>{selectedGroups.map(g=>{const sessions=[...(g.group_sessions||[])].sort((a,b)=>new Date(a.session_date)-new Date(b.session_date));const passed=sessions.filter(s=>new Date(s.session_date).getTime()<=now).length;const next=sessions.find(s=>new Date(s.session_date).getTime()>now);const count=members.filter(m=>m.group_id===g.id&&m.role==="participant"&&m.status==="accepted").length;return <div key={g.id} style={{ border:"1px solid var(--brd)",background:"#F7F6F2",padding:"20px" }}><h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:21,fontWeight:600,marginBottom:10 }}>{g.name}</h3><Txt muted s={{ fontSize:13 }}>Facilitator: {facilitatorName(g.facilitator_user_id)}</Txt><Txt muted s={{ fontSize:13 }}>Participants: {count}</Txt><Txt muted s={{ fontSize:13 }}>Current week: {passed}</Txt><Txt muted s={{ fontSize:13 }}>Next session: {next?new Date(next.session_date).toLocaleString():"None"}</Txt></div>})}</div></div>}
        {tab==="preview"&&<div><H2 s={{ marginBottom:12 }}>View as</H2><Txt muted s={{ marginBottom:20 }}>Admin preview uses your admin account; no second account is required.</Txt><div style={{ display:"flex",gap:10,flexWrap:"wrap" }}><button className="br" onClick={()=>go("facilitator")}>View as facilitator</button><button className="bo" onClick={()=>go("participant")}>View as participant</button></div></div>}
      </Sec>
    </>
  );
};

export default function CourseShell({ page, params, session, isAdmin, go, openAuth }) {
  if(!COURSE_LAUNCHED && !isAdmin) return <ComingSoon/>;
  if(page==="courses") return <Landing go={go}/>;
  if(page==="course-apply") return <ApplicationPage session={session} openAuth={openAuth}/>;
  if(page==="course-admin") return isAdmin?<AdminDashboard go={go}/>:<AccessMessage session={session} openAuth={openAuth} text="Admin access is required."/>;
  if(page==="facilitator"||page==="facilitator-module") return <RoleTool role="facilitator" page={page} params={params} session={session} isAdmin={isAdmin} go={go} openAuth={openAuth}/>;
  if(page==="participant"||page==="participant-module") return <RoleTool role="participant" page={page} params={params} session={session} isAdmin={isAdmin} go={go} openAuth={openAuth}/>;
  return <Landing go={go}/>;
}

