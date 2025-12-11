import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Building2, MapPin, Calendar, Clock, TrendingUp, Users, Award, Filter, Search, Star, Bookmark, Share2, ChevronDown, Bell, X, CheckCircle2, Heart } from 'lucide-react';
import internshipLogo from '../assets/WhatsApp Image 2025-12-06 at 19.52.38_7e3c71fa.jpg';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

export default function PlacementsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sortBy, setSortBy] = useState('deadline');

  const placementDrives = [
    {
      id: 1,
      company: 'Tech Innovations Ltd',
      logo: '🏢',
      role: 'Software Development Engineer',
      type: 'Full-time',
      package: '₹12-15 LPA',
      location: 'Bangalore, Hybrid',
      deadline: '2025-01-15',
      eligibility: 'B.Tech CSE/IT, CGPA > 7.5',
      applicants: 245,
      status: 'Open',
      category: 'tech',
      description: 'Join our dynamic team to build scalable cloud solutions. Work with cutting-edge technologies including React, Node.js, and AWS.',
      skills: ['React', 'Node.js', 'AWS', 'MongoDB'],
      trending: true,
    },
    {
      id: 2,
      company: 'Global Analytics Corp',
      logo: '📊',
      role: 'Data Analyst',
      type: 'Full-time',
      package: '₹8-10 LPA',
      location: 'Pune, Remote',
      deadline: '2025-01-20',
      eligibility: 'All branches, CGPA > 7.0',
      applicants: 189,
      status: 'Open',
      category: 'analytics',
      description: 'Analyze complex datasets and drive business insights using advanced analytics and visualization tools.',
      skills: ['Python', 'SQL', 'Tableau', 'Excel'],
      trending: false,
    },
    {
      id: 3,
      company: 'Finance Pro Solutions',
      logo: '💼',
      role: 'Management Trainee',
      type: 'Full-time',
      package: '₹6-8 LPA',
      location: 'Mumbai, On-site',
      deadline: '2025-01-10',
      eligibility: 'MBA/BBA, CGPA > 6.5',
      applicants: 156,
      status: 'Open',
      category: 'management',
      description: 'Fast-track leadership program with rotational assignments across departments.',
      skills: ['Leadership', 'Strategy', 'Finance', 'Operations'],
      trending: true,
    },
    {
      id: 4,
      company: 'Creative Digital Agency',
      logo: '🎨',
      role: 'UI/UX Designer',
      type: 'Internship',
      package: '₹25k/month',
      location: 'Delhi, Hybrid',
      deadline: '2025-01-18',
      eligibility: 'Design background, Portfolio required',
      applicants: 98,
      status: 'Open',
      category: 'design',
      description: 'Create stunning user experiences for web and mobile applications. Work with a creative team on real client projects.',
      skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
      trending: false,
    },
    {
      id: 5,
      company: 'MegaCorp Industries',
      logo: '🏭',
      role: 'Operations Manager',
      type: 'Full-time',
      package: '₹10-12 LPA',
      location: 'Chennai, On-site',
      deadline: '2024-12-05',
      eligibility: 'B.Tech Mechanical, CGPA > 7.0',
      applicants: 312,
      status: 'Closed',
      category: 'operations',
      description: 'Oversee manufacturing operations and optimize production processes.',
      skills: ['Lean Six Sigma', 'Project Management', 'SAP', 'Quality Control'],
      trending: false,
    },
  ];

  const placementStats = [
    { label: 'Active Drives', value: '23', icon: Briefcase, color: 'from-purple-500 to-purple-600' },
    { label: 'Companies', value: '45+', icon: Building2, color: 'from-cyan-500 to-cyan-600' },
    { label: 'Avg Package', value: '₹9.5 LPA', icon: TrendingUp, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Placed Students', value: '450+', icon: Award, color: 'from-rose-500 to-rose-600' },
  ];

  const upcomingEvents = [
    { title: 'Amazon Campus Drive', date: 'Jan 12, 2025', time: '10:00 AM', type: 'Online Assessment' },
    { title: 'Microsoft Pre-Placement Talk', date: 'Jan 15, 2025', time: '2:00 PM', type: 'Virtual Session' },
    { title: 'Goldman Sachs Interview', date: 'Jan 18, 2025', time: '9:00 AM', type: 'Technical Round' },
  ];

  const notifications = [
    { id: 1, text: 'New placement drive: Amazon SDE', time: '2 hours ago', unread: true },
    { id: 2, text: 'Reminder: Microsoft PPT tomorrow', time: '5 hours ago', unread: true },
    { id: 3, text: 'Application deadline approaching', time: '1 day ago', unread: false },
  ];

  const handleSaveJob = (jobId: number) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
      toast.success('Removed from saved jobs');
    } else {
      setSavedJobs([...savedJobs, jobId]);
      toast.success('Job saved successfully!');
    }
  };

  const handleApply = (jobId: number, company: string) => {
    setAppliedJobs([...appliedJobs, jobId]);
    toast.success(`Applied to ${company} successfully!`, {
      description: 'Check your email for next steps',
    });
  };

  const handleShare = (company: string, role: string) => {
    toast.success('Link copied to clipboard!', {
      description: `${company} - ${role}`,
    });
  };

  const filteredDrives = placementDrives
    .filter(drive => activeFilter === 'all' || drive.category === activeFilter)
    .filter(drive => 
      searchQuery === '' || 
      drive.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 pb-24 pt-20">
      {/* Animated Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 sticky top-16 z-10 shadow-sm"
      >
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <motion.div
              initial={{ x: -20 }}
              animate={{ x: 0 }}
            >
              <h1 className="text-gray-900 mb-1 flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Briefcase className="w-7 h-7 text-purple-600" />
                </motion.div>
                Internships & Placements
              </h1>
              <p className="text-gray-500">Your gateway to career opportunities</p>
            </motion.div>

            {/* Notification Bell */}
            <motion.div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors"
              >
                <Bell className="w-6 h-6 text-purple-600" />
                {notifications.some(n => n.unread) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
                  />
                )}
              </motion.button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border-2 border-gray-100 overflow-hidden z-50"
                  >
                    <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-between">
                      <h3 className="font-semibold">Notifications</h3>
                      <button onClick={() => setShowNotifications(false)}>
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notif) => (
                        <motion.div
                          key={notif.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 border-b hover:bg-purple-50 cursor-pointer ${
                            notif.unread ? 'bg-purple-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {notif.unread && (
                              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                            )}
                            <div className="flex-1">
                              <p className="text-gray-800 text-sm">{notif.text}</p>
                              <p className="text-gray-500 text-xs mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Animated Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies, roles, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none transition-all"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Animated Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {placementStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="p-4 border-2 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br opacity-0 hover:opacity-10 transition-opacity"
                    style={{ background: `linear-gradient(135deg, ${stat.color})` }}
                  />
                  <motion.div 
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: idx }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <motion.div 
                    className="text-gray-900 text-2xl mb-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.1 + 0.2, type: 'spring' }}
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-gray-500">{stat.label}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="drives" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="drives">Placement Drives</TabsTrigger>
                <TabsTrigger value="internships">Internships</TabsTrigger>
                <TabsTrigger value="applied">
                  My Applications
                  {appliedJobs.length > 0 && (
                    <Badge className="ml-2 bg-purple-600">{appliedJobs.length}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="drives" className="space-y-4">
                {/* Animated Filters */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-2 overflow-x-auto pb-2"
                >
                  {[
                    { id: 'all', label: 'All', icon: '🎯' },
                    { id: 'tech', label: 'Tech', icon: '💻' },
                    { id: 'analytics', label: 'Analytics', icon: '📊' },
                    { id: 'management', label: 'Management', icon: '💼' },
                    { id: 'design', label: 'Design', icon: '🎨' },
                  ].map((filter) => (
                    <motion.div
                      key={filter.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={activeFilter === filter.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveFilter(filter.id)}
                        className={`${
                          activeFilter === filter.id 
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                            : ''
                        } transition-all`}
                      >
                        <span className="mr-1">{filter.icon}</span>
                        {filter.label}
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Placement Drives List with Enhanced Animations */}
                <AnimatePresence mode="popLayout">
                  {filteredDrives.map((drive, idx) => (
                    <motion.div
                      key={drive.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className={`p-5 border-2 hover:shadow-xl transition-all relative overflow-hidden ${
                        drive.status === 'Closed' ? 'opacity-60 bg-gray-50' : ''
                      }`}>
                        {/* Trending Badge */}
                        {drive.trending && drive.status === 'Open' && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="absolute top-3 right-3"
                          >
                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 gap-1">
                              <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                🔥
                              </motion.div>
                              Trending
                            </Badge>
                          </motion.div>
                        )}

                        <div className="flex items-start gap-4">
                          <motion.div 
                            className="text-5xl"
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            transition={{ type: 'spring' }}
                          >
                            {drive.logo}
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-gray-900 mb-1">{drive.role}</h3>
                                <p className="text-gray-600">{drive.company}</p>
                              </div>
                              <Badge className={drive.status === 'Open' ? 'bg-emerald-600' : 'bg-gray-500'}>
                                {drive.status}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap gap-3 mb-3">
                              <motion.div 
                                className="flex items-center gap-1 text-gray-600"
                                whileHover={{ scale: 1.05 }}
                              >
                                <MapPin className="w-4 h-4" />
                                <span>{drive.location}</span>
                              </motion.div>
                              <motion.div 
                                className="flex items-center gap-1 text-gray-600 font-semibold"
                                whileHover={{ scale: 1.05 }}
                              >
                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                                <span className="text-emerald-600">{drive.package}</span>
                              </motion.div>
                              <motion.div 
                                className="flex items-center gap-1 text-gray-600"
                                whileHover={{ scale: 1.05 }}
                              >
                                <Calendar className="w-4 h-4" />
                                <span>Apply by: {drive.deadline}</span>
                              </motion.div>
                            </div>

                            <motion.div 
                              className="bg-purple-50 rounded-lg p-3 mb-3"
                              whileHover={{ backgroundColor: '#f3e8ff' }}
                            >
                              <p className="text-gray-700">
                                <span className="font-semibold">Eligibility:</span> {drive.eligibility}
                              </p>
                            </motion.div>

                            {/* Skills Tags */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {drive.skills.map((skill, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: idx * 0.1 + i * 0.05 }}
                                  whileHover={{ scale: 1.1 }}
                                >
                                  <Badge variant="outline" className="bg-white">
                                    {skill}
                                  </Badge>
                                </motion.div>
                              ))}
                            </div>

                            {/* Expandable Description */}
                            <AnimatePresence>
                              {expandedCard === drive.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mb-3 overflow-hidden"
                                >
                                  <div className="bg-gradient-to-r from-cyan-50 to-purple-50 rounded-lg p-4 border border-purple-100">
                                    <p className="text-gray-700">{drive.description}</p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-gray-500">
                                  <Users className="w-4 h-4" />
                                  <span>{drive.applicants} applicants</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                  <motion.button
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleSaveJob(drive.id)}
                                    className={`p-2 rounded-full transition-colors ${
                                      savedJobs.includes(drive.id)
                                        ? 'bg-yellow-100 text-yellow-600'
                                        : 'bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600'
                                    }`}
                                  >
                                    <Bookmark className={`w-4 h-4 ${savedJobs.includes(drive.id) ? 'fill-current' : ''}`} />
                                  </motion.button>

                                  <motion.button
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleShare(drive.company, drive.role)}
                                    className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                  >
                                    <Share2 className="w-4 h-4" />
                                  </motion.button>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setExpandedCard(expandedCard === drive.id ? null : drive.id)}
                                  className="text-purple-600 hover:text-purple-700 text-sm font-semibold flex items-center gap-1"
                                >
                                  {expandedCard === drive.id ? 'Less' : 'More'}
                                  <motion.div
                                    animate={{ rotate: expandedCard === drive.id ? 180 : 0 }}
                                  >
                                    <ChevronDown className="w-4 h-4" />
                                  </motion.div>
                                </motion.button>

                                {appliedJobs.includes(drive.id) ? (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="flex items-center gap-1 px-4 py-2 rounded-lg bg-green-100 text-green-700"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Applied</span>
                                  </motion.div>
                                ) : (
                                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button 
                                      className={`${
                                        drive.status === 'Open' 
                                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                                          : 'bg-gray-400'
                                      } transition-all`}
                                      disabled={drive.status === 'Closed'}
                                      onClick={() => handleApply(drive.id, drive.company)}
                                    >
                                      {drive.status === 'Open' ? 'Apply Now' : 'Closed'}
                                    </Button>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* No Results */}
                {filteredDrives.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className="p-12 text-center border-2 border-dashed">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-gray-900 mb-2">No Results Found</h3>
                      <p className="text-gray-500">Try adjusting your search or filters</p>
                    </Card>
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="internships">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-8 text-center border-2 border-dashed">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <motion.img
                        src={internshipLogo}
                        alt="Internship Logo"
                        className="w-24 h-24 object-contain mx-auto mb-3 rounded-lg shadow-lg"
                        animate={{ boxShadow: ['0 8px 30px rgba(99,102,241,0.12)', '0 8px 30px rgba(236,72,153,0.08)'] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    </motion.div>
                    <h3 className="text-gray-900 mb-2">Internship Opportunities Coming Soon</h3>
                    <p className="text-gray-500">Check back later for exciting internship openings</p>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="applied">
                {appliedJobs.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="p-8 text-center border-2 border-dashed">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      </motion.div>
                      <h3 className="text-gray-900 mb-2">No Applications Yet</h3>
                      <p className="text-gray-500">Apply to placement drives to track your applications here</p>
                    </Card>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {placementDrives
                      .filter(drive => appliedJobs.includes(drive.id))
                      .map((drive, idx) => (
                        <motion.div
                          key={drive.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <Card className="p-5 border-2 border-green-200 bg-green-50/30">
                            <div className="flex items-center gap-4">
                              <div className="text-4xl">{drive.logo}</div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                                  <h3 className="text-gray-900">{drive.role}</h3>
                                </div>
                                <p className="text-gray-600">{drive.company}</p>
                                <Badge className="mt-2 bg-green-600">Application Submitted</Badge>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Animated Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-5 border-2 overflow-hidden">
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Upcoming Events
                </h3>
                <div className="space-y-3">
                  {upcomingEvents.map((event, idx) => (
                    <motion.div 
                      key={idx} 
                      className="p-3 bg-purple-50 rounded-lg border border-purple-100 cursor-pointer"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02, backgroundColor: '#f3e8ff' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <h4 className="text-gray-900 mb-1">{event.title}</h4>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Calendar className="w-3 h-3" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{event.time}</span>
                      </div>
                      <Badge variant="outline" className="mt-2 text-xs border-purple-300">
                        {event.type}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Quick Resources */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-5 border-2">
                <h3 className="text-gray-900 mb-4">Quick Resources</h3>
                <div className="space-y-2">
                  {[
                    { icon: '📄', label: 'Resume Templates' },
                    { icon: '💡', label: 'Interview Tips' },
                    { icon: '📚', label: 'Aptitude Practice' },
                    { icon: '🎯', label: 'Coding Challenges' },
                  ].map((resource, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <span className="mr-2">{resource.icon}</span>
                        {resource.label}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Saved Jobs Count */}
            {savedJobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="p-5 border-2 bg-gradient-to-br from-yellow-50 to-orange-50">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Bookmark className="w-8 h-8 text-orange-600 fill-current" />
                    </motion.div>
                    <div>
                      <p className="text-2xl font-semibold text-gray-900">{savedJobs.length}</p>
                      <p className="text-gray-600 text-sm">Saved Jobs</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}