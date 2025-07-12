"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Upload, 
  ShoppingCart, 
  Clock, 
  TrendingUp, 
  DollarSign,
  FileText,
  Image,
  Video,
  Music,
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  User,
  Shield
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { API_BASE } from "@/lib/config";
import { AnimatePresence } from "framer-motion";
import ActivityFeed from "@/components/ActivityFeed";

interface MediaItem {
  id: string;
  title: string;
  description: string;
  fileType: string;
  fileSize: string;
  registeredAt: string;
  tokenId: number;
  status: 'registered' | 'listed' | 'rented';
}

interface Transaction {
  id: string;
  type: 'registration' | 'purchase' | 'sale' | 'rental';
  amount?: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  description: string;
}

interface DashboardStats {
  totalMedia: number;
  totalValue: string;
  activeListings: number;
  totalRentals: number;
  monthlyRevenue: string;
  verificationRate: number;
}

export default function Dashboard() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalMedia: 0,
    totalValue: "0 ETH",
    activeListings: 0,
    totalRentals: 0,
    monthlyRevenue: "0 ETH",
    verificationRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'media' | 'transactions'>('overview');

  // Fetch user's media data
  const fetchUserMedia = async () => {
    try {
      const response = await fetch(`${API_BASE}/media/user`);
      if (!response.ok) {
        throw new Error('Failed to fetch user media');
      }
      const data = await response.json();
      setMediaItems(data.media || []);
    } catch (err) {
      console.error('Error fetching user media:', err);
      // Don't set error for empty data, only for actual failures
      if (err instanceof Error && err.message !== 'Failed to fetch user media') {
        setError('Failed to load media data');
      } else {
        setMediaItems([]);
      }
    }
  };

  // Fetch user's transactions
  const fetchUserTransactions = async () => {
    try {
      const response = await fetch(`${API_BASE}/transactions/user`);
      if (!response.ok) {
        throw new Error('Failed to fetch user transactions');
      }
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error('Error fetching user transactions:', err);
      // Don't set error for empty data, only for actual failures
      if (err instanceof Error && err.message !== 'Failed to fetch user transactions') {
        setError('Failed to load transaction data');
      } else {
        setTransactions([]);
      }
    }
  };

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/dashboard/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      const data = await response.json();
      setStats(data.stats || {
        totalMedia: 0,
        totalValue: "0 ETH",
        activeListings: 0,
        totalRentals: 0,
        monthlyRevenue: "0 ETH",
        verificationRate: 0
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      // Don't set error for empty data, only for actual failures
      if (err instanceof Error && err.message !== 'Failed to fetch dashboard stats') {
        setError('Failed to load dashboard stats');
      } else {
        setStats({
          totalMedia: 0,
          totalValue: "0 ETH",
          activeListings: 0,
          totalRentals: 0,
          monthlyRevenue: "0 ETH",
          verificationRate: 0
        });
      }
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchUserMedia(),
          fetchUserTransactions(),
          fetchDashboardStats()
        ]);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        // Only set error for actual failures, not empty data
        if (err instanceof Error && !err.message.includes('Failed to fetch')) {
          setError('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getFileTypeIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (fileType.startsWith('video/')) return <Video className="h-4 w-4" />;
    if (fileType.startsWith('audio/')) return <Music className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registered': return 'bg-blue-100 text-blue-800';
      case 'listed': return 'bg-green-100 text-green-800';
      case 'rented': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'registration': return <Upload className="h-4 w-4" />;
      case 'purchase': return <ArrowDownRight className="h-4 w-4" />;
      case 'sale': return <ArrowUpRight className="h-4 w-4" />;
      case 'rental': return <Clock className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your digital media assets and track your activity
            </p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button asChild>
              <Link href="/media/register">
                <Plus className="h-4 w-4 mr-2" />
                Register Media
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/marketplace">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Marketplace
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Media</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMedia}</div>
              <p className="text-xs text-muted-foreground">
                Registered files
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalValue}</div>
              <p className="text-xs text-muted-foreground">
                Total estimated value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeListings}</div>
              <p className="text-xs text-muted-foreground">
                Currently for sale
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.monthlyRevenue}</div>
              <p className="text-xs text-muted-foreground">
                This month's earnings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'media'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            My Media
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'transactions'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Transactions
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-3 gap-8"
            >
              {/* Recent Media */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Media</CardTitle>
                  <CardDescription>Your latest registered media files</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mediaItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {getFileTypeIcon(item.fileType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.fileSize}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                    {mediaItems.length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground">No media registered yet</p>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href="/dashboard?tab=media">View All Media</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest transactions and activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.slice(0, 3).map((tx) => (
                      <div key={tx.id} className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {getTransactionIcon(tx.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{tx.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        {tx.amount && (
                          <span className="text-sm font-medium">{tx.amount}</span>
                        )}
                      </div>
                    ))}
                    {transactions.length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground">No transactions yet</p>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href="/dashboard?tab=transactions">View All Transactions</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Activity Feed */}
              <Card>
                <CardHeader>
                  <CardTitle>Marketplace Activity</CardTitle>
                  <CardDescription>Recent marketplace events and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivityFeed />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'media' && (
            <motion.div
              key="media"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>My Media Library</CardTitle>
                  <CardDescription>All your registered media files</CardDescription>
                </CardHeader>
                <CardContent>
                  {mediaItems.length > 0 ? (
                    <div className="space-y-4">
                      {mediaItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {getFileTypeIcon(item.fileType)}
                            </div>
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.fileSize} • Token #{item.tokenId}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">📁</div>
                      <h3 className="text-lg font-semibold mb-2">No media registered</h3>
                      <p className="text-muted-foreground mb-4">
                        Start by registering your first media file
                      </p>
                      <Button asChild>
                        <Link href="/media/register">
                          <Plus className="h-4 w-4 mr-2" />
                          Register Media
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'transactions' && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>All your blockchain transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  {transactions.length > 0 ? (
                    <div className="space-y-4">
                      {transactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {getTransactionIcon(tx.type)}
                            </div>
                            <div>
                              <p className="font-medium">{tx.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(tx.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {tx.amount && (
                              <span className="font-medium">{tx.amount}</span>
                            )}
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                              tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {tx.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">📊</div>
                      <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
                      <p className="text-muted-foreground">
                        Your transaction history will appear here
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 