import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Image as ImageIcon, X, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface UploadBannerScreenProps {
  onBack: () => void;
}

export default function UploadBannerScreen({ onBack }: UploadBannerScreenProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = () => {
    // Simulate file selection
    setSelectedFile('event-banner-preview.jpg');
  };

  const handleUpload = () => {
    toast.success('Banner uploaded successfully!');
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 pb-24 pt-20 px-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-gray-800 mb-1">Upload Banner</h1>
        <p className="text-purple-600">Add event banners and images</p>
      </div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl p-8"
      >
        {!selectedFile ? (
          <div
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFileSelect();
            }}
            onDragOver={(e) => e.preventDefault()}
            className={`relative border-4 border-dashed rounded-2xl p-12 text-center transition-all ${
              isDragging
                ? 'border-cyan-500 bg-cyan-50'
                : 'border-purple-300 hover:border-cyan-400 hover:bg-purple-50'
            }`}
          >
            <motion.div
              animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
              className="space-y-4"
            >
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <Upload className="w-12 h-12 text-purple-600" />
              </div>

              <div>
                <h3 className="text-gray-800 mb-2">Drop your banner here</h3>
                <p className="text-gray-500 mb-4">or</p>
                <Button
                  onClick={handleFileSelect}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl shadow-lg"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Browse Files
                </Button>
              </div>

              <div className="text-gray-500 space-y-1">
                <p>Supported: JPG, PNG</p>
                <p>Recommended: 16:9 aspect ratio</p>
                <p>Max size: 5MB</p>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            {/* Preview */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 aspect-video">
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="w-24 h-24 text-purple-300" />
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-gray-800">{selectedFile}</p>
              </div>
            </div>

            {/* File Info */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div className="flex-1">
                <p className="text-gray-800">Ready to upload</p>
                <p className="text-gray-600">1920 × 1080 px • 2.4 MB</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => setSelectedFile(null)}
                variant="outline"
                className="flex-1 rounded-xl border-2 border-pink-300 text-pink-600 hover:bg-pink-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl shadow-lg"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Banner
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Recent Uploads */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <h3 className="text-gray-700 mb-4">Recent Uploads</h3>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-purple-300" />
              </div>
              <div className="p-3">
                <p className="text-gray-600 text-sm">Banner {i}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}