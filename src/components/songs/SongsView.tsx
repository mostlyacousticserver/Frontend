"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SongAPI } from "@/api/songs";
import { SongCard } from "@/components/songs/SongCard";
import { SONG_DIFFICULTIES, SONG_GENRES, type SongDifficulty, type SongListItem } from "@/types/song";

const PAGE_SIZE = 10;
const ease = [0.22, 1, 0.36, 1] as const;

const GENRE_FILTERS = ["All", ...SONG_GENRES] as const;

type SongsViewProps = {
  /** First page rendered on the server so the catalog is in the initial HTML. */
  initialSongs?: SongListItem[];
  initialTotal?: number;
};

export function SongsView({
  initialSongs = [],
  initialTotal = 0,
}: SongsViewProps = {}) {
  const [genre, setGenre] = useState<(typeof GENRE_FILTERS)[number]>("All");
  const [difficulty, setDifficulty] = useState<SongDifficulty | "all">("all");
  const [songs, setSongs] = useState<SongListItem[]>(initialSongs);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(initialSongs.length === 0);
  // True until the server-rendered first page has been consumed once.
  const serverRendered = useRef(initialSongs.length > 0);

  useEffect(() => {
    // The unfiltered first page already came from the server.
    if (serverRendered.current && page === 1 && genre === "All" && difficulty === "all") {
      serverRendered.current = false;
      return;
    }

    let cancelled = false;
    setLoading(true);
    SongAPI.listPublished({
      page,
      limit: PAGE_SIZE,
      genre: genre === "All" ? undefined : genre,
      difficulty: difficulty === "all" ? undefined : difficulty,
    })
      .then((response) => {
        if (cancelled) return;
        setSongs((current) =>
          page === 1 ? response.data.items : [...current, ...response.data.items],
        );
        setTotal(response.data.total);
      })
      .catch(() => {
        // interceptor
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [genre, difficulty, page]);

  function changeFilter(
    nextGenre: (typeof GENRE_FILTERS)[number],
    nextDifficulty: SongDifficulty | "all",
  ) {
    serverRendered.current = false;
    setGenre(nextGenre);
    setDifficulty(nextDifficulty);
    setPage(1);
    setSongs([]);
  }

  const hasMore = songs.length < total;
  const visible = useMemo(() => songs, [songs]);

  return (
    <div className="overflow-x-clip bg-white pb-12 pt-3 sm:pb-16 md:pb-20 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <header className="pt-8 sm:pt-10 md:pt-12 lg:pt-14">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            className="inline-flex items-center gap-1.5 font-sans text-[11px] font-medium tracking-[0.04em] text-[#6B7280] sm:text-[12px]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#11C5BB]" aria-hidden />
            Digital chord sheets · Lyrics · Practice
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease }}
            className="mt-3 max-w-2xl font-sans text-[26px] font-bold leading-[1.12] tracking-[-0.02em] text-[#111111] sm:text-[34px] md:text-[42px]"
          >
            Explore songs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease }}
            className="mt-3 max-w-xl font-sans text-[13px] leading-6 text-[#6B7280] sm:text-[15px] sm:leading-7"
          >
            Browse published guitar chord sheets with lyrics, tabs, and playing
            notes — free to read and practice.
          </motion.p>
        </header>

        <section className="mt-7 sm:mt-10" aria-labelledby="songs-heading">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <h2
              id="songs-heading"
              className="font-sans text-[16px] font-bold text-[#111111] sm:text-[20px]"
            >
              Catalog
            </h2>
            <span className="rounded-full bg-[#E6F8F5] px-3 py-1 font-sans text-[12px] font-semibold text-[#0DA694]">
              {total} {total === 1 ? "song" : "songs"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {GENRE_FILTERS.map((item) => (
              <FilterChip
                key={item}
                selected={genre === item}
                onClick={() => changeFilter(item, difficulty)}
              >
                {item}
              </FilterChip>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <FilterChip
              selected={difficulty === "all"}
              onClick={() => changeFilter(genre, "all")}
            >
              All levels
            </FilterChip>
            {SONG_DIFFICULTIES.map((item) => (
              <FilterChip
                key={item}
                selected={difficulty === item}
                onClick={() => changeFilter(genre, item)}
              >
                {item === "pro" ? "Pro" : item[0].toUpperCase() + item.slice(1)}
              </FilterChip>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${genre}-${difficulty}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease }}
              className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5"
            >
              {visible.map((song, index) => (
                <SongCard key={song.id} song={song} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>

          {!loading && songs.length === 0 ? (
            <p className="mt-10 text-center font-sans text-[14px] text-[#6B7280]">
              No published songs yet. Check back soon.
            </p>
          ) : null}

          {hasMore ? (
            <div className="mt-10 flex justify-center">
              <motion.button
                type="button"
                whileHover={{ y: -1, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                onClick={() => setPage((current) => current + 1)}
                className="inline-flex h-11 items-center justify-center rounded-full border border-[#11C5BB]/30 bg-[#EFFCF9] px-8 font-sans text-[14px] font-semibold text-[#0DA694] hover:bg-[#11C5BB] hover:text-white"
              >
                {loading ? "Loading…" : "Load more"}
              </motion.button>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function FilterChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 font-sans text-[12px] font-semibold sm:text-[13px] ${
        selected
          ? "bg-[#11C5BB] text-white shadow-[0_8px_20px_rgba(17,197,187,0.28)]"
          : "border border-[#E9EEF3] bg-white text-[#6B7280] hover:text-[#0DA694]"
      }`}
    >
      {children}
    </button>
  );
}
