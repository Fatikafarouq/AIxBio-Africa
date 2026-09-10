import { Fragment, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { courseMeta, coursePreviewModules } from "./courseMeta";
import { PageHdr, Sec, Ey, H2, Txt, FF } from "./CoursePrimitives";
import { FacilitatorHub, FacilitatorModuleDetail } from "./FacilitatorTool";
import { ParticipantHub, ParticipantModuleDetail } from "./ParticipantTool";
import CertificateActions from "./CertificateActions";

const COURSE_SLUG = "intro-ai-biosecurity";
const EMPTY_SETTINGS = { is_published:false, participant_applications_open:false, facilitator_applications_open:false };

const ComingSoon = () => (
  <div className="pat-dk" style={{minHeight:"100vh",background:"#1C1B18",display:"flex",alignItems:"center",justifyContent:"center",padding:"100px 24px 40px"}}>
    <div style={{maxWidth:620,textAlign:"center"}}>
      <div style={{fontFamily:"'Figtree',sans-serif",fontSize:10.5,fontWeight:700,color:"#B8102A",letterSpacing:".2em",textTransform:"uppercase",marginBottom:18}}>AIxBio Africa Courses</div>
      <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(34px,5vw,64px)",fontWeight:600,color:"#fff",lineHeight:1.1}}>Coming soon.</h1>
      <p style={{fontFamily:"'Figtree',sans-serif",fontSize:15,color:"rgba(255,255,255,.55)",lineHeight:1.7,marginTop:16}}>Introduction to AI &amp; Biosecurity in Africa is being prepared for launch.</p>
    </div>
  </div>
);

const useCourseSettings = () => {
  const [settings,setSettings]=useState(EMPTY_SETTINGS);
  const [loaded,setLoaded]=useState(false);
  useEffect(()=>{
    let alive=true;
    supabase.from("course_settings").select("is_published,participant_applications_open,facilitator_applications_open").eq("course_slug",COURSE_SLUG).maybeSingle()
      .then(({data})=>{if(alive){setSettings(data||EMPTY_SETTINGS);setLoaded(true);}});
    return()=>{alive=false;};
  },[]);
  return {settings,loaded};
};

const useCourseMembershipAccess = session => {
  const [memberships,setMemberships]=useState([]);
  const [loaded,setLoaded]=useState(!session?.user);
  useEffect(()=>{
    let alive=true;
    if(!session?.user){setMemberships([]);setLoaded(true);return;}
    setLoaded(false);
    supabase.from("cohort_members")
      .select("id,role,status,group_id")
      .eq("user_id",session.user.id)
      .in("status",["accepted","completed"])
      .then(({data})=>{if(alive){setMemberships(data||[]);setLoaded(true);}});
    return()=>{alive=false;};
  },[session?.user?.id]);
  return {memberships,loaded};
};

const StatusTag = ({ status }) => {
  const label={pending:"Pending",accepted:"Approved",rejected:"Rejected",completed:"Completed",revoked:"Revoked"}[status]||status;
  return <span className={`tag ${status==="accepted"||status==="completed"?"tr":"tb"}`}>{label}</span>;
};

const Landing = ({ go, session, settings, memberships=[] }) => {
  const [open,setOpen]=useState(false);
  const [applications,setApplications]=useState([]);
  useEffect(()=>{
    let alive=true;
    if(!session?.user){setApplications([]);return;}
    supabase.from("applications").select("id,role,status,created_at").eq("user_id",session.user.id).order("created_at",{ascending:false})
      .then(({data})=>{if(alive)setApplications(data||[]);});
    return()=>{alive=false;};
  },[session?.user?.id]);

  const accepted=applications.filter(a=>a.status==="accepted");
  const assignedRoles=[...new Set(memberships.map(m=>m.role))];
  const appsOpen=settings.participant_applications_open||settings.facilitator_applications_open;

  return <>
    <PageHdr label="Course" title={courseMeta.title} sub={courseMeta.purpose}/>
    <Sec bg="#fff">
      <div className="g2" style={{display:"grid",gridTemplateColumns:"1.15fr .85fr",gap:60,alignItems:"start"}}>
        <div>
          <div className="reveal" style={{marginBottom:38}}><Ey label="Who this course is for"/><Txt s={{fontSize:16}}>{courseMeta.whoItsFor}</Txt></div>
          <div className="reveal"><Ey label="By the end"/><div style={{display:"flex",flexDirection:"column",gap:10}}>{courseMeta.outcomes.map((o,i)=><div key={i} style={{display:"flex",gap:11}}><span style={{color:"#B8102A",fontWeight:700}}>—</span><Txt muted s={{fontSize:14.5}}>{o}</Txt></div>)}</div></div>
        </div>
        <aside className="reveal d2" style={{background:"#F7F6F2",border:"1px solid var(--brd)",padding:"26px"}}>
          <Ey label={assignedRoles.length?"Course Access":"Applications"}/>
          <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:600,color:"#1A1917",marginBottom:10}}>{assignedRoles.length?"Continue your course":appsOpen?"Join the course":"Applications closed"}</h3>
          {assignedRoles.length>0 ? <>
            <Txt muted s={{fontSize:14,marginBottom:16}}>Continue with any course role currently assigned to your account.</Txt>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{assignedRoles.map(role=><button key={role} className={role==="participant"?"br":"bo"} onClick={()=>go(role)}>{role==="participant"?"Participant course":"Facilitator guide"} →</button>)}</div>
            {appsOpen&&<button className="bn" onClick={()=>go("course-apply")} style={{marginTop:16,color:"#B8102A",fontWeight:700,fontSize:12.5}}>View application options →</button>}
          </> : <>
            <Txt muted s={{fontSize:14,marginBottom:20}}>{appsOpen?"Choose whether to apply as a participant or facilitator after signing in.":"Applications for the next cohort are not currently open."}</Txt>
            {appsOpen&&<button className="br" style={{width:"100%"}} onClick={()=>go("course-apply")}>Apply</button>}
          </>}
        </aside>
      </div>
      <div className="reveal" style={{marginTop:54,borderTop:"1px solid var(--brd)",paddingTop:24}}>
        <button className="bn" onClick={()=>setOpen(o=>!o)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",textAlign:"left",padding:"8px 0"}}><H2 s={{fontSize:25}}>Browse curriculum</H2><span style={{color:"#B8102A",fontSize:18,transform:open?"rotate(180deg)":"none"}}>↓</span></button>
        {open&&<div style={{marginTop:16}}>{coursePreviewModules.map(m=><div key={m.id} style={{padding:"18px 0",borderTop:"1px solid var(--brd)"}}><h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:600,color:"#1A1917",marginBottom:5}}>{m.id}. {m.title}</h3><Txt muted s={{fontSize:13.5}}>{m.overview}</Txt></div>)}</div>}
      </div>
    </Sec>
  </>;
};

const WEEK_DAYS=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const AVAILABILITY_PERIODS=[{id:"morning",label:"Morning",time:"8:00–12:00"},{id:"afternoon",label:"Afternoon",time:"12:00–17:00"},{id:"evening",label:"Evening",time:"17:00–21:00"}];
const participantEmpty={full_name:"",country:"",current_role:"",institution:"",background:"",motivation:"",learning_goal:"",commitment:"",timezone:"",additional:""};
const facilitatorEmpty={full_name:"",country:"",current_role:"",institution:"",background:"",motivation:"",facilitation_experience:"",relevant_experience:"",mixed_levels:"",commitment:"",timezone:"",weekly_availability:{},additional:""};
const answerLabel=key=>({full_name:"Full name",country:"Country of residence",current_role:"Current role / occupation",institution:"Institution / organization",background:"Background / short bio",motivation:"Motivation",learning_goal:"What they hope to do with the course",commitment:"Commitment",timezone:"Timezone",facilitation_experience:"Facilitation experience",relevant_experience:"Relevant AI / biosecurity experience",mixed_levels:"Working with mixed levels of technical knowledge",weekly_availability:"Weekly availability",additional:"Anything else"}[key]||key.replaceAll("_"," "));

