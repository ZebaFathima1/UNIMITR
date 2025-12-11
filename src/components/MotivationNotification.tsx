import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, X, Bell } from 'lucide-react';

interface MotivationNotificationProps {
  show: boolean;
  onClose: () => void;
  message: string;
  mood: string;
}

export default function MotivationNotification({ show, onClose, message, mood }: MotivationNotificationProps) {
  // Auto-close after 6 seconds
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -120, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-lg"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-gray-900">Digital Twin</h4>
                  <span className="text-lg">{mood}</span>
                </div>
                <p className="text-gray-600">{message}</p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}