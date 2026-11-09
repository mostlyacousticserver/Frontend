import {
  isStructuralBlock,
  otherDifficulties,
  structuralKey,
} from "@/lib/song-content";
import type { SongBlock, SongContentV1, SongDifficulty } from "@/types/song";

export function syncLyricsFromSource(
  content: SongContentV1,
  source: SongDifficulty,
): SongContentV1 {
  const sourceBlocks = content.arrangements[source].blocks;
  const next: SongContentV1 = {
    ...content,
    arrangements: {
      beginner: { blocks: [...content.arrangements.beginner.blocks] },
      intermediate: { blocks: [...content.arrangements.intermediate.blocks] },
      pro: { blocks: [...content.arrangements.pro.blocks] },
    },
  };

  for (const difficulty of otherDifficulties(source)) {
    next.arrangements[difficulty] = {
      blocks: rebuildWithSourceStructure(
        sourceBlocks,
        content.arrangements[difficulty].blocks,
      ),
    };
  }

  return next;
}

function rebuildWithSourceStructure(
  sourceBlocks: SongBlock[],
  targetBlocks: SongBlock[],
): SongBlock[] {
  const extrasByAnchor = new Map<string, SongBlock[]>();
  let currentAnchor = "__start";
  extrasByAnchor.set(currentAnchor, []);

  for (const block of targetBlocks) {
    if (isStructuralBlock(block)) {
      currentAnchor = structuralKey(block);
      if (!extrasByAnchor.has(currentAnchor)) extrasByAnchor.set(currentAnchor, []);
      continue;
    }
    extrasByAnchor.get(currentAnchor)?.push(block);
  }

  const chordByLineId = new Map(
    targetBlocks
      .filter((block) => block.type === "lyrics_line")
      .map((block) => [block.lineId, block.chords]),
  );

  const rebuilt: SongBlock[] = [...(extrasByAnchor.get("__start") ?? [])];
  const usedAnchors = new Set<string>(["__start"]);

  for (const block of sourceBlocks) {
    if (!isStructuralBlock(block)) continue;
    if (block.type === "lyrics_line") {
      rebuilt.push({
        ...block,
        id: block.id,
        chords: chordByLineId.get(block.lineId) ?? block.chords,
      });
    } else {
      rebuilt.push({ ...block });
    }
    const anchor = structuralKey(block);
    rebuilt.push(...(extrasByAnchor.get(anchor) ?? []));
    usedAnchors.add(anchor);
  }

  for (const [anchor, extras] of extrasByAnchor) {
    if (!usedAnchors.has(anchor)) rebuilt.push(...extras);
  }

  return rebuilt;
}

export function updateBlocks(
  content: SongContentV1,
  difficulty: SongDifficulty,
  blocks: SongBlock[],
): SongContentV1 {
  const next: SongContentV1 = {
    ...content,
    arrangements: {
      ...content.arrangements,
      [difficulty]: { blocks },
    },
  };
  if (!next.syncLyrics) return next;
  return syncLyricsFromSource(next, difficulty);
}
