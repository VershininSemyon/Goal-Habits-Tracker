import api from '../config/axios.js';

export const getHabits = async (goalId) => (await api.get(`/goals/${goalId}/habits/`)).data;
export const getHabit = async (goalId, habitId) => (await api.get(`/goals/${goalId}/habits/${habitId}`)).data;
export const createHabit = async (goalId, data) => (await api.post(`/goals/${goalId}/habits/`, data)).data;
export const updateHabit = async (goalId, habitId, data) => (await api.put(`/goals/${goalId}/habits/${habitId}`, data)).data;
export const deleteHabit = async (goalId, habitId) => api.delete(`/goals/${goalId}/habits/${habitId}`);
