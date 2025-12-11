import { motion } from 'motion/react';
import { Sparkles, TrendingUp } from 'lucide-react';

const congratulatoryMessages = [
  { emoji: '🎉', name: 'Rohan', action: 'attended Swachh Bharat Drive', message: 'Congratulations!' },
  { emoji: '👏', name: 'Ananya', action: 'completed Blood Donation Camp', message: 'Kudos!' },
  { emoji: '🌱', name: 'Arjun', action: 'volunteered 5 hours for Green India', message: '' },
  { emoji: '🏆', name: 'Priya', action: 'won First Prize in Hackathon', message: 'Amazing!' },
  { emoji: '⭐', name: 'Karthik', action: 'reached 500 community points', message: 'Superstar!' },
  { emoji: '📚', name: 'Sneha', action: 'completed AI/ML Workshop', message: 'Well done!' },
  { emoji: '🎯', name: 'Rahul', action: 'placed at Google', message: 'Congratulations!' },
  { emoji: '💡', name: 'Divya', action: 'organized Tech Talk event', message: 'Great job!' },
  { emoji: '🌟', name: 'Amit', action: 'mentored 10 juniors', message: 'Inspiring!' },
  { emoji: '🎓', name: 'Neha', action: 'became Club President', message: 'Proud of you!' },
];

export default function CongratulatoryBanner() {
  // Duplicate messages for seamless loop
  const messages = [...congratulatoryMessages, ...congratulatoryMessages];

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-xl relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 px-6 py-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl md:text-2xl">Community Platform</h2>
              <p className="text-blue-100 text-sm">Celebrating achievements together</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
            <TrendingUp className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-semibold text-sm">Live Updates</span>
          </div>
        </div>

        {/* Scrolling achievements */}
        <div className="w-full overflow-hidden">
          <motion.div
            className="flex gap-4 whitespace-nowrap"
            animate={{
              x: [0, -2400],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 45,
                ease: 'linear',
              },
            }}
          >
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 py-3 rounded-xl bg-white/95 backdrop-blur-md border border-white/100 shadow-lg group hover:bg-white hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-3 min-w-max"
              >
                <span className="text-3xl">{msg.emoji}</span>
                <div className="flex flex-col">
                  <span className="text-gray-800 text-base font-medium leading-tight">
                    <span className="font-bold text-blue-700 group-hover:text-blue-900">{msg.name}</span>{' '}
                    {msg.action}
                  </span>
                  {msg.message && (
                    <span className="text-red-600 font-bold text-sm mt-0.5">{msg.message}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}