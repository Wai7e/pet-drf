import { motion } from 'framer-motion';

function RoomCard({ room, onBook, onDetails }) {
  if (!room) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">
        Нет данных о номере
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
    >
      {room.photo ? (
        <img
          src={`http://127.0.0.1:8000${room.photo}`}
          alt={room.room_name}
          className="w-full h-48 object-contain rounded-t-md"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-md">
          <span className="text-gray-500">Нет фото</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{room.room_name || 'Название не указано'}</h3>
        <p className="text-gray-600">Номер: {room.room_number || 'Не указан'}</p>
        <p className="text-gray-600">Тип: {room.room_type || 'Не указан'}</p>
        <p className="text-gray-600">Цена: {room.price_per_night ? `${room.price_per_night} руб./ночь` : 'Не указана'}</p>
        <p className="text-gray-600">Вместимость: {room.capacity ? `${room.capacity} чел.` : 'Не указана'}</p>
        <p className="text-gray-500 mt-2">{room.description || room.descripton || 'Нет описания'}</p>
        <div className="mt-4 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onBook(room)}
            className="flex-1 bg-blue-600 text-white py-2 rounded-md"
          >
            Забронировать
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDetails(room)}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md"
          >
            Подробнее
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default RoomCard;