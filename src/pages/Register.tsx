import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isAdmin: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e: { target: { name: any; value: any; type: any; checked: any; }; }) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // const handleRoleChange = (e: { target: { value: any; }; }) => {
  //   const role = e.target.value;
  //   setFormData(prev => ({
  //     ...prev,
  //     isAdmin:false,
  //   }));
  // };

  const handleRegister = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        isAdmin: formData.isAdmin
      };

      const response = await axios.post('https://ai-personalised-dashboard.vercel.app/api/auth/register', registerData, { withCredentials: true });

      if (response.data.success) {
        setSuccess('Registration successful! Please sign in with your credentials.');
        setFormData({
          name: '',
          email: '',
          password: '',
          isAdmin: false
        });
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    "Advanced AI-powered churn prediction",
    "Comprehensive customer relationship management",
    "Real-time behavioral analytics and insights",
    "SHAP analysis for model interpretability",
    "Secure role-based access control",
    "24/7 technical support and training"
  ];

  return (
    <div className="min-h-screen bg-gradient-primary flex">
      {/* Left Side - Benefits */}
      <motion.div 
        className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <h1 className="text-3xl font-bold text-white">Welcome to SBI Life </h1>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-6">
            Join the Next Generation of Insurance Technology
          </h2>
          
          <p className="text-white/80 text-lg mb-8">
            Get access to cutting-edge tools and insights that will revolutionize 
            how you manage customers and predict churn.
          </p>
          
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg mb-4">What you'll get:</h3>
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                className="flex items-start gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <div className="p-1 rounded-full bg-success-500 mt-1">
                  <CheckCircle size={12} className="text-white" />
                </div>
                <p className="text-white/80">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Side - Registration Form */}
      <motion.div 
        className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full max-w-md">
          <div className="glass-card p-8">
            <div className="text-center mb-8">
              <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
                <h1 className="text-2xl font-bold">SBI Life Admin</h1>
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Create Account</h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Join our admin platform today
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 rounded-lg bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300 flex items-center gap-2"
              >
                <AlertCircle size={18} />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 rounded-lg bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 flex items-center gap-2"
              >
                <CheckCircle size={18} />
                <span className="text-sm">{success}</span>
              </motion.div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-neutral-400" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="Name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-neutral-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-neutral-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="Create password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Must be at least 6 characters long
                </p>
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Role
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.isAdmin ? 'admin' : 'user'}
                    onChange={handleRoleChange}
                    className="w-full pl-4 pr-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  {formData.isAdmin ? 'This role will have admin privileges' : 'This role will have user privileges'}
                </p>
              </div> */}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-neutral-600 dark:text-neutral-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">
              © 2025 SBI Life Insurance. All rights reserved.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;