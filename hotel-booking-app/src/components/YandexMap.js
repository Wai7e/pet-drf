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
          
          // Добавляем метки отелей
          const locations = [
            {
              coords: [55.7539, 37.6208],
              name: 'CLUB43 Центр',
              address: 'Красная площадь, 1',
              color: '#2563eb'
            },
            {
              coords: [55.7312, 37.6014],
              name: 'CLUB43 Парк',
              address: 'Парк Горького, 9',
              color: '#059669'
            },
            {
              coords: [55.7468, 37.5386],
              name: 'CLUB43 Бизнес',
              address: 'Московский Сити',
              color: '#7c3aed'
            }
          ];

          locations.forEach(location => {
            const placemark = new window.ymaps.Placemark(location.coords, {
              balloonContent: `
                <div style="padding: 10px; font-family: Arial, sans-serif;">
                  <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px;">${location.name}</h3>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">${location.address}</p>
                  <button style="margin-top: 10px; background: ${location.color}; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Подробнее</button>
                </div>
              `,
              hintContent: location.name
            }, {
              preset: 'islands#blueHotelIcon',
              iconColor: location.color
            });

            mapInstance.current.geoObjects.add(placemark);
          });

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