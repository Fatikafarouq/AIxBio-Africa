import { PageHdr, Sec, Ey, H2, Txt } from "./CoursePrimitives";

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

export const ParticipantHub = ({ go, courseMeta, courseModules }) => (
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
      <div className="reveal">
        <Ey label="Modules"/>
        <H2 s={{ marginBottom:28 }}>Six Sessions</H2>
        {courseModules.map(m=>(
          <div key={m.id} className="lft" onClick={()=>go("participant-module",{slug:m.slug})} style={{ display:"grid",gridTemplateColumns:"56px 1fr auto",gap:24,padding:"24px 0",borderTop:"1px solid var(--brd)",cursor:"pointer",alignItems:"center" }}>
            <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:13,fontWeight:600,color:"rgba(26,25,23,.22)" }}>{String(m.id).padStart(2,"0")}</span>
            <div>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:"#1A1917",marginBottom:5 }}>{m.title}</h3>
              <Txt muted s={{ fontSize:14 }}>{m.overview}</Txt>
            </div>
            <span style={{ color:"#B8102A",fontSize:18 }}>→</span>
          </div>
        ))}
        <div style={{ borderTop:"1px solid var(--brd)" }}/>
      </div>
    </Sec>
  </>
);

export const ParticipantModuleDetail = ({ slug, go, courseModules }) => {
  const m = courseModules.find(mod=>mod.slug===slug);
  if (!m) return <Sec bg="#fff"><Txt>Module not found.</Txt></Sec>;
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
              {next&&<button className="br" onClick={()=>go("participant-module",{slug:next.slug})}>Module {next.id} →</button>}
            </div>
          </div>
        </div>
      </Sec>
    </>
  );
};

