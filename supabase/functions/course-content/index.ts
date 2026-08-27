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
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");

  if (!authHeader) {
    return Response.json(
      { error: "Sign in required." },
      { status: 401, headers: corsHeaders }
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    }
  );

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return Response.json(
      { error: "Invalid session." },
      { status: 401, headers: corsHeaders }
    );
  }

  const body =
    req.method === "POST"
      ? await req.json().catch(() => ({}))
      : {};

  const requestedRole =
    body?.role === "facilitator"
      ? "facilitator"
      : "participant";

  const [
    { data: adminRow },
    { data: membership },
  ] = await Promise.all([
    supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle(),

    supabase
      .from("cohort_members")
      .select(`
        role,
        status,
        group_id,
        cohort_groups(
          id,
          name,
          timezone_label,
          cohort_id,
          cohorts(
            id,
            name,
            start_date,
            status
          ),
          group_sessions(
            id,
            module_id,
            session_date
          )
        )
      `)
      .eq("user_id", user.id)
      .eq("status", "accepted")
      .maybeSingle(),
  ]);

  const isAdmin = Boolean(adminRow);

  if (!isAdmin && !membership) {
    return Response.json(
      {
        error: "Your application is still under review.",
        code: "UNDER_REVIEW",
      },
      {
        status: 403,
        headers: corsHeaders,
      }
    );
  }

  if (
    !isAdmin &&
    requestedRole !== membership?.role
  ) {
    return Response.json(
      {
        error:
          "You do not have access to this course role.",
      },
      {
        status: 403,
        headers: corsHeaders,
      }
    );
  }

  const effectiveRole = isAdmin
    ? requestedRole
    : membership!.role;

  /*
   * FACILITATOR
   *
   * Facilitators receive their complete facilitator guide.
   * Attendance and module unlocking are handled by the
   * existing secure RPC functions.
   */
  if (effectiveRole === "facilitator") {
    return Response.json(
      {
        role: "facilitator",
        courseMeta: facilitatorMeta,
        courseModules: facilitatorModules,
        group: isAdmin
          ? null
          : membership?.cohort_groups ?? null,
        preview: isAdmin,
      },
      {
        headers: {
          ...corsHeaders,
          "Cache-Control": "private, no-store",
        },
      }
    );
  }

  /*
   * ADMIN PARTICIPANT PREVIEW
   *
   * Admins can preview the entire participant course
   * without needing to belong to a participant group.
   */
  if (isAdmin) {
    const previewModules =
      participantModules.map((module) => ({
        ...module,
        locked: false,
      }));

    return Response.json(
      {
        role: "participant",
        courseMeta: participantMeta,
        courseModules: previewModules,

        progress: {
          sessions_present: 0,
          exercises_required: 0,
          exercises_completed: 0,
          capstone_unlocked: true,
          capstone_submission: null,
        },

        capstone: {
          ...participantCapstone,
          locked: false,
        },

        group: null,
        preview: true,
      },
      {
        headers: {
          ...corsHeaders,
          "Cache-Control": "private, no-store",
        },
      }
    );
  }

  /*
   * PARTICIPANT COURSE STATE
   *
   * Supabase determines which modules are unlocked,
   * participant attendance/exercise progress, and
   * Capstone eligibility.
   */
  const {
    data: courseState,
    error: stateError,
  } = await supabase.rpc("get_my_course_state");

  if (stateError || !courseState) {
    console.error(
      "Could not load participant course state:",
      stateError
    );

    return Response.json(
      {
        error:
          "We could not load your course progress. Please try again.",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }

  const unlockedModules = new Set(
    (courseState.unlocked_modules ?? [1]).map(
      (id: number | string) => Number(id)
    )
  );

  /*
   * IMPORTANT:
   *
   * Do not send the contents of locked modules to the browser.
   *
   * Locked modules only receive enough information for the
   * participant dashboard to display their title and status.
   */
  const protectedModules =
    participantModules.map((module) => {
      const unlocked =
        unlockedModules.has(module.id);

      if (unlocked) {
        return {
          ...module,
          locked: false,
        };
      }

      return {
        id: module.id,
        slug: module.slug,
        title: module.title,
        overview: module.overview,
        locked: true,
      };
    });

  const capstoneUnlocked = Boolean(
    courseState.capstone_unlocked
  );

  /*
   * Just like modules, don't send the full Capstone
   * instructions until the participant is eligible.
   */
  const capstone = capstoneUnlocked
    ? {
        ...participantCapstone,
        locked: false,
      }
    : {
        title: participantCapstone.title,
        overview: participantCapstone.overview,
        locked: true,
      };

  const progress = {
    sessions_present:
      courseState.sessions_present ?? 0,

    exercises_required:
      courseState.exercises_required ?? 0,

    exercises_completed:
      courseState.exercises_completed ?? 0,

    capstone_unlocked:
      capstoneUnlocked,

    capstone_submission:
      courseState.capstone_submission ?? null,
  };

  return Response.json(
    {
      role: "participant",
      courseMeta: participantMeta,
      courseModules: protectedModules,
      progress,
      capstone,

      group:
        membership?.cohort_groups ?? null,

      preview: false,
    },
    {
      headers: {
        ...corsHeaders,
        "Cache-Control": "private, no-store",
      },
    }
  );
});
