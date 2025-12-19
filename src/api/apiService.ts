import axios from 'axios';

// Set the base URL for the NestJS backend
const API_BASE_URL = 'http://localhost:3001/api';
//const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interfaces for Type Safety ---

interface LoginPayload {
  email: string;
  password?: string;
}

interface RegisterPayload {
  username: string;
  email: string;
  password?: string;
}

// --- AUTHENTICATION ENDPOINTS ---

export const register = (data: RegisterPayload) => 
  api.post('/users/register', data);

export const login = (data: LoginPayload) => 
  api.post('/auth/login', data);

export const logout = () => 
  api.post('/auth/logout');

export const checkSession = () => 
  api.post('/auth/check');

// --- MURMUR ENDPOINTS ---

export const getGlobalFeed = () => 
  api.get('/murmurs');

export const createMurmur = (content: string) => 
  api.post('/murmurs', { content });

// --- FOLLOWS ENDPOINTS ---

export const followUser = (username: string) => 
  api.post('/follows/start', { username });

export const unfollowUser = (username: string) => 
  api.delete('/follows/stop', { data: { username } });



// --- LIKES ENDPOINTS ---

export const likeMurmur = (murmurId: number) => 
  api.post(`/likes/${murmurId}`);

export const unlikeMurmur = (murmurId: number) => 
  api.delete(`/likes/${murmurId}`);

// --- USER ENDPOINTS ---

export const getMyProfile = () => 
  api.get('/users/profile');

// Add this to your existing exports in apiService.ts
export const deleteMurmur = (id: number) => {
  return api.delete(`/api/me/murmurs/${id}`);
};

export default api;