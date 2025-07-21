import { NavLink } from 'react-router-dom';
import useAuthStore from '../store/authStore';

function Navbar() {
  const { accessToken, logout } = useAuthStore();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/30 backdrop-blur-md border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center justify-between h-16">
          <li>
            <NavLink to="/" className="text-xl font-bold text-gray-900 hover:text-blue-600">
              CLUB43
            </NavLink>
          </li>
          <div className="flex items-center gap-6">
            <li>
              <NavLink
                to="/rooms"
                className={({ isActive }) =>
                  `text-gray-700 hover:text-blue-600 ${isActive ? 'font-semibold text-blue-600' : ''}`
                }
              >
                Номера
              </NavLink>
            </li>
            {accessToken ? (
              <>
                <li>
                  <NavLink
                    to="/bookings"
                    className={({ isActive }) =>
                      `text-gray-700 hover:text-blue-600 ${isActive ? 'font-semibold text-blue-600' : ''}`
                    }
                  >
                    Бронирования
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `text-gray-700 hover:text-blue-600 ${isActive ? 'font-semibold text-blue-600' : ''}`
                    }
                  >
                    Профиль
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Выйти
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `text-gray-700 hover:text-blue-600 ${isActive ? 'font-semibold text-blue-600' : ''}`
                    }
                  >
                    Регистрация
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `text-gray-700 hover:text-blue-600 ${isActive ? 'font-semibold text-blue-600' : ''}`
                    }
                  >
                    Вход
                  </NavLink>
                </li>
              </>
            )}
          </div>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;