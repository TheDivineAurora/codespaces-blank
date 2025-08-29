import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, 
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    {}, // No body needed, refresh token is in cookies
                    { withCredentials: true }
                );
                return api(originalRequest);
            } catch (refreshError) {
                if (typeof window !== 'undefined') {
                    window.location.href = '/sign-in';
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;