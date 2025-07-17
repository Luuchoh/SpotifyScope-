import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import { authService } from '../services/authService';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSpotifyLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.getSpotifyAuthUrl();
      window.location.href = response.authUrl;
    } catch (err) {
      setError('Failed to initiate Spotify login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md mx-auto"
      >
        <div className="bg-gray-800 p-8 rounded-lg text-center">
          <h1 className="text-3xl font-bold text-white mb-6">
            Login to SpotifyScope
          </h1>
          
          <p className="text-gray-300 mb-8">
            Connect your Spotify account to access your personal music analytics
          </p>

          {error && (
            <div className="bg-red-600 text-white p-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <button
            onClick={handleSpotifyLogin}
            disabled={loading}
            className="w-full bg-spotify-green text-black py-3 px-6 rounded-full font-semibold hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Continue with Spotify
              </>
            )}
          </button>

          <p className="text-gray-400 text-sm mt-6">
            We only access your music listening data to provide analytics. 
            Your data is never shared with third parties.
          </p>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Login;
