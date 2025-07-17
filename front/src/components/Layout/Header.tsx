import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="bg-spotify-black text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-spotify-green">
            SpotifyScope
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-spotify-green transition-colors">
              Home
            </Link>
            <Link to="/demo" className="hover:text-spotify-green transition-colors">
              Demo
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-spotify-green transition-colors">
                  Dashboard
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-sm">Welcome, {user?.displayName}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-spotify-green text-black px-4 py-2 rounded-full hover:bg-green-400 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-spotify-green text-black px-4 py-2 rounded-full hover:bg-green-400 transition-colors"
              >
                Login with Spotify
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
