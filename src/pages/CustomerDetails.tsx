import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  CalendarClock,
  Edit,
  Trash,
  Mail as MailIcon,
  BarChart3,
  Clock,
  Shield,
  Car,
  User
} from 'lucide-react';
import axios from 'axios';

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

const CustomerDetails: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const [activeTab, setActiveTab] = useState('profile');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featureImportance, setFeatureImportance] = useState({
    Previously_Insured: 0,
    Vehicle_Damage: 0,
    Age: 0,
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const token=localStorage.getItem('token');
        const response = await axios.get(`https://ai-personalised-dashboard.vercel.app/api/admin/customers/${customerId}`, {
          withCredentials:true,
          headers: {
            'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
        });
        console.log('Customer response:', response.data);
        const customerData = response.data;
        const churnProbability = parseFloat(customerData.churnProbability.$numberDecimal);
        const newCustomer: Customer = {
          _id: customerData._id,
          id: customerData.id,
          name: customerData.name,
          email: customerData.email,
          Age: customerData.Age,
          phone: customerData.phone,
          Vehicle_Damage: customerData.Vehicle_Damage,
          Previously_Insured: customerData.Previously_Insured,
          Gender: customerData.Gender,
          Annual_Premium: customerData.Annual_Premium,
          Policy_Sales_Channel: customerData.Policy_Sales_Channel,
          Vintage: customerData.Vintage,
          policyNumber: customerData.policyNumber,
          policyType: customerData.policyType,
          status: customerData.status.toLowerCase(),
          churnRisk: churnProbability > 50 ? 'high' : churnProbability > 30 ? 'medium' : 'low',
          churnProbability,
          prediction: customerData.prediction,
          Region_Code: customerData.Region_Code,
          customerSince: customerData.customerSince,
          adminId: customerData.adminId
        };
        setCustomer(newCustomer);

        // Calculate feature importance dynamically
        const baseWeights = {
          Previously_Insured: newCustomer.Previously_Insured ? 20 : 40,
          Vehicle_Damage: newCustomer.Vehicle_Damage ? 35 : 15,
          Age: newCustomer.Age > 50 ? 30 : newCustomer.Age > 30 ? 20 : 10,
        };
        const totalBaseWeight = baseWeights.Previously_Insured + baseWeights.Vehicle_Damage + baseWeights.Age;
        const scaleFactor = newCustomer.churnProbability / totalBaseWeight;
        setFeatureImportance({
          Previously_Insured: Math.min(baseWeights.Previously_Insured * scaleFactor, 100),
          Vehicle_Damage: Math.min(baseWeights.Vehicle_Damage * scaleFactor, 100),
          Age: Math.min(baseWeights.Age * scaleFactor, 100),
        });

        setError(null);
      } catch (err: any) {
        console.error('Error fetching customer:', err);
        setError(err.response?.data?.message || 'Failed to load customer data');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
    const intervalId = setInterval(fetchCustomer, 1000000);
    return () => clearInterval(intervalId);
  }, [customerId]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="glass-card p-12 text-center">
          <h2 className="text-xl font-medium mb-4">Loading Customer Data</h2>
          <p className="text-neutral-600 dark:text-neutral-300">Please wait...</p>
        </div>
      </motion.div>
    );
  }

  if (error || !customer) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="glass-card p-12 text-center">
          <h2 className="text-xl font-medium mb-4">Customer Not Found</h2>
          <p className="text-neutral-600 dark:text-neutral-300 mb-6">
            {error || "The customer you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            to="/crm"
            className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to CRM
          </Link>
        </div>
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
        <div className="flex items-center gap-3">
          <Link to="/crm" className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-semibold text-white">Customer Details</h1>
        </div>
        <div className="flex gap-3">
          <button className="glass-card px-4 py-2 flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
            <Edit size={16} />
            Edit
          </button>
          <button className="glass-card px-4 py-2 flex items-center gap-2 text-sm font-medium bg-danger-500 text-white rounded-lg hover:bg-danger-600 transition-colors">
            <Trash size={16} />
            Delete
          </button>
        </div>
      </div>
     
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-300 text-4xl font-semibold mb-4">
              {customer.name.charAt(0)}
            </div>
            <h2 className="text-xl font-semibold">{customer.name}</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{customer.policyNumber}</p>
           
            <div className="mt-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                customer.status === 'active'
                  ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300'
                  : 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300'
              }`}>
                {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
              </span>
              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                customer.churnRisk === 'high'
                  ? 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-300'
                  : customer.churnRisk === 'medium'
                    ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300'
                    : 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300'
              }`}>
                {customer.churnRisk.charAt(0).toUpperCase() + customer.churnRisk.slice(1)} Risk
              </span>
            </div>
          </div>
         
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-800/50 text-primary-600 dark:text-primary-300">
                <Mail size={16} />
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{customer.email}</p>
              </div>
            </div>
           
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-800/50 text-primary-600 dark:text-primary-300">
                <Phone size={16} />
              </div>
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">+91 {customer.phone}</p>
              </div>
            </div>
           
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-800/50 text-primary-600 dark:text-primary-300">
                <MapPin size={16} />
              </div>
              <div>
                <p className="text-sm font-medium">Region</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Region Code: {customer.Region_Code}</p>
              </div>
            </div>
           
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-800/50 text-primary-600 dark:text-primary-300">
                <CalendarClock size={16} />
              </div>
              <div>
                <p className="text-sm font-medium">Customer Since</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{customer.customerSince}</p>
              </div>
            </div>
          </div>
         
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 flex items-center justify-between rounded-lg bg-white/50 dark:bg-neutral-800/50 hover:bg-white dark:hover:bg-neutral-700 text-sm">
                <span>Check Churn Analysis</span>
                <BarChart3 size={16} />
              </button>
              <button className="w-full px-4 py-2 flex items-center justify-between rounded-lg bg-white/50 dark:bg-neutral-800/50 hover:bg-white dark:hover:bg-neutral-700 text-sm">
                <span>Contact Customer</span>
                <MailIcon size={16} />
              </button>
            </div>
          </div>
        </div>
       
        <div className="glass-card p-6 lg:col-span-3">
          <div className="border-b border-neutral-200 dark:border-neutral-700 pb-3 mb-6">
            <div className="flex space-x-6">
              <button
                className={`pb-3 text-sm font-medium border-b-2 ${
                  activeTab === 'profile'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button
                className={`pb-3 text-sm font-medium border-b-2 ${
                  activeTab === 'risk'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
                onClick={() => setActiveTab('risk')}
              >
                Churn Risk
              </button>
              <button
                className={`pb-3 text-sm font-medium border-b-2 ${
                  activeTab === 'timeline'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
                onClick={() => setActiveTab('timeline')}
              >
                Activity Timeline
              </button>
            </div>
          </div>
         
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Customer Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white/50 dark:bg-neutral-800/50 rounded-lg">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Annual Premium</p>
                    <p className="text-2xl font-semibold mt-1">₹{customer.Annual_Premium.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-white/50 dark:bg-neutral-800/50 rounded-lg">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Policy Sales Channel</p>
                    <p className="text-2xl font-semibold mt-1">{customer.Policy_Sales_Channel}</p>
                  </div>
                  <div className="p-4 bg-white/50 dark:bg-neutral-800/50 rounded-lg">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Vintage (Days)</p>
                    <p className="text-2xl font-semibold mt-1">{customer.Vintage}</p>
                  </div>
                </div>
              </div>
             
              <div>
                <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Full Name</p>
                        <p className="font-medium">{customer.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Email Address</p>
                        <p className="font-medium">{customer.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Phone Number</p>
                        <p className="font-medium">+91 {customer.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Age</p>
                        <p className="font-medium">{customer.Age}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Gender</p>
                        <p className="font-medium">{customer.Gender ? 'Male' : 'Female'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Region Code</p>
                        <p className="font-medium">{customer.Region_Code}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Vehicle Damage</p>
                        <p className="font-medium">{customer.Vehicle_Damage ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Previously Insured</p>
                        <p className="font-medium">{customer.Previously_Insured ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
         
          {activeTab === 'risk' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium mb-4">Churn Risk Analysis</h3>
             
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/50 dark:bg-neutral-800/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Churn Probability</h4>
                    <span className={`text-xl font-semibold ${
                      customer.churnProbability > 50
                        ? 'text-danger-500'
                        : customer.churnProbability > 30
                          ? 'text-warning-500'
                          : 'text-success-500'
                    }`}>
                      {customer.churnProbability.toFixed(1)}%
                    </span>
                  </div>
                 
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5 mb-4">
                    <div
                      className={`h-2.5 rounded-full ${
                        customer.churnProbability > 50
                          ? 'bg-danger-500'
                          : customer.churnProbability > 30
                            ? 'bg-warning-500'
                            : 'bg-success-500'
                      }`}
                      style={{ width: `${customer.churnProbability}%` }}
                    ></div>
                  </div>
                 
                  <div className="flex justify-between items-center text-xs text-neutral-500 dark:text-neutral-400">
                    <span>Low Risk</span>
                    <span>Medium Risk</span>
                    <span>High Risk</span>
                  </div>
                 
                  <div className="mt-6 p-3 rounded-lg bg-neutral-100 dark:bg-neutral-700">
                    <p className="text-sm">
                      <span className="font-medium">Prediction: </span>
                      {customer.prediction}
                    </p>
                  </div>
                </div>
               
                <div className="bg-white/50 dark:bg-neutral-800/50 rounded-lg p-6">
                  <h4 className="font-medium mb-4">Factors Influencing Churn</h4>
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ staggerChildren: 0.2 }}
                  >
                    {/* Previously Insured */}
                    <motion.div
                      className="relative group"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Shield size={18} className="text-primary-600 dark:text-primary-300" />
                        <p className="text-sm font-medium">Previously Insured</p>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full bg-blue-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${featureImportance.Previously_Insured}%` }}
                          transition={{ duration: 1 }}
                        ></motion.div>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Contribution: {featureImportance.Previously_Insured.toFixed(1)}%
                      </p>
                      <div className="absolute z-10 hidden group-hover:block bg-neutral-800 dark:bg-neutral-900 text-white text-xs rounded-lg px-3 py-2 -top-10 left-0 w-48">
                        {customer.Previously_Insured
                          ? 'Previously insured customers are less likely to churn.'
                          : 'Lack of prior insurance increases churn risk.'}
                      </div>
                    </motion.div>

                    {/* Vehicle Damage */}
                    <motion.div
                      className="relative group"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Car size={18} className="text-primary-600 dark:text-primary-300" />
                        <p className="text-sm font-medium">Vehicle Damage</p>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full bg-pink-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${featureImportance.Vehicle_Damage}%` }}
                          transition={{ duration: 1 }}
                        ></motion.div>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Contribution: {featureImportance.Vehicle_Damage.toFixed(1)}%
                      </p>
                      <div className="absolute z-10 hidden group-hover:block bg-neutral-800 dark:bg-neutral-900 text-white text-xs rounded-lg px-3 py-2 -top-10 left-0 w-48">
                        {customer.Vehicle_Damage
                          ? 'Vehicle damage significantly increases churn probability.'
                          : 'No vehicle damage reduces churn risk.'}
                      </div>
                    </motion.div>

                    {/* Age */}
                    <motion.div
                      className="relative group"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <User size={18} className="text-primary-600 dark:text-primary-300" />
                        <p className="text-sm font-medium">Age</p>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full bg-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${featureImportance.Age}%` }}
                          transition={{ duration: 1 }}
                        ></motion.div>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Contribution: {featureImportance.Age.toFixed(1)}%
                      </p>
                      <div className="absolute z-10 hidden group-hover:block bg-neutral-800 dark:bg-neutral-900 text-white text-xs rounded-lg px-3 py-2 -top-10 left-0 w-48">
                        {customer.Age > 50
                          ? 'Older age (>50) increases churn risk.'
                          : customer.Age > 30
                            ? 'Middle age (30-50) has moderate risk.'
                            : 'Younger age (<30) reduces churn risk.'}
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          )}
         
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium mb-4">Activity Timeline</h3>
              <div className="space-y-4">
                <div className="relative pl-8 pb-6 border-l-2 border-neutral-200 dark:border-neutral-700">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary-500"></div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-800/50 text-primary-600 dark:text-primary-300">
                      <CalendarClock size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Policy Created</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Customer joined on {customer.customerSince}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative pl-8 pb-6 border-l-2 border-neutral-200 dark:border-neutral-700">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary-500"></div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-800/50 text-primary-600 dark:text-primary-300">
                      <Mail size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Welcome Email Sent</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Welcome email sent to {customer.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative pl-8 pb-6 border-l-2 border-neutral-200 dark:border-neutral-700">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary-500"></div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-800/50 text-primary-600 dark:text-primary-300">
                      <Clock size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Last Activity</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        No recent activities recorded
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerDetails;