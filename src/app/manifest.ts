import type { MetadataRoute } from "next";
import {
  BRAND_BACKGROUND,
  BRAND_COLOR,
  DEFAULT_DESCRIPTION,
  SITE_LANG,
  SITE_NAME,
  SITE_SHORT_NAME,
} from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_SHORT_NAME,
    description: DEFAULT_DESCRIPTION,
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: BRAND_BACKGROUND,
    theme_color: BRAND_COLOR,
    lang: SITE_LANG,
    dir: "ltr",
    categories: ["education", "music", "lifestyle"],
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
    shortcuts: [
      { name: "Browse courses", url: "/courses" },
      { name: "Chord sheets", url: "/songs" },
      { name: "Blog", url: "/blog" },
    ],
  };
}
