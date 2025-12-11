import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logo from '../assets/WhatsApp Image 2025-11-29 at 15.20.36_76796458.jpg';
import { ArrowRight, Users, Calendar, Award, Briefcase, Heart, BookOpen, TrendingUp, Sparkles, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [showFeatures, setShowFeatures] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: Calendar,
      title: 'Campus Events',
      description: 'Discover and participate in exciting campus events with QR code check-ins',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Users,
      title: 'Student Clubs',
      description: 'Join clubs, connect with like-minded peers, and build your community',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: Heart,
      title: 'Volunteering',
      description: 'Make a difference through community service and social initiatives',
      color: 'from-pink-500 to-pink-600',
    },
    {
      icon: Briefcase,
      title: 'Internships & Placements',
      description: 'Access career opportunities and prepare for your professional journey',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: BookOpen,
      title: 'Workshops & Certifications',
      description: 'Enhance your skills with workshops and earn verifiable certificates',
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      icon: Award,
      title: 'Gamification & Rewards',
      description: 'Earn points, unlock badges, and climb the leaderboard',
      color: 'from-amber-500 to-amber-600',
    },
  ];

  const stats = [
    { value: '5000+', label: 'Active Students', icon: Users },
    { value: '200+', label: 'Events Monthly', icon: Calendar },
    { value: '50+', label: 'Active Clubs', icon: Sparkles },
    { value: '300+', label: 'Opportunities', icon: TrendingUp },
  ];

  const handleExploreFeatures = () => {
    setShowFeatures(true);
  };

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Animated Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 100, duration: 1 }}
            className="mb-8"
          >
            <motion.img
              src={logo}
              alt="Uniमित्र Logo"
              className="w-40 h-40 mx-auto rounded-3xl shadow-2xl"
              animate={{
                boxShadow: [
                  '0 0 30px rgba(139, 92, 246, 0.6)',
                  '0 0 50px rgba(236, 72, 153, 0.6)',
                  '0 0 30px rgba(139, 92, 246, 0.6)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-7xl text-gray-900 mb-6"
          >
            Welcome to <span className="bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">Uniमित्र</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl md:text-3xl text-gray-700 mb-4"
          >
            Connect. Collaborate. Conquer.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto"
          >
            Your all-in-one platform for campus engagement, career opportunities, and community building. Join thousands of students making their university experience unforgettable.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onGetStarted}
                className="px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 shadow-xl hover:shadow-2xl transition-all group"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={handleExploreFeatures}
                className="px-8 py-6 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Sparkles className="mr-2 w-5 h-5" />
                Explore Features
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative py-16 px-6 bg-gradient-to-r from-blue-50 to-red-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + idx * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center"
                >
                  <Card className="p-6 border-2 hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: idx }}
                    >
                      <Icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                    </motion.div>
                    <div className="text-3xl text-gray-900 mb-2">{stat.value}</div>
                    <p className="text-gray-600">{stat.label}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl text-gray-900 mb-4">Everything You Need in One Place</h2>
            <p className="text-lg text-gray-600">Explore powerful features designed to enhance your campus experience</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 + idx * 0.1 }}
                  whileHover={{ y: -10, scale: 1.03 }}
                >
                  <Card className="p-6 border-2 hover:shadow-2xl transition-all h-full bg-white/90 backdrop-blur-sm relative overflow-hidden group">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity"
                      style={{ background: `linear-gradient(135deg, ${feature.color})` }}
                    />
                    <motion.div 
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <h3 className="text-gray-900 text-xl mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Modal */}
      <AnimatePresence>
        {showFeatures && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowFeatures(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 p-6 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-white text-3xl mb-1">Platform Features</h2>
                    <p className="text-white/80">Discover what makes Uniमित्र special</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowFeatures(false)}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[calc(85vh-120px)] p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {features.map((feature, idx) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.03 }}
                        className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all"
                      >
                        <motion.div 
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}
                          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </motion.div>
                        <h3 className="text-gray-900 text-xl mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                        <motion.div
                          className="mt-4 pt-4 border-t border-gray-200"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.1 + 0.2 }}
                        >
                          <div className="flex items-center gap-2 text-sm text-purple-600">
                            <Sparkles className="w-4 h-4" />
                            <span>Available Now</span>
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Additional Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-100"
                >
                  <h3 className="text-xl text-gray-900 mb-3">🎯 Why Choose Uniमित्र?</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                    <div className="flex items-start gap-2">
                      <span className="text-purple-600">✓</span>
                      <span>One platform for all campus activities</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-600">✓</span>
                      <span>Track your achievements and progress</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-600">✓</span>
                      <span>Connect with students and opportunities</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-600">✓</span>
                      <span>Build your professional profile</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}