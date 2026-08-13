import api from "../config/axios.js";
export const healthcheck = async () => (await api.get("/healthcheck/")).data;
