"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, CheckCircle, AlertCircle, Eye, EyeOff, Info } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { API_BASE } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFileSize, getFileTypeIcon } from "@/lib/utils";

interface UploadProgress {
  stage: 'preparing' | 'uploading' | 'processing' | 'registering' | 'complete';
  percentage: number;
  message: string;
}

export default function MediaRegisterForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setMessage(null);
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
      'audio/*': ['.mp3', '.wav', '.flac', '.aac', '.ogg']
    },
    multiple: false,
    maxSize: 100 * 1024 * 1024, // 100MB limit
    onDropRejected: (rejectedFiles) => {
      const error = rejectedFiles[0]?.errors[0];
      if (error?.code === 'file-too-large') {
        setMessage({ type: 'error', text: 'File is too large. Maximum size is 100MB.' });
      } else if (error?.code === 'file-invalid-type') {
        setMessage({ type: 'error', text: 'Invalid file type. Please upload images, videos, or audio files.' });
      } else {
        setMessage({ type: 'error', text: 'File upload failed. Please try again.' });
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: "Please choose a file" });
      return;
    }

    if (!title.trim()) {
      setMessage({ type: 'error', text: "Please enter a title" });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      
      // Start upload progress
      setUploadProgress({
        stage: 'preparing',
        percentage: 0,
        message: 'Preparing file for upload...'
      });

      // Simulate progress stages
      setTimeout(() => {
        setUploadProgress({
          stage: 'uploading',
          percentage: 25,
          message: 'Uploading file to server...'
        });
      }, 500);

      setTimeout(() => {
        setUploadProgress({
          stage: 'processing',
          percentage: 50,
          message: 'Processing file and generating hash...'
        });
      }, 1500);

      setTimeout(() => {
        setUploadProgress({
          stage: 'registering',
          percentage: 75,
          message: 'Registering on blockchain...'
        });
      }, 2500);
      
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", file);

      const res = await fetch(`${API_BASE}/media/register`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      setUploadProgress({
        stage: 'complete',
        percentage: 100,
        message: 'Registration complete!'
      });

      setTimeout(() => {
        setMessage({ type: 'success', text: "Media registered successfully! 🎉" });
        setTitle("");
        setDescription("");
        setFile(null);
        setFilePreview(null);
        setUploadProgress(null);
      }, 1000);

    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: `Error: ${err.message}` });
      setUploadProgress(null);
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    setMessage(null);
    setUploadProgress(null);
  };

  const getProgressColor = (stage: string) => {
    switch (stage) {
      case 'preparing': return 'bg-blue-500';
      case 'uploading': return 'bg-yellow-500';
      case 'processing': return 'bg-purple-500';
      case 'registering': return 'bg-green-500';
      case 'complete': return 'bg-green-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 mx-auto">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Register Media</CardTitle>
            <CardDescription>
              Upload and register your multimedia content on the blockchain
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Input */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter media title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Describe your media content"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Media File <span className="text-red-500">*</span>
                </label>
                {!file ? (
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50"
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input {...getInputProps()} disabled={loading} />
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">
                      {isDragActive ? "Drop your file here" : "Drag & drop your file here"}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      or click to browse (Images, Videos, Audio)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Maximum file size: 100MB
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
                      <div className="flex items-center space-x-2">
                        {filePreview && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPreview(!showPreview)}
                          >
                            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeFile}
                          disabled={loading}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* File Preview */}
                    {filePreview && showPreview && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4"
                      >
                        <div className="relative">
                          <img 
                            src={filePreview} 
                            alt="File preview" 
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Upload Progress */}
              <AnimatePresence>
                {uploadProgress && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{uploadProgress.message}</span>
                      <span className="text-muted-foreground">{uploadProgress.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${getProgressColor(uploadProgress.stage)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress.percentage}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Info Message */}
              <div className="flex items-start space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">What happens when you register media?</p>
                  <ul className="mt-1 space-y-1 text-xs">
                    <li>• File is uploaded and stored securely</li>
                    <li>• SHA-256 hash is generated for verification</li>
                    <li>• NFT is minted on the blockchain</li>
                    <li>• You become the verified owner</li>
                  </ul>
                </div>
              </div>

              {/* Message */}
              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex items-center space-x-2 p-3 rounded-lg ${
                      message.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : message.type === 'error'
                        ? 'bg-red-50 text-red-800 border border-red-200'
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {message.type === 'success' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : message.type === 'error' ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : (
                      <Info className="h-4 w-4" />
                    )}
                    <span className="text-sm">{message.text}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || !file || !title.trim()}
                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full mr-2" />
                    </motion.div>
                    Registering...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Register Media
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 