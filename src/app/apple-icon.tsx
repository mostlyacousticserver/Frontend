import { ImageResponse } from "next/og";
import { BRAND_BACKGROUND, BRAND_COLOR } from "@/lib/site-config";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS masks the corners itself, so this stays a filled square. */
export default function AppleIcon() {
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
          fontSize: 108,
          letterSpacing: "-0.05em",
        }}
      >
        M
      </div>
    ),
    size,
  );
}
