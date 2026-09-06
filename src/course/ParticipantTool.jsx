import { useState } from "react";
import { supabase } from "../lib/supabase";
import { PageHdr, Sec, Ey, H2, Txt, FF } from "./CoursePrimitives";
import LiveSessionsPanel from "./LiveSessionsPanel";

const Item = ({ item }) => {
  if (item.type === "subsection") {
    return (
      <div style={{ marginBottom:22 }}>
        <h4 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:"#1A1917",marginBottom:9 }}>{item.heading.replace(/^\d+\.\s*/, "")}</h4>
        {item.items.map((child,i)=><Item key={i} item={child}/>)}
      </div>
    );
  }
  if (item.type === "bullet") {
    return (
      <div style={{ display:"flex",gap:10,marginBottom:7 }}>
        <span style={{ color:"#B8102A",fontWeight:700,flexShrink:0 }}>—</span>
        <Txt muted s={{ fontSize:14,lineHeight:1.65 }}>{item.text}</Txt>
      </div>
    );
  }
  const isUrl = /^https?:\/\//.test(item.text);
  if (isUrl) {
    return <a href={item.text} target="_blank" rel="noopener noreferrer" style={{ display:"inline-block",fontFamily:"'Figtree',sans-serif",fontSize:12.5,fontWeight:700,color:"#B8102A",textDecoration:"none",borderBottom:"1px solid rgba(184,16,42,.35)",marginBottom:12 }}>Open resource ↗</a>;
  }
  return <Txt muted s={{ fontSize:14,lineHeight:1.72,marginBottom:10 }}>{item.text}</Txt>;
};

const ProgressStrip = ({ progress }) => {
  if (!progress) return null;
  return (
    <div className="reveal" style={{ background:"#F7F6F2",border:"1px solid var(--brd)",padding:"20px 22px",marginBottom:42 }}>
      <Ey label="Your progress"/>
      <div className="g3" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16 }}>
        <div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:600,color:"#1A1917" }}>{progress.sessions_present || 0} / 6</div>
          <Txt muted s={{ fontSize:12.5 }}>Live sessions attended</Txt>
        </div>
        <div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:600,color:"#1A1917" }}>{progress.exercises_completed || 0} / {progress.exercises_required || 0}</div>
          <Txt muted s={{ fontSize:12.5 }}>Exercises completed for attended sessions</Txt>
        </div>
        <div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:600,color:progress.capstone_unlocked?"#1A6B46":"#8A8884" }}>
            {progress.capstone_unlocked ? "Eligible" : "Not yet"}
          </div>
          <Txt muted s={{ fontSize:12.5 }}>Capstone eligibility</Txt>
        </div>
      </div>
    </div>
  );
};

const LockBadge = ({ locked }) => (
  <span className={`tag ${locked ? "tb" : "tr"}`} style={{ whiteSpace:"nowrap" }}>
    {locked ? "Locked" : "Open"}
  </span>
);

