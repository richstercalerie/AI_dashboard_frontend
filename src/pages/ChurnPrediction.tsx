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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axios from 'axios';
import { AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';

interface Customer {
  _id: string;
  id: string;
  name: string;
  email: string;
  policyType: string;
  region?: string;
  Region_Code?: number;
  churnProbability: number;
  churnRisk: string;
  prediction?: string;
  Age?: number;
}

const ChurnPrediction: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Region mapping (assumed from Region_Code)
  const regionMap: Record<number, string> = {
    28: 'North',
    8: 'South',
    46: 'East',
    30: 'West',
    3: 'Central',
  };

  // Age group helper
  const getAgeGroup = (age?: number): string => {
    if (!age || isNaN(age)) return 'Unknown';
    if (age < 30) return '<30';
    if (age <= 40) return '30-40';
    if (age <= 50) return '40-50';
    if (age <= 60) return '50-60';
    return '60+';
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const jsontoken = localStorage.getItem('token');
      let token = '';
      if (jsontoken !== null) {
        token = JSON.parse(jsontoken);
      }
        const response = await axios.get('https://ai-personalised-dashboard.vercel.app/api/admin/customers', {
          withCredentials:true,
          headers: {
          'Content-Type': 'application/json',  
      Authorization: `Bearer ${token}`,
    },
        });
        console.log('Customers response:', response.data);
        const normalizedCustomers = response.data.map((customer: any) => {
          const churnProbability = parseFloat(customer.churnProbability?.$numberDecimal || '0');
          const churnRisk = isNaN(churnProbability) ? 'unknown' : 
                            churnProbability > 50 ? 'high' : 
                            churnProbability > 30 ? 'medium' : 'low';
          return {
            _id: customer._id,
            id: customer.id,
            name: customer.name || 'Unknown',
            email: customer.email || '',
            policyType: customer.policyType || 'Unknown',
            region: customer.Region_Code ? regionMap[customer.Region_Code] || 'Unknown' : 'Unknown',
            Region_Code: customer.Region_Code,
            churnProbability: churnProbability,
            churnRisk,
            prediction: customer.prediction || 'N/A',
            Age: customer.Age ? Number(customer.Age) : undefined,
          };
        });
        setCustomers(normalizedCustomers);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching customers:', err);
        setError(err.response?.data?.message || 'Failed to load customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
    const intervalId = setInterval(fetchCustomers, 1000000); // Poll every 10 minutes
    return () => clearInterval(intervalId);
  }, []);

  // Count customers by churn risk
  const churnRiskCounts = customers.reduce(
    (acc, customer) => {
      if (customer.churnRisk === 'high') acc.high++;
      else if (customer.churnRisk === 'medium') acc.medium++;
      else if (customer.churnRisk === 'low') acc.low++;
      // else acc.unknown++;
      return acc;
    },
    { high: 0, medium: 0, low: 0, unknown: 0 }
  );

  // Data for pie chart
  const pieData = [
    { name: 'High Risk', value: churnRiskCounts.high, color: '#ef4444' },
    { name: 'Medium Risk', value: churnRiskCounts.medium, color: '#f59e0b' },
    { name: 'Low Risk', value: churnRiskCounts.low, color: '#10b981' },
    // ...(churnRiskCounts.unknown > 0 ? [{ name: 'Unknown Risk', value: churnRiskCounts.unknown, color: '#6b7280' }] : []),
  ];

  // Data for bar chart (churn by region)
  const regions = ['North', 'South', 'East', 'West', 'Central', 'Unknown'];
  const regionData = regions.map(region => ({
    region,
    high: customers.filter(c => c.region === region && c.churnRisk === 'high').length,
    medium: customers.filter(c => c.region === region && c.churnRisk === 'medium').length,
    low: customers.filter(c => c.region === region && c.churnRisk === 'low').length,
    // unknown: customers.filter(c => c.region === region && c.churnRisk === 'unknown').length,
  }));

  // Data for bar chart (churn by age group)
  const ageGroups = ['<30', '30-40', '40-50', '50-60', '60+', 'Unknown'];
  const ageData = ageGroups.map(group => ({
    group,
    high: customers.filter(c => getAgeGroup(c.Age) === group && c.churnRisk === 'high').length,
    medium: customers.filter(c => getAgeGroup(c.Age) === group && c.churnRisk === 'medium').length,
    low: customers.filter(c => getAgeGroup(c.Age) === group && c.churnRisk === 'low').length,
    // unknown: customers.filter(c => getAgeGroup(c.Age) === group && c.churnRisk === 'unknown').length,
  }));

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-neutral-500">Loading churn prediction data...</div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-danger-500">Error: {error}</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">Churn Prediction Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 flex flex-col items-center justify-center">
          <div className="p-3 rounded-full bg-danger-100 dark:bg-danger-900/30 mb-3">
            <AlertTriangle size={24} className="text-danger-500" />
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">High Risk Customers</p>
          <h3 className="text-3xl font-semibold mt-1">{churnRiskCounts.high}</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            {customers.length > 0 ? Math.round((churnRiskCounts.high / customers.length) * 100) : 0}% of total
          </p>
        </div>
        
        <div className="glass-card p-6 flex flex-col items-center justify-center">
          <div className="p-3 rounded-full bg-warning-100 dark:bg-warning-900/30 mb-3">
            <HelpCircle size={24} className="text-warning-500" />
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Medium Risk Customers</p>
          <h3 className="text-3xl font-semibold mt-1">{churnRiskCounts.medium}</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            {customers.length > 0 ? Math.round((churnRiskCounts.medium / customers.length) * 100) : 0}% of total
          </p>
        </div>
        
        <div className="glass-card p-6 flex flex-col items-center justify-center">
          <div className="p-3 rounded-full bg-success-100 dark:bg-success-900/30 mb-3">
            <CheckCircle2 size={24} className="text-success-500" />
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Low Risk Customers</p>
          <h3 className="text-3xl font-semibold mt-1">{churnRiskCounts.low}</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            {customers.length > 0 ? Math.round((churnRiskCounts.low / customers.length) * 100) : 0}% of total
          </p>
        </div>

        {churnRiskCounts.unknown > 0 && (
          <div className="glass-card p-6 flex flex-col items-center justify-center">
            <div className="p-3 rounded-full bg-neutral-100 dark:bg-neutral-900/30 mb-3">
              <HelpCircle size={24} className="text-neutral-500" />
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Unknown Risk Customers</p>
            <h3 className="text-3xl font-semibold mt-1">{churnRiskCounts.unknown}</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
              {customers.length > 0 ? Math.round((churnRiskCounts.unknown / customers.length) * 100) : 0}% of total
            </p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-medium mb-4">Customer Churn Risk Distribution</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} customers`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h2 className="text-xl font-medium mb-4">Churn Risk by Age Group</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ageData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="group" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="high" stackId="a" name="High Risk" fill="#ef4444" />
                <Bar dataKey="medium" stackId="a" name="Medium Risk" fill="#f59e0b" />
                <Bar dataKey="low" stackId="a" name="Low Risk" fill="#10b981" />
                <Bar dataKey="unknown" stackId="a" name="Unknown Risk" fill="#6b7280" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-xl font-medium mb-4">Recent Churn Predictions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700">
                <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Customer</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Policy Type</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Churn Probability</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Prediction</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {customers.slice(0, 5).map((customer) => (
                <tr 
                  key={customer._id} 
                  className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-300">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{customer.policyType}</td>
                  <td className="py-3 px-4 text-sm">{customer.churnProbability.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-sm">{customer.prediction}</td>
                  <td className="py-3 px-4">
                    <span className={`status-badge ${
                      customer.churnRisk === 'high' 
                        ? 'high-risk' 
                        : customer.churnRisk === 'medium' 
                          ? 'medium-risk' 
                          : customer.churnRisk === 'low'
                            ? 'low-risk'
                            : 'unknown-risk'
                    }`}>
                      {customer.churnRisk.charAt(0).toUpperCase() + customer.churnRisk.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default ChurnPrediction;