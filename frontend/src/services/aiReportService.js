import api from '../config/axios.js';

export const getReports = async () => (await api.get('/users/me/ai-reports')).data;
export const getReport = async (id) => (await api.get(`/users/me/ai-reports/${id}`)).data;
export const createReport = async (data) => (await api.post('/users/me/ai-reports', data)).data;
export const deleteReport = async (id) => api.delete(`/users/me/ai-reports/${id}`);