export const ParticipantHub = ({ go, courseMeta, courseModules, progress, capstone }) => (
  <>
    <PageHdr label="Participant Course" title={courseMeta.title} sub={courseMeta.purpose}/>
    <Sec bg="#fff">
      <div className="reveal" style={{ marginBottom:44 }}>
        <Ey label="Course Overview"/>
        <H2 s={{ marginBottom:16 }}>Your learning journey</H2>
        <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
          {(courseMeta.learningJourney || []).map((step,i)=><span key={step} className="tag tb">{i+1}. {step}</span>)}
        </div>
      </div>

      <LiveSessionsPanel courseModules={courseModules}/>

      <ProgressStrip progress={progress}/>

      <div className="reveal">
        <Ey label="Modules"/>
        <H2 s={{ marginBottom:8 }}>Six Sessions</H2>
        <Txt muted s={{ fontSize:13.5,marginBottom:24 }}>
          Module 1 is available from the start. Your facilitator unlocks each later module as your group moves through the course.
        </Txt>

        {courseModules.map(m=>(
          <div
            key={m.id}
            className="lft"
            onClick={()=>!m.locked&&go("participant-module",{slug:m.slug})}
            style={{
              display:"grid",
              gridTemplateColumns:"56px 1fr auto",
              gap:24,
              padding:"24px 0",
              borderTop:"1px solid var(--brd)",
              cursor:m.locked?"default":"pointer",
              alignItems:"center",
              opacity:m.locked ? .58 : 1
            }}
          >
            <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:13,fontWeight:600,color:"rgba(26,25,23,.22)" }}>{String(m.id).padStart(2,"0")}</span>
            <div>
              <div style={{ display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",marginBottom:5 }}>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:"#1A1917" }}>{m.title}</h3>
                <LockBadge locked={m.locked}/>
              </div>
              <Txt muted s={{ fontSize:14 }}>{m.overview}</Txt>
              {m.locked&&<Txt s={{ fontSize:12.5,color:"#8A8884",marginTop:7 }}>Your facilitator has not unlocked this module yet.</Txt>}
            </div>
            <span style={{ color:m.locked?"#B9B7B1":"#B8102A",fontSize:18 }}>{m.locked?"🔒":"→"}</span>
          </div>
        ))}

        <div style={{ borderTop:"1px solid var(--brd)" }}/>

        {capstone&&(
          <div
            onClick={()=>!capstone.locked&&go("participant-module",{slug:"capstone"})}
            style={{
              display:"grid",
              gridTemplateColumns:"56px 1fr auto",
              gap:24,
              padding:"26px 0",
              borderBottom:"1px solid var(--brd)",
              cursor:capstone.locked?"default":"pointer",
              alignItems:"center",
              opacity:capstone.locked ? .62 : 1
            }}
          >
            <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:13,fontWeight:600,color:"rgba(26,25,23,.22)" }}>07</span>
            <div>
              <div style={{ display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",marginBottom:5 }}>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:"#1A1917" }}>{capstone.title}</h3>
                <LockBadge locked={capstone.locked}/>
              </div>
              <Txt muted s={{ fontSize:14 }}>{capstone.overview}</Txt>
              {capstone.locked&&<Txt s={{ fontSize:12.5,color:"#8A8884",marginTop:7 }}>Unlocks automatically after Module 6 once you meet the attendance and exercise requirements.</Txt>}
            </div>
            <span style={{ color:capstone.locked?"#B9B7B1":"#B8102A",fontSize:18 }}>{capstone.locked?"🔒":"→"}</span>
          </div>
        )}
      </div>
    </Sec>
  </>
);

const LockedModule = ({ module, go }) => (
  <>
    <PageHdr label={`Module ${module.id} of 6`} title={module.title} sub="This module is not available to your group yet."/>
    <Sec bg="#fff">
      <div style={{ maxWidth:620 }}>
        <Ey label="Locked"/>
        <H2 s={{ marginBottom:12 }}>Your facilitator will unlock this module.</H2>
        <Txt muted s={{ marginBottom:22 }}>Return to the course page to see the modules currently available to your group.</Txt>
        <button className="bo" onClick={()=>go("participant")}>← Back to course</button>
      </div>
    </Sec>
  </>
);

const formatLabels = {
  policy_brief:"Short policy brief",
  risk_analysis:"Risk analysis",
  research_proposal:"Research proposal outline",
  intervention_idea:"Intervention idea",
  communication_piece:"Short communication piece",
  mini_literature_review:"Mini literature review"
};

