import {
  EMPTY_TAB_STRINGS,
  SONG_DIFFICULTIES,
  type SongBlock,
  type SongContentV1,
  type SongDifficulty,
  type SongSectionKind,
} from "@/types/song";

export function createEmptySongContent(): SongContentV1 {
  return {
    version: 1,
    syncLyrics: true,
    arrangements: {
      beginner: { blocks: [] },
      intermediate: { blocks: [] },
      pro: { blocks: [] },
    },
  };
}

export function createStarterSongContent(): SongContentV1 {
  const intro = createSectionBlock("intro", "Intro");
  const line = createLyricsLineBlock();
  const blocks = [intro, line];
  return {
    version: 1,
    syncLyrics: true,
    arrangements: {
      beginner: { blocks: structuredClone(blocks) },
      intermediate: { blocks: structuredClone(blocks) },
      pro: { blocks: structuredClone(blocks) },
    },
  };
}

export function newBlockId() {
  return crypto.randomUUID();
}

export function createSectionBlock(
  kind: SongSectionKind = "verse",
  label?: string,
): SongBlock {
  return {
    type: "section",
    id: newBlockId(),
    kind,
    label: label ?? defaultSectionLabel(kind),
  };
}

export function createLyricsLineBlock(): SongBlock {
  return {
    type: "lyrics_line",
    id: newBlockId(),
    lineId: newBlockId(),
    text: "",
    chords: [],
  };
}

export function createInstructorNoteBlock(): SongBlock {
  return {
    type: "instructor_note",
    id: newBlockId(),
    text: "",
  };
}

export function createHeadingBlock(): SongBlock {
  return { type: "heading", id: newBlockId(), level: 2, text: "" };
}

export function createParagraphBlock(): SongBlock {
  return { type: "paragraph", id: newBlockId(), text: "" };
}

export function createGuitarTabBlock(): SongBlock {
  return {
    type: "guitar_tab",
    id: newBlockId(),
    strings: [...EMPTY_TAB_STRINGS],
  };
}

export function createChordDiagramBlock(): SongBlock {
  return {
    type: "chord_diagram",
    id: newBlockId(),
    name: "C",
    fingering: "x32010",
  };
}

export function createAudioBlock(storageKey = ""): SongBlock {
  return { type: "audio", id: newBlockId(), storageKey };
}

export function createVideoBlock(): SongBlock {
  return { type: "video", id: newBlockId(), source: "youtube", youtubeUrl: "" };
}

export function isStructuralBlock(block: SongBlock) {
  return block.type === "section" || block.type === "lyrics_line";
}

export function structuralKey(block: SongBlock) {
  if (block.type === "lyrics_line") return `line:${block.lineId}`;
  if (block.type === "section") return `section:${block.id}`;
  return block.id;
}

export function defaultSectionLabel(kind: SongSectionKind) {
  const labels: Record<SongSectionKind, string> = {
    intro: "Intro",
    verse: "Verse",
    chorus: "Chorus",
    pre_chorus: "Pre-Chorus",
    bridge: "Bridge",
    instrumental: "Instrumental",
    solo: "Solo",
    outro: "Outro",
    custom: "Section",
  };
  return labels[kind];
}

export function otherDifficulties(source: SongDifficulty): SongDifficulty[] {
  return SONG_DIFFICULTIES.filter((item) => item !== source);
}

export function clampChordOffsets(
  text: string,
  chords: { name: string; offset: number }[],
) {
  return chords
    .map((chord) => ({
      ...chord,
      offset: Math.max(0, Math.min(chord.offset, text.length)),
    }))
    .sort((a, b) => a.offset - b.offset);
}

export type SongBlockGroup = {
  sectionIndex: number | null;
  start: number;
  end: number;
};

export function groupSongBlocks(blocks: SongBlock[]): SongBlockGroup[] {
  const groups: SongBlockGroup[] = [];
  let start = 0;
  let sectionIndex: number | null = null;

  for (let i = 0; i < blocks.length; i += 1) {
    if (blocks[i].type !== "section") continue;
    if (i > start) {
      groups.push({ sectionIndex, start, end: i });
    }
    sectionIndex = i;
    start = i;
  }
  if (start < blocks.length) {
    groups.push({ sectionIndex, start, end: blocks.length });
  }
  return groups;
}

export function cloneSongBlock(block: SongBlock): SongBlock {
  const copy = structuredClone(block);
  copy.id = newBlockId();
  if (copy.type === "lyrics_line") {
    copy.lineId = newBlockId();
  }
  return copy;
}
