import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { PageHdr, Sec, Ey, H2, Txt } from "./course/CoursePrimitives";

const TYPE_LABELS = {
  pdf: "PDF",
  docx: "Word document",
  github: "GitHub project",
  website: "Website",
  tool: "Tool",
  dataset: "Dataset",
  summary: "Summary",
  other: "Output",
};

const SECTION_META = {
  fellowship: {
    eyebrow: "Fellowship",
    title: "Fellowship Publications",
    description:
      "Research and project outputs produced through the AIxBio Africa Research Fellowship.",
  },
  capstone: {
    eyebrow: "Course Capstones",
    title: "Capstone Outputs",
    description:
      "Selected work produced by participants completing AIxBio Africa courses.",
  },
  other: {
    eyebrow: "AIxBio Africa",
    title: "Other Outputs",
    description:
      "Reports, tools, datasets, collaborative work, and other outputs produced through AIxBio Africa.",
  },
};

const externalLabel = type => {
  if (type === "github") return "View GitHub Project";
  if (type === "website") return "Visit Website";
  if (type === "tool") return "Open Tool";
  if (type === "dataset") return "View Dataset";
  return "View External Output";
};

const PublicationCard = ({ item }) => {
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState("");

  const openFile = async () => {
    setOpening(true);
    setError("");

    try {
      const { data, error: invokeError } = await supabase.functions.invoke(
        "publication-file",
        {
          body: { publication_id: item.id },
        }
      );

      if (invokeError) {
        throw new Error(
          data?.error || invokeError.message || "Could not open this file."
        );
      }

      if (!data?.signed_url) {
        throw new Error("This file is not available right now.");
      }

      window.open(data.signed_url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setError(e?.message || "Could not open this file.");
    } finally {
      setOpening(false);
    }
  };

  return (
    <article
      className="lft"
      style={{
        background: "#fff",
        border: "1px solid var(--brd)",
        padding: "26px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 14,
        }}
      >
        <span className="tag tl">
          {TYPE_LABELS[item.output_type] || "Output"}
        </span>

        {item.featured && <span className="tag tr">Featured</span>}

        {item.cohort_label && (
          <span
            style={{
              fontFamily: "'Figtree',sans-serif",
              fontSize: 11.5,
              color: "#8A8884",
            }}
          >
            {item.cohort_label}
          </span>
        )}
      </div>

      <h3
        style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: 25,
          fontWeight: 600,
          lineHeight: 1.18,
          color: "#1A1917",
          marginBottom: 7,
        }}
      >
        {item.title}
      </h3>

      <div
        style={{
          fontFamily: "'Figtree',sans-serif",
          fontSize: 12.5,
          fontWeight: 600,
          color: "#5A5956",
          marginBottom: 16,
        }}
      >
        {item.author_name}
      </div>

      {item.research_question && (
        <div
          style={{
            padding: "14px 0",
            borderTop: "1px solid var(--brd)",
            borderBottom: "1px solid var(--brd)",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontFamily: "'Figtree',sans-serif",
              fontSize: 9.5,
              fontWeight: 700,
              color: "#B8102A",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Research Question
          </div>

          <p
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 18,
              fontWeight: 600,
              lineHeight: 1.45,
              color: "#2E2C2A",
            }}
          >
            {item.research_question}
          </p>
        </div>
      )}

      {item.short_description && (
        <Txt
          muted
          s={{
            fontSize: 13.5,
            lineHeight: 1.72,
            marginBottom: 16,
          }}
        >
          {item.short_description}
        </Txt>
      )}

      {Array.isArray(item.research_areas) &&
        item.research_areas.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            {item.research_areas.map(area => (
              <span
                key={area}
                className="tag"
                style={{
                  background: "#F2F0EC",
                  color: "#5A5956",
                }}
              >
                {area}
              </span>
            ))}
          </div>
        )}

      <div
        style={{
          marginTop: "auto",
          paddingTop: 4,
          display: "flex",
          gap: 9,
          flexWrap: "wrap",
        }}
      >
        {item.has_file && (
          <button
            className="br"
            onClick={openFile}
            disabled={opening}
          >
            {opening
              ? "Opening…"
              : item.output_type === "docx"
                ? "Open Document"
                : "Open Publication"}
          </button>
        )}

        {item.external_url && (
          <a
            className="bo"
            href={item.external_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            {externalLabel(item.output_type)} ↗
          </a>
        )}
      </div>

      {error && (
        <div
          className="err"
          style={{
            marginTop: 10,
          }}
        >
          {error}
        </div>
      )}
    </article>
  );
};

