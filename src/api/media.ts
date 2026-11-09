import { api } from "@/lib/axios";
import type {
  MediaUrlResponse,
  PresignUploadRequest,
  PresignUploadResponse,
} from "@/types/media";

export const MediaAPI = {
  presign(payload: PresignUploadRequest) {
    return api.post<PresignUploadResponse>("/media/presign", payload);
  },

  getUrl(storageKey: string, options?: { skipErrorToast?: boolean }) {
    return api.get<MediaUrlResponse>("/media/url", {
      params: { storageKey },
      skipErrorToast: options?.skipErrorToast,
    });
  },
};
