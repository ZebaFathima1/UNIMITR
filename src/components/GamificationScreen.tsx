import { motion } from 'motion/react';
import { Award, Trophy, Star, Zap, TrendingUp, ArrowLeft } from 'lucide-react';
import { Progress } from './ui/progress';

interface GamificationScreenProps {
  onBack: () => void;
}

export default function GamificationScreen({ onBack }: GamificationScreenProps) {
  const unlockedBadges = [
    { id: 1, icon: '🏅', name: 'Event Explorer', description: 'Attended 5+ events', earned: true, color: 'from-yellow-500 to-orange-500' },
    { id: 2, icon: '🎨', name: 'Creative Organizer', description: 'Organized 3+ events', earned: true, color: 'from-pink-500 to-rose-500' },
    { id: 3, icon: '💪', name: 'Top Volunteer', description: 'Volunteered 10+ hours', earned: true, color: 'from-purple-500 to-indigo-500' },
    { id: 4, icon: '💡', name: 'Knowledge Guru', description: 'Answered 20+ queries', earned: true, color: 'from-cyan-500 to-blue-500' },
  ];

  const lockedBadges = [
    { id: 5, icon: '🌟', name: 'Social Butterfly', description: 'Connect with 50 students', earned: false },
    { id: 6, icon: '🎯', name: 'Workshop Master', description: 'Complete 5 workshops', earned: false },
    { id: 7, icon: '🔥', name: 'Streak Champion', description: 'Login for 30 consecutive days', earned: false },
  ];

  const currentPoints = 450;
  const nextBadgePoints = 500;
  const progress = (currentPoints / nextBadgePoints) * 100;

  const pointsTips = [
    { action: 'Attend an event', points: '+50 points', icon: Trophy },
    { action: 'Answer a query', points: '+10 points', icon: Star },
    { action: 'Volunteer', points: '+30 points', icon: Award },
    { action: 'Connect with students', points: '+5 points', icon: Zap },
  ];

  return (
    <div className="min-h-screen pb-24 pt-20 px-6">
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
        <h1 className="text-gray-800 mb-1">Gamification & Rewards</h1>
        <p className="text-purple-600">Your achievements and progress</p>
      </div>

      {/* Progress to Next Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          <h3 className="text-gray-800">Next Badge Progress</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">{currentPoints} / {nextBadgePoints} points</span>
            <span className="text-purple-600">{nextBadgePoints - currentPoints} points to go!</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
      </motion.div>

      {/* Unlocked Badges */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700">Your Badges</h3>
          <span className="text-purple-600">{unlockedBadges.length} earned</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {unlockedBadges.map((badge, idx) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-gradient-to-br ${badge.color} rounded-2xl p-5 text-white shadow-lg`}
            >
              <div className="text-4xl mb-2">{badge.icon}</div>
              <h4 className="text-white mb-1">{badge.name}</h4>
              <p className="text-white/90 text-sm">{badge.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Locked Badges */}
      <div className="mb-6">
        <h3 className="text-gray-700 mb-4">Unlock Next</h3>
        <div className="space-y-3">
          {lockedBadges.map((badge, idx) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-md p-4 border-2 border-dashed border-gray-300 opacity-70"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl grayscale">{badge.icon}</div>
                <div>
                  <h4 className="text-gray-600">{badge.name}</h4>
                  <p className="text-gray-500">{badge.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How to Earn More Points */}
      <div>
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-1 mb-4">
          <div className="bg-white rounded-2xl p-4">
            <h3 className="text-purple-700 mb-1">How to Earn More Points</h3>
            <p className="text-gray-600">Level up faster with these activities</p>
          </div>
        </div>

        <div className="space-y-3">
          {pointsTips.map((tip, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <tip.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-800">{tip.action}</span>
              </div>
              <span className="text-purple-600">{tip.points}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}