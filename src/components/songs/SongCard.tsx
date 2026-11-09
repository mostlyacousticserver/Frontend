"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { publicMediaUrl } from "@/lib/song-utils";
import type { SongListItem } from "@/types/song";
import { isRemoteImage } from "@/lib/image";

export function SongCard({
  song,
  index = 0,
}: {
  song: SongListItem;
  index?: number;
}) {
  const image = publicMediaUrl(song.heroImageUrl);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.04, 0.24),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4 }}
      className="group h-full overflow-hidden rounded-[14px] border border-[#E9EEF3] bg-white shadow-[0_6px_20px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_14px_32px_rgba(15,23,42,0.1)] sm:rounded-[18px]"
    >
      <Link
        href={`/songs/${song.slug}`}
        className="flex h-full flex-col"
        aria-label={`View ${song.title} by ${song.artist}`}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F3F4F6]">
          {image ? (
            <Image
              src={image}
              alt={`${song.title} by ${song.artist} — guitar chord sheet`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              unoptimized={isRemoteImage(image)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-[#9CA3AF]">
              {song.musicalKey ?? "Song"}
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-2.5 sm:p-3.5">
          <h3 className="line-clamp-2 font-sans text-[13px] font-bold leading-4 text-[#111111] transition-colors group-hover:text-[#0DA694] sm:text-[15px] sm:leading-5">
            {song.title}
          </h3>
          <p className="mt-1 truncate font-sans text-[11px] text-[#9CA3AF] sm:text-[13px]">
            {song.artist}
          </p>
          <p className="mt-2 font-sans text-[11px] font-medium text-[#0DA694]">
            {labelDifficulty(song.defaultDifficulty)}
            {song.genre ? ` · ${song.genre}` : ""}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}

function labelDifficulty(value: SongListItem["defaultDifficulty"]) {
  if (value === "pro") return "Pro";
  return value[0].toUpperCase() + value.slice(1);
}
