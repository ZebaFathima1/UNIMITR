import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Lock, TrendingUp, Target, Activity, Crown, Award, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
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

type Mood = 'energetic' | 'growing' | 'tired' | 'curious' | 'motivated';
type AvatarStyle = 'casual' | 'formal' | 'sporty' | 'creative' | 'tech';
type AvatarColor = 'purple' | 'pink' | 'cyan' | 'yellow' | 'gradient';

interface AvatarCustomization {
  style: AvatarStyle;
  color: AvatarColor;
  accessories: string[];
}

const moodData = {
  energetic: {
    icon: Activity,
    label: 'High Performance',
    color: 'from-amber-500 to-orange-600',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    description: 'Exceptional engagement across all activities',
    insight: 'Your activity levels demonstrate outstanding commitment to campus involvement.',
  },
  growing: {
    icon: TrendingUp,
    label: 'Progressive Growth',
    color: 'from-emerald-500 to-green-600',
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    description: 'Consistent volunteering participation',
    insight: 'Your community contributions reflect strong leadership potential.',
  },
  tired: {
    icon: Target,
    label: 'Re-engagement Phase',
    color: 'from-slate-400 to-gray-500',
    textColor: 'text-slate-700',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    description: 'Activity levels below baseline',
    insight: 'Consider exploring new opportunities to maximize your campus experience.',
  },
  curious: {
    icon: Zap,
    label: 'Knowledge Expansion',
    color: 'from-blue-500 to-indigo-600',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Active workshop and learning engagement',
    insight: 'Your commitment to continuous learning sets you apart.',
  },
  motivated: {
    icon: Crown,
    label: 'Peak Achievement',
    color: 'from-rose-500 to-pink-600',
    textColor: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    description: 'Superior challenge completion rate',
    insight: 'Your performance trajectory indicates exceptional dedication.',
  },
};

const avatarStyles = [
  { id: 'casual', name: 'Professional Casual', emoji: '👔', locked: false, description: 'Balanced professional appearance' },
  { id: 'formal', name: 'Executive Formal', emoji: '💼', locked: false, description: 'Business leadership presence' },
  { id: 'sporty', name: 'Athletic Professional', emoji: '⚡', locked: true, unlockPoints: 200, description: 'Dynamic and energetic' },
  { id: 'creative', name: 'Innovation Leader', emoji: '🎯', locked: true, unlockPoints: 300, description: 'Creative and forward-thinking' },
  { id: 'tech', name: 'Tech Executive', emoji: '💻', locked: true, unlockPoints: 400, description: 'Digital transformation expert' },
];

const colorOptions = [
  { id: 'purple', name: 'Royal Authority', gradient: 'from-purple-600 to-indigo-700' },
  { id: 'pink', name: 'Executive Prestige', gradient: 'from-rose-500 to-pink-600' },
  { id: 'cyan', name: 'Corporate Excellence', gradient: 'from-cyan-500 to-blue-700' },
  { id: 'yellow', name: 'Leadership Gold', gradient: 'from-amber-500 to-yellow-600' },
  { id: 'gradient', name: 'Premium Elite', gradient: 'from-purple-600 via-pink-600 to-cyan-600' },
];

const accessories = [
  { id: 'star', emoji: '⭐', name: 'Recognition Star', locked: false, category: 'Achievement' },
  { id: 'cert', emoji: '🎓', name: 'Academic Excellence', locked: true, unlockPoints: 150, category: 'Education' },
  { id: 'crown', emoji: '👑', name: 'Leadership Crown', locked: true, unlockPoints: 500, category: 'Leadership' },
  { id: 'trophy', emoji: '🏆', name: 'Championship Trophy', locked: false, category: 'Performance' },
];

