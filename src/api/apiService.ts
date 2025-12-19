import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- AUTHENTICATION ENDPOINTS ---
export const register = (data: any) => api.post('/users/register', data);
export const login = (data: any) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');
export const checkSession = () => api.post('/auth/check');

// --- MURMUR ENDPOINTS ---
export const getGlobalFeed = () => api.get('/murmurs');
export const createMurmur = (content: string) => api.post('/murmurs', { content });

// FIXED: Removed extra /api from the path to match baseURL
export const deleteMurmur = (id: number) => api.delete(`/me/murmurs/${id}`);

// NEW: Get Murmurs for a SPECIFIC user (Required for Profile Page)
export const getUserMurmurs = (userId: number) => api.get(`/murmurs/user/${userId}`);

// --- FOLLOWS ENDPOINTS ---
export const followUser = (userId: number) => api.post(`/users/${userId}/follow`);
export const unfollowUser = (userId: number) => api.delete(`/users/${userId}/follow`);
export const getExploreUsers = () => api.get('/users/explore');

// --- LIKES ENDPOINTS ---
export const likeMurmur = (murmurId: number) => api.post(`/likes/${murmurId}`);
export const unlikeMurmur = (murmurId: number) => api.delete(`/likes/${murmurId}`);

// --- USER ENDPOINTS ---
export const getMyProfile = () => api.get('/users/profile');

// NEW: Get a SPECIFIC user's profile (Required for Profile Page)
export const getUserProfile = (userId: number) => api.get(`/users/${userId}`);

export default api;