const AvailabilityGrid=({value,onChange})=><div style={{marginBottom:22}}>
  <div style={{fontFamily:"'Figtree',sans-serif",fontSize:12,fontWeight:700,color:"#1A1917",marginBottom:7}}>Weekly availability *</div>
  <Txt muted s={{fontSize:13.5,marginBottom:14}}>Select all periods when you are generally available for a recurring weekly 60–90 minute session. Use your local timezone.</Txt>
  <div style={{overflowX:"auto",border:"1px solid var(--brd)",background:"#fff"}}><div style={{minWidth:620}}>
    <div style={{display:"grid",gridTemplateColumns:"1.25fr repeat(3,1fr)",background:"#F7F6F2",borderBottom:"1px solid var(--brd)"}}><div style={{padding:"11px 12px",fontSize:11,fontWeight:700,color:"#5A5956",textTransform:"uppercase"}}>Day</div>{AVAILABILITY_PERIODS.map(p=><div key={p.id} style={{padding:"11px 12px",fontSize:11,fontWeight:700,color:"#5A5956",textAlign:"center"}}>{p.label}<div style={{fontSize:10,fontWeight:500,marginTop:2}}>{p.time}</div></div>)}</div>
    {WEEK_DAYS.map(day=><div key={day} style={{display:"grid",gridTemplateColumns:"1.25fr repeat(3,1fr)",borderBottom:day==="Sunday"?"none":"1px solid var(--brd)",alignItems:"center"}}><div style={{padding:12,fontSize:13,fontWeight:600}}>{day}</div>{AVAILABILITY_PERIODS.map(p=>{const checked=(value?.[day]||[]).includes(p.id);return <div key={p.id} style={{display:"flex",justifyContent:"center",padding:12}}><button type="button" onClick={()=>{const cur=value?.[day]||[];onChange({...value,[day]:checked?cur.filter(x=>x!==p.id):[...cur,p.id]});}} aria-pressed={checked} style={{width:30,height:30,border:checked?"1px solid #B8102A":"1px solid #CFCBC3",background:checked?"#B8102A":"#fff",color:checked?"#fff":"transparent",cursor:"pointer",fontSize:18,fontWeight:700}}>✓</button></div>;})}</div>)}
  </div></div>
</div>;