export default function PublicationsPage({
  go,
  onVisibilityChange,
}) {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setLoading(true);
      setError("");

      const [
        { data: status, error: statusError },
        { data: list, error: listError },
      ] = await Promise.all([
        supabase.rpc("get_publications_page_status"),
        supabase.rpc("list_public_publications"),
      ]);

      if (!alive) return;

      if (statusError) {
        setError(
          statusError.message || "Could not load Publications."
        );
        setVisible(false);
        setLoading(false);
        return;
      }

      const isVisible = Boolean(status);

      setVisible(isVisible);
      onVisibilityChange?.(isVisible);

      if (!isVisible) {
        setItems([]);
        setLoading(false);
        return;
      }

      if (listError) {
        setError(
          listError.message || "Could not load published outputs."
        );
      }

      setItems(Array.isArray(list) ? list : []);
      setLoading(false);
    };

    load();

    return () => {
      alive = false;
    };
  }, [onVisibilityChange]);

  useEffect(() => {
    if (!loading && visible === false) {
      go("home");
    }
  }, [loading, visible, go]);

  if (loading || visible === false) return null;

  const grouped = {
    fellowship: items.filter(
      x => x.programme_type === "fellowship"
    ),
    capstone: items.filter(
      x => x.programme_type === "capstone"
    ),
    other: items.filter(
      x => x.programme_type === "other"
    ),
  };

  const hasAny = items.length > 0;

  return (
    <>
      <PageHdr
        label="Publications"
        title="Publications & Outputs"
        sub="Work produced through AIxBio Africa's fellowships, courses, and wider research activities."
      />

      <Sec bg="#fff">
        <div
          style={{
            maxWidth: 800,
            marginBottom: 48,
          }}
        >
          <Ey label="AIxBio Africa Outputs" />

          <H2
            s={{
              marginBottom: 12,
            }}
          >
            Work emerging from our programs
          </H2>

          <Txt
            muted
            s={{
              fontSize: 15,
              lineHeight: 1.78,
            }}
          >
            This library brings together fellowship research,
            course Capstone outputs, tools, reports, and other
            work produced through AIxBio Africa. Output types are
            labelled clearly so that project work is not presented
            as peer-reviewed research unless it is actually
            published as such.
          </Txt>
        </div>

        {error && (
          <div
            className="err"
            style={{
              marginBottom: 24,
            }}
          >
            {error}
          </div>
        )}

        {!hasAny && !error && (
          <div
            style={{
              borderTop: "1px solid var(--brd)",
              paddingTop: 24,
            }}
          >
            <H2
              s={{
                fontSize: 25,
                marginBottom: 8,
              }}
            >
              No outputs published yet
            </H2>

            <Txt muted>
              Published work will appear here when it is ready.
            </Txt>
          </div>
        )}

        {Object.entries(grouped).map(
          ([key, sectionItems]) => {
            if (!sectionItems.length) return null;

            const meta = SECTION_META[key];

            return (
              <section
                key={key}
                style={{
                  padding: "40px 0",
                  borderTop: "1px solid var(--brd)",
                }}
              >
                <div
                  style={{
                    maxWidth: 720,
                    marginBottom: 24,
                  }}
                >
                  <Ey label={meta.eyebrow} />

                  <H2
                    s={{
                      marginBottom: 8,
                    }}
                  >
                    {meta.title}
                  </H2>

                  <Txt
                    muted
                    s={{
                      fontSize: 13.5,
                    }}
                  >
                    {meta.description}
                  </Txt>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(2,minmax(0,1fr))",
                    gap: 18,
                  }}
                  className="g2"
                >
                  {sectionItems.map(item => (
                    <PublicationCard
                      key={item.id}
                      item={item}
                    />
                  ))}
                </div>
              </section>
            );
          }
        )}
      </Sec>
    </>
  );
}
