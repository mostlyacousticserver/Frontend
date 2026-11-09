import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SongsView } from "@/components/songs/SongsView";
import { BreadcrumbBar } from "@/components/seo/BreadcrumbBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { collectionPageJsonLd } from "@/lib/json-ld";
import { fetchPublishedSongs } from "@/lib/public-song";
import { buildPageMetadata, stableImageUrl } from "@/lib/seo";
import { publicMediaUrl } from "@/lib/song-utils";
import { SITE_NAME } from "@/lib/site-config";

export const revalidate = 3600;

const PAGE_SIZE = 10;
const DESCRIPTION = `Free guitar chord sheets with lyrics, capo positions, strumming notes, and tabs from ${SITE_NAME}. Browse by genre and difficulty, then start playing.`;

export const metadata: Metadata = buildPageMetadata({
  title: "Free Guitar Chords & Lyrics",
  description: DESCRIPTION,
  path: "/songs",
  image: "/og",
  keywords: [
    "guitar chords",
    "free chord sheets",
    "guitar tabs with lyrics",
    "easy guitar songs",
  ],
});

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Songs", path: "/songs" },
];

export default async function SongsRoutePage() {
  const { items, total } = await fetchPublishedSongs({ page: 1, limit: PAGE_SIZE });

  return (
    <main id="main-content" className="min-h-screen overflow-x-clip bg-white">
      <JsonLd
        id="ld-songs"
        data={collectionPageJsonLd({
          path: "/songs",
          name: `Guitar chord sheets by ${SITE_NAME}`,
          description: DESCRIPTION,
          breadcrumbLabel: "Songs",
          items: items.map((song) => ({
            name: `${song.title} — ${song.artist}`,
            path: `/songs/${song.slug}`,
            image: stableImageUrl(publicMediaUrl(song.heroImageUrl)),
          })),
        })}
      />
      <Navbar variant="light" />
      <BreadcrumbBar items={BREADCRUMBS} />
      <SongsView initialSongs={items} initialTotal={total} />
      <Footer />
    </main>
  );
}
