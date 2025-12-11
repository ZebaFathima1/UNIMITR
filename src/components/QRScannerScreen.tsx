import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { QrCode, Camera, Upload, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface QRScannerScreenProps {
  onBack: () => void;
}

export default function QRScannerScreen({ onBack }: QRScannerScreenProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [decodedText, setDecodedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // cleanup media stream on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const stopScanning = () => {
    setScanning(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleFound = (value: string) => {
    setDecodedText(value);
    setShowSuccess(true);
    // show dialog for 3s then hide
    setTimeout(() => setShowSuccess(false), 3000);
    stopScanning();
  };

  const startScanning = async () => {
    setError(null);
    setDecodedText(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setScanning(true);

      // prefer native BarcodeDetector if available
      const BarcodeDetectorCtor = (window as any).BarcodeDetector;
      const hasNative = typeof BarcodeDetectorCtor === 'function';

      // ensure canvas exists
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }

      const scanLoop = async () => {
        if (!scanning) return;
        try {
          const video = videoRef.current;
          const canvas = canvasRef.current!;
          if (video && canvas) {
            const w = video.videoWidth || 640;
            const h = video.videoHeight || 480;
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas context not available');
            ctx.drawImage(video, 0, 0, w, h);

            if (hasNative) {
              try {
                const detector = new BarcodeDetectorCtor({ formats: ['qr_code'] });
                const imageBitmap = await createImageBitmap(canvas);
                const barcodes = await detector.detect(imageBitmap as any);
                if (barcodes && barcodes.length > 0) {
                  const raw = (barcodes[0] as any).rawValue || (barcodes[0] as any).raw; 
                  handleFound(String(raw));
                  return;
                }
              } catch (e) {
                // fallthrough to try-delete below
                console.warn('BarcodeDetector detect error', e);
              }
            }

            // Fallback: try to read using canvas pixel data if jsQR is available
            const maybeJsQR = (window as any).jsQR;
            if (maybeJsQR) {
              const imageData = ctx.getImageData(0, 0, w, h);
              const result = maybeJsQR(imageData.data, w, h);
              if (result && result.data) {
                handleFound(result.data);
                return;
              }
            }
          }
        } catch (err) {
          console.warn('scanLoop error', err);
        }

        // continue scanning
        if (scanning) requestAnimationFrame(scanLoop);
      };

      requestAnimationFrame(scanLoop);
    } catch (err: any) {
      console.error(err);
      setError('Unable to access camera. Please allow camera permissions or upload an image.');
      setScanning(false);
    }
  };

  const handleFile = async (file?: File) => {
    setError(null);
    setDecodedText(null);
    const f = file || (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files[0]);
    if (!f) return;
    try {
      const bitmap = await createImageBitmap(f as Blob);
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');
      ctx.drawImage(bitmap, 0, 0);

      const BarcodeDetectorCtor = (window as any).BarcodeDetector;
      if (typeof BarcodeDetectorCtor === 'function') {
        const detector = new BarcodeDetectorCtor({ formats: ['qr_code'] });
        const barcodes = await detector.detect(bitmap as any);
        if (barcodes && barcodes.length > 0) {
          const raw = (barcodes[0] as any).rawValue || (barcodes[0] as any).raw;
          handleFound(String(raw));
          return;
        }
      }

      const maybeJsQR = (window as any).jsQR;
      if (maybeJsQR) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const result = maybeJsQR(imageData.data, canvas.width, canvas.height);
        if (result && result.data) {
          handleFound(result.data);
          return;
        }
      }

      setError('No QR code detected in the uploaded image.');
    } catch (e) {
      console.error(e);
      setError('Failed to process the uploaded image.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-24 pt-20 px-6">
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
        <h1 className="text-gray-800 mb-1">QR Code Scanner</h1>
        <p className="text-purple-600">Scan to check-in or register</p>
      </div>

      {/* Scanner Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-6 mb-6"
      >
        <div className="relative aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl overflow-hidden">
          {/* Camera View: show live video when scanning, otherwise placeholder */}
          <div className="absolute inset-0">
            {scanning ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="w-24 h-24 text-purple-300" />
              </div>
            )}
          </div>

          {/* Scanning Frame */}
          <div className="absolute inset-8 border-4 border-cyan-500 rounded-2xl">
            {/* Corner Markers */}
            <div className="absolute -top-1 -left-1 w-8 h-8 border-l-4 border-t-4 border-cyan-500 rounded-tl-lg" />
            <div className="absolute -top-1 -right-1 w-8 h-8 border-r-4 border-t-4 border-cyan-500 rounded-tr-lg" />
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-l-4 border-b-4 border-cyan-500 rounded-bl-lg" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-r-4 border-b-4 border-cyan-500 rounded-br-lg" />

            {/* Animated Scan Line */}
            <motion.div
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
              animate={{
                top: ['0%', '100%', '0%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>

          {/* QR Icon in Center */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <QrCode className="w-32 h-32 text-purple-600" />
          </div>
        </div>

        <p className="text-center text-gray-600 mt-4">
          Position QR code within the frame
        </p>
      </motion.div>

      {/* Upload Option */}
      <div className="space-y-4">
        <Button
          onClick={() => (scanning ? stopScanning() : startScanning())}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-2xl shadow-lg h-14"
        >
          <Camera className="w-5 h-5 mr-2" />
          {scanning ? 'Stop Scanning' : 'Start Scanning'}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={() => handleFile()}
        />

        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full rounded-2xl border-2 border-purple-300 text-purple-600 hover:bg-purple-50 h-14"
        >
          <Upload className="w-5 h-5 mr-2" />
          Upload QR from Gallery
        </Button>

        {decodedText && (
          <div className="text-center text-sm text-green-700">Decoded: {decodedText}</div>
        )}
        {error && (
          <div className="text-center text-sm text-red-600">{error}</div>
        )}
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 bg-white rounded-2xl shadow-md p-5"
      >
        <h3 className="text-gray-800 mb-3">How to use</h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-cyan-500">1.</span>
            <span>Tap "Start Scanning" to activate camera</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500">2.</span>
            <span>Position the QR code within the frame</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500">3.</span>
            <span>Wait for automatic detection</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500">4.</span>
            <span>Or upload from your gallery</span>
          </li>
        </ul>
      </motion.div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="rounded-3xl text-center">
          <DialogHeader>
            <DialogTitle>Scan Successful! ✓</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <p className="text-gray-600 mb-2">Event check-in confirmed!</p>
            <p className="text-purple-600">You've earned +10 points 🎉</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}