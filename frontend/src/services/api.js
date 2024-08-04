import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
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
export const getCurrentUser = () => axios.get(`${API_URL}/users/profile`);
export const login = (email, password) =>
  axios.post(`${API_URL}/auth/login`, { email, password });
export const register = (userData) =>
  axios.post(`${API_URL}/auth/signup`, userData);
export const googleLogin = (tokenId) =>
  axios.post(`${API_URL}/auth/google`, { tokenId });
export const completeGoogleSignup = (data) =>
  axios.post(`${API_URL}/auth/complete-google-signup`, data);
// Users
export const getUserProfile = () => axios.get(`${API_URL}/users/profile`);
export const updateUserProfile = (userData) =>
  axios.put(`${API_URL}/users/profile`, userData);
export const deleteUserProfile = () => axios.delete(`${API_URL}/users/profile`);

// Artists
export const getArtists = () => axios.get(`${API_URL}/artists`);
export const createArtist = (artistData) =>
  axios.post(`${API_URL}/artists`, artistData);
export const getArtistProfile = () => axios.get(`${API_URL}/artists/profile`);
export const updateArtistProfile = (artistData) =>
  axios.put(`${API_URL}/artists/profile`, artistData);
export const deleteArtistProfile = () =>
  axios.delete(`${API_URL}/artists/profile`);
export const getArtistById = (id) => axios.get(`${API_URL}/artists/${id}`);
export const updateArtist = (id, artistData) =>
  axios.put(`${API_URL}/artists/${id}`, artistData);
export const deleteArtist = (id) => axios.delete(`${API_URL}/artists/${id}`);

// Events
export const getEvents = () => axios.get(`${API_URL}/events`);
export const createEvent = (eventData) =>
  axios.post(`${API_URL}/events`, eventData);
export const getEventsByUser = () => axios.get(`${API_URL}/events/user`);
export const getEventById = (id) => axios.get(`${API_URL}/events/${id}`);
export const updateEvent = (id, eventData) =>
  axios.put(`${API_URL}/events/${id}`, eventData);
export const deleteEvent = (id) => axios.delete(`${API_URL}/events/${id}`);

// Admin
export const getAllUsers = () => axios.get(`${API_URL}/admin/users`);
export const createUser = (userData) =>
  axios.post(`${API_URL}/admin/users`, userData);
export const updateUser = (id, userData) =>
  axios.put(`${API_URL}/admin/users/${id}`, userData);
export const deleteUser = (id) => axios.delete(`${API_URL}/admin/users/${id}`);

export const getAllArtists = () => axios.get(`${API_URL}/admin/artists`);
export const adminUpdateArtist = (id, artistData) =>
  axios.put(`${API_URL}/admin/artists/${id}`, artistData);
export const adminDeleteArtist = (id) =>
  axios.delete(`${API_URL}/admin/artists/${id}`);

export const getAllEvents = () => axios.get(`${API_URL}/admin/events`);
export const adminUpdateEvent = (id, eventData) =>
  axios.put(`${API_URL}/admin/events/${id}`, eventData);
export const adminDeleteEvent = (id) =>
  axios.delete(`${API_URL}/admin/events/${id}`);

// Event Hosts
export const getEventHosts = () => axios.get(`${API_URL}/event-hosts`);
export const createEventHost = (eventHostData) =>
  axios.post(`${API_URL}/event-hosts`, eventHostData);
export const getEventHostProfile = () => axios.get(`${API_URL}/event-hosts/profile`);
export const updateEventHostProfile = (eventHostData) =>
  axios.put(`${API_URL}/event-hosts/profile`, eventHostData);
export const deleteEventHostProfile = () =>
  axios.delete(`${API_URL}/event-hosts/profile`);
export const getEventHostById = (id) => axios.get(`${API_URL}/event-hosts/${id}`);
export const updateEventHost = (id, eventHostData) =>
  axios.put(`${API_URL}/event-hosts/${id}`, eventHostData);
export const deleteEventHost = (id) => axios.delete(`${API_URL}/event-hosts/${id}`);

// Update the admin routes for event hosts
export const getAllEventHosts = () => axios.get(`${API_URL}/admin/event-hosts`);
export const adminUpdateEventHost = (id, eventHostData) =>
  axios.put(`${API_URL}/admin/event-hosts/${id}`, eventHostData);
export const adminDeleteEventHost = (id) =>
  axios.delete(`${API_URL}/admin/event-hosts/${id}`);