"use client";

import { useRef, useState } from "react";
import {
  AlignLeft,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Copy,
  FileText,
  GripVertical,
  Guitar,
  Heading,
  LayoutList,
  Music2,
  Plus,
  Trash2,
  Type,
  Video,
  Volume2,
} from "lucide-react";
import toast from "react-hot-toast";
import { InsertChordDialog } from "@/components/admin/InsertChordDialog";
import { ChordDiagram } from "@/components/songs/ChordDiagram";
import { LyricsWithChords } from "@/components/songs/LyricsWithChords";
import {
  clampChordOffsets,
  cloneSongBlock,
  createAudioBlock,
  createChordDiagramBlock,
  createGuitarTabBlock,
  createHeadingBlock,
  createInstructorNoteBlock,
  createLyricsLineBlock,
  createParagraphBlock,
  createSectionBlock,
  createVideoBlock,
  defaultSectionLabel,
  groupSongBlocks,
} from "@/lib/song-content";
import {
  SONG_AUDIO_ACCEPT,
  songAudioContentTypeFromFile,
  UploadAbortedError,
  uploadMediaFile,
} from "@/lib/upload-media";
import { cn } from "@/lib/utils";
import type { SongBlock, SongSectionBlock, SongSectionKind } from "@/types/song";
import { SONG_SECTION_KINDS } from "@/types/song";

type AddBlockKind =
  | "lyrics_line"
  | "section"
  | "heading"
  | "paragraph"
  | "instructor_note"
  | "guitar_tab"
  | "chord_diagram"
  | "audio"
  | "video";

const INNER_KINDS: AddBlockKind[] = [
  "lyrics_line",
  "instructor_note",
  "guitar_tab",
  "chord_diagram",
  "heading",
  "paragraph",
  "audio",
  "video",
];

