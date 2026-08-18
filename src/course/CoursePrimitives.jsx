export const AfricaSvg = ({ style = {} }) => (
  <svg viewBox="0 0 100 128" fill="currentColor" style={{ display:"block",...style }}>
    <path d="M50,5 C45,5 38,9 33,14 C28,19 23,26 20,34 C17,42 15,51 15,60 C15,69 17,78 21,86 C25,94 31,101 38,107 C44,112 51,115 58,114 C65,113 71,108 76,102 C82,95 85,86 86,76 C87,65 85,54 80,44 C75,34 68,25 61,17 C56,11 53,5 50,5 Z M62,14 C67,9 69,4 66,2 C64,1 62,3 62,7 Z"/>
  </svg>
);

export const Sec = ({ children, bg="#F7F6F2", style:s={}, id }) => (
  <section id={id} className="sec-pad" style={{ background:bg,padding:"88px 44px",...s }}>
    <div style={{ maxWidth:1160,margin:"0 auto" }}>{children}</div>
  </section>
);

export const PageHdr = ({ label, title, sub, light=false }) => (
  <div className="page-hdr-pad" style={{ background: light ? "#1C1B18" : "#1A1917", padding:"128px 44px 56px" }}>
    <div style={{ maxWidth:1160,margin:"0 auto" }}>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:18 }}>
        <div style={{ width:22,height:1.5,background:"#B8102A" }}/>
        <span style={{ fontFamily:"'Figtree',sans-serif",fontSize:10.5,fontWeight:700,color:"#B8102A",letterSpacing:".2em",textTransform:"uppercase" }}>{label}</span>
      </div>
      <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(28px,3.2vw,46px)",fontWeight:600,color:"#fff",lineHeight:1.18,letterSpacing:"-0.02em",maxWidth:760 }}>{title}</h1>
      {sub && <p style={{ fontFamily:"'Figtree',sans-serif",fontSize:15.5,color:"rgba(255,255,255,.56)",lineHeight:1.74,maxWidth:650,marginTop:14 }}>{sub}</p>}
    </div>
  </div>
);

export const Ey = ({ label }) => (
  <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:18 }}>
    <div style={{ width:22,height:1.5,background:"#B8102A",flexShrink:0 }}/>
    <span style={{ fontFamily:"'Figtree',sans-serif",fontSize:10.5,fontWeight:700,color:"#B8102A",letterSpacing:".2em",textTransform:"uppercase" }}>{label}</span>
  </div>
);

export const H2 = ({ children, s={} }) => (
  <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(25px,2.8vw,40px)",fontWeight:600,lineHeight:1.2,letterSpacing:"-0.02em",color:"#1A1917",...s }}>{children}</h2>
);

export const Txt = ({ children, muted=false, s={} }) => (
  <p style={{ fontFamily:"'Figtree',sans-serif",fontSize:15.5,lineHeight:1.78,color: muted ? "#5A5956" : "#3A3835",...s }}>{children}</p>
);

export const FF = ({ label, error, children }) => (
  <div style={{ marginBottom:16 }}>
    <label style={{ fontFamily:"'Figtree',sans-serif",fontSize:11.5,fontWeight:600,color:"#1A1917",letterSpacing:".04em",textTransform:"uppercase",display:"block",marginBottom:6 }}>{label}</label>
    {children}
    {error && <div className="err">{error}</div>}
  </div>
);

