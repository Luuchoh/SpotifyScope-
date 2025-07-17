import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Track {
  name: string;
  artist: string;
  plays: number;
}

interface TopTracksChartProps {
  data: Track[];
}

const TopTracksChart: React.FC<TopTracksChartProps> = ({ data }) => {
  const chartData = data.map(track => ({
    name: `${track.name} - ${track.artist}`,
    plays: track.plays,
  }));

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-white mb-4">Top Tracks</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF"
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px'
            }}
          />
          <Bar dataKey="plays" fill="#1DB954" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopTracksChart;
