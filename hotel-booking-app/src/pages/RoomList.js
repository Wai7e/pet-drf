import { useEffect, useState } from 'react';
import { getRooms, getRoomDetails } from '../api/rooms';
import useAuthStore from '../store/authStore';
import RoomCard from '../components/RoomCard';
import BookingModal from '../components/BookingModal';
import InfoModal from '../components/InfoModal';
import { motion } from 'framer-motion';

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getRooms();
        setRooms(response.data.rooms);
      } catch (err) {
        setError('Ошибка загрузки номеров.');
      }
    };
    fetchRooms();
  }, []);

  const openBookingModal = (room) => {
    if (!accessToken) {
      window.location.href = '/login';
      return;
    }
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  const openDetailsModal = async (room) => {
    try {
      const response = await getRoomDetails(room.room_number);
      setSelectedRoom(response.data);
      setIsDetailsModalOpen(true);
    } catch (err) {
      setError('Ошибка загрузки деталей номера.');
    }
  };

  const closeModals = () => {
    setIsBookingModalOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedRoom(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Все номера</h2>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 mb-4"
          >
            {error}
          </motion.p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room, index) => (
            <RoomCard
              key={room.room_number}
              room={room}
              onBook={openBookingModal}
              onDetails={openDetailsModal}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            />
          ))}
        </div>
      </div>
      <BookingModal
        isOpen={isBookingModalOpen}
        onRequestClose={closeModals}
        room={selectedRoom}
        initialCheckIn=""
        initialCheckOut=""
      />
      <InfoModal
        isOpen={isDetailsModalOpen}
        onRequestClose={closeModals}
        item={selectedRoom}
        type="room"
      />
    </div>
  );
}

export default RoomList;