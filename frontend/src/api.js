import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000/api/auth/",
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach JWT access token
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Automatically refresh expired access token
API.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            const refreshToken =
                localStorage.getItem("refresh_token");

            if (refreshToken) {
                try {
                    const response = await axios.post(
                        "http://127.0.0.1:8000/api/auth/token/refresh/",
                        {
                            refresh: refreshToken,
                        }
                    );

                    const newAccessToken =
                        response.data.access;

                    localStorage.setItem(
                        "access_token",
                        newAccessToken
                    );

                    originalRequest.headers.Authorization =
                        `Bearer ${newAccessToken}`;

                    return API(originalRequest);
                } catch (refreshError) {
                    console.error(
                        "Token refresh failed:",
                        refreshError
                    );

                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    localStorage.removeItem("username");
                    localStorage.removeItem("user_role");

                    window.location.href = "/login";

                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
);

export default API;