import api from './api';

export const register = (data) => api.post('users/register/', data);
export const login = (data) => api.post('token/', data);
export const refreshToken = (data) => api.post('token/refresh/', data);
export const getProfile = () => api.get('users/profile/');