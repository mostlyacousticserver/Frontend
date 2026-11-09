import { api } from "@/lib/axios";
import type { MessageResponse } from "@/types/course";
import type {
  CompleteVideoUploadRequest,
  InitiateLessonVideoUploadRequest,
  InitiateVideoUploadResponse,
  LessonVideo,
  RequestUploadPartsRequest,
  RequestUploadPartsResponse,
  VideoStatus,
} from "@/types/video";

export const VideoAPI = {
  initiateForLesson(lessonId: string, payload: InitiateLessonVideoUploadRequest) {
    return api.post<InitiateVideoUploadResponse>(
      `/lessons/${lessonId}/video/upload/initiate`,
      payload,
    );
  },

  requestParts(videoId: string, payload: RequestUploadPartsRequest) {
    return api.post<RequestUploadPartsResponse>(
      `/videos/${videoId}/upload/parts`,
      payload,
    );
  },

  complete(videoId: string, payload: CompleteVideoUploadRequest) {
    return api.post<LessonVideo>(`/videos/${videoId}/upload/complete`, payload);
  },

  abort(videoId: string) {
    return api.post<MessageResponse>(
      `/videos/${videoId}/upload/abort`,
      undefined,
      { skipErrorToast: true },
    );
  },

  get(videoId: string) {
    return api.get<LessonVideo>(`/videos/${videoId}`);
  },

  status(videoId: string) {
    return api.get<VideoStatus>(`/videos/${videoId}/status`);
  },

  getByLesson(lessonId: string) {
    return api.get<LessonVideo>(`/lessons/${lessonId}/video`, {
      skipErrorToast: true,
    });
  },

  retry(videoId: string) {
    return api.post<LessonVideo>(`/videos/${videoId}/retry`);
  },

  remove(videoId: string) {
    return api.delete<MessageResponse>(`/videos/${videoId}`);
  },
};
