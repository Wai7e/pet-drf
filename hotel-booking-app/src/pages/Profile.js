import React, { useEffect, useState } from 'react';
import { getProfile } from '../api/auth';
import { getBookings } from '../api/bookings';
import BookingCard from '../components/BookingCard';
import InfoModal from '../components/InfoModal';
import { motion } from 'framer-motion';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState('');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setProfile(response.data);
      } catch (err) {
        setError('Ошибка загрузки профиля.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getBookings();
        setBookings(response.data);
      } catch (err) {
        setBookingsError('Ошибка загрузки истории бронирований.');
      } finally {
        setBookingsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const openDetailsModal = (booking) => {
    setSelectedBooking({
      ...booking,
      user_profile: profile
    });
    setIsDetailsModalOpen(true);
  };

  const closeModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedBooking(null);
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 pt-20 pb-8 px-4 sm:px-6 lg:px-8 text-center">Загрузка...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-100 pt-20 pb-8 px-4 sm:px-6 lg:px-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/80 backdrop-blur-md rounded-lg shadow-md p-8 mb-10"
        >
          <h1 className="text-3xl font-bold mb-4 text-center text-gray-900">Профиль пользователя</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
            <div><span className="font-semibold">ID:</span> {profile.id}</div>
            <div><span className="font-semibold">Логин:</span> {profile.username}</div>
            <div><span className="font-semibold">Email:</span> {profile.email}</div>
            <div><span className="font-semibold">Имя:</span> {profile.first_name}</div>
            <div><span className="font-semibold">Фамилия:</span> {profile.last_name}</div>
            <div><span className="font-semibold">Телефон:</span> {profile.phone_number}</div>
          </div>
        </motion.div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">История бронирований</h2>
        {bookingsLoading ? (
          <div className="text-center">Загрузка истории...</div>
        ) : bookingsError ? (
          <div className="text-center text-red-500">{bookingsError}</div>
        ) : bookings.length === 0 ? (
          <div className="text-center text-gray-600">У вас нет бронирований.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking, index) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onDetails={openDetailsModal}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              />
            ))}
          </div>
        )}
      </div>
      <InfoModal
        isOpen={isDetailsModalOpen}
        onRequestClose={closeModal}
        item={selectedBooking}
        type="booking"
      />
    </div>
  );
};

export default Profile;
