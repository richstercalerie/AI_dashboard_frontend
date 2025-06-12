import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const CustomerActivityChart: React.FC = () => {
  const data = [
    { name: 'Jan', logins: 650, policyViews: 400, supportRequests: 240 },
    { name: 'Feb', logins: 730, policyViews: 430, supportRequests: 220 },
    { name: 'Mar', logins: 810, policyViews: 470, supportRequests: 250 },
    { name: 'Apr', logins: 720, policyViews: 420, supportRequests: 230 },
    { name: 'May', logins: 880, policyViews: 510, supportRequests: 270 },
    { name: 'Jun', logins: 950, policyViews: 580, supportRequests: 310 },
    { name: 'Jul', logins: 1020, policyViews: 610, supportRequests: 290 },
  ];

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="logins" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            activeDot={{ r: 8 }} 
          />
          <Line 
            type="monotone" 
            dataKey="policyViews" 
            stroke="#3b82f6" 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="supportRequests" 
            stroke="#ec4899" 
            strokeWidth={2} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerActivityChart;