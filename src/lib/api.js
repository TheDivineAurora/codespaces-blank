import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://organic-adventure-9v6qxj669gp2pw75-8000.app.github.dev";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Include cookies for all requests
});

// Response interceptor for automatic token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If we get a 401 and haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token using the refresh token cookie
                await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    {}, // No body needed, refresh token is in cookies
                    { withCredentials: true }
                );

                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, redirect to login
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