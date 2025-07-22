import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAvailableRooms, getRoomDetails } from '../api/rooms';
import useAuthStore from '../store/authStore';
import RoomCard from '../components/RoomCard';
import BookingModal from '../components/BookingModal';
import InfoModal from '../components/InfoModal';
import YandexMap from '../components/YandexMap';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const backgroundImages = [
  '/media/image1.jpg',
  '/media/image2.jpg',
  '/media/image3.jpg',
];

function Home() {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleSearch = async () => {
    if (!checkIn || !checkOut) {
      setError('Пожалуйста, выберите даты заезда и выезда.');
      toast.error('Пожалуйста, выберите даты заезда и выезда.');
      return;
    }
    if (checkIn >= checkOut) {
      setError('Дата выезда должна быть позже даты заезда.');
      toast.error('Дата выезда должна быть позже даты заезда.');
      return;
    }
    if (checkIn < new Date().setHours(0, 0, 0, 0)) {
      setError('Дата заезда не может быть в прошлом.');
      toast.error('Дата заезда не может быть в прошлом.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await getAvailableRooms({
        check_in_date: formatDate(checkIn),
        check_out_date: formatDate(checkOut),
      });
      setRooms(response.data.available_rooms);
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка при поиске номеров. Попробуйте снова.');
      toast.error(err.response?.data?.detail || 'Ошибка при поиске номеров.');
    } finally {
      setLoading(false);
    }
  };

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
      toast.error('Ошибка загрузки деталей номера.');
    }
  };

  const closeModals = () => {
    setIsBookingModalOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedRoom(null);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center transition-all duration-1000 flex flex-col"
      style={{ backgroundImage: `url(${backgroundImages[currentImage]})` }}
    >
      <div className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-md rounded-lg p-6 max-w-3xl w-full text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Найдите идеальный номер
          </h1>
          <div className="space-y-4 md:flex md:flex-row md:space-x-6 md:space-y-0">
            <div className="w-full md:w-1/3">
              <label className="block text-gray-700 font-medium mb-1">
                Дата заезда
              </label>
              <DatePicker
                selected={checkIn}
                onChange={(date) => setCheckIn(date)}
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholderText="Выберите дату заезда"
              />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block text-gray-700 font-medium mb-1">
                Дата выезда
              </label>
              <DatePicker
                selected={checkOut}
                onChange={(date) => setCheckOut(date)}
                minDate={checkIn ? new Date(checkIn.getTime() + 24 * 60 * 60 * 1000) : new Date()}
                dateFormat="yyyy-MM-dd"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholderText="Выберите дату выезда"
              />
            </div>
            <div className="w-full md:w-1/3">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full md:w-auto mt-4 md:mt-6 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {loading ? 'Поиск...' : 'Найти номера'}
              </button>
            </div>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 mt-4"
            >
              {error}
            </motion.p>
          )}
        </motion.div>
      </div>
      {rooms.length > 0 && (
        <div className="bg-white/90 backdrop-blur-md py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Доступные номера
            </h2>
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
        </div>
      )}
      <BookingModal
        isOpen={isBookingModalOpen}
        onRequestClose={closeModals}
        room={selectedRoom}
        initialCheckIn={formatDate(checkIn)}
        initialCheckOut={formatDate(checkOut)}
      />
      <InfoModal
        isOpen={isDetailsModalOpen}
        onRequestClose={closeModals}
        item={selectedRoom}
        type="room"
      />
      
      {/* Секция с картой и локацией */}
      <div className="bg-white/90 backdrop-blur-md py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Наше расположение
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              CLUB43 находится в курортном городе Геленджик с прекрасным видом на море
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Карта */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <YandexMap
                center={[44.5606, 38.0767]} // Геленджик
                zoom={13}
                height="400px"
                className="w-full"
              />
            </motion.div>

            {/* Информация о локации */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      CLUB43 Геленджик
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      г. Геленджик, ул. Курортная, 1
                    </p>
                    <p className="text-gray-500 text-sm">
                      Наш курортный отель расположен в живописном Геленджике, всего в нескольких минутах ходьбы от пляжа и набережной
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 shadow-sm text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">До пляжа</h4>
                  <p className="text-gray-600 text-xs">3 минуты пешком</p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 shadow-sm text-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">Центр города</h4>
                  <p className="text-gray-600 text-xs">5 минут пешком</p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 shadow-sm text-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">Аэропорт</h4>
                  <p className="text-gray-600 text-xs">15 минут на авто</p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 shadow-sm text-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">Сафари-парк</h4>
                  <p className="text-gray-600 text-xs">10 минут на авто</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-4 text-center">
        <p>© 2025 CLUB43. Все права защищены.</p>
      </footer>
    </div>
  );
}

export default Home;