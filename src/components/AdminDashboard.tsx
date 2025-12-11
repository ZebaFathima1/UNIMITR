import { motion } from 'motion/react';
import { Plus, Upload, Edit, Trash2, MessageCircle, Calendar, Award, Users, FileEdit, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import type { Screen } from '../types';

interface AdminDashboardProps {
  onNavigate: (screen: Screen) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const stats = [
    { label: 'Total Events', value: '24', icon: Calendar, color: 'from-pink-500 to-rose-500' },
    { label: 'Active Clubs', value: '12', icon: Users, color: 'from-cyan-500 to-blue-500' },
    { label: 'Workshops', value: '8', icon: Award, color: 'from-yellow-500 to-orange-500' },
    { label: 'Support Requests', value: '5', icon: MessageCircle, color: 'from-purple-500 to-pink-500' },
  ];

  const adminOptions = [
    {
      icon: Plus,
      label: 'Create Event',
      description: 'Add new events and activities',
      color: 'from-pink-500 to-rose-500',
      iconColor: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      hoverGlow: 'hover:shadow-pink-500/20',
      onClick: () => onNavigate('createevent'),
    },
    {
      icon: Upload,
      label: 'Upload Banner',
      description: 'Add event banners and images',
      color: 'from-cyan-500 to-blue-500',
      iconColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      hoverGlow: 'hover:shadow-cyan-500/20',
      onClick: () => onNavigate('uploadbanner'),
    },
    {
      icon: FileEdit,
      label: 'Edit Events',
      description: 'Modify or delete existing events',
      color: 'from-yellow-500 to-orange-500',
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      hoverGlow: 'hover:shadow-yellow-500/20',
      onClick: () => onNavigate('editevents'),
    },
    {
      icon: Eye,
      label: 'View All Requests',
      description: 'Manage registrations & applications',
      color: 'from-purple-500 to-pink-500',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      hoverGlow: 'hover:shadow-purple-500/20',
      onClick: () => onNavigate('viewrequests'),
    },
  ];

  const recentEvents = [
    { id: 1, name: 'Tech Fest 2025', status: 'Active', registrations: 450 },
    { id: 2, name: 'Cultural Night', status: 'Active', registrations: 320 },
    { id: 3, name: 'Sports Meet', status: 'Upcoming', registrations: 180 },
  ];

  return (
    <div className="min-h-screen pb-24 pt-20 px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-gray-800 mb-1">Admin Dashboard</h1>
        <p className="text-purple-600">Manage your university events</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${stat.color}`} />
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">{stat.label}</p>
                    <h2 className="text-gray-800">{stat.value}</h2>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Admin Options - Expandable Cards */}
      <div className="mb-6">
        <h3 className="text-gray-700 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4">
          {adminOptions.map((option, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={option.onClick}
              className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-5 border-2 ${option.borderColor} ${option.hoverGlow} text-left group`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 ${option.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <option.icon className={`w-7 h-7 ${option.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-800 mb-1">{option.label}</h4>
                  <p className="text-gray-600">{option.description}</p>
                </div>
                <div className={`w-8 h-8 bg-gradient-to-br ${option.color} rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}>
                  <span className="text-white">→</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Events */}
      <div>
        <h3 className="text-gray-700 mb-4">Recent Events</h3>
        <div className="space-y-3">
          {recentEvents.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-gray-800">{event.name}</h4>
                  <p className="text-gray-600">{event.registrations} registrations</p>
                </div>
                <span className={`px-3 py-1 rounded-full ${
                  event.status === 'Active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {event.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}