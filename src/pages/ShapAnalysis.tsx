
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Info } from 'lucide-react';
import axios from 'axios';

interface ShapFeature {
  feature: string;
  value: number;
  color: string;
}

const ShapAnalysis: React.FC = () => {
  const [shapData, setShapData] = useState<ShapFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define colors for features
  const colors = [
    '#ef4444', // red
    '#f59e0b', // amber
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#10b981', // green
    '#6366f1', // indigo
    '#f43f5e', // rose
  ];

  useEffect(() => {
    const fetchShapSummary = async () => {
      try {
        const response = await axios.get('https://sbilife-churnmodel.onrender.com/shap_summary');
        console.log('SHAP summary response:', response.data);
        const shapSummary = response.data.shap_summary;
        // Convert shap_summary object to an array, sort by value, and assign colors
        const features: ShapFeature[] = Object.entries(shapSummary)
          .map(([feature, value], index) => ({
            feature: feature.replace(/_/g, ' '),
            value: Number(value),
            color: colors[index % colors.length]
          }))
          .sort((a, b) => b.value - a.value);
        setShapData(features);
      } catch (err: any) {
        console.error('Error fetching SHAP summary:', err);
        setError(err.response?.data?.message || 'Failed to load SHAP data');
      } finally {
        setLoading(false);
      }
    };

    fetchShapSummary();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">SHAP Analysis Dashboard</h1>
      </div>
     
      <div className="glass-card p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-medium">SHAP Feature Importance Summary</h2>
          </div>
          <div className="flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 p-2 rounded-lg text-sm">
            <Info size={16} />
            <span>Higher values indicate stronger influence on churn prediction</span>
          </div>
        </div>
       
        <div className="h-96">
          {loading ? (
            <div className="flex items-center justify-center h-full text-neutral-500">Loading SHAP data...</div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-danger-500">Error: {error}</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={shapData}
                margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" />
                <YAxis dataKey="feature" type="category" scale="band" />
                <Tooltip
                  formatter={(value) => [`${Math.abs(value).toFixed(2)}%`, 'Contribution']}
                  labelFormatter={(label) => `Feature: ${label}`}
                />
                <Legend />
                <Bar
                  dataKey="value"
                  name="Feature Importance"
                  fill="#8884d8"
                  radius={[4, 4, 4, 4]}
                >
                  {shapData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-xl font-medium mb-4">Feature Analysis</h2>
        {loading ? (
          <div className="text-neutral-500">Loading feature analysis...</div>
        ) : error ? (
          <div className="text-danger-500">Error: {error}</div>
        ) : (
          <div className="space-y-6">
            {shapData.slice(0, 3).map((feature, index) => (
              <div key={index} className="border-b border-neutral-200 dark:border-neutral-700 pb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{feature.feature}</h3>
                  <span className="text-sm font-medium text-primary-500">
                    {feature.value.toFixed(2)}%
                  </span>
                </div>
               
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3">
                  This feature significantly influences churn prediction, contributing to the model's decision-making process.
                </p>
               
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full bg-primary-500"
                    style={{ width: `${Math.min(feature.value, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ShapAnalysis;