import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Users, 
  Calendar, 
  Heart, 
  Wrench,
  RefreshCw,
  Search,
  FileText
} from 'lucide-react';
import {
  getMyClubRequests,
  getMyEventRegistrations,
  getMyVolunteeringApplications,
  getMyWorkshopRegistrations,
  ClubJoinRequest,
  EventRegistration,
  VolunteeringApplication,
  WorkshopRegistration
} from '../lib/api';

interface MyApplicationsPageProps {
  onBack: () => void;
}

type TabType = 'clubs' | 'events' | 'volunteering' | 'workshops';

const MyApplicationsPage: React.FC<MyApplicationsPageProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [searchedEmail, setSearchedEmail] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('clubs');
  const [loading, setLoading] = useState(false);
  
  const [clubRequests, setClubRequests] = useState<ClubJoinRequest[]>([]);
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
  const [volunteeringApps, setVolunteeringApps] = useState<VolunteeringApplication[]>([]);
  const [workshopRegs, setWorkshopRegs] = useState<WorkshopRegistration[]>([]);

  const fetchAllApplications = async (userEmail: string) => {
    if (!userEmail) return;
    
    setLoading(true);
    setSearchedEmail(userEmail);
    
    try {
      const [clubs, events, volunteering, workshops] = await Promise.all([
        getMyClubRequests(userEmail).catch(() => []),
        getMyEventRegistrations(userEmail).catch(() => []),
        getMyVolunteeringApplications(userEmail).catch(() => []),
        getMyWorkshopRegistrations(userEmail).catch(() => [])
      ]);
      
      setClubRequests(clubs);
      setEventRegistrations(events);
      setVolunteeringApps(volunteering);
      setWorkshopRegs(workshops);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAllApplications(email);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'attended':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm";
    switch (status) {
      case 'approved':
        return <span className={`${baseClasses} bg-gradient-to-r from-green-400 to-emerald-500 text-white`}>{getStatusIcon(status)} Approved</span>;
      case 'attended':
        return <span className={`${baseClasses} bg-gradient-to-r from-blue-400 to-cyan-500 text-white`}>{getStatusIcon(status)} Attended</span>;
      case 'rejected':
        return <span className={`${baseClasses} bg-gradient-to-r from-red-400 to-rose-500 text-white`}>{getStatusIcon(status)} Rejected</span>;
      default:
        return <span className={`${baseClasses} bg-gradient-to-r from-amber-400 to-orange-500 text-white`}>{getStatusIcon(status)} Pending</span>;
    }
  };

  const tabs = [
    { id: 'clubs' as TabType, label: 'Clubs', icon: Users, count: clubRequests.length, color: 'from-pink-500 to-rose-500' },
    { id: 'events' as TabType, label: 'Events', icon: Calendar, count: eventRegistrations.length, color: 'from-cyan-500 to-blue-500' },
    { id: 'volunteering' as TabType, label: 'Volunteering', icon: Heart, count: volunteeringApps.length, color: 'from-purple-500 to-indigo-500' },
    { id: 'workshops' as TabType, label: 'Workshops', icon: Wrench, count: workshopRegs.length, color: 'from-amber-500 to-orange-500' },
  ];

  const renderApplicationCard = (app: any, type: string) => (
    <motion.div
      key={`${type}-${app.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-slate-700 mb-4 hover:shadow-xl transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 dark:text-white text-lg">{app.fullName}</h3>
          <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">ID: {app.studentId}</p>
        </div>
        {getStatusBadge(app.status)}
      </div>
      
      {app.reason && (
        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-3 mb-3">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold text-purple-600 dark:text-purple-400">Reason:</span> {app.reason}
          </p>
        </div>
      )}
      {app.motivation && (
        <div className="bg-pink-50 dark:bg-pink-900/30 rounded-xl p-3 mb-3">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold text-pink-600 dark:text-pink-400">Motivation:</span> {app.motivation}
          </p>
        </div>
      )}
      {app.expectations && (
        <div className="bg-cyan-50 dark:bg-cyan-900/30 rounded-xl p-3 mb-3">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold text-cyan-600 dark:text-cyan-400">Expectations:</span> {app.expectations}
          </p>
        </div>
      )}
      
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(app.created_at).toLocaleDateString()}
        </span>
        <span className="text-purple-500 dark:text-purple-400">{app.email}</span>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    if (!searchedEmail) {
      return (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-purple-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Enter your email above to view applications</p>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="flex flex-col justify-center items-center py-16">
          <RefreshCw className="w-12 h-12 text-purple-500 animate-spin mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading your applications...</p>
        </div>
      );
    }

    let items: any[] = [];
    let type = '';
    
    switch (activeTab) {
      case 'clubs':
        items = clubRequests;
        type = 'club';
        break;
      case 'events':
        items = eventRegistrations;
        type = 'event';
        break;
      case 'volunteering':
        items = volunteeringApps;
        type = 'volunteering';
        break;
      case 'workshops':
        items = workshopRegs;
        type = 'workshop';
        break;
    }

    if (items.length === 0) {
      const currentTab = tabs.find(t => t.id === activeTab);
      return (
        <div className="text-center py-16">
          <div className={`w-20 h-20 bg-gradient-to-br ${currentTab?.color} rounded-full flex items-center justify-center mx-auto mb-4 opacity-50`}>
            {React.createElement(currentTab?.icon || Users, { className: "w-10 h-10 text-white" })}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">No {activeTab} applications found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">for {searchedEmail}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {items.map(item => renderApplicationCard(item, type))}
      </div>
    );
  };

  const totalApplications = clubRequests.length + eventRegistrations.length + volunteeringApps.length + workshopRegs.length;
  const approvedCount = [
    ...clubRequests.filter(r => r.status === 'approved'),
    ...eventRegistrations.filter(r => r.status === 'approved'),
    ...volunteeringApps.filter(r => r.status === 'approved'),
    ...workshopRegs.filter(r => r.status === 'approved' || r.status === 'attended')
  ].length;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 overflow-y-auto">
      {/* Header with Search */}
      <div className="sticky top-0 z-10 px-4 pt-4 pb-6">
        {/* Back Button & Title */}
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={onBack}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-colors backdrop-blur-sm"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">My Applications</h1>
            <p className="text-white/70 text-sm">Track your application status</p>
          </div>
        </div>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="email"
              placeholder="Enter your email to search..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-28 py-4 rounded-2xl bg-white/95 dark:bg-slate-800 text-gray-800 dark:text-white placeholder-gray-400 border-0 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-xl text-base"
              required
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-24">
        {/* Stats Cards */}
        {searchedEmail && !loading && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/95 dark:bg-slate-800 rounded-2xl p-5 shadow-xl"
            >
              <p className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{totalApplications}</p>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Total Applications</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/95 dark:bg-slate-800 rounded-2xl p-5 shadow-xl"
            >
              <p className="text-4xl font-black bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">{approvedCount}</p>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Approved</p>
            </motion.div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white/95 dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-4 border-b border-gray-100 dark:border-slate-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-2 py-4 text-center transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30'
                    : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <div className={`w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center ${
                  activeTab === tab.id 
                    ? `bg-gradient-to-br ${tab.color} shadow-lg` 
                    : 'bg-gray-100 dark:bg-slate-700'
                }`}>
                  <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                </div>
                <span className={`text-xs font-bold ${
                  activeTab === tab.id ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'
                }`}>{tab.label}</span>
                {searchedEmail && tab.count > 0 && (
                  <span className={`absolute top-2 right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                      : 'bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {/* Content */}
          <div className="p-4 max-h-[50vh] overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      {searchedEmail && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => fetchAllApplications(searchedEmail)}
          disabled={loading}
          className="fixed bottom-8 right-6 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-2xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
        </motion.button>
      )}
    </div>
  );
};

export default MyApplicationsPage;
