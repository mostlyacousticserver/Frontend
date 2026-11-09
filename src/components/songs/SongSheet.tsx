"use client";

import type { ReactNode } from "react";
import { FileText } from "lucide-react";
import { ChordDiagram } from "@/components/songs/ChordDiagram";
import { LyricsWithChords } from "@/components/songs/LyricsWithChords";
import {
  formatCapo,
  publicMediaUrl,
  transposeChord,
  youtubeEmbedUrl,
} from "@/lib/song-utils";
import { defaultSectionLabel } from "@/lib/song-content";
import { cn } from "@/lib/utils";
import type { SongBlock, SongListItem, SongSectionKind } from "@/types/song";

const SECTION_STYLES: Record<SongSectionKind, string> = {
  intro: "bg-[#E8F3FF] text-[#3B82C4]",
  verse: "bg-[#E8F3FF] text-[#2F6FED]",
  chorus: "bg-[#FFE8D6] text-[#E07A3D]",
  pre_chorus: "bg-[#FFF3D6] text-[#C4891A]",
  bridge: "bg-[#EDE7FF] text-[#7C5CBF]",
  instrumental: "bg-[#E6F7F4] text-[#0DA694]",
  solo: "bg-[#FCE7F3] text-[#BE185D]",
  outro: "bg-zinc-100 text-zinc-600",
  custom: "bg-[#E8F3FF] text-[#3B82C4]",
};

export type SongSheetSong = Pick<
  SongListItem,
  | "title"
  | "artist"
  | "description"
  | "heroImageUrl"
  | "genre"
  | "musicalKey"
  | "capoFret"
  | "bpm"
  | "tags"
  | "defaultDifficulty"
>;

export function SongSheet({
  song,
  blocks,
  transpose = 0,
  showHero = true,
  className,
}: {
  song: SongSheetSong;
  blocks: SongBlock[];
  transpose?: number;
  showHero?: boolean;
  className?: string;
}) {
  const heroSrc = publicMediaUrl(song.heroImageUrl);
  const capo = formatCapo(song.capoFret);
  const displayedKey = song.musicalKey
    ? transposeChord(song.musicalKey, transpose)
    : null;

  return (
    <article className={cn("bg-transparent text-zinc-900", className)}>
      {showHero && heroSrc ? (
        <div className="relative mb-5 aspect-16/7 overflow-hidden rounded-xl bg-zinc-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroSrc} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        <MetaPill filled>{labelDifficulty(song.defaultDifficulty)}</MetaPill>
        {song.genre ? <MetaPill>{song.genre}</MetaPill> : null}
        {displayedKey ? <MetaPill>Key {displayedKey}</MetaPill> : null}
        {song.bpm ? <MetaPill>{song.bpm} BPM</MetaPill> : null}
        {capo ? <MetaPill>{capo}</MetaPill> : null}
      </div>

      <h1 className="mt-4 font-sans text-[28px] font-bold tracking-tight text-zinc-900">
        {song.title || "Untitled song"}
      </h1>
      {song.artist ? (
        <p className="mt-1 text-[14px] text-zinc-400">{song.artist}</p>
      ) : null}
      {song.description ? (
        <p className="mt-3 text-[14px] leading-7 text-zinc-500 italic">
          {song.description}
        </p>
      ) : null}

      <div className="mt-6 space-y-1">
        {blocks.map((block) => (
          <SongSheetBlock key={block.id} block={block} transpose={transpose} />
        ))}
      </div>

      {song.tags.length > 0 ? (
        <div className="mt-8 flex flex-wrap gap-1.5 border-t border-zinc-100 pt-4">
          {song.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-500"
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function SongSheetBlock({
  block,
  transpose,
}: {
  block: SongBlock;
  transpose: number;
}) {
  if (block.type === "section") {
    const label = (block.label || defaultSectionLabel(block.kind)).toUpperCase();
    return (
      <div className="flex items-center gap-3 pt-6 pb-1">
        <span
          className={cn(
            "inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide",
            SECTION_STYLES[block.kind],
          )}
        >
          {label}
        </span>
        <span className="h-px min-w-0 flex-1 bg-zinc-100" />
      </div>
    );
  }

  if (block.type === "lyrics_line") {
    return (
      <LyricsWithChords
        text={block.text}
        chords={block.chords}
        transpose={transpose}
        instrumental={block.instrumental}
        variant="preview"
      />
    );
  }

  if (block.type === "instructor_note") {
    if (!block.text.trim()) return null;
    return (
      <div className="my-3 flex gap-2 rounded-lg border border-[#F3D7A4] bg-[#FFFBEB] px-3 py-2.5 text-[14px] text-amber-950">
        <FileText className="mt-0.5 size-4 shrink-0 text-amber-700" />
        <p>{block.text}</p>
      </div>
    );
  }

  if (block.type === "heading") {
    const Tag = (`h${block.level}` as unknown) as "h2";
    return <Tag className="pt-3 text-lg font-semibold">{block.text}</Tag>;
  }

  if (block.type === "paragraph") {
    if (!block.text.trim()) return null;
    return <p className="py-1 text-[15px] leading-7 text-zinc-600">{block.text}</p>;
  }

  if (block.type === "guitar_tab") {
    return (
      <div className="my-3 overflow-x-auto rounded-xl border border-zinc-200 bg-white px-4 py-3">
        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-[#5BA3E8]">
          GUITAR TAB
        </p>
        <pre className="font-mono text-[12px] leading-5 text-zinc-800">
          {block.strings.join("\n")}
        </pre>
      </div>
    );
  }

  if (block.type === "chord_diagram") {
    return (
      <div className="my-3 inline-flex rounded-xl border border-zinc-200 bg-white px-3 py-2">
        <ChordDiagram name={block.name} fingering={block.fingering} />
      </div>
    );
  }

  if (block.type === "audio") {
    const src = publicMediaUrl(block.storageKey);
    if (!src) return null;
    return (
      <figure className="my-3 rounded-xl border border-zinc-200 bg-white p-3">
        <audio controls src={src} className="w-full" />
        {block.caption ? (
          <figcaption className="mt-1 text-xs text-zinc-500">
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (block.type === "video") {
    const embed = block.youtubeUrl ? youtubeEmbedUrl(block.youtubeUrl) : null;
    const fileSrc = publicMediaUrl(block.storageKey);
    if (embed) {
      return (
        <figure className="my-3 overflow-hidden rounded-xl border border-zinc-200">
          <iframe
            title={block.caption || "Song video"}
            src={embed}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </figure>
      );
    }
    if (fileSrc) {
      return (
        <figure className="my-3">
          <video
            controls
            controlsList="nodownload"
            disablePictureInPicture
            disableRemotePlayback
            playsInline
            src={fileSrc}
            className="no-download-video w-full rounded-xl"
            onContextMenu={(event) => event.preventDefault()}
          />
        </figure>
      );
    }
    return null;
  }

  return null;
}

function MetaPill({
  children,
  filled,
}: {
  children: ReactNode;
  filled?: boolean;
}) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-[11px] font-semibold",
        filled
          ? "bg-[#2F6FED] text-white"
          : "bg-[#E8F3FF] text-[#3B82C4]",
      )}
    >
      {children}
    </span>
  );
}

function labelDifficulty(value: SongListItem["defaultDifficulty"]) {
  if (value === "pro") return "Pro";
  return value[0].toUpperCase() + value.slice(1);
}
