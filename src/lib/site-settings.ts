import { cache } from "react";
import { mediaVersion } from "@/lib/image";
import {
  DEFAULT_SITE_SETTINGS,
  FALLBACK_HOME_HERO,
  type PublicSiteSettings,
} from "@/types/site-settings";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

// The hero is the LCP element on the homepage, so this sits on the critical
// render path. A minute of staleness is invisible to visitors and keeps the
// upstream call off all but one request per window.
const REVALIDATE_SECONDS = 60;

/**
 * Public site settings, resolved on the server.
 *
 * The homepage hero used to come from the client-side `SiteSettingsProvider`,
 * which meant the first paint always showed the bundled fallback and swapped to
 * the real image once the fetch landed — a visible flash, and a `priority`
 * preload spent on the wrong file. Reading it here instead puts the correct src
 * in the initial HTML.
 *
 * Memoized per request so a page body and its `generateMetadata` share one call.
 * Never throws: an unreachable API degrades to the bundled defaults rather than
 * taking down every route that renders the layout.
 */
export const fetchPublicSiteSettings = cache(
  async function fetchPublicSiteSettings(): Promise<PublicSiteSettings> {
    try {
      const response = await fetch(`${API_BASE_URL}/site-settings`, {
        next: { revalidate: REVALIDATE_SECONDS },
      });
      if (!response.ok) return DEFAULT_SITE_SETTINGS;
      const data = (await response.json()) as PublicSiteSettings;
      return {
        ...DEFAULT_SITE_SETTINGS,
        ...data,
        featuredCourseBullets: data.featuredCourseBullets?.length
          ? data.featuredCourseBullets
          : DEFAULT_SITE_SETTINGS.featuredCourseBullets,
        heroBadges: data.heroBadges?.length
          ? data.heroBadges
          : DEFAULT_SITE_SETTINGS.heroBadges,
      };
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  },
);

/**
 * The src to render for the homepage hero.
 *
 * The stored URL is presigned and unique per API call, so handing it to
 * `next/image` directly can never hit the optimizer's cache — and on a
 * DNS64/NAT64 network its upstream guard rejects the S3 host outright. This
 * returns the stable `/api/site-hero` address instead, which the optimizer can
 * cache against and re-encode; see that route for the full reasoning.
 */
export function homeHeroSrc(settings: PublicSiteSettings): string {
  const signedUrl = settings.homeHeroImageUrl?.trim();
  if (!signedUrl) return FALLBACK_HOME_HERO;

  const version = mediaVersion(signedUrl) ?? "0";
  return `/api/site-hero/${version}`;
}
