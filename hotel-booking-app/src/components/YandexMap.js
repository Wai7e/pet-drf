import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const YandexMap = ({
  center = [44.5606, 38.0767], // Геленджик по умолчанию
  zoom = 13,
  className = '',
  height = '400px',
  onCenterChange,
  onZoomChange,
}) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const initMap = useCallback(() => {
    if (!window.ymaps || !mapRef.current || mapInstance.current) return;

    window.ymaps.ready(() => {
      try {
        mapInstance.current = new window.ymaps.Map(mapRef.current, {
          center: center,
          zoom: zoom,
          controls: ['zoomControl', 'fullscreenControl', 'geolocationControl'],
        });

        mapInstance.current.options.set('theme', 'islands#night');

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
          hintContent: 'CLUB43 Геленджик',
        }, {
          preset: 'islands#darkBlueHotelIcon',
          iconColor: '#2563eb',
        });

        mapInstance.current.geoObjects.add(placemark);

        mapInstance.current.behaviors.enable(['default', 'scrollZoom']);

        // Обновляем состояние при изменении центра или зума
        const updateMapState = () => {
          const newCenter = mapInstance.current.getCenter();
          const newZoom = mapInstance.current.getZoom();
          if (onCenterChange && JSON.stringify(newCenter) !== JSON.stringify(center)) {
            onCenterChange(newCenter);
          }
          if (onZoomChange && newZoom !== zoom) {
            onZoomChange(newZoom);
          }
        };
        mapInstance.current.events.add('boundschange', updateMapState);

        setIsLoading(false);
      } catch (error) {
        console.error('Ошибка при инициализации карты:', error);
        setHasError(true);
        setIsLoading(false);
      }
    });
  }, [center, zoom, onCenterChange, onZoomChange]);

  useEffect(() => {
    let script = document.getElementById('yandex-map-script');

    if (!window.ymaps) {
      if (!script) {
        script = document.createElement('script');
        script.id = 'yandex-map-script';
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=1725543c-4798-4cee-93f7-0e7fe6c48268&lang=ru_RU`;
        script.async = true;
        script.onload = initMap;
        script.onerror = (error) => {
          console.error('Ошибка загрузки Яндекс Карты API:', error);
          setHasError(true);
          setIsLoading(false);
        };
        document.head.appendChild(script);
      }
    } else {
      initMap();
    }

    return () => {
      if (mapInstance.current) {
        try {
          mapInstance.current.events.removeAll();
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
  }, [initMap]);

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
            <p className="text-xs text-gray-400 mt-1">Проверьте подключение к интернету или API-ключ</p>
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