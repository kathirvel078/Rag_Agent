import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const documentService = {
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // We override the content type for this request since it's multipart/form-data
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  processDocument: async (filename) => {
    const response = await api.post(`/upload/store/${encodeURIComponent(filename)}`);
    return response.data;
  },

  askQuestion: async (question) => {
    const response = await api.post('/ask', { question });
    return response.data;
  }
};

export default api;
