import React from 'react';
import { format } from 'date-fns';
import { 
  User, 
  AlertTriangle, 
  FileText, 
  Phone, 
  MessageSquare 
} from 'lucide-react';

const RecentActivityList: React.FC = () => {
  const activities = [
    { 
      id: 1, 
      type: 'customer-update', 
      customer: 'Rahul Sharma', 
      action: 'updated their policy details', 
      timestamp: new Date(2025, 5, 6, 9, 41), 
      icon: <User size={16} className="text-accent-500" />
    },
    { 
      id: 2, 
      type: 'high-risk', 
      customer: 'Priya Patel', 
      action: 'flagged as high churn risk', 
      timestamp: new Date(2025, 5, 6, 8, 23), 
      icon: <AlertTriangle size={16} className="text-danger-500" />
    },
    { 
      id: 3, 
      type: 'document', 
      customer: 'Vikram Mehta', 
      action: 'submitted a new claim', 
      timestamp: new Date(2025, 5, 5, 16, 52), 
      icon: <FileText size={16} className="text-primary-500" />
    },
    { 
      id: 4, 
      type: 'call', 
      customer: 'Anjali Desai', 
      action: 'requested a callback', 
      timestamp: new Date(2025, 5, 5, 14, 30), 
      icon: <Phone size={16} className="text-success-500" />
    },
    { 
      id: 5, 
      type: 'message', 
      customer: 'Sandeep Kumar', 
      action: 'sent a support message', 
      timestamp: new Date(2025, 5, 5, 11, 15), 
      icon: <MessageSquare size={16} className="text-secondary-500" />
    }
  ];

  return (
    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
      {activities.map((activity) => (
        <div 
          key={activity.id} 
          className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors"
        >
          <div className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-700">
            {activity.icon}
          </div>
          <div>
            <p className="text-sm">
              <span className="font-medium">{activity.customer}</span> {activity.action}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {format(activity.timestamp, 'MMM d, h:mm a')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivityList;