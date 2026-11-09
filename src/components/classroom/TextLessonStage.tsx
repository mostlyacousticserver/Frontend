"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize, Minimize } from "lucide-react";
import {
  ARTICLE_PROSE_CLASS,
  looksLikeHtml,
  sanitizeLessonHtml,
} from "@/lib/lesson-html";

type TextLessonStageProps = {
  title: string;
  body: string;
};

export function TextLessonStage({ title, body }: TextLessonStageProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    function onFs() {
      setFullscreen(document.fullscreenElement === shellRef.current);
    }
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const shell = shellRef.current;
    if (!shell) return;
    try {
      if (document.fullscreenElement === shell) {
        await document.exitFullscreen();
      } else {
        await shell.requestFullscreen();
      }
    } catch {
      // Browser blocked fullscreen without a user gesture.
    }
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        void toggleFullscreen();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleFullscreen]);

  const content = body.trim();

  return (
    <div
      ref={shellRef}
      className={`relative flex flex-col overflow-hidden rounded-2xl border border-[#E8EEF2] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] ${
        fullscreen ? "h-full w-full" : "aspect-video"
      }`}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#E8EEF2] bg-[#F8FAFB] px-4 py-2.5">
        <p className="min-w-0 truncate font-sans text-[12px] font-semibold text-[#6B7280]">
          Article · Press F for fullscreen
        </p>
        <button
          type="button"
          onClick={() => void toggleFullscreen()}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-[#374151] transition-colors hover:bg-white hover:text-[#0DA694]"
          aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {fullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white">
        <article className="mx-auto w-full max-w-3xl px-5 py-6 sm:px-8 sm:py-8">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0DA694]">
            Lesson reading
          </p>
          <h2 className="mt-2 font-sans text-[22px] font-bold leading-snug text-[#111111] sm:text-[26px]">
            {title}
          </h2>

          {content ? (
            looksLikeHtml(content) ? (
              <div
                className={`mt-6 ${ARTICLE_PROSE_CLASS}`}
                dangerouslySetInnerHTML={{
                  __html: sanitizeLessonHtml(content),
                }}
              />
            ) : (
              <div className="mt-6 whitespace-pre-wrap font-sans text-[15px] leading-7 text-[#374151]">
                {content}
              </div>
            )
          ) : (
            <p className="mt-6 font-sans text-[15px] leading-7 text-[#6B7280]">
              This article has no content yet.
            </p>
          )}
        </article>
      </div>
    </div>
  );
}
