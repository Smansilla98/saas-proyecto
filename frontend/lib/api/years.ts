import { apiClient } from './client';

export interface Year {
  id: number;
  name: string;
  order: number;
  created_at: string;
  updated_at: string;
  rhythms?: Rhythm[];
}

export interface Rhythm {
  id: number;
  name: string;
  description?: string;
  author?: string;
  adaptation?: string;
  year_id: number;
  optional: boolean;
  created_at: string;
  updated_at: string;
  year?: Year;
  videos?: Media[];
  audios?: Media[];
  pdfs?: Media[];
}

export interface Media {
  id: number;
  name: string;
  file_name: string;
  mime_type: string;
  size: number;
  url?: string;
  original_url?: string;
  collection_name?: string;
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');

/** URL para reproducir/descargar (Spatie devuelve original_url; puede ser ruta relativa) */
export function getMediaUrl(m: Media): string {
  const raw = m.original_url ?? m.url ?? '';
  if (!raw) return '#';
  if (raw.startsWith('http')) return raw;
  return `${API_BASE}${raw.startsWith('/') ? '' : '/'}${raw}`;
}

export const yearsApi = {
  getAll: async (): Promise<Year[]> => {
    const response = await apiClient.get<Year[]>('/years');
    return response.data;
  },

  getById: async (id: number): Promise<Year> => {
    const response = await apiClient.get<Year>(`/years/${id}`);
    return response.data;
  },

  create: async (data: { name: string; order: number }): Promise<Year> => {
    const response = await apiClient.post<Year>('/years', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Year>): Promise<Year> => {
    const response = await apiClient.put<Year>(`/years/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/years/${id}`);
  },
};

export const rhythmsApi = {
  getByYear: async (yearId: number): Promise<Rhythm[]> => {
    const response = await apiClient.get<Rhythm[]>(`/years/${yearId}/rhythms`);
    return response.data;
  },

  getById: async (id: number): Promise<{ rhythm: Rhythm; videos: Media[]; audios: Media[]; pdfs: Media[] }> => {
    const response = await apiClient.get(`/rhythms/${id}`);
    return response.data;
  },

  create: async (yearId: number, data: Partial<Rhythm>): Promise<Rhythm> => {
    const response = await apiClient.post<Rhythm>(`/years/${yearId}/rhythms`, data);
    return response.data;
  },

  update: async (id: number, data: Partial<Rhythm>): Promise<Rhythm> => {
    const response = await apiClient.put<Rhythm>(`/rhythms/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/rhythms/${id}`);
  },
};

export const mediaApi = {
  uploadVideo: async (rhythmId: number, file: File): Promise<Media> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<Media>(`/rhythms/${rhythmId}/media/video`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadAudio: async (rhythmId: number, file: File): Promise<Media> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<Media>(`/rhythms/${rhythmId}/media/audio`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadPdf: async (rhythmId: number, file: File): Promise<Media> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<Media>(`/rhythms/${rhythmId}/media/pdf`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (rhythmId: number, mediaId: number): Promise<void> => {
    await apiClient.delete(`/rhythms/${rhythmId}/media/${mediaId}`);
  },
};

