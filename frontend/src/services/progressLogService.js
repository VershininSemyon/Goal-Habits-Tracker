import api from '../config/axios.js';

const base = (goalId, habitId) => `/goals/${goalId}/habits/${habitId}/progress-logs`;
export const getProgressLogs = async (goalId, habitId) => (await api.get(`${base(goalId, habitId)}/`)).data;
export const getProgressLog = async (goalId, habitId, id) => (await api.get(`${base(goalId, habitId)}/${id}`)).data;
export const createProgressLog = async (goalId, habitId, data) => (await api.post(`${base(goalId, habitId)}/`, data)).data;
export const updateProgressLog = async (goalId, habitId, id, data) => (await api.put(`${base(goalId, habitId)}/${id}`, data)).data;
export const deleteProgressLog = async (goalId, habitId, id) => api.delete(`${base(goalId, habitId)}/${id}`);
