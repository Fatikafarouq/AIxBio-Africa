import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { PageHdr, Sec, Ey, H2, Txt } from "./CoursePrimitives";

export default function CertificateVerificationPage({ code, go }) {
  const [record,setRecord]=useState(undefined);
  const [error,setError]=useState("");

  useEffect(()=>{
    let alive=true;
    supabase.rpc("verify_certificate",{p_public_code:code}).then(({data,error:e})=>{
      if(!alive)return;
      if(e){setError(e.message||"Could not verify this certificate.");setRecord(null);}
      else setRecord(data||null);
    });
    return()=>{alive=false;};
  },[code]);

  const valid=record?.valid===true;

  return (
    <>
      <PageHdr
        label="Certificate Verification"
        title="AIxBio Africa Credential Verification"
        sub="Verify an AIxBio Africa course or fellowship certificate."
      />

      <Sec bg="#fff">
        <div style={{ maxWidth:720 }}>
          {record===undefined&&!error&&<Txt muted>Checking certificate…</Txt>}

          {error&&<div className="err">{error}</div>}

          {record===null&&!error&&(
            <div style={{ border:"1px solid var(--brd)",padding:"28px",background:"#F7F6F2" }}>
              <Ey label="Not Found"/>
              <H2 s={{marginBottom:10}}>Certificate not found</H2>
              <Txt muted>No AIxBio Africa certificate matches the code you entered.</Txt>
            </div>
          )}

          {record&&(
            <div style={{ border:"1px solid var(--brd)",padding:"30px",background:"#F7F6F2" }}>
              <Ey label={valid?"Verified":"Certificate Status"}/>

              <H2 s={{
                marginBottom:12,
                color:valid?"#1A6B46":"#B8102A"
              }}>
                {valid
                  ? "Valid Certificate ✓"
                  : "This certificate is no longer valid."
                }
              </H2>

              {valid?(
                <div
                  style={{
                    display:"grid",
                    gridTemplateColumns:"1fr 1fr",
                    gap:16,
                    marginTop:22
                  }}
                  className="g2"
                >
                  <div>
                    <div style={{
                      fontSize:10,
                      fontWeight:700,
                      color:"#8A8884",
                      textTransform:"uppercase",
                      letterSpacing:".1em"
                    }}>
                      Recipient
                    </div>
                    <Txt s={{fontSize:14}}>{record.recipient_name}</Txt>
                  </div>

                  <div>
                    <div style={{
                      fontSize:10,
                      fontWeight:700,
                      color:"#8A8884",
                      textTransform:"uppercase",
                      letterSpacing:".1em"
                    }}>
                      Credential
                    </div>
                    <Txt s={{fontSize:14}}>Certificate of Completion</Txt>
                  </div>

                  <div>
                    <div style={{
                      fontSize:10,
                      fontWeight:700,
                      color:"#8A8884",
                      textTransform:"uppercase",
                      letterSpacing:".1em"
                    }}>
                      Programme
                    </div>
                    <Txt s={{fontSize:14}}>{record.program_name}</Txt>
                  </div>

                  <div>
                    <div style={{
                      fontSize:10,
                      fontWeight:700,
                      color:"#8A8884",
                      textTransform:"uppercase",
                      letterSpacing:".1em"
                    }}>
                      Issued
                    </div>
                    <Txt s={{fontSize:14}}>
                      {new Date(record.issued_at).toLocaleDateString()}
                    </Txt>
                  </div>

                  <div>
                    <div style={{
                      fontSize:10,
                      fontWeight:700,
                      color:"#8A8884",
                      textTransform:"uppercase",
                      letterSpacing:".1em"
                    }}>
                      Certificate ID
                    </div>
                    <Txt s={{fontSize:14}}>{record.public_code}</Txt>
                  </div>
                </div>
              ):(
                <Txt muted s={{fontSize:13.5,marginTop:10}}>
                  Certificate ID: {record.public_code}
                </Txt>
              )}
            </div>
          )}

          <button
            className="bo"
            onClick={()=>go("home")}
            style={{marginTop:24}}
          >
            ← AIxBio Africa
          </button>
        </div>
      </Sec>
    </>
  );
}
