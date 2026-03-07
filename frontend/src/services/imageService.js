import api from "./api";

export const imageService = {
    upload: (eventId, formData) =>
        api.post(`/image/${eventId}/images`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    getEventImages: (eventId, page = 1, limit = 12) =>
        api.get(`/image/${eventId}/images`, { params: { page, limit } }),
    matchFace: (eventId, formData) =>
        api.post(`/image/${eventId}/match`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    delete: (imageId) => api.delete(`/image/${imageId}`),
};
