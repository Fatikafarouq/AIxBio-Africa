import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import {
  courseMeta as participantMeta,
  courseModules as participantModules,
  capstoneMeta as participantCapstone,
} from "./participantModules.js";

import {
  courseMeta as facilitatorMeta,
  courseModules as facilitatorModules,
} from "./facilitatorModules.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Membership = {
  id: string;
  role: "participant" | "facilitator";
  status: "accepted" | "completed";
  group_id: string;
  joined_at: string | null;
  completed_at: string | null;
  cohort_groups: any;
};

const membershipSummary = (m: Membership) => ({
  id: m.id,
  role: m.role,
  status: m.status,
  group_id: m.group_id,
  joined_at: m.joined_at,
  completed_at: m.completed_at,
  group_name: m.cohort_groups?.name ?? null,
  cohort_id: m.cohort_groups?.cohort_id ?? null,
  cohort_name: m.cohort_groups?.cohorts?.name ?? null,
  cohort_status: m.cohort_groups?.cohorts?.status ?? null,
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return Response.json({ error: "Sign in required." }, { status: 401, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return Response.json({ error: "Invalid session." }, { status: 401, headers: corsHeaders });
  }

  const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
  const requestedRole = body?.role === "facilitator" ? "facilitator" : "participant";
  const requestedMembershipId = typeof body?.membershipId === "string" ? body.membershipId : null;

  const [{ data: adminRow }, { data: membershipRows, error: membershipError }] = await Promise.all([
    supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle(),
    supabase
      .from("cohort_members")
      .select(`
        id,
        role,
        status,
        group_id,
        joined_at,
        completed_at,
        cohort_groups(
          id,
          name,
          timezone_label,
          meeting_url,
          session_duration_minutes,
          delivery_status,
          delivery_completed_at,
          cohort_id,
          cohorts(id,name,start_date,status),
          group_sessions(id,module_id,session_date)
        )
      `)
      .eq("user_id", user.id)
      .in("status", ["accepted", "completed"])
      .order("joined_at", { ascending: false }),
  ]);

  const isAdmin = Boolean(adminRow);
  if (membershipError && !isAdmin) {
    return Response.json({ error: "We could not load your course access." }, { status: 500, headers: corsHeaders });
  }

  const allMemberships = (membershipRows ?? []) as Membership[];
  const roleMemberships = allMemberships
    .filter((m) => m.role === requestedRole)
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === "accepted" ? -1 : 1;
      return new Date(b.joined_at ?? 0).getTime() - new Date(a.joined_at ?? 0).getTime();
    });

  let membership: Membership | null = null;
  if (!isAdmin) {
    // A membership id is cached in sessionStorage by the browser. If the user
    // signs out and another test account signs in, that cached id may belong to
    // the previous account. Never turn that harmless stale cache into an access
    // failure: fall back to this user's current/most-recent membership.
    membership = requestedMembershipId
      ? roleMemberships.find((m) => m.id === requestedMembershipId) ?? roleMemberships[0] ?? null
      : roleMemberships[0] ?? null;

    if (!membership) {
      const hasAnyMembership = allMemberships.length > 0;
      return Response.json(
        {
          error: hasAnyMembership
            ? "You do not have access to this course role."
            : "Your application is still under review.",
          code: hasAnyMembership ? "ROLE_NOT_AVAILABLE" : "UNDER_REVIEW",
        },
        { status: 403, headers: corsHeaders },
      );
    }
  }

  if (requestedRole === "facilitator") {
    return Response.json(
      {
        role: "facilitator",
        courseMeta: facilitatorMeta,
        courseModules: facilitatorModules,
        group: isAdmin ? null : membership?.cohort_groups ?? null,
        memberships: roleMemberships.map(membershipSummary),
        selected_membership_id: membership?.id ?? null,
        preview: isAdmin,
      },
      { headers: { ...corsHeaders, "Cache-Control": "private, no-store" } },
    );
  }

  if (isAdmin) {
    return Response.json(
      {
        role: "participant",
        courseMeta: participantMeta,
        courseModules: participantModules.map((module) => ({ ...module, locked: false })),
        progress: {
          membership_id: null,
          membership_status: "preview",
          sessions_present: 6,
          sessions_total: 6,
          attendance_required: 4,
          attendance_requirement_met: true,
          exercises_required: 6,
          exercises_completed: 6,
          exercise_requirement_met: true,
          module6_attendance_recorded: true,
          capstone_unlocked: true,
          capstone: null,
          course_completed: false,
          certificate: null,
          preview: true,
        },
        capstone: { ...participantCapstone, locked: false },
        group: null,
        memberships: [],
        selected_membership_id: null,
        preview: true,
      },
      { headers: { ...corsHeaders, "Cache-Control": "private, no-store" } },
    );
  }

  const { data: courseState, error: stateError } = await supabase.rpc("get_my_course_state", {
    p_membership_id: membership!.id,
  });

  if (stateError || !courseState) {
    console.error("Could not load participant course state:", stateError);
    return Response.json(
      { error: "We could not load your course progress. Please try again." },
      { status: 500, headers: corsHeaders },
    );
  }

  const unlockedModules = new Set(
    (courseState.unlocked_modules ?? [1]).map((id: number | string) => Number(id)),
  );

  const protectedModules = participantModules.map((module) => {
    if (unlockedModules.has(module.id)) return { ...module, locked: false };
    return {
      id: module.id,
      slug: module.slug,
      title: module.title,
      overview: module.overview,
      locked: true,
    };
  });

  const capstoneUnlocked = Boolean(courseState.capstone_unlocked);
  const capstone = capstoneUnlocked
    ? { ...participantCapstone, locked: false }
    : { title: participantCapstone.title, overview: participantCapstone.overview, locked: true };

  return Response.json(
    {
      role: "participant",
      courseMeta: participantMeta,
      courseModules: protectedModules,
      progress: courseState,
      capstone,
      group: membership?.cohort_groups ?? null,
      memberships: roleMemberships.map(membershipSummary),
      selected_membership_id: membership?.id ?? null,
      preview: false,
    },
    { headers: { ...corsHeaders, "Cache-Control": "private, no-store" } },
  );
});
