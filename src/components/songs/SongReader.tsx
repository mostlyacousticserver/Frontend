"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { SongSheet } from "@/components/songs/SongSheet";
import { ContentFaqSection } from "@/components/content/ContentFaqSection";
import {
  SONG_DIFFICULTIES,
  type SongDetail,
  type SongDifficulty,
} from "@/types/song";

export function SongReader({ song }: { song: SongDetail }) {
  const [difficulty, setDifficulty] = useState<SongDifficulty>(
    song.defaultDifficulty,
  );
  const [transpose, setTranspose] = useState(0);
  const blocks = song.content.arrangements[difficulty]?.blocks ?? [];

  return (
    <div className="bg-white pb-20 pt-3">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 pt-8">
          <Link
            href="/songs"
            className="inline-flex items-center gap-2 font-sans text-[13px] font-medium text-[#6B7280] hover:text-[#0DA694]"
          >
            <ArrowLeft size={15} />
            Back to songs
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg bg-zinc-100 p-0.5">
              {SONG_DIFFICULTIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setDifficulty(item)}
                  className={`rounded-md px-2.5 py-1 text-[12px] font-semibold capitalize ${
                    difficulty === item
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "text-[#6B7280] hover:text-zinc-900"
                  }`}
                >
                  {item === "pro" ? "Pro" : item}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-[#6B7280]">
              Transpose
              <button
                type="button"
                className="flex size-7 items-center justify-center rounded-md border border-[#E9EEF3]"
                onClick={() => setTranspose((n) => n - 1)}
              >
                <Minus size={12} />
              </button>
              <span className="w-5 text-center font-semibold text-[#111111]">
                {transpose}
              </span>
              <button
                type="button"
                className="flex size-7 items-center justify-center rounded-md border border-[#E9EEF3]"
                onClick={() => setTranspose((n) => n + 1)}
              >
                <Plus size={12} />
              </button>
            </div>
          </div>
        </div>

        <SongSheet
          className="mt-8"
          song={{ ...song, defaultDifficulty: difficulty }}
          blocks={blocks}
          transpose={transpose}
          showHero
        />

        {(song.faqs?.length ?? 0) > 0 ? (
          <div className="mt-10 md:mt-12">
            <ContentFaqSection faqs={song.faqs ?? []} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
