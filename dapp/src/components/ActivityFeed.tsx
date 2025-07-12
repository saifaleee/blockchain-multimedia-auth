"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  ShoppingCart, 
  Clock, 
  User, 
  TrendingUp,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Eye,
  Heart
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { API_BASE } from "@/lib/config";

interface Activity {
  id: string;
  type: 'registration' | 'purchase' | 'sale' | 'rental' | 'like' | 'view';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  amount?: string;
  mediaTitle?: string;
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch marketplace activity
  const fetchActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/marketplace/activity`);
      if (!response.ok) {
        throw new Error('Failed to fetch marketplace activity');
      }
      
      const data = await response.json();
      setActivities(data.activities || []);
    } catch (err) {
      console.error('Error fetching marketplace activity:', err);
      // Don't set error for empty data, only for actual failures
      if (err instanceof Error && err.message !== 'Failed to fetch marketplace activity') {
        setError('Failed to load activity data');
      } else {
        setActivities([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'registration': return <Upload className="h-4 w-4" />;
      case 'purchase': return <ShoppingCart className="h-4 w-4" />;
      case 'sale': return <DollarSign className="h-4 w-4" />;
      case 'rental': return <Clock className="h-4 w-4" />;
      case 'like': return <Heart className="h-4 w-4" />;
      case 'view': return <Eye className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'registration': return 'text-blue-600 bg-blue-100';
      case 'purchase': return 'text-green-600 bg-green-100';
      case 'sale': return 'text-purple-600 bg-purple-100';
      case 'rental': return 'text-yellow-600 bg-yellow-100';
      case 'like': return 'text-red-600 bg-red-100';
      case 'view': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">Failed to load activity</p>
        <button 
          onClick={fetchActivity}
          className="text-xs text-primary hover:underline mt-1"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <button className="text-sm text-primary hover:underline">
          View All
        </button>
      </div>
      
      <AnimatePresence>
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{activity.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          by {activity.user}
                        </span>
                        {activity.mediaTitle && (
                          <span className="text-xs bg-muted px-2 py-1 rounded">
                            {activity.mediaTitle}
                          </span>
                        )}
                      </div>
                      
                      {activity.amount && (
                        <span className="text-xs font-medium text-green-600">
                          {activity.amount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {activities.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
          <p className="text-muted-foreground">
            Start registering media to see activity here
          </p>
        </motion.div>
      )}
    </div>
  );
} 