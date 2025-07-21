import { motion } from 'framer-motion';

function BookingCard({ booking, onDetails }) {
  if (!booking || !booking.room) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">
        Нет данных о номере
      </div>
    );
  }

  const statusColors = {
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const photo = booking.room.photos && booking.room.photos.length > 0
    ? booking.room.photos[0].image
    : booking.room.photo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
    >
      {photo ? (
        <img
          src={`http://127.0.0.1:8000/${photo}`}
          alt={booking.room.room_name}
          className="w-full h-48 object-contain rounded-t-md"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-md">
          <span className="text-gray-500">Нет фото</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{booking.room.room_name || 'Без названия'}</h3>
        <p className="text-gray-600">Номер: {booking.room.room_number || 'Не указан'}</p>
        <p className="text-gray-600">Заезд: {booking.check_in_date || 'Не указана'}</p>
        <p className="text-gray-600">Выезд: {booking.check_out_date || 'Не указан'}</p>
        <p className="text-gray-600">Общая сумма: {booking.total_price ? `${booking.total_price} руб.` : 'Не указана'}</p>
        <p className={`text-sm font-medium mt-2 px-2 py-1 rounded ${statusColors[booking.status] || 'bg-gray-100 text-gray-800'}`}>Статус: {booking.status === 'confirmed' ? 'Подтверждено' : booking.status === 'pending' ? 'В ожидании' : booking.status === 'cancelled' ? 'Отменено' : 'Не указан'}</p>
        <div className="mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDetails(booking)}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
          >
            Подробнее
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default BookingCard;