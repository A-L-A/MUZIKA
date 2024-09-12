import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,  
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth
export const getCurrentUser = () => api.get(`/users/profile`);
export const login = (email, password) =>
  api.post(`/auth/login`, { email, password });
export const register = (userData) =>
  api.post(`/auth/signup`, userData);
export const googleLogin = (tokenId) =>
  api.post(`/auth/google`, { tokenId });
export const completeGoogleSignup = (data) =>
  api.post(`/auth/complete-google-signup`, data);

// Users
export const getUserProfile = () => api.get(`/users/profile`);
export const updateUserProfile = (userData) =>
  api.put(`/users/profile`, userData);
export const deleteUserProfile = () => api.delete(`/users/profile`);

// Artists
export const getArtists = () => api.get(`/artists`);
export const createArtist = (artistData) =>
  api.post(`/artists`, artistData);
export const getArtistProfile = () => api.get(`/artists/profile`);
export const updateArtistProfile = (artistData) =>
  api.put(`/artists/profile`, artistData);
export const deleteArtistProfile = () =>
  api.delete(`/artists/profile`);
export const getArtistById = (id) => api.get(`/artists/${id}`);
export const updateArtist = (id, artistData) =>
  api.put(`/artists/${id}`, artistData);
export const deleteArtist = (id) => api.delete(`/artists/${id}`);

// Events
export const getEvents = () => api.get(`/events`);
export const createEvent = (eventData) =>
  api.post(`/events`, eventData);
export const getEventsByUser = () => api.get(`/events/user`);
export const getEventById = (id) => api.get(`/events/${id}`);
export const updateEvent = (id, eventData) =>
  api.put(`/events/${id}`, eventData);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// Admin
export const getAllUsers = () => api.get(`/admin/users`);
export const createUser = (userData) =>
  api.post(`/admin/users`, userData);
export const updateUser = (id, userData) =>
  api.put(`/admin/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

export const getAllArtists = () => api.get(`/admin/artists`);
export const adminUpdateArtist = (id, artistData) =>
  api.put(`/admin/artists/${id}`, artistData);
export const adminDeleteArtist = (id) =>
  api.delete(`/admin/artists/${id}`);

export const getAllEvents = () => api.get(`/admin/events`);
export const adminUpdateEvent = (id, eventData) =>
  api.put(`/admin/events/${id}`, eventData);
export const adminDeleteEvent = (id) =>
  api.delete(`/admin/events/${id}`);

// Event Hosts
export const getEventHosts = () => api.get(`/event-hosts`);
export const createEventHost = (eventHostData) =>
  api.post(`/event-hosts`, eventHostData);
export const getEventHostProfile = () => api.get(`/event-hosts/profile`);
export const updateEventHostProfile = (eventHostData) =>
  api.put(`/event-hosts/profile`, eventHostData);
export const deleteEventHostProfile = () =>
  api.delete(`/event-hosts/profile`);
export const getEventHostById = (id) => api.get(`/event-hosts/${id}`);
export const updateEventHost = (id, eventHostData) =>
  api.put(`/event-hosts/${id}`, eventHostData);
export const deleteEventHost = (id) => api.delete(`/event-hosts/${id}`);

// Admin routes for event hosts
export const getAllEventHosts = () => api.get(`/admin/event-hosts`);
export const adminUpdateEventHost = (id, eventHostData) =>
  api.put(`/admin/event-hosts/${id}`, eventHostData);
export const adminDeleteEventHost = (id) =>
  api.delete(`/admin/event-hosts/${id}`);
