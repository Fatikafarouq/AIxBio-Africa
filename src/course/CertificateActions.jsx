import { useState } from "react";
import { supabase } from "../lib/supabase";

const getSignedUrl = async certificateId => {
  const { data, error } = await supabase.functions.invoke("certificate-file", {
    body: { action:"get-url", certificate_id:certificateId }
  });
  if (error) throw new Error(data?.error || error.message || "Could not open certificate.");
  if (!data?.signed_url) throw new Error("Certificate file is not available yet.");
  return data.signed_url;
};

export default function CertificateActions({ certificate, compact=false }) {
  const [busy,setBusy]=useState("");
  const [error,setError]=useState("");

  if (!certificate || certificate.status !== "issued") return null;

  const view=async()=>{
    setBusy("view"); setError("");
    try{
      const url=await getSignedUrl(certificate.id);
      window.open(url,"_blank","noopener,noreferrer");
    }catch(e){ setError(e.message||"Could not open certificate."); }
    finally{ setBusy(""); }
  };

  const download=async()=>{
    setBusy("download"); setError("");
    try{
      const url=await getSignedUrl(certificate.id);
      const response=await fetch(url);
      if(!response.ok) throw new Error("Could not download certificate.");
      const blob=await response.blob();
      const objectUrl=URL.createObjectURL(blob);
      const a=document.createElement("a");
      a.href=objectUrl;
      a.download=`AIxBio-${certificate.public_code || "Certificate"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    }catch(e){ setError(e.message||"Could not download certificate."); }
    finally{ setBusy(""); }
  };

  return (
    <div style={{ marginTop:compact?12:18 }}>
      <div style={{ display:"flex",gap:9,flexWrap:"wrap" }}>
        <button className="bo" onClick={view} disabled={Boolean(busy)}>
          {busy==="view"?"Opening…":"View Certificate"}
        </button>
        <button className="br" onClick={download} disabled={Boolean(busy)}>
          {busy==="download"?"Downloading…":"Download Certificate"}
        </button>
      </div>
      {error&&<div className="err" style={{ marginTop:10 }}>{error}</div>}
    </div>
  );
}
