
import { supabase } from "./lib/supabase";
import { Txt } from "./course/CoursePrimitives";

const emptyForm = {
  title: "",
  research_question: "",
  short_description: "",
  research_areas: "",
  external_url: "",
};

const normal = value => (value ?? "").toString().trim();
const normalAreas = value =>
  (Array.isArray(value) ? value : [])
    .map(x => normal(x))
    .filter(Boolean);

export default function FellowPublicationUpdateControls({ profileKey, session }) {
  const [checked,setChecked] = useState(false);
  const [isOwner,setIsOwner] = useState(false);
  const [publications,setPublications] = useState([]);
  const [requests,setRequests] = useState([]);
  const [selectedId,setSelectedId] = useState("");
  const [editing,setEditing] = useState(false);
  const [form,setForm] = useState(emptyForm);
  const [loading,setLoading] = useState(false);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState("");
  const [notice,setNotice] = useState("");

  const selected = useMemo(
    () => publications.find(p => p.id === selectedId) || null,
    [publications, selectedId]
  );

  const pendingForSelected = useMemo(
    () => requests.find(r => r.publication_id === selectedId && r.status === "pending") || null,
    [requests, selectedId]
  );

  const load = async () => {
    setChecked(false);

    if (!session?.user || !profileKey) {
      setChecked(true);
      setIsOwner(false);
      setPublications([]);
      setRequests([]);
      return;
    }

    setLoading(true);
    setError("");

    const { data: claim, error: claimError } = await supabase.rpc(
      "claim_my_fellow_record",
      { p_profile_key: profileKey }
    );

    if (claimError || !claim?.owner) {
      setIsOwner(false);
      setPublications([]);
      setRequests([]);
      setChecked(true);
      setLoading(false);
      return;
    }

    setIsOwner(true);

    const [pubResult, requestResult] = await Promise.all([
      supabase.rpc("get_my_fellow_publications", { p_profile_key: profileKey }),
      supabase.rpc("get_my_publication_update_requests"),
    ]);

    if (pubResult.error) {
      setError(pubResult.error.message || "Could not load your publications.");
      setPublications([]);
    } else {
      const rows = Array.isArray(pubResult.data) ? pubResult.data : [];
      setPublications(rows);
      setSelectedId(current =>
        current && rows.some(row => row.id === current)
          ? current
          : (rows[0]?.id || "")
      );
    }

    if (requestResult.error) {
      setError(current => current || requestResult.error.message || "Could not load your update requests.");
      setRequests([]);
    } else {
      setRequests(Array.isArray(requestResult.data) ? requestResult.data : []);
    }

    setChecked(true);
    setLoading(false);
  };

  useEffect(() => {
    let alive = true;

    const run = async () => {
      if (!alive) return;
      await load();
    };

    run();
    return () => { alive = false; };
  }, [session?.user?.id, profileKey]);

  useEffect(() => {
    if (!selected) {
      setForm(emptyForm);
      setEditing(false);
      return;
    }

    setForm({
      title: selected.title || "",
      research_question: selected.research_question || "",
      short_description: selected.short_description || "",
      research_areas: normalAreas(selected.research_areas).join(", "),
      external_url: selected.external_url || "",
    });
    setEditing(false);
    setError("");
    setNotice("");
  }, [selectedId, selected?.id]);

  const update = key => event =>
    setForm(current => ({ ...current, [key]: event.target.value }));

  const beginEditing = () => {
    if (!selected) return;
    const proposed = pendingForSelected?.proposed_changes || {};
    setForm({
      title: proposed.title ?? selected.title ?? "",
      research_question: proposed.research_question ?? selected.research_question ?? "",
      short_description: proposed.short_description ?? selected.short_description ?? "",
      research_areas: Array.isArray(proposed.research_areas)
        ? proposed.research_areas.join(", ")
        : normalAreas(selected.research_areas).join(", "),
      external_url: proposed.external_url ?? selected.external_url ?? "",
    });
    setError("");
    setNotice("");
    setEditing(true);
  };

  const submit = async () => {
    if (!selected) return;

    setError("");
    setNotice("");

    if (!normal(form.title)) {
      setError("The publication title cannot be empty.");
      return;
    }

    const currentAreas = normalAreas(selected.research_areas);
    const proposedAreas = form.research_areas
      .split(",")
      .map(x => normal(x))
      .filter(Boolean);

    const changes = {};

    if (normal(form.title) !== normal(selected.title)) {
      changes.title = normal(form.title);
    }
    if (normal(form.research_question) !== normal(selected.research_question)) {
      changes.research_question = normal(form.research_question);
    }
    if (normal(form.short_description) !== normal(selected.short_description)) {
      changes.short_description = normal(form.short_description);
    }
    if (JSON.stringify(proposedAreas) !== JSON.stringify(currentAreas)) {
      changes.research_areas = proposedAreas;
    }
    if (normal(form.external_url) !== normal(selected.external_url)) {
      changes.external_url = normal(form.external_url);
    }

    if (!Object.keys(changes).length) {
      setError("No changes have been made.");
      return;
    }

    setSaving(true);
    const { error: saveError } = await supabase.rpc(
      "request_my_publication_update",
      {
        p_publication_id: selected.id,
        p_proposed_changes: changes,
      }
    );

    if (saveError) {
      setError(saveError.message || "Could not submit your update request.");
      setSaving(false);
      return;
    }

    setNotice("Your update request has been submitted for AIxBio Africa review.");
    setEditing(false);
    setSaving(false);
    await load();
  };

  if (!session?.user || !checked || !isOwner) return null;

  if (loading) {
    return (
      <div style={{ marginTop:20,paddingTop:18,borderTop:"1px solid var(--brd)" }}>
        <Txt muted s={{ fontSize:12.5 }}>Loading your publication controls…</Txt>
      </div>
    );
  }

  if (!publications.length) return null;

  return (
    <div style={{ marginTop:22,paddingTop:20,borderTop:"1px solid var(--brd)" }}>
      <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:10,fontWeight:700,color:"#5A5956",letterSpacing:".12em",textTransform:"uppercase",marginBottom:8 }}>
        Your Fellowship Publication
      </div>

      {publications.length > 1 && (
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          style={{ marginBottom:12 }}
        >
          {publications.map(p => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      )}

      {selected && (
        <>
          <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:"#1A1917",lineHeight:1.35,marginBottom:10 }}>
            {selected.title}
          </div>

          {pendingForSelected ? (
            <div style={{ background:"#F7F6F2",border:"1px solid var(--brd)",padding:"14px 16px" }}>
              <div style={{ fontFamily:"'Figtree',sans-serif",fontSize:10,fontWeight:700,color:"#986812",letterSpacing:".1em",textTransform:"uppercase",marginBottom:6 }}>
                Update pending review
              </div>
              <Txt muted s={{ fontSize:12.5,lineHeight:1.6 }}>
                You already have a pending update request for this publication. You can revise and resubmit it below if needed.
              </Txt>
              <button className="bo" style={{ marginTop:12 }} onClick={beginEditing}>
                Revise Request
              </button>
            </div>
          ) : !editing ? (
            <button className="bo" onClick={beginEditing}>
              Request an Update
            </button>
          ) : null}

          {editing && (
            <div style={{ marginTop:16,background:"#F7F6F2",border:"1px solid var(--brd)",padding:"18px" }}>
              <Txt muted s={{ fontSize:12.5,lineHeight:1.65,marginBottom:16 }}>
                Submit only the changes you want made to your published project. Nothing changes publicly until AIxBio Africa reviews and approves the request.
              </Txt>

              <div style={{ marginBottom:12 }}>
                <label style={{ display:"block",fontSize:10.5,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6 }}>Title</label>
                <input value={form.title} onChange={update("title")}/>
              </div>

              <div style={{ marginBottom:12 }}>
                <label style={{ display:"block",fontSize:10.5,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6 }}>Research Question</label>
                <textarea value={form.research_question} onChange={update("research_question")} />
              </div>

              <div style={{ marginBottom:12 }}>
                <label style={{ display:"block",fontSize:10.5,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6 }}>Short Description</label>
                <textarea value={form.short_description} onChange={update("short_description")} />
              </div>

              <div style={{ marginBottom:12 }}>
                <label style={{ display:"block",fontSize:10.5,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6 }}>Research Areas</label>
                <input
                  value={form.research_areas}
                  onChange={update("research_areas")}
                  placeholder="Comma-separated"
                />
              </div>

              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block",fontSize:10.5,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6 }}>External Link</label>
                <input value={form.external_url} onChange={update("external_url")} />
              </div>

              {error && <div className="err" style={{ marginBottom:10 }}>{error}</div>}
              {notice && <div style={{ fontSize:12.5,fontWeight:600,color:"#356B47",marginBottom:10 }}>{notice}</div>}

              <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                <button className="br" disabled={saving} onClick={submit}>
                  {saving ? "Submitting…" : pendingForSelected ? "Resubmit Request" : "Submit Request"}
                </button>
                <button className="bo" disabled={saving} onClick={() => {
                  setEditing(false);
                  setError("");
                  setNotice("");
                  setForm({
                    title: selected.title || "",
                    research_question: selected.research_question || "",
                    short_description: selected.short_description || "",
                    research_areas: normalAreas(selected.research_areas).join(", "),
                    external_url: selected.external_url || "",
                  });
                }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!editing && notice && (
            <div style={{ fontSize:12.5,fontWeight:600,color:"#356B47",marginTop:10 }}>{notice}</div>
          )}
          {!editing && error && <div className="err" style={{ marginTop:10 }}>{error}</div>}
        </>
      )}
    </div>
  );
