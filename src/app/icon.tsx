import { ImageResponse } from "next/og";
import { BRAND_BACKGROUND, BRAND_COLOR } from "@/lib/site-config";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** Maskable-safe app icon: the glyph stays inside the central 80% safe zone. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(140deg, ${BRAND_COLOR} 0%, #0DA694 100%)`,
          color: BRAND_BACKGROUND,
          fontSize: 300,
          letterSpacing: "-0.05em",
        }}
      >
        M
      </div>
    ),
    size,
  );
}
