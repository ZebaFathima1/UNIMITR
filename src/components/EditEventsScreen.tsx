import { useState } from 'react';
import { motion } from 'motion/react';
import { Edit, Trash2, Copy, Calendar, Users, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface EditEventsScreenProps {
  onBack: () => void;
}

export default function EditEventsScreen({ onBack }: EditEventsScreenProps) {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Tech Fest 2025',
      date: 'Nov 15, 2024',
      status: 'Live',
      registrations: 450,
      image: '🎭',
      color: 'from-pink-500 to-rose-500',
    },
    {
      id: 2,
      title: 'Cultural Night',
      date: 'Nov 20, 2024',
      status: 'Live',
      registrations: 320,
      image: '🎨',
      color: 'from-cyan-500 to-blue-500',
    },
    
    {
      id: 3,
      title: 'Sports Meet',
      date: 'Nov 25, 2024',
      status: 'Draft',
      registrations: 0,
      image: '⚽',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: 4,
      title: 'Annual Day',
      date: 'Dec 10, 2024',
      status: 'Draft',
      registrations: 0,
      image: '🎉',
      color: 'from-purple-500 to-indigo-500',
    },
  ]);

  const handleEdit = (id: number) => {
    toast.success('Opening event editor...');
  };

  const handleDelete = (id: number) => {
    setEvents(events.filter(e => e.id !== id));
    toast.success('Event deleted successfully');
  };

  const handleDuplicate = (id: number) => {
    const eventToDuplicate = events.find(e => e.id === id);
    if (eventToDuplicate) {
      const newEvent = {
        ...eventToDuplicate,
        id: events.length + 1,
        title: `${eventToDuplicate.title} (Copy)`,
        status: 'Draft',
        registrations: 0,
      };
      setEvents([...events, newEvent]);
      toast.success('Event duplicated successfully');
    }
  };

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
        <h1 className="text-gray-800 mb-1">Edit Events</h1>
        <p className="text-purple-600">Manage your created events</p>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.map((event, idx) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden"
          >
            <div className="flex">
              {/* Event Thumbnail */}
              <div className={`w-24 bg-gradient-to-br ${event.color} flex items-center justify-center text-4xl shrink-0`}>
                {event.image}
              </div>

              {/* Event Details */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-gray-800">{event.title}</h3>
                    <p className="text-gray-600 flex items-center gap-1 mt-1">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </p>
                  </div>
                  <Badge
                    className={`${
                      event.status === 'Live'
                        ? 'bg-green-100 text-green-700'
                        : event.status === 'Draft'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {event.status}
                  </Badge>
                </div>

                <p className="text-gray-600 flex items-center gap-1 mb-3">
                  <Users className="w-4 h-4" />
                  {event.registrations} registrations
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(event.id)}
                    size="sm"
                    variant="outline"
                    className="flex-1 rounded-xl border-2 border-cyan-300 text-cyan-600 hover:bg-cyan-50"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDuplicate(event.id)}
                    size="sm"
                    variant="outline"
                    className="rounded-xl border-2 border-purple-300 text-purple-600 hover:bg-purple-50 px-3"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(event.id)}
                    size="sm"
                    variant="outline"
                    className="rounded-xl border-2 border-red-300 text-red-600 hover:bg-red-50 px-3"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {events.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No events created yet</p>
        </div>
      )}
    </div>
  );
}