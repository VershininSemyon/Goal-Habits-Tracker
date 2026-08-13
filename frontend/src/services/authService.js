import api from '../config/axios.js';
import { jwtDecode } from 'jwt-decode';

export const login = async (credentials) => {
    const response = await api.post('/auth/token', credentials);
    const decoded = jwtDecode(response.data.access);
    return { tokens: response.data, decoded };
};

export const register = async (userData) => (await api.post('/users/', userData)).data;
export const logout = async () => (await api.post('/auth/logout')).data;
