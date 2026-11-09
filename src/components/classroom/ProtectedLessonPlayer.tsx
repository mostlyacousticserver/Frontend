"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SKIP_SECONDS = 5;
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const;

function formatClock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const hours = Math.floor(whole / 3600);
  const mins = Math.floor((whole % 3600) / 60);
  const secs = whole % 60;
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function ProtectedLessonPlayer({
  url,
  startSeconds,
  onTimeUpdate,
  onEnded,
}: {
  url: string;
  startSeconds: number;
  onTimeUpdate: (seconds: number) => void;
  onEnded: () => void;
}) {
  const shellRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const clickTimer = useRef(0);
  const hideTimer = useRef(0);
  const lastEmit = useRef(0);
  const skipTimer = useRef(0);

  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsOn, setControlsOn] = useState(true);
  const [speedOpen, setSpeedOpen] = useState(false);
  const [skipHint, setSkipHint] = useState<"back" | "forward" | null>(null);

  const showControls = useCallback((sticky = false) => {
    setControlsOn(true);
    window.clearTimeout(hideTimer.current);
    if (sticky) return;
    const video = videoRef.current;
    if (video && !video.paused) {
      hideTimer.current = window.setTimeout(() => {
        setSpeedOpen(false);
        setControlsOn(false);
      }, 2800);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.disablePictureInPicture = true;
    video.playbackRate = speed;
    const onLoaded = () => {
      setDuration(video.duration || 0);
      if (startSeconds > 2 && startSeconds < video.duration) {
        video.currentTime = startSeconds;
        setCurrent(startSeconds);
      }
    };
    const onProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };
    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("progress", onProgress);
    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("progress", onProgress);
    };
  }, [url, startSeconds, speed]);

  useEffect(() => {
    function onFs() {
      setFullscreen(document.fullscreenElement === shellRef.current);
    }
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const seekTo = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;
    const next = Math.min(Math.max(time, 0), video.duration || 0);
    video.currentTime = next;
    setCurrent(next);
    setEnded(false);
  }, []);

  const skip = useCallback(
    (delta: number) => {
      const video = videoRef.current;
      if (!video) return;
      seekTo(video.currentTime + delta);
      setSkipHint(delta < 0 ? "back" : "forward");
      window.clearTimeout(skipTimer.current);
      skipTimer.current = window.setTimeout(() => setSkipHint(null), 700);
      showControls();
    },
    [seekTo, showControls],
  );

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setEnded(false);
    } else {
      video.pause();
    }
    showControls();
  }, [showControls]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    showControls();
  }, [showControls]);

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
    showControls();
  }, [showControls]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }
      const key = event.key.toLowerCase();
      if (key === " " || key === "k") {
        event.preventDefault();
        togglePlay();
      } else if (key === "arrowleft") {
        event.preventDefault();
        skip(-SKIP_SECONDS);
      } else if (key === "arrowright") {
        event.preventDefault();
        skip(SKIP_SECONDS);
      } else if (key === "f") {
        event.preventDefault();
        void toggleFullscreen();
      } else if (key === "m") {
        event.preventDefault();
        toggleMute();
      } else if (event.shiftKey && (event.key === ">" || event.key === "." || event.code === "Period")) {
        event.preventDefault();
        const index = SPEEDS.indexOf(speed as (typeof SPEEDS)[number]);
        const next = SPEEDS[Math.min(index + 1, SPEEDS.length - 1)] ?? 1;
        const video = videoRef.current;
        if (video) video.playbackRate = next;
        setSpeed(next);
        showControls();
      } else if (event.shiftKey && (event.key === "<" || event.key === "," || event.code === "Comma")) {
        event.preventDefault();
        const index = SPEEDS.indexOf(speed as (typeof SPEEDS)[number]);
        const next = SPEEDS[Math.max(index - 1, 0)] ?? 1;
        const video = videoRef.current;
        if (video) video.playbackRate = next;
        setSpeed(next);
        showControls();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skip, speed, showControls, toggleFullscreen, toggleMute, togglePlay]);

  useEffect(() => {
    return () => {
      window.clearTimeout(hideTimer.current);
      window.clearTimeout(skipTimer.current);
      window.clearTimeout(clickTimer.current);
    };
  }, []);

  const playedPct = duration > 0 ? (current / duration) * 100 : 0;
  const bufferedPct = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={shellRef}
      tabIndex={0}
      className={cn(
        "relative bg-black outline-none select-none",
        fullscreen ? "flex h-full w-full items-center justify-center" : "aspect-video",
      )}
      onMouseMove={() => showControls()}
      onMouseLeave={() => {
        if (playing && !speedOpen) setControlsOn(false);
      }}
      onClick={() => {
        window.clearTimeout(clickTimer.current);
        clickTimer.current = window.setTimeout(() => togglePlay(), 220);
      }}
      onDoubleClick={() => {
        window.clearTimeout(clickTimer.current);
        void toggleFullscreen();
      }}
    >
      <video
        ref={videoRef}
        key={url}
        className="h-full w-full object-contain"
        controls={false}
        controlsList="nodownload noremoteplayback noplaybackrate"
        disablePictureInPicture
        disableRemotePlayback
        playsInline
        src={url}
        onContextMenu={(event) => event.preventDefault()}
        onPlay={() => {
          setPlaying(true);
          setEnded(false);
          showControls();
        }}
        onPause={() => {
          setPlaying(false);
          setControlsOn(true);
        }}
        onTimeUpdate={(event) => {
          const seconds = event.currentTarget.currentTime;
          setCurrent(seconds);
          const whole = Math.floor(seconds);
          if (whole - lastEmit.current >= 10) {
            lastEmit.current = whole;
            onTimeUpdate(whole);
          }
        }}
        onEnded={() => {
          setPlaying(false);
          setEnded(true);
          setControlsOn(true);
          onEnded();
        }}
      />

      {skipHint ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full bg-black/55 text-white",
              skipHint === "back" ? "-translate-x-24" : "translate-x-24",
            )}
          >
            <span className="font-sans text-[13px] font-semibold">
              {skipHint === "back" ? `−${SKIP_SECONDS}s` : `+${SKIP_SECONDS}s`}
            </span>
          </div>
        </div>
      ) : null}

      {!playing ? (
        <button
          type="button"
          className="absolute inset-0 z-[1] flex items-center justify-center"
          onClick={(event) => {
            event.stopPropagation();
            togglePlay();
          }}
          aria-label={ended ? "Replay" : "Play"}
        >
          <span className="inline-flex size-16 items-center justify-center rounded-full bg-[#11C5BB] text-white shadow-[0_12px_28px_rgba(17,197,187,0.45)] sm:size-[72px]">
            {ended ? (
              <RotateCcw size={28} />
            ) : (
              <Play size={30} className="ml-1" fill="currentColor" />
            )}
          </span>
        </button>
      ) : null}

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-black/85 via-black/45 to-transparent px-3 pb-2.5 pt-10 transition-opacity duration-200 sm:px-4 sm:pb-3",
          controlsOn ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={(event) => event.stopPropagation()}
        onDoubleClick={(event) => event.stopPropagation()}
      >
        <label className="relative mb-2 block h-3 cursor-pointer">
          <span className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-white/25">
            <span
              className="absolute inset-y-0 left-0 bg-white/40"
              style={{ width: `${bufferedPct}%` }}
            />
            <span
              className="absolute inset-y-0 left-0 bg-[#11C5BB]"
              style={{ width: `${playedPct}%` }}
            />
          </span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Number.isFinite(current) ? current : 0}
            aria-label="Seek"
            className="lesson-seek relative z-[1] h-3 w-full cursor-pointer"
            onChange={(event) => seekTo(Number(event.target.value))}
          />
        </label>

        <div className="flex items-center gap-1.5 text-white sm:gap-2">
          <IconButton label={playing ? "Pause" : "Play"} onClick={togglePlay}>
            {playing ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <Play size={18} fill="currentColor" className="ml-0.5" />
            )}
          </IconButton>
          <IconButton
            label={`Rewind ${SKIP_SECONDS} seconds`}
            onClick={() => skip(-SKIP_SECONDS)}
          >
            <SkipBadge seconds={SKIP_SECONDS} back />
          </IconButton>
          <IconButton
            label={`Forward ${SKIP_SECONDS} seconds`}
            onClick={() => skip(SKIP_SECONDS)}
          >
            <SkipBadge seconds={SKIP_SECONDS} />
          </IconButton>

          <div className="group/volume flex items-center">
            <IconButton label={muted || volume === 0 ? "Unmute" : "Mute"} onClick={toggleMute}>
              {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </IconButton>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              aria-label="Volume"
              className="lesson-volume w-0 overflow-hidden opacity-0 transition-all duration-200 group-hover/volume:ml-1 group-hover/volume:w-20 group-hover/volume:opacity-100"
              onChange={(event) => {
                const next = Number(event.target.value);
                const video = videoRef.current;
                if (!video) return;
                video.volume = next;
                video.muted = next === 0;
                setVolume(next);
                setMuted(next === 0);
              }}
            />
          </div>

          <p className="ml-1 font-sans text-[12px] tabular-nums text-white/90 sm:text-[13px]">
            {formatClock(current)}{" "}
            <span className="text-white/55">/ {formatClock(duration)}</span>
          </p>

          <div className="relative ml-auto">
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1 rounded px-1.5 font-sans text-[12px] font-semibold text-white hover:bg-white/10 sm:text-[13px]"
              onClick={() => {
                setSpeedOpen((open) => !open);
                showControls(true);
              }}
              aria-label="Playback speed"
            >
              <Settings size={16} />
              <span>{speed === 1 ? "1x" : `${speed}x`}</span>
            </button>
            {speedOpen ? (
              <div className="absolute right-0 bottom-11 w-36 overflow-hidden rounded-md bg-[#1c1d1f] py-1 shadow-xl">
                <p className="px-3 py-1.5 font-sans text-[11px] font-semibold tracking-wide text-white/50 uppercase">
                  Speed
                </p>
                {SPEEDS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={cn(
                      "flex w-full items-center px-3 py-1.5 text-left font-sans text-[13px] text-white hover:bg-white/10",
                      value === speed && "bg-white/10 font-semibold",
                    )}
                    onClick={() => {
                      const video = videoRef.current;
                      if (video) video.playbackRate = value;
                      setSpeed(value);
                      setSpeedOpen(false);
                    }}
                  >
                    {value === 1 ? "Normal" : `${value}x`}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <IconButton
            label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            onClick={() => void toggleFullscreen()}
          >
            {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </IconButton>
        </div>
      </div>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex size-9 items-center justify-center rounded text-white hover:bg-white/10"
    >
      {children}
    </button>
  );
}

function SkipBadge({ seconds, back }: { seconds: number; back?: boolean }) {
  return (
    <span className="relative inline-flex size-[18px] items-center justify-center">
      <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" aria-hidden>
        <path
          d={
            back
              ? "M7 8v8M11 7.5c-2.4 1.1-4 3.5-4 6.5 0 3.9 3.1 7 7 7s7-3.1 7-7-3.1-7-7-7"
              : "M17 8v8M13 7.5c2.4 1.1 4 3.5 4 6.5 0 3.9-3.1 7-7 7s-7-3.1-7-7 3.1-7 7-7"
          }
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute top-[7px] font-sans text-[8px] font-bold leading-none">
        {seconds}
      </span>
    </span>
  );
}
