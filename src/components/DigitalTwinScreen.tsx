import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, Award, Sparkles, User } from 'lucide-react';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface DigitalTwinScreenProps {
  onBack: () => void;
  userName: string;
  userActivity: {
    eventsAttended: number;
    volunteeringHours: number;
    workshopsCompleted: number;
    challengesCompleted: number;
    lastActive: Date;
  };
}

type Gender = 'male' | 'female';

const maleAvatars = [
  { id: 'male1', emoji: '👨', name: 'Classic' },
  { id: 'male2', emoji: '👨‍💼', name: 'Professional' },
  { id: 'male3', emoji: '👨‍🎓', name: 'Graduate' },
  { id: 'male4', emoji: '🧑', name: 'Young' },
  { id: 'male5', emoji: '👨‍💻', name: 'Tech' },
  { id: 'male6', emoji: '🧔', name: 'Bearded' },
];

const femaleAvatars = [
  { id: 'female1', emoji: '👩', name: 'Classic' },
  { id: 'female2', emoji: '👩‍💼', name: 'Professional' },
  { id: 'female3', emoji: '👩‍🎓', name: 'Graduate' },
  { id: 'female4', emoji: '🧕', name: 'Hijabi' },
  { id: 'female5', emoji: '👩‍💻', name: 'Tech' },
  { id: 'female6', emoji: '👧', name: 'Young' },
];

const backgrounds = [
  { id: 'purple', gradient: 'from-purple-400 to-pink-500', name: 'Purple' },
  { id: 'blue', gradient: 'from-cyan-400 to-blue-500', name: 'Ocean' },
  { id: 'green', gradient: 'from-green-400 to-emerald-500', name: 'Nature' },
  { id: 'sunset', gradient: 'from-orange-400 to-rose-500', name: 'Sunset' },
  { id: 'galaxy', gradient: 'from-indigo-500 via-purple-500 to-pink-500', name: 'Galaxy' },
  { id: 'white', gradient: 'from-gray-100 to-white', name: 'White' },
];

// Pre-define gradient classes for Tailwind to include them in the build
const gradientClasses: Record<string, string> = {
  'purple': 'bg-gradient-to-br from-purple-400 to-pink-500',
  'blue': 'bg-gradient-to-br from-cyan-400 to-blue-500',
  'green': 'bg-gradient-to-br from-green-400 to-emerald-500',
  'sunset': 'bg-gradient-to-br from-orange-400 to-rose-500',
  'galaxy': 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
  'white': 'bg-gradient-to-br from-gray-100 to-white border border-gray-200',
};

