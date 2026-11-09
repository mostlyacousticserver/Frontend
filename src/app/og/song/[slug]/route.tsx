import { renderOgImage } from "@/lib/og-template";
import { fetchPublishedSong } from "@/lib/public-song";

export const revalidate = 3600;

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const song = await fetchPublishedSong(slug).catch(() => null);

  if (!song) {
    return renderOgImage({
      eyebrow: "Chord sheet",
      title: "Free guitar chords and lyrics",
    });
  }

  return renderOgImage({
    eyebrow: "Guitar chords",
    title: `${song.title} — ${song.artist}`,
    subtitle: song.description ?? undefined,
    meta: [
      song.musicalKey ? `Key of ${song.musicalKey}` : "",
      song.capoFret ? `Capo ${song.capoFret}` : "",
      song.defaultDifficulty === "pro"
        ? "Pro"
        : `${song.defaultDifficulty[0].toUpperCase()}${song.defaultDifficulty.slice(1)}`,
    ].filter(Boolean),
  });
}
