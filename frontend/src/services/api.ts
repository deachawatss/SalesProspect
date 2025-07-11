import axios from 'axios';
import type { ProspectSearchResult, ProspectStatus, TransferResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5102/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});


export const prospectApi = {
  search: async (query: string): Promise<ProspectSearchResult[]> => {
    const response = await api.get<ProspectSearchResult[]>('/prospects/search', {
      params: { q: query },
    });
    return response.data;
  },

  getStatus: async (key: string): Promise<ProspectStatus> => {
    const response = await api.get<ProspectStatus>(`/prospects/${key}/status`);
    return response.data;
  },

  transfer: async (key: string): Promise<TransferResult> => {
    const response = await api.post<TransferResult>(`/prospects/${key}/transfer`);
    return response.data;
  },
};

export default api; 