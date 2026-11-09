"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Music } from "lucide-react";
import { transposeChord } from "@/lib/song-utils";
import { cn } from "@/lib/utils";
import type { SongChordAnchor } from "@/types/song";

const LYRIC_TEXT =
  "whitespace-pre font-mono text-[15px] leading-7 tracking-normal";

export function LyricsWithChords({
  text,
  chords,
  transpose = 0,
  variant = "preview",
  placeholder,
  instrumental,
  showHint,
  onChangeText,
  onCursor,
  onRequestChord,
  onRemoveChord,
  onEnter,
}: {
  text: string;
  chords: SongChordAnchor[];
  transpose?: number;
  variant?: "preview" | "editor";
  placeholder?: string;
  instrumental?: boolean;
  showHint?: boolean;
  onChangeText?: (text: string) => void;
  onCursor?: (offset: number) => void;
  onRequestChord?: () => void;
  onRemoveChord?: (index: number) => void;
  onEnter?: () => void;
}) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [prefixWidths, setPrefixWidths] = useState<number[]>([]);

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const widths: number[] = [0];
    for (let i = 1; i <= text.length; i += 1) {
      el.textContent = text.slice(0, i) || "\u00a0";
      widths.push(el.offsetWidth);
    }
    el.textContent = text || "\u00a0";
    setPrefixWidths(widths);
  }, [text]);

  if (instrumental && variant === "preview") {
    const names = chords.map((chord) => transposeChord(chord.name, transpose));
    return (
      <p className="font-mono text-[15px] italic text-zinc-500">
        (Instrumental
        {names.length > 0 ? " — " : ""}
        {names.map((name, index) => (
          <span key={`${name}-${index}`}>
            {index > 0 ? "  " : ""}
            <span className="font-semibold not-italic text-[#2563EB]">
              {name}
            </span>
          </span>
        ))}
        )
      </p>
    );
  }

  return (
    <div
      className={cn(
        "relative pt-6",
        variant === "editor" && "pr-[7.5rem]",
      )}
    >
      <span
        ref={measureRef}
        aria-hidden
        className={cn(
          "pointer-events-none invisible absolute top-0 left-0",
          LYRIC_TEXT,
        )}
      />
      <div className="relative min-h-6">
        {chords.map((chord, index) => {
          const left = prefixWidths[Math.min(chord.offset, text.length)] ?? 0;
          const name = transposeChord(chord.name, transpose);
          return (
            <span
              key={`${chord.name}-${chord.offset}-${index}`}
              className={cn(
                "absolute top-0 z-10 max-w-36 truncate font-mono text-[12px] font-semibold leading-none",
                variant === "editor"
                  ? "cursor-pointer rounded border border-[#93C5FD] bg-[#EFF6FF] px-1.5 py-0.5 text-[#2563EB]"
                  : "text-[#2563EB]",
              )}
              style={{ left }}
              title={variant === "editor" ? `Remove ${name}` : undefined}
              onClick={() => onRemoveChord?.(index)}
            >
              {name}
            </span>
          );
        })}
      </div>
      {variant === "editor" ? (
        <>
          <input
            ref={inputRef}
            value={text}
            placeholder={placeholder}
            className={cn(
              "w-full border-0 bg-transparent p-0 text-zinc-800 outline-none placeholder:text-zinc-400",
              LYRIC_TEXT,
            )}
            onSelect={(event) =>
              onCursor?.(event.currentTarget.selectionStart ?? 0)
            }
            onClick={(event) =>
              onCursor?.(event.currentTarget.selectionStart ?? 0)
            }
            onKeyUp={(event) =>
              onCursor?.(event.currentTarget.selectionStart ?? 0)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onEnter?.();
              }
            }}
            onChange={(event) => onChangeText?.(event.target.value)}
          />
          <div className="absolute top-0 right-0 flex flex-col items-end">
            {showHint ? (
              <span className="mb-0.5 text-[10px] font-medium text-[#3B82F6]">
                + Chord above cursor
              </span>
            ) : null}
            <button
              type="button"
              onClick={onRequestChord}
              className="inline-flex items-center gap-1 rounded-md border border-[#93C5FD] bg-white px-2 py-1 text-[12px] font-medium text-[#2563EB] hover:bg-[#EFF6FF]"
            >
              <Music className="size-3.5" />
              Chord
            </button>
          </div>
        </>
      ) : (
        <p className={cn("text-zinc-800", LYRIC_TEXT, "whitespace-pre-wrap")}>
          {text || " "}
        </p>
      )}
    </div>
  );
}
