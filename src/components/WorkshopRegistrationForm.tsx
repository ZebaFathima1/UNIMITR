import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Mail, Phone, Users, GraduationCap, CreditCard, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface WorkshopRegistrationFormProps {
  workshopName: string;
  price: string;
  onClose: () => void;
}

export default function WorkshopRegistrationForm({ workshopName, price, onClose }: WorkshopRegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    branch: '',
    year: '',
    experience: '',
    paymentMethod: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      toast.success(`Registration Successful!`, {
        description: `You're enrolled in ${workshopName}. Check your email for workshop details.`,
      });
      setIsSubmitting(false);
      onClose();
    }, 1500);
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
        <div className="sticky top-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
              >
                <BookOpen className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-white text-2xl">Register for Workshop</h2>
                <p className="text-white/80 text-sm">{workshopName}</p>
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

          {/* Price Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mt-4 inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"
          >
            <span className="text-white font-semibold">Workshop Fee: {price}</span>
          </motion.div>
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
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors"
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
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors"
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
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="+91 98765 43210"
              />
            </div>
          </motion.div>

          {/* Branch & Year */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-gray-700 font-semibold mb-2">
                Branch <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  required
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors appearance-none bg-white"
                >
                  <option value="">Select Branch</option>
                  <option value="CSE">Computer Science</option>
                  <option value="IT">Information Technology</option>
                  <option value="ECE">Electronics</option>
                  <option value="ME">Mechanical</option>
                  <option value="CE">Civil</option>
                  <option value="EE">Electrical</option>
                </select>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-gray-700 font-semibold mb-2">
                Year <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors appearance-none bg-white"
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </motion.div>
          </div>

          {/* Experience Level */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-gray-700 font-semibold mb-2">
              Experience Level <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                <motion.button
                  key={level}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormData({ ...formData, experience: level })}
                  className={`py-3 px-4 rounded-xl border-2 transition-all ${
                    formData.experience === level
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                      : 'border-gray-200 hover:border-cyan-300'
                  }`}
                >
                  {level}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Payment Method */}
          {price !== 'Free' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-gray-700 font-semibold mb-2">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  required={price !== 'Free'}
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors appearance-none bg-white"
                >
                  <option value="">Select Payment Method</option>
                  <option value="upi">UPI</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="netbanking">Net Banking</option>
                  <option value="wallet">Digital Wallet</option>
                </select>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="pt-4"
          >
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
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
                  {price === 'Free' ? 'Register Now' : `Pay ${price} & Register`}
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
