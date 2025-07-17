import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Genre {
  name: string;
  percentage: number;
}

interface GenreChartProps {
  data: Genre[];
}

const COLORS = ['#1DB954', '#1ED760', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

const GenreChart: React.FC<GenreChartProps> = ({ data }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-white mb-4">Genre Distribution</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="percentage"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GenreChart;
