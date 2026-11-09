import { MediaAPI } from "@/api/media";
import type { MediaFolder } from "@/types/media";

export class UploadAbortedError extends Error {
  constructor(message = "Upload cancelled") {
    super(message);
    this.name = "UploadAbortedError";
  }
}

const RESOURCE_BY_EXTENSION: Record<
  string,
  { contentType: string; fileType: string }
> = {
  ".pdf": { contentType: "application/pdf", fileType: "pdf" },
  ".zip": { contentType: "application/zip", fileType: "zip" },
  ".doc": { contentType: "application/msword", fileType: "doc" },
  ".docx": {
    contentType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    fileType: "docx",
  },
  ".xls": { contentType: "application/vnd.ms-excel", fileType: "xls" },
  ".xlsx": {
    contentType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    fileType: "xlsx",
  },
  ".txt": { contentType: "text/plain", fileType: "txt" },
  ".jpg": { contentType: "image/jpeg", fileType: "jpg" },
  ".jpeg": { contentType: "image/jpeg", fileType: "jpg" },
  ".png": { contentType: "image/png", fileType: "png" },
  ".webp": { contentType: "image/webp", fileType: "webp" },
  ".mp3": { contentType: "audio/mpeg", fileType: "mp3" },
  ".wav": { contentType: "audio/wav", fileType: "wav" },
};

const CONTENT_TYPE_TO_FILE_TYPE: Record<string, string> = {
  ...Object.fromEntries(
    Object.values(RESOURCE_BY_EXTENSION).map((item) => [
      item.contentType,
      item.fileType,
    ]),
  ),
  "application/x-zip-compressed": "zip",
};

export const SONG_AUDIO_ACCEPT = ["audio/mpeg", "audio/wav", ".mp3", ".wav"].join(
  ",",
);

export function songAudioContentTypeFromFile(file: File): string | null {
  const type = file.type.toLowerCase();
  if (type === "audio/mpeg" || type === "audio/wav") return type;
  const extensionMatch = file.name.toLowerCase().match(/(\.[a-z0-9]{1,10})$/);
  if (extensionMatch?.[1] === ".mp3") return "audio/mpeg";
  if (extensionMatch?.[1] === ".wav") return "audio/wav";
  return null;
}

export const THUMBNAIL_ACCEPT = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
].join(",");

const THUMBNAIL_CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

/**
 * Catalogue art is never shown wider than a full-bleed course hero, so anything
 * past this is bytes nobody sees. Thumbnails upload straight from the browser
 * to S3 on a presigned PUT, which means the backend never sees the file and
 * cannot resize it — if the downscale does not happen here it does not happen
 * at all, and the original is what every visitor downloads.
 */
const THUMBNAIL_MAX_EDGE = 1600;
const THUMBNAIL_QUALITY = 0.82;
/** Below this, re-encoding tends to cost more quality than it saves bytes. */
const THUMBNAIL_COMPRESS_THRESHOLD = 300 * 1024;

/**
 * Downscales and re-encodes an oversized thumbnail to WebP. Returns the
 * original file when it is already small enough, when the format should not be
 * touched (animated GIFs lose their frames through a canvas), or when anything
 * about the decode fails — a slightly slow image beats a failed upload.
 */
export async function compressThumbnail(
  file: File,
): Promise<{ file: File; contentType: string }> {
  const originalType = file.type.toLowerCase();

  if (originalType === "image/gif" || file.size <= THUMBNAIL_COMPRESS_THRESHOLD) {
    return { file, contentType: originalType };
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(
      1,
      THUMBNAIL_MAX_EDGE / Math.max(bitmap.width, bitmap.height),
    );
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return { file, contentType: originalType };
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", THUMBNAIL_QUALITY),
    );
    // Safari historically ignored the WebP request and handed back a PNG, which
    // can be larger than the source; keep the original unless we actually won.
    if (!blob || blob.type !== "image/webp" || blob.size >= file.size) {
      return { file, contentType: originalType };
    }

    const name = `${file.name.replace(/\.[^.]+$/, "")}.webp`;
    return {
      file: new File([blob], name, { type: "image/webp" }),
      contentType: "image/webp",
    };
  } catch {
    return { file, contentType: originalType };
  }
}

