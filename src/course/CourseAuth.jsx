import { useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabase";
import { AfricaSvg, FF, Txt } from "./CoursePrimitives";

export default function CourseAuth({ open, onClose }) {
  const [mode,setMode]=useState("signin");
  const [fullName,setFullName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  if (!open) return null;

  const submit=async()=>{
    if(!supabaseConfigured){ setError("Supabase is not configured yet."); return; }
    setBusy(true); setError("");
    const result = mode==="signup"
      ? await supabase.auth.signUp({ email,password,options:{data:{full_name:fullName}} })
      : await supabase.auth.signInWithPassword({ email,password });
    setBusy(false);
    if(result.error){ setError(result.error.message); return; }
    if(mode==="signup" && !result.data.session){
      setError("Check your email to confirm your account, then sign in.");
      return;
    }
    onClose();
  };

  const google=async()=>{
    if(!supabaseConfigured){ setError("Supabase is not configured yet."); return; }
    const { error:e }=await supabase.auth.signInWithOAuth({
      provider:"google",
      options:{redirectTo:window.location.href},
    });
    if(e) setError(e.message);
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Sign in" style={{ position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,.58)",display:"flex",alignItems:"center",justifyContent:"center",padding:20 }} onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{ width:"100%",maxWidth:420,background:"#fff",border:"1px solid var(--brd)",padding:"30px 30px 26px",position:"relative" }}>
        <button onClick={onClose} aria-label="Close" style={{ position:"absolute",right:16,top:14,border:"none",background:"none",fontSize:20,cursor:"pointer",color:"#5A5956" }}>×</button>
        <AfricaSvg style={{ width:27,height:34,color:"#B8102A",marginBottom:12 }}/>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:27,fontWeight:600,color:"#1A1917",marginBottom:5 }}>{mode==="signin"?"Sign in":"Create account"}</h2>
        <Txt muted s={{ fontSize:13.5,marginBottom:20 }}>One AIxBio Africa account for applications and course access.</Txt>
        {mode==="signup"&&<FF label="Name"><input value={fullName} onChange={e=>setFullName(e.target.value)} autoComplete="name"/></FF>}
        <FF label="Email"><input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email"/></FF>
        <FF label="Password" error={error||null}><input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete={mode==="signup"?"new-password":"current-password"} onKeyDown={e=>e.key==="Enter"&&submit()}/></FF>
        <button className="br" disabled={busy} onClick={submit} style={{ width:"100%",marginBottom:10 }}>{busy?"Please wait…":mode==="signin"?"Sign in":"Create account"}</button>
        <button className="bo" onClick={google} style={{ width:"100%",marginBottom:18 }}>Continue with Google</button>
        <button className="bn" onClick={()=>{setMode(mode==="signin"?"signup":"signin");setError("");}} style={{ width:"100%",textAlign:"center",fontSize:12.5,color:"#B8102A",fontWeight:600 }}>
          {mode==="signin"?"Need an account? Create one":"Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}

