import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
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
            <Link
                to="/login"
                className="bg-spotify-green text-black px-4 py-2 rounded-full hover:bg-green-400 transition-colors"
              >
                Login with Spotify
              </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