const CapstoneDetail = ({ capstone, progress, go }) => {
  const [title,setTitle]=useState("");
  const [format,setFormat]=useState("policy_brief");
  const [file,setFile]=useState(null);
  const [projectUrl,setProjectUrl]=useState("");
  const [submitting,setSubmitting]=useState(false);
  const [error,setError]=useState("");
  const [submission,setSubmission]=useState(progress?.capstone_submission || null);

  if (!capstone || capstone.locked) {
    return (
      <>
        <PageHdr label="Capstone" title={capstone?.title || "Capstone"} sub="Your Capstone is still locked."/>
        <Sec bg="#fff">
          <div style={{ maxWidth:680 }}>
            <Ey label="Eligibility"/>
            <H2 s={{ marginBottom:14 }}>Complete the course requirements first.</H2>
            <Txt muted s={{ marginBottom:20 }}>
              The Capstone unlocks automatically after Module 6 attendance is recorded, once you have attended at least 4 of 6 live sessions and every session you attended has its pre-session exercise marked completed.
            </Txt>
            <button className="bo" onClick={()=>go("participant")}>← Back to course</button>
          </div>
        </Sec>
      </>
    );
  }

  const submit=async()=>{
    setError("");
    if(!title.trim()){setError("Enter a project title.");return;}
    if(!file&&!projectUrl.trim()){setError("Upload a file or enter a project link.");return;}
    if(file&&projectUrl.trim()){setError("Choose one submission method: file or link.");return;}

    setSubmitting(true);
    let filePath=null;

    try{
      if(file){
        const {data:{user},error:userError}=await supabase.auth.getUser();
        if(userError||!user) throw new Error("Your session has expired. Please sign in again.");
        const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,"-");
        filePath=`${user.id}/${Date.now()}-${safeName}`;
        const {error:uploadError}=await supabase.storage.from("capstones").upload(filePath,file,{upsert:false});
        if(uploadError) throw uploadError;
      }

      const {data,error:rpcError}=await supabase.rpc("submit_my_capstone",{
        p_project_title:title.trim(),
        p_project_format:format,
        p_project_url:projectUrl.trim()||null,
        p_file_path:filePath
      });

      if(rpcError){
        if(filePath) await supabase.storage.from("capstones").remove([filePath]);
        throw rpcError;
      }

      setSubmission(data);
    }catch(e){
      setError(e.message||"Could not submit your Capstone.");
    }finally{
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHdr label="Capstone" title={capstone.title} sub={capstone.overview}/>
      <Sec bg="#fff">
        <div style={{ maxWidth:780 }}>
          <div className="reveal" style={{ marginBottom:34 }}>
            <Ey label="Final Project"/>
            <H2 s={{ marginBottom:12 }}>Turn your Module 6 research question into a short applied project.</H2>
            <Txt muted s={{ fontSize:14.5,lineHeight:1.72,marginBottom:12 }}>{capstone.instructions}</Txt>
            <Txt muted s={{ fontSize:13.5 }}><strong style={{ color:"#1A1917" }}>Expected effort:</strong> {capstone.expectedEffort}</Txt>
            {progress?.capstone_due_at&&<Txt muted s={{ fontSize:13.5 }}><strong style={{ color:"#1A1917" }}>Target deadline:</strong> {new Date(progress.capstone_due_at).toLocaleString()}</Txt>}
          </div>

          <div className="reveal" style={{ background:"#F7F6F2",border:"1px solid var(--brd)",padding:"22px 24px",marginBottom:34 }}>
            <Ey label="Choose one format"/>
            <div style={{ display:"flex",flexDirection:"column",gap:7 }}>
              {capstone.formats.map((f,i)=><Txt key={i} muted s={{ fontSize:13.5 }}>— {f}</Txt>)}
            </div>
          </div>

          <div className="reveal" style={{ marginBottom:36 }}>
            <Ey label="Your project should address"/>
            {capstone.projectQuestions.map((q,i)=>(
              <div key={i} style={{ display:"flex",gap:10,marginBottom:8 }}>
                <span style={{ color:"#B8102A",fontWeight:700 }}>{i+1}.</span>
                <Txt muted s={{ fontSize:14 }}>{q}</Txt>
              </div>
            ))}
          </div>

          {submission ? (
            <div className="reveal" style={{ border:"1px solid var(--brd)",padding:"22px 24px",background:"#F7F6F2" }}>
              <Ey label="Submitted"/>
              <H2 s={{ marginBottom:8 }}>Capstone submitted ✓</H2>
              <Txt muted s={{ fontSize:13.5 }}>Project: {submission.project_title}</Txt>
              <Txt muted s={{ fontSize:13.5 }}>Format: {formatLabels[submission.project_format] || submission.project_format}</Txt>
              <Txt muted s={{ fontSize:13.5 }}>Submitted: {new Date(submission.submitted_at).toLocaleString()}</Txt>
              <Txt muted s={{ fontSize:13.5 }}>Status: {submission.status}</Txt>
            </div>
          ) : (
            <div className="reveal" style={{ borderTop:"1px solid var(--brd)",paddingTop:28 }}>
              <Ey label="Submit your Capstone"/>
              <H2 s={{ marginBottom:20 }}>File or link</H2>

              <FF label="Project title">
                <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Your project title"/>
              </FF>

              <FF label="Project format">
                <select value={format} onChange={e=>setFormat(e.target.value)}>
                  {Object.entries(formatLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}
                </select>
              </FF>

              <FF label="Upload project file">
                <input type="file" onChange={e=>{setFile(e.target.files?.[0]||null); if(e.target.files?.[0])setProjectUrl("");}}/>
              </FF>

              <div style={{ textAlign:"center",fontSize:11,fontWeight:700,color:"#8A8884",letterSpacing:".12em",textTransform:"uppercase",margin:"4px 0 16px" }}>or</div>

              <FF label="Project link">
                <input type="url" value={projectUrl} onChange={e=>{setProjectUrl(e.target.value);if(e.target.value)setFile(null);}} placeholder="https://..."/>
              </FF>

              {error&&<div className="err" style={{ marginBottom:14 }}>{error}</div>}
              <button className="br" onClick={submit} disabled={submitting} style={{ opacity:submitting ? .65 : 1 }}>
                {submitting?"Submitting…":"Submit Capstone"}
              </button>
            </div>
          )}

          <div style={{ marginTop:34,paddingTop:24,borderTop:"1px solid var(--brd)" }}>
            <button className="bo" onClick={()=>go("participant")}>← Back to course</button>
          </div>
        </div>
      </Sec>
    </>
  );
};

export const ParticipantModuleDetail = ({ slug, go, courseModules, progress, capstone }) => {
  if(slug==="capstone") return <CapstoneDetail capstone={capstone} progress={progress} go={go}/>;

  const m = courseModules.find(mod=>mod.slug===slug);
  if (!m) return <Sec bg="#fff"><Txt>Module not found.</Txt></Sec>;
  if (m.locked) return <LockedModule module={m} go={go}/>;

  const idx=courseModules.findIndex(mod=>mod.slug===slug);
  const prev=courseModules[idx-1], next=courseModules[idx+1];

  return (
    <>
      <PageHdr label={`Module ${m.id} of 6`} title={m.title} sub={m.overview}/>
      <Sec bg="#fff">
        <div style={{ maxWidth:780 }}>
          {m.sections.map((section,i)=>(
            <section key={`${section.heading}-${i}`} className="reveal" style={{ marginBottom:36 }}>
              <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:10,fontWeight:700,color:"#5A5956",letterSpacing:".12em",textTransform:"uppercase",marginBottom:12 }}>{section.heading}</div>
              {section.items.map((item,j)=><Item key={j} item={item}/>)}
            </section>
          ))}
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:40,paddingTop:28,borderTop:"1px solid var(--brd)",flexWrap:"wrap",gap:12 }}>
            <button className="bo" onClick={()=>go("participant")}>← All Modules</button>
            <div style={{ display:"flex",gap:10 }}>
              {prev&&<button className="bo" onClick={()=>go("participant-module",{slug:prev.slug})}>← Module {prev.id}</button>}
              {next&&!next.locked&&<button className="br" onClick={()=>go("participant-module",{slug:next.slug})}>Module {next.id} →</button>}
              {next&&next.locked&&<button className="bo" disabled style={{ opacity:.55,cursor:"default" }}>Module {next.id} locked</button>}
              {!next&&capstone&&!capstone.locked&&<button className="br" onClick={()=>go("participant-module",{slug:"capstone"})}>Capstone →</button>}
              {!next&&capstone?.locked&&<button className="bo" disabled style={{ opacity:.55,cursor:"default" }}>Capstone locked</button>}
            </div>
          </div>
        </div>
      </Sec>
    </>
  );
};
