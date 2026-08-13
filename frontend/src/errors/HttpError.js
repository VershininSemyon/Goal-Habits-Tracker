export class HttpError extends Error {
    constructor(message, status = 0, response = null) {
        super(message);
        this.name = 'HttpError';
        this.status = status;
        this.response = response;
    }
}

export function getApiErrorMessage(error, fallback = 'Произошла ошибка') {
    const detail = error?.response?.data?.detail;
    if (Array.isArray(detail)) return detail.map((item) => item.msg || item.detail).filter(Boolean).join('; ') || fallback;
    if (typeof detail === 'string') return detail;
    if (detail?.msg) return detail.msg;
    return error?.message || fallback;
}
