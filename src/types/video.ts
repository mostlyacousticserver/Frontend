export type VideoProcessingStatus =
  | "UPLOADING"
  | "UPLOADED"
  | "PROCESSING"
  | "READY"
  | "FAILED";

export const VIDEO_CONTENT_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-matroska",
] as const;

export type VideoContentType = (typeof VIDEO_CONTENT_TYPES)[number];

export type LessonVideo = {
  id: string;
  lessonId: string;
  originalFileName: string;
  originalContentType: string;
  originalFileSize: number;
  durationSeconds: number | null;
  processingStatus: VideoProcessingStatus;
  processingJobId: string | null;
  hasHls: boolean;
  processingStartedAt: string | null;
  processingCompletedAt: string | null;
  processingError: string | null;
  createdAt: string;
  updatedAt: string;
};

export type VideoStatus = {
  videoId: string;
  status: VideoProcessingStatus;
  durationSeconds: number | null;
  processingJobId: string | null;
  processingStartedAt: string | null;
  processingCompletedAt: string | null;
  error: string | null;
  progress: null;
};

export type InitiateLessonVideoUploadRequest = {
  fileName: string;
  contentType: string;
  fileSize: number;
};

export type UploadPartUrl = {
  partNumber: number;
  url: string;
};

export type InitiateVideoUploadResponse = {
  videoId: string;
  lessonId: string;
  uploadId: string;
  objectKey: string;
  partSize: number;
  maxParts: number;
  parts: UploadPartUrl[];
  expiresIn: number;
  expiresAt: string;
};

export type RequestUploadPartsRequest = {
  partNumbers: number[];
};

export type RequestUploadPartsResponse = {
  videoId: string;
  parts: UploadPartUrl[];
  expiresIn: number;
};

export type CompletedUploadPart = {
  partNumber: number;
  etag: string;
};

export type CompleteVideoUploadRequest = {
  parts: CompletedUploadPart[];
  durationSeconds?: number;
};
