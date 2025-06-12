import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  IndianRupee
} from 'lucide-react';
import axios from 'axios';
import StatCard from '../components/dashboard/StatCard';
import ChurnRiskChart from '../components/dashboard/ChurnRiskChart';
import CustomerActivityChart from '../components/dashboard/CustomerActivityChart';
import RecentActivityList from '../components/dashboard/RecentActivityList';

interface ShapFeature {
  name: string;
  value: number;
}

interface Customer {
  _id: string;
  id: string;
  name: string;
  email: string;
  Age: number;
  phone: string;
  Vehicle_Damage: boolean;
  Previously_Insured: boolean;
  Gender: boolean;
  Annual_Premium: number;
  Policy_Sales_Channel: number;
  Vintage: number;
  policyNumber: string;
  policyType: string;
  status: string;
  churnRisk: string;
  churnProbability: number;
  prediction: string;
  Region_Code: number;
  customerSince: string;
  adminId: string;
}

const Dashboard: React.FC = () => {
  const [shapFeatures, setShapFeatures] = useState<ShapFeature[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemAnimation = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', damping: 15, stiffness: 100 }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch SHAP summary
        const token=localStorage.getItem('token');
        const shapResponse = await axios.get('https://sbilife-churnmodel.onrender.com/shap_summary');
        console.log('SHAP summary response:', shapResponse.data);
        const shapSummary = shapResponse.data.shap_summary;
        const features: ShapFeature[] = Object.entries(shapSummary)
          .map(([name, value]) => ({ name, value: Number(value) }))
          .sort((a, b) => b.value - a.value);
        setShapFeatures(features);

        // Fetch customers
        const customersResponse = await axios.get('https://ai-personalised-dashboard.vercel.app/api/admin/customers', {
          headers: {
            'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
        });
        console.log('Customers response:', customersResponse.data);
        const normalizedCustomers = customersResponse.data.map((customer: any) => {
          const churnProbability = parseFloat(customer.churnProbability?.$numberDecimal || '0');
          const churnRisk = isNaN(churnProbability) ? 'unknown' : 
                            churnProbability > 50 ? 'high' : 
                            churnProbability > 30 ? 'medium' : 'low';
          return {
            _id: customer._id,
            id: customer.id,
            name: customer.name,
            email: customer.email,
            Age: customer.Age,
            phone: customer.phone,
            Vehicle_Damage: customer.Vehicle_Damage,
            Previously_Insured: customer.Previously_Insured,
            Gender: customer.Gender,
            Annual_Premium: customer.Annual_Premium,
            Policy_Sales_Channel: customer.Policy_Sales_Channel,
            Vintage: customer.Vintage,
            policyNumber: customer.policyNumber,
            policyType: customer.policyType,
            status: customer.status.toLowerCase(),
            churnRisk,
            churnProbability,
            prediction: customer.prediction,
            Region_Code: customer.Region_Code,
            customerSince: customer.customerSince,
            adminId: customer.adminId
          };
        });
        setCustomers(normalizedCustomers);
        setError(null);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate dashboard metrics
  const riskCounts = customers.reduce(
    (acc, customer) => {
      if (customer.churnRisk === 'high') acc.highRisk++;
      else if (customer.churnRisk === 'medium') acc.mediumRisk++;
      else if (customer.churnRisk === 'low') acc.lowRisk++;
      else acc.unknownRisk++;
      return acc;
    },
    { highRisk: 0, mediumRisk: 0, lowRisk: 0, unknownRisk: 0 }
  );

  const totalCustomers = customers.length;
  const retentionRate = totalCustomers > 0 
    ? ((customers.filter(customer => customer.status === 'active').length / totalCustomers) * 100).toFixed(1)
    : '0.0';
  const avgPolicyValue = totalCustomers > 0
    ? (customers.reduce((sum, customer) => sum + customer.Annual_Premium, 0) / totalCustomers).toFixed(0)
    : '0';

  return (
    <motion.div
      variants={containerAnimation}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <motion.h1 variants={itemAnimation} className="text-2xl font-semibold text-white">
          Admin Dashboard
        </motion.h1>
        <motion.div variants={itemAnimation}>
          <select className="glass-card text-sm py-2 px-3 rounded-lg border-none focus:ring-2 focus:ring-primary-500">
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </motion.div>
      </div>
      
      <motion.div 
        variants={itemAnimation}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard 
          title="Total Customers" 
          value={totalCustomers.toLocaleString()} 
          icon={<Users className="text-primary-500" />} 
        />
        <StatCard 
          title="High Risk Customers" 
          value={riskCounts.highRisk.toLocaleString()} 
          icon={<AlertTriangle className="text-danger-500" />} 
        />
        <StatCard 
          title="Retention Rate" 
          value={`${retentionRate}%`} 
          icon={<TrendingUp className="text-success-500" />} 
        />
        <StatCard 
          title="Avg. Policy Value" 
          value={`₹${parseInt(avgPolicyValue).toLocaleString()}`} 
          icon={<IndianRupee className="text-accent-500" />} 
        />
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemAnimation} className="glass-card p-6 lg:col-span-2">
          <h2 className="text-xl font-medium mb-4">Customer Churn Risk Distribution</h2>
          {loading ? (
            <div className="text-center text-neutral-500">Loading churn risk data...</div>
          ) : error ? (
            <div className="text-center text-danger-500">Error: {error}</div>
          ) : (
            <ChurnRiskChart
              highRisk={riskCounts.highRisk}
              mediumRisk={riskCounts.mediumRisk}
              lowRisk={riskCounts.lowRisk}
              unknownRisk={riskCounts.unknownRisk}
            />
          )}
        </motion.div>
        
        <motion.div variants={itemAnimation} className="glass-card p-6">
          <h2 className="text-xl font-medium mb-4">Recent Activity</h2>
          <RecentActivityList />
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemAnimation} className="glass-card p-6 lg:col-span-2">
          <h2 className="text-xl font-medium mb-4">Customer Activity</h2>
          <CustomerActivityChart />
        </motion.div>
        
        <motion.div variants={itemAnimation} className="glass-card p-8">
          <h2 className="text-xl font-medium mb-4">Top SHAP Features</h2>
          {loading ? (
            <div className="text-center text-neutral-500">Loading SHAP features...</div>
          ) : error ? (
            <div className="text-center text-danger-500">Error: {error}</div>
          ) : (
            <div className="space-y-3 mt-4">
              {shapFeatures.map((feature, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{feature.name.replace(/_/g, ' ')}</span>
                  <span className="text-sm font-medium">{feature.value.toFixed(1)}%</span>
                  <div className="w-32 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                    <div 
                      className="bg-primary-500 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(feature.value, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;