export function thumbnailContentTypeFromFile(file: File): string | null {
  const type = file.type.toLowerCase();
  if (Object.values(THUMBNAIL_CONTENT_TYPES).includes(type)) {
    return type;
  }
  const extensionMatch = file.name.toLowerCase().match(/(\.[a-z0-9]{1,10})$/);
  const byExtension = extensionMatch
    ? THUMBNAIL_CONTENT_TYPES[extensionMatch[1]]
    : undefined;
  return byExtension ?? null;
}

export const RESOURCE_ACCEPT = [
  ...new Set([
    ...Object.values(RESOURCE_BY_EXTENSION).map((item) => item.contentType),
    "application/x-zip-compressed",
    ...Object.keys(RESOURCE_BY_EXTENSION),
  ]),
].join(",");

export type ResourceFileMeta = {
  title: string;
  fileType: string;
  contentType: string;
  filename: string;
};

export function resourceMetaFromFile(file: File): ResourceFileMeta | null {
  const filename = file.name.trim();
  if (!filename) return null;

  const extensionMatch = filename.toLowerCase().match(/(\.[a-z0-9]{1,10})$/);
  const byExtension = extensionMatch
    ? RESOURCE_BY_EXTENSION[extensionMatch[1]]
    : undefined;
  const type = file.type.toLowerCase();
  const fileType = CONTENT_TYPE_TO_FILE_TYPE[type] ?? byExtension?.fileType;
  const contentType = CONTENT_TYPE_TO_FILE_TYPE[type]
    ? type
    : (byExtension?.contentType ?? "");
  if (!fileType || !contentType) return null;

  const title = filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim()
    .slice(0, 200);

  return {
    title: title || filename.slice(0, 200),
    fileType,
    contentType,
    filename,
  };
}

export async function uploadMediaFile(options: {
  file: File;
  folder: MediaFolder;
  contentType: string;
  courseId?: string;
  songId?: string;
  signal?: AbortSignal;
  onProgress?: (loaded: number, total: number) => void;
}): Promise<string> {
  const { file, folder, contentType, courseId, songId, signal, onProgress } =
    options;
  throwIfAborted(signal);

  const { data } = await MediaAPI.presign({
    folder,
    filename: file.name,
    contentType,
    ...(courseId ? { courseId } : {}),
    ...(songId ? { songId } : {}),
  });

  throwIfAborted(signal);
  await putObject({
    url: data.uploadUrl,
    file,
    headers: {
      "Content-Type": contentType,
      ...data.headers,
    },
    signal,
    onProgress,
  });

  return data.storageKey;
}

function putObject(options: {
  url: string;
  file: File;
  headers: Record<string, string>;
  signal?: AbortSignal;
  onProgress?: (loaded: number, total: number) => void;
}) {
  const { url, file, headers, signal, onProgress } = options;

  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    for (const [name, value] of Object.entries(headers)) {
      xhr.setRequestHeader(name, value);
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress?.(event.loaded, event.total);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
        return;
      }
      reject(
        new Error(
          `S3 upload failed (${xhr.status})${xhr.responseText ? `: ${xhr.responseText.slice(0, 200)}` : ""}`,
        ),
      );
    };

    xhr.onerror = () => {
      reject(
        new Error(
          "Could not upload to storage. Check that the S3 bucket CORS rules allow PUT from this origin.",
        ),
      );
    };

    xhr.onabort = () => reject(new UploadAbortedError());

    const onAbort = () => xhr.abort();
    if (signal?.aborted) {
      xhr.abort();
      return;
    }
    signal?.addEventListener("abort", onAbort, { once: true });
    xhr.send(file);
  });
}

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new UploadAbortedError();
  }
}
