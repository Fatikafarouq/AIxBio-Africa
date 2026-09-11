import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import CertificateActions from "./course/CertificateActions";

export default function FellowCertificateControls({ profileKey, session }) {
  const [state,setState]=useState(null);
  const [isOwner,setIsOwner]=useState(false);
  const [loading,setLoading]=useState(false);

  useEffect(()=>{
    let alive=true;

    if(!session?.user||!profileKey){
      setState(null);
      setIsOwner(false);
      return;
    }

    const load=async()=>{
      setLoading(true);

      const {data:claim}=await supabase.rpc("claim_my_fellow_record",{
        p_profile_key:profileKey
      });

      // The public fellow card shows certificate information only to the
      // fellow who owns this exact record. Admins manage certificates in
      // Course Admin instead of seeing private controls on public profiles.
      const owner=claim?.owner===true;
      if(!owner){
        if(alive){
          setIsOwner(false);
          setState(null);
          setLoading(false);
        }
        return;
      }

      const {data}=await supabase.rpc("get_my_fellow_certificate",{
        p_profile_key:profileKey
      });

      if(alive){
        setIsOwner(true);
        setState(data||null);
        setLoading(false);
      }
    };

    load();
    return()=>{alive=false;};
  },[profileKey,session?.user?.id]);

  if(!session?.user||loading||!isOwner||!state) return null;

  if(state.availability!=="ready"){
    return (
      <div style={{marginTop:22,paddingTop:18,borderTop:"1px solid var(--brd)"}}>
        <div style={{fontFamily:"'Figtree',sans-serif",fontSize:10,fontWeight:700,color:"#5A5956",letterSpacing:".12em",textTransform:"uppercase",marginBottom:6}}>
          Certificate of Completion
        </div>
        <div style={{fontFamily:"'Figtree',sans-serif",fontSize:14,fontWeight:700,color:"#1A1917",marginBottom:5}}>
          Not yet ready
        </div>
        <div style={{fontFamily:"'Figtree',sans-serif",fontSize:12.5,lineHeight:1.65,color:"#77736C",maxWidth:460}}>
          Your fellowship completion is recorded. Your certificate will appear here once the final AIxBio Africa certificate is ready.
        </div>
      </div>
    );
  }

  return (
    <div style={{marginTop:22,paddingTop:18,borderTop:"1px solid var(--brd)"}}>
      <div style={{fontFamily:"'Figtree',sans-serif",fontSize:10,fontWeight:700,color:"#5A5956",letterSpacing:".12em",textTransform:"uppercase",marginBottom:6}}>
        Certificate of Completion
      </div>
      <div style={{fontFamily:"'Figtree',sans-serif",fontSize:12.5,color:"#5A5956"}}>
        {state.public_code}
      </div>
      <CertificateActions certificate={state} compact/>
    </div>
  );
}
