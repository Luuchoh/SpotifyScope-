import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { searchTracks, searchArtists, fetchTrackAnalysis, fetchArtistAnalysis, setSelectedTrack, setSelectedArtist } from '../store/musicSlice';
import { Search, Music, User, BarChart3, Play, ExternalLink, Clock, TrendingUp } from 'lucide-react';

const DemoPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchResults, selectedTrack, selectedArtist, trackAnalysis, artistAnalysis, isLoading } = useAppSelector((state) => state.music);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'tracks' | 'artists'>('tracks');
  const [activeTab, setActiveTab] = useState<'search' | 'track' | 'artist'>('search');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    if (searchType === 'tracks') {
      await dispatch(searchTracks(searchQuery));
    } else {
      await dispatch(searchArtists(searchQuery));
    }
  };

  const handleTrackSelect = async (track: any) => {
    dispatch(setSelectedTrack(track));
    await dispatch(fetchTrackAnalysis(track.id));
    setActiveTab('track');
  };

  const handleArtistSelect = async (artist: any) => {
    dispatch(setSelectedArtist(artist));
    await dispatch(fetchArtistAnalysis(artist.id));
    setActiveTab('artist');
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getAudioFeatureColor = (value: number) => {
    if (value >= 0.7) return 'bg-green-500';
    if (value >= 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-spotify-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-spotify-green">Demo Mode</span>
          </h1>
          <p className="text-xl text-spotify-gray-300 max-w-3xl mx-auto">
            Explore advanced music analytics without connecting your Spotify account. 
            Search for any track or artist to see detailed insights and audio analysis.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-spotify-gray-800 rounded-full p-1 flex space-x-1">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === 'search' 
                  ? 'bg-spotify-green text-black' 
                  : 'text-spotify-gray-300 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4 inline mr-2" />
              Search
            </button>
            <button
              onClick={() => setActiveTab('track')}
              disabled={!selectedTrack}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === 'track' && selectedTrack
                  ? 'bg-spotify-green text-black' 
                  : 'text-spotify-gray-300 hover:text-white disabled:opacity-50'
              }`}
            >
              <Music className="w-4 h-4 inline mr-2" />
              Track Analysis
            </button>
            <button
              onClick={() => setActiveTab('artist')}
              disabled={!selectedArtist}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === 'artist' && selectedArtist
                  ? 'bg-spotify-green text-black' 
                  : 'text-spotify-gray-300 hover:text-white disabled:opacity-50'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Artist Analysis
            </button>
          </div>
        </div>

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="max-w-4xl mx-auto">
            {/* Search Controls */}
            <div className="bg-spotify-gray-800 rounded-2xl p-8 mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search for tracks or artists..."
                    className="w-full bg-spotify-gray-700 text-white px-4 py-3 rounded-lg border border-spotify-gray-600 focus:border-spotify-green focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value as 'tracks' | 'artists')}
                    className="bg-spotify-gray-700 text-white px-4 py-3 rounded-lg border border-spotify-gray-600 focus:border-spotify-green focus:outline-none"
                  >
                    <option value="tracks">Tracks</option>
                    <option value="artists">Artists</option>
                  </select>
                  <button
                    onClick={handleSearch}
                    disabled={isLoading || !searchQuery.trim()}
                    className="bg-spotify-green text-black px-6 py-3 rounded-lg font-medium hover:bg-green-400 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </div>
            </div>

            {/* Search Results */}
            {searchType === 'tracks' && searchResults.tracks.length > 0 && (
              <div className="bg-spotify-gray-800 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Music className="w-6 h-6 mr-2 text-spotify-green" />
                  Track Results
                </h2>
                <div className="grid gap-4">
                  {searchResults.tracks.map((track) => (
                    <div
                      key={track.id}
                      onClick={() => handleTrackSelect(track)}
                      className="flex items-center space-x-4 p-4 bg-spotify-gray-700 rounded-lg hover:bg-spotify-gray-600 cursor-pointer transition-colors group"
                    >
                      <img
                        src={track.album.images[0]?.url || '/placeholder-album.png'}
                        alt={track.album.name}
                        className="w-16 h-16 rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white group-hover:text-spotify-green">
                          {track.name}
                        </h3>
                        <p className="text-spotify-gray-300">
                          {track.artists.map(artist => artist.name).join(', ')}
                        </p>
                        <p className="text-sm text-spotify-gray-400">
                          {track.album.name} • {formatDuration(track.duration_ms)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-spotify-gray-400">
                          {track.popularity}% popular
                        </div>
                        <BarChart3 className="w-5 h-5 text-spotify-green" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchType === 'artists' && searchResults.artists.length > 0 && (
              <div className="bg-spotify-gray-800 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <User className="w-6 h-6 mr-2 text-spotify-green" />
                  Artist Results
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {searchResults.artists.map((artist) => (
                    <div
                      key={artist.id}
                      onClick={() => handleArtistSelect(artist)}
                      className="flex items-center space-x-4 p-4 bg-spotify-gray-700 rounded-lg hover:bg-spotify-gray-600 cursor-pointer transition-colors group"
                    >
                      <img
                        src={artist.images[0]?.url || '/placeholder-artist.png'}
                        alt={artist.name}
                        className="w-16 h-16 rounded-full"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white group-hover:text-spotify-green">
                          {artist.name}
                        </h3>
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
                      <BarChart3 className="w-5 h-5 text-spotify-green" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Track Analysis Tab */}
        {activeTab === 'track' && selectedTrack && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-spotify-gray-800 rounded-2xl p-8 mb-8">
              <div className="flex items-center space-x-6 mb-8">
                <img
                  src={selectedTrack.album.images[0]?.url || '/placeholder-album.png'}
                  alt={selectedTrack.album.name}
                  className="w-32 h-32 rounded-lg shadow-2xl"
                />
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {selectedTrack.name}
                  </h1>
                  <p className="text-xl text-spotify-gray-300 mb-2">
                    {selectedTrack.artists.map(artist => artist.name).join(', ')}
                  </p>
                  <p className="text-spotify-gray-400 mb-4">
                    {selectedTrack.album.name}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-spotify-gray-400">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDuration(selectedTrack.duration_ms)}
                    </span>
                    <span className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {selectedTrack.popularity}% popularity
                    </span>
                    {selectedTrack.preview_url && (
                      <a
                        href={selectedTrack.preview_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-spotify-green hover:text-green-400"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Preview
                      </a>
                    )}
                    <a
                      href={selectedTrack.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-spotify-green hover:text-green-400"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Open in Spotify
                    </a>
                  </div>
                </div>
              </div>

              {trackAnalysis && trackAnalysis.audioFeatures && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Audio Features</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(trackAnalysis.audioFeatures)
                      .filter(([key]) => !['duration_ms', 'key', 'mode', 'time_signature', 'loudness'].includes(key))
                      .map(([feature, value]) => (
                        <div key={feature} className="bg-spotify-gray-700 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium capitalize">
                              {feature.replace('_', ' ')}
                            </span>
                            <span className="text-spotify-green font-bold">
                              {Math.round((value as number) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-spotify-gray-600 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getAudioFeatureColor(value as number)}`}
                              style={{ width: `${(value as number) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Artist Analysis Tab */}
        {activeTab === 'artist' && selectedArtist && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-spotify-gray-800 rounded-2xl p-8">
              <div className="flex items-center space-x-6 mb-8">
                <img
                  src={selectedArtist.images[0]?.url || '/placeholder-artist.png'}
                  alt={selectedArtist.name}
                  className="w-32 h-32 rounded-full shadow-2xl"
                />
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {selectedArtist.name}
                  </h1>
                  <p className="text-xl text-spotify-gray-300 mb-4">
                    {selectedArtist.followers.total.toLocaleString()} followers
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedArtist.genres.map((genre) => (
                      <span
                        key={genre}
                        className="bg-spotify-green text-black px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-spotify-gray-400">
                    <span className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {selectedArtist.popularity}% popularity
                    </span>
                    <a
                      href={selectedArtist.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-spotify-green hover:text-green-400"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Open in Spotify
                    </a>
                  </div>
                </div>
              </div>

              {artistAnalysis && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Artist Analysis</h2>
                  {artistAnalysis.audioProfile && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(artistAnalysis.audioProfile).map(([feature, data]: [string, any]) => (
                        <div key={feature} className="bg-spotify-gray-700 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium capitalize">
                              {feature.replace('_', ' ')}
                            </span>
                            <span className="text-spotify-green font-bold">
                              {Math.round(data.average * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-spotify-gray-600 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getAudioFeatureColor(data.average)}`}
                              style={{ width: `${data.average * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-spotify-gray-400 mt-1">
                            Range: {Math.round(data.min * 100)}% - {Math.round(data.max * 100)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoPage;
