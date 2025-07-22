import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const YandexMap = ({ 
  center = [55.751244, 37.618423], // Координаты Москвы по умолчанию
  zoom = 10,
  className = '',
  height = '400px'
}) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    // Загружаем Яндекс Карты API
    if (!window.ymaps) {
      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=1725543c-4798-4cee-93f7-0e7fe6c48268&lang=ru_RU`;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      window.ymaps.ready(() => {
        if (mapRef.current && !mapInstance.current) {
          // Создаем карту
          mapInstance.current = new window.ymaps.Map(mapRef.current, {
            center: center,
            zoom: zoom,
            controls: ['zoomControl', 'fullscreenControl', 'geolocationControl']
          });

          // Добавляем стиль карты
          mapInstance.current.options.set('theme', 'islands#night');
          
          // Добавляем метку отеля
          const placemark = new window.ymaps.Placemark(center, {
            balloonContent: 'CLUB43 Hotel',
            hintContent: 'Наш отель'
          }, {
            preset: 'islands#blueHotelIcon',
            iconColor: '#2563eb'
          });

          mapInstance.current.geoObjects.add(placemark);

          // Настраиваем поведение карты
          mapInstance.current.behaviors.enable([
            'default',
            'scrollZoom'
          ]);
        }
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
    };
  }, [center, zoom]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`rounded-lg overflow-hidden shadow-lg border border-gray-200/50 ${className}`}
      style={{ height }}
    >
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '300px' }}
      />
    </motion.div>
  );
};

export default YandexMap;