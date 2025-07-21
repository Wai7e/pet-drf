import { useState } from 'react';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.vfs;

function InfoModal({ isOpen, onRequestClose, item, type }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const statusColors = {
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
  };

  const openFullScreen = (image) => {
    setFullScreenImage(image);
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
    setFullScreenImage(null);
  };

  const handlePrint = () => {
    if (!item || type !== 'booking') return;
    const user = item.user_profile || {};
    const room = item.room || {};

    const docDefinition = {
      content: [
        { text: 'CLUB43 Receipt', style: 'header', alignment: 'center', margin: [0, 0, 0, 10] },
        { canvas: [ { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#999' } ], margin: [0, 0, 0, 10] },
        { text: 'CLUB43 Details', style: 'subheader', margin: [0, 0, 0, 5] },
        {
          style: 'tableExample',
          table: {
            widths: [120, '*'],
            body: [
              ['Booking ID:', item.id || '-'],
              ['Room:', room.room_number || '-'],
              ['Room type:', room.room_type === 'Стандарт' ? 'Standart' : (room.room_type || '-')],
              ['Check-in:', item.check_in_date || '-'],
              ['Check-out:', item.check_out_date || '-'],
              ['Total price:', item.total_price ? item.total_price + ' RUB' : '-'],
              ['Status:', (item.status || '-').toUpperCase()],
              ['Created at:', item.created_at || '-'],
            ]
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 10]
        },
        { text: 'Guest', style: 'subheader', margin: [0, 10, 0, 5] },
        {
          style: 'tableExample',
          table: {
            widths: [120, '*'],
            body: [
              user.email ? ['Email:', user.email] : null,
              user.first_name ? ['First name:', user.first_name] : null,
              user.last_name ? ['Last name:', user.last_name] : null,
              user.phone_number ? ['Phone:', user.phone_number] : null,
            ].filter(Boolean)
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 10]
        },
        room.description || room.descripton
          ? [
              { text: 'Room Description', style: 'subheader', margin: [0, 10, 0, 5] },
              { text: room.description || room.descripton, fontSize: 10, margin: [0, 0, 0, 10] }
            ]
          : null,
        { canvas: [ { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#999' } ], margin: [0, 10, 0, 0] },
        { text: 'Thank you for choosing CLUB43!', style: 'footer', alignment: 'center', margin: [0, 10, 0, 0] }
      ].flat(),
      styles: {
        header: { fontSize: 20, bold: true },
        subheader: { fontSize: 14, bold: true },
        tableExample: { fontSize: 12 },
        footer: { fontSize: 10, italics: true }
      },
      defaultStyle: {
        font: 'Roboto'
      }
    };

    pdfMake.createPdf(docDefinition).download(`booking_${item.id || 'info'}.pdf`);
  };

  // Определяем данные для отображения
  const roomData = type === 'room' && item?.room ? item.room : item;
  const photos = type === 'room' ? item?.photos || (roomData?.photos ? [roomData] : []) : item?.room?.photos || [];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        className="max-w-lg w-full mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="bg-white/80 backdrop-blur-md rounded-lg p-6"
        >
          {!item ? (
            <p className="text-red-500">Нет данных о номере</p>
          ) : type === 'room' && roomData ? (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {roomData.room_name || 'Без названия'}
              </h2>
              {photos.length > 0 ? (
                <Slider {...sliderSettings} className="mb-4">
                  {photos.map((photo) => (
                    <div key={photo.id || photo.room_number} onClick={() => openFullScreen(`http://127.0.0.1:8000/${photo.image || photo.photo}`)}>
                      <img
                        src={`http://127.0.0.1:8000/${photo.image || photo.photo}`}
                        alt={`${roomData.room_name} - ${photo.id || photo.room_number}`}
                        className="w-full max-h-96 object-contain rounded-md cursor-pointer"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </Slider>
              ) : roomData.photo ? (
                <img
                  src={`http://127.0.0.1:8000/${roomData.photo}`}
                  alt={roomData.room_name}
                  className="w-full max-h-96 object-contain rounded-md mb-4 cursor-pointer"
                  onClick={() => openFullScreen(`http://127.0.0.1:8000/${roomData.photo}`)}
                  loading="lazy"
                />
              ) : (
                <div className="w-full max-h-96 bg-gray-200 flex items-center justify-center rounded-md mb-4">
                  <span className="text-gray-500">Нет фото</span>
                </div>
              )}
              <p className="text-gray-600 mb-2">Тип: {roomData.room_type || 'Не указан'}</p>
              <p className="text-gray-600 mb-2">Цена: {roomData.price_per_night ? `${roomData.price_per_night} руб./ночь` : 'Не указана'}</p>
              <p className="text-gray-600 mb-2">Вместимость: {roomData.capacity ? `${roomData.capacity} чел.` : 'Не указана'}</p>
              <p className="text-gray-500 mb-4">{roomData.description || roomData.descripton || 'Нет описания'}</p>
              <button
                onClick={onRequestClose}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
              >
                Закрыть
              </button>
            </div>
          ) : type === 'booking' && item?.room ? (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Бронирование номера {item.room.room_name || 'Без названия'}
              </h2>
              {item.room.photos && item.room.photos.length > 0 ? (
                <Slider {...sliderSettings} className="mb-4">
                  {item.room.photos.map((photo) => (
                    <div key={photo.id} onClick={() => openFullScreen(`http://127.0.0.1:8000/${photo.image}`)}>
                      <img
                        src={`http://127.0.0.1:8000/${photo.image}`}
                        alt={`${item.room.room_name} - ${photo.id}`}
                        className="w-full max-h-96 object-contain rounded-md cursor-pointer"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </Slider>
              ) : item.room.photo ? (
                <img
                  src={`http://127.0.0.1:8000/${item.room.photo}`}
                  alt={item.room.room_name}
                  className="w-full max-h-96 object-contain rounded-md mb-4 cursor-pointer"
                  onClick={() => openFullScreen(`http://127.0.0.1:8000/${item.room.photo}`)}
                  loading="lazy"
                />
              ) : (
                <div className="w-full max-h-96 bg-gray-200 flex items-center justify-center rounded-md mb-4">
                  <span className="text-gray-500">Нет фото</span>
                </div>
              )}
              <p className="text-gray-600 mb-2">Номер: {item.room.room_number || 'Не указан'}</p>
              <p className="text-gray-600 mb-2">Тип: {item.room.room_type || 'Не указан'}</p>
              <p className="text-gray-600 mb-2">Цена: {item.room.price_per_night ? `${item.room.price_per_night} руб./ночь` : 'Не указана'}</p>
              <p className="text-gray-600 mb-2">Вместимость: {item.room.capacity ? `${item.room.capacity} чел.` : 'Не указана'}</p>
              <p className="text-gray-600 mb-2">Заезд: {item.check_in_date || 'Не указана'}</p>
              <p className="text-gray-600 mb-2">Выезд: {item.check_out_date || 'Не указан'}</p>
              <p className="text-gray-600 mb-2">Общая сумма: {item.total_price ? `${item.total_price} руб.` : 'Не указана'}</p>
              <p className={`text-sm font-medium mb-4 px-2 py-1 rounded ${statusColors[item.status] || 'bg-gray-100 text-gray-800'}`}>
                Статус: {item.status === 'confirmed' ? 'Подтверждено' : item.status === 'pending' ? 'В ожидании' : item.status === 'cancelled' ? 'Отменено' : 'Не указан'}
              </p>
              <p className="text-gray-500 mb-4">{item.room.description || item.room.descripton || 'Нет описания'}</p>
              <button
                onClick={onRequestClose}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition mb-2"
              >
                Закрыть
              </button>
              <button
                onClick={handlePrint}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Распечатать
              </button>
            </div>
          ) : (
            <p className="text-red-500">Нет данных о номере</p>
          )}
        </motion.div>
      </Modal>
      <Modal
        isOpen={isFullScreen}
        onRequestClose={closeFullScreen}
        className="w-full h-full flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black/80 flex items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-4xl w-full h-auto max-h-[90vh]"
        >
          {fullScreenImage && (
            <img
              src={fullScreenImage}
              alt="Full screen"
              className="w-full h-auto max-h-[90vh] object-contain rounded-md"
            />
          )}
          <button
            onClick={closeFullScreen}
            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
          >
            ✕
          </button>
        </motion.div>
      </Modal>
    </>
  );
}

export default InfoModal;