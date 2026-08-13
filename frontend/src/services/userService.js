import api from "../config/axios.js";

export const getMe = async () => (await api.get("/users/me")).data;
export const updateMe = async (data) => (await api.put("/users/me", data)).data;
export const deleteMe = async () => api.delete("/users/me");
export const getRecentActivity = async (limit = 10) =>
    (await api.get("/users/me/activity", { params: { limit } })).data;
export const getDashboardStats = async () =>
    (await api.get("/users/me/dashboard/stats")).data;
