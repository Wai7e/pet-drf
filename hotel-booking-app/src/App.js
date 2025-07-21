import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RoomList from './pages/RoomList';
import Login from './pages/Login';
import Bookings from './pages/Bookings';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { useEffect } from 'react';
import { getProfile } from './api/auth';
import useAuthStore from './store/authStore';

function App() {
  const setUserProfile = useAuthStore((state) => state.setUserProfile);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setUserProfile(response.data);
      } catch (err) {
        setUserProfile(null);
      }
    };
    fetchProfile();
  }, [setUserProfile]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<RoomList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;