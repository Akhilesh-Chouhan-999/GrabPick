import api from "./api";

export const authService = {
    register: (data) => api.post("/auth/register", data),
    login: (data) => api.post("/auth/login", data),
    logout: (refreshToken) => api.post("/auth/logout", { refreshToken }),
    refresh: (refreshToken) => api.post("/auth/refresh", { refreshToken }),
    getMe: (id) => api.get(`/auth/me/${id}`),
    changePassword: (data) => api.patch("/auth/change-password", data),
    forgotPassword: (phone) => api.post("/auth/forgot-password", { phone }),
    resetPassword: (token, password) =>
        api.patch(`/auth/reset-password/${token}`, { password }),
    verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
    resendVerification: () => api.post("/auth/resend-verification"),
};