const ApplicationPage=({session,openAuth,go,settings})=>{
  const [role,setRole]=useState("");
  const [applications,setApplications]=useState([]);
  const [answers,setAnswers]=useState(participantEmpty);
  const [done,setDone]=useState(false);
  const [error,setError]=useState("");
  const [fieldErrors,setFieldErrors]=useState({});

  const loadApps=async()=>{
    if(!session?.user){setApplications([]);return;}
    const {data}=await supabase.from("applications").select("id,role,status,created_at,answers").eq("user_id",session.user.id).order("created_at",{ascending:false});
    setApplications(data||[]);
  };
  useEffect(()=>{loadApps();},[session?.user?.id]);
  const existing=role?applications.find(a=>a.role===role):null;
  const roleOpen=r=>r==="participant"?settings.participant_applications_open:settings.facilitator_applications_open;

  const chooseRole=r=>{
    const app=applications.find(a=>a.role===r);
    setRole(r);setError("");setFieldErrors({});
    setAnswers(app?.status==="rejected"?{...(r==="facilitator"?facilitatorEmpty:participantEmpty),...(app.answers||{})}:(r==="facilitator"?{...facilitatorEmpty}:{...participantEmpty}));
  };

  if(!session) return <><PageHdr label="Course Application" title="Sign in to apply" sub="Your AIxBio Africa account is used for the application and, if accepted, course access."/><Sec bg="#fff"><button className="br" onClick={openAuth}>Sign in to apply</button></Sec></>;
  if(done) return <><PageHdr label="Application" title="Thanks — you'll hear back soon."/><Sec bg="#fff"><Txt muted>Your application has been submitted for review. There is no automatic acceptance.</Txt></Sec></>;

  const update=(key,value)=>{setAnswers(a=>({...a,[key]:value}));setFieldErrors(e=>({...e,[key]:""}));setError("");};
  const validate=()=>{
    const required=role==="facilitator"?["full_name","country","current_role","institution","background","motivation","facilitation_experience","relevant_experience","mixed_levels","commitment","timezone"]:["full_name","country","current_role","institution","background","motivation","learning_goal","commitment","timezone"];
    const errors={}; required.forEach(k=>{if(!String(answers[k]||"").trim())errors[k]=`${answerLabel(k)} is required.`;});
    if(role==="facilitator"&&!Object.values(answers.weekly_availability||{}).flat().length)errors.weekly_availability="Please select at least one weekly availability period.";
    if(answers.commitment!=="Yes")errors.commitment=role==="facilitator"?"Facilitators must be able to commit to all 6 live sessions.":"Participants must be able to commit to at least 4 of 6 live sessions and the required preparation.";
    setFieldErrors(errors); if(Object.keys(errors).length){setError("Please complete all required fields marked with an asterisk (*).");return false;} return true;
  };
  const submit=async()=>{
    if(!validate())return; setError("");
    const result=existing?.status==="rejected"
      ? await supabase.rpc("resubmit_my_course_application",{p_application_id:existing.id,p_role:role,p_answers:answers})
      : await supabase.rpc("submit_course_application",{p_role:role,p_answers:answers});
    if(result.error){setError(result.error.message);return;} setDone(true); await loadApps();
  };
  const FieldError=({name})=>fieldErrors[name]?<div className="err" style={{marginTop:7}}>{fieldErrors[name]}</div>:null;

  if(!role) return <><PageHdr label="Course Application" title="Choose how you want to take part"/><Sec bg="#fff"><div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,maxWidth:840}}>{[
    ["facilitator","Facilitator","Lead a small course group and guide the six facilitated sessions."],["participant","Participant","Join a facilitated group and work through the six-module course."]
  ].map(([r,t,d])=>{const app=applications.find(a=>a.role===r);const open=roleOpen(r);return <div key={r} style={{background:"#F7F6F2",border:"1px solid var(--brd)",padding:26}}><div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center"}}><h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600}}>{t}</h3>{app&&<StatusTag status={app.status}/>}</div><Txt muted s={{fontSize:13.5,margin:"8px 0 18px"}}>{d}</Txt>{app?.status==="accepted"?<button className="br" onClick={()=>go(r)}>Continue →</button>:app?.status==="pending"?<Txt s={{fontSize:13,fontWeight:700}}>Application under review</Txt>:app?.status==="rejected"&&open?<button className="bo" onClick={()=>chooseRole(r)}>Resubmit application</button>:!app&&open?<button className="bo" onClick={()=>chooseRole(r)}>Apply as {t}</button>:<Txt muted s={{fontSize:13}}>Applications for this role are closed.</Txt>}</div>;})}</div></Sec></>;

  if(existing?.status==="accepted") return <><PageHdr label="Course Access" title="Application approved"/><Sec bg="#fff"><button className="br" onClick={()=>go(role)}>Continue to {role} area →</button></Sec></>;
  if(existing?.status==="pending") return <><PageHdr label="Application" title="Your application is under review."/><Sec bg="#fff"><Txt muted>We’ll use this account for any course access attached to your application.</Txt></Sec></>;
  if(!roleOpen(role)) return <><PageHdr label="Applications" title="Applications are closed"/><Sec bg="#fff"><Txt muted>Applications for this role are not currently open.</Txt></Sec></>;

  return <><PageHdr label="Course Application" title={`${role==="facilitator"?"Facilitator":"Participant"} application`}/><Sec bg="#fff"><div style={{maxWidth:820}}>
    <button className="bn" onClick={()=>setRole("")} style={{color:"#B8102A",fontWeight:700,fontSize:12.5,marginBottom:22}}>← Change role</button>
    {existing?.status==="rejected"&&<div style={{background:"#F7F6F2",border:"1px solid var(--brd)",padding:"16px 18px",marginBottom:24}}><Txt muted s={{fontSize:13.5}}>You can update and resubmit your existing {role} application. This does not create a second application record.</Txt></div>}
    <FF label="Full name *"><input value={answers.full_name} onChange={e=>update("full_name",e.target.value)}/><FieldError name="full_name"/></FF>
    <FF label="Country of residence *"><input value={answers.country} onChange={e=>update("country",e.target.value)}/><FieldError name="country"/></FF>
    <FF label="Current role / position *"><input value={answers.current_role} onChange={e=>update("current_role",e.target.value)}/><FieldError name="current_role"/></FF>
    <FF label="Institution / organization *"><input value={answers.institution} onChange={e=>update("institution",e.target.value)}/><FieldError name="institution"/></FF>
    <FF label="Tell us briefly about yourself and your background *"><textarea value={answers.background} onChange={e=>update("background",e.target.value)}/><FieldError name="background"/></FF>
    {role==="participant"?<>
      <FF label="Why are you interested in AI and biosecurity, and why do you want to join this course? *"><textarea value={answers.motivation} onChange={e=>update("motivation",e.target.value)}/><FieldError name="motivation"/></FF>
      <FF label="What do you hope to do with what you learn from the course? *"><textarea value={answers.learning_goal} onChange={e=>update("learning_goal",e.target.value)}/><FieldError name="learning_goal"/></FF>
      <FF label="Can you commit to attending at least 4 of the 6 live sessions and completing the required pre-session preparation? *"><select value={answers.commitment} onChange={e=>update("commitment",e.target.value)}><option value="">Choose an answer</option><option>Yes</option><option>No</option></select><FieldError name="commitment"/></FF>
    </>:<>
      <FF label="Why are you interested in facilitating this course? *"><textarea value={answers.motivation} onChange={e=>update("motivation",e.target.value)}/><FieldError name="motivation"/></FF>
      <FF label="What experience do you have facilitating discussions, teaching, mentoring, workshops, communities, or group learning? *"><textarea value={answers.facilitation_experience} onChange={e=>update("facilitation_experience",e.target.value)}/><FieldError name="facilitation_experience"/></FF>
      <FF label="What experience or knowledge do you have that is relevant to AI, biosecurity, biology, public health, technology policy, governance, research, or African science and technology contexts? *"><textarea value={answers.relevant_experience} onChange={e=>update("relevant_experience",e.target.value)}/><FieldError name="relevant_experience"/></FF>
      <FF label="How would you handle a discussion where participants have very different levels of technical knowledge? *"><textarea value={answers.mixed_levels} onChange={e=>update("mixed_levels",e.target.value)}/><FieldError name="mixed_levels"/></FF>
      <FF label="Can you commit to preparing for and facilitating all 6 live sessions for your assigned group? *"><select value={answers.commitment} onChange={e=>update("commitment",e.target.value)}><option value="">Choose an answer</option><option>Yes</option><option>No</option></select><FieldError name="commitment"/></FF>
    </>}
    <FF label="What timezone are you based in? *"><input value={answers.timezone} onChange={e=>update("timezone",e.target.value)} placeholder="e.g. WAT / UTC+1"/><FieldError name="timezone"/></FF>
    {role==="facilitator"&&<><AvailabilityGrid value={answers.weekly_availability} onChange={v=>update("weekly_availability",v)}/><FieldError name="weekly_availability"/></>}
    <FF label="Is there anything else you would like us to know?"><textarea value={answers.additional} onChange={e=>update("additional",e.target.value)}/></FF>
    {error&&<div className="err" style={{marginBottom:12}}>{error}</div>}<button className="br" onClick={submit}>{existing?.status==="rejected"?"Resubmit application":"Submit application"}</button>
  </div></Sec></>;
};

const AccessMessage=({session,openAuth,text})=><><PageHdr label="Course Access" title={!session?"Sign in to continue":"Course access unavailable"}/><Sec bg="#fff"><div style={{maxWidth:560}}><Txt muted s={{marginBottom:22}}>{text||(!session?"Sign in with the account you used to apply.":"Course access will appear here once your application is accepted and you are assigned to a cohort group.")}</Txt>{!session&&<button className="br" onClick={openAuth}>Sign in</button>}</div></Sec></>;

const RoleTool=({role,page,params,session,isAdmin,go,openAuth})=>{
  const storageKey=`aixbio-course-membership-${session?.user?.id||"anonymous"}-${role}`;
  const [membershipId,setMembershipId]=useState(()=>{try{return sessionStorage.getItem(storageKey)||"";}catch{return "";}});
  const [payload,setPayload]=useState(null); const [error,setError]=useState(""); const [loading,setLoading]=useState(true);
  useEffect(()=>{
    try{setMembershipId(sessionStorage.getItem(storageKey)||"");}catch{setMembershipId("");}
  },[storageKey]);
  useEffect(()=>{
    let alive=true;if(!session){setLoading(false);return;}setLoading(true);
    supabase.functions.invoke("course-content",{body:{role,membershipId:membershipId||null}}).then(({data,error:e})=>{if(!alive)return;if(e){setError(data?.error||e.message);setPayload(null);}else{setPayload(data);setError("");if(data?.selected_membership_id&&data.selected_membership_id!==membershipId){setMembershipId(data.selected_membership_id);try{sessionStorage.setItem(storageKey,data.selected_membership_id);}catch{/* ignore */}}}setLoading(false);});
    return()=>{alive=false;};
  },[session?.access_token,role,isAdmin,membershipId,storageKey]);
  if(!session)return <AccessMessage session={session} openAuth={openAuth}/>;
  if(loading)return <><PageHdr label="Course Access" title="Loading course…"/><Sec bg="#fff"><Txt muted>Checking your course access.</Txt></Sec></>;
  if(error||!payload)return <AccessMessage session={session} openAuth={openAuth} text={error||undefined}/>;
  const changeMembership=id=>{setMembershipId(id);try{sessionStorage.setItem(storageKey,id);}catch{/* ignore */}};
  const picker=!isAdmin&&payload.memberships?.length>1&&page===role?<Sec bg="#fff"><div style={{maxWidth:520,marginBottom:-20}}><FF label="Cohort / group record"><select value={payload.selected_membership_id||membershipId} onChange={e=>changeMembership(e.target.value)}>{payload.memberships.map(m=><option key={m.id} value={m.id}>{m.cohort_name||"Cohort"} — {m.group_name||"Group"}{m.status==="completed"?" · Completed":""}</option>)}</select></FF></div></Sec>:null;
  if(role==="facilitator")return <>{picker}{page==="facilitator-module"?<FacilitatorModuleDetail slug={params.slug} go={go} courseModules={payload.courseModules}/>:<FacilitatorHub go={go} courseMeta={payload.courseMeta} courseModules={payload.courseModules} group={payload.group}/>}</>;
  return <>{picker}{page==="participant-module"?<ParticipantModuleDetail slug={params.slug} go={go} courseModules={payload.courseModules} progress={payload.progress} capstone={payload.capstone}/>:<ParticipantHub go={go} courseMeta={payload.courseMeta} courseModules={payload.courseModules} progress={payload.progress} capstone={payload.capstone} group={payload.group}/>}</>;
};

const toDateTimeLocal=value=>{if(!value)return"";const d=new Date(value);const local=new Date(d.getTime()-d.getTimezoneOffset()*60000);return local.toISOString().slice(0,16);};
const FELLOWS=[{id:"frances-chinaza-agba",name:"Frances Chinaza Agba"},{id:"tegan-jegede",name:"Tegan Jegede"},{id:"gideon-abako",name:"Gideon Abako"}];

const AdminDashboard=({go})=>{
  const [tab,setTab]=useState("applications"); const [error,setError]=useState(""); const [notice,setNotice]=useState(""); const [settingsSaving,setSettingsSaving]=useState(false);
  const [applications,setApplications]=useState([]); const [cohorts,setCohorts]=useState([]); const [groups,setGroups]=useState([]); const [members,setMembers]=useState([]);
  const [returning,setReturning]=useState([]); const [capstones,setCapstones]=useState([]); const [certificates,setCertificates]=useState([]); const [fellowRecords,setFellowRecords]=useState([]); const [settings,setSettings]=useState(EMPTY_SETTINGS);
  const [selectedCohort,setSelectedCohort]=useState(""); const [appStatus,setAppStatus]=useState("pending"); const [appRole,setAppRole]=useState("all"); const [appSearch,setAppSearch]=useState(""); const [appPage,setAppPage]=useState(1); const [expandedApp,setExpandedApp]=useState(""); const [capStatus,setCapStatus]=useState("all"); const [capGroup,setCapGroup]=useState("all"); const [capSort,setCapSort]=useState("recent");
  const [appGroups,setAppGroups]=useState({}); const [returnGroups,setReturnGroups]=useState({});
  const [newCohort,setNewCohort]=useState({name:"",start_date:""}); const [newGroup,setNewGroup]=useState({cohort_id:"",name:"",timezone_label:"",meeting_url:"",session_duration_minutes:"60",dates:["","","","","",""]});
  const [groupEdits,setGroupEdits]=useState({}); const [cohortEdits,setCohortEdits]=useState({});
  const [fellowForm,setFellowForm]=useState({profile_key:FELLOWS[0].id,owner_email:"",certificate_name:FELLOWS[0].name,completed:false});
  const [attendanceEditor,setAttendanceEditor]=useState(null);

  const load=async()=>{
    setError("");
    const [a,c,g,m,r,cap,cert,fr,sett]=await Promise.all([
      supabase.rpc("admin_list_applications"),
      supabase.from("cohorts").select("*").order("start_date",{ascending:false}),
      supabase.from("cohort_groups").select("*,group_sessions(*)").order("name"),
      supabase.from("cohort_members").select("*"),
      supabase.rpc("admin_list_returning_facilitators"),
      supabase.rpc("admin_list_capstone_completion",{p_cohort_id:null}),
      supabase.rpc("admin_list_certificates",{p_cohort_id:null}),
      supabase.rpc("admin_list_fellow_records"),
      supabase.from("course_settings").select("*").eq("course_slug",COURSE_SLUG).maybeSingle()
    ]);
    const first=[a,c,g,m,r,cap,cert,fr,sett].find(x=>x.error); if(first?.error){setError(first.error.message);return;}
    const cr=c.data||[], gr=g.data||[]; setApplications(a.data||[]);setCohorts(cr);setGroups(gr);setMembers(m.data||[]);setReturning(r.data||[]);setCapstones(cap.data||[]);setCertificates(cert.data||[]);setFellowRecords(fr.data||[]);setSettings(sett.data||EMPTY_SETTINGS);
    setCohortEdits(Object.fromEntries(cr.map(x=>[x.id,{name:x.name||"",start_date:x.start_date||"",status:x.status||"setup"}])));
    setGroupEdits(Object.fromEntries(gr.map(x=>{const sessions=[...(x.group_sessions||[])].sort((a,b)=>a.module_id-b.module_id);return [x.id,{name:x.name||"",timezone_label:x.timezone_label||"",meeting_url:x.meeting_url||"",session_duration_minutes:String(x.session_duration_minutes||60),dates:Array.from({length:6},(_,i)=>toDateTimeLocal(sessions.find(s=>Number(s.module_id)===i+1)?.session_date))}];})));
    if(!selectedCohort&&cr[0])setSelectedCohort(cr[0].id);
  };
  useEffect(()=>{load();},[]);

  const activeGroups=groups.filter(g=>g.delivery_status!=="completed"&&g.delivery_status!=="archived");
  const APP_PAGE_SIZE=20;
  const normalizedAppSearch=appSearch.trim().toLowerCase();
  const filteredApps=applications.filter(a=>{
    if(appStatus!=="all"&&a.status!==appStatus)return false;
    if(appRole!=="all"&&a.role!==appRole)return false;
    if(!normalizedAppSearch)return true;
    return [a.full_name,a.email,a.role,a.status].some(v=>String(v||"").toLowerCase().includes(normalizedAppSearch));
  });
  const appPageCount=Math.max(1,Math.ceil(filteredApps.length/APP_PAGE_SIZE));
  const safeAppPage=Math.min(appPage,appPageCount);
  const pagedApps=filteredApps.slice((safeAppPage-1)*APP_PAGE_SIZE,safeAppPage*APP_PAGE_SIZE);
  const cohortGroups=groups.filter(g=>g.cohort_id===selectedCohort);
  const capstoneScope=capstones.filter(r=>(!selectedCohort||r.cohort_id===selectedCohort)&&(capGroup==="all"||r.group_id===capGroup));
  const capCounts={not_submitted:capstoneScope.filter(r=>!r.capstone_id).length,awaiting_review:capstoneScope.filter(r=>r.capstone_status==="awaiting_review").length,revision_requested:capstoneScope.filter(r=>r.capstone_status==="revision_requested").length,approved:capstoneScope.filter(r=>r.capstone_status==="approved").length};
  const cohortCapstones=capstoneScope.filter(r=>capStatus==="all"||(capStatus==="not_submitted"?!r.capstone_id:r.capstone_status===capStatus)).sort((a,b)=>capSort==="name"?String(a.participant_name||"").localeCompare(String(b.participant_name||"")):capSort==="oldest"?new Date(a.submitted_at||"9999-12-31").getTime()-new Date(b.submitted_at||"9999-12-31").getTime():new Date(b.submitted_at||0).getTime()-new Date(a.submitted_at||0).getTime());

  const decide=async(app,status)=>{const groupId=status==="accepted"?appGroups[app.id]:null;if(status==="accepted"&&!groupId){setError("Choose an active group before approving the application.");return;}const {error:e}=await supabase.rpc("admin_decide_application",{p_application_id:app.id,p_status:status,p_group_id:groupId});if(e){setError(e.message);return;}await load();};
  const deleteApplication=async(app)=>{
    setError("");setNotice("");
    const label=`${app.full_name||app.email} (${app.role})`;
    if(!confirm(`Permanently delete the unused/test application for ${label}?\n\nThis does not delete the person’s login account. Supabase will refuse the deletion if the application has real course activity or credential history.`))return;
    const {data,error:e}=await supabase.rpc("admin_delete_course_application",{p_application_id:app.id});
    if(e){setError(e.message);return;}
    if(!data?.deleted){setError(data?.reason||"This application cannot be deleted because it has programme history.");return;}
    setExpandedApp("");
    setNotice(`Deleted the unused/test ${app.role} application for ${app.full_name||app.email}.`);
    await load();
  };
  const createCohort=async()=>{if(!newCohort.name.trim())return;const {error:e}=await supabase.from("cohorts").insert({name:newCohort.name.trim(),start_date:newCohort.start_date||null,status:"setup"});if(e){setError(e.message);return;}setNewCohort({name:"",start_date:""});await load();};
  const saveCohort=async(id)=>{const x=cohortEdits[id];const {error:e}=await supabase.rpc("admin_update_cohort_settings",{p_cohort_id:id,p_name:x.name.trim(),p_start_date:x.start_date||null,p_status:x.status});if(e){setError(e.message);return;}await load();};
  const deleteCohort=async(c)=>{const related=groups.filter(g=>g.cohort_id===c.id);const ids=new Set(related.map(g=>g.id));const hasHistory=members.some(m=>ids.has(m.group_id));if(hasHistory){setError("This cohort has membership history and is protected from deletion.");return;}if(!confirm(`Delete empty test cohort “${c.name}”?`))return;const {error:e}=await supabase.rpc("admin_delete_course_cohort",{p_cohort_id:c.id});if(e){setError(e.message);return;}await load();};
  const createGroup=async()=>{if(!newGroup.cohort_id||!newGroup.name.trim()||newGroup.dates.some(d=>!d)){setError("Choose a cohort, name the group, and enter all six session dates.");return;}const duration=Number(newGroup.session_duration_minutes||60);const {error:e}=await supabase.rpc("admin_create_course_group",{p_cohort_id:newGroup.cohort_id,p_name:newGroup.name.trim(),p_timezone_label:newGroup.timezone_label||null,p_facilitator_user_id:null,p_meeting_url:newGroup.meeting_url||null,p_session_duration_minutes:duration,p_session_dates:newGroup.dates.map(d=>new Date(d).toISOString())});if(e){setError(e.message);return;}setNewGroup({cohort_id:"",name:"",timezone_label:"",meeting_url:"",session_duration_minutes:"60",dates:["","","","","",""]});await load();};
  const saveGroup=async(id)=>{const x=groupEdits[id];const {error:e}=await supabase.rpc("admin_update_course_group",{p_group_id:id,p_name:x.name.trim(),p_timezone_label:x.timezone_label||null,p_meeting_url:x.meeting_url||null,p_session_duration_minutes:Number(x.session_duration_minutes||60),p_session_dates:x.dates.map(d=>new Date(d).toISOString())});if(e){setError(e.message);return;}await load();};
  const deleteGroup=async(g)=>{if(members.some(m=>m.group_id===g.id)){setError("This group has membership history and is protected from deletion.");return;}if(!confirm(`Delete empty test group “${g.name}”?`))return;const {error:e}=await supabase.rpc("admin_delete_course_group",{p_group_id:g.id});if(e){setError(e.message);return;}await load();};
  const assignReturning=async(row)=>{const gid=returnGroups[row.interest_id];if(!gid){setError("Choose an active unassigned group first.");return;}const {error:e}=await supabase.rpc("admin_assign_returning_facilitator",{p_interest_id:row.interest_id,p_group_id:gid});if(e){setError(e.message);return;}await load();};
  const openSubmission=async(row)=>{const {data,error:e}=await supabase.functions.invoke("certificate-file",{body:{action:"open-capstone",version_id:row.version_id}});if(e){setError(data?.error||e.message);return;}window.open(data.project_url||data.signed_url,"_blank","noopener,noreferrer");};
  const generateCertificate=async(id)=>{const {data,error:e}=await supabase.functions.invoke("certificate-file",{body:{action:"generate",certificate_id:id}});if(e){setError(data?.error||e.message);return;}await load();};
  const reviewCapstone=async(row,decision)=>{let feedback=null;if(decision==="revision_requested"){feedback=prompt("Feedback for the participant:");if(!feedback?.trim())return;}if(decision==="approved"&&!confirm(`Approve ${row.participant_name}’s Capstone and issue their Certificate of Completion?`))return;const {data,error:e}=await supabase.rpc("admin_review_capstone",{p_capstone_id:row.capstone_id,p_decision:decision,p_feedback:feedback});if(e){setError(e.message);return;}if(data?.certificate_id)await generateCertificate(data.certificate_id);else await load();};
  const saveSettings=async()=>{setError("");setNotice("");setSettingsSaving(true);try{const {data,error:e}=await supabase.rpc("admin_update_course_settings",{p_is_published:Boolean(settings.is_published),p_participant_applications_open:Boolean(settings.participant_applications_open),p_facilitator_applications_open:Boolean(settings.facilitator_applications_open)});if(e){setError(e.message||"Could not save course settings.");return;}if(data)setSettings(data);else await load();setNotice("Course settings saved.");}catch(e){setError(e?.message||"Could not save course settings.");}finally{setSettingsSaving(false);}};
  const revokeCert=async(cert)=>{const reason=prompt(`Reason for revoking ${cert.public_code}:`);if(!reason?.trim())return;const {error:e}=await supabase.rpc("admin_revoke_certificate",{p_certificate_id:cert.id,p_reason:reason});if(e){setError(e.message);return;}await load();};
  const reissueCert=async(cert)=>{const name=prompt("Name for the replacement certificate:",cert.recipient_name);if(!name?.trim())return;const {data:id,error:e}=await supabase.rpc("admin_reissue_certificate",{p_certificate_id:cert.id,p_recipient_name:name.trim()});if(e){setError(e.message);return;}await generateCertificate(id);};
  const issueFellow=async()=>{const {profile_key,owner_email,certificate_name,completed}=fellowForm;if(!profile_key||!owner_email.trim()||!certificate_name.trim()){setError("Choose a fellow and enter their email and certificate name.");return;}let res=await supabase.rpc("admin_upsert_fellow_record",{p_profile_key:profile_key,p_owner_email:owner_email.trim(),p_certificate_name:certificate_name.trim(),p_completion_status:completed?"completed":"in_progress"});if(res.error){setError(res.error.message);return;}if(completed){res=await supabase.rpc("admin_issue_fellow_certificate",{p_profile_key:profile_key});if(res.error){setError(res.error.message);return;}await generateCertificate(res.data);}else await load();};

  const openAttendanceEditor=async(row)=>{
    setError("");setNotice("");
    if(attendanceEditor?.membership_id===row.membership_id){setAttendanceEditor(null);return;}
    const {data,error:e}=await supabase.rpc("admin_get_participant_attendance",{p_membership_id:row.membership_id});
    if(e){setError(e.message);return;}
    setAttendanceEditor({
      membership_id:row.membership_id,participant_name:row.participant_name,certificate_issued:Boolean(data?.certificate_issued),reason:"",
      sessions:(data?.sessions||[]).map(x=>({...x,status:x.status||"",exercise_status:x.exercise_status||"not_applicable"}))
    });
  };
  const editAttendance=(sessionId,key,value)=>setAttendanceEditor(ed=>!ed?ed:{...ed,sessions:ed.sessions.map(s=>s.session_id===sessionId?{...s,[key]:value,...(key==="status"&&value!=="present"?{exercise_status:"not_applicable"}:{} )}:s)});
  const saveAttendanceCorrection=async(sessionRow)=>{
    if(!attendanceEditor)return;setError("");setNotice("");
    if(attendanceEditor.certificate_issued){setError("This participant still has an issued certificate. Revoke it first, then make the correction, then reissue once the corrected record is valid.");return;}
    if(!attendanceEditor.reason.trim()){setError("Enter a reason for the attendance correction.");return;}
    if(!sessionRow.status){setError(`Choose an attendance status for Module ${sessionRow.module_id}.`);return;}
    if(sessionRow.status==="present"&&!['completed','not_completed'].includes(sessionRow.exercise_status)){setError(`Choose the exercise status for Module ${sessionRow.module_id}.`);return;}
    const {data,error:e}=await supabase.rpc("admin_correct_attendance",{p_membership_id:attendanceEditor.membership_id,p_session_id:sessionRow.session_id,p_status:sessionRow.status,p_exercise_status:sessionRow.status==="present"?sessionRow.exercise_status:"not_applicable",p_reason:attendanceEditor.reason.trim()});
    if(e){setError(e.message);return;}
    setNotice(`Module ${sessionRow.module_id} attendance corrected for ${attendanceEditor.participant_name}. ${data?.eligible_after_correction?"The participant remains Capstone-eligible.":"The participant is not currently Capstone-eligible."}`);
    const {data:fresh,error:refreshError}=await supabase.rpc("admin_get_participant_attendance",{p_membership_id:attendanceEditor.membership_id});
    if(!refreshError)setAttendanceEditor(ed=>({...ed,certificate_issued:Boolean(fresh?.certificate_issued),reason:"",sessions:(fresh?.sessions||[]).map(x=>({...x,status:x.status||"",exercise_status:x.exercise_status||"not_applicable"}))}));
    await load();
  };

  return <>
    <div style={{background:"#1C1B18",padding:"128px 44px 0"}}><div style={{maxWidth:1160,margin:"0 auto"}}><Ey label="Course Admin"/><h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(26px,3vw,40px)",fontWeight:600,color:"#fff"}}>Introduction to AI &amp; Biosecurity in Africa</h1><div style={{display:"flex",marginTop:24,borderBottom:"1px solid rgba(255,255,255,.08)",overflowX:"auto"}}>{[["applications","Applications"],["returning","Returning Facilitators"],["cohorts","Cohorts"],["groups","Groups"],["capstones","Capstones & Completion"],["certificates","Certificates"],["settings","Course Settings"],["preview","View as"]].map(([id,l])=><button key={id} className="nb" onClick={()=>setTab(id)} style={{color:tab===id?"#fff":"rgba(255,255,255,.38)",borderBottom:tab===id?"2px solid #B8102A":"2px solid transparent",padding:"11px 16px",fontSize:12.5,marginBottom:-1,whiteSpace:"nowrap"}}>{l}</button>)}</div></div></div>
    <Sec bg="#fff">{error&&<div className="err" style={{marginBottom:18}}>{error}</div>}{notice&&<div style={{marginBottom:18,padding:"11px 13px",border:"1px solid #B8D9C8",background:"#F5FBF7",fontSize:13,color:"#1A6B46",fontWeight:700}}>{notice}</div>}

    {tab==="applications"&&<div>
      <div style={{display:"flex",justifyContent:"space-between",gap:16,flexWrap:"wrap",alignItems:"end",marginBottom:18}}>
        <div><Ey label="Applications"/><H2>Application archive</H2><Txt muted s={{fontSize:13.5,marginTop:6}}>Compact archive for reviewing applications. Permanent deletion is available only for unused/test records; real programme history is protected.</Txt></div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          <input value={appSearch} onChange={e=>{setAppSearch(e.target.value);setAppPage(1);}} placeholder="Search name or email" style={{minWidth:220}}/>
          <select value={appStatus} onChange={e=>{setAppStatus(e.target.value);setAppPage(1);}}><option value="pending">Pending</option><option value="accepted">Approved</option><option value="rejected">Rejected</option><option value="all">All</option></select>
          <select value={appRole} onChange={e=>{setAppRole(e.target.value);setAppPage(1);}}><option value="all">All roles</option><option value="participant">Participants</option><option value="facilitator">Facilitators</option></select>
        </div>
      </div>
      <Txt muted s={{fontSize:12.5,marginBottom:12}}>{filteredApps.length} application{filteredApps.length===1?"":"s"}{filteredApps.length>APP_PAGE_SIZE?` · Page ${safeAppPage} of ${appPageCount}`:""}</Txt>
      {!filteredApps.length?<Txt muted>No applications match these filters.</Txt>:<>
        <div style={{overflowX:"auto",border:"1px solid var(--brd)"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:880}}>
            <thead><tr style={{background:"#F7F6F2",textAlign:"left"}}>{["Applicant","Role","Status","Applied","Assignment",""].map(h=><th key={h} style={{padding:"11px 13px",fontSize:10.5,textTransform:"uppercase",letterSpacing:".08em",color:"#6C6A66",borderBottom:"1px solid var(--brd)"}}>{h}</th>)}</tr></thead>
            <tbody>{pagedApps.map(a=>{const history=a.membership_history||[];const latest=history[0];const open=expandedApp===a.id;return <Fragment key={a.id}>
              <tr style={{borderBottom:open?"none":"1px solid var(--brd)"}}>
                <td style={{padding:"13px"}}><strong style={{fontSize:13.5}}>{a.full_name}</strong><div style={{fontSize:12,color:"#77746F",marginTop:2}}>{a.email}</div></td>
                <td style={{padding:"13px",fontSize:13,textTransform:"capitalize"}}>{a.role}</td>
                <td style={{padding:"13px"}}><StatusTag status={a.status}/></td>
                <td style={{padding:"13px",fontSize:12.5,color:"#5A5956"}}>{new Date(a.created_at).toLocaleDateString()}</td>
                <td style={{padding:"13px",fontSize:12.5,color:"#5A5956"}}>{latest?`${latest.cohort_name} — ${latest.group_name} · ${latest.status}`:"—"}</td>
                <td style={{padding:"13px",textAlign:"right"}}><button className="bo" onClick={()=>setExpandedApp(open?"":a.id)}>{open?"Close":"View application"}</button></td>
              </tr>
              {open&&<tr style={{borderBottom:"1px solid var(--brd)"}}><td colSpan={6} style={{padding:"0 13px 18px"}}>
                <div style={{background:"#F7F6F2",padding:"18px 20px"}}>
                  {a.status==="pending"&&<div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:18,paddingBottom:18,borderBottom:"1px solid var(--brd)"}}>
                    <select value={appGroups[a.id]||""} onChange={e=>setAppGroups(x=>({...x,[a.id]:e.target.value}))}><option value="">Choose active group</option>{activeGroups.filter(g=>a.role!=="facilitator"||!g.facilitator_user_id).map(g=><option key={g.id} value={g.id}>{cohorts.find(c=>c.id===g.cohort_id)?.name} — {g.name}</option>)}</select>
                    <button className="br" onClick={()=>decide(a,"accepted")}>Approve & assign</button><button className="bo" onClick={()=>decide(a,"rejected")}>Reject</button>
                  </div>}
                  <div>{Object.entries(a.answers||{}).filter(([,v])=>v!==""&&v!=null).map(([k,v])=><div key={k} style={{marginBottom:7}}><strong style={{fontSize:12}}>{answerLabel(k)}:</strong> <span style={{fontSize:13.5,color:"#5A5956"}}>{typeof v==="object"?JSON.stringify(v):String(v)}</span></div>)}</div>
                  {history.length>0&&<div style={{marginTop:18,paddingTop:14,borderTop:"1px solid var(--brd)"}}><strong style={{fontSize:12}}>Cohort history</strong>{history.map(h=><div key={h.membership_id} style={{fontSize:13,color:"#5A5956",marginTop:5}}>{h.cohort_name} — {h.group_name} · {h.status}</div>)}</div>}
                  <div style={{marginTop:20,paddingTop:14,borderTop:"1px solid var(--brd)",display:"flex",justifyContent:"space-between",gap:14,alignItems:"center",flexWrap:"wrap"}}>
                    <Txt muted s={{fontSize:12.5,maxWidth:650}}>Delete is intended for test or unused applications. If this record has attendance, progress, Capstone, completed delivery, certificate, or returning-facilitator history, Supabase will block deletion.</Txt>
                    <button className="bn" onClick={()=>deleteApplication(a)} style={{color:"#B8102A",fontWeight:700,fontSize:12.5}}>Delete unused/test application</button>
                  </div>
                </div>
              </td></tr>}
            </Fragment>;})}</tbody>
          </table>
        </div>
        {appPageCount>1&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,marginTop:16}}><button className="bo" disabled={safeAppPage<=1} onClick={()=>setAppPage(p=>Math.max(1,p-1))}>← Previous</button><Txt muted s={{fontSize:12.5}}>Page {safeAppPage} of {appPageCount}</Txt><button className="bo" disabled={safeAppPage>=appPageCount} onClick={()=>setAppPage(p=>Math.min(appPageCount,p+1))}>Next →</button></div>}
      </>}
    </div>}

    {tab==="returning"&&<div><Ey label="Returning Facilitators"/><H2 s={{marginBottom:8}}>Facilitate another cohort</H2><Txt muted s={{fontSize:13.5,marginBottom:22}}>These facilitators have already been vetted. Assignment creates a new cohort membership and keeps their original application and prior cohort history.</Txt>{!returning.length?<Txt muted>No returning facilitator interest has been registered.</Txt>:returning.map(r=><div key={r.interest_id} style={{borderTop:"1px solid var(--brd)",padding:"18px 0"}}><div style={{display:"flex",justifyContent:"space-between",gap:18,flexWrap:"wrap"}}><div><strong>{r.full_name}</strong><Txt muted s={{fontSize:13}}>{r.email} · {r.interest_status}</Txt>{(r.prior_groups||[]).map(g=><div key={g.group_id} style={{fontSize:12.5,color:"#5A5956",marginTop:4}}>Previously: {g.cohort_name} — {g.group_name}</div>)}</div>{r.interest_status!=="assigned"&&<div style={{display:"flex",gap:8}}><select value={returnGroups[r.interest_id]||""} onChange={e=>setReturnGroups(x=>({...x,[r.interest_id]:e.target.value}))}><option value="">Choose unassigned group</option>{activeGroups.filter(g=>!g.facilitator_user_id).map(g=><option key={g.id} value={g.id}>{cohorts.find(c=>c.id===g.cohort_id)?.name} — {g.name}</option>)}</select><button className="br" onClick={()=>assignReturning(r)}>Assign</button></div>}</div></div>)}</div>}

    {tab==="cohorts"&&<div style={{maxWidth:780}}><Ey label="Cohorts"/><H2 s={{marginBottom:18}}>Create cohort</H2><FF label="Cohort name"><input value={newCohort.name} onChange={e=>setNewCohort(x=>({...x,name:e.target.value}))}/></FF><FF label="Start date"><input type="date" value={newCohort.start_date} onChange={e=>setNewCohort(x=>({...x,start_date:e.target.value}))}/></FF><button className="br" onClick={createCohort}>Create cohort</button><div style={{marginTop:34}}>{cohorts.map(c=>{const x=cohortEdits[c.id]||{};const ids=new Set(groups.filter(g=>g.cohort_id===c.id).map(g=>g.id));const protectedHistory=members.some(m=>ids.has(m.group_id));return <div key={c.id} style={{borderTop:"1px solid var(--brd)",padding:"20px 0"}}><div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><FF label="Name"><input value={x.name||""} onChange={e=>setCohortEdits(v=>({...v,[c.id]:{...x,name:e.target.value}}))}/></FF><FF label="Start date"><input type="date" value={x.start_date||""} onChange={e=>setCohortEdits(v=>({...v,[c.id]:{...x,start_date:e.target.value}}))}/></FF></div><FF label="Status"><select value={x.status||"setup"} onChange={e=>setCohortEdits(v=>({...v,[c.id]:{...x,status:e.target.value}}))}><option value="setup">Setup</option><option value="active">Active</option><option value="completed">Completed</option></select></FF><div style={{display:"flex",gap:8,alignItems:"center"}}><button className="bo" onClick={()=>saveCohort(c.id)}>Save</button>{protectedHistory?<Txt muted s={{fontSize:12.5}}>Historical record protected</Txt>:<button className="bn" onClick={()=>deleteCohort(c)} style={{color:"#B8102A",fontWeight:700}}>Delete empty cohort</button>}</div></div>;})}</div></div>}

    {tab==="groups"&&<div><Ey label="Groups"/><H2 s={{marginBottom:18}}>Create group & six-session schedule</H2><div style={{maxWidth:800}}><FF label="Cohort"><select value={newGroup.cohort_id} onChange={e=>setNewGroup(x=>({...x,cohort_id:e.target.value}))}><option value="">Choose cohort</option>{cohorts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></FF><div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><FF label="Group name"><input value={newGroup.name} onChange={e=>setNewGroup(x=>({...x,name:e.target.value}))}/></FF><FF label="Timezone label"><input value={newGroup.timezone_label} onChange={e=>setNewGroup(x=>({...x,timezone_label:e.target.value}))}/></FF></div><Txt muted s={{fontSize:12.5,marginBottom:16}}>Create the group first. New facilitators are assigned when their application is approved; returning facilitators are assigned from the Returning Facilitators queue.</Txt><div className="g2" style={{display:"grid",gridTemplateColumns:"1.4fr .6fr",gap:12}}><FF label="Live session link"><input value={newGroup.meeting_url} onChange={e=>setNewGroup(x=>({...x,meeting_url:e.target.value}))}/></FF><FF label="Duration"><input type="number" value={newGroup.session_duration_minutes} onChange={e=>setNewGroup(x=>({...x,session_duration_minutes:e.target.value}))}/></FF></div>{newGroup.dates.map((d,i)=><FF key={i} label={`Module ${i+1} session`}><input type="datetime-local" value={d} onChange={e=>setNewGroup(x=>({...x,dates:x.dates.map((v,j)=>j===i?e.target.value:v)}))}/></FF>)}<button className="br" onClick={createGroup}>Create group & schedule</button></div><div style={{marginTop:40}}>{groups.map(g=>{const x=groupEdits[g.id]||{};const protectedHistory=members.some(m=>m.group_id===g.id);const locked=g.delivery_status==="completed"||g.delivery_status==="archived";return <div key={g.id} style={{borderTop:"1px solid var(--brd)",padding:"20px 0"}}><div style={{display:"flex",justifyContent:"space-between",gap:12}}><strong>{cohorts.find(c=>c.id===g.cohort_id)?.name} — {g.name}</strong><StatusTag status={locked?"completed":"accepted"}/></div>{locked?<Txt muted s={{fontSize:13,marginTop:8}}>Completed group records and schedules are read-only. AIxBio retains them as programme history.</Txt>:<div style={{marginTop:14,maxWidth:800}}><div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><FF label="Group name"><input value={x.name||""} onChange={e=>setGroupEdits(v=>({...v,[g.id]:{...x,name:e.target.value}}))}/></FF><FF label="Timezone"><input value={x.timezone_label||""} onChange={e=>setGroupEdits(v=>({...v,[g.id]:{...x,timezone_label:e.target.value}}))}/></FF></div><FF label="Meeting URL"><input value={x.meeting_url||""} onChange={e=>setGroupEdits(v=>({...v,[g.id]:{...x,meeting_url:e.target.value}}))}/></FF>{(x.dates||[]).map((d,i)=><FF key={i} label={`Module ${i+1}`}><input type="datetime-local" value={d} onChange={e=>setGroupEdits(v=>({...v,[g.id]:{...x,dates:x.dates.map((q,j)=>j===i?e.target.value:q)}}))}/></FF>)}<div style={{display:"flex",gap:8}}><button className="bo" onClick={()=>saveGroup(g.id)}>Save group</button>{protectedHistory?<Txt muted s={{fontSize:12.5}}>Historical record protected</Txt>:<button className="bn" onClick={()=>deleteGroup(g)} style={{color:"#B8102A",fontWeight:700}}>Delete empty group</button>}</div></div>}</div>;})}</div></div>}

    {tab==="capstones"&&<div>
      <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"end",flexWrap:"wrap",marginBottom:20}}>
        <div><Ey label="Capstones & Completion"/><H2>Central AIxBio review</H2></div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <select value={selectedCohort} onChange={e=>{setSelectedCohort(e.target.value);setCapGroup("all");}}><option value="">All cohorts</option>{cohorts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
          <select value={capGroup} onChange={e=>setCapGroup(e.target.value)}><option value="all">All groups</option>{cohortGroups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select>
          <select value={capStatus} onChange={e=>setCapStatus(e.target.value)}><option value="all">All statuses</option><option value="not_submitted">Not submitted</option><option value="awaiting_review">Awaiting review</option><option value="revision_requested">Revision requested</option><option value="approved">Approved</option></select>
          <select value={capSort} onChange={e=>setCapSort(e.target.value)}><option value="recent">Recently submitted</option><option value="oldest">Oldest unreviewed</option><option value="name">Name</option></select>
        </div>
      </div>
      <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:24}}>{[["Not submitted",capCounts.not_submitted],["Awaiting review",capCounts.awaiting_review],["Revision requested",capCounts.revision_requested],["Approved",capCounts.approved]].map(([label,count])=><div key={label} style={{background:"#F7F6F2",border:"1px solid var(--brd)",padding:"14px 16px"}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:25,fontWeight:600}}>{count}</div><Txt muted s={{fontSize:11.5}}>{label}</Txt></div>)}</div>
      {!cohortCapstones.length?<Txt muted>No participants match these filters.</Txt>:cohortCapstones.map(r=><div key={r.membership_id} style={{borderTop:"1px solid var(--brd)",padding:"18px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
          <div>
            <strong>{r.participant_name}</strong>
            <Txt muted s={{fontSize:13}}>{r.cohort_name} — {r.group_name} · Attendance {r.sessions_present}/6 · Exercises {r.exercises_completed}/{r.sessions_present}</Txt>
            <div style={{marginTop:6}}><span className="tag tb">{!r.capstone_id?"Not submitted":r.capstone_status.replaceAll("_"," ")}</span>{r.eligible&&<span className="tag tr" style={{marginLeft:6}}>Capstone eligible</span>}</div>
            {r.project_title&&<Txt s={{fontSize:13.5,marginTop:8}}>{r.project_title} · Version {r.version_number}</Txt>}
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            {r.capstone_id&&<button className="bo" onClick={()=>openSubmission(r)}>Open Submission</button>}
            {r.capstone_status==="awaiting_review"&&<><button className="br" onClick={()=>reviewCapstone(r,"approved")}>Approve Capstone</button><button className="bo" onClick={()=>reviewCapstone(r,"revision_requested")}>Request Revision</button></>}
            {r.certificate_id&&<CertificateActions certificate={{id:r.certificate_id,status:r.certificate_status,public_code:r.certificate_code}} compact/>}
            {r.group_delivery_status==="completed"&&<button className="bo" onClick={()=>openAttendanceEditor(r)}>{attendanceEditor?.membership_id===r.membership_id?"Close attendance":"Correct attendance"}</button>}
          </div>
        </div>
        {attendanceEditor?.membership_id===r.membership_id&&<div style={{marginTop:18,padding:"20px 22px",background:"#F7F6F2",border:"1px solid var(--brd)"}}>
          <Ey label="Attendance Correction"/>
          <H2 s={{fontSize:21,marginBottom:8}}>Completed-group correction</H2>
          <Txt muted s={{fontSize:13.5,marginBottom:16}}>Corrections are logged with the previous and new values, the admin account, time, and reason. This does not delete the original audit history.</Txt>
          {attendanceEditor.certificate_issued&&<div className="err" style={{marginBottom:16}}>A valid certificate is currently issued for this participant. Revoke it in Certificates before changing attendance. After the correction, use Reissue only if the participant still meets the course requirements.</div>}
          <div style={{display:"flex",flexDirection:"column",gap:10}}>{attendanceEditor.sessions.map(s=><div key={s.session_id} style={{display:"grid",gridTemplateColumns:"80px 1fr 1fr auto",gap:10,alignItems:"center",padding:"10px 0",borderTop:"1px solid var(--brd)"}}>
            <strong style={{fontSize:12.5}}>Module {s.module_id}</strong>
            <select value={s.status} disabled={attendanceEditor.certificate_issued} onChange={e=>editAttendance(s.session_id,"status",e.target.value)}><option value="">Choose attendance</option><option value="present">Present</option><option value="absent">Absent</option><option value="excused">Excused</option></select>
            {s.status==="present"?<select value={s.exercise_status} disabled={attendanceEditor.certificate_issued} onChange={e=>editAttendance(s.session_id,"exercise_status",e.target.value)}><option value="completed">Exercise completed</option><option value="not_completed">Exercise not completed</option></select>:<Txt muted s={{fontSize:12.5}}>Exercise not applicable</Txt>}
            <button className="bo" disabled={attendanceEditor.certificate_issued} onClick={()=>saveAttendanceCorrection(s)}>Save correction</button>
          </div>)}</div>
          <FF label="Reason for correction *"><input value={attendanceEditor.reason} disabled={attendanceEditor.certificate_issued} onChange={e=>setAttendanceEditor(ed=>({...ed,reason:e.target.value}))} placeholder="e.g. Facilitator confirmed the original mark was entered incorrectly"/></FF>
        </div>}
      </div>)}
    </div>}

    {tab==="certificates"&&<div><Ey label="Certificates"/><H2 s={{marginBottom:8}}>Issued credentials</H2><Txt muted s={{fontSize:13.5,marginBottom:22}}>Certificates are private files. The public QR verification page exposes only the credential details required to verify validity.</Txt><div style={{overflowX:"auto"}}>{!certificates.length?<Txt muted>No certificates have been issued yet.</Txt>:certificates.map(c=><div key={c.id} style={{borderTop:"1px solid var(--brd)",padding:"16px 0",display:"flex",justifyContent:"space-between",gap:14,flexWrap:"wrap"}}><div><strong>{c.recipient_name}</strong><Txt muted s={{fontSize:13}}>{c.program_type} · {c.cohort_name||"—"} · {c.public_code}</Txt><Txt muted s={{fontSize:12.5}}>{new Date(c.issued_at).toLocaleDateString()} · {c.status} · file {c.file_status}</Txt></div><div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>{c.status==="issued"&&c.file_status!=="ready"&&<button className="br" onClick={()=>generateCertificate(c.id)}>Generate PDF</button>}{c.status==="issued"&&c.file_status==="ready"&&<CertificateActions certificate={c} compact/>}{["issued","revoked"].includes(c.status)&&<button className="bo" onClick={()=>reissueCert(c)}>Reissue</button>}{c.status==="issued"&&<button className="bn" onClick={()=>revokeCert(c)} style={{color:"#B8102A",fontWeight:700}}>Revoke</button>}</div></div>)}</div><div style={{marginTop:44,paddingTop:28,borderTop:"1px solid var(--brd)",maxWidth:720}}><Ey label="Fellowship Certificates"/><H2 s={{marginBottom:8}}>Connect a pilot fellow</H2><Txt muted s={{fontSize:13.5,marginBottom:18}}>The fellow’s public research profile stays public. After you enter the email they use for AIxBio sign-in, only that fellow and AIxBio admins can see the private certificate controls on the profile.</Txt><FF label="Fellow"><select value={fellowForm.profile_key} onChange={e=>{const key=e.target.value;const f=FELLOWS.find(x=>x.id===key);const saved=fellowRecords.find(x=>x.profile_key===key);setFellowForm({profile_key:key,owner_email:saved?.owner_email||"",certificate_name:saved?.certificate_name||f?.name||"",completed:saved?.completion_status==="completed"});}}>{FELLOWS.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</select></FF><FF label="Fellow sign-in email"><input type="email" value={fellowForm.owner_email} onChange={e=>setFellowForm(x=>({...x,owner_email:e.target.value}))}/></FF><FF label="Name on certificate"><input value={fellowForm.certificate_name} onChange={e=>setFellowForm(x=>({...x,certificate_name:e.target.value}))}/></FF><label style={{display:"flex",gap:9,alignItems:"center",fontSize:13.5,marginBottom:18}}><input type="checkbox" checked={fellowForm.completed} onChange={e=>setFellowForm(x=>({...x,completed:e.target.checked}))}/> Fellowship successfully completed; issue Certificate of Completion</label><button className="br" onClick={issueFellow}>{fellowForm.completed?"Save & Issue Certificate":"Save Fellow Access"}</button>{fellowRecords.length>0&&<div style={{marginTop:28}}><Ey label="Connected Fellows"/>{fellowRecords.map(fr=>{const publicFellow=FELLOWS.find(f=>f.id===fr.profile_key);return <div key={fr.id} style={{borderTop:"1px solid var(--brd)",padding:"14px 0",display:"flex",justifyContent:"space-between",gap:14,flexWrap:"wrap"}}><div><strong>{publicFellow?.name||fr.certificate_name||fr.profile_key}</strong><Txt muted s={{fontSize:12.5}}>{fr.owner_email||"No owner email"} · {fr.completion_status.replaceAll("_"," ")}</Txt>{fr.certificate_code&&<Txt muted s={{fontSize:12.5}}>{fr.certificate_code} · {fr.certificate_file_status||"pending"}</Txt>}</div>{fr.certificate_id&&<CertificateActions certificate={{id:fr.certificate_id,status:fr.certificate_status,public_code:fr.certificate_code}} compact/>}</div>;})}</div>}</div></div>}

    {tab==="settings"&&<div style={{maxWidth:680}}><Ey label="Course Settings"/><H2 s={{marginBottom:10}}>Publishing and applications</H2><Txt muted s={{fontSize:13.5,marginBottom:22}}>Closing applications does not remove course access from accepted participants or facilitators.</Txt>{[["is_published","Publish course page"],["participant_applications_open","Participant applications open"],["facilitator_applications_open","Facilitator applications open"]].map(([key,label])=><label key={key} style={{display:"flex",gap:10,alignItems:"center",padding:"12px 0",borderTop:"1px solid var(--brd)",fontSize:14}}><input type="checkbox" checked={Boolean(settings[key])} onChange={e=>setSettings(s=>({...s,[key]:e.target.checked}))}/>{label}</label>)}<button className="br" onClick={saveSettings} disabled={settingsSaving} style={{marginTop:18,opacity:settingsSaving?.65:1}}>{settingsSaving?"Saving…":"Save course settings"}</button></div>}

    {tab==="preview"&&<div><H2 s={{marginBottom:12}}>View as</H2><Txt muted s={{marginBottom:20}}>Admin preview uses your admin account; no second account is required.</Txt><div style={{display:"flex",gap:10}}><button className="br" onClick={()=>go("facilitator")}>View as facilitator</button><button className="bo" onClick={()=>go("participant")}>View as participant</button></div></div>}
    </Sec>
  </>;
};

export default function CourseShell({page,params,session,isAdmin,go,openAuth}){
  const {settings,loaded}=useCourseSettings();
  const {memberships,loaded:accessLoaded}=useCourseMembershipAccess(session);
  if((!loaded||(session?.user&&!accessLoaded))&&!isAdmin)return <ComingSoon/>;
  if(!settings.is_published&&!isAdmin&&page==="courses"&&memberships.length===0)return <ComingSoon/>;
  if(page==="courses")return <Landing go={go} session={session} settings={settings} memberships={memberships}/>;
  if(page==="course-apply")return <ApplicationPage session={session} openAuth={openAuth} go={go} settings={settings}/>;
  if(page==="course-admin")return isAdmin?<AdminDashboard go={go}/>:<AccessMessage session={session} openAuth={openAuth} text="Admin access is required."/>;
  if(page==="facilitator"||page==="facilitator-module")return <RoleTool role="facilitator" page={page} params={params} session={session} isAdmin={isAdmin} go={go} openAuth={openAuth}/>;
  if(page==="participant"||page==="participant-module")return <RoleTool role="participant" page={page} params={params} session={session} isAdmin={isAdmin} go={go} openAuth={openAuth}/>;
  return <Landing go={go} session={session} settings={settings}/>;
}
