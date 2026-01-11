import axios, { type InternalAxiosRequestConfig } from "axios";

const API_URL = import.meta.env.VITE_BASE_URL;

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            // Citește token din auth-store (Zustand persist)
            const authStore = localStorage.getItem("auth-store");
            if (authStore) {
                const { state } = JSON.parse(authStore);
                const token = state?.accessToken;

                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch (error) {
            localStorage.removeItem("auth-store");
            window.location.href = "/login";
            console.error("Error reading auth token:", error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(async (response) => response, async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 || error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const refreshResponse = await api.post('/auth/refresh');

            if (refreshResponse.status === 200) {
                const authStore = localStorage.getItem("auth-store");
                if (authStore) {
                    const { state } = JSON.parse(authStore);
                    const token = state?.accessToken;

                    if (token && originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                }

                return api(originalRequest);
            }
        } catch (error) {
            localStorage.removeItem("auth-store");

            // Redirect la login
            window.location.href = "/login";

            return Promise.reject(error);
        }
    }
    return Promise.reject(error);
})