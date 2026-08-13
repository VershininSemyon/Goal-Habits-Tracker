import api from '../config/axios.js';

export const getGoals = async (params = {}) => (await api.get('/goals/', { params })).data;
export const getGoal = async (id) => (await api.get(`/goals/${id}`)).data;
export const createGoal = async (data) => (await api.post('/goals/', data)).data;
export const updateGoal = async (id, data) => (await api.put(`/goals/${id}`, data)).data;
export const deleteGoal = async (id) => api.delete(`/goals/${id}`);
export const requestGoalAdvice = async (id) => (await api.post(`/goals/${id}/ai-advice`)).data;
