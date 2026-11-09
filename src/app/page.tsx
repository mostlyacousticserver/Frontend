import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import { JsonLd } from "@/components/seo/JsonLd";
import { homeJsonLd } from "@/lib/json-ld";
import { buildPageMetadata, DEFAULT_DESCRIPTION, SITE_KEYWORDS } from "@/lib/seo";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site-config";
import { fetchPublicSiteSettings, homeHeroSrc } from "@/lib/site-settings";

export const metadata: Metadata = {
  ...buildPageMetadata({
    ogTitle: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
    path: "/",
    image: "/og",
    imageAlt: `${SITE_NAME} — ${SITE_TAGLINE}`,
    keywords: [...SITE_KEYWORDS],
  }),
  // The homepage carries the full brand title rather than the `%s | Site`
  // template, so it reads as the entity name in SERPs.
  title: { absolute: `${SITE_NAME} — ${SITE_TAGLINE}` },
};

export default async function HomeRoutePage() {
  // Resolved here rather than in the client `SiteSettingsProvider` so the hero
  // — the LCP element — is correct in the first paint and gets the `priority`
  // preload, instead of rendering the fallback and swapping once a fetch lands.
  const settings = await fetchPublicSiteSettings();

  return (
    <>
      <JsonLd data={homeJsonLd(DEFAULT_DESCRIPTION)} id="ld-home" />
      <HomePage heroSrc={homeHeroSrc(settings)} />
    </>
  );
}
