import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  
  withCredentials: false 
});

// Add request interceptor for auth token
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

// Add response interceptor for better debugging
api.interceptors.response.use(
  (response) => response.data, 
  (error) => {
    
    if (error.response) {
      console.error("API Error:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error("Network Error:", error.request);
    } else {
      console.error("Request Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Auth
export const getCurrentUser = () => api.get(`/api/users/profile`);
export const login = (email, password) =>
  api.post(`/api/auth/login`, { email, password });
export const register = (userData) =>
  api.post(`/api/auth/signup`, userData);
export const googleLogin = (tokenId) =>
  api.post(`/api/auth/google`, { tokenId });
export const completeGoogleSignup = (data) =>
  api.post(`/api/auth/complete-google-signup`, data);
export const changePassword = (currentPassword, newPassword) =>
  api.put(`/api/users/change-password`, { currentPassword, newPassword });

// Users
export const getUserProfile = () => api.get(`/api/users/profile`);
export const updateUserProfile = (userData) =>
  api.put(`/api/users/profile`, userData);
export const deleteUserProfile = () => api.delete(`/api/users/profile`);

// Artists
export const getArtists = () => api.get(`/api/artists`);
export const createArtist = (artistData) =>
  api.post(`/api/artists`, artistData);
export const getArtistProfile = () => api.get(`/api/artists/profile`);
export const updateArtistProfile = (artistData) =>
  api.put(`/api/artists/profile`, artistData);
export const deleteArtistProfile = () =>
  api.delete(`/api/artists/profile`);
export const getArtistById = (id) => api.get(`/api/artists/${id}`);
export const updateArtist = (id, artistData) =>
  api.put(`/api/artists/${id}`, artistData);
export const deleteArtist = (id) => api.delete(`/api/artists/${id}`);

// Events
export const getEvents = () => api.get(`/api/events`);
export const createEvent = (eventData) =>
  api.post(`/api/events`, eventData);
export const getEventsByUser = () => api.get(`/api/events/user`);
export const getEventById = (id) => api.get(`/api/events/${id}`);
export const updateEvent = (id, eventData) =>
  api.put(`/api/events/${id}`, eventData);
export const deleteEvent = (id) => api.delete(`/api/events/${id}`);

// Admin
export const getAllUsers = () => api.get(`/api/admin/users`);
export const createUser = (userData) =>
  api.post(`/api/admin/users`, userData);
export const updateUser = (id, userData) =>
  api.put(`/api/admin/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/api/admin/users/${id}`);

export const getAllArtists = () => api.get(`/api/admin/artists`);
export const adminUpdateArtist = (id, artistData) =>
  api.put(`/api/admin/artists/${id}`, artistData);
export const adminDeleteArtist = (id) =>
  api.delete(`/api/admin/artists/${id}`);

export const getAllEvents = () => api.get(`/api/admin/events`);
export const adminUpdateEvent = (id, eventData) =>
  api.put(`/api/admin/events/${id}`, eventData);
export const adminDeleteEvent = (id) =>
  api.delete(`/api/admin/events/${id}`);

// Event Hosts
export const getEventHosts = () => api.get(`/api/event-hosts`);
export const createEventHost = (eventHostData) =>
  api.post(`/api/event-hosts`, eventHostData);
export const getEventHostProfile = () => api.get(`/api/event-hosts/profile`);
export const updateEventHostProfile = (eventHostData) =>
  api.put(`/api/event-hosts/profile`, eventHostData);
export const deleteEventHostProfile = () =>
  api.delete(`/api/event-hosts/profile`);
export const getEventHostById = (id) => api.get(`/api/event-hosts/${id}`);
export const updateEventHost = (id, eventHostData) =>
  api.put(`/api/event-hosts/${id}`, eventHostData);
export const deleteEventHost = (id) => api.delete(`/api/event-hosts/${id}`);

// Admin routes for event hosts
export const getAllEventHosts = () => api.get(`/api/admin/event-hosts`);
export const adminUpdateEventHost = (id, eventHostData) =>
  api.put(`/api/admin/event-hosts/${id}`, eventHostData);
export const adminDeleteEventHost = (id) =>
  api.delete(`/api/admin/event-hosts/${id}`);

export default api;