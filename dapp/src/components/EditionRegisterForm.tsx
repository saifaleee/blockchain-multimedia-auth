"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Crown, 
  Users, 
  DollarSign, 
  Calendar,
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { API_BASE } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface UserMedia {
  id: string;
  title: string;
  description: string;
  tokenId: number;
  fileType: string;
  registeredAt: string;
}

export default function EditionRegisterForm() {
  const [selectedMedia, setSelectedMedia] = useState<UserMedia | null>(null);
  const [editionNumber, setEditionNumber] = useState<number>(1);
  const [totalEditions, setTotalEditions] = useState<number>(10);
  const [price, setPrice] = useState<string>("");
  const [specialFeatures, setSpecialFeatures] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [userMedia, setUserMedia] = useState<UserMedia[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);

  // Fetch user's media for edition creation
  useEffect(() => {
    const fetchUserMedia = async () => {
      try {
        setLoadingMedia(true);
        const response = await fetch(`${API_BASE}/media/user`);
        if (response.ok) {
          const data = await response.json();
          setUserMedia(data.media || []);
        }
      } catch (error) {
        console.error('Error fetching user media:', error);
      } finally {
        setLoadingMedia(false);
      }
    };

    fetchUserMedia();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedia) {
      setMessage({ type: 'error', text: 'Please select a media file' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch(`${API_BASE}/edition/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenId: selectedMedia.tokenId,
          editionNumber,
          totalEditions,
          price,
          specialFeatures
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      setMessage({ type: 'success', text: "Limited edition created successfully! 🎉" });
      
      // Reset form
      setSelectedMedia(null);
      setEditionNumber(1);
      setTotalEditions(10);
      setPrice("");
      setSpecialFeatures("");
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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
            <h1 className="text-3xl font-bold mb-2">Create Limited Edition</h1>
            <p className="text-muted-foreground">
              Create exclusive limited editions of your registered media
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Media Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-primary" />
                <CardTitle>Select Your Media</CardTitle>
              </div>
              <CardDescription>
                Choose from your registered media files to create a limited edition
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingMedia ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading your media...</p>
                </div>
              ) : userMedia.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📁</div>
                  <h3 className="text-lg font-semibold mb-2">No media registered</h3>
                  <p className="text-muted-foreground mb-4">
                    Register your first media file to create limited editions
                  </p>
                  <Button asChild>
                    <Link href="/media/register">
                      <Upload className="h-4 w-4 mr-2" />
                      Register Media
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userMedia.map((media) => (
                    <div
                      key={media.id}
                      onClick={() => setSelectedMedia(media)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedMedia?.id === media.id
                          ? 'border-primary bg-primary/5'
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getFileTypeIcon(media.fileType)}</div>
                        <div className="flex-1">
                          <h3 className="font-medium">{media.title}</h3>
                          <p className="text-sm text-muted-foreground">{media.description}</p>
                          <p className="text-xs text-muted-foreground">
                            Token #{media.tokenId} • {media.fileType}
                          </p>
                        </div>
                        {selectedMedia?.id === media.id && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Edition Configuration */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-primary" />
                <CardTitle>Edition Details</CardTitle>
              </div>
              <CardDescription>
                Configure your limited edition parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Edition Number</label>
                  <Input
                    type="number"
                    min="1"
                    value={editionNumber}
                    onChange={(e) => setEditionNumber(Number(e.target.value))}
                    placeholder="e.g., 1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Total Editions</label>
                  <Input
                    type="number"
                    min="1"
                    value={totalEditions}
                    onChange={(e) => setTotalEditions(Number(e.target.value))}
                    placeholder="e.g., 10"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Price (ETH)</label>
                  <Input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g., 0.05"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Special Features</label>
                  <textarea
                    value={specialFeatures}
                    onChange={(e) => setSpecialFeatures(e.target.value)}
                    placeholder="Describe special features of this edition..."
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !selectedMedia}
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
                      Creating Edition...
                    </>
                  ) : (
                    <>
                      <Crown className="h-4 w-4 mr-2" />
                      Create Limited Edition
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Limited Supply</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create exclusive editions with limited availability to increase value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">Premium Pricing</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Set higher prices for limited editions due to their exclusivity
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-lg">Special Features</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Add unique features or bonuses to make your edition stand out
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