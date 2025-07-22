import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const YandexMap = ({ 
  center = [55.751244, 37.618423], // Координаты Москвы по умолчанию
  zoom = 10,
  className = '',
  height = '400px'
}) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let script = null;
    
    const initMap = () => {
      try {
        if (!window.ymaps) {
          console.warn('Яндекс Карты API не загружен');
          return;
        }

        window.ymaps.ready(() => {
          try {
            if (mapRef.current && !mapInstance.current) {
              // Создаем карту
              mapInstance.current = new window.ymaps.Map(mapRef.current, {
                center: center,
                zoom: zoom,
                controls: ['zoomControl', 'fullscreenControl', 'geolocationControl']
              });

              // Добавляем темную тему карты
              mapInstance.current.options.set('theme', 'islands#night');
              
              // Добавляем метку отеля в Геленджике
              const placemark = new window.ymaps.Placemark(center, {
                balloonContent: `
                  <div style="padding: 12px; font-family: Arial, sans-serif; max-width: 250px; background: #1f2937; color: white; border-radius: 8px;">
                    <h3 style="margin: 0 0 8px 0; color: white; font-size: 16px; font-weight: bold;">CLUB43 Геленджик</h3>
                    <p style="margin: 0 0 8px 0; color: #d1d5db; font-size: 14px;">г. Геленджик, ул. Курортная, 1</p>
                    <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 12px;">Курортный отель с видом на море</p>
                    <div style="display: flex; gap: 8px;">
                      <button style="background: #2563eb; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; flex: 1;">Забронировать</button>
                      <button style="background: #374151; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Подробнее</button>
                    </div>
                  </div>
                `,
                hintContent: 'CLUB43 Геленджик'
              }, {
                preset: 'islands#darkBlueHotelIcon',
                iconColor: '#2563eb'
              });

              mapInstance.current.geoObjects.add(placemark);

              // Настраиваем поведение карты
              mapInstance.current.behaviors.enable([
                'default',
                'scrollZoom'
              ]);
              
              setIsLoading(false);
            }
          } catch (error) {
            console.error('Ошибка при инициализации карты:', error);
            setHasError(true);
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error('Ошибка при работе с Яндекс Карты API:', error);
      }
    };

    // Загружаем Яндекс Карты API
    if (!window.ymaps) {
      script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=1725543c-4798-4cee-93f7-0e7fe6c48268&lang=ru_RU`;
      script.async = true;
      script.onload = initMap;
      script.onerror = (error) => {
        console.error('Ошибка загрузки Яндекс Карты API:', error);
        setHasError(true);
        setIsLoading(false);
      };
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      if (mapInstance.current) {
        try {
          mapInstance.current.destroy();
          mapInstance.current = null;
        } catch (error) {
          console.error('Ошибка при очистке карты:', error);
        }
      }
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [center, zoom]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`rounded-lg overflow-hidden shadow-lg border border-gray-200/50 relative ${className}`}
      style={{ height }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white text-sm">Загрузка карты...</p>
          </div>
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
          <div className="text-center text-white p-6">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">Ошибка загрузки карты</p>
            <p className="text-xs text-gray-400 mt-1">Проверьте подключение к интернету</p>
          </div>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '300px' }}
      />
    </motion.div>
  );
};

export default YandexMap;