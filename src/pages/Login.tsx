import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  AlertCircle,
  Shield,
  Users,
  BarChart3
} from 'lucide-react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { loginSuccess } from '../redux/authSlice';
import { RootState } from '../redux/store';

interface JwtPayload {
  isAdmin: boolean;
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'admin' | 'user'>('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('https://ai-personalised-dashboard.vercel.app/api/auth/login', {
        email,
        password
      }, { headers: {
      Authorization: `Bearer ${token}`,
    }, });
      console.log('Login response:', response.data);
      if (response.data.success) {
        const { token } = response.data;

        const decoded: JwtPayload = jwtDecode(token);
        console.log('Decoded JWT:', decoded);
        
        // Check if userType matches isAdmin in token
        if ((userType === 'admin' && decoded.isAdmin) || (userType === 'user' && !decoded.isAdmin)) {
          localStorage.setItem('token', JSON.stringify(token));
          dispatch(loginSuccess({ token, isAdmin: decoded.isAdmin }));
          setEmail('');
          setPassword('');
          navigate('/', { replace: true }); // Redirect to dashboard
        } else {
          setError(`This account is not registered as ${userType === 'admin' ? 'an administrator' : 'a user'}.`);
        }
      } else {
        setError(response.data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred while logging in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <Shield size={24} className="text-primary-500" />,
      title: "Secure Access",
      description: "Enterprise-grade security for your data"
    },
    {
      icon: <Users size={24} className="text-secondary-500" />,
      title: "Customer Management",
      description: "Comprehensive CRM and customer insights"
    },
    {
      icon: <BarChart3 size={24} className="text-accent-500" />,
      title: "Advanced Analytics",
      description: "AI-powered churn prediction and SHAP analysis"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-primary flex">
      {/* Left Side - Features */}
      <motion.div 
        className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <h1 className="text-3xl font-bold text-white"> SBI Life</h1>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-6">
            Welcome to the Future of Insurance Management
          </h2>
          
          <p className="text-white/80 text-lg mb-12">
            Harness the power of AI-driven insights, comprehensive customer management, 
            and advanced analytics to transform your insurance operations.
          </p>
          
          <div className="space-y-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
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
              
              <h2 className="text-2xl font-bold mb-2">Admin Sign In</h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Access your admin dashboard
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

            {/* User Type Toggle */}
            

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-neutral-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="Enter your password"
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
              </div>

              

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-neutral-600 dark:text-neutral-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                >
                  Sign up
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

export default Login;