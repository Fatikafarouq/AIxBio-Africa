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

const Landing = ({ go, session }) => {
  const [open,setOpen]=useState(false);
  const [existing,setExisting]=useState(null);

  useEffect(()=>{
    let alive=true;
    if(!session?.user){setExisting(null);return;}
    supabase
      .from("applications")
      .select("id,role,status,created_at")
      .eq("user_id",session.user.id)
      .order("created_at",{ascending:false})
      .limit(1)
      .maybeSingle()
      .then(({data})=>{if(alive)setExisting(data||null);});
    return()=>{alive=false;};
  },[session?.user?.id]);

  const accepted=existing?.status==="accepted";
  const applicationExists=Boolean(existing);

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
            <Ey label={accepted?"Course Access":"Applications"}/>
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:600,color:"#1A1917",marginBottom:10 }}>
              {accepted ? "Continue your course" : applicationExists ? "Your application" : "Join the course"}
            </h3>
            <Txt muted s={{ fontSize:14,marginBottom:20 }}>
              {accepted
                ? `Your ${existing.role} application has been accepted. Continue to your course dashboard.`
                : applicationExists
                  ? existing.status==="pending"
                    ? "Your application is currently under review."
                    : `Your application status is ${existing.status}.`
                  : "Choose whether to apply as a participant or facilitator after signing in."}
            </Txt>
            <button
              className="br"
              style={{ width:"100%" }}
              onClick={()=>{
                if(accepted) go(existing.role==="facilitator"?"facilitator":"participant");
                else go("course-apply");
              }}
            >
              {accepted ? "Continue Course →" : applicationExists ? "View Application →" : "Apply"}
            </button>
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
      <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:12,fontWeight:700,color:"#1A1917",marginBottom:7 }}>Weekly availability *</div>
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
                  <div key={p.id} style={{ display:"flex",justifyContent:"center",alignItems:"center",padding:"12px" }}>
                    <button
                      type="button"
                      onClick={()=>toggle(day,p.id)}
                      aria-pressed={checked}
                      aria-label={`${day} ${p.label}`}
                      style={{
                        width:30,
                        height:30,
                        border:checked?"1px solid #B8102A":"1px solid #CFCBC3",
                        background:checked?"#B8102A":"#fff",
                        color:checked?"#fff":"transparent",
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center",
                        cursor:"pointer",
                        fontSize:18,
                        fontWeight:700,
                        lineHeight:1,
                        padding:0
                      }}
                    >
                      ✓
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ApplicationPage = ({ session, openAuth, go }) => {
  const [role,setRole]=useState("");
  const [answers,setAnswers]=useState(emptyParticipantAnswers);
  const [status,setStatus]=useState("");
  const [error,setError]=useState("");
  const [fieldErrors,setFieldErrors]=useState({});
  const [existing,setExisting]=useState(null);

  useEffect(()=>{
    if(!session?.user) return;
    supabase.from("applications").select("id,role,status,created_at").eq("user_id",session.user.id).order("created_at",{ascending:false}).limit(1).maybeSingle().then(({data})=>setExisting(data||null));
  },[session?.user?.id]);

  useEffect(()=>{
    if(existing?.status==="accepted"){
      go(existing.role==="facilitator" ? "facilitator" : "participant");
    }
  },[existing?.status,existing?.role,go]);

  const chooseRole=r=>{
    setRole(r);
    setError("");
    setFieldErrors({});
    setAnswers(r==="facilitator" ? {...emptyFacilitatorAnswers} : {...emptyParticipantAnswers});
  };

  if(!session) return (
    <>
      <PageHdr label="Course Application" title="Sign in to apply" sub="Your AIxBio Africa account is used for the application and, if accepted, course access."/>
      <Sec bg="#fff"><div style={{ maxWidth:520 }}><button className="br" onClick={openAuth}>Sign in to apply</button></div></Sec>
    </>
  );

  if(status==="done") return <><PageHdr label="Application" title="Thanks — you'll hear back soon."/><Sec bg="#fff"><Txt muted>Your application has been submitted for review. There is no automatic acceptance.</Txt></Sec></>;
  if(existing?.status==="accepted") return <><PageHdr label="Course Access" title="Opening your course…"/><Sec bg="#fff"><Txt muted>Your application has been accepted. Taking you to your course dashboard.</Txt></Sec></>;
  if(existing) return <><PageHdr label="Application" title={existing.status==="pending"?"Your application is under review.":`Application ${existing.status}.`}/><Sec bg="#fff"><Txt muted>You applied as a {existing.role}. We’ll use this account for any course access attached to your application.</Txt></Sec></>;

  const update=(key,value)=>{
    setAnswers(a=>({...a,[key]:value}));
    setFieldErrors(prev=>({...prev,[key]:""}));
    setError("");
  };

  const FieldError = ({ name }) => fieldErrors[name]
    ? <div className="err" style={{ marginTop:7,marginBottom:2 }}>{fieldErrors[name]}</div>
    : null;

  const submit=async()=>{
    const participantRequired=["full_name","country","current_role","institution","background","motivation","learning_goal","commitment","timezone"];
    const facilitatorRequired=["full_name","country","current_role","institution","background","motivation","facilitation_experience","relevant_experience","mixed_levels","commitment","timezone"];
    const required=role==="facilitator"?facilitatorRequired:participantRequired;

    const labels={
      full_name:"Full name",
      country:"Country of residence",
      current_role:role==="facilitator"?"Current role / position":"Current role or occupation",
      institution:"Institution / organization",
      background:"Background / short bio",
      motivation:role==="facilitator"?"Why you want to facilitate":"Why you want to join the course",
      learning_goal:"What you hope to do with what you learn",
      facilitation_experience:"Facilitation experience",
      relevant_experience:"Relevant experience or knowledge",
      mixed_levels:"How you would handle mixed technical levels",
      commitment:"Commitment",
      timezone:"Timezone",
      weekly_availability:"Weekly availability",
    };

    const nextErrors={};
    required.forEach(key=>{
      if(!String(answers[key]||"").trim()) nextErrors[key]=`${labels[key]} is required.`;
    });

    if(role==="facilitator"){
      const selected=Object.values(answers.weekly_availability||{}).flat();
      if(selected.length===0) nextErrors.weekly_availability="Please select at least one weekly availability period.";
    }

    if(Object.keys(nextErrors).length){
      setFieldErrors(nextErrors);
      setError("Please complete all required fields marked with an asterisk (*).");
      return;
    }

    if(answers.commitment!=="Yes"){
      const message=role==="facilitator"
        ? "Facilitators must be able to commit to preparing for and facilitating all 6 live sessions."
        : "Participants must be able to commit to attending at least 4 of the 6 live sessions and completing the required preparation.";
      setFieldErrors({commitment:message});
      setError(message);
      return;
    }

    setFieldErrors({});
    setError("");
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
              <button className="bn" onClick={()=>{setRole("");setError("");setFieldErrors({});}} style={{ color:"#B8102A",fontWeight:600,fontSize:12.5,marginBottom:22 }}>← Change role</button>
              <H2 s={{ marginBottom:8 }}>{role==="facilitator"?"Facilitator":"Participant"} application</H2>

              <FF label="Full name *"><input value={answers.full_name} onChange={e=>update("full_name",e.target.value)}/><FieldError name="full_name"/></FF>
              <FF label="Country of residence *"><input value={answers.country} onChange={e=>update("country",e.target.value)}/><FieldError name="country"/></FF>
              <FF label={`${role==="facilitator"?"Current role / position":"Current role or occupation"} *`}><input value={answers.current_role} onChange={e=>update("current_role",e.target.value)}/><FieldError name="current_role"/></FF>
              <FF label="Institution / organization *"><input value={answers.institution} onChange={e=>update("institution",e.target.value)}/><FieldError name="institution"/></FF>
              <FF label="Tell us briefly about yourself and your background *"><textarea value={answers.background} onChange={e=>update("background",e.target.value)} placeholder="A short bio covering where you are coming from academically, professionally, or otherwise."/><FieldError name="background"/></FF>

              {role==="participant" ? (
                <>
                  <FF label="Why are you interested in AI and biosecurity, and why do you want to join this course? *"><textarea value={answers.motivation} onChange={e=>update("motivation",e.target.value)}/><FieldError name="motivation"/></FF>
                  <FF label="What do you hope to do with what you learn from the course? *"><textarea value={answers.learning_goal} onChange={e=>update("learning_goal",e.target.value)}/><FieldError name="learning_goal"/></FF>
                  <FF label="Can you commit to attending at least 4 of the 6 live sessions and completing the required pre-session preparation? *">
                    <select value={answers.commitment} onChange={e=>update("commitment",e.target.value)}>
                      <option value="">Choose an answer</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <FieldError name="commitment"/>
                  </FF>
                  <FF label="What timezone are you based in? *"><input value={answers.timezone} onChange={e=>update("timezone",e.target.value)} placeholder="e.g. WAT / UTC+1"/><FieldError name="timezone"/></FF>
                  <FF label="Is there anything else you would like us to know?"><textarea value={answers.additional} onChange={e=>update("additional",e.target.value)}/></FF>
                </>
              ):(
                <>
                  <FF label="Why are you interested in facilitating this course? *"><textarea value={answers.motivation} onChange={e=>update("motivation",e.target.value)}/><FieldError name="motivation"/></FF>
                  <FF label="What experience do you have facilitating discussions, teaching, mentoring, workshops, communities, or group learning? *"><textarea value={answers.facilitation_experience} onChange={e=>update("facilitation_experience",e.target.value)}/><FieldError name="facilitation_experience"/></FF>
                  <FF label="What experience or knowledge do you have that is relevant to AI, biosecurity, biology, public health, technology policy, governance, research, or African science and technology contexts? *"><textarea value={answers.relevant_experience} onChange={e=>update("relevant_experience",e.target.value)}/><FieldError name="relevant_experience"/></FF>
                  <FF label="How would you handle a discussion where participants have very different levels of technical knowledge? *"><textarea value={answers.mixed_levels} onChange={e=>update("mixed_levels",e.target.value)}/><FieldError name="mixed_levels"/></FF>
                  <FF label="Can you commit to preparing for and facilitating all 6 live sessions for your assigned group, including attendance and pre-session exercise tracking? *">
                    <select value={answers.commitment} onChange={e=>update("commitment",e.target.value)}>
                      <option value="">Choose an answer</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <FieldError name="commitment"/>
                  </FF>
                  <FF label="What timezone are you based in? *"><input value={answers.timezone} onChange={e=>update("timezone",e.target.value)} placeholder="e.g. WAT / UTC+1"/><FieldError name="timezone"/></FF>
                  <AvailabilityGrid value={answers.weekly_availability} onChange={value=>update("weekly_availability",value)}/>
                  <FieldError name="weekly_availability"/>
                  <FF label="Is there anything else you would like us to know?"><textarea value={answers.additional} onChange={e=>update("additional",e.target.value)}/></FF>
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


const toDateTimeLocal = value => {
  if(!value) return "";
  const d=new Date(value);
  const local=new Date(d.getTime()-d.getTimezoneOffset()*60000);
  return local.toISOString().slice(0,16);
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
  const [newGroup,setNewGroup]=useState({cohort_id:"",name:"",timezone_label:"",facilitator_user_id:"",meeting_url:"",session_duration_minutes:"60",dates:["","","","","",""]});
  const [cohortEdits,setCohortEdits]=useState({});
  const [cohortSaveState,setCohortSaveState]=useState({});
  const [groupEdits,setGroupEdits]=useState({});
  const [groupSaveState,setGroupSaveState]=useState({});
  const [deleteState,setDeleteState]=useState({});
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
    const cohortRows=c.data||[];
    const groupRows=g.data||[];
    setApplications(a.data||[]);
    setCohorts(cohortRows);
    setGroups(groupRows);
    setMembers(m.data||[]);
    setFacilitators(f.data||[]);

    setCohortEdits(Object.fromEntries(cohortRows.map(cohort=>[
      cohort.id,
      {
        name:cohort.name||"",
        start_date:cohort.start_date||"",
        status:cohort.status||"setup"
      }
    ])));

    setGroupEdits(Object.fromEntries(groupRows.map(group=>{
      const sessions=[...(group.group_sessions||[])].sort((x,y)=>Number(x.module_id)-Number(y.module_id));
      return [group.id,{
        name:group.name||"",
        timezone_label:group.timezone_label||"",
        meeting_url:group.meeting_url||"",
        session_duration_minutes:String(group.session_duration_minutes||60),
        dates:Array.from({length:6},(_,i)=>toDateTimeLocal(sessions.find(s=>Number(s.module_id)===i+1)?.session_date))
      }];
    })));

    if(selectedCohort && !cohortRows.some(x=>x.id===selectedCohort)){
      setSelectedCohort(cohortRows[0]?.id||"");
    }else if(!selectedCohort && cohortRows[0]){
      setSelectedCohort(cohortRows[0].id);
    }
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

  const updateCohort=async(cohortId)=>{
    const edit=cohortEdits[cohortId];
    if(!edit?.name?.trim()){
      setCohortSaveState(x=>({...x,[cohortId]:{status:"error",message:"Cohort name is required."}}));
      return;
    }

    setCohortSaveState(x=>({...x,[cohortId]:{status:"saving",message:"Saving…"}}));

    const {error:e}=await supabase.rpc("admin_update_cohort_settings",{
      p_cohort_id:cohortId,
      p_name:edit.name.trim(),
      p_start_date:edit.start_date||null,
      p_status:edit.status||"setup"
    });

    if(e){
      setCohortSaveState(x=>({...x,[cohortId]:{status:"error",message:e.message||"Could not save cohort."}}));
      return;
    }

    await load();
    setCohortSaveState(x=>({...x,[cohortId]:{status:"saved",message:"Cohort saved."}}));
  };

  const deleteGroup=async(group)=>{
    const affected=members.filter(m=>m.group_id===group.id&&m.status==="accepted");
    const participantCount=affected.filter(m=>m.role==="participant").length;
    const facilitatorCount=affected.filter(m=>m.role==="facilitator").length;

    const warning=affected.length
      ? `Delete "${group.name}"?\n\nThis group currently has ${participantCount} participant${participantCount===1?"":"s"} and ${facilitatorCount} facilitator${facilitatorCount===1?"":"s"} assigned.\n\nThey will immediately lose course access and their applications will be reset to PENDING so they can be assigned again.\n\nThe group's six-session schedule and attendance linked to those sessions will also be deleted.`
      : `Delete "${group.name}"?\n\nThis group is empty. Its six-session schedule will also be deleted.`;

    if(!window.confirm(warning))return;

    setDeleteState(x=>({...x,[`group-${group.id}`]:{status:"deleting",message:"Deleting…"}}));

    const {error:e}=await supabase.rpc("admin_delete_course_group",{p_group_id:group.id});
    if(e){
      setDeleteState(x=>({...x,[`group-${group.id}`]:{status:"error",message:e.message||"Could not delete group."}}));
      return;
    }

    await load();
  };

  const deleteCohort=async(cohort)=>{
    const cohortGroups=groups.filter(g=>g.cohort_id===cohort.id);
    const groupIds=new Set(cohortGroups.map(g=>g.id));
    const affected=members.filter(m=>groupIds.has(m.group_id)&&m.status==="accepted");
    const participantCount=affected.filter(m=>m.role==="participant").length;
    const facilitatorCount=affected.filter(m=>m.role==="facilitator").length;

    const warning=`Delete "${cohort.name}"?\n\nThis will permanently delete ${cohortGroups.length} group${cohortGroups.length===1?"":"s"} and all of their session schedules.\n\n${participantCount} participant${participantCount===1?"":"s"} and ${facilitatorCount} facilitator${facilitatorCount===1?"":"s"} will lose course access. Their applications will be reset to PENDING so they can be assigned to another cohort later.\n\nThis action cannot be undone.`;

    if(!window.confirm(warning))return;

    setDeleteState(x=>({...x,[`cohort-${cohort.id}`]:{status:"deleting",message:"Deleting…"}}));

    const {error:e}=await supabase.rpc("admin_delete_course_cohort",{p_cohort_id:cohort.id});
    if(e){
      setDeleteState(x=>({...x,[`cohort-${cohort.id}`]:{status:"error",message:e.message||"Could not delete cohort."}}));
      return;
    }

    if(selectedCohort===cohort.id)setSelectedCohort("");
    await load();
  };

  const createGroup=async()=>{
    if(!newGroup.cohort_id||!newGroup.name.trim()||newGroup.dates.some(d=>!d)){setError("Choose a cohort, name the group, and enter all six session dates.");return;}
    const duration=Number(newGroup.session_duration_minutes||60);
    if(!Number.isFinite(duration)||duration<15||duration>240){setError("Session duration must be between 15 and 240 minutes.");return;}
    if(newGroup.meeting_url.trim()&&!/^https?:\/\//i.test(newGroup.meeting_url.trim())){setError("Enter a valid meeting link beginning with http:// or https://.");return;}
    const {data:g,error:e}=await supabase.from("cohort_groups").insert({
      cohort_id:newGroup.cohort_id,
      name:newGroup.name,
      timezone_label:newGroup.timezone_label||null,
      facilitator_user_id:newGroup.facilitator_user_id||null,
      meeting_url:newGroup.meeting_url.trim()||null,
      session_duration_minutes:duration
    }).select().single();
    if(e){setError(e.message);return;}
    const rows=newGroup.dates.map((d,i)=>({group_id:g.id,module_id:i+1,session_date:new Date(d).toISOString()}));
    const {error:se}=await supabase.from("group_sessions").insert(rows);
    if(se){setError(se.message);return;}
    setNewGroup({cohort_id:"",name:"",timezone_label:"",facilitator_user_id:"",meeting_url:"",session_duration_minutes:"60",dates:["","","","","",""]});
    await load();
  };

  const updateGroupSchedule=async(groupId)=>{
    const edit=groupEdits[groupId];
    if(!edit)return;

    if(!edit.name?.trim()){
      setGroupSaveState(x=>({...x,[groupId]:{status:"error",message:"Group name is required."}}));
      return;
    }

    const duration=Number(edit.session_duration_minutes||60);
    if(!Number.isFinite(duration)||duration<15||duration>240){
      setGroupSaveState(x=>({...x,[groupId]:{status:"error",message:"Session duration must be between 15 and 240 minutes."}}));
      return;
    }
    if(edit.meeting_url.trim()&&!/^https?:\/\//i.test(edit.meeting_url.trim())){
      setGroupSaveState(x=>({...x,[groupId]:{status:"error",message:"Enter a valid meeting link beginning with http:// or https://."}}));
      return;
    }
    if(edit.dates.some(d=>!d)){
      setGroupSaveState(x=>({...x,[groupId]:{status:"error",message:"All six session dates are required."}}));
      return;
    }

    setGroupSaveState(x=>({...x,[groupId]:{status:"saving",message:"Saving…"}}));

    const {error:e}=await supabase.rpc("admin_update_course_group",{
      p_group_id:groupId,
      p_name:edit.name.trim(),
      p_timezone_label:edit.timezone_label.trim()||null,
      p_meeting_url:edit.meeting_url.trim()||null,
      p_session_duration_minutes:duration,
      p_session_dates:edit.dates.map(d=>new Date(d).toISOString())
    });

    if(e){
      setGroupSaveState(x=>({...x,[groupId]:{status:"error",message:e.message||"Could not save group settings."}}));
      return;
    }

    await load();
    setGroupSaveState(x=>({...x,[groupId]:{status:"saved",message:"Group settings saved."}}));
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
        {tab==="cohorts"&&<div style={{ maxWidth:760 }}>
          <H2 s={{ marginBottom:20 }}>Create cohort</H2>
          <FF label="Cohort name">
            <input value={newCohort.name} onChange={e=>setNewCohort(x=>({...x,name:e.target.value}))} placeholder="Intro Course — Cohort 1"/>
          </FF>
          <FF label="Start date">
            <input type="date" value={newCohort.start_date} onChange={e=>setNewCohort(x=>({...x,start_date:e.target.value}))}/>
          </FF>
          <button className="br" onClick={createCohort}>Create cohort</button>

          <div style={{ marginTop:46 }}>
            <Ey label="Existing Cohorts"/>
            <H2 s={{ marginBottom:8 }}>Manage cohorts</H2>
            <Txt muted s={{ fontSize:13.5,marginBottom:20 }}>
              Edit cohort details or remove a test cohort. Deleting a cohort removes its groups and schedules; assigned users lose access and their applications return to pending.
            </Txt>

            {cohorts.length===0 ? (
              <Txt muted>No cohorts have been created yet.</Txt>
            ) : cohorts.map(c=>{
              const edit=cohortEdits[c.id]||{name:c.name||"",start_date:c.start_date||"",status:c.status||"setup"};
              const cohortGroups=groups.filter(g=>g.cohort_id===c.id);
              const groupIds=new Set(cohortGroups.map(g=>g.id));
              const assigned=members.filter(m=>groupIds.has(m.group_id)&&m.status==="accepted");
              const participantCount=assigned.filter(m=>m.role==="participant").length;
              const facilitatorCount=assigned.filter(m=>m.role==="facilitator").length;
              const deleting=deleteState[`cohort-${c.id}`]?.status==="deleting";

              return (
                <div key={c.id} style={{ borderTop:"1px solid var(--brd)",padding:"24px 0" }}>
                  <div className="g2" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
                    <FF label="Cohort name">
                      <input
                        value={edit.name}
                        onChange={e=>setCohortEdits(x=>({...x,[c.id]:{...edit,name:e.target.value}}))}
                      />
                    </FF>
                    <FF label="Start date">
                      <input
                        type="date"
                        value={edit.start_date||""}
                        onChange={e=>setCohortEdits(x=>({...x,[c.id]:{...edit,start_date:e.target.value}}))}
                      />
                    </FF>
                  </div>

                  <FF label="Status">
                    <select
                      value={edit.status}
                      onChange={e=>setCohortEdits(x=>({...x,[c.id]:{...edit,status:e.target.value}}))}
                    >
                      <option value="setup">Setup</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </FF>

                  <div style={{ fontSize:12.5,color:"#5A5956",marginBottom:16 }}>
                    {cohortGroups.length} group{cohortGroups.length===1?"":"s"} · {participantCount} participant{participantCount===1?"":"s"} · {facilitatorCount} facilitator{facilitatorCount===1?"":"s"} · ID: {c.id}
                  </div>

                  <div style={{ display:"flex",alignItems:"center",gap:10,flexWrap:"wrap" }}>
                    <button
                      className="bo"
                      disabled={cohortSaveState[c.id]?.status==="saving"||deleting}
                      onClick={()=>updateCohort(c.id)}
                    >
                      {cohortSaveState[c.id]?.status==="saving"?"Saving…":"Save cohort"}
                    </button>

                    <button
                      onClick={()=>deleteCohort(c)}
                      disabled={deleting}
                      style={{
                        border:"1px solid #B8102A",
                        background:"transparent",
                        color:"#B8102A",
                        padding:"10px 16px",
                        fontFamily:"'Figtree',sans-serif",
                        fontSize:12.5,
                        fontWeight:700,
                        cursor:deleting?"wait":"pointer"
                      }}
                    >
                      {deleting?"Deleting…":"Delete cohort"}
                    </button>

                    {cohortSaveState[c.id]?.message&&(
                      <span style={{
                        fontFamily:"'Figtree',sans-serif",
                        fontSize:12.5,
                        fontWeight:600,
                        color:cohortSaveState[c.id]?.status==="error"?"#B8102A":"#356B47"
                      }}>
                        {cohortSaveState[c.id].message}
                      </span>
                    )}

                    {deleteState[`cohort-${c.id}`]?.status==="error"&&(
                      <span style={{ fontFamily:"'Figtree',sans-serif",fontSize:12.5,fontWeight:600,color:"#B8102A" }}>
                        {deleteState[`cohort-${c.id}`].message}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>}
        {tab==="groups"&&<div style={{ maxWidth:820 }}>
          <H2 s={{ marginBottom:20 }}>Create group &amp; six-session schedule</H2>
          <Txt muted s={{ fontSize:13.5,marginBottom:22 }}>
            Session times are entered in your current browser timezone. Participants and facilitators will see them converted automatically to their own local timezone.
          </Txt>

          <FF label="Cohort">
            <select value={newGroup.cohort_id} onChange={e=>setNewGroup(x=>({...x,cohort_id:e.target.value}))}>
              <option value="">Choose cohort</option>
              {cohorts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FF>

          <FF label="Group name">
            <input value={newGroup.name} onChange={e=>setNewGroup(x=>({...x,name:e.target.value}))} placeholder="West/Central Africa"/>
          </FF>

          <FF label="Timezone label">
            <input value={newGroup.timezone_label} onChange={e=>setNewGroup(x=>({...x,timezone_label:e.target.value}))} placeholder="WAT / UTC+1"/>
          </FF>

          <FF label="Facilitator (optional until accepted)">
            <select value={newGroup.facilitator_user_id} onChange={e=>setNewGroup(x=>({...x,facilitator_user_id:e.target.value}))}>
              <option value="">Unassigned</option>
              {facilitators.map(f=><option key={f.user_id} value={f.user_id}>{f.full_name} — {f.email}</option>)}
            </select>
          </FF>

          <FF label="Live session link">
            <input
              type="url"
              value={newGroup.meeting_url}
              onChange={e=>setNewGroup(x=>({...x,meeting_url:e.target.value}))}
              placeholder="https://meet.google.com/..."
            />
          </FF>

          <FF label="Session duration (minutes)">
            <input
              type="number"
              min="15"
              max="240"
              step="15"
              value={newGroup.session_duration_minutes}
              onChange={e=>setNewGroup(x=>({...x,session_duration_minutes:e.target.value}))}
            />
          </FF>

          {newGroup.dates.map((d,i)=>(
            <FF key={i} label={`Module ${i+1} session`}>
              <input
                type="datetime-local"
                value={d}
                onChange={e=>setNewGroup(x=>({...x,dates:x.dates.map((v,j)=>j===i?e.target.value:v)}))}
              />
            </FF>
          ))}

          <button className="br" onClick={createGroup}>Create group &amp; schedule</button>

          <div style={{ marginTop:46 }}>
            <Ey label="Existing Groups"/>
            <H2 s={{ marginBottom:8 }}>Manage groups &amp; live sessions</H2>
            <Txt muted s={{ fontSize:13.5,marginBottom:20 }}>
              Edit the group name, timezone, meeting link, duration, or session dates. Deleting a group removes its schedule; assigned users lose access and their applications return to pending.
            </Txt>

            {groups.length===0 ? (
              <Txt muted>No groups have been created yet.</Txt>
            ) : groups.map(g=>{
              const edit=groupEdits[g.id]||{name:g.name||"",timezone_label:g.timezone_label||"",meeting_url:"",session_duration_minutes:"60",dates:["","","","","",""]};
              const affected=members.filter(m=>m.group_id===g.id&&m.status==="accepted");
              const participantCount=affected.filter(m=>m.role==="participant").length;
              const facilitatorCount=affected.filter(m=>m.role==="facilitator").length;
              const deleting=deleteState[`group-${g.id}`]?.status==="deleting";

              return (
                <div key={g.id} style={{ borderTop:"1px solid var(--brd)",padding:"24px 0" }}>
                  <div style={{ marginBottom:16 }}>
                    <strong style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:"#1A1917" }}>{g.name}</strong>
                    <div style={{ fontSize:12.5,color:"#5A5956",marginTop:3 }}>
                      {participantCount} participant{participantCount===1?"":"s"} · {facilitatorCount} facilitator{facilitatorCount===1?"":"s"} · ID: {g.id}
                    </div>
                  </div>

                  <div className="g2" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
                    <FF label="Group name">
                      <input
                        value={edit.name}
                        onChange={e=>setGroupEdits(x=>({...x,[g.id]:{...edit,name:e.target.value}}))}
                      />
                    </FF>
                    <FF label="Timezone label">
                      <input
                        value={edit.timezone_label}
                        onChange={e=>setGroupEdits(x=>({...x,[g.id]:{...edit,timezone_label:e.target.value}}))}
                        placeholder="WAT / UTC+1"
                      />
                    </FF>
                  </div>

                  <div className="g2" style={{ display:"grid",gridTemplateColumns:"1.4fr .6fr",gap:14 }}>
                    <FF label="Live session link">
                      <input
                        type="url"
                        value={edit.meeting_url}
                        onChange={e=>setGroupEdits(x=>({...x,[g.id]:{...edit,meeting_url:e.target.value}}))}
                        placeholder="https://meet.google.com/..."
                      />
                    </FF>
                    <FF label="Duration (minutes)">
                      <input
                        type="number"
                        min="15"
                        max="240"
                        step="15"
                        value={edit.session_duration_minutes}
                        onChange={e=>setGroupEdits(x=>({...x,[g.id]:{...edit,session_duration_minutes:e.target.value}}))}
                      />
                    </FF>
                  </div>

                  {edit.dates.map((d,i)=>(
                    <FF key={i} label={`Module ${i+1} session`}>
                      <input
                        type="datetime-local"
                        value={d}
                        onChange={e=>setGroupEdits(x=>({
                          ...x,
                          [g.id]:{
                            ...edit,
                            dates:edit.dates.map((v,j)=>j===i?e.target.value:v)
                          }
                        }))}
                      />
                    </FF>
                  ))}

                  <div style={{ display:"flex",alignItems:"center",gap:10,flexWrap:"wrap" }}>
                    <button
                      className="bo"
                      disabled={groupSaveState[g.id]?.status==="saving"||deleting}
                      onClick={()=>updateGroupSchedule(g.id)}
                      style={{ opacity:groupSaveState[g.id]?.status==="saving"?.6:1,cursor:groupSaveState[g.id]?.status==="saving"?"wait":"pointer" }}
                    >
                      {groupSaveState[g.id]?.status==="saving" ? "Saving…" : "Save group settings"}
                    </button>

                    <button
                      onClick={()=>deleteGroup(g)}
                      disabled={deleting}
                      style={{
                        border:"1px solid #B8102A",
                        background:"transparent",
                        color:"#B8102A",
                        padding:"10px 16px",
                        fontFamily:"'Figtree',sans-serif",
                        fontSize:12.5,
                        fontWeight:700,
                        cursor:deleting?"wait":"pointer"
                      }}
                    >
                      {deleting?"Deleting…":"Delete group"}
                    </button>

                    {groupSaveState[g.id]?.message&&(
                      <span style={{
                        fontFamily:"'Figtree',sans-serif",
                        fontSize:12.5,
                        fontWeight:600,
                        color:groupSaveState[g.id]?.status==="error"?"#B8102A":"#356B47"
                      }}>
                        {groupSaveState[g.id].message}
                      </span>
                    )}

                    {deleteState[`group-${g.id}`]?.status==="error"&&(
                      <span style={{ fontFamily:"'Figtree',sans-serif",fontSize:12.5,fontWeight:600,color:"#B8102A" }}>
                        {deleteState[`group-${g.id}`].message}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>}
        {tab==="oversight"&&<div><div style={{ display:"flex",justifyContent:"space-between",gap:16,alignItems:"end",marginBottom:24,flexWrap:"wrap" }}><H2>Oversight</H2><select style={{ maxWidth:320 }} value={selectedCohort} onChange={e=>setSelectedCohort(e.target.value)}><option value="">Choose cohort</option>{cohorts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div className="g3" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16 }}>{selectedGroups.map(g=>{const sessions=[...(g.group_sessions||[])].sort((a,b)=>new Date(a.session_date)-new Date(b.session_date));const passed=sessions.filter(s=>new Date(s.session_date).getTime()<=now).length;const next=sessions.find(s=>new Date(s.session_date).getTime()>now);const count=members.filter(m=>m.group_id===g.id&&m.role==="participant"&&m.status==="accepted").length;return <div key={g.id} style={{ border:"1px solid var(--brd)",background:"#F7F6F2",padding:"20px" }}><h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:21,fontWeight:600,marginBottom:10 }}>{g.name}</h3><Txt muted s={{ fontSize:13 }}>Facilitator: {facilitatorName(g.facilitator_user_id)}</Txt><Txt muted s={{ fontSize:13 }}>Participants: {count}</Txt><Txt muted s={{ fontSize:13 }}>Current week: {passed}</Txt><Txt muted s={{ fontSize:13 }}>Next session: {next?new Date(next.session_date).toLocaleString():"None"}</Txt></div>})}</div></div>}
        {tab==="preview"&&<div><H2 s={{ marginBottom:12 }}>View as</H2><Txt muted s={{ marginBottom:20 }}>Admin preview uses your admin account; no second account is required.</Txt><div style={{ display:"flex",gap:10,flexWrap:"wrap" }}><button className="br" onClick={()=>go("facilitator")}>View as facilitator</button><button className="bo" onClick={()=>go("participant")}>View as participant</button></div></div>}
      </Sec>
    </>
  );
};

export default function CourseShell({ page, params, session, isAdmin, go, openAuth }) {
  if(!COURSE_LAUNCHED && !isAdmin) return <ComingSoon/>;
  if(page==="courses") return <Landing go={go} session={session}/>;
  if(page==="course-apply") return <ApplicationPage session={session} openAuth={openAuth} go={go}/>;
  if(page==="course-admin") return isAdmin?<AdminDashboard go={go}/>:<AccessMessage session={session} openAuth={openAuth} text="Admin access is required."/>;
  if(page==="facilitator"||page==="facilitator-module") return <RoleTool role="facilitator" page={page} params={params} session={session} isAdmin={isAdmin} go={go} openAuth={openAuth}/>;
  if(page==="participant"||page==="participant-module") return <RoleTool role="participant" page={page} params={params} session={session} isAdmin={isAdmin} go={go} openAuth={openAuth}/>;
  return <Landing go={go} session={session}/>;
}
