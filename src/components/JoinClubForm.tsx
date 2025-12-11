import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Users, Mail, Phone, GraduationCap, FileText, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { joinClub } from '../lib/api';

interface JoinClubFormProps {
  clubId: number;
  clubName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function JoinClubForm({ clubId, clubName, onClose, onSuccess }: JoinClubFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    studentId: '',
    reason: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await joinClub(clubId, {
        fullName: formData.name,
        email: formData.email,
        studentId: formData.studentId,
        phone: formData.phone,
        reason: formData.reason,
      });
      
      toast.success(`Successfully joined ${clubName}!`, {
        description: 'Your request has been submitted. Check your email for updates.',
      });
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error joining club:', error);
      toast.error(error.response?.data?.detail || 'Failed to join club. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
              >
                <Users className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-white text-2xl">Join {clubName}</h2>
                <p className="text-white/80 text-sm">Start your journey with us!</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-gray-700 font-semibold mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors"
                placeholder="Enter your full name"
              />
            </div>
          </motion.div>

          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-gray-700 font-semibold mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors"
                placeholder="your.email@university.edu"
              />
            </div>
          </motion.div>

          {/* Phone Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-gray-700 font-semibold mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors"
                placeholder="+91 98765 43210"
              />
            </div>
          </motion.div>

          {/* Student ID */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-gray-700 font-semibold mb-2">
              Student ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors"
                placeholder="Enter your student ID"
              />
            </div>
          </motion.div>

          {/* Reason */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-gray-700 font-semibold mb-2">
              Why do you want to join? <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors resize-none"
                rows={4}
                placeholder="Tell us why you're interested in joining this club..."
              />
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="pt-4"
          >
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 hover:from-purple-700 hover:via-pink-600 hover:to-cyan-600 text-white py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2 inline" />
                  Join Club
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
}
