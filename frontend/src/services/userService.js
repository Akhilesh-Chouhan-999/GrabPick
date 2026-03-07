import api from "./api";

export const userService = {
    getById: (id) => api.get(`/user/${id}`),
    updateProfile: (data) => api.patch("/user/update-profile", data),
    updateAvatar: (formData) =>
        api.patch("/user/update-avatar", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    deleteAccount: () => api.delete("/user/delete-account"),
};
