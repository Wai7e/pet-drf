import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookings } from '../api/bookings';
import useAuthStore from '../store/authStore';
import BookingCard from '../components/BookingCard';
import InfoModal from '../components/InfoModal';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { accessToken, userProfile } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await getBookings();
        setBookings(response.data);
      } catch (err) {
        setError('Ошибка загрузки бронирований.');
        toast.error('Ошибка загрузки бронирований.');
      }
    };
    fetchBookings();
  }, [accessToken, navigate]);

  const openDetailsModal = (booking) => {
    setSelectedBooking({
      ...booking,
      user_profile: userProfile
    });
    setIsDetailsModalOpen(true);
  };

  const closeModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Ваши бронирования</h2>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 mb-4"
          >
            {error}
          </motion.p>
        )}
        {bookings.length === 0 && !error && (
          <p className="text-gray-600">У вас нет бронирований.</p>
        )}
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
      </div>
      <InfoModal
        isOpen={isDetailsModalOpen}
        onRequestClose={closeModal}
        item={selectedBooking}
        type="booking"
      />
    </div>
  );
}

export default Bookings;