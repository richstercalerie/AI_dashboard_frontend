import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  // change: string;
  // trend: 'up' | 'down';
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <motion.div 
      className="glass-card p-6"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          {/* <div className="flex items-center mt-2">
            {trend === 'up' ? (
              <TrendingUp size={16} className="text-success-500 mr-1" />
            ) : (
              <TrendingDown size={16} className="text-danger-500 mr-1" />
            )}
            <span className={trend === 'up' ? 'text-success-500 text-sm' : 'text-danger-500 text-sm'}>
              {change}
            </span>
          </div> */}
        </div>
        <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/30">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;