export function SongBlockEditor({
  blocks,
  songId,
  onChange,
}: {
  blocks: SongBlock[];
  songId?: string;
  onChange: (blocks: SongBlock[]) => void;
}) {
  const [menuAt, setMenuAt] = useState<number | "bottom" | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [focusedLineId, setFocusedLineId] = useState<string | null>(null);
  const [chordTarget, setChordTarget] = useState<{
    id: string;
    offset: number;
  } | null>(null);
  const cursorByLine = useRef<Record<string, number>>({});

  const groups = groupSongBlocks(blocks);

  function updateAt(index: number, next: SongBlock) {
    const copy = [...blocks];
    copy[index] = next;
    onChange(copy);
  }

  function insertAt(index: number, created: SongBlock | SongBlock[]) {
    const copy = [...blocks];
    copy.splice(index, 0, ...(Array.isArray(created) ? created : [created]));
    onChange(copy);
    setMenuAt(null);
  }

  function removeRange(start: number, end: number) {
    onChange([...blocks.slice(0, start), ...blocks.slice(end)]);
  }

  function moveGroup(groupIndex: number, dir: -1 | 1) {
    const nextIndex = groupIndex + dir;
    if (nextIndex < 0 || nextIndex >= groups.length) return;
    const slices = groups.map((group) => blocks.slice(group.start, group.end));
    const swap = slices[groupIndex];
    slices[groupIndex] = slices[nextIndex];
    slices[nextIndex] = swap;
    onChange(slices.flat());
  }

  function duplicateGroup(groupIndex: number) {
    const group = groups[groupIndex];
    const clones = blocks
      .slice(group.start, group.end)
      .map((block) => cloneSongBlock(block));
    insertAt(group.end, clones);
  }

  function moveInner(index: number, dir: -1 | 1) {
    const group = groups.find(
      (item) => index > item.start && index < item.end,
    );
    if (!group) return;
    const next = index + dir;
    if (next <= group.start || next >= group.end) return;
    const copy = [...blocks];
    const [item] = copy.splice(index, 1);
    copy.splice(next, 0, item);
    onChange(copy);
  }

  return (
    <div className="space-y-4">
      {blocks.length === 0 ? (
        <p className="py-8 text-center text-[13px] text-zinc-400">
          Add a section to start the song sheet.
        </p>
      ) : null}

      {groups.map((group, groupIndex) => {
        const section =
          group.sectionIndex != null
            ? (blocks[group.sectionIndex] as SongSectionBlock)
            : null;
        const childIndexes: number[] = [];
        for (let i = group.start; i < group.end; i += 1) {
          if (i === group.sectionIndex) continue;
          childIndexes.push(i);
        }
        const isCollapsed = section ? Boolean(collapsed[section.id]) : false;

        return (
          <div key={section?.id ?? `orphan-${group.start}`} className="group/section">
            {section && group.sectionIndex != null ? (
              <SectionHeader
                block={section}
                isFirst={groupIndex === 0}
                isLast={groupIndex === groups.length - 1}
                collapsed={isCollapsed}
                menuOpen={menuAt === group.sectionIndex}
                onToggleCollapsed={() =>
                  setCollapsed((current) => ({
                    ...current,
                    [section.id]: !current[section.id],
                  }))
                }
                onChange={(next) => updateAt(group.sectionIndex!, next)}
                onMoveUp={() => moveGroup(groupIndex, -1)}
                onMoveDown={() => moveGroup(groupIndex, 1)}
                onDuplicate={() => duplicateGroup(groupIndex)}
                onDelete={() => removeRange(group.start, group.end)}
                onToggleMenu={() =>
                  setMenuAt(
                    menuAt === group.sectionIndex ? null : group.sectionIndex,
                  )
                }
              />
            ) : null}

            {menuAt === group.sectionIndex ||
            (menuAt === group.start && !section) ? (
              <div className="mb-2 ml-7">
                <AddBlockMenu
                  kinds={[...INNER_KINDS, "section"]}
                  onPick={(kind) => {
                    if (kind === "section") {
                      insertAt(group.end, [
                        createSectionBlock(),
                        createLyricsLineBlock(),
                      ]);
                      return;
                    }
                    insertAt(group.end, createBlock(kind));
                  }}
                  onClose={() => setMenuAt(null)}
                />
              </div>
            ) : null}

            {isCollapsed ? null : (
              <div className="ml-7 space-y-1 border-l border-zinc-100 pl-4">
                {childIndexes.map((index) => {
                  const block = blocks[index];
                  return (
                    <div key={block.id} className="group/line relative">
                      <InnerRail
                        isFirst={index === childIndexes[0]}
                        isLast={index === childIndexes[childIndexes.length - 1]}
                        onMoveUp={() => moveInner(index, -1)}
                        onMoveDown={() => moveInner(index, 1)}
                        onDelete={() => removeRange(index, index + 1)}
                      />
                      <BlockFields
                        block={block}
                        songId={songId}
                        showChordHint={focusedLineId === block.id}
                        onChange={(next) => updateAt(index, next)}
                        onFocusLine={() => setFocusedLineId(block.id)}
                        onRequestChord={() =>
                          setChordTarget({
                            id: block.id,
                            offset:
                              cursorByLine.current[block.id] ??
                              (block.type === "lyrics_line"
                                ? block.text.length
                                : 0),
                          })
                        }
                        onCursor={(offset) => {
                          cursorByLine.current[block.id] = offset;
                        }}
                        onEnter={() =>
                          insertAt(index + 1, createLyricsLineBlock())
                        }
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <div className="flex justify-center pt-2">
        {menuAt === "bottom" ? (
          <AddBlockMenu
            kinds={["section", ...INNER_KINDS]}
            onPick={(kind) => {
              if (kind === "section") {
                insertAt(blocks.length, [
                  createSectionBlock(),
                  createLyricsLineBlock(),
                ]);
                return;
              }
              insertAt(blocks.length, createBlock(kind));
            }}
            onClose={() => setMenuAt(null)}
          />
        ) : (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-zinc-300 px-5 py-2 text-[13px] font-medium text-zinc-500 hover:border-brand-orange hover:text-brand-orange"
            onClick={() => setMenuAt("bottom")}
          >
            <Plus className="size-4" />
            Add block
          </button>
        )}
      </div>

      <InsertChordDialog
        open={Boolean(chordTarget)}
        onOpenChange={(open) => {
          if (!open) setChordTarget(null);
        }}
        onSelect={(name) => {
          if (!chordTarget) return;
          onChange(
            blocks.map((block) => {
              if (block.id !== chordTarget.id || block.type !== "lyrics_line") {
                return block;
              }
              const withoutSame = block.chords.filter(
                (chord) => chord.offset !== chordTarget.offset,
              );
              return {
                ...block,
                chords: [
                  ...withoutSame,
                  { name, offset: chordTarget.offset },
                ].sort((a, b) => a.offset - b.offset),
              };
            }),
          );
        }}
      />
    </div>
  );
}

function SectionHeader({
  block,
  isFirst,
  isLast,
  collapsed,
  menuOpen,
  onToggleCollapsed,
  onChange,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onToggleMenu,
}: {
  block: SongSectionBlock;
  isFirst: boolean;
  isLast: boolean;
  collapsed: boolean;
  menuOpen: boolean;
  onToggleCollapsed: () => void;
  onChange: (block: SongSectionBlock) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleMenu: () => void;
}) {
  const btn =
    "flex size-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-30";

  return (
    <div className="flex items-center gap-1.5 py-1">
      <GripVertical className="size-4 shrink-0 text-zinc-300 opacity-0 group-hover/section:opacity-100" />
      <button
        type="button"
        className={btn}
        onClick={onToggleCollapsed}
        aria-label={collapsed ? "Expand section" : "Collapse section"}
      >
        {collapsed ? (
          <ChevronDown className="size-4" />
        ) : (
          <ChevronUp className="size-4" />
        )}
      </button>
      <select
        value={block.kind}
        onChange={(event) => {
          const kind = event.target.value as SongSectionKind;
          const previousDefault = defaultSectionLabel(block.kind);
          const label =
            !block.label || block.label === previousDefault
              ? defaultSectionLabel(kind)
              : block.label;
          onChange({
            ...block,
            kind,
            label,
          });
        }}
        className="h-8 rounded-md border-0 bg-orange-50 px-2 text-[13px] font-semibold text-brand-orange outline-none"
      >
        {SONG_SECTION_KINDS.map((kind) => (
          <option key={kind} value={kind}>
            {defaultSectionLabel(kind)}
          </option>
        ))}
      </select>
      <input
        value={block.label ?? ""}
        onChange={(event) => onChange({ ...block, label: event.target.value })}
        placeholder="Verse 1"
        className="h-8 min-w-0 flex-1 border-0 bg-transparent text-[14px] font-bold text-zinc-900 outline-none"
      />
      <div className="flex shrink-0 items-center opacity-0 transition-opacity group-hover/section:opacity-100 focus-within:opacity-100">
        <button type="button" className={btn} disabled={isFirst} onClick={onMoveUp}>
          <ArrowUp className="size-3.5" />
        </button>
        <button type="button" className={btn} disabled={isLast} onClick={onMoveDown}>
          <ArrowDown className="size-3.5" />
        </button>
        <button
          type="button"
          className={cn(btn, menuOpen && "bg-zinc-100 text-zinc-700")}
          onClick={onToggleMenu}
        >
          <Plus className="size-3.5" />
        </button>
        <button type="button" className={btn} onClick={onDuplicate}>
          <Copy className="size-3.5" />
        </button>
        <button type="button" className={btn} onClick={onDelete}>
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

function InnerRail({
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) {
  const btn =
    "flex size-5 items-center justify-center rounded text-zinc-300 hover:bg-zinc-100 hover:text-zinc-600 disabled:opacity-30";
  return (
    <div className="absolute top-2 -left-9 flex flex-col opacity-0 transition-opacity group-hover/line:opacity-100 focus-within:opacity-100">
      <button type="button" className={btn} disabled={isFirst} onClick={onMoveUp}>
        <ArrowUp className="size-3" />
      </button>
      <button type="button" className={btn} disabled={isLast} onClick={onMoveDown}>
        <ArrowDown className="size-3" />
      </button>
      <button type="button" className={btn} onClick={onDelete}>
        <Trash2 className="size-3" />
      </button>
    </div>
  );
}

function BlockFields({
  block,
  songId,
  showChordHint,
  onChange,
  onFocusLine,
  onRequestChord,
  onCursor,
  onEnter,
}: {
  block: SongBlock;
  songId?: string;
  showChordHint: boolean;
  onChange: (block: SongBlock) => void;
  onFocusLine: () => void;
  onRequestChord: () => void;
  onCursor: (offset: number) => void;
  onEnter: () => void;
}) {
  if (block.type === "lyrics_line") {
    return (
      <div onFocus={onFocusLine}>
        <LyricsWithChords
          variant="editor"
          text={block.text}
          chords={block.chords}
          instrumental={block.instrumental}
          showHint={showChordHint}
          placeholder="Type lyrics..."
          onChangeText={(text) =>
            onChange({
              ...block,
              text,
              chords: clampChordOffsets(text, block.chords),
            })
          }
          onCursor={onCursor}
          onRequestChord={onRequestChord}
          onEnter={onEnter}
          onRemoveChord={(index) =>
            onChange({
              ...block,
              chords: block.chords.filter((_, i) => i !== index),
            })
          }
        />
      </div>
    );
  }

  if (block.type === "instructor_note") {
    return (
      <div className="my-2 flex gap-2 rounded-lg border border-[#F3D7A4] bg-[#FFFBEB] px-3 py-2.5">
        <FileText className="mt-0.5 size-4 shrink-0 text-amber-600" />
        <textarea
          value={block.text}
          rows={2}
          placeholder="Instructor note — tip, technique, or reminder..."
          className="w-full resize-none border-0 bg-transparent text-[14px] text-amber-950 outline-none placeholder:text-amber-700/50"
          onChange={(event) => onChange({ ...block, text: event.target.value })}
        />
      </div>
    );
  }

  if (block.type === "heading") {
    return (
      <div className="flex gap-2 py-1">
        <select
          value={String(block.level)}
          onChange={(event) =>
            onChange({ ...block, level: Number(event.target.value) as 1 | 2 | 3 })
          }
          className="h-9 rounded-md border border-zinc-200 px-2 text-[13px]"
        >
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="3">H3</option>
        </select>
        <input
          value={block.text}
          onChange={(event) => onChange({ ...block, text: event.target.value })}
          placeholder="Heading"
          className="h-9 flex-1 border-0 bg-transparent text-[18px] font-semibold outline-none"
        />
      </div>
    );
  }

  if (block.type === "paragraph") {
    return (
      <textarea
        value={block.text}
        rows={3}
        placeholder="Paragraph"
        className="w-full resize-none border-0 bg-transparent py-1 text-[15px] leading-7 text-zinc-600 outline-none"
        onChange={(event) => onChange({ ...block, text: event.target.value })}
      />
    );
  }

  if (block.type === "guitar_tab") {
    return (
      <div className="my-2 rounded-xl border border-zinc-200 bg-white px-4 py-3">
        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-[#5BA3E8]">
          <Guitar className="size-3.5" />
          GUITAR TAB
        </p>
        <div className="space-y-0.5">
          {block.strings.map((line, index) => (
            <input
              key={index}
              value={line}
              className="w-full border-0 bg-transparent font-mono text-[12px] leading-5 text-zinc-700 outline-none"
              onChange={(event) => {
                const strings = [...block.strings] as typeof block.strings;
                strings[index] = event.target.value;
                onChange({ ...block, strings });
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "chord_diagram") {
    return (
      <div className="my-2 flex flex-wrap items-start gap-4 rounded-xl border border-zinc-200 bg-white px-4 py-3">
        <ChordDiagram fingering={block.fingering} />
        <div className="min-w-55 flex-1 space-y-2">
          <p className="text-[11px] font-semibold tracking-wide text-[#5BA3E8]">
            CHORD DIAGRAM
          </p>
          <label className="block text-[12px] text-zinc-500">
            Chord name (e.g. G Major)
            <input
              value={block.name}
              onChange={(event) => onChange({ ...block, name: event.target.value })}
              className="mt-1 h-8 w-full rounded-md border border-zinc-200 px-2 text-[13px] font-semibold text-zinc-800 outline-none focus:border-brand-orange"
              placeholder="G Major"
            />
          </label>
          <label className="block text-[12px] text-zinc-500">
            Fingering
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <input
                value={block.fingering}
                onChange={(event) =>
                  onChange({ ...block, fingering: event.target.value })
                }
                placeholder="x32010"
                className="h-8 w-28 rounded-md border border-zinc-200 px-2 font-mono text-[13px] outline-none focus:border-brand-orange"
              />
              <span className="text-[11px] text-zinc-400">6 chars: 0-9 or x</span>
            </div>
          </label>
        </div>
      </div>
    );
  }

  if (block.type === "audio") {
    const pastedUrl = /^https?:\/\//i.test(block.storageKey)
      ? block.storageKey
      : "";
    return (
      <MediaCard
        icon={Volume2}
        title="Add audio"
        urlLabel="Paste URL"
        urlValue={pastedUrl}
        caption={block.caption ?? ""}
        accept={SONG_AUDIO_ACCEPT}
        songId={songId}
        hasFile={Boolean(block.storageKey) && !pastedUrl}
        onCaption={(caption) => onChange({ ...block, caption })}
        onUrl={(storageKey) => onChange({ ...block, storageKey })}
        onFile={async (file) => {
          const contentType = songAudioContentTypeFromFile(file);
          if (!contentType) {
            toast.error("Use an MP3 or WAV file.");
            return;
          }
          const storageKey = await uploadMediaFile({
            file,
            folder: "songs",
            contentType,
            songId,
          });
          onChange({ ...block, storageKey });
        }}
      />
    );
  }

  if (block.type === "video") {
    return (
      <div className="my-2 rounded-xl border border-dashed border-zinc-300 px-4 py-3">
        <p className="flex items-center gap-2 text-[13px] font-semibold text-zinc-700">
          <Video className="size-4 text-zinc-400" />
          Add video
        </p>
        <input
          value={block.youtubeUrl ?? ""}
          placeholder="Paste YouTube URL"
          className="mt-2 h-9 w-full rounded-md border border-zinc-200 px-3 text-[13px] outline-none focus:border-brand-orange"
          onChange={(event) =>
            onChange({
              ...block,
              source: "youtube",
              youtubeUrl: event.target.value,
            })
          }
        />
        <input
          value={block.caption ?? ""}
          placeholder="Caption (optional)"
          className="mt-2 h-8 w-full border-0 bg-transparent text-[12px] text-zinc-500 outline-none"
          onChange={(event) => onChange({ ...block, caption: event.target.value })}
        />
      </div>
    );
  }

  return null;
}

function MediaCard({
  icon: Icon,
  title,
  urlLabel,
  urlValue,
  caption,
  accept,
  songId,
  hasFile,
  onCaption,
  onUrl,
  onFile,
}: {
  icon: typeof Volume2;
  title: string;
  urlLabel: string;
  urlValue: string;
  caption: string;
  accept: string;
  songId?: string;
  hasFile: boolean;
  onCaption: (value: string) => void;
  onUrl: (value: string) => void;
  onFile: (file: File) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="my-2 rounded-xl border border-dashed border-zinc-300 px-4 py-3">
      <p className="flex items-center gap-2 text-[13px] font-semibold text-zinc-700">
        <Icon className="size-4 text-zinc-400" />
        {title}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          setBusy(true);
          onFile(file)
            .catch((error) => {
              if (!(error instanceof UploadAbortedError)) {
                toast.error(error instanceof Error ? error.message : "Upload failed");
              }
            })
            .finally(() => setBusy(false));
        }}
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="h-9 rounded-md border border-zinc-200 px-3 text-[13px] text-zinc-600 hover:bg-zinc-50"
        >
          {busy ? "Uploading…" : hasFile ? "Replace file" : "Upload file"}
        </button>
        <input
          value={urlValue}
          placeholder={urlLabel}
          className="h-9 min-w-40 flex-1 rounded-md border border-zinc-200 px-3 text-[13px] outline-none focus:border-brand-orange"
          onChange={(event) => onUrl(event.target.value)}
        />
      </div>
      <input
        value={caption}
        placeholder="Caption (optional)"
        className="mt-2 h-8 w-full border-0 bg-transparent text-[12px] text-zinc-500 outline-none"
        onChange={(event) => onCaption(event.target.value)}
      />
      {songId ? null : (
        <p className="mt-1 text-[11px] text-zinc-400">
          Save the song once so uploads are scoped to it.
        </p>
      )}
    </div>
  );
}

function AddBlockMenu({
  kinds,
  onPick,
  onClose,
}: {
  kinds: AddBlockKind[];
  onPick: (kind: AddBlockKind) => void;
  onClose: () => void;
}) {
  const catalog: { kind: AddBlockKind; label: string; icon: typeof AlignLeft }[] =
    [
      { kind: "lyrics_line", label: "Lyrics line", icon: AlignLeft },
      { kind: "section", label: "Section (Verse, Chorus...)", icon: LayoutList },
      { kind: "heading", label: "Heading", icon: Heading },
      { kind: "paragraph", label: "Paragraph", icon: Type },
      { kind: "instructor_note", label: "Instructor note", icon: FileText },
      { kind: "guitar_tab", label: "Guitar tab", icon: Guitar },
      { kind: "chord_diagram", label: "Chord diagram", icon: Music2 },
      { kind: "audio", label: "Audio", icon: Volume2 },
      { kind: "video", label: "Video (YouTube)", icon: Video },
    ];
  const items = catalog.filter((item) => kinds.includes(item.kind));

  return (
    <div className="w-64 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
      {items.map((item) => (
        <button
          key={item.kind}
          type="button"
          className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-zinc-700 hover:bg-zinc-50"
          onClick={() => onPick(item.kind)}
        >
          <item.icon className="size-4 text-zinc-400" />
          {item.label}
        </button>
      ))}
      <button
        type="button"
        className="w-full px-3 py-1.5 text-left text-[12px] text-zinc-400"
        onClick={onClose}
      >
        Cancel
      </button>
    </div>
  );
}

function createBlock(kind: AddBlockKind): SongBlock {
  switch (kind) {
    case "lyrics_line":
      return createLyricsLineBlock();
    case "section":
      return createSectionBlock();
    case "heading":
      return createHeadingBlock();
    case "paragraph":
      return createParagraphBlock();
    case "instructor_note":
      return createInstructorNoteBlock();
    case "guitar_tab":
      return createGuitarTabBlock();
    case "chord_diagram":
      return createChordDiagramBlock();
    case "audio":
      return createAudioBlock();
    case "video":
      return createVideoBlock();
  }
}
