import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MapPin, Calendar, Clock, Users } from 'lucide-react';
import api from '../lib/api';
import VolunteerApplicationForm from './VolunteerApplicationForm';

export default function VolunteeringPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any | null>(null);

  const fetchOpportunities = () => {
    setLoading(true);
    api.get('/volunteering/')
      .then(res => {
        // Filter to show only approved opportunities
        const approved = (res.data || []).filter((o: any) => o.status === 'approved' || o.status === 'published');
        setOpportunities(approved);
      })
      .catch(() => setOpportunities([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOpportunities(); }, []);

  return (
    <div className="min-h-screen pb-24 pt-20 px-4 bg-gradient-to-b from-purple-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Volunteering</h1>
        <p className="text-purple-600 dark:text-purple-400">Make a difference today</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      )}

      {/* Opportunities List */}
      <div className="space-y-4">
        {!loading && opportunities.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No volunteering opportunities available right now</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Check back soon!</p>
          </div>
        )}
        
        {opportunities.map((opportunity, idx) => (
          <motion.div
            key={opportunity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-purple-100 dark:border-slate-700"
          >
            <div className="h-2 bg-gradient-to-r from-pink-500 to-purple-500" />
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{opportunity.title}</h3>
                  <p className="text-purple-600 dark:text-purple-400 text-sm">{opportunity.organization}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                  Open
                </span>
              </div>
              
              {opportunity.description && (
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{opportunity.description}</p>
              )}
              
              <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                {opportunity.date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{opportunity.date}</span>
                  </div>
                )}
                {opportunity.time && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{opportunity.time}</span>
                  </div>
                )}
                {opportunity.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{opportunity.location}</span>
                  </div>
                )}
                {opportunity.requiredVolunteers && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{opportunity.requiredVolunteers} needed</span>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setSelectedOpportunity(opportunity)}
                className="mt-4 w-full py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all"
              >
                Apply Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Volunteer Application Form Modal */}
      <AnimatePresence>
        {selectedOpportunity && (
          <VolunteerApplicationForm 
            opportunityId={selectedOpportunity.id}
            activityName={selectedOpportunity.title}
            organization={selectedOpportunity.organization}
            onClose={() => setSelectedOpportunity(null)}
            onSuccess={fetchOpportunities}
          />
        )}
      </AnimatePresence>
    </div>
  );
}