import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import CertificateActions from "./course/CertificateActions";

export default function FellowCertificateControls({ profileKey, session, isAdmin }) {
  const [certificate,setCertificate]=useState(null);
  const [loading,setLoading]=useState(false);

  useEffect(()=>{
    let alive=true;
    if(!session?.user||!profileKey){setCertificate(null);return;}

    const load=async()=>{
      setLoading(true);

      // If AIxBio has entered this fellow's email in Supabase,
      // this securely links the signed-in account to the fellow record.
      await supabase.rpc("claim_my_fellow_record",{
        p_profile_key:profileKey
      });

      const {data}=await supabase.rpc("get_my_fellow_certificate",{
        p_profile_key:profileKey
      });

      if(alive){
        setCertificate(data||null);
        setLoading(false);
      }
    };

    load();

    return()=>{
      alive=false;
    };
  },[profileKey,session?.user?.id,isAdmin]);

  // Public visitors see no certificate controls.
  if(!session?.user) return null;
  if(loading) return null;
  if(!certificate) return null;

  return (
    <div
      style={{
        marginTop:22,
        paddingTop:18,
        borderTop:"1px solid var(--brd)"
      }}
    >
      <div
        style={{
          fontFamily:"'Figtree',sans-serif",
          fontSize:10,
          fontWeight:700,
          color:"#5A5956",
          letterSpacing:".12em",
          textTransform:"uppercase",
          marginBottom:6
        }}
      >
        Certificate of Completion
      </div>

      <div
        style={{
          fontFamily:"'Figtree',sans-serif",
          fontSize:12.5,
          color:"#5A5956"
        }}
      >
        {certificate.public_code}
      </div>

      <CertificateActions
        certificate={certificate}
        compact
      />
    </div>
  );
}
