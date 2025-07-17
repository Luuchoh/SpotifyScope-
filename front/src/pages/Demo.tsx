import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import TopTracksChart from '../components/Charts/TopTracksChart';
import GenreChart from '../components/Charts/GenreChart';
import { musicService, DemoData } from '../services/musicService';

const Demo: React.FC = () => {
  const [demoData, setDemoData] = useState<DemoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDemoData = async () => {
      try {
        const data = await musicService.getDemoData();
        setDemoData(data);
      } catch (err) {
        setError('Failed to load demo data');
        console.error('Error fetching demo data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDemoData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-spotify-green"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Demo Mode
          </h1>
          <p className="text-xl text-gray-300">
            Explore sample music data and visualizations
          </p>
        </div>

        {demoData && (
          <div className="grid gap-8">
            <div className="grid md:grid-cols-2 gap-8">
              <TopTracksChart data={demoData.topTracks} />
              <GenreChart data={demoData.genres} />
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Top Artists</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {demoData.topArtists.map((artist, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-white">{artist.name}</h4>
                    <p className="text-gray-300">{artist.plays.toLocaleString()} plays</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Demo;
