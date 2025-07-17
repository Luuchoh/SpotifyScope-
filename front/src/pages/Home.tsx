import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';

const Home: React.FC = () => {
  return (
    <Layout>
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold text-white mb-6">
            Welcome to <span className="text-spotify-green">SpotifyScope</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover insights about your music taste with advanced analytics and beautiful visualizations
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">Demo Mode</h2>
            <p className="text-gray-300 mb-6">
              Explore sample music data and see what SpotifyScope can do without logging in
            </p>
            <Link
              to="/demo"
              className="bg-spotify-green text-black px-6 py-3 rounded-full font-semibold hover:bg-green-400 transition-colors inline-block"
            >
              Try Demo
            </Link>
          </div>

          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">Personal Dashboard</h2>
            <p className="text-gray-300 mb-6">
              Connect your Spotify account to get personalized insights about your music
            </p>
            <Link
              to="/login"
              className="bg-spotify-green text-black px-6 py-3 rounded-full font-semibold hover:bg-green-400 transition-colors inline-block"
            >
              Login with Spotify
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-semibold text-white mb-8">Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-spotify-green mb-3">Top Tracks Analysis</h3>
              <p className="text-gray-300">Discover your most played tracks with detailed statistics</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-spotify-green mb-3">Genre Insights</h3>
              <p className="text-gray-300">Visualize your music taste across different genres</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-spotify-green mb-3">Audio Features</h3>
              <p className="text-gray-300">Analyze the musical characteristics of your favorite songs</p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Home;
