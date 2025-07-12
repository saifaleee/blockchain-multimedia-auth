"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Clock, 
  Users, 
  DollarSign, 
  Calendar,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { API_BASE } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface RentalItem {
  id: string;
  title: string;
  description: string;
  tokenId: number;
  fileType: string;
  owner: string;
  renter?: string;
  rentalPrice: string;
  rentalDuration: number;
  isRented: boolean;
  rentedAt?: string;
  expiresAt?: string;
}

export default function RentalManager() {
  const [rentalItems, setRentalItems] = useState<RentalItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loadingItems, setLoadingItems] = useState(true);
  const [activeTab, setActiveTab] = useState<'rent-out' | 'my-rentals' | 'available'>('rent-out');

  // Fetch rental items
  useEffect(() => {
    const fetchRentalItems = async () => {
      try {
        setLoadingItems(true);
        const response = await fetch(`${API_BASE}/rental/items`);
        if (response.ok) {
          const data = await response.json();
          setRentalItems(data.items || []);
        }
      } catch (error) {
        console.error('Error fetching rental items:', error);
      } finally {
        setLoadingItems(false);
      }
    };

    fetchRentalItems();
  }, []);

  const handleRentOut = async (tokenId: number, price: string, duration: number) => {
    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch(`${API_BASE}/rental/rent-out`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId, price, duration }),
      });

      if (!res.ok) throw new Error(await res.text());

      setMessage({ type: 'success', text: "Item listed for rental successfully! ✅" });
      
      // Refresh rental items
      const response = await fetch(`${API_BASE}/rental/items`);
      if (response.ok) {
        const data = await response.json();
        setRentalItems(data.items || []);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: `Error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleRentItem = async (tokenId: number) => {
    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch(`${API_BASE}/rental/rent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId }),
      });

      if (!res.ok) throw new Error(await res.text());

      setMessage({ type: 'success', text: "Item rented successfully! ✅" });
      
      // Refresh rental items
      const response = await fetch(`${API_BASE}/rental/items`);
      if (response.ok) {
        const data = await response.json();
        setRentalItems(data.items || []);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: `Error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleReturnItem = async (tokenId: number) => {
    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch(`${API_BASE}/rental/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId }),
      });

      if (!res.ok) throw new Error(await res.text());

      setMessage({ type: 'success', text: "Item returned successfully! ✅" });
      
      // Refresh rental items
      const response = await fetch(`${API_BASE}/rental/items`);
      if (response.ok) {
        const data = await response.json();
        setRentalItems(data.items || []);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: `Error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return "🖼️";
    if (fileType.startsWith('video/')) return "🎥";
    if (fileType.startsWith('audio/')) return "🎵";
    return "📄";
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
    return `${Math.floor(seconds / 86400)} days`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" asChild className="mr-4">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-2">Rental Marketplace</h1>
            <p className="text-muted-foreground">
              Rent out your media or rent from others for temporary access
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('rent-out')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'rent-out'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Play className="h-4 w-4 inline mr-2" />
            Rent Out
          </button>
          <button
            onClick={() => setActiveTab('my-rentals')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'my-rentals'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Clock className="h-4 w-4 inline mr-2" />
            My Rentals
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'available'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Available
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'rent-out' && (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Play className="h-5 w-5 text-primary" />
                <CardTitle>Rent Out Your Media</CardTitle>
              </div>
              <CardDescription>
                List your media files for others to rent temporarily
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingItems ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading your media...</p>
                </div>
              ) : rentalItems.filter(item => !item.isRented).length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📁</div>
                  <h3 className="text-lg font-semibold mb-2">No media available</h3>
                  <p className="text-muted-foreground mb-4">
                    Register your first media file to start renting
                  </p>
                  <Button asChild>
                    <Link href="/media/register">
                      Register Media
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rentalItems.filter(item => !item.isRented).map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="text-2xl">{getFileTypeIcon(item.fileType)}</div>
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Token ID:</span>
                            <span className="font-mono">#{item.tokenId}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Type:</span>
                            <span>{item.fileType}</span>
                          </div>
                        </div>

                        <Button 
                          onClick={() => handleRentOut(item.tokenId, "0.01", 3600)}
                          disabled={loading}
                          className="w-full"
                          size="sm"
                        >
                          {loading ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full mr-2" />
                              </motion.div>
                              Listing...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              List for Rental
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'my-rentals' && (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <CardTitle>My Active Rentals</CardTitle>
              </div>
              <CardDescription>
                Manage your currently rented items
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rentalItems.filter(item => item.isRented).length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">⏰</div>
                  <h3 className="text-lg font-semibold mb-2">No active rentals</h3>
                  <p className="text-muted-foreground">
                    You don't have any active rentals at the moment
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rentalItems.filter(item => item.isRented).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getFileTypeIcon(item.fileType)}</div>
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <p className="text-xs text-muted-foreground">
                            Rented {item.rentedAt && formatTimeAgo(item.rentedAt)} • 
                            Expires {item.expiresAt && formatTimeAgo(item.expiresAt)}
                          </p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleReturnItem(item.tokenId)}
                        disabled={loading}
                        variant="outline"
                        size="sm"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Return
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'available' && (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Available for Rent</CardTitle>
              </div>
              <CardDescription>
                Browse media available for temporary rental
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rentalItems.filter(item => !item.isRented && item.owner !== 'current-user').length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold mb-2">No items available</h3>
                  <p className="text-muted-foreground">
                    No media is currently available for rental
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rentalItems.filter(item => !item.isRented && item.owner !== 'current-user').map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="text-2xl">{getFileTypeIcon(item.fileType)}</div>
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Price:</span>
                            <span className="font-medium">{item.rentalPrice} ETH</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Duration:</span>
                            <span>{formatDuration(item.rentalDuration)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Owner:</span>
                            <span className="font-mono text-xs">{item.owner}</span>
                          </div>
                        </div>

                        <Button 
                          onClick={() => handleRentItem(item.tokenId)}
                          disabled={loading}
                          className="w-full"
                          size="sm"
                        >
                          {loading ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full mr-2" />
                              </motion.div>
                              Renting...
                            </>
                          ) : (
                            <>
                              <Clock className="h-4 w-4 mr-2" />
                              Rent Now
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Temporary Access</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Rent media for temporary use without full ownership
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">Flexible Pricing</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Set time-based pricing for different rental durations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-lg">Revenue Stream</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Earn income by renting out your media to others
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center space-x-2 p-3 rounded-lg max-w-md mx-auto mt-8 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span className="text-sm">{message.text}</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 