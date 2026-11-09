export type MediaFolder =
  | "pdfs"
  | "resources"
  | "thumbnails"
  | "certificates"
  | "blog"
  | "free-courses"
  | "songs"
  | "site";

export type PresignUploadRequest = {
  courseId?: string;
  songId?: string;
  folder: MediaFolder;
  filename: string;
  contentType: string;
};

export type PresignUploadResponse = {
  uploadUrl: string;
  storageKey: string;
  expiresIn: number;
  headers?: Record<string, string>;
};

export type MediaUrlResponse = {
  url: string;
  expiresIn: number;
};
