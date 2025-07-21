import api from './api';

export const getBookings = () => api.get('users/bookings/');
export const createBooking = (data) => api.post('users/bookings/', data);