export default function DigitalTwinScreen({ onBack, userName, userActivity }: DigitalTwinScreenProps) {
  const [currentMood, setCurrentMood] = useState<Mood>('energetic');
  const [avatar, setAvatar] = useState<AvatarCustomization>({
    style: 'casual',
    color: 'purple',
    accessories: ['star'],
  });
  const [userPoints, setUserPoints] = useState(450);
  const [growthLevel, setGrowthLevel] = useState(0);

  useEffect(() => {
    const calculateMood = () => {
      const daysSinceActive = Math.floor(
        (new Date().getTime() - userActivity.lastActive.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceActive > 7) return 'tired';
      if (userActivity.challengesCompleted > 3) return 'motivated';
      if (userActivity.workshopsCompleted > 2) return 'curious';
      if (userActivity.volunteeringHours > 5) return 'growing';
      return 'energetic';
    };

    setCurrentMood(calculateMood());
  }, [userActivity]);

  useEffect(() => {
    const totalActivity =
      userActivity.eventsAttended * 10 +
      userActivity.volunteeringHours * 15 +
      userActivity.workshopsCompleted * 12 +
      userActivity.challengesCompleted * 20;

    setGrowthLevel(Math.min(totalActivity, 100));
  }, [userActivity]);

  const mood = moodData[currentMood];
  const MoodIcon = mood.icon;

  const handleStyleChange = (styleId: AvatarStyle) => {
    const style = avatarStyles.find((s) => s.id === styleId);
    if (style?.locked && style.unlockPoints && userPoints < style.unlockPoints) {
      toast.error(`Requires ${style.unlockPoints} points to unlock`);
      return;
    }
    setAvatar({ ...avatar, style: styleId });
    toast.success('Profile updated successfully');
  };

  const handleColorChange = (colorId: AvatarColor) => {
    setAvatar({ ...avatar, color: colorId });
    toast.success('Theme updated');
  };

  const handleAccessoryToggle = (accessoryId: string) => {
    const accessory = accessories.find((a) => a.id === accessoryId);
    if (accessory?.locked && accessory.unlockPoints && userPoints < accessory.unlockPoints) {
      toast.error(`Requires ${accessory.unlockPoints} points to unlock`);
      return;
    }

    if (avatar.accessories.includes(accessoryId)) {
      setAvatar({
        ...avatar,
        accessories: avatar.accessories.filter((a) => a !== accessoryId),
      });
    } else {
      setAvatar({
        ...avatar,
        accessories: [...avatar.accessories, accessoryId],
      });
    }
  };

  const selectedColor = colorOptions.find((c) => c.id === avatar.color);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 pb-20">
      {/* Professional Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex-1">
              <h1 className="text-gray-900">Digital Twin Profile</h1>
              <p className="text-gray-500">AI-Powered Performance Analytics & Customization</p>
            </div>
            <Badge variant="secondary" className="gap-2 px-4 py-2">
              <Award className="w-4 h-4" />
              {userPoints} Points
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Avatar & Status */}
          <div className="lg:col-span-1 space-y-6">
            {/* Avatar Card */}
            <Card className="p-6 border-2">
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className={`w-40 h-40 mx-auto rounded-full bg-gradient-to-br ${selectedColor?.gradient} flex items-center justify-center shadow-xl relative mb-4`}
                >
                  <div className="text-6xl relative z-10">
                    {avatarStyles.find((s) => s.id === avatar.style)?.emoji}
                  </div>
                  {avatar.accessories.map((accId) => {
                    const acc = accessories.find((a) => a.id === accId);
                    return (
                      <div key={accId} className="absolute -top-2 -right-2 text-2xl">
                        {acc?.emoji}
                      </div>
                    );
                  })}
                </motion.div>
                <h2 className="text-gray-900 mb-1">{userName}</h2>
                <p className="text-gray-500">Digital Twin</p>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-gray-700">Events Attended</span>
                  <span className="text-purple-700">{userActivity.eventsAttended}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <span className="text-gray-700">Volunteer Hours</span>
                  <span className="text-emerald-700">{userActivity.volunteeringHours}h</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                  <span className="text-gray-700">Workshops</span>
                  <span className="text-cyan-700">{userActivity.workshopsCompleted}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
                  <span className="text-gray-700">Challenges</span>
                  <span className="text-rose-700">{userActivity.challengesCompleted}</span>
                </div>
              </div>
            </Card>

            {/* Performance Metrics */}
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Growth Trajectory
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-gray-700 mb-2">
                    <span>Overall Progress</span>
                    <span>{growthLevel}%</span>
                  </div>
                  <Progress value={growthLevel} className="h-2" />
                </div>
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {[
                    { level: 0, icon: '🌱', label: 'Starter' },
                    { level: 25, icon: '🌿', label: 'Active' },
                    { level: 60, icon: '🪴', label: 'Engaged' },
                    { level: 80, icon: '🌳', label: 'Leader' },
                  ].map((stage) => (
                    <div
                      key={stage.level}
                      className={`text-center p-2 rounded-lg transition-all ${
                        growthLevel >= stage.level
                          ? 'bg-emerald-100 border-2 border-emerald-300'
                          : 'bg-gray-50 border-2 border-gray-200'
                      }`}
                    >
                      <div className="text-2xl mb-1">{growthLevel >= stage.level ? stage.icon : '🔒'}</div>
                      <p className={`text-xs ${growthLevel >= stage.level ? 'text-emerald-700' : 'text-gray-400'}`}>
                        {stage.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Insights & Customization */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Insight */}
            <Card className={`p-6 border-2 ${mood.borderColor} ${mood.bgColor}`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-white shadow-sm`}>
                  <MoodIcon className={`w-8 h-8 ${mood.textColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`${mood.textColor} mb-1`}>{mood.label}</h3>
                  <p className="text-gray-600 mb-3">{mood.description}</p>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-gray-700">
                      <span className="font-semibold">AI Insight:</span> {mood.insight}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Customization Panel */}
            <Card className="p-6">
              <h3 className="text-gray-900 mb-6">Avatar Customization</h3>
              
              <Tabs defaultValue="appearance" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="theme">Theme</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>

                {/* Appearance Styles */}
                <TabsContent value="appearance" className="space-y-3">
                  {avatarStyles.map((style) => (
                    <motion.button
                      key={style.id}
                      onClick={() => handleStyleChange(style.id as AvatarStyle)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        avatar.style === style.id
                          ? 'border-purple-600 bg-purple-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      } ${style.locked ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">{style.emoji}</div>
                          <div>
                            <div className="text-gray-900 mb-1">{style.name}</div>
                            <p className="text-gray-500">{style.description}</p>
                          </div>
                        </div>
                        {style.locked ? (
                          <Badge variant="outline" className="gap-1 border-gray-300">
                            <Lock className="w-3 h-3" />
                            {style.unlockPoints}
                          </Badge>
                        ) : (
                          avatar.style === style.id && (
                            <Badge className="bg-purple-600">Active</Badge>
                          )
                        )}
                      </div>
                    </motion.button>
                  ))}
                </TabsContent>

                {/* Color Themes */}
                <TabsContent value="theme" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {colorOptions.map((color) => (
                      <motion.button
                        key={color.id}
                        onClick={() => handleColorChange(color.id as AvatarColor)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          avatar.color === color.id
                            ? 'border-purple-600 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-full h-24 rounded-lg bg-gradient-to-br ${color.gradient} mb-3`}></div>
                        <p className="text-gray-900">{color.name}</p>
                        {avatar.color === color.id && (
                          <Badge className="mt-2 bg-purple-600 w-full">Selected</Badge>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </TabsContent>

                {/* Achievements/Accessories */}
                <TabsContent value="achievements" className="space-y-3">
                  {accessories.map((acc) => (
                    <motion.button
                      key={acc.id}
                      onClick={() => handleAccessoryToggle(acc.id)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        avatar.accessories.includes(acc.id)
                          ? 'border-purple-600 bg-purple-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      } ${acc.locked ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">{acc.emoji}</div>
                          <div>
                            <div className="text-gray-900 mb-1">{acc.name}</div>
                            <p className="text-gray-500">{acc.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {avatar.accessories.includes(acc.id) && (
                            <Badge className="bg-emerald-600">Equipped</Badge>
                          )}
                          {acc.locked && (
                            <Badge variant="outline" className="gap-1 border-gray-300">
                              <Lock className="w-3 h-3" />
                              {acc.unlockPoints}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </TabsContent>
              </Tabs>
            </Card>

            {/* AI Motivation System */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-2">Intelligent Motivation System</h3>
                  <p className="text-gray-600 mb-4">
                    Your Digital Twin analyzes your activity patterns and provides personalized insights to optimize your campus experience.
                  </p>
                  <div className="space-y-2">
                    <div className="bg-white rounded-lg p-3 border border-purple-100">
                      <p className="text-gray-700">
                        <span className="text-purple-600">●</span> Real-time activity monitoring and trend analysis
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-purple-100">
                      <p className="text-gray-700">
                        <span className="text-purple-600">●</span> Personalized recommendations based on your profile
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-purple-100">
                      <p className="text-gray-700">
                        <span className="text-purple-600">●</span> Performance benchmarking and goal tracking
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
