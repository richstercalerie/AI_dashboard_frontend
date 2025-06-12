import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, Moon, Sun, User, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { logout } from '../../redux/authSlice';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { RootState } from '../../redux/store';

interface UserData {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log(localStorage.getItem('token'));
        const token=localStorage.getItem('token');
        const response = await axios.get('https://ai-personalised-dashboard.vercel.app/api/auth/getUserData', {
          withCredentials:true,
          headers: {
            'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
        });
        console.log('User data response:', response.data);
        setUserData(response.data);
      } catch (err: any) {
        console.error('Fetch user data error:', err);
        setError(err.response?.data?.message || 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle clicks outside the notification popup to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        'https://ai-personalised-dashboard.vercel.app/api/auth/logout',
        { withCredentials: true }
      );
      console.log('Logout response:', response.data);
      if (response.data.success) {
        dispatch(logout());
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      } else {
        throw new Error(response.data.message || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      dispatch(logout());
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    }
  };

  const userName = userData?.name || 'Admin User';
  const userRole = userData?.isAdmin ? 'Administrator' : 'User';

  if (loading) {
    return <div className="h-16 fixed top-4 right-4 left-[280px] z-10 flex items-center px-6">Loading...</div>;
  }

  if (error) {
    return (
      <div className="h-16 fixed top-4 right-4 left-[280px] z-10 flex items-center px-6 text-danger-500">
        Error: {error}
      </div>
    );
  }

  return (
    <motion.div 
      className="h-16 glass-card fixed top-4 right-4 left-[280px] z-10 flex items-center justify-between px-6"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.2 }}
    >
      <div>
        <h2 className="text-lg font-medium">Welcome, {userName.split(' ')[0]}</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-700 rounded-full p-1">
          <button className={`px-3 py-1 rounded-md text-sm font-medium shadow-sm ${
            userData?.isAdmin 
              ? 'bg-white dark:bg-neutral-800' 
              : 'text-neutral-600 dark:text-neutral-300'
          }`}>
            Admin
          </button>
          <button className={`px-3 py-1 rounded-md text-sm ${
            !userData?.isAdmin 
              ? 'bg-white dark:bg-neutral-800' 
              : 'text-neutral-600 dark:text-neutral-300'
          }`}>
            User
          </button>
        </div>
        
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
          >
            <Bell size={18} />
          </button>
          <span className="absolute top-0 right-0 w-2 h-2 bg-danger-500 rounded-full"></span>
          {showNotifications && (
            <motion.div
              className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-800 rounded-lg shadow-lg z-20 glass-card"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="text-sm font-medium">Notifications</h3>
              </div>
              <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-800/50 text-primary-600 dark:text-primary-300">
                    <Bell size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New Customer Added</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">A new customer was added to the CRM.</p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-800/50 text-primary-600 dark:text-primary-300">
                    <Bell size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Policy Update</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Policy #12345 has been updated.</p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-800/50 text-primary-600 dark:text-primary-300">
                    <Bell size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">High Churn Risk</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Customer #67890 shows high churn risk.</p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">2 days ago</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
                <button className="w-full text-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                  View All Notifications
                </button>
              </div>
            </motion.div>
          )}
        </div>
        
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-300">
            <User size={16} />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{userRole}</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-danger-100 dark:hover:bg-danger-900/30 hover:text-danger-600 dark:hover:text-danger-400 transition-colors"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default Navbar;