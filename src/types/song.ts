import type { PublicContentFaq } from "@/types/content-faq";

export const SONG_DIFFICULTIES = ["beginner", "intermediate", "pro"] as const;

export type SongDifficulty = (typeof SONG_DIFFICULTIES)[number];

export const SONG_SECTION_KINDS = [
  "intro",
  "verse",
  "chorus",
  "pre_chorus",
  "bridge",
  "instrumental",
  "solo",
  "outro",
  "custom",
] as const;

export type SongSectionKind = (typeof SONG_SECTION_KINDS)[number];

export type SongChordAnchor = {
  name: string;
  offset: number;
};

export type SongSectionBlock = {
  type: "section";
  id: string;
  kind: SongSectionKind;
  label?: string;
};

export type SongLyricsLineBlock = {
  type: "lyrics_line";
  id: string;
  lineId: string;
  text: string;
  chords: SongChordAnchor[];
  instrumental?: boolean;
};

export type SongInstructorNoteBlock = {
  type: "instructor_note";
  id: string;
  text: string;
};

export type SongHeadingBlock = {
  type: "heading";
  id: string;
  level: 1 | 2 | 3;
  text: string;
};

export type SongParagraphBlock = {
  type: "paragraph";
  id: string;
  text: string;
};

export type SongGuitarTabBlock = {
  type: "guitar_tab";
  id: string;
  strings: [string, string, string, string, string, string];
  caption?: string;
};

export type SongChordDiagramBlock = {
  type: "chord_diagram";
  id: string;
  name: string;
  fingering: string;
};

export type SongAudioBlock = {
  type: "audio";
  id: string;
  storageKey: string;
  caption?: string;
};

export type SongVideoBlock = {
  type: "video";
  id: string;
  source: "youtube" | "upload";
  youtubeUrl?: string;
  storageKey?: string;
  caption?: string;
};

export type SongBlock =
  | SongSectionBlock
  | SongLyricsLineBlock
  | SongInstructorNoteBlock
  | SongHeadingBlock
  | SongParagraphBlock
  | SongGuitarTabBlock
  | SongChordDiagramBlock
  | SongAudioBlock
  | SongVideoBlock;

export type SongArrangement = {
  blocks: SongBlock[];
};

export type SongContentV1 = {
  version: 1;
  syncLyrics: boolean;
  arrangements: {
    beginner: SongArrangement;
    intermediate: SongArrangement;
    pro: SongArrangement;
  };
};

export type SongCreator = {
  id: string;
  name: string;
  avatarUrl: string | null;
};

export type SongListItem = {
  id: string;
  title: string;
  slug: string;
  artist: string;
  description: string | null;
  heroImageUrl: string | null;
  genre: string | null;
  language: string;
  musicalKey: string | null;
  capoFret: number;
  bpm: number | null;
  timeSignature: string | null;
  tuning: string | null;
  tags: string[];
  defaultDifficulty: SongDifficulty;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  creator?: SongCreator;
};

export type SongDetail = SongListItem & {
  content: SongContentV1;
  createdBy?: string;
  faqs?: PublicContentFaq[];
};

export type PaginatedSongs = {
  items: SongListItem[];
  total: number;
  page: number;
  limit: number;
};

export type ListSongsQuery = {
  page?: number;
  limit?: number;
  q?: string;
  genre?: string;
  tag?: string;
  difficulty?: SongDifficulty;
  isPublished?: boolean;
};

export type CreateSongFaqInput = {
  question: string;
  answer: string;
  position?: number;
  isActive?: boolean;
};

export type CreateSongRequest = {
  title: string;
  artist: string;
  description?: string;
  heroImageUrl?: string;
  genre?: string;
  language?: string;
  musicalKey?: string;
  capoFret?: number;
  bpm?: number;
  timeSignature?: string;
  tuning?: string;
  tags?: string[];
  defaultDifficulty?: SongDifficulty;
  content?: SongContentV1;
  isPublished?: boolean;
  faqs?: CreateSongFaqInput[];
};

export type UpdateSongRequest = Partial<Omit<CreateSongRequest, "faqs">>;

export type ChordCatalogEntry = {
  name: string;
  fingering: string;
};

export const SONG_GENRES = [
  "Folk",
  "Rock",
  "Pop",
  "Blues",
  "Jazz",
  "Country",
  "Fingerstyle",
  "Worship",
  "Classical",
  "Other",
] as const;

export const SONG_LANGUAGES = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "Other",
] as const;

export const SONG_TIME_SIGNATURES = ["4/4", "3/4", "6/8", "2/4", "12/8"] as const;

export const SONG_TUNINGS = [
  "Standard (E A D G B E)",
  "Drop D (D A D G B E)",
  "Half step down (Eb Ab Db Gb Bb Eb)",
  "Open G (D G D G B D)",
  "Open D (D A D F# A D)",
] as const;

export const SONG_KEYS = [
  "C",
  "C#",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "F#",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
  "Am",
  "C#m",
  "Dm",
  "Ebm",
  "Em",
  "Fm",
  "F#m",
  "Gm",
  "G#m",
  "Abm",
  "Bm",
] as const;

export const EMPTY_TAB_STRINGS: [
  string,
  string,
  string,
  string,
  string,
  string,
] = [
  "e|------------------|",
  "B|------------------|",
  "G|------------------|",
  "D|------------------|",
  "A|------------------|",
  "E|------------------|",
];
