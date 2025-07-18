import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/authSlice';
import { Music, Search, BarChart3, User, LogOut, Menu } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="bg-spotify-black text-white shadow-lg border-b border-spotify-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-spotify-green hover:text-green-400 transition-colors">
            <Music className="w-8 h-8" />
            <span>SpotifyScope</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="flex items-center space-x-2 hover:text-spotify-green transition-colors group"
            >
              <BarChart3 className="w-4 h-4 group-hover:text-spotify-green" />
              <span>Home</span>
            </Link>
            <Link 
              to="/demo" 
              className="flex items-center space-x-2 hover:text-spotify-green transition-colors group"
            >
              <Search className="w-4 h-4 group-hover:text-spotify-green" />
              <span>Demo</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-2 hover:text-spotify-green transition-colors group"
                >
                  <BarChart3 className="w-4 h-4 group-hover:text-spotify-green" />
                  <span>Dashboard</span>
                </Link>
                
                {/* User Menu */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {user?.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={user.displayName}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User className="w-8 h-8 p-1 bg-spotify-gray-700 rounded-full" />
                    )}
                    <span className="text-sm text-spotify-gray-300">
                      {user?.displayName}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-spotify-green text-black px-4 py-2 rounded-full hover:bg-green-400 transition-all duration-200 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-spotify-green text-black px-6 py-2 rounded-full hover:bg-green-400 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                Login with Spotify
              </Link>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 hover:bg-spotify-gray-800 rounded-lg transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
