import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Lock, 
  Database, 
  Cog, 
  Save, 
  Check, 
  X,
  Eye,
  EyeOff,
  Sun,
  Moon,
  UploadCloud
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('account');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSave = () => {
    // Show success message
    setShowSuccess(true);
    
    // Hide after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 lg:col-span-1">
          <h2 className="text-lg font-medium mb-4">Settings Menu</h2>
          <nav className="space-y-1">
            <button 
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
                activeTab === 'account' 
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium' 
                  : 'text-neutral-600 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/10'
              }`}
              onClick={() => setActiveTab('account')}
            >
              <User size={18} />
              <span>Account Settings</span>
            </button>
            
            <button 
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
                activeTab === 'notifications' 
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium' 
                  : 'text-neutral-600 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/10'
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell size={18} />
              <span>Notifications</span>
            </button>
            
            <button 
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
                activeTab === 'security' 
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium' 
                  : 'text-neutral-600 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/10'
              }`}
              onClick={() => setActiveTab('security')}
            >
              <Lock size={18} />
              <span>Security</span>
            </button>
            
            <button 
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
                activeTab === 'data' 
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium' 
                  : 'text-neutral-600 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/10'
              }`}
              onClick={() => setActiveTab('data')}
            >
              <Database size={18} />
              <span>Data Management</span>
            </button>
            
            <button 
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
                activeTab === 'appearance' 
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium' 
                  : 'text-neutral-600 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/10'
              }`}
              onClick={() => setActiveTab('appearance')}
            >
              <Cog size={18} />
              <span>Appearance</span>
            </button>
          </nav>
        </div>
        
        <div className="glass-card p-6 lg:col-span-3">
          {/* Success notification */}
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-3 rounded-lg bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 flex items-center gap-2"
            >
              <Check size={18} />
              <span>Settings saved successfully!</span>
            </motion.div>
          )}
          
          {activeTab === 'account' && (
            <div>
              <h2 className="text-xl font-medium mb-6">Account Settings</h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-300 text-2xl">
                    A
                  </div>
                  
                  <div>
                    <button className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 text-sm font-medium flex items-center gap-2">
                      <UploadCloud size={16} />
                      Upload Photo
                    </button>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                      Recommended: Square JPG or PNG, at least 300x300px
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      First Name
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      defaultValue="Admin"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Last Name
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      defaultValue="User"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      defaultValue="admin@sbilife.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Phone Number
                    </label>
                    <input 
                      type="tel" 
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      defaultValue="+91 9876543210"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Role
                  </label>
                  <select 
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    defaultValue="admin"
                  >
                    <option value="admin">Administrator</option>
                    <option value="manager">Manager</option>
                    <option value="analyst">Data Analyst</option>
                    <option value="support">Support Agent</option>
                  </select>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 flex items-center gap-2"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-medium mb-6">Notification Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Email Notifications</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">High Risk Customer Alerts</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Receive alerts when a customer is flagged as high churn risk
                        </p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" id="high-risk-alerts" className="sr-only" defaultChecked />
                        <label 
                          htmlFor="high-risk-alerts"
                          className="block w-11 h-6 rounded-full bg-primary-200 dark:bg-neutral-600 cursor-pointer relative after:content-[''] after:w-4 after:h-4 after:bg-white after:rounded-full after:absolute after:top-1 after:left-1 after:transition-all peer-checked:after:translate-x-5 peer-checked:bg-primary-500"
                        ></label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Policy Updates</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Receive notifications about policy changes and updates
                        </p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" id="policy-updates" className="sr-only" defaultChecked />
                        <label 
                          htmlFor="policy-updates"
                          className="block w-11 h-6 rounded-full bg-primary-200 dark:bg-neutral-600 cursor-pointer relative after:content-[''] after:w-4 after:h-4 after:bg-white after:rounded-full after:absolute after:top-1 after:left-1 after:transition-all peer-checked:after:translate-x-5 peer-checked:bg-primary-500"
                        ></label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weekly Reports</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Receive weekly summary reports on customer activity
                        </p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" id="weekly-reports" className="sr-only" defaultChecked />
                        <label 
                          htmlFor="weekly-reports"
                          className="block w-11 h-6 rounded-full bg-primary-200 dark:bg-neutral-600 cursor-pointer relative after:content-[''] after:w-4 after:h-4 after:bg-white after:rounded-full after:absolute after:top-1 after:left-1 after:transition-all peer-checked:after:translate-x-5 peer-checked:bg-primary-500"
                        ></label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">In-App Notifications</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Customer Activity</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Show notifications for important customer activities
                        </p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" id="customer-activity" className="sr-only" defaultChecked />
                        <label 
                          htmlFor="customer-activity"
                          className="block w-11 h-6 rounded-full bg-primary-200 dark:bg-neutral-600 cursor-pointer relative after:content-[''] after:w-4 after:h-4 after:bg-white after:rounded-full after:absolute after:top-1 after:left-1 after:transition-all peer-checked:after:translate-x-5 peer-checked:bg-primary-500"
                        ></label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Task Assignments</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Show notifications when tasks are assigned to you
                        </p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" id="task-assignments" className="sr-only" defaultChecked />
                        <label 
                          htmlFor="task-assignments"
                          className="block w-11 h-6 rounded-full bg-primary-200 dark:bg-neutral-600 cursor-pointer relative after:content-[''] after:w-4 after:h-4 after:bg-white after:rounded-full after:absolute after:top-1 after:left-1 after:transition-all peer-checked:after:translate-x-5 peer-checked:bg-primary-500"
                        ></label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">System Updates</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Show notifications about system updates and maintenance
                        </p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" id="system-updates" className="sr-only" />
                        <label 
                          htmlFor="system-updates"
                          className="block w-11 h-6 rounded-full bg-primary-200 dark:bg-neutral-600 cursor-pointer relative after:content-[''] after:w-4 after:h-4 after:bg-white after:rounded-full after:absolute after:top-1 after:left-1 after:transition-all peer-checked:after:translate-x-5 peer-checked:bg-primary-500"
                        ></label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 flex items-center gap-2"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div>
              <h2 className="text-xl font-medium mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Change Password</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          className="w-full px-3 py-2 pr-10 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Enter current password"
                        />
                        <button 
                          className="absolute right-3 top-2.5 text-neutral-500 dark:text-neutral-400"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          className="w-full px-3 py-2 pr-10 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Enter new password"
                        />
                        <button 
                          className="absolute right-3 top-2.5 text-neutral-500 dark:text-neutral-400"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Password must be at least 8 characters with a mix of letters, numbers, and symbols
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          className="w-full px-3 py-2 pr-10 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Confirm new password"
                        />
                        <button 
                          className="absolute right-3 top-2.5 text-neutral-500 dark:text-neutral-400"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Two-Factor Authentication</h3>
                  
                  <div className="p-4 rounded-lg bg-white/50 dark:bg-neutral-800/50 flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable Two-Factor Authentication</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <div className="relative">
                      <input type="checkbox" id="two-factor" className="sr-only" />
                      <label 
                        htmlFor="two-factor"
                        className="block w-11 h-6 rounded-full bg-primary-200 dark:bg-neutral-600 cursor-pointer relative after:content-[''] after:w-4 after:h-4 after:bg-white after:rounded-full after:absolute after:top-1 after:left-1 after:transition-all peer-checked:after:translate-x-5 peer-checked:bg-primary-500"
                      ></label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Session Management</h3>
                  
                  <div className="p-4 rounded-lg bg-white/50 dark:bg-neutral-800/50">
                    <p className="font-medium mb-2">Active Sessions</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Windows 11 - Chrome</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Mumbai, India - Current Session
                          </p>
                        </div>
                        <button className="text-sm text-primary-600 dark:text-primary-400">
                          This Device
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">macOS - Safari</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Delhi, India - Last active: 2 days ago
                          </p>
                        </div>
                        <button className="text-sm text-danger-600 dark:text-danger-400">
                          Revoke
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">iOS 17 - Mobile App</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Mumbai, India - Last active: 5 hours ago
                          </p>
                        </div>
                        <button className="text-sm text-danger-600 dark:text-danger-400">
                          Revoke
                        </button>
                      </div>
                    </div>
                    
                    <button className="mt-4 text-sm text-danger-600 dark:text-danger-400 font-medium">
                      Revoke All Other Sessions
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 flex items-center gap-2"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'data' && (
            <div>
              <h2 className="text-xl font-medium mb-6">Data Management</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Data Import/Export</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-white/50 dark:bg-neutral-800/50">
                      <h4 className="font-medium mb-2">Import Data</h4>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                        Import customer data from CSV or Excel files
                      </p>
                      <button className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 text-sm font-medium flex items-center gap-2">
                        <UploadCloud size={16} />
                        Import File
                      </button>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-white/50 dark:bg-neutral-800/50">
                      <h4 className="font-medium mb-2">Export Data</h4>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                        Export customer data to CSV or Excel format
                      </p>
                      <button className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 text-sm font-medium">
                        Export Data
                      </button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Data Backup</h3>
                  
                  <div className="p-4 rounded-lg bg-white/50 dark:bg-neutral-800/50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">Automatic Backups</h4>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Automatically backup system data daily
                        </p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" id="auto-backup" className="sr-only" defaultChecked />
                        <label 
                          htmlFor="auto-backup"
                          className="block w-11 h-6 rounded-full bg-primary-200 dark:bg-neutral-600 cursor-pointer relative after:content-[''] after:w-4 after:h-4 after:bg-white after:rounded-full after:absolute after:top-1 after:left-1 after:transition-all peer-checked:after:translate-x-5 peer-checked:bg-primary-500"
                        ></label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm">Last backup:</p>
                        <p className="text-sm font-medium">June 5, 2025 - 11:30 PM</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm">Backup frequency:</p>
                        <select className="text-sm py-1 px-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-700/50">
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm">Retention period:</p>
                        <select className="text-sm py-1 px-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-700/50">
                          <option value="30">30 days</option>
                          <option value="60">60 days</option>
                          <option value="90">90 days</option>
                        </select>
                      </div>
                    </div>
                    
                    <button className="mt-4 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 text-sm font-medium">
                      Create Manual Backup
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Data Retention</h3>
                  
                  <div className="p-4 rounded-lg bg-white/50 dark:bg-neutral-800/50">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                      Configure how long different types of data should be retained in the system
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <p className="text-sm">Customer activity logs:</p>
                        <select className="text-sm py-1 px-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-700/50">
                          <option value="1">1 year</option>
                          <option value="2" selected>2 years</option>
                          <option value="3">3 years</option>
                          <option value="5">5 years</option>
                        </select>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <p className="text-sm">System logs:</p>
                        <select className="text-sm py-1 px-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-700/50">
                          <option value="3">3 months</option>
                          <option value="6" selected>6 months</option>
                          <option value="12">1 year</option>
                        </select>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <p className="text-sm">Archived customers:</p>
                        <select className="text-sm py-1 px-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-700/50">
                          <option value="2">2 years</option>
                          <option value="5" selected>5 years</option>
                          <option value="7">7 years</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 flex items-center gap-2"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'appearance' && (
            <div>
              <h2 className="text-xl font-medium mb-6">Appearance Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Theme Preferences</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button 
                      className={`p-4 rounded-lg border-2 flex flex-col items-center gap-3 ${
                        theme === 'light' 
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                          : 'border-neutral-200 dark:border-neutral-700 bg-white/50 dark:bg-neutral-800/50'
                      }`}
                      onClick={() => theme !== 'light' && toggleTheme()}
                    >
                      <Sun size={24} className="text-warning-500" />
                      <div className="text-center">
                        <p className="font-medium">Light Mode</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Light background with dark text
                        </p>
                      </div>
                      {theme === 'light' && (
                        <span className="absolute top-2 right-2 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </span>
                      )}
                    </button>
                    
                    <button 
                      className={`p-4 rounded-lg border-2 flex flex-col items-center gap-3 ${
                        theme === 'dark' 
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                          : 'border-neutral-200 dark:border-neutral-700 bg-white/50 dark:bg-neutral-800/50'
                      }`}
                      onClick={() => theme !== 'dark' && toggleTheme()}
                    >
                      <Moon size={24} className="text-secondary-500" />
                      <div className="text-center">
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Dark background with light text
                        </p>
                      </div>
                      {theme === 'dark' && (
                        <span className="absolute top-2 right-2 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </span>
                      )}
                    </button>
                    
                    <button 
                      className={`p-4 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 bg-white/50 dark:bg-neutral-800/50 flex flex-col items-center gap-3`}
                    >
                      <div className="flex">
                        <Sun size={24} className="text-warning-500" />
                        <Moon size={24} className="text-secondary-500 -ml-2" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">System Default</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Follow system theme preference
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Dashboard Layout</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-neutral-800/50">
                      <div>
                        <p className="font-medium">Compact View</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Show more information in less space
                        </p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" id="compact-view" className="sr-only" />
                        <label 
                          htmlFor="compact-view"
                          className="block w-11 h-6 rounded-full bg-primary-200 dark:bg-neutral-600 cursor-pointer relative after:content-[''] after:w-4 after:h-4 after:bg-white after:rounded-full after:absolute after:top-1 after:left-1 after:transition-all peer-checked:after:translate-x-5 peer-checked:bg-primary-500"
                        ></label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-neutral-800/50">
                      <div>
                        <p className="font-medium">Show Quick Actions</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Display quick action buttons on the dashboard
                        </p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" id="quick-actions" className="sr-only" defaultChecked />
                        <label 
                          htmlFor="quick-actions"
                          className="block w-11 h-6 rounded-full bg-primary-200 dark:bg-neutral-600 cursor-pointer relative after:content-[''] after:w-4 after:h-4 after:bg-white after:rounded-full after:absolute after:top-1 after:left-1 after:transition-all peer-checked:after:translate-x-5 peer-checked:bg-primary-500"
                        ></label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-neutral-800/50">
                      <div>
                        <p className="font-medium">Animations</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Enable UI animations and transitions
                        </p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" id="animations" className="sr-only" defaultChecked />
                        <label 
                          htmlFor="animations"
                          className="block w-11 h-6 rounded-full bg-primary-200 dark:bg-neutral-600 cursor-pointer relative after:content-[''] after:w-4 after:h-4 after:bg-white after:rounded-full after:absolute after:top-1 after:left-1 after:transition-all peer-checked:after:translate-x-5 peer-checked:bg-primary-500"
                        ></label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 flex items-center gap-2"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;