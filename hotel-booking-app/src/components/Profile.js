import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';

function Profile() {
  const { user, accessToken, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) {
      toast.error('Пожалуйста, войдите в систему.');
      window.location.href = '/login';
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  if (loading) {
    return <div className="text-center text-gray-600">Загрузка...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-6 bg-white/80 backdrop-blur-md rounded-lg shadow-md"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Профиль</h1>
      {user ? (
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Имя:</label>
            <p className="text-gray-600">{user.username || 'Не указано'}</p>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Email:</label>
            <p className="text-gray-600">{user.email || 'Не указан'}</p>
          </div>
          <button
            onClick={logout}
            className="mt-6 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
          >
            Выйти
          </button>
        </div>
      ) : (
        <p className="text-gray-600">Информация о пользователе отсутствует.</p>
      )}
    </motion.div>
  );
}

export default Profile;