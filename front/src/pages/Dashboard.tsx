import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { fetchUserAnalytics, fetchUserTopTracks, fetchUserTopArtists, fetchRecentlyPlayed, fetchRecommendations, setTimeRange } from '../store/musicSlice';
import { BarChart3, Music, Users, Clock, TrendingUp, Heart, Zap, Calendar, Headphones, Star } from 'lucide-react';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { userAnalytics, userTopTracks, userTopArtists, recentlyPlayed, recommendations, currentTimeRange, isLoading } = useAppSelector((state) => state.music);
  
  const [activeSection, setActiveSection] = useState<'overview' | 'tracks' | 'artists' | 'recent' | 'recommendations'>('overview');

  useEffect(() => {
    // Load user data on component mount
    dispatch(fetchUserAnalytics());
    dispatch(fetchUserTopTracks(currentTimeRange));
    dispatch(fetchUserTopArtists(currentTimeRange));
    dispatch(fetchRecentlyPlayed());
    dispatch(fetchRecommendations());
  }, [dispatch, currentTimeRange]);

  const handleTimeRangeChange = (timeRange: 'short_term' | 'medium_term' | 'long_term') => {
    dispatch(setTimeRange(timeRange));
    dispatch(fetchUserTopTracks(timeRange));
    dispatch(fetchUserTopArtists(timeRange));
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const timeRangeLabels = {
    short_term: 'Last 4 weeks',
    medium_term: 'Last 6 months',
    long_term: 'All time'
  };

  return (
    <div className="min-h-screen bg-spotify-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={user.displayName}
                className="w-20 h-20 rounded-full mr-4 border-4 border-spotify-green"
              />
            ) : (
              <div className="w-20 h-20 bg-spotify-gray-700 rounded-full mr-4 flex items-center justify-center">
                <Users className="w-10 h-10 text-spotify-green" />
              </div>
            )}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                Welcome back, <span className="text-spotify-green">{user?.displayName}</span>!
              </h1>
              <p className="text-xl text-spotify-gray-300">
                Your personal music analytics dashboard
              </p>
            </div>
          </div>
        </motion.div>

        {/* Time Range Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-spotify-gray-800 rounded-full p-1 flex space-x-1">
            {Object.entries(timeRangeLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => handleTimeRangeChange(key as any)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  currentTimeRange === key 
                    ? 'bg-spotify-green text-black' 
                    : 'text-spotify-gray-300 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-spotify-gray-800 rounded-full p-1 flex space-x-1 overflow-x-auto">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'tracks', label: 'Top Tracks', icon: Music },
              { key: 'artists', label: 'Top Artists', icon: Users },
              { key: 'recent', label: 'Recently Played', icon: Clock },
              { key: 'recommendations', label: 'Recommendations', icon: Star }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key as any)}
                className={`px-4 py-3 rounded-full font-medium transition-all flex items-center space-x-2 whitespace-nowrap ${
                  activeSection === key 
                    ? 'bg-spotify-green text-black' 
                    : 'text-spotify-gray-300 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-spotify-green border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-spotify-gray-300">Loading your music data...</p>
          </div>
        )}

        {/* Overview Section */}
        {activeSection === 'overview' && userAnalytics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-spotify-gray-800 rounded-2xl p-6 border border-spotify-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Zap className="w-8 h-8 text-spotify-green" />
                  <span className="text-2xl font-bold text-white">{userAnalytics.diversityScore}</span>
                </div>
                <h3 className="font-semibold text-white mb-1">Diversity Score</h3>
                <p className="text-sm text-spotify-gray-400">Musical variety index</p>
              </div>
              
              <div className="bg-spotify-gray-800 rounded-2xl p-6 border border-spotify-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Heart className="w-8 h-8 text-red-500" />
                  <span className="text-2xl font-bold text-white">{userAnalytics.moodProfile.happy}%</span>
                </div>
                <h3 className="font-semibold text-white mb-1">Happiness</h3>
                <p className="text-sm text-spotify-gray-400">Average mood valence</p>
              </div>
              
              <div className="bg-spotify-gray-800 rounded-2xl p-6 border border-spotify-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Zap className="w-8 h-8 text-yellow-500" />
                  <span className="text-2xl font-bold text-white">{userAnalytics.moodProfile.energetic}%</span>
                </div>
                <h3 className="font-semibold text-white mb-1">Energy</h3>
                <p className="text-sm text-spotify-gray-400">Average energy level</p>
              </div>
              
              <div className="bg-spotify-gray-800 rounded-2xl p-6 border border-spotify-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Headphones className="w-8 h-8 text-blue-500" />
                  <span className="text-2xl font-bold text-white">{userAnalytics.moodProfile.danceable}%</span>
                </div>
                <h3 className="font-semibold text-white mb-1">Danceability</h3>
                <p className="text-sm text-spotify-gray-400">How danceable your music is</p>
              </div>
            </div>

            {/* Top Genres */}
            <div className="bg-spotify-gray-800 rounded-2xl p-8 border border-spotify-gray-700">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-spotify-green" />
                Your Top Genres
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userAnalytics.topGenres.slice(0, 6).map((genre, index) => (
                  <div key={genre.genre} className="flex items-center justify-between p-4 bg-spotify-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-spotify-green font-bold text-lg">#{index + 1}</span>
                      <span className="font-medium capitalize">{genre.genre}</span>
                    </div>
                    <span className="text-spotify-green font-bold">{genre.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Listening Patterns */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-spotify-gray-800 rounded-2xl p-8 border border-spotify-gray-700">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-spotify-green" />
                  Listening by Time of Day
                </h3>
                <div className="space-y-4">
                  {Object.entries(userAnalytics.listeningPatterns.timeOfDay).map(([time, count]) => (
                    <div key={time} className="flex items-center justify-between">
                      <span className="capitalize font-medium">{time}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-spotify-gray-600 rounded-full h-2">
                          <div 
                            className="bg-spotify-green h-2 rounded-full"
                            style={{ width: `${(count / Math.max(...Object.values(userAnalytics.listeningPatterns.timeOfDay))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-spotify-gray-400">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-spotify-gray-800 rounded-2xl p-8 border border-spotify-gray-700">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-spotify-green" />
                  Listening by Day of Week
                </h3>
                <div className="space-y-4">
                  {Object.entries(userAnalytics.listeningPatterns.dayOfWeek).map(([day, count]) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="capitalize font-medium">{day}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-spotify-gray-600 rounded-full h-2">
                          <div 
                            className="bg-spotify-green h-2 rounded-full"
                            style={{ width: `${(count / Math.max(...Object.values(userAnalytics.listeningPatterns.dayOfWeek))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-spotify-gray-400">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Top Tracks Section */}
        {activeSection === 'tracks' && userTopTracks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-spotify-gray-800 rounded-2xl p-8 border border-spotify-gray-700"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Music className="w-6 h-6 mr-2 text-spotify-green" />
              Your Top Tracks - {timeRangeLabels[currentTimeRange]}
            </h2>
            <div className="space-y-4">
              {userTopTracks.slice(0, 20).map((track, index) => (
                <div key={track.id} className="flex items-center space-x-4 p-4 bg-spotify-gray-700 rounded-lg hover:bg-spotify-gray-600 transition-colors">
                  <span className="text-spotify-green font-bold text-lg w-8">#{index + 1}</span>
                  <img
                    src={track.album.images[0]?.url || '/placeholder-album.png'}
                    alt={track.album.name}
                    className="w-16 h-16 rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{track.name}</h3>
                    <p className="text-spotify-gray-300">
                      {track.artists.map(artist => artist.name).join(', ')}
                    </p>
                    <p className="text-sm text-spotify-gray-400">
                      {track.album.name} • {formatDuration(track.duration_ms)}
                    </p>
                  </div>
                  <div className="text-sm text-spotify-gray-400">
                    {track.popularity}% popular
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Top Artists Section */}
        {activeSection === 'artists' && userTopArtists.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-spotify-gray-800 rounded-2xl p-8 border border-spotify-gray-700"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Users className="w-6 h-6 mr-2 text-spotify-green" />
              Your Top Artists - {timeRangeLabels[currentTimeRange]}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {userTopArtists.slice(0, 20).map((artist, index) => (
                <div key={artist.id} className="flex items-center space-x-4 p-4 bg-spotify-gray-700 rounded-lg hover:bg-spotify-gray-600 transition-colors">
                  <span className="text-spotify-green font-bold text-lg w-8">#{index + 1}</span>
                  <img
                    src={artist.images[0]?.url || '/placeholder-artist.png'}
                    alt={artist.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{artist.name}</h3>
                    <p className="text-spotify-gray-300">
                      {artist.followers.total.toLocaleString()} followers
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {artist.genres.slice(0, 2).map((genre) => (
                        <span
                          key={genre}
                          className="text-xs bg-spotify-gray-600 px-2 py-1 rounded-full"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recently Played Section */}
        {activeSection === 'recent' && recentlyPlayed.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-spotify-gray-800 rounded-2xl p-8 border border-spotify-gray-700"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-spotify-green" />
              Recently Played
            </h2>
            <div className="space-y-4">
              {recentlyPlayed.slice(0, 20).map((item, index) => (
                <div key={`${item.track.id}-${index}`} className="flex items-center space-x-4 p-4 bg-spotify-gray-700 rounded-lg">
                  <img
                    src={item.track.album.images[0]?.url || '/placeholder-album.png'}
                    alt={item.track.album.name}
                    className="w-16 h-16 rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{item.track.name}</h3>
                    <p className="text-spotify-gray-300">
                      {item.track.artists.map((artist: any) => artist.name).join(', ')}
                    </p>
                    <p className="text-sm text-spotify-gray-400">
                      Played {new Date(item.played_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recommendations Section */}
        {activeSection === 'recommendations' && recommendations && Array.isArray(recommendations) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-spotify-gray-800 rounded-2xl p-8 border border-spotify-gray-700"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Star className="w-6 h-6 mr-2 text-spotify-green" />
              Recommended for You
            </h2>
            <p className="text-spotify-gray-300 mb-6">
              Based on your listening habits and musical preferences
            </p>
            <div className="space-y-4">
              {recommendations.slice(0, 10).map((track: any) => (
                <div key={track.id} className="flex items-center space-x-4 p-4 bg-spotify-gray-700 rounded-lg hover:bg-spotify-gray-600 transition-colors">
                  <img
                    src={track.album.images[0]?.url || '/placeholder-album.png'}
                    alt={track.album.name}
                    className="w-16 h-16 rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{track.name}</h3>
                    <p className="text-spotify-gray-300">
                      {track.artists.map((artist: any) => artist.name).join(', ')}
                    </p>
                    <p className="text-sm text-spotify-gray-400">
                      {track.album.name} • {formatDuration(track.duration_ms)}
                    </p>
                  </div>
                  <Star className="w-5 h-5 text-spotify-green" />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
