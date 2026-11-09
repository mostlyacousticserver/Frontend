"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  Maximize2,
  Minus,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { SongAPI } from "@/api/songs";
import {
  DraftFaqsEditor,
  toCreateFaqPayload,
  type DraftFaq,
} from "@/components/admin/DraftFaqsEditor";
import { EntityFaqsEditor } from "@/components/admin/EntityFaqsEditor";
import { SongBlockEditor } from "@/components/admin/SongBlockEditor";
import { SongHeroField } from "@/components/admin/SongHeroField";
import { SongSheet } from "@/components/songs/SongSheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { createStarterSongContent } from "@/lib/song-content";
import { syncLyricsFromSource, updateBlocks } from "@/lib/song-sync";
import { cn } from "@/lib/utils";
import type {
  SongContentV1,
  SongDetail,
  SongDifficulty,
} from "@/types/song";
import {
  SONG_DIFFICULTIES,
  SONG_GENRES,
  SONG_KEYS,
  SONG_LANGUAGES,
  SONG_TIME_SIGNATURES,
  SONG_TUNINGS,
} from "@/types/song";

type EditorState = {
  title: string;
  artist: string;
  description: string;
  heroImageUrl: string;
  genre: string;
  language: string;
  musicalKey: string;
  capoFret: number;
  bpm: string;
  timeSignature: string;
  tuning: string;
  tags: string[];
  defaultDifficulty: SongDifficulty;
  isPublished: boolean;
  content: SongContentV1;
};

function fromSong(song?: SongDetail): EditorState {
  return {
    title: song?.title ?? "",
    artist: song?.artist ?? "",
    description: song?.description ?? "",
    heroImageUrl: song?.heroImageUrl ?? "",
    genre: song?.genre ?? "Folk",
    language: song?.language ?? "English",
    musicalKey: song?.musicalKey ?? "Am",
    capoFret: song?.capoFret ?? 0,
    bpm: song?.bpm != null ? String(song.bpm) : "",
    timeSignature: song?.timeSignature ?? "4/4",
    tuning: song?.tuning ?? "Standard (E A D G B E)",
    tags: song?.tags ?? [],
    defaultDifficulty: song?.defaultDifficulty ?? "beginner",
    isPublished: song?.isPublished ?? false,
    content: song?.content ?? createStarterSongContent(),
  };
}

function toPayload(state: EditorState) {
  const bpm = state.bpm.trim() ? Number(state.bpm) : undefined;
  return {
    title: state.title.trim(),
    artist: state.artist.trim(),
    description: state.description.trim() || undefined,
    heroImageUrl: state.heroImageUrl.trim() || undefined,
    genre: state.genre || undefined,
    language: state.language,
    musicalKey: state.musicalKey || undefined,
    capoFret: state.capoFret,
    bpm: Number.isFinite(bpm) ? bpm : undefined,
    timeSignature: state.timeSignature || undefined,
    tuning: state.tuning || undefined,
    tags: state.tags,
    defaultDifficulty: state.defaultDifficulty,
    content: state.content,
    isPublished: state.isPublished,
  };
}

