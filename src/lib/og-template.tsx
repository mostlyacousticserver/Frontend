import { ImageResponse } from "next/og";
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH, truncate } from "@/lib/seo";
import { BRAND_COLOR, SITE_NAME } from "@/lib/site-config";

export const OG_SIZE = { width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT };
export const OG_CONTENT_TYPE = "image/png";

type OgTemplateInput = {
  /** Small uppercase label above the title, e.g. "Course" or "Chord sheet". */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Short facts rendered as pills, e.g. ["Beginner", "42 lessons"]. */
  meta?: string[];
};

/**
 * Shared social-card renderer.
 *
 * `next/og` only bundles a single font weight, so hierarchy here comes from
 * size, colour, and opacity rather than bold/regular contrast.
 */
export function renderOgImage({ eyebrow, title, subtitle, meta = [] }: OgTemplateInput) {
  const headline = truncate(title, 88);
  const supporting = subtitle ? truncate(subtitle, 150) : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0E1113",
          backgroundImage:
            "radial-gradient(1000px 520px at 88% -12%, rgba(17,197,187,0.30), transparent 60%), radial-gradient(760px 460px at -10% 112%, rgba(17,197,187,0.14), transparent 60%)",
          color: "#FFFFFF",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {eyebrow ? (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 999,
                  background: BRAND_COLOR,
                }}
              />
              <div
                style={{
                  fontSize: 24,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: BRAND_COLOR,
                }}
              >
                {eyebrow}
              </div>
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              fontSize: headline.length > 52 ? 60 : 74,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              maxWidth: 960,
            }}
          >
            {headline}
          </div>

          {supporting ? (
            <div
              style={{
                display: "flex",
                fontSize: 28,
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.68)",
                maxWidth: 900,
              }}
            >
              {supporting}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 32,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: BRAND_COLOR,
                color: "#0E1113",
                fontSize: 30,
              }}
            >
              M
            </div>
            <div style={{ display: "flex", fontSize: 30, letterSpacing: "-0.01em" }}>
              {SITE_NAME}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            {meta.slice(0, 3).map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  fontSize: 22,
                  padding: "10px 20px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.86)",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
