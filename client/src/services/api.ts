import axios, { type AxiosResponse } from 'axios';
import type { CalendarEvent, EventFormData } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: BASE_URL });

// Attach JWT to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('gcal_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Auth
export const register = (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password });

export const login = (email: string, password: string) =>
    api.post('/auth/login', { email, password });

export const googleLogin = (tokenData: { credential?: string; accessToken?: string }) =>
    api.post('/auth/google', tokenData);

// Events
export const fetchEvents = (start: string, end: string): Promise<AxiosResponse<CalendarEvent[]>> =>
    api.get('/events', { params: { start, end } });

export const createEvent = (data: Partial<EventFormData>) =>
    api.post('/events', data);

export const updateEvent = (
    id: string,
    data: Partial<EventFormData> & { editMode?: string }
) => api.put(`/events/${id}`, data);

export const deleteEvent = (id: string, deleteMode?: string) =>
    api.delete(`/events/${id}`, { params: { deleteMode } });

export default api;