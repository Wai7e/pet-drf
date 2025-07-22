import { useState } from 'react';
import { motion } from 'framer-motion';
import YandexMap from '../components/YandexMap';

const locations = [
  {
    id: 1,
    name: 'CLUB43 Центр',
    address: 'Москва, Красная площадь, 1',
    coords: [55.7539, 37.6208],
    description: 'Наш главный отель в самом сердце Москвы'
  },
  {
    id: 2,
    name: 'CLUB43 Парк',
    address: 'Москва, Парк Горького, 9',
    coords: [55.7312, 37.6014],
    description: 'Уютный отель рядом с парком'
  },
  {
    id: 3,
    name: 'CLUB43 Бизнес',
    address: 'Москва, Московский Сити',
    coords: [55.7468, 37.5386],
    description: 'Современный бизнес-отель'
  }
];

function MapPage() {
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [mapKey, setMapKey] = useState(0);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setMapKey(prev => prev + 1); // Обновляем ключ для пересоздания карты
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Наши локации
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Найдите идеальное место для вашего пребывания. Наши отели расположены в лучших районах города.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Карточки локаций */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-lg border border-gray-200/50">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Выберите локацию
              </h2>
              <div className="space-y-3">
                {locations.map((location, index) => (
                  <motion.button
                    key={location.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => handleLocationSelect(location)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedLocation.id === location.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {location.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {location.address}
                    </p>
                    <p className="text-xs text-gray-500">
                      {location.description}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Информация о выбранной локации */}
            <motion.div
              key={selectedLocation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-lg border border-gray-200/50"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {selectedLocation.name}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {selectedLocation.address}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {selectedLocation.description}
                </div>
              </div>
              <div className="mt-4">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200">
                  Забронировать номер
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Карта */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-lg border border-gray-200/50">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Карта
              </h2>
              <YandexMap
                key={mapKey}
                center={selectedLocation.coords}
                zoom={15}
                height="500px"
                className="w-full"
              />
            </div>
          </motion.div>
        </div>

        {/* Дополнительная информация */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-lg border border-gray-200/50 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Удобное расположение
            </h3>
            <p className="text-gray-600 text-sm">
              Все наши отели находятся в центральных районах с удобной транспортной доступностью
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-lg border border-gray-200/50 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Высокое качество
            </h3>
            <p className="text-gray-600 text-sm">
              Современные номера с высоким уровнем сервиса и комфорта для наших гостей
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-lg border border-gray-200/50 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              24/7 Поддержка
            </h3>
            <p className="text-gray-600 text-sm">
              Круглосуточная поддержка гостей и помощь в решении любых вопросов
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default MapPage;