export function SongEditor({ song }: { song?: SongDetail }) {
  const router = useRouter();
  const [state, setState] = useState<EditorState>(() => fromSong(song));
  const [difficulty, setDifficulty] = useState<SongDifficulty>(
    song?.defaultDifficulty ?? "beginner",
  );
  const [transpose, setTranspose] = useState(0);
  const [focus, setFocus] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [songId, setSongId] = useState(song?.id);
  const [draftFaqs, setDraftFaqs] = useState<DraftFaq[]>([]);

  useEffect(() => {
    if (song) {
      setState(fromSong(song));
      setSongId(song.id);
    }
  }, [song]);

  const blocks = state.content.arrangements[difficulty].blocks;

  const previewSong = useMemo(
    () => ({
      title: state.title,
      artist: state.artist,
      description: state.description || null,
      heroImageUrl: state.heroImageUrl || null,
      genre: state.genre || null,
      musicalKey: state.musicalKey || null,
      capoFret: state.capoFret,
      bpm: state.bpm.trim() ? Number(state.bpm) : null,
      tags: state.tags,
      defaultDifficulty: difficulty,
    }),
    [state, difficulty],
  );

  function patch(partial: Partial<EditorState>) {
    setState((current) => ({ ...current, ...partial }));
  }

  async function save(publish?: boolean) {
    if (!state.title.trim() || !state.artist.trim()) {
      toast.error("Title and artist are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = toPayload({
        ...state,
        isPublished: publish ?? state.isPublished,
      });
      if (!songId) {
        const faqs = toCreateFaqPayload(draftFaqs);
        const created = await SongAPI.create({
          ...payload,
          ...(faqs.length > 0 ? { faqs } : {}),
        });
        setSongId(created.data.id);
        setState(fromSong(created.data));
        setDraftFaqs([]);
        toast.success(publish ? "Song published" : "Song saved");
        router.replace(`/admin/songs/${created.data.id}`);
        return;
      }
      const updated = await SongAPI.update(songId, payload);
      setState(fromSong(updated.data));
      toast.success(publish ? "Song published" : "Song saved");
    } catch {
      // interceptor toast
    } finally {
      setSaving(false);
    }
  }

  async function confirmRemove() {
    if (!songId) {
      router.push("/admin/songs");
      return;
    }
    setDeleting(true);
    try {
      await SongAPI.remove(songId);
      toast.success("Song deleted");
      router.push("/admin/songs");
    } catch {
      // interceptor toast
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  const heading =
    state.title && state.artist
      ? `${state.title} · ${state.artist}`
      : state.title || "New song";

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f3f6f8] text-brand-navy">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-brand-navy px-4 py-2.5 text-white">
        <div className="flex min-w-0 items-center gap-2">
          <SidebarTrigger className="-ml-1 text-white/80 hover:bg-white/10 hover:text-white" />
          <Link
            href="/admin/songs"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/70 hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Songs
          </Link>
          <span className="truncate text-[15px] font-semibold text-white">
            {heading}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
              state.isPublished
                ? "bg-teal-50 text-teal-700"
                : "bg-white/10 text-white/70",
            )}
          >
            {state.isPublished ? "Published" : "Draft"}
          </span>
          <GhostBtn onClick={() => setFocus((v) => !v)}>
            <Maximize2 className="size-3.5" />
            {focus ? "Exit focus" : "Focus"}
          </GhostBtn>
          <GhostBtn
            onClick={() => {
              if (song?.slug && state.isPublished) {
                window.open(`/songs/${song.slug}`, "_blank");
                return;
              }
              toast.success("Live preview is the right pane.");
            }}
          >
            <Eye className="size-3.5" />
            Preview
          </GhostBtn>
          <GhostBtn disabled={saving} onClick={() => void save()}>
            <Save className="size-3.5" />
            Save
          </GhostBtn>
          <button
            type="button"
            className="rounded-md p-2 text-white/60 hover:bg-white/10 hover:text-white"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="size-4" />
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void save(true)}
            className="rounded-lg bg-brand-orange px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-brand-orange-hover disabled:opacity-60"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border bg-white px-5 py-2">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center rounded-lg bg-teal-50 p-0.5">
            {SONG_DIFFICULTIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setDifficulty(item)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[13px] font-medium capitalize",
                  difficulty === item
                    ? "bg-brand-navy text-white shadow-sm"
                    : "text-brand-navy/60 hover:text-brand-navy",
                )}
              >
                {item === "pro" ? "Pro" : item}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-[13px] text-zinc-600">
            <Checkbox
              checked={state.content.syncLyrics}
              onCheckedChange={(checked) => {
                const syncLyrics = checked === true;
                patch({
                  content: syncLyrics
                    ? syncLyricsFromSource(
                        { ...state.content, syncLyrics },
                        difficulty,
                      )
                    : { ...state.content, syncLyrics },
                });
              }}
            />
            Sync lyrics across difficulty levels
          </label>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-zinc-500">
          Transpose
          <button
            type="button"
            className="flex size-7 items-center justify-center rounded-md border border-zinc-200"
            onClick={() => setTranspose((n) => n - 1)}
          >
            <Minus className="size-3.5" />
          </button>
          <span className="w-5 text-center font-semibold text-zinc-800">
            {transpose}
          </span>
          <button
            type="button"
            className="flex size-7 items-center justify-center rounded-md border border-zinc-200"
            onClick={() => setTranspose((n) => n + 1)}
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "grid min-h-0 flex-1 grid-cols-1",
          !focus && "xl:grid-cols-2",
        )}
      >
        <div className="min-h-0 overflow-y-auto border-zinc-200 px-6 py-5 xl:border-r">
          <div className="mx-auto max-w-[640px] space-y-5">
            {!focus ? (
              <>
                <SongHeroField
                  songId={songId}
                  value={state.heroImageUrl}
                  disabled={saving}
                  onChange={(heroImageUrl) => patch({ heroImageUrl })}
                />
                <input
                  value={state.title}
                  onChange={(event) => patch({ title: event.target.value })}
                  placeholder="Song title"
                  className="w-full border-0 bg-transparent p-0 text-[32px] font-bold leading-tight tracking-tight text-zinc-900 outline-none placeholder:text-zinc-300"
                />
                <input
                  value={state.artist}
                  onChange={(event) => patch({ artist: event.target.value })}
                  placeholder="Artist"
                  className="w-full border-0 bg-transparent p-0 text-[16px] text-zinc-400 outline-none placeholder:text-zinc-300"
                />
                <textarea
                  value={state.description}
                  onChange={(event) => patch({ description: event.target.value })}
                  placeholder="A short description of the song"
                  rows={2}
                  className="w-full resize-none border-0 bg-transparent p-0 text-[15px] leading-7 text-zinc-500 outline-none placeholder:text-zinc-300"
                />
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
                  <MetaField label="Genre">
                    <NativeSelect
                      value={state.genre}
                      onChange={(genre) => patch({ genre })}
                      options={SONG_GENRES}
                    />
                  </MetaField>
                  <MetaField label="Language">
                    <NativeSelect
                      value={state.language}
                      onChange={(language) => patch({ language })}
                      options={SONG_LANGUAGES}
                    />
                  </MetaField>
                  <MetaField label="Key">
                    <NativeSelect
                      value={state.musicalKey}
                      onChange={(musicalKey) => patch({ musicalKey })}
                      options={SONG_KEYS}
                    />
                  </MetaField>
                  <MetaField label="Capo">
                    <NativeSelect
                      value={String(state.capoFret)}
                      onChange={(value) => patch({ capoFret: Number(value) })}
                      options={Array.from({ length: 13 }, (_, fret) => ({
                        value: String(fret),
                        label: fret === 0 ? "None" : `${fret}${ordinal(fret)} fret`,
                      }))}
                    />
                  </MetaField>
                  <MetaField label="BPM">
                    <input
                      value={state.bpm}
                      onChange={(event) => patch({ bpm: event.target.value })}
                      placeholder="108"
                      inputMode="numeric"
                      className="h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-[13px] outline-none focus:border-brand-orange"
                    />
                  </MetaField>
                  <MetaField label="Time Signature">
                    <NativeSelect
                      value={state.timeSignature}
                      onChange={(timeSignature) => patch({ timeSignature })}
                      options={SONG_TIME_SIGNATURES}
                    />
                  </MetaField>
                  <MetaField label="Tuning" className="sm:col-span-2">
                    <NativeSelect
                      value={state.tuning}
                      onChange={(tuning) => patch({ tuning })}
                      options={SONG_TUNINGS}
                    />
                  </MetaField>
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
                    Tags
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
                    {state.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[12px] font-medium text-brand-orange"
                      >
                        {tag}
                        <button
                          type="button"
                          aria-label={`Remove ${tag}`}
                          className="rounded-full p-0.5 hover:bg-orange-100"
                          onClick={() =>
                            patch({
                              tags: state.tags.filter((item) => item !== tag),
                            })
                          }
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      value={tagInput}
                      placeholder="Add a tag and press Enter"
                      className="min-w-40 flex-1 border-0 bg-transparent text-[13px] outline-none placeholder:text-zinc-400"
                      onChange={(event) => setTagInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key !== "Enter") return;
                        event.preventDefault();
                        const tag = tagInput
                          .trim()
                          .replace(/^#/, "")
                          .toLowerCase();
                        if (!tag || state.tags.includes(tag)) return;
                        patch({ tags: [...state.tags, tag] });
                        setTagInput("");
                      }}
                    />
                  </div>
                </div>
                <div className="border-t border-zinc-100 pt-2" />
              </>
            ) : null}

            <SongBlockEditor
              blocks={blocks}
              songId={songId}
              onChange={(nextBlocks) =>
                patch({
                  content: updateBlocks(state.content, difficulty, nextBlocks),
                })
              }
            />

            {!focus ? (
              <div className="border-t border-zinc-100 pt-5">
                {songId ? (
                  <EntityFaqsEditor ownerType="song" ownerId={songId} />
                ) : (
                  <DraftFaqsEditor
                    faqs={draftFaqs}
                    disabled={saving}
                    onChange={setDraftFaqs}
                    description="Optional. These are saved with the song on first create. You can edit them after saving."
                  />
                )}
              </div>
            ) : null}
          </div>
        </div>

        {focus ? null : (
          <div className="min-h-0 overflow-y-auto bg-[#F4F6F8] px-6 py-5">
            <div className="mx-auto max-w-[560px]">
              <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-zinc-400 uppercase">
                <Eye className="size-3.5" />
                Live preview
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-6 shadow-[0_10px_32px_rgba(15,23,42,0.04)]">
                <SongSheet
                  song={previewSong}
                  blocks={blocks}
                  transpose={transpose}
                  showHero={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this song?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. The chord sheet will be removed from the
              public catalog if it was published.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={() => void confirmRemove()}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function GhostBtn({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-white/75 hover:bg-white/10 hover:text-white disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function MetaField({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 block text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}

function NativeSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[] | { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-[13px] text-zinc-800 outline-none focus:border-brand-orange"
    >
      {options.map((option) => {
        const item =
          typeof option === "string"
            ? { value: option, label: option }
            : option;
        return (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        );
      })}
    </select>
  );
}

function ordinal(n: number) {
  if (n === 1) return "st";
  if (n === 2) return "nd";
  if (n === 3) return "rd";
  return "th";
}
