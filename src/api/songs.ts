import { api } from "@/lib/axios";
import type {
  ChordCatalogEntry,
  CreateSongRequest,
  ListSongsQuery,
  PaginatedSongs,
  SongDetail,
  UpdateSongRequest,
} from "@/types/song";
import type { MessageResponse } from "@/types/course";

export const SongAPI = {
  listPublished(query: ListSongsQuery = {}) {
    return api.get<PaginatedSongs>("/songs", { params: query });
  },

  getPublished(slug: string) {
    return api.get<SongDetail>(`/songs/${slug}`);
  },

  listAdmin(query: ListSongsQuery = {}) {
    return api.get<PaginatedSongs>("/admin/songs", { params: query });
  },

  getAdmin(id: string) {
    return api.get<SongDetail>(`/admin/songs/${id}`);
  },

  create(payload: CreateSongRequest) {
    return api.post<SongDetail>("/songs", payload);
  },

  update(id: string, payload: UpdateSongRequest) {
    return api.patch<SongDetail>(`/songs/${id}`, payload);
  },

  remove(id: string) {
    return api.delete<MessageResponse>(`/songs/${id}`);
  },

  searchChords(q?: string) {
    return api.get<{ items: ChordCatalogEntry[] }>("/songs/chords", {
      params: q ? { q } : undefined,
    });
  },
};
