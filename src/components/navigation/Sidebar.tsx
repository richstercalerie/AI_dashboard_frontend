import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  PieChart, 
  LineChart, 
  Activity, 
  KanbanSquare, 
  Settings as SettingsIcon,
  Landmark
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const sidebarAnimation = {
    hidden: { x: -300, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        damping: 20, 
        stiffness: 100 
      }
    }
  };

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/crm', icon: <Users size={20} />, label: 'CRM' },
    { to: '/churn-prediction', icon: <PieChart size={20} />, label: 'Churn Prediction' },
    { to: '/shap-analysis', icon: <LineChart size={20} />, label: 'SHAP Analysis' },
    { to: '/behavior-tracker', icon: <Activity size={20} />, label: 'Behavior Tracker' },
    { to: '/kanban', icon: <KanbanSquare size={20} />, label: 'Kanban Board' },
    { to: '/settings', icon: <SettingsIcon size={20} />, label: 'Settings' },
  ];

  return (
    <motion.div 
      className="w-64 bg-white dark:bg-neutral-800 h-screen shadow-lg fixed left-0 top-0 z-10"
      variants={sidebarAnimation}
      initial="hidden"
      animate="visible"
    >
      <div className="p-4 flex items-center border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-2">
          <Landmark className="text-primary-600 dark:text-primary-400" size={24} />
          <h1 className="text-xl font-semibold text-neutral-800 dark:text-white">SBI Life Admin</h1>
        </div>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink 
                to={item.to}
                className={({ isActive }) => 
                  isActive ? 'sidebar-link active' : 'sidebar-link'
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-neutral-200 dark:border-neutral-700">
        <div className="sidebar-link">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-300">
              A
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">admin@sbilife.com</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;