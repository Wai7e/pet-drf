import { useState } from 'react';
   import Modal from 'react-modal';
   import { motion } from 'framer-motion';
   import { toast } from 'react-toastify';
   import { createBooking } from '../api/bookings';
   import DatePicker from 'react-datepicker';
   import 'react-datepicker/dist/react-datepicker.css';

   function BookingModal({ isOpen, onRequestClose, room, initialCheckIn, initialCheckOut }) {
     const [bookingForm, setBookingForm] = useState({
       checkIn: initialCheckIn ? new Date(initialCheckIn) : null,
       checkOut: initialCheckOut ? new Date(initialCheckOut) : null,
     });
     const [bookingError, setBookingError] = useState('');

     const formatDate = (date) => {
       if (!date) return '';
       return date.toISOString().split('T')[0];
     };

     const handleBookingSubmit = async () => {
       if (!bookingForm.checkIn || !bookingForm.checkOut) {
         setBookingError('Пожалуйста, выберите даты заезда и выезда.');
         toast.error('Пожалуйста, выберите даты заезда и выезда.');
         return;
       }
       if (bookingForm.checkIn >= bookingForm.checkOut) {
         setBookingError('Дата выезда должна быть позже даты заезда.');
         toast.error('Дата выезда должна быть позже даты заезда.');
         return;
       }
       if (bookingForm.checkIn < new Date().setHours(0, 0, 0, 0)) {
         setBookingError('Дата заезда не может быть в прошлом.');
         toast.error('Дата заезда не может быть в прошлом.');
         return;
       }

       try {
         await createBooking({
           room_id: room?.room_number,
           check_in_date: formatDate(bookingForm.checkIn),
           check_out_date: formatDate(bookingForm.checkOut),
         });
         setBookingError('');
         onRequestClose();
         toast.success('Бронирование успешно создано!', {
           position: 'top-right',
           autoClose: 3000,
         });
       } catch (err) {
         setBookingError(err.response?.data?.detail || 'Номер уже забронирован😥 Выберите другой номер или другие даты.');
         toast.error(err.response?.data?.detail || 'Номер уже забронирован.');
       }
     };

     return (
       <Modal
         isOpen={isOpen}
         onRequestClose={onRequestClose}
         className="max-w-md w-full mx-auto mt-20"
         overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center"
       >
         <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.95 }}
           transition={{ duration: 0.3 }}
           className="bg-white/80 backdrop-blur-md rounded-lg p-6"
         >
           <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
             Бронирование номера {room?.room_name || 'Номер'}
           </h2>
           {bookingError && <p className="text-red-500 mb-4 text-center">{bookingError}</p>}
           <div className="space-y-4">
             <div>
               <label className="block text-gray-700 font-medium mb-1">Дата заезда</label>
               <DatePicker
                 selected={bookingForm.checkIn}
                 onChange={(date) => setBookingForm({ ...bookingForm, checkIn: date })}
                 minDate={new Date()}
                 dateFormat="yyyy-MM-dd"
                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                 placeholderText="Выберите дату заезда"
               />
             </div>
             <div>
               <label className="block text-gray-700 font-medium mb-1">Дата выезда</label>
               <DatePicker
                 selected={bookingForm.checkOut}
                 onChange={(date) => setBookingForm({ ...bookingForm, checkOut: date })}
                 minDate={bookingForm.checkIn ? new Date(bookingForm.checkIn.getTime() + 24 * 60 * 60 * 1000) : new Date()}
                 dateFormat="yyyy-MM-dd"
                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                 placeholderText="Выберите дату выезда"
               />
             </div>
             <div className="flex gap-2">
               <button
                 onClick={handleBookingSubmit}
                 className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
               >
                 Подтвердить
               </button>
               <button
                 onClick={onRequestClose}
                 className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
               >
                 Отмена
               </button>
             </div>
           </div>
         </motion.div>
       </Modal>
     );
   }

   export default BookingModal;