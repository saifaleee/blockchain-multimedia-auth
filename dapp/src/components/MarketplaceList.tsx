"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  Tag, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  X,
  Grid,
  List,
  SlidersHorizontal
} from "lucide-react";
import { API_BASE } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

interface MediaItem {
  id: string;
  title: string;
  description: string;
  owner: string;
  price: string;
  tokenId: number;
  fileType: string;
  fileSize: string;
  listedAt: string;
  verified: boolean;
}

export default function Marketplace() {
  const [tokenId, setTokenId] = useState<number>(0);
  const [priceWei, setPriceWei] = useState<string>("");
  const [valueWei, setValueWei] = useState<string>("");
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'purchase'>('list');
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [mediaType, setMediaType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Marketplace data
  const [marketplaceItems, setMarketplaceItems] = useState<MediaItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch marketplace items
  const fetchMarketplaceItems = async () => {
    try {
      setLoadingItems(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/marketplace/items`);
      if (!response.ok) {
        throw new Error('Failed to fetch marketplace items');
      }
      
      const data = await response.json();
      setMarketplaceItems(data.items || []);
    } catch (err) {
      console.error('Error fetching marketplace items:', err);
      // Don't set error for empty data, only for actual failures
      if (err instanceof Error && err.message !== 'Failed to fetch marketplace items') {
        setError('Failed to load marketplace items');
      } else {
        setMarketplaceItems([]);
      }
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    fetchMarketplaceItems();
  }, []);

  const listToken = async () => {
    try {
      setLoading(true);
      setMessage(null);
      
      const res = await fetch(`${API_BASE}/marketplace/list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId, priceWei }),
      });
      
      if (!res.ok) throw new Error(await res.text());
      
      setMessage({ type: 'success', text: "Token listed successfully! ✅" });
      setTokenId(0);
      setPriceWei("");
      
      // Refresh marketplace items after listing
      await fetchMarketplaceItems();
    } catch (err: any) {
      setMessage({ type: 'error', text: `Error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const purchaseToken = async () => {
    try {
      setLoading(true);
      setMessage(null);
      
      const res = await fetch(`${API_BASE}/marketplace/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId, valueWei }),
      });
      
      if (!res.ok) throw new Error(await res.text());
      
      setMessage({ type: 'success', text: "Purchase transaction sent! ✅" });
      setTokenId(0);
      setValueWei("");
      
      // Refresh marketplace items after purchase
      await fetchMarketplaceItems();
    } catch (err: any) {
      setMessage({ type: 'error', text: `Error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  // Filter and search functions
  const filteredItems = marketplaceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.owner.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPrice = parseFloat(item.price) >= priceRange[0] && parseFloat(item.price) <= priceRange[1];
    
    const matchesType = mediaType === "all" || 
                       (mediaType === "image" && item.fileType.startsWith('image/')) ||
                       (mediaType === "video" && item.fileType.startsWith('video/')) ||
                       (mediaType === "audio" && item.fileType.startsWith('audio/'));
    
    const matchesVerified = !verifiedOnly || item.verified;
    
    return matchesSearch && matchesPrice && matchesType && matchesVerified;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'newest':
        return new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime();
      case 'oldest':
        return new Date(a.listedAt).getTime() - new Date(b.listedAt).getTime();
      default:
        return 0;
    }
  });

  const getFileTypeIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return "🖼️";
    if (fileType.startsWith('video/')) return "🎥";
    if (fileType.startsWith('audio/')) return "🎵";
    return "📄";
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 1000]);
    setMediaType("all");
    setSortBy("newest");
    setVerifiedOnly(false);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">Error Loading Marketplace</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchMarketplaceItems}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 mx-auto">
            <ShoppingCart className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
          <p className="text-muted-foreground">
            Buy and sell authenticated media in our decentralized marketplace
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, description, or owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border rounded-lg p-4 bg-muted/50"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Media Type</label>
                    <select
                      value={mediaType}
                      onChange={(e) => setMediaType(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="all">All Types</option>
                      <option value="image">Images</option>
                      <option value="video">Videos</option>
                      <option value="audio">Audio</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Price Range (ETH)</label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseFloat(e.target.value) || 0, priceRange[1]])}
                        className="text-sm"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseFloat(e.target.value) || 1000])}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="verifiedOnly"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="verifiedOnly" className="text-sm">
                      Verified Only
                    </label>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {sortedItems.length} of {marketplaceItems.length} items
          </p>
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4 mr-2" />
              Clear Search
            </Button>
          )}
        </div>

        {/* Loading State */}
        {loadingItems && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading marketplace items...</p>
          </div>
        )}

        {/* Marketplace Items */}
        {!loadingItems && (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {sortedItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group"
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="text-2xl">{getFileTypeIcon(item.fileType)}</div>
                          {item.verified && (
                            <div className="flex items-center space-x-1 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-xs">Verified</span>
                            </div>
                          )}
                        </div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {item.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Price</span>
                            <span className="font-semibold">{item.price} ETH</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Owner</span>
                            <span className="font-mono text-xs">{item.owner}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Size</span>
                            <span>{item.fileSize}</span>
                          </div>
                          <Button className="w-full" size="sm">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                {sortedItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl">{getFileTypeIcon(item.fileType)}</div>
                            <div>
                              <h3 className="font-semibold">{item.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {item.description}
                              </p>
                              <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                                <span>Owner: {item.owner}</span>
                                <span>Size: {item.fileSize}</span>
                                {item.verified && (
                                  <span className="flex items-center text-green-600">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Verified
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold">{item.price} ETH</div>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* No Results */}
            {sortedItems.length === 0 && !loadingItems && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold mb-2">No items found</h3>
                <p className="text-muted-foreground mb-4">
                  {marketplaceItems.length === 0 
                    ? "No items are currently listed in the marketplace"
                    : "Try adjusting your search criteria or filters"
                  }
                </p>
                {marketplaceItems.length === 0 ? (
                  <Button asChild>
                    <Link href="/media/register">
                      Register Your First Media
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                )}
              </motion.div>
            )}
          </>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-8 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'list'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Tag className="h-4 w-4 inline mr-2" />
            List Token
          </button>
          <button
            onClick={() => setActiveTab('purchase')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'purchase'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <DollarSign className="h-4 w-4 inline mr-2" />
            Purchase
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* List Token Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Tag className="h-5 w-5 text-primary" />
                  <CardTitle>List Your Token</CardTitle>
                </div>
                <CardDescription>
                  List your media token for sale in the marketplace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Token ID</label>
                  <Input
                    type="number"
                    placeholder="Enter token ID"
                    value={tokenId}
                    onChange={(e) => setTokenId(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price (Wei)</label>
                  <Input
                    type="text"
                    placeholder="Enter price in wei"
                    value={priceWei}
                    onChange={(e) => setPriceWei(e.target.value)}
                  />
                  {priceWei && (
                    <p className="text-xs text-muted-foreground">
                      ≈ {formatPrice(priceWei)}
                    </p>
                  )}
                </div>
                <Button
                  onClick={listToken}
                  disabled={loading || !tokenId || !priceWei}
                  className="w-full bg-gradient-to-r from-primary to-primary/90"
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
                      <Tag className="h-4 w-4 mr-2" />
                      List Token
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Purchase Token Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <CardTitle>Purchase Token</CardTitle>
                </div>
                <CardDescription>
                  Buy media tokens from the marketplace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Token ID</label>
                  <Input
                    type="number"
                    placeholder="Enter token ID"
                    value={tokenId}
                    onChange={(e) => setTokenId(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Value (Wei)</label>
                  <Input
                    type="text"
                    placeholder="Enter value in wei"
                    value={valueWei}
                    onChange={(e) => setValueWei(e.target.value)}
                  />
                  {valueWei && (
                    <p className="text-xs text-muted-foreground">
                      ≈ {formatPrice(valueWei)}
                    </p>
                  )}
                </div>
                <Button
                  onClick={purchaseToken}
                  disabled={loading || !tokenId || !valueWei}
                  className="w-full bg-gradient-to-r from-primary to-primary/90"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full mr-2" />
                      </motion.div>
                      Purchasing...
                    </>
                  ) : (
                    <>
                      <DollarSign className="h-4 w-4 mr-2" />
                      Purchase Token
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 