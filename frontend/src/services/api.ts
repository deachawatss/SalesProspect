import axios from 'axios';
import type { ProspectSearchResult, ProspectStatus, TransferResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5102';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      localStorage.removeItem('userRole');
      localStorage.removeItem('username');
      
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export const prospectApi = {
  search: async (query: string): Promise<ProspectSearchResult[]> => {
    const response = await api.get<ProspectSearchResult[]>('/api/prospects/search', {
      params: { q: query },
    });
    return response.data;
  },

  getStatus: async (key: string): Promise<ProspectStatus> => {
    const response = await api.get<ProspectStatus>(`/api/prospects/${key}/status`);
    return response.data;
  },

  transfer: async (key: string): Promise<TransferResult> => {
    const response = await api.post<TransferResult>(`/api/prospects/${key}/transfer`);
    return response.data;
  },
};

export default api; 