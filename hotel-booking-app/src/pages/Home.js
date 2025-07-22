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

      {/* Секция с картой и локациями */}
      <div className="bg-white/90 backdrop-blur-md py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Наши локации
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Отели CLUB43 расположены в самых престижных районах Москвы
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
                center={[55.7539, 37.6208]} // Красная площадь
                zoom={12}
                height="400px"
                className="w-full"
              />
            </motion.div>

            {/* Информация о локациях */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      CLUB43 Центр
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Красная площадь, 1
                    </p>
                    <p className="text-gray-500 text-sm">
                      Наш флагманский отель в самом сердце столицы, в шаговой доступности от главных достопримечательностей
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      CLUB43 Парк
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Парк Горького, 9
                    </p>
                    <p className="text-gray-500 text-sm">
                      Уютный отель рядом с парком Горького, идеально подходит для спокойного отдыха в зеленой зоне
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      CLUB43 Бизнес
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Московский Сити
                    </p>
                    <p className="text-gray-500 text-sm">
                      Современный бизнес-отель в деловом центре столицы, оснащенный всем необходимым для работы
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
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
      <footer className="bg-gray-900 text-white py-4 text-center">
        <p>© 2025 CLUB43. Все права защищены.</p>
      </footer>
    </div>
  );
}

export default Home;