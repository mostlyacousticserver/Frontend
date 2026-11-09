import { renderOgImage } from "@/lib/og-template";

// Cards are deterministic per URL, so they can be cached hard at the edge.
export const revalidate = 86400;

/** Brand fallback card used by any page without its own artwork. */
export function GET() {
  return renderOgImage({
    eyebrow: "Learn guitar online",
    title: "Play real songs on acoustic guitar",
    subtitle:
      "Structured video courses, free chord sheets with lyrics, and practice routines that actually build progress.",
    meta: ["Beginner to pro", "Lifetime access"],
  });
}
