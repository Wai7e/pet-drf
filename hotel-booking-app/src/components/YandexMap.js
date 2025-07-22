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

          // Добавляем стиль карты (светлая тема для лучшей интеграции)
          
          // Добавляем метку отеля в Геленджике
          const placemark = new window.ymaps.Placemark(center, {
            balloonContent: `
              <div style="padding: 12px; font-family: Arial, sans-serif; max-width: 250px;">
                <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: bold;">CLUB43 Геленджик</h3>
                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">г. Геленджик, ул. Курортная, 1</p>
                <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 12px;">Курортный отель с видом на море</p>
                <div style="display: flex; gap: 8px;">
                  <button style="background: #2563eb; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; flex: 1;">Забронировать</button>
                  <button style="background: #f3f4f6; color: #374151; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Подробнее</button>
                </div>
              </div>
            `,
            hintContent: 'CLUB43 Геленджик'
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