import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { login } from '../api/auth';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { accessToken, setTokens } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Пожалуйста, заполните все поля.');
      return;
    }
    try {
      const response = await login({ username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      setTokens(response.data.access, response.data.refresh);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка входа. Проверьте данные.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Вход
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Имя пользователя
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Войти
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;