import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, DollarSign, Award, MapPin, Users } from 'lucide-react';
import { Button } from './ui/button';
import WorkshopRegistrationForm from './WorkshopRegistrationForm';
import api from '../lib/api';

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkshop, setSelectedWorkshop] = useState<any | null>(null);

  const fetchWorkshops = () => {
    setLoading(true);
    api.get('workshops/')
      .then(res => {
        // Filter to show approved workshops
        const approved = (res.data || []).filter((w: any) => w.status === 'approved' || w.status === 'published');
        setWorkshops(approved);
      })
      .catch(() => setWorkshops([]))
      .finally(() => setLoading(false));
  };

  useEffect(fetchWorkshops, []);

  return (
    <div className="min-h-screen pb-24 pt-20 px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-gray-800 mb-1">Workshops</h1>
        <p className="text-purple-600">Learn new skills and grow</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && workshops.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No workshops available right now</p>
          <p className="text-gray-400 text-sm mt-2">Check back soon!</p>
        </div>
      )}

      {/* Workshops List */}
      <div className="space-y-4">
        {!loading && workshops.map((workshop: any, idx: number) => (
          <motion.div
            key={workshop.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-5"
          >
            <div className="flex gap-4">
              <motion.div 
                className="text-5xl"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: 'spring' }}
              >
                💻
              </motion.div>
              <div className="flex-1">
                <h3 className="text-gray-800 mb-2 font-semibold">{workshop.title}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-pink-500" />
                    <span>{workshop.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4 text-cyan-500" />
                    <span>{workshop.time} ({workshop.durationHours || 2}h)</span>
                  </div>
                  {workshop.instructor && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span>{workshop.instructor}</span>
                    </div>
                  )}
                  {workshop.location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-green-500" />
                      <span>{workshop.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.span 
                      className={`px-4 py-2 rounded-full ${
                        !workshop.fee || workshop.fee === 'Free' || workshop.fee === '0'
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {!workshop.fee || workshop.fee === '0' ? 'Free' : workshop.fee}
                    </motion.span>
                    {workshop.maxParticipants && (
                      <span className="text-gray-500 flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {workshop.maxParticipants} seats
                      </span>
                    )}
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => setSelectedWorkshop(workshop)}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl shadow-md"
                    >
                      Register
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Workshop Registration Form Modal */}
      <AnimatePresence>
        {selectedWorkshop && (
          <WorkshopRegistrationForm 
            workshopId={selectedWorkshop.id}
            workshopName={selectedWorkshop.title}
            price={selectedWorkshop.fee || 'Free'}
            onClose={() => setSelectedWorkshop(null)}
            onSuccess={fetchWorkshops}
          />
        )}
      </AnimatePresence>
    </div>
  );
}