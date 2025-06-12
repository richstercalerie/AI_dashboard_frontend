import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
import { Calendar, Clock, Filter, AlertTriangle, User } from 'lucide-react';
import { format } from 'date-fns';
import { customers } from '../data/mockData';

const BehaviorTracker: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  
  // Customer behavior data
  const behaviorData = {
    '30days': [
      { date: '2025-05-06', logins: 45, policyViews: 32, supportRequests: 8, claimActivity: 3 },
      { date: '2025-05-13', logins: 52, policyViews: 38, supportRequests: 6, claimActivity: 2 },
      { date: '2025-05-20', logins: 48, policyViews: 35, supportRequests: 9, claimActivity: 4 },
      { date: '2025-05-27', logins: 55, policyViews: 41, supportRequests: 7, claimActivity: 2 },
      { date: '2025-06-03', logins: 61, policyViews: 45, supportRequests: 5, claimActivity: 3 },
    ],
    '90days': [
      { date: '2025-03-06', logins: 125, policyViews: 92, supportRequests: 18, claimActivity: 7 },
      { date: '2025-03-27', logins: 132, policyViews: 98, supportRequests: 21, claimActivity: 9 },
      { date: '2025-04-17', logins: 141, policyViews: 105, supportRequests: 16, claimActivity: 5 },
      { date: '2025-05-08', logins: 150, policyViews: 112, supportRequests: 19, claimActivity: 8 },
      { date: '2025-05-29', logins: 158, policyViews: 118, supportRequests: 15, claimActivity: 6 },
    ],
    '180days': [
      { date: '2024-12-06', logins: 265, policyViews: 198, supportRequests: 42, claimActivity: 15 },
      { date: '2025-01-06', logins: 282, policyViews: 211, supportRequests: 39, claimActivity: 13 },
      { date: '2025-02-06', logins: 301, policyViews: 225, supportRequests: 45, claimActivity: 17 },
      { date: '2025-03-06', logins: 315, policyViews: 238, supportRequests: 41, claimActivity: 14 },
      { date: '2025-04-06', logins: 330, policyViews: 249, supportRequests: 37, claimActivity: 12 },
      { date: '2025-05-06', logins: 348, policyViews: 262, supportRequests: 43, claimActivity: 16 },
    ],
  };
  
  // Mock activity log data
  const activityLog = [
    {
      id: 1,
      customerId: customers[0].id,
      customerName: customers[0].name,
      type: 'login',
      description: 'Logged in from new device (iOS)',
      timestamp: new Date(2025, 5, 6, 9, 32),
      isSuspicious: true,
    },
    {
      id: 2,
      customerId: customers[0].id,
      customerName: customers[0].name,
      type: 'policy',
      description: 'Viewed policy details',
      timestamp: new Date(2025, 5, 6, 9, 35),
      isSuspicious: false,
    },
    {
      id: 3,
      customerId: customers[1].id,
      customerName: customers[1].name,
      type: 'support',
      description: 'Contacted support about claim status',
      timestamp: new Date(2025, 5, 6, 10, 15),
      isSuspicious: false,
    },
    {
      id: 4,
      customerId: customers[2].id,
      customerName: customers[2].name,
      type: 'policy',
      description: 'Updated beneficiary information',
      timestamp: new Date(2025, 5, 6, 11, 42),
      isSuspicious: false,
    },
    {
      id: 5,
      customerId: customers[0].id,
      customerName: customers[0].name,
      type: 'claim',
      description: 'Started new claim submission',
      timestamp: new Date(2025, 5, 6, 13, 27),
      isSuspicious: false,
    },
    {
      id: 6,
      customerId: customers[3].id,
      customerName: customers[3].name,
      type: 'payment',
      description: 'Made premium payment',
      timestamp: new Date(2025, 5, 6, 14, 55),
      isSuspicious: false,
    },
    {
      id: 7,
      customerId: customers[2].id,
      customerName: customers[2].name,
      type: 'login',
      description: 'Multiple failed login attempts',
      timestamp: new Date(2025, 5, 6, 16, 18),
      isSuspicious: true,
    },
  ];
  
  const filteredActivities = selectedCustomer 
    ? activityLog.filter(activity => activity.customerId === selectedCustomer) 
    : activityLog;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">Customer Behavior Tracker</h1>
        <div className="flex gap-3">
          <select 
            className="glass-card text-sm py-2 px-3 rounded-lg border-none focus:ring-2 focus:ring-primary-500"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            <option value="">All Customers</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>
          
          <select 
            className="glass-card text-sm py-2 px-3 rounded-lg border-none focus:ring-2 focus:ring-primary-500"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="180days">Last 180 Days</option>
          </select>
        </div>
      </div>
      
      <div className="glass-card p-6">
        <h2 className="text-xl font-medium mb-4">Customer Activity Trends</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={behaviorData[selectedPeriod]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="logins" 
                name="Logins" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="policyViews" 
                name="Policy Views" 
                stroke="#3b82f6" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="supportRequests" 
                name="Support Requests" 
                stroke="#ec4899" 
                strokeWidth={2} 
              />
              <Line 
                type="monotone" 
                dataKey="claimActivity" 
                name="Claim Activity" 
                stroke="#f59e0b" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Activity Log</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-white/50 dark:bg-neutral-700/50 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors">
                <Filter size={16} />
              </button>
              <button className="p-2 rounded-lg bg-white/50 dark:bg-neutral-700/50 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors">
                <Calendar size={16} />
              </button>
            </div>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {filteredActivities.map((activity) => (
              <div 
                key={activity.id} 
                className={`p-4 rounded-lg border ${
                  activity.isSuspicious
                    ? 'border-danger-200 dark:border-danger-800 bg-danger-50 dark:bg-danger-900/20'
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${
                    activity.isSuspicious
                      ? 'bg-danger-100 dark:bg-danger-900/30 text-danger-500'
                      : 'bg-primary-100 dark:bg-primary-900/30 text-primary-500'
                  }`}>
                    {activity.isSuspicious ? <AlertTriangle size={18} /> : <User size={18} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{activity.customerName}</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-300">{activity.description}</p>
                      </div>
                      <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                        <Clock size={14} className="mr-1" />
                        <span>{format(activity.timestamp, 'h:mm a')}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activity.type === 'login' 
                          ? 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300' 
                          : activity.type === 'policy'
                            ? 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300'
                            : activity.type === 'support'
                              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                              : activity.type === 'claim'
                                ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300'
                                : 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300'
                      }`}>
                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {format(activity.timestamp, 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
                
                {activity.isSuspicious && (
                  <div className="mt-3 ml-10 pl-4 border-l-2 border-danger-300 dark:border-danger-700">
                    <p className="text-sm text-danger-600 dark:text-danger-400">
                      Suspicious activity detected. Consider reviewing account security.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h2 className="text-xl font-medium mb-4">Key Metrics</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium">Login Frequency</p>
                <span className="text-sm font-medium">+12% vs prev period</span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                <div className="bg-secondary-500 h-2.5 rounded-full" style={{ width: '78%' }}></div>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Average: 3.2 logins per customer per week
              </p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium">Policy View Time</p>
                <span className="text-sm font-medium">+5% vs prev period</span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                <div className="bg-accent-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Average: 4.8 minutes per session
              </p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium">Support Requests</p>
                <span className="text-sm font-medium text-success-500">-8% vs prev period</span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: '42%' }}></div>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Average: 0.8 requests per customer per month
              </p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium">Claim Activity</p>
                <span className="text-sm font-medium">+3% vs prev period</span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                <div className="bg-warning-500 h-2.5 rounded-full" style={{ width: '35%' }}></div>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Average: 0.3 claim actions per customer per month
              </p>
            </div>
          </div>
          
          <div className="mt-6 bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Behavioral Insights</h3>
            <ul className="text-sm text-neutral-600 dark:text-neutral-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-success-500">•</span>
                <span>Customers with weekly logins are 68% less likely to churn</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-danger-500">•</span>
                <span>24% increase in login attempts from new devices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success-500">•</span>
                <span>Policy reviews spike after quarterly statements</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BehaviorTracker;