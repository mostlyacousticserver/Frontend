import axios from "axios";
import { VideoAPI } from "@/api/video";
import { VIDEO_CONTENT_TYPES, type LessonVideo, type UploadPartUrl } from "@/types/video";

const PART_URL_BATCH = 100;
const UPLOAD_CONCURRENCY = 3;
const STATUS_POLL_MS = 3000;
const STATUS_POLL_TIMEOUT_MS = 10 * 60 * 1000;

const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".qt": "video/quicktime",
  ".webm": "video/webm",
  ".mkv": "video/x-matroska",
};

export type UploadPhase =
  | "preparing"
  | "uploading"
  | "completing"
  | "processing";

export type UploadProgress = {
  loaded: number;
  total: number;
  phase: UploadPhase;
};

export class UploadAbortedError extends Error {
  constructor(message = "Upload cancelled") {
    super(message);
    this.name = "UploadAbortedError";
  }
}

export function contentTypeFromFile(file: File): string | null {
  const type = file.type.toLowerCase();
  if (VIDEO_CONTENT_TYPES.includes(type as (typeof VIDEO_CONTENT_TYPES)[number])) {
    return type;
  }
  const match = file.name.toLowerCase().match(/(\.[a-z0-9]{1,10})$/);
  return match ? (CONTENT_TYPE_BY_EXTENSION[match[1]] ?? null) : null;
}

export async function getLessonVideo(
  lessonId: string,
): Promise<LessonVideo | null> {
  try {
    const { data } = await VideoAPI.getByLesson(lessonId);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function readVideoDurationSeconds(
  file: File,
): Promise<number | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    let settled = false;
    const finish = (seconds: number | null) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      video.onloadedmetadata = null;
      video.ontimeupdate = null;
      video.onerror = null;
      video.removeAttribute("src");
      video.load();
      URL.revokeObjectURL(url);
      resolve(
        seconds != null && Number.isFinite(seconds) && seconds > 0
          ? Math.round(seconds)
          : null,
      );
    };

    const timer = window.setTimeout(() => finish(null), 8000);

    video.onloadedmetadata = () => {
      const duration = video.duration;
      if (Number.isFinite(duration) && duration > 0) {
        finish(duration);
        return;
      }
      video.ontimeupdate = () => {
        if (Number.isFinite(video.duration) && video.duration > 0) {
          finish(video.duration);
        }
      };
      try {
        video.currentTime = Number.MAX_SAFE_INTEGER;
      } catch {
        finish(null);
      }
    };
    video.onerror = () => finish(null);
    video.src = url;
  });
}

export async function uploadLessonVideo(options: {
  lessonId: string;
  file: File;
  contentType: string;
  signal?: AbortSignal;
  onProgress?: (progress: UploadProgress) => void;
}): Promise<LessonVideo> {
  const { lessonId, file, contentType, signal, onProgress } = options;
  const report = (progress: UploadProgress) => onProgress?.(progress);

  const durationPromise = readVideoDurationSeconds(file);

  throwIfAborted(signal);
  report({ loaded: 0, total: file.size, phase: "preparing" });

  await replaceExistingVideo(lessonId, signal);

  throwIfAborted(signal);
  const initiated = await VideoAPI.initiateForLesson(lessonId, {
    fileName: file.name,
    contentType,
    fileSize: file.size,
  });

  const { videoId, partSize, maxParts } = initiated.data;
  let multipartFinished = false;

  try {
    throwIfAborted(signal);
    const parts = await ensurePartUrls(
      videoId,
      maxParts,
      initiated.data.parts ?? [],
    );

    report({ loaded: 0, total: file.size, phase: "uploading" });
    const completed = await uploadParts({
      file,
      videoId,
      partSize,
      parts,
      signal,
      onBytes: (loaded) =>
        report({ loaded, total: file.size, phase: "uploading" }),
    });

    throwIfAborted(signal);
    report({
      loaded: file.size,
      total: file.size,
      phase: "completing",
    });
    const durationSeconds = await settleDuration(durationPromise);
    const { data: video } = await VideoAPI.complete(videoId, {
      parts: completed,
      ...(durationSeconds ? { durationSeconds } : {}),
    });
    multipartFinished = true;

    report({
      loaded: file.size,
      total: file.size,
      phase: "processing",
    });
    return pollUntilSettled(video, signal, () =>
      report({
        loaded: file.size,
        total: file.size,
        phase: "processing",
      }),
    );
  } catch (error) {
    if (!multipartFinished) {
      await VideoAPI.abort(videoId).catch(() => undefined);
    }
    if (isAbortError(error)) {
      throw new UploadAbortedError();
    }
    throw error;
  }
}

async function replaceExistingVideo(
  lessonId: string,
  signal?: AbortSignal,
) {
  throwIfAborted(signal);
  const existing = await getLessonVideo(lessonId);
  if (!existing) return;

  if (existing.processingStatus === "PROCESSING") {
    throw new Error(
      "This lesson's video is still processing. Wait until it finishes before replacing it.",
    );
  }

  throwIfAborted(signal);
  if (existing.processingStatus === "UPLOADING") {
    await VideoAPI.abort(existing.id);
    return;
  }

  await VideoAPI.remove(existing.id);
}

async function ensurePartUrls(
  videoId: string,
  maxParts: number,
  existing: UploadPartUrl[],
): Promise<UploadPartUrl[]> {
  const byNumber = new Map(existing.map((part) => [part.partNumber, part.url]));
  const missing: number[] = [];
  for (let n = 1; n <= maxParts; n += 1) {
    if (!byNumber.has(n)) missing.push(n);
  }

  for (let i = 0; i < missing.length; i += PART_URL_BATCH) {
    const partNumbers = missing.slice(i, i + PART_URL_BATCH);
    const { data } = await VideoAPI.requestParts(videoId, { partNumbers });
    for (const part of data.parts) {
      byNumber.set(part.partNumber, part.url);
    }
  }

  return Array.from(byNumber.entries())
    .map(([partNumber, url]) => ({ partNumber, url }))
    .sort((a, b) => a.partNumber - b.partNumber);
}

async function uploadParts(options: {
  file: File;
  videoId: string;
  partSize: number;
  parts: UploadPartUrl[];
  signal?: AbortSignal;
  onBytes: (loaded: number) => void;
}): Promise<{ partNumber: number; etag: string }[]> {
  const { file, videoId, partSize, parts, signal, onBytes } = options;
  const completed: { partNumber: number; etag: string }[] = new Array(
    parts.length,
  );
  let loaded = 0;

  await runPool(parts, UPLOAD_CONCURRENCY, async (part, index) => {
    throwIfAborted(signal);
    const offset = (part.partNumber - 1) * partSize;
    const slice = file.slice(offset, Math.min(offset + partSize, file.size));
    const blob = slice.type
      ? new Blob([slice], { type: "" })
      : slice;
    const etag = await putPartWithRetry(videoId, part, blob, signal);
    completed[index] = { partNumber: part.partNumber, etag };
    loaded += blob.size;
    onBytes(Math.min(loaded, file.size));
  });

  return completed;
}

async function putPartWithRetry(
  videoId: string,
  part: UploadPartUrl,
  blob: Blob,
  signal?: AbortSignal,
): Promise<string> {
  try {
    return await putPart(part.url, blob, signal);
  } catch (error) {
    if (isAbortError(error)) throw error;
    const { data } = await VideoAPI.requestParts(videoId, {
      partNumbers: [part.partNumber],
    });
    const refreshed = data.parts[0];
    if (!refreshed) throw error;
    return putPart(refreshed.url, blob, signal);
  }
}

async function putPart(
  url: string,
  blob: Blob,
  signal?: AbortSignal,
): Promise<string> {
  const response = await fetch(url, {
    method: "PUT",
    body: blob,
    signal,
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `S3 upload failed (${response.status})${text ? `: ${text.slice(0, 200)}` : ""}`,
    );
  }
  const etag =
    response.headers.get("etag") ?? response.headers.get("ETag");
  if (!etag) {
    throw new Error(
      "S3 did not return an ETag. Check that the bucket CORS rule exposes the ETag header.",
    );
  }
  return etag;
}

async function pollUntilSettled(
  video: LessonVideo,
  signal: AbortSignal | undefined,
  onTick: () => void,
): Promise<LessonVideo> {
  if (
    video.processingStatus === "READY" ||
    video.processingStatus === "FAILED"
  ) {
    if (video.processingStatus === "FAILED") {
      throw new Error(video.processingError || "Video processing failed");
    }
    return video;
  }

  const deadline = Date.now() + STATUS_POLL_TIMEOUT_MS;
  let last = video;

  while (Date.now() < deadline) {
    throwIfAborted(signal);
    await sleep(STATUS_POLL_MS, signal);
    throwIfAborted(signal);
    onTick();
    const { data: status } = await VideoAPI.status(last.id);
    if (status.status === "FAILED") {
      throw new Error(status.error || "Video processing failed");
    }
    if (status.status === "READY") {
      const { data } = await VideoAPI.get(last.id);
      return data;
    }
    last = {
      ...last,
      processingStatus: status.status,
      durationSeconds: status.durationSeconds ?? last.durationSeconds,
      processingJobId: status.processingJobId,
      processingError: status.error,
      processingStartedAt: status.processingStartedAt,
      processingCompletedAt: status.processingCompletedAt,
    };
  }

  return last;
}

async function runPool<T>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<void>,
) {
  let next = 0;
  async function run() {
    while (next < items.length) {
      const index = next;
      next += 1;
      const item = items[index];
      if (item === undefined) return;
      await worker(item, index);
    }
  }
  const size = Math.min(concurrency, items.length);
  await Promise.all(Array.from({ length: size }, () => run()));
}

function settleDuration(promise: Promise<number | null>) {
  return promise.catch(() => null);
}

function throwIfAborted(signal?: AbortSignal) {
  if (!signal?.aborted) return;
  throw new UploadAbortedError();
}

function isAbortError(error: unknown) {
  return (
    error instanceof UploadAbortedError ||
    (error instanceof DOMException && error.name === "AbortError") ||
    (error instanceof Error && error.name === "AbortError")
  );
}

function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new UploadAbortedError());
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(new UploadAbortedError());
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
