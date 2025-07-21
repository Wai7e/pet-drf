import api from './api';

export const getAvailableRooms = (params) => api.get('rooms/available/', { params });

export const getRooms = () => api.get('rooms/');

export const getRoomDetails = (roomId) => api.get(`rooms/${roomId}/`);