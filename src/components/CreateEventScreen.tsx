import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, FileText, Tag, Upload, Save, FileEdit, ArrowLeft } from 'lucide-react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { createEvent } from '../lib/api';

interface CreateEventScreenProps {
  onBack: () => void;
}

export default function CreateEventScreen({ onBack }: CreateEventScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    category: '',
    description: '',
  });

  const handleSaveDraft = async () => {
    try {
      if (!formData.name || !formData.date || !formData.time || !formData.location || !formData.category) {
        toast.error('Please fill all required fields');
        return;
      }
      const timeStr = formData.time.length === 5 ? `${formData.time}:00` : formData.time;
      const payload = {
        title: formData.name,
        description: formData.description,
        date: formData.date,
        time: timeStr,
        location: formData.location,
        category: formData.category,
        status: 'draft' as const,
      };
      const evt = await createEvent(payload);
      toast.success('Draft saved successfully');
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        toast.error('Unauthorized. Log in as admin to create events.');
      } else {
        toast.error('Failed to save draft');
      }
    }
  };

  const handlePublish = async () => {
    try {
      if (!formData.name || !formData.date || !formData.time || !formData.location || !formData.category) {
        toast.error('Please fill all required fields');
        return;
      }
      const timeStr = formData.time.length === 5 ? `${formData.time}:00` : formData.time;
      const payload = {
        title: formData.name,
        description: formData.description,
        date: formData.date,
        time: timeStr,
        location: formData.location,
        category: formData.category,
        status: 'published' as const,
      };
      const evt = await createEvent(payload);
      toast.success('✅ Event Created Successfully');
      onBack();
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        toast.error('Unauthorized. Log in as admin to publish events.');
      } else {
        toast.error('Failed to create event');
      }
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
        <h1 className="text-gray-800 mb-1">Create Event</h1>
        <p className="text-purple-600">Fill in the details below</p>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 space-y-5"
      >
        {/* Event Name */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 mb-2">
            <FileText className="w-4 h-4 text-purple-600" />
            Event Name
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter event name"
            className="rounded-xl border-2 focus:border-cyan-400"
          />
        </div>

        {/* Date */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 mb-2">
            <Calendar className="w-4 h-4 text-pink-600" />
            Date
          </label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="rounded-xl border-2 focus:border-cyan-400"
          />
        </div>

        {/* Time */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 mb-2">
            <Clock className="w-4 h-4 text-cyan-600" />
            Time
          </label>
          <Input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="rounded-xl border-2 focus:border-cyan-400"
          />
        </div>

        {/* Location */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 mb-2">
            <MapPin className="w-4 h-4 text-yellow-600" />
            Location
          </label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Event venue"
            className="rounded-xl border-2 focus:border-cyan-400"
          />
        </div>

        {/* Category */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 mb-2">
            <Tag className="w-4 h-4 text-purple-600" />
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full rounded-xl border-2 border-gray-200 focus:border-cyan-400 px-3 py-2 outline-none"
          >
            <option value="">Select category</option>
            <option value="tech">Technology</option>
            <option value="cultural">Cultural</option>
            <option value="sports">Sports</option>
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-gray-700 mb-2">
            <FileEdit className="w-4 h-4 text-cyan-600" />
            Description
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your event..."
            className="rounded-xl border-2 focus:border-cyan-400 min-h-32"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSaveDraft}
            variant="outline"
            className="flex-1 rounded-xl border-2 border-purple-300 text-purple-600 hover:bg-purple-50"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button
            onClick={handlePublish}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl shadow-lg"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Publish Event
          </Button>
        </div>
      </motion.div>

      {/* Floating Upload Banner Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full shadow-2xl flex items-center justify-center hover:shadow-3xl transition-shadow z-40"
      >
        <Upload className="w-7 h-7 text-white" />
      </motion.button>
    </div>
  );
}