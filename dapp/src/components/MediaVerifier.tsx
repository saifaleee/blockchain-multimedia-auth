"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Upload, 
  Search,
  FileText,
  Clock,
  User
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { API_BASE } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFileSize, getFileTypeIcon } from "@/lib/utils";

interface VerificationResult {
  verified: boolean;
  message: string;
  mediaInfo?: {
    owner: string;
    registeredAt: string;
    title: string;
    description: string;
    tokenId: number;
  };
}

export default function MediaVerifier() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
      'audio/*': ['.mp3', '.wav', '.flac', '.aac', '.ogg']
    },
    multiple: false
  });

  const computeFileHash = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Simple hash computation (in production, use a proper crypto library)
        let hash = 0;
        for (let i = 0; i < uint8Array.length; i++) {
          hash = ((hash << 5) - hash) + uint8Array[i];
          hash = hash & hash; // Convert to 32-bit integer
        }
        resolve(hash.toString(16));
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const verifyFile = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setResult(null);

      // Compute file hash on the frontend
      const fileHash = await computeFileHash(file);

      const response = await fetch(`${API_BASE}/media/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileHash }),
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      const verificationResult = await response.json();
      setResult(verificationResult);
    } catch (error) {
      console.error('Verification error:', error);
      setResult({
        verified: false,
        message: 'Verification failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 mx-auto">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Verify Media Authenticity</h1>
          <p className="text-muted-foreground">
            Upload any media file to verify its authenticity and check if it's registered on the blockchain
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* File Upload Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-primary" />
                  <CardTitle>Upload File</CardTitle>
                </div>
                <CardDescription>
                  Drag and drop or click to upload a media file for verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!file ? (
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">
                      {isDragActive ? "Drop your file here" : "Drag & drop your file here"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse (Images, Videos, Audio)
                    </p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border rounded-lg p-4 bg-muted/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getFileTypeIcon(file.type)}</div>
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="text-destructive hover:text-destructive"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                <Button
                  onClick={verifyFile}
                  disabled={loading || !file}
                  className="w-full bg-gradient-to-r from-primary to-primary/90"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full mr-2"
                      />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Verify Authenticity
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-primary" />
                  <CardTitle>Verification Results</CardTitle>
                </div>
                <CardDescription>
                  Check the authenticity and registration status of your media
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`p-4 rounded-lg border ${
                        result.verified
                          ? 'bg-green-50 text-green-800 border-green-200'
                          : 'bg-red-50 text-red-800 border-red-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        {result.verified ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className="font-medium">
                          {result.verified ? 'Authentic' : 'Not Verified'}
                        </span>
                      </div>
                      <p className="text-sm mb-3">{result.message}</p>
                      
                      {result.verified && result.mediaInfo && (
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>Owner: {result.mediaInfo.owner}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>Registered: {result.mediaInfo.registeredAt}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span>Token ID: {result.mediaInfo.tokenId}</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {!result && (
                  <div className="text-center text-muted-foreground py-8">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Upload a file to verify its authenticity</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 