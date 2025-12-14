import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Trash2, Calendar, Award, Users, Heart,
  Edit, X, Save, RefreshCw, ChevronLeft, ChevronRight,
  LayoutDashboard, UserCircle, LogOut, Eye, CheckCircle, XCircle, Trophy, Brain
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import api from '../lib/api';
import { toast } from 'sonner';
import { 
  listClubRequests, approveClubRequest, rejectClubRequest,
  listEventRegistrations, approveEventRegistration, rejectEventRegistration,
  listWorkshopRegistrations, approveWorkshopRegistration, rejectWorkshopRegistration,
  listVolunteeringApplications, approveVolunteeringApplication, rejectVolunteeringApplication
} from '../lib/api';

import type { Screen } from '../types';

interface AdminDashboardProps {
  onNavigate: (screen: Screen) => void;
  onLogout?: () => void;
}

type TabType = 'overview' | 'events' | 'clubs' | 'workshops' | 'volunteering' | 'users' | 'leaderboard' | 'mentalhealth';

export default function AdminDashboard({ onNavigate, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  // Data states
  const [events, setEvents] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [volunteering, setVolunteering] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [counsellors, setCounsellors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  
  // Applications modal state
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [applicationsList, setApplicationsList] = useState<any[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [selectedItemForApps, setSelectedItemForApps] = useState<{id: number, name: string, type: TabType} | null>(null);

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [eventsRes, clubsRes, workshopsRes, volunteeringRes, usersRes, leaderboardRes, counsellorsRes, appointmentsRes] = await Promise.all([
        api.get('/events/').catch(() => ({ data: [] })),
        api.get('/clubs/').catch(() => ({ data: [] })),
        api.get('/workshops/').catch(() => ({ data: [] })),
        api.get('/volunteering/').catch(() => ({ data: [] })),
        api.get('/auth/all-users/').catch(() => ({ data: [] })), // Use all-users for full profile info
        api.get('/auth/leaderboard/?category=all').catch(() => ({ data: [] })), // Get all leaderboard entries
        api.get('/mental-health/counsellors/').catch(() => ({ data: [] })), // Mental health counsellors
        api.get('/mental-health/appointments/?all=true').catch(() => ({ data: [] })), // All appointments for admin
      ]);
      setEvents(eventsRes.data || []);
      setClubs(clubsRes.data || []);
      setWorkshops(workshopsRes.data || []);
      setVolunteering(volunteeringRes.data || []);
      setUsers(usersRes.data || []);
      setLeaderboard(leaderboardRes.data || []);
      setCounsellors(counsellorsRes.data || []);
      setAppointments(appointmentsRes.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Total Events', value: events.length, icon: Calendar, color: 'from-pink-500 to-rose-500', tab: 'events' as TabType },
    { label: 'Active Clubs', value: clubs.length, icon: Users, color: 'from-cyan-500 to-blue-500', tab: 'clubs' as TabType },
    { label: 'Workshops', value: workshops.length, icon: Award, color: 'from-yellow-500 to-orange-500', tab: 'workshops' as TabType },
    { label: 'Volunteering', value: volunteering.length, icon: Heart, color: 'from-purple-500 to-pink-500', tab: 'volunteering' as TabType },
    { label: 'Total Users', value: users.length, icon: UserCircle, color: 'from-green-500 to-teal-500', tab: 'users' as TabType },
  ];

  const sidebarItems = [
    { id: 'overview' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'events' as TabType, label: 'Events', icon: Calendar },
    { id: 'clubs' as TabType, label: 'Clubs', icon: Users },
    { id: 'workshops' as TabType, label: 'Workshops', icon: Award },
    { id: 'volunteering' as TabType, label: 'Volunteering', icon: Heart },
    { id: 'mentalhealth' as TabType, label: 'Mental Health', icon: Brain },
    { id: 'users' as TabType, label: 'Users', icon: UserCircle },
    { id: 'leaderboard' as TabType, label: 'Leaderboard', icon: Trophy },
  ];

  // CRUD Operations
  const handleCreate = (type: TabType) => {
    setModalMode('create');
    setEditingItem(null);
    setFormData(getDefaultFormData(type));
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setModalMode('edit');
    setEditingItem(item);
    setFormData({ ...item });
    setShowModal(true);
  };

  const handleDelete = async (id: number, type: TabType) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const endpoint = getEndpoint(type);
      await api.delete(`${endpoint}${id}/`);
      toast.success('Deleted successfully!');
      fetchAllData();
    } catch (error) {
      toast.error('Failed to delete');
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const endpoint = getEndpoint(activeTab);
      
      if (modalMode === 'create') {
        await api.post(endpoint, formData);
        toast.success('Created successfully!');
      } else {
        await api.put(`${endpoint}${editingItem.id}/`, formData);
        toast.success('Updated successfully!');
      }
      
      setShowModal(false);
      fetchAllData();
    } catch (error: any) {
      const errorMsg = error.response?.data 
        ? JSON.stringify(error.response.data) 
        : 'Operation failed';
      toast.error(errorMsg);
      console.error('Submit error:', error.response?.data || error);
    }
  };

  const getEndpoint = (type: TabType): string => {
    switch (type) {
      case 'events': return '/events/';
      case 'clubs': return '/clubs/';
      case 'workshops': return '/workshops/';
      case 'volunteering': return '/volunteering/';
      case 'users': return '/auth/users/';
      case 'leaderboard': return '/auth/leaderboard/';
      case 'mentalhealth': return '/mental-health/counsellors/';
      default: return '/';
    }
  };

  const getDefaultFormData = (type: TabType): any => {
    switch (type) {
      case 'events':
        return { title: '', description: '', date: '', time: '10:00', location: '', category: 'academic', status: 'approved' };
      case 'clubs':
        return { name: '', description: '' };
      case 'workshops':
        return { title: '', description: '', instructor: '', date: '', time: '10:00', location: '', category: 'technical', durationHours: 2, maxParticipants: 50, mode: 'offline', status: 'approved' };
      case 'volunteering':
        return { title: '', description: '', organization: '', location: '', date: '', time: '09:00', durationHours: 4, requiredVolunteers: 10, category: 'community', status: 'approved' };
      case 'leaderboard':
        return { name: '', university: '', points: 0, avatar: '', emoji: '⭐', category: 'global', is_university_entry: false };
      case 'mentalhealth':
        return { name: '', specialization: 'Anxiety & Stress', bio: '', rating: 4.5, is_available: true };
      default:
        return {};
    }
  };

  // View applications for an item
  const handleViewApplications = async (item: any, type: TabType) => {
    setApplicationsLoading(true);
    setSelectedItemForApps({ id: item.id, name: item.title || item.name, type });
    setShowApplicationsModal(true);
    
    try {
      let apps: any[] = [];
      switch (type) {
        case 'clubs':
          apps = await listClubRequests(item.id);
          break;
        case 'events':
          apps = await listEventRegistrations(item.id);
          break;
        case 'workshops':
          apps = await listWorkshopRegistrations(item.id);
          break;
        case 'volunteering':
          apps = await listVolunteeringApplications(item.id);
          break;
      }
      setApplicationsList(apps || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      toast.error('Failed to load applications');
      setApplicationsList([]);
    } finally {
      setApplicationsLoading(false);
    }
  };

  // Approve/Reject applications
  const handleApproveApplication = async (appId: number) => {
    if (!selectedItemForApps) return;
    try {
      switch (selectedItemForApps.type) {
        case 'clubs':
          await approveClubRequest(selectedItemForApps.id, appId);
          break;
        case 'events':
          await approveEventRegistration(selectedItemForApps.id, appId);
          break;
        case 'workshops':
          await approveWorkshopRegistration(selectedItemForApps.id, appId);
          break;
        case 'volunteering':
          await approveVolunteeringApplication(selectedItemForApps.id, appId);
          break;
      }
      toast.success('Application approved!');
      // Refresh applications list
      handleViewApplications({ id: selectedItemForApps.id, title: selectedItemForApps.name, name: selectedItemForApps.name }, selectedItemForApps.type);
    } catch (error) {
      toast.error('Failed to approve');
    }
  };

  const handleRejectApplication = async (appId: number) => {
    if (!selectedItemForApps) return;
    try {
      switch (selectedItemForApps.type) {
        case 'clubs':
          await rejectClubRequest(selectedItemForApps.id, appId);
          break;
        case 'events':
          await rejectEventRegistration(selectedItemForApps.id, appId);
          break;
        case 'workshops':
          await rejectWorkshopRegistration(selectedItemForApps.id, appId);
          break;
        case 'volunteering':
          await rejectVolunteeringApplication(selectedItemForApps.id, appId);
          break;
      }
      toast.success('Application rejected');
      // Refresh applications list
      handleViewApplications({ id: selectedItemForApps.id, title: selectedItemForApps.name, name: selectedItemForApps.name }, selectedItemForApps.type);
    } catch (error) {
      toast.error('Failed to reject');
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setActiveTab(stat.tab)}
            className="cursor-pointer"
          >
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all dark:bg-slate-800">
              <div className={`h-2 bg-gradient-to-r ${stat.color}`} />
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 mb-1 text-sm">{stat.label}</p>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</h2>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <Card className="dark:bg-slate-800 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-pink-500" />
              Recent Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events.slice(0, 5).map((event, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">{event.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{event.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    event.status === 'approved' ? 'bg-green-100 text-green-700' :
                    event.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {event.status}
                  </span>
                </div>
              ))}
              {events.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No events yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Clubs */}
        <Card className="dark:bg-slate-800 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-500" />
              Recent Clubs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clubs.slice(0, 5).map((club, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">{club.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{club.description?.slice(0, 50)}...</p>
                  </div>
                </div>
              ))}
              {clubs.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No clubs yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card className="dark:bg-slate-800 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 dark:text-white flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-green-500" />
            Recent Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 dark:text-gray-400 border-b dark:border-slate-700">
                  <th className="pb-2">User</th>
                  <th className="pb-2">Email</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2">Last Login</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map((user, idx) => (
                  <tr key={idx} className="border-b dark:border-slate-700 last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {(user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {user.first_name || user.username || 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-600 dark:text-gray-300">{user.email || '-'}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.is_staff ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.is_staff ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-600 dark:text-gray-300">
                      {user.last_login ? new Date(user.last_login).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      }) : 'Never'}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-500 dark:text-gray-400">No users yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDataTable = (data: any[], type: TabType, columns: { key: string; label: string }[]) => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white capitalize">{type} Management</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchAllData}
            className="dark:border-slate-600"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          {type !== 'users' && (
            <Button 
              onClick={() => handleCreate(type)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
              {data.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                      {col.key === 'status' ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item[col.key] === 'approved' || item[col.key] === 'active' ? 'bg-green-100 text-green-700' :
                          item[col.key] === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          item[col.key] === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {item[col.key]}
                        </span>
                      ) : col.key === 'is_staff' ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item[col.key] ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item[col.key] ? 'Admin' : 'User'}
                        </span>
                      ) : col.key === 'last_login' || col.key === 'date_joined' ? (
                        item[col.key] ? new Date(item[col.key]).toLocaleDateString('en-US', { 
                          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                        }) : 'Never'
                      ) : (
                        String(item[col.key] || '-').slice(0, 50)
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {type !== 'users' && (
                        <>
                          {/* View Applications Button */}
                          <button
                            onClick={() => handleViewApplications(item, type)}
                            className="p-1.5 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                            title="View Applications"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, type)}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No data found. Click "Add New" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Enhanced Users Table with full profile details
  const renderUsersTable = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Registered Users</h2>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total: <span className="font-semibold text-purple-600">{users.length}</span> users
          </span>
          <Button 
            variant="outline" 
            onClick={fetchAllData}
            className="dark:border-slate-600"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Enhanced Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium">College</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Branch</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Roll No</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Password</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Joined</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Last Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
              {users.map((user, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  {/* User Avatar & Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {(user.name?.[0] || user.username?.[0] || 'U').toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{user.name || user.username}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  
                  {/* Email */}
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                    {user.email || '-'}
                  </td>
                  
                  {/* College */}
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                    {user.profile?.collegeName || '-'}
                  </td>
                  
                  {/* Branch */}
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                    {user.profile?.branch || '-'}
                  </td>
                  
                  {/* Roll Number */}
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                    {user.profile?.rollNumber || '-'}
                  </td>
                  
                  {/* Phone */}
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                    {user.profile?.phone || '-'}
                  </td>
                  
                  {/* Role */}
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isStaff ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.isStaff ? 'Admin' : 'Student'}
                    </span>
                  </td>
                  
                  {/* Password Status */}
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.hasPassword ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.hasPassword ? '✓ Set' : '✗ Not Set'}
                    </span>
                  </td>
                  
                  {/* Date Joined */}
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {user.dateJoined ? new Date(user.dateJoined).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    }) : '-'}
                  </td>
                  
                  {/* Last Login */}
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    }) : 'Never'}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No registered users yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Leaderboard Table
  const renderLeaderboardTable = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">🏆 Leaderboard Management</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchAllData}
            className="dark:border-slate-600"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={() => handleCreate('leaderboard')}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Rank</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium">University</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Points</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Avatar</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Emoji</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
              {leaderboard.map((entry, idx) => (
                <tr key={entry.id || idx} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <td className="px-4 py-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      entry.rank === 1 ? 'bg-yellow-500' :
                      entry.rank === 2 ? 'bg-gray-400' :
                      entry.rank === 3 ? 'bg-orange-500' :
                      'bg-purple-500'
                    }`}>
                      {entry.rank || idx + 1}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">
                    {entry.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      entry.category === 'global' ? 'bg-pink-100 text-pink-700' :
                      entry.category === 'university' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {entry.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {entry.university || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-purple-600">{entry.points}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {entry.avatar || entry.name?.substring(0, 2).toUpperCase()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-2xl">
                    {entry.emoji || '⭐'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setActiveTab('leaderboard');
                          handleEdit(entry);
                        }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(entry.id, 'leaderboard')}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {leaderboard.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No leaderboard entries yet. Click "Add Entry" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Mental Health Management Table
  const renderMentalHealthTable = () => (
    <div className="space-y-8">
      {/* Counsellors Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mental Health - Counsellors</h2>
          <Button
            onClick={() => handleCreate('mentalhealth')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Counsellor
          </Button>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Avatar</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Specialization</th>
                  <th className="px-4 py-3 text-left">Rating</th>
                  <th className="px-4 py-3 text-left">Bio</th>
                  <th className="px-4 py-3 text-left">Available</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {counsellors.map((counsellor, index) => (
                  <tr key={counsellor.id || index} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                        {counsellor.avatar || counsellor.name?.substring(0, 2).toUpperCase() || '??'}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{counsellor.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{counsellor.specialization}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-yellow-500">
                        ⭐ {counsellor.rating || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 max-w-xs truncate">{counsellor.bio || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        counsellor.is_available !== false 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {counsellor.is_available !== false ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setActiveTab('mentalhealth');
                            handleEdit(counsellor);
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(counsellor.id, 'mentalhealth')}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {counsellors.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No counsellors yet. Click "Add Counsellor" to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Appointments/Bookings Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📅 Counselling Bookings</h2>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            {appointments.length} Total Bookings
          </span>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Student Email</th>
                  <th className="px-4 py-3 text-left">Counsellor</th>
                  <th className="px-4 py-3 text-left">Specialization</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Time Slot</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {appointments.map((apt, index) => (
                  <tr key={apt.id || index} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-4 py-3 text-gray-500">#{apt.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{apt.user_email}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{apt.counsellor}</td>
                    <td className="px-4 py-3 text-gray-500">{apt.specialization}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{apt.date}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{apt.slot}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        apt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {apt.status?.charAt(0).toUpperCase() + apt.status?.slice(1) || 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            try {
                              await api.put(`/mental-health/appointments/${apt.id}/`, { status: 'completed' });
                              toast.success('Marked as completed');
                              fetchAllData();
                            } catch (e) { toast.error('Failed to update'); }
                          }}
                          className="text-green-500 hover:text-green-700 text-xs"
                          title="Mark Completed"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            try {
                              await api.put(`/mental-health/appointments/${apt.id}/`, { status: 'cancelled' });
                              toast.success('Appointment cancelled');
                              fetchAllData();
                            } catch (e) { toast.error('Failed to cancel'); }
                          }}
                          className="text-red-500 hover:text-red-700 text-xs"
                          title="Cancel"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No counselling bookings yet. Students can book from the Mental Health section.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'events':
        return renderDataTable(events, 'events', [
          { key: 'title', label: 'Title' },
          { key: 'date', label: 'Date' },
          { key: 'location', label: 'Location' },
          { key: 'category', label: 'Category' },
          { key: 'status', label: 'Status' },
        ]);
      case 'clubs':
        return renderDataTable(clubs, 'clubs', [
          { key: 'name', label: 'Name' },
          { key: 'description', label: 'Description' },
        ]);
      case 'workshops':
        return renderDataTable(workshops, 'workshops', [
          { key: 'title', label: 'Name' },
          { key: 'instructor', label: 'Instructor' },
          { key: 'date', label: 'Date' },
          { key: 'location', label: 'Location' },
          { key: 'status', label: 'Status' },
        ]);
      case 'volunteering':
        return renderDataTable(volunteering, 'volunteering', [
          { key: 'title', label: 'Name' },
          { key: 'organization', label: 'Organization' },
          { key: 'date', label: 'Date' },
          { key: 'status', label: 'Status' },
        ]);
      case 'users':
        return renderUsersTable();
      case 'leaderboard':
        return renderLeaderboardTable();
      case 'mentalhealth':
        return renderMentalHealthTable();
      default:
        return renderOverview();
    }
  };

  const renderFormFields = () => {
    switch (activeTab) {
      case 'events':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                placeholder="Event title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                rows={3}
                placeholder="Event description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                <input
                  type="date"
                  value={formData.date || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
                <input
                  type="time"
                  value={formData.time || '10:00'}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                placeholder="Event location"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select
                  value={formData.category || 'academic'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                >
                  <option value="academic">Academic</option>
                  <option value="cultural">Cultural</option>
                  <option value="sports">Sports</option>
                  <option value="technical">Technical</option>
                  <option value="social">Social</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select
                  value={formData.status || 'approved'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                >
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </>
        );
      case 'clubs':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Club Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                placeholder="Club name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                rows={3}
                placeholder="Club description"
              />
            </div>
          </>
        );
      case 'workshops':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Workshop Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                placeholder="Workshop title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                rows={3}
                placeholder="Workshop description"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Instructor</label>
              <input
                type="text"
                value={formData.instructor || ''}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                placeholder="Instructor name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                <input
                  type="date"
                  value={formData.date || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
                <input
                  type="time"
                  value={formData.time || '10:00'}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  placeholder="Workshop location"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select
                  value={formData.category || 'technical'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                >
                  <option value="technical">Technical</option>
                  <option value="career">Career</option>
                  <option value="soft-skills">Soft Skills</option>
                  <option value="academic">Academic</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration (Hours)</label>
                <input
                  type="number"
                  value={formData.durationHours || 2}
                  onChange={(e) => setFormData({ ...formData, durationHours: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Max Participants</label>
                <input
                  type="number"
                  value={formData.maxParticipants || 50}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  min="1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select
                value={formData.status || 'approved'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              >
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </>
        );
      case 'volunteering':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Opportunity Name</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                placeholder="Volunteering opportunity name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                rows={3}
                placeholder="Opportunity description"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Organization</label>
              <input
                type="text"
                value={formData.organization || ''}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                placeholder="Organization name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                <input
                  type="date"
                  value={formData.date || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
                <input
                  type="time"
                  value={formData.time || '09:00'}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  placeholder="Location"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select
                  value={formData.category || 'community'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                >
                  <option value="community">Community</option>
                  <option value="education">Education</option>
                  <option value="environment">Environment</option>
                  <option value="health">Health</option>
                  <option value="social">Social</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration (Hours)</label>
                <input
                  type="number"
                  value={formData.durationHours || 4}
                  onChange={(e) => setFormData({ ...formData, durationHours: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Required Volunteers</label>
                <input
                  type="number"
                  value={formData.requiredVolunteers || 10}
                  onChange={(e) => setFormData({ ...formData, requiredVolunteers: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  min="1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select
                value={formData.status || 'approved'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              >
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </>
        );
      case 'leaderboard':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                placeholder="Person or University name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select
                  value={formData.category || 'global'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                >
                  <option value="global">Global</option>
                  <option value="university">University</option>
                  <option value="friends">Friends</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Points</label>
                <input
                  type="number"
                  value={formData.points || 0}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  min="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">University (for Global category)</label>
              <input
                type="text"
                value={formData.university || ''}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                placeholder="University name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Avatar (Initials)</label>
                <input
                  type="text"
                  value={formData.avatar || ''}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value.toUpperCase().slice(0, 3) })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  placeholder="e.g., PS, AM"
                  maxLength={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Emoji</label>
                <input
                  type="text"
                  value={formData.emoji || '⭐'}
                  onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  placeholder="⭐"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_university_entry"
                checked={formData.is_university_entry || false}
                onChange={(e) => setFormData({ ...formData, is_university_entry: e.target.checked })}
                className="w-4 h-4 text-purple-600"
              />
              <label htmlFor="is_university_entry" className="text-sm text-gray-700 dark:text-gray-300">
                This is a university ranking entry (not an individual)
              </label>
            </div>
          </>
        );
      case 'mentalhealth':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Counsellor Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                placeholder="Dr. Sarah Johnson"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Specialization</label>
              <select
                value={formData.specialization || 'Anxiety & Stress'}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              >
                <option value="Anxiety & Stress">Anxiety & Stress</option>
                <option value="Depression">Depression</option>
                <option value="Career Counselling">Career Counselling</option>
                <option value="Relationship Issues">Relationship Issues</option>
                <option value="Academic Stress">Academic Stress</option>
                <option value="Self-Esteem">Self-Esteem</option>
                <option value="Trauma & PTSD">Trauma & PTSD</option>
                <option value="General Wellness">General Wellness</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
              <textarea
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                rows={3}
                placeholder="A brief description about the counsellor..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Rating (1-5)</label>
                <input
                  type="number"
                  value={formData.rating || 4.5}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  min="1"
                  max="5"
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Avatar (Initials)</label>
                <input
                  type="text"
                  value={formData.avatar || ''}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value.toUpperCase().slice(0, 2) })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  placeholder="e.g., SJ"
                  maxLength={2}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_available"
                checked={formData.is_available !== false}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                className="w-4 h-4 text-purple-600"
              />
              <label htmlFor="is_available" className="text-sm text-gray-700 dark:text-gray-300">
                Available for booking
              </label>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex flex-col">
      {/* Top Header */}
      <header className="bg-white dark:bg-slate-800 shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-800 dark:text-white text-lg">UniMitr Admin</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activeTab === 'overview' ? 'Dashboard Overview' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management`}
                </p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onNavigate('dashboard')}
                className="text-gray-600 dark:text-gray-300 border-gray-300"
              >
                Back to App
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onLogout}
                className="text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="px-4 pb-2">
          <nav className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap text-sm font-medium ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-32 pb-6 px-4">
        {renderContent()}
      </main>

      {/* Modal for Create/Edit */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b dark:border-slate-700 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  {modalMode === 'create' ? 'Create New' : 'Edit'} {activeTab.slice(0, -1)}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-4 space-y-4">
                {renderFormFields()}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t dark:border-slate-700 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {modalMode === 'create' ? 'Create' : 'Save Changes'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Applications Modal */}
      <AnimatePresence>
        {showApplicationsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowApplicationsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b dark:border-slate-700 flex items-center justify-between bg-gradient-to-r from-purple-500 to-pink-500">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Applications / Registrations
                  </h3>
                  <p className="text-white/80 text-sm">{selectedItemForApps?.name}</p>
                </div>
                <button
                  onClick={() => setShowApplicationsModal(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {applicationsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
                  </div>
                ) : applicationsList.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No applications yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {applicationsList.map((app: any) => (
                      <div 
                        key={app.id}
                        className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4 border border-gray-200 dark:border-slate-600"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 dark:text-white">
                              {app.fullName || app.full_name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{app.email}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{app.phone}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Student ID: {app.studentId || app.student_id}
                            </p>
                            {(app.motivation || app.reason || app.expectations) && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 italic">
                                "{app.motivation || app.reason || app.expectations}"
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-2">
                              Applied: {new Date(app.created_at).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              app.status === 'approved' ? 'bg-green-100 text-green-700' :
                              app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              app.status === 'attended' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {app.status}
                            </span>
                            {app.status === 'pending' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleApproveApplication(app.id)}
                                  className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRejectApplication(app.id)}
                                  className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                                  title="Reject"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t dark:border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total: {applicationsList.length} application(s)
                  </span>
                  <Button variant="outline" onClick={() => setShowApplicationsModal(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}