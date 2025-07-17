import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import { useAppSelector } from '../hooks/redux';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome back, {user?.displayName}!
          </h1>
          <p className="text-xl text-gray-300">
            Your personal music analytics dashboard
          </p>
        </div>

        <div className="grid gap-8">
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Dashboard Coming Soon
            </h2>
            <p className="text-gray-300">
              Your personalized music analytics will be displayed here once the backend integration is complete.
            </p>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Dashboard;
