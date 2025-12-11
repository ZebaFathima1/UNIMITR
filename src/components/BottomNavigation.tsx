import { motion } from 'motion/react';
import { Calendar, Users, Heart, BookOpen, Briefcase } from 'lucide-react';

interface BottomNavigationProps {
  currentTab: string;
  onNavigate: (screen: string) => void;
}

export default function BottomNavigation({ currentTab, onNavigate }: BottomNavigationProps) {
  const tabs = [
    { id: 'events', icon: Calendar, label: 'Events', color: '#F33A6A' },
    { id: 'clubs', icon: Users, label: 'Clubs', color: '#00B7EB' },
    { id: 'placements', icon: Briefcase, label: 'Placements', color: 'gradient', isCenter: true },
    { id: 'workshops', icon: BookOpen, label: 'Workshops', color: '#FFC107' },
    { id: 'volunteering', icon: Heart, label: 'Volunteer', color: '#8B5CF6' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 w-full max-w-md">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl px-4 py-3 flex justify-around items-center"
      >
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          if (tab.isCenter) {
            return (
              <motion.button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className="relative -mt-8"
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 shadow-lg flex items-center justify-center"
                  animate={isActive ? {
                    boxShadow: [
                      '0 10px 30px rgba(243, 58, 106, 0.3)',
                      '0 10px 30px rgba(0, 183, 235, 0.3)',
                      '0 10px 30px rgba(243, 58, 106, 0.3)',
                    ],
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </motion.div>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-500 rounded-full"
                  />
                )}
              </motion.button>
            );
          }

          return (
            <motion.button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="relative flex flex-col items-center gap-1 py-2 px-3"
              whileTap={{ scale: 0.9 }}
            >
              <Icon
                className="w-6 h-6 transition-colors"
                style={{ color: isActive ? tab.color : '#9CA3AF' }}
              />
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -bottom-1 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: tab.color }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}