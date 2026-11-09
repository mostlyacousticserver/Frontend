import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchSeoIndex } from "@/api/seo";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SongReader } from "@/components/songs/SongReader";
import { BreadcrumbBar } from "@/components/seo/BreadcrumbBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { songJsonLd } from "@/lib/json-ld";
import { fetchPublishedSong } from "@/lib/public-song";
import { buildPageMetadata, stableImageUrl } from "@/lib/seo";
import { publicMediaUrl } from "@/lib/song-utils";
import type { SongDetail } from "@/types/song";

/**
 * Prerender every published chord sheet at build time; unknown slugs still
 * render on demand, and a failed index call leaves the route dynamic.
 */
export async function generateStaticParams() {
  const index = await fetchSeoIndex();
  return index?.songs.map((song) => ({ slug: song.slug })) ?? [];
}

type SongPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Chord-sheet searches are overwhelmingly "<song> <artist> guitar chords", so
 * the generated copy mirrors that phrasing when the editor left it blank.
 */
function songSeoCopy(song: SongDetail) {
  const title = `${song.title} — ${song.artist} Guitar Chords`;
  const facts = [
    song.musicalKey ? `key of ${song.musicalKey}` : "",
    song.capoFret ? `capo on fret ${song.capoFret}` : "",
    song.defaultDifficulty ? `${song.defaultDifficulty} level` : "",
  ].filter(Boolean);

  const description =
    song.description?.trim() ||
    `Free guitar chords and lyrics for ${song.title} by ${song.artist}${
      facts.length ? ` — ${facts.join(", ")}` : ""
    }. Chord diagrams, strumming notes, and a printable chord sheet.`;

  return { title, description };
}

/**
 * A durable image URL for social cards and structured data; presigned hero
 * images expire within minutes, so those fall back to the generated card.
 */
function shareImage(song: SongDetail) {
  return stableImageUrl(publicMediaUrl(song.heroImageUrl)) ?? `/og/song/${song.slug}`;
}

export async function generateMetadata({
  params,
}: SongPageProps): Promise<Metadata> {
  const { slug } = await params;
  const song = await fetchPublishedSong(slug);

  if (!song) {
    return { title: "Song not found", robots: { index: false, follow: true } };
  }

  const { title, description } = songSeoCopy(song);

  return buildPageMetadata({
    title,
    description,
    path: `/songs/${song.slug}`,
    image: shareImage(song),
    imageAlt: `${song.title} by ${song.artist} — guitar chord sheet`,
    modifiedTime: song.updatedAt,
    keywords: [
      `${song.title} chords`,
      `${song.title} guitar chords`,
      `${song.artist} guitar`,
      ...(song.tags ?? []),
    ],
  });
}

export default async function SongDetailsPage({ params }: SongPageProps) {
  const { slug } = await params;
  const song = await fetchPublishedSong(slug);

  if (!song) notFound();

  const { description } = songSeoCopy(song);
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Songs", path: "/songs" },
    { name: `${song.title} — ${song.artist}`, path: `/songs/${song.slug}` },
  ];

  return (
    <main id="main-content" className="min-h-screen bg-white">
      <JsonLd
        id="ld-song"
        data={songJsonLd({
          title: song.title,
          artist: song.artist,
          description,
          path: `/songs/${song.slug}`,
          image: shareImage(song),
          musicalKey: song.musicalKey,
          genre: song.genre,
          tags: song.tags,
          datePublished: song.publishedAt,
          dateModified: song.updatedAt,
        })}
      />
      <Navbar variant="light" />
      <BreadcrumbBar items={breadcrumbs} />
      <SongReader song={song} />
      <Footer />
    </main>
  );
}