export default function DigitalTwinScreen({ onBack, userName, userActivity }: DigitalTwinScreenProps) {
  const [userPoints] = useState(450);
  const [growthLevel, setGrowthLevel] = useState(0);
  const [gender, setGender] = useState<Gender>('female');
  const [selectedAvatar, setSelectedAvatar] = useState('female1');
  const [selectedBgId, setSelectedBgId] = useState('purple');

  useEffect(() => {
    const savedData = localStorage.getItem('digitalTwinAvatar');
    if (savedData) {
      const data = JSON.parse(savedData);
      setGender(data.gender || 'female');
      setSelectedAvatar(data.avatar || 'female1');
      setSelectedBgId(data.background || 'purple');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('digitalTwinAvatar', JSON.stringify({ gender, avatar: selectedAvatar, background: selectedBgId }));
  }, [gender, selectedAvatar, selectedBgId]);

  useEffect(() => {
    const totalActivity = userActivity.eventsAttended * 10 + userActivity.volunteeringHours * 15 + userActivity.workshopsCompleted * 12 + userActivity.challengesCompleted * 20;
    setGrowthLevel(Math.min(totalActivity, 100));
  }, [userActivity]);

  const currentAvatars = gender === 'male' ? maleAvatars : femaleAvatars;
  const currentAvatarEmoji = currentAvatars.find(a => a.id === selectedAvatar)?.emoji || (gender === 'male' ? '👨' : '👩');
  const currentBg = backgrounds.find(b => b.id === selectedBgId);

  const handleGenderChange = (newGender: Gender) => {
    setGender(newGender);
    setSelectedAvatar(newGender === 'male' ? 'male1' : 'female1');
    toast.success(`Switched to ${newGender} avatar`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pb-24">
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 sticky top-0 z-20 px-4 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Digital Twin</h1>
              <p className="text-sm text-white/70">Your Avatar</p>
            </div>
          </div>
          <Badge className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 border border-white/30">
            <Award className="w-4 h-4 mr-1.5" /> {userPoints} pts
          </Badge>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 border border-purple-100 dark:border-slate-700">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`relative w-48 h-48 mx-auto rounded-3xl bg-gradient-to-br ${currentBg?.gradient} flex items-center justify-center shadow-2xl overflow-hidden`}>
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/40" />
              <div className="absolute bottom-6 right-4 w-6 h-6 rounded-full bg-white/30" />
            </div>
            <span className="relative z-10 drop-shadow-lg" style={{ fontSize: '140px', lineHeight: 1 }}>{currentAvatarEmoji}</span>
          </motion.div>
          <div className="text-center mt-5">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{userName}</h2>
            <p className="text-gray-500 text-sm mt-1">Your Digital Twin</p>
          </div>
          <div className="grid grid-cols-4 gap-3 mt-6">
            <div className="text-center p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg">
              <p className="text-xl font-bold text-white">{userActivity.eventsAttended}</p>
              <p className="text-xs text-white/80">Events</p>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
              <p className="text-xl font-bold text-white">{userActivity.volunteeringHours}h</p>
              <p className="text-xs text-white/80">Volunteer</p>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg">
              <p className="text-xl font-bold text-white">{userActivity.workshopsCompleted}</p>
              <p className="text-xs text-white/80">Workshops</p>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl shadow-lg">
              <p className="text-xl font-bold text-white">{userActivity.challengesCompleted}</p>
              <p className="text-xs text-white/80">Challenges</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 border border-purple-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl"><TrendingUp className="w-5 h-5 text-white" /></div>
              <h3 className="font-bold text-gray-800 dark:text-white">Growth Level</h3>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{growthLevel}%</span>
          </div>
          <div className="relative h-4 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden mb-6">
            <motion.div initial={{ width: 0 }} animate={{ width: `${growthLevel}%` }} transition={{ duration: 1 }} className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-full" />
          </div>
          <div className="flex justify-between">
            {['🌱 Start', '🌿 Active', '🪴 Engaged', '🌳 Leader'].map((stage, i) => (
              <div key={i} className={`text-center ${growthLevel >= i * 33 ? 'opacity-100' : 'opacity-40'}`}>
                <div className="text-2xl mb-1">{stage.split(' ')[0]}</div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{stage.split(' ')[1]}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 border border-purple-100 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl"><Sparkles className="w-5 h-5 text-white" /></div>
            <h3 className="font-bold text-gray-800 dark:text-white">Customize Avatar</h3>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-3">Select Gender</p>
            <div className="flex gap-3">
              <button onClick={() => handleGenderChange('male')} className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${gender === 'male' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-slate-600'}`}>
                <span className="text-4xl">👨</span>
                <span className={`text-sm font-medium ${gender === 'male' ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}>Male</span>
              </button>
              <button onClick={() => handleGenderChange('female')} className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${gender === 'female' ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/30' : 'border-gray-200 dark:border-slate-600'}`}>
                <span className="text-4xl">👩</span>
                <span className={`text-sm font-medium ${gender === 'female' ? 'text-pink-600' : 'text-gray-600 dark:text-gray-400'}`}>Female</span>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-3">Choose Avatar Style</p>
            <div className="grid grid-cols-3 gap-3">
              {currentAvatars.map((avatar) => (
                <button key={avatar.id} onClick={() => { setSelectedAvatar(avatar.id); toast.success('Avatar updated!'); }} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedAvatar === avatar.id ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30' : 'border-gray-200 dark:border-slate-600'}`}>
                  <span className="text-3xl">{avatar.emoji}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{avatar.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-3">Choose Background</p>
            <div className="grid grid-cols-3 gap-3">
              {backgrounds.map((bg) => (
                <button key={bg.id} onClick={() => { setSelectedBgId(bg.id); toast.success('Background updated!'); }} className={`p-2 rounded-xl border-2 transition-all ${selectedBgId === bg.id ? 'border-purple-500' : 'border-transparent'}`}>
                  <div className={`w-full h-14 rounded-lg ${gradientClasses[bg.id]}`} />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 text-center">{bg.name}</p>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl shadow-xl p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl"><User className="w-7 h-7 text-white" /></div>
              <div>
                <h3 className="font-bold text-white text-lg">Your Digital Identity</h3>
                <p className="text-sm text-white/80">Personalize your avatar</p>
              </div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <p className="text-gray-700 text-sm leading-relaxed"><span className="font-bold text-purple-600">Tip:</span> Your Digital Twin represents you across the campus platform. Choose an avatar that reflects your personality!</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
