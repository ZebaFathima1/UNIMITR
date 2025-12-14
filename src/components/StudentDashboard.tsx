import { motion } from 'motion/react';
import { Calendar, Users, Award, Heart, Brain } from 'lucide-react';
import { Button } from './ui/button';
import CongratulatoryBanner from './CongratulatoryBanner';
import { useState, useEffect } from 'react';

import type { Screen } from '../types';

interface Event {
  id: number;
  title: string;
  date: string;
  emoji?: string;
}

interface Workshop {
  id: number;
  title: string;
  emoji?: string;
  price: string;
}

interface StudentDashboardProps {
  userName: string;
  onNavigate: (screen: Screen) => void;
}

export default function StudentDashboard({ userName, onNavigate }: StudentDashboardProps) {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);

  const eventColors = [
    'from-pink-500 to-rose-500',
    'from-cyan-500 to-blue-500', 
    'from-yellow-500 to-orange-500',
    'from-purple-500 to-indigo-500',
    'from-green-500 to-emerald-500',
  ];

  useEffect(() => {
    // Fetch events from API
    fetch('/api/events/?status=published')
      .then(res => res.json())
      .then(data => {
        const events = data.slice(0, 3).map((e: any) => ({
          id: e.id,
          title: e.title,
          date: new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          emoji: e.emoji || '🎉',
        }));
        setUpcomingEvents(events);
      })
      .catch(err => console.error('Error fetching events:', err));

    // Fetch workshops from API
    fetch('/api/workshops/')
      .then(res => res.json())
      .then(data => {
        const ws = data.slice(0, 2).map((w: any) => ({
          id: w.id,
          title: w.title,
          emoji: w.emoji || '📚',
          price: w.price === 0 || w.price === '0' || !w.price ? 'Free' : `₹${w.price}`,
        }));
        setWorkshops(ws);
      })
      .catch(err => console.error('Error fetching workshops:', err));
  }, []);

  const quickActions = [
    { icon: Users, label: 'Find Clubs', color: 'bg-cyan-500', onClick: () => onNavigate('clubs') },
    { icon: Heart, label: 'Volunteer', color: 'bg-pink-500', onClick: () => onNavigate('volunteering') },
    { icon: Brain, label: 'Mental Health', color: 'bg-purple-500', onClick: () => onNavigate('mentalhealth') },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Congratulatory Banner - not fixed, flows with content */}
      <div className="w-full">
        <CongratulatoryBanner />
      </div>

      <div className="pb-24 pt-6 px-6">
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
              <p className="text-white text-sm font-semibold drop-shadow-md">{action.label}</p>
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
          {upcomingEvents.length > 0 ? upcomingEvents.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow flex items-center gap-4"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${eventColors[idx % eventColors.length]} rounded-xl flex items-center justify-center text-3xl shadow-md`}>
                {event.emoji}
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
          )) : (
            <p className="text-gray-500 text-center py-4">No upcoming events</p>
          )}
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
          {workshops.length > 0 ? workshops.map((workshop, idx) => (
            <motion.div
              key={workshop.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all"
            >
              <div className="text-4xl mb-2 text-center">{workshop.emoji}</div>
              <h4 className="text-gray-800 text-center mb-2">{workshop.title}</h4>
              <div className="text-center">
                <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                  {workshop.price}
                </span>
              </div>
            </motion.div>
          )) : (
            <p className="text-gray-500 text-center py-4 col-span-2">No workshops available</p>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}