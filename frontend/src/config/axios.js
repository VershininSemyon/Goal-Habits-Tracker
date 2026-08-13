import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config || {};
        const status = error.response?.status;

        if (status === 429) {
            const retryAfter = Number(error.response.data?.retry_after_seconds) || 60;
            window.dispatchEvent(new CustomEvent('showToast', {
                detail: { message: `Слишком много запросов. Подождите ${retryAfter} сек.`, type: 'warning' },
            }));
            return Promise.reject(error);
        }

        const isRefreshRequest = originalRequest.url?.includes('/auth/token/refresh');
        const isAuthRequest = originalRequest.url?.includes('/auth/token');

        if (status === 401 && !originalRequest._retry && !isRefreshRequest && !isAuthRequest) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }))
                    .then(() => api(originalRequest));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await axios.post(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/auth/token/refresh`,
                    {},
                    { withCredentials: true }
                );
                processQueue(null);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                window.dispatchEvent(new CustomEvent('authExpired'));
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        if (error.response?.data?.detail && (status !== 401 || isAuthRequest)) {
            window.dispatchEvent(new CustomEvent('showToast', {
                detail: { message: getDetail(error), type: 'error' },
            }));
        }

        return Promise.reject(error);
    }
);

function getDetail(error) {
    const detail = error.response?.data?.detail;
    if (Array.isArray(detail)) return detail.map((item) => item.msg || item.detail).filter(Boolean).join('; ');
    if (typeof detail === 'string') return detail;
    if (detail?.msg) return detail.msg;
    return 'Произошла ошибка';
}

export default api;
