import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  FileText,
  MoreHorizontal,
  Edit,
  Trash,
  Download,
  Eye,
  X
} from 'lucide-react';
import axios from 'axios';

interface Customer {
  _id: string;
  id: string;
  name: string;
  email: string;
  policyNumber: string;
  policyType: string;
  status: string;
  churnRisk: string;
}

const CrmModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    policyNumber: '',
    policyType: '',
    customerSince: '',
    Age: '',
    Gender: '1',
    Region_Code: '',
    Previously_Insured: '0',
    Vehicle_Damage: '0',
    Annual_Premium: '',
    Policy_Sales_Channel: '',
    Vintage: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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
      console.log('Customers response:', response.data); // Debug raw API data
      const normalizedCustomers = response.data.map((customer: any) => {
        const churnProbability = parseFloat(customer.churnProbability?.$numberDecimal || '0');
        const churnRisk = isNaN(churnProbability) ? 'unknown' : 
                          churnProbability > 50 ? 'high' : 
                          churnProbability > 30 ? 'medium' : 'low';
        return {
          _id: customer._id || '',
          id: customer.id || '',
          name: customer.name || 'Unknown',
          email: customer.email || '',
          policyNumber: customer.policyNumber || '',
          policyType: customer.policyType || '',
          status: customer.status ? customer.status.toLowerCase() : 'unknown',
          churnRisk
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

  useEffect(() => {
    fetchCustomers();
    const intervalId = setInterval(fetchCustomers, 1000000); // Poll every 10 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.id) errors.id = 'ID is required';
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';
    if (!formData.phone) errors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone)) errors.phone = 'Phone must be 10 digits';
    if (!formData.policyNumber) errors.policyNumber = 'Policy Number is required';
    if (!formData.policyType) errors.policyType = 'Policy Type is required';
    if (!formData.customerSince) errors.customerSince = 'Customer Since is required';
    if (!formData.Age) errors.Age = 'Age is required';
    else if (isNaN(Number(formData.Age)) || Number(formData.Age) < 18) errors.Age = 'Age must be a number >= 18';
    if (!formData.Region_Code) errors.Region_Code = 'Region Code is required';
    else if (isNaN(Number(formData.Region_Code))) errors.Region_Code = 'Region Code must be a number';
    if (!formData.Annual_Premium) errors.Annual_Premium = 'Annual Premium is required';
    else if (isNaN(Number(formData.Annual_Premium))) errors.Annual_Premium = 'Annual Premium must be a number';
    if (!formData.Policy_Sales_Channel) errors.Policy_Sales_Channel = 'Policy Sales Channel is required';
    else if (isNaN(Number(formData.Policy_Sales_Channel))) errors.Policy_Sales_Channel = 'Policy Sales Channel must be a number';
    if (!formData.Vintage) errors.Vintage = 'Vintage is required';
    else if (isNaN(Number(formData.Vintage))) errors.Vintage = 'Vintage must be a number';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const jsontoken = localStorage.getItem('token');
      let token = '';
      if (jsontoken !== null) {
        token = JSON.parse(jsontoken);
      }
      await axios.post('https://ai-personalised-dashboard.vercel.app/api/customer', {
        id: formData.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        policyNumber: formData.policyNumber,
        policyType: formData.policyType,
        customerSince: formData.customerSince,
        Age: Number(formData.Age),
        Gender: Number(formData.Gender),
        Region_Code: Number(formData.Region_Code),
        Previously_Insured: Number(formData.Previously_Insured),
        Vehicle_Damage: Number(formData.Vehicle_Damage),
        Annual_Premium: Number(formData.Annual_Premium),
        Policy_Sales_Channel: Number(formData.Policy_Sales_Channel),
        Vintage: Number(formData.Vintage)
      }, {
        withCredentials:true,
        headers: {
          'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
      });
      setIsModalOpen(false);
      setFormData({
        id: '',
        name: '',
        email: '',
        phone: '',
        policyNumber: '',
        policyType: '',
        customerSince: '',
        Age: '',
        Gender: '1',
        Region_Code: '',
        Previously_Insured: '0',
        Vehicle_Damage: '0',
        Annual_Premium: '',
        Policy_Sales_Channel: '',
        Vintage: ''
      });
      await fetchCustomers(); // Refresh customer list
    } catch (err: any) {
      console.error('Error adding customer:', err);
      setFormErrors({ submit: err.response?.data?.message || 'Failed to add customer' });
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.policyNumber.toLowerCase().includes(searchTerm.toLowerCase());
   
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'high-risk') return matchesSearch && customer.churnRisk === 'high';
    if (selectedFilter === 'medium-risk') return matchesSearch && customer.churnRisk === 'medium';
    if (selectedFilter === 'low-risk') return matchesSearch && customer.churnRisk === 'low';
    if (selectedFilter === 'active') return matchesSearch && customer.status === 'active';
    if (selectedFilter === 'pending') return matchesSearch && customer.status === 'pending';
    return matchesSearch;
  });

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-neutral-500">Loading customers...</div>
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
        <h1 className="text-2xl font-semibold text-white">Customer Relationship Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="glass-card px-4 py-2 flex items-center gap-2 text-sm font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus size={16} />
          Add Customer
        </button>
      </div>

      {/* Modal for Add Customer */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Add New Customer</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-200">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {formErrors.submit && (
                <div className="text-danger-500 text-sm">{formErrors.submit}</div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-200">ID</label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleFormChange}
                    className="mt-1 w-full p-2 rounded-lg bg-white/50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600"
                  />
                  {formErrors.id && <p className="text-danger-500 text-xs mt-1">{formErrors.id}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-200">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="mt-1 w-full p-2 rounded-lg bg-white/50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600"
                  />
                  {formErrors.name && <p className="text-danger-500 text-xs mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-200">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="mt-1 w-full p-2 rounded-lg bg-white/50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600"
                  />
                  {formErrors.email && <p className="text-danger-500 text-xs mt-1">{formErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-200">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="mt-1 w-full p-2 rounded-lg bg-white/50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600"
                  />
                  {formErrors.phone && <p className="text-danger-500 text-xs mt-1">{formErrors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-200">Policy Number</label>
                  <input
                    type="text"
                    name="policyNumber"
                    value={formData.policyNumber}
                    onChange={handleFormChange}
                    className="mt-1 w-full p-2 rounded-lg bg-white/50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600"
                  />
                  {formErrors.policyNumber && <p className="text-danger-500 text-xs mt-1">{formErrors.policyNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-200">Policy Type</label>
                  <input
                    type="text"
                    name="policyType"
                    value={formData.policyType}
                    onChange={handleFormChange}
                    className="mt-1 w-full p-2 rounded-lg bg-white/50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600"
                  />
                  {formErrors.policyType && <p className="text-danger-500 text-xs mt-1">{formErrors.policyType}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-200">Customer Since</label>
                  <input
                    type="date"
                    name="customerSince"
                    value={formData.customerSince}
                    onChange={handleFormChange}
                    className="mt-1 w-full p-2 rounded-lg bg-white/50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600"
                  />
                  {formErrors.customerSince && <p className="text-danger-500 text-xs mt-1">{formErrors.customerSince}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-200">Age</label>
                  <input
                    type="number"
                    name="Age"
                    value={formData.Age}
                    onChange={handleFormChange}
                    className="mt-1 w-full p-2 rounded-lg bg-white/50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600"
                  />
                  {formErrors.Age && <p className="text-danger-500 text-xs mt-1">{formErrors.Age}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-200">Gender</label>
                  <select
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleFormChange}
                    className="mt-1 w-full p-2 rounded-lg bg-white/50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600"
                  >
                    <option value="1">Male</option>
                    <option value="0">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-200">Region Code</label>
                  <input
                    type="number"
                    name="Region_Code"
                    value={formData.Region_Code}
                    onChange={handleFormChange}
                    className="mt-1 w-full p-2 rounded-lg bg-white/50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600"
                  />
                  {formErrors.Region_Code && <p className="text-danger-500 text-xs mt-1">{formErrors.Region_Code}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-200">Previously Insured</label>
                  <select
                    name="Previously_Insured"
                    value={formData.Previously_Insured}
                    onChange={handleFormChange}
                    className="mt-1 w-full p-2 rounded-lg bg-white/50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600"
                  >
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-200">Vehicle Damage</label>
                  <select
                    name="Vehicle_Damage"
                    value={formData.Vehicle_Damage}
                    onChange={handleFormChange}
                    className="mt-1 w-full p-2 rounded-lg bg-white/50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600"
                  >
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-200">Annual Premium</label>
                  <input
                    type="number"
                    name="Annual_Premium"
                    value={formData.Annual_Premium}
                    onChange={handleFormChange}
                    className="mt-1 w-full p-2 rounded-lg bg-white/50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600"
                  />
                  {formErrors.Annual_Premium && <p className="text-danger-500 text-xs mt-1">{formErrors.Annual_Premium}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-200">Policy Sales Channel</label>
                  <input
                    type="number"
                    name="Policy_Sales_Channel"
                    value={formData.Policy_Sales_Channel}
                    onChange={handleFormChange}
                    className="mt-1 w-full p-2 rounded-lg bg-white/50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600"
                  />
                  {formErrors.Policy_Sales_Channel && <p className="text-danger-500 text-xs mt-1">{formErrors.Policy_Sales_Channel}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-200">Vintage (Days)</label>
                  <input
                    type="number"
                    name="Vintage"
                    value={formData.Vintage}
                    onChange={handleFormChange}
                    className="mt-1 w-full p-2 rounded-lg bg-white/50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600"
                  />
                  {formErrors.Vintage && <p className="text-danger-500 text-xs mt-1">{formErrors.Vintage}</p>}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600"
                >
                  Add Customer
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
     
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 text-neutral-400" size={18} />
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 w-full rounded-lg bg-white/50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <button
              className="px-4 py-2 rounded-lg bg-white/50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 flex items-center gap-2"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter size={16} />
              <span>Filter</span>
            </button>
           
            {filterOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-neutral-800 ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left ${selectedFilter === 'all' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'text-neutral-700 dark:text-neutral-200'}`}
                    onClick={() => { setSelectedFilter('all'); setFilterOpen(false); }}
                  >
                    All Customers
                  </button>
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left ${selectedFilter === 'high-risk' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'text-neutral-700 dark:text-neutral-200'}`}
                    onClick={() => { setSelectedFilter('high-risk'); setFilterOpen(false); }}
                  >
                    High Risk
                  </button>
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left ${selectedFilter === 'medium-risk' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'text-neutral-700 dark:text-neutral-200'}`}
                    onClick={() => { setSelectedFilter('medium-risk'); setFilterOpen(false); }}
                  >
                    Medium Risk
                  </button>
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left ${selectedFilter === 'low-risk' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'text-neutral-700 dark:text-neutral-200'}`}
                    onClick={() => { setSelectedFilter('low-risk'); setFilterOpen(false); }}
                  >
                    Low Risk
                  </button>
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left ${selectedFilter === 'active' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'text-neutral-700 dark:text-neutral-200'}`}
                    onClick={() => { setSelectedFilter('active'); setFilterOpen(false); }}
                  >
                    Active
                  </button>
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left ${selectedFilter === 'pending' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'text-neutral-700 dark:text-neutral-200'}`}
                    onClick={() => { setSelectedFilter('pending'); setFilterOpen(false); }}
                  >
                    Pending
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
       
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700">
                <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Name</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Email</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Policy Number</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Policy Type</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Status</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Churn Risk</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
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
                        <Link to={`/crm/${customer.id}`} className="font-medium hover:text-primary-600 dark:hover:text-primary-400">
                          {customer.name}
                        </Link>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{customer.email}</td>
                  <td className="py-3 px-4 text-sm">{customer.policyNumber}</td>
                  <td className="py-3 px-4 text-sm">{customer.policyType}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.status === 'active'
                        ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300'
                        : 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300'
                    }`}>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.churnRisk === 'high'
                        ? 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-300'
                        : customer.churnRisk === 'medium'
                          ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300'
                          : customer.churnRisk === 'low'
                            ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300'
                            : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-900/30 dark:text-neutral-300'
                    }`}>
                      {customer.churnRisk.charAt(0).toUpperCase() + customer.churnRisk.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/crm/${customer.id}`}
                        className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
                      >
                        <Eye size={16} />
                      </Link>
                      <button className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                        <Edit size={16} />
                      </button>
                      <button className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                        <Trash size={16} />
                      </button>
                      <div className="relative group">
                        <button className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                          <MoreHorizontal size={16} />
                        </button>
                        <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-neutral-800 ring-1 ring-black ring-opacity-5 z-10 hidden group-hover:block">
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            <button className="block px-4 py-2 text-sm w-full text-left text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700">
                              <div className="flex items-center gap-2">
                                <FileText size={16} />
                                <span>View Policy Details</span>
                              </div>
                            </button>
                            <button className="block px-4 py-2 text-sm w-full text-left text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700">
                              <div className="flex items-center gap-2">
                                <Download size={16} />
                                <span>Export Customer Data</span>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
       
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Showing {filteredCustomers.length} of {customers.length} customers
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded-md bg-white/50 dark:bg-neutral-700/50 text-sm border border-neutral-200 dark:border-neutral-600 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 rounded-md bg-primary-500 text-white text-sm">
              1
            </button>
            <button className="px-3 py-1 rounded-md bg-white/50 dark:bg-neutral-700/50 text-sm border border-neutral-200 dark:border-neutral-600">
              2
            </button>
            <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-sm border-gray-200 dark:border-gray-700">
              3
            </button>
            <button className="px-3 py-1 rounded-md bg-white/50 dark:bg-neutral-700/50 text-sm border border-neutral-200 dark:border-neutral-600">
              Next
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CrmModule;