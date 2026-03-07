import api from "./api";

export const eventService = {
    create: (data) => api.post("/event/create-event", data),
    getAll: () => api.get("/event"),
    getOne: (eventId) => api.get(`/event/${eventId}`),
    update: (eventId, data) => api.patch(`/event/${eventId}`, data),
    delete: (eventId) => api.delete(`/event/${eventId}`),
};
