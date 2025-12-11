import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Music, Palette, Code, Camera, Trophy, Plus, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import JoinClubForm from './JoinClubForm';
import { fetchClubs, type ClubDto } from '../lib/api';
import { toast } from 'sonner';

interface ClubsPageProps {
  isAdmin: boolean;
}

const clubIcons = [Music, Palette, Code, Camera, Trophy, Users];
const clubColors = [
  'from-pink-500 to-rose-500',
  'from-purple-500 to-indigo-500',
  'from-cyan-500 to-blue-500',
  'from-yellow-500 to-orange-500',
  'from-green-500 to-emerald-500',
  'from-red-500 to-pink-500',
];

export default function ClubsPage({ isAdmin }: ClubsPageProps) {
  const [selectedClub, setSelectedClub] = useState<number | null>(null);
  const [clubs, setClubs] = useState<ClubDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClubs();
  }, []);

  const loadClubs = async () => {
    try {
      setLoading(true);
      const data = await fetchClubs();
      setClubs(data);
    } catch (error) {
      console.error('Error loading clubs:', error);
      toast.error('Failed to load clubs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-20 px-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-gray-800 mb-1">Campus Clubs</h1>
          <p className="text-purple-600">Find your community</p>
        </div>
        {isAdmin && (
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-2xl shadow-lg">
            <Plus className="w-5 h-5 mr-1" />
            Create
          </Button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      )}

      {/* Empty State */}
      {!loading && clubs.length === 0 && (
        <div className="text-center py-20">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No clubs found</p>
          {isAdmin && (
            <p className="text-gray-400 mt-2">Create your first club to get started!</p>
          )}
        </div>
      )}

      {/* Clubs Grid */}
      {!loading && clubs.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {clubs.map((club, idx) => {
            const Icon = clubIcons[idx % clubIcons.length];
            const color = clubColors[idx % clubColors.length];
            return (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden"
              >
                <div className={`h-24 bg-gradient-to-br ${color} flex items-center justify-center relative overflow-hidden`}>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-white/10"
                  />
                  <Icon className="w-12 h-12 text-white relative z-10" />
                </div>
                <div className="p-4">
                  <h3 className="text-gray-800 mb-2 font-semibold">{club.name}</h3>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {club.description || 'Join us for amazing activities!'}
                  </p>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedClub(club.id)}
                      className="w-full mt-2 rounded-xl border-2 hover:bg-yellow-50 border-yellow-400 text-yellow-600"
                    >
                      Join Club
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Join Club Form Modal */}
      <AnimatePresence>
        {selectedClub && (
          <JoinClubForm 
            clubId={selectedClub}
            clubName={clubs.find(c => c.id === selectedClub)?.name || ''} 
            onClose={() => setSelectedClub(null)}
            onSuccess={loadClubs}
          />
        )}
      </AnimatePresence>
    </div>
  );
}