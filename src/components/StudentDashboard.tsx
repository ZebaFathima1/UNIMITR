import { motion } from 'motion/react';
import { Calendar, Users, Award, Trophy, BookOpen, Heart } from 'lucide-react';
import { Button } from './ui/button';
import CongratulatoryBanner from './CongratulatoryBanner';

import type { Screen } from '../types';

interface StudentDashboardProps {
  userName: string;
  onNavigate: (screen: Screen) => void;
}

export default function StudentDashboard({ userName, onNavigate }: StudentDashboardProps) {
  const upcomingEvents = [
    { id: 1, title: 'Tech Fest 2025', date: 'Nov 15', image: '🎭', color: 'from-pink-500 to-rose-500' },
    { id: 2, title: 'Cultural Night', date: 'Nov 20', image: '🎨', color: 'from-cyan-500 to-blue-500' },
    { id: 3, title: 'Sports Meet', date: 'Nov 25', image: '⚽', color: 'from-yellow-500 to-orange-500' },
  ];

  const quickActions = [
    { icon: Users, label: 'Find Clubs', color: 'bg-cyan-500', onClick: () => onNavigate('clubs') },
    { icon: Heart, label: 'Volunteer', color: 'bg-pink-500', onClick: () => onNavigate('volunteering') },
    { icon: Award, label: 'Certificates', color: 'bg-purple-500', onClick: () => {} },
  ];

  return (
    <div className="min-h-screen">
      {/* Congratulatory Banner at the top */}
      <div className="fixed top-16 left-0 right-0 z-20">
        <CongratulatoryBanner />
      </div>

      <div className="pb-24 pt-44 px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-gray-800 mb-2">
          Hey {userName} 👋
        </h1>
        <p className="text-purple-600">Ready to Explore?</p>
      </motion.div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-gray-700 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={action.onClick}
              className={`${action.color} rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all active:scale-95`}
            >
              <action.icon className="w-6 h-6 text-white mx-auto mb-2" />
              <p className="text-white text-sm">{action.label}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-700">Upcoming Events</h3>
          <button 
            onClick={() => onNavigate('events')}
            className="text-pink-500 hover:text-pink-600"
          >
            View All
          </button>
        </div>

        <div className="space-y-4">
          {upcomingEvents.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow flex items-center gap-4"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${event.color} rounded-xl flex items-center justify-center text-3xl shadow-md`}>
                {event.image}
              </div>
              <div className="flex-1">
                <h4 className="text-gray-800 mb-1">{event.title}</h4>
                <p className="text-gray-500 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {event.date}
                </p>
              </div>
              <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-xl shadow-md">
                Register
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommended Workshops */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-700">Recommended Workshops</h3>
          <button 
            onClick={() => onNavigate('workshops')}
            className="text-cyan-500 hover:text-cyan-600"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { title: 'Web Dev', icon: '💻', price: 'Free' },
            { title: 'UI/UX Design', icon: '🎨', price: '₹299' },
          ].map((workshop, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all"
            >
              <div className="text-4xl mb-2 text-center">{workshop.icon}</div>
              <h4 className="text-gray-800 text-center mb-2">{workshop.title}</h4>
              <div className="text-center">
                <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                  {workshop.price}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}