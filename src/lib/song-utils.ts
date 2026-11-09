const SHARP_NOTES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

const FLAT_TO_SHARP: Record<string, string> = {
  Db: "C#",
  Eb: "D#",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
};

const CHORD_ROOT = /^([A-G](?:#|b)?)(.*)$/;

export function transposeNote(note: string, semitones: number): string {
  const normalized = FLAT_TO_SHARP[note] ?? note;
  const index = SHARP_NOTES.indexOf(
    normalized as (typeof SHARP_NOTES)[number],
  );
  if (index < 0) return note;
  const shift = ((semitones % 12) + 12) % 12;
  return SHARP_NOTES[(index + shift) % 12];
}

export function transposeChord(name: string, semitones: number): string {
  if (!semitones) return name;
  const [main, bass] = name.split("/");
  const transposedMain = transposeChordPart(main.trim(), semitones);
  if (!bass) return transposedMain;
  return `${transposedMain}/${transposeNote(bass.trim(), semitones)}`;
}

function transposeChordPart(part: string, semitones: number): string {
  const match = part.match(CHORD_ROOT);
  if (!match) return part;
  return `${transposeNote(match[1], semitones)}${match[2]}`;
}

export function buildChordLine(
  text: string,
  chords: { name: string; offset: number }[],
  semitones = 0,
): string {
  const sorted = [...chords].sort((a, b) => a.offset - b.offset);
  let line = "";
  for (const chord of sorted) {
    const name = transposeChord(chord.name, semitones);
    const start = Math.max(chord.offset, line.length === 0 ? 0 : line.length);
    line = line.padEnd(start, " ") + name;
  }
  if (line.length < text.length) line = line.padEnd(text.length, " ");
  return line;
}

export function formatCapo(capoFret: number) {
  if (!capoFret) return null;
  const suffix =
    capoFret === 1 ? "st" : capoFret === 2 ? "nd" : capoFret === 3 ? "rd" : "th";
  return `Capo ${capoFret}${suffix} fret`;
}

export function youtubeEmbedUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/,
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export function publicMediaUrl(stored: string | null | undefined): string {
  const value = stored?.trim() ?? "";
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  const domain = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN?.trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
  if (domain && value.startsWith("public/")) {
    return `https://${domain}/${value}`;
  }
  return value;
}
