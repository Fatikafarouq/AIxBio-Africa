import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { courseMeta as participantMeta, courseModules as participantModules } from "./participantModules.js";
import { courseMeta as facilitatorMeta, courseModules as facilitatorModules } from "./facilitatorModules.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return Response.json({ error:"Sign in required." }, { status:401, headers:corsHeaders });

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global:{ headers:{ Authorization:authHeader } },
  });

  const { data:{ user }, error:userError } = await supabase.auth.getUser();
  if (userError || !user) return Response.json({ error:"Invalid session." }, { status:401, headers:corsHeaders });

  const body = req.method === "POST" ? await req.json().catch(()=>({})) : {};
  const requestedRole = body?.role === "facilitator" ? "facilitator" : "participant";

  const [{ data:adminRow }, { data:membership }] = await Promise.all([
    supabase.from("admins").select("user_id").eq("user_id",user.id).maybeSingle(),
    supabase.from("cohort_members").select("role,status,group_id,cohort_groups(id,name,timezone_label,cohort_id,cohorts(id,name,start_date,status),group_sessions(id,module_id,session_date))").eq("user_id",user.id).eq("status","accepted").maybeSingle(),
  ]);

  const isAdmin=Boolean(adminRow);
  if(!isAdmin && !membership) return Response.json({ error:"Your application is still under review.",code:"UNDER_REVIEW" },{status:403,headers:corsHeaders});
  if(!isAdmin && requestedRole!==membership.role) return Response.json({error:"You do not have access to this course role."},{status:403,headers:corsHeaders});

  const effectiveRole=isAdmin?requestedRole:membership.role;
  const payload=effectiveRole==="facilitator"
    ? {role:"facilitator",courseMeta:facilitatorMeta,courseModules:facilitatorModules}
    : {role:"participant",courseMeta:participantMeta,courseModules:participantModules};

  return Response.json({...payload,group:isAdmin?null:membership?.cohort_groups??null,preview:isAdmin},{
    headers:{...corsHeaders,"Cache-Control":"private, no-store"},
  });
});

