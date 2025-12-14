import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Award, Crown, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';

interface LeaderboardEntry {
  id: number;
  rank: number;
  name: string;
  university?: string;
  points: number;
  avatar: string;
  emoji: string;
  isUniversity?: boolean;
}

interface LeaderboardScreenProps {
  onBack: () => void;
}

export default function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const [activeTab, setActiveTab] = useState('global');
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [universityLeaderboard, setUniversityLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [friendsLeaderboard, setFriendsLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const confettiColors = ['#F33A6A', '#00B7EB', '#FFC107', '#8B5CF6'];

  useEffect(() => {
    // Fetch all three categories
    const fetchLeaderboards = async () => {
      setLoading(true);
      try {
        const [globalRes, universityRes, friendsRes] = await Promise.all([
          fetch('/api/auth/leaderboard/?category=global'),
          fetch('/api/auth/leaderboard/?category=university'),
          fetch('/api/auth/leaderboard/?category=friends'),
        ]);
        
        const globalData = await globalRes.json();
        const universityData = await universityRes.json();
        const friendsData = await friendsRes.json();
        
        setGlobalLeaderboard(globalData);
        setUniversityLeaderboard(universityData);
        setFriendsLeaderboard(friendsData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboards();
  }, []);

  const getLeaderboardData = () => {
    switch (activeTab) {
      case 'global':
        return globalLeaderboard;
      case 'university':
        return universityLeaderboard;
      case 'friends':
        return friendsLeaderboard;
      default:
        return globalLeaderboard;
    }
  };

  const getRankIcon = (rank: number, emoji: string) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return emoji || '⭐';
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Trophy className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-orange-600" />;
    return null;
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

      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-pink-500 rounded-3xl p-6 mb-6 text-white relative overflow-hidden shadow-lg">
        {/* Confetti for top 3 */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: confettiColors[i % confettiColors.length],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 20 - 10],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              delay: i * 0.2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        ))}
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-8 h-8" />
            <h1>Leaderboard</h1>
          </div>
          <p className="text-white/90">Top performers this month</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-white rounded-2xl shadow-md p-1">
          <TabsTrigger 
            value="global" 
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white"
          >
            Global
          </TabsTrigger>
          <TabsTrigger 
            value="university"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            University
          </TabsTrigger>
          <TabsTrigger 
            value="friends"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
          >
            Friends
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0 space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : getLeaderboardData().length === 0 ? (
            <div className="text-center py-8 text-gray-500">No leaderboard entries yet</div>
          ) : (
            getLeaderboardData().map((user, idx) => (
            <motion.div
              key={user.id || user.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-all ${
                user.rank <= 3 ? 'border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-white' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Rank Badge */}
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                    user.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                    user.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                    user.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {user.rank <= 3 ? getRankIcon(user.rank, user.emoji) : `#${user.rank}`}
                  </div>
                </div>

                {/* Avatar */}
                <Avatar className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500">
                  <AvatarFallback className="text-white">{user.avatar}</AvatarFallback>
                </Avatar>

                {/* User Info */}
                <div className="flex-1">
                  <h4 className="text-gray-800">{user.name}</h4>
                  {user.university && !user.isUniversity && (
                    <p className="text-gray-500 text-sm">{user.university}</p>
                  )}
                  <div className="flex items-center gap-1 text-purple-600">
                    <Star className="w-4 h-4 fill-purple-600" />
                    <span>{user.points} points</span>
                  </div>
                </div>

                {/* Badge for top 3 */}
                {user.rank <= 3 && getRankBadge(user.rank)}
              </div>
            </motion.div>
          ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}