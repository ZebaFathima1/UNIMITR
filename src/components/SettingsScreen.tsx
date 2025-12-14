import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Camera, Bell, AlertTriangle, HelpCircle, Save, ArrowLeft, Check, Shield, LogOut, Mail, Building, Phone, GraduationCap, IdCard, Pencil, Calendar, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner';

interface SettingsScreenProps {
  onBack: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: (enabled: boolean) => void;
  onLogout?: () => void;
  userEmail?: string;
  userName?: string;
}

const API_BASE = '/api/auth';

export default function SettingsScreen({ onBack, onLogout, userEmail, userName }: SettingsScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: userName || 'Student Name',
    email: userEmail || 'student@university.edu',
    phone: '',
    collegeName: '',
    branch: '',
    rollNumber: '',
    semester: '',
    dateOfBirth: '',
    gender: '',
    address: '',
  });
  
  const [notifications, setNotifications] = useState({
    events: true,
    workshops: true,
    messages: false,
    reminders: true,
  });
  
  const [showCloseAccount, setShowCloseAccount] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Load profile from backend API
  useEffect(() => {
    const loadProfile = async () => {
      // Get email from props or localStorage (try both email and username)
      let email = userEmail || localStorage.getItem('userEmail');
      const storedUsername = localStorage.getItem('userName');
      
      // Store email in localStorage for future reference
      if (userEmail && userEmail !== 'student@university.edu') {
        localStorage.setItem('userEmail', userEmail);
      }
      
      // If no valid email, try username
      if (!email || email === 'student@university.edu') {
        email = storedUsername;
      }
      
      if (!email || email === 'student@university.edu') {
        setIsLoading(false);
        return;
      }
      
      console.log('Loading profile for:', email); // Debug

      try {
        const response = await fetch(`${API_BASE}/profile/?email=${encodeURIComponent(email)}`);
        if (response.ok) {
          const data = await response.json();
          setProfile({
            name: data.name || userName || 'Student Name',
            email: data.email || email,
            phone: data.phone || '',
            collegeName: data.collegeName || '',
            branch: data.branch || '',
            rollNumber: data.rollNumber || '',
            semester: data.semester || '',
            dateOfBirth: data.dateOfBirth || '',
            gender: data.gender || '',
            address: '',
          });
          if (data.profileImage) {
            setProfileImage(data.profileImage);
          }
          // Also cache to localStorage for offline access
          localStorage.setItem('userProfile', JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone,
            collegeName: data.collegeName,
            branch: data.branch,
            rollNumber: data.rollNumber,
            semester: data.semester,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
          }));
          if (data.profileImage) {
            localStorage.setItem('profileImage', data.profileImage);
          }
        } else {
          // API failed, try localStorage
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        loadFromLocalStorage();
      } finally {
        setIsLoading(false);
      }
    };

    const loadFromLocalStorage = () => {
      const savedProfile = localStorage.getItem('userProfile');
      const savedImage = localStorage.getItem('profileImage');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfile(prev => ({ ...prev, ...parsed }));
      }
      if (savedImage) setProfileImage(savedImage);
    };

    loadProfile();
  }, [userEmail, userName]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { toast.error('Max 5MB allowed'); return; }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfileImage(base64);
        setHasChanges(true);
        toast.success('Profile photo updated! Click Save to keep changes.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    
    // Get the correct email/username for the API
    const apiEmail = profile.email || userEmail || localStorage.getItem('userEmail') || localStorage.getItem('userName');
    
    console.log('Saving profile for:', apiEmail); // Debug
    
    try {
      const response = await fetch(`${API_BASE}/profile/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: apiEmail,
          name: profile.name,
          phone: profile.phone,
          collegeName: profile.collegeName,
          branch: profile.branch,
          rollNumber: profile.rollNumber,
          semester: profile.semester,
          dateOfBirth: profile.dateOfBirth,
          gender: profile.gender,
          profileImage: profileImage,
        }),
      });

      console.log('Save response status:', response.status); // Debug
      
      if (response.ok) {
        // Also save to localStorage as backup
        localStorage.setItem('userProfile', JSON.stringify(profile));
        if (profileImage) localStorage.setItem('profileImage', profileImage);
        
        setHasChanges(false);
        setIsEditing(false);
        toast.success('Profile saved successfully!');
      } else {
        const errorData = await response.json();
        console.error('Save error:', errorData);
        throw new Error('Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      // Fallback to localStorage
      localStorage.setItem('userProfile', JSON.stringify(profile));
      if (profileImage) localStorage.setItem('profileImage', profileImage);
      toast.success('Profile saved locally!');
      setHasChanges(false);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const isProfileIncomplete = !profile.collegeName || !profile.branch || !profile.phone;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 pb-24 pt-20">
      {/* Header - Below main navbar */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 px-4 py-4 shadow-lg mx-4 rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Profile Settings</h1>
              <p className="text-sm text-white/70">Manage your account</p>
            </div>
          </div>
          {/* Always show Save button */}
          <Button 
            onClick={handleSaveChanges} 
            disabled={isSaving || (!hasChanges && !isEditing)} 
            className={`rounded-xl font-semibold transition-all ${
              hasChanges || isEditing 
                ? 'bg-white text-purple-600 hover:bg-white/90' 
                : 'bg-white/30 text-white/70 cursor-not-allowed'
            }`}
          >
            {isSaving ? <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save
          </Button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Profile Completion Alert */}
        {isProfileIncomplete && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-amber-800">Complete Your Profile</p>
                <p className="text-sm text-amber-600 mt-1">Please fill in your college details for a better experience</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Profile Picture Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-lg p-6 border border-purple-100">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-200 shadow-xl">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-500 to-rose-500 flex items-center justify-center text-white text-4xl font-bold">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 w-11 h-11 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform border-4 border-white">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
            <p className="text-sm text-gray-500">{profile.email}</p>
            {profile.collegeName && (
              <div className="mt-2 px-4 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
                <p className="text-sm font-medium text-purple-700">{profile.collegeName}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Personal Information */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white rounded-3xl shadow-lg p-6 border border-purple-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-800">Personal Information</h3>
            </div>
            <button onClick={() => setIsEditing(!isEditing)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isEditing ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-purple-50'}`}>
              <Pencil className="w-4 h-4 inline mr-1" /> {isEditing ? 'Editing' : 'Edit'}
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-purple-500" /> Full Name
              </label>
              <Input 
                value={profile.name} 
                onChange={(e) => handleProfileChange('name', e.target.value)} 
                disabled={!isEditing}
                className="rounded-xl border-gray-200 focus:border-purple-500 disabled:bg-gray-50" 
                placeholder="Enter your full name" 
              />
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-500" /> Email Address
              </label>
              <Input 
                value={profile.email} 
                disabled
                className="rounded-xl border-gray-200 bg-gray-50" 
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-500" /> Phone Number <span className="text-red-500">*</span>
              </label>
              <Input 
                value={profile.phone} 
                onChange={(e) => handleProfileChange('phone', e.target.value)} 
                disabled={!isEditing}
                className="rounded-xl border-gray-200 focus:border-purple-500 disabled:bg-gray-50" 
                placeholder="+91 9876543210" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500" /> Date of Birth
                </label>
                <Input 
                  type="date"
                  value={profile.dateOfBirth} 
                  onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)} 
                  disabled={!isEditing}
                  className="rounded-xl border-gray-200 focus:border-purple-500 disabled:bg-gray-50" 
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-500" /> Gender
                </label>
                <select 
                  value={profile.gender} 
                  onChange={(e) => handleProfileChange('gender', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-500 disabled:bg-gray-50 text-gray-700"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Academic Information */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl shadow-lg p-6 border border-purple-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-gray-800">Academic Information</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Building className="w-4 h-4 text-cyan-500" /> College / University Name <span className="text-red-500">*</span>
              </label>
              <Input 
                value={profile.collegeName} 
                onChange={(e) => handleProfileChange('collegeName', e.target.value)} 
                disabled={!isEditing}
                className="rounded-xl border-gray-200 focus:border-cyan-500 disabled:bg-gray-50" 
                placeholder="e.g., SR University" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-cyan-500" /> Branch / Department <span className="text-red-500">*</span>
                </label>
                <Input 
                  value={profile.branch} 
                  onChange={(e) => handleProfileChange('branch', e.target.value)} 
                  disabled={!isEditing}
                  className="rounded-xl border-gray-200 focus:border-cyan-500 disabled:bg-gray-50" 
                  placeholder="e.g., CSE" 
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <IdCard className="w-4 h-4 text-cyan-500" /> Roll Number
                </label>
                <Input 
                  value={profile.rollNumber} 
                  onChange={(e) => handleProfileChange('rollNumber', e.target.value)} 
                  disabled={!isEditing}
                  className="rounded-xl border-gray-200 focus:border-cyan-500 disabled:bg-gray-50" 
                  placeholder="e.g., 22A91A05XX" 
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-500" /> Current Semester
              </label>
              <select 
                value={profile.semester} 
                onChange={(e) => handleProfileChange('semester', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cyan-500 disabled:bg-gray-50 text-gray-700"
              >
                <option value="">Select Semester</option>
                {[1,2,3,4,5,6,7,8].map(sem => (
                  <option key={sem} value={sem}>{sem}{sem === 1 ? 'st' : sem === 2 ? 'nd' : sem === 3 ? 'rd' : 'th'} Semester</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-3xl shadow-lg p-6 border border-purple-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-gray-800">Notification Preferences</h3>
          </div>
          <div className="space-y-1">
            {[
              { key: 'events', label: 'Event Updates', icon: '🎉', desc: 'New events and registrations' },
              { key: 'workshops', label: 'Workshop Alerts', icon: '📚', desc: 'Upcoming workshops and deadlines' },
              { key: 'messages', label: 'Direct Messages', icon: '💬', desc: 'Messages from clubs and organizers' },
              { key: 'reminders', label: 'Reminders', icon: '⏰', desc: 'Important date reminders' },
            ].map((item, i) => (
              <div key={item.key}>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-medium text-gray-800">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                  <Switch checked={notifications[item.key as keyof typeof notifications]} onCheckedChange={(v) => { setNotifications(p => ({ ...p, [item.key]: v })); setHasChanges(true); }} />
                </div>
                {i < 3 && <div className="h-px bg-gray-100" />}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl shadow-lg p-6 border border-purple-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-gray-800">Security & Privacy</h3>
          </div>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:from-purple-50 hover:to-pink-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><Shield className="w-5 h-5 text-blue-600" /></div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">Change Password</p>
                  <p className="text-xs text-gray-500">Update your account password</p>
                </div>
              </div>
              <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:from-purple-50 hover:to-pink-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center"><Check className="w-5 h-5 text-purple-600" /></div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500">Add extra security to your account</p>
                </div>
              </div>
              <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
            </button>
          </div>
        </motion.div>

        {/* Help */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-3xl shadow-lg p-6 border border-purple-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-gray-800">Help & Support</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Help Center', icon: '❓', gradient: 'from-blue-50 to-indigo-50' },
              { label: 'Contact Us', icon: '📞', gradient: 'from-green-50 to-emerald-50' },
              { label: 'Privacy Policy', icon: '🔒', gradient: 'from-purple-50 to-pink-50' },
              { label: 'Terms of Service', icon: '📋', gradient: 'from-amber-50 to-orange-50' },
            ].map((item) => (
              <button key={item.label} className={`p-4 bg-gradient-to-br ${item.gradient} rounded-2xl text-center hover:scale-105 transition-transform shadow-sm`}>
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <p className="text-sm font-medium text-gray-700">{item.label}</p>
              </button>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">UniMitr v1.0.0</p>
            <p className="text-xs text-gray-400 mt-1">Made with ❤️ for Students</p>
          </div>
        </motion.div>

        {/* Logout & Delete */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-3 pt-2">
          <Button onClick={() => setShowLogoutConfirm(true)} variant="outline" className="w-full rounded-2xl border-2 border-orange-200 text-orange-600 hover:bg-orange-50 py-6 font-semibold">
            <LogOut className="w-5 h-5 mr-2" /> Log Out
          </Button>
          <Button onClick={() => setShowCloseAccount(true)} variant="outline" className="w-full rounded-2xl border-2 border-red-200 text-red-500 hover:bg-red-50 py-6 font-semibold">
            <AlertTriangle className="w-5 h-5 mr-2" /> Delete Account
          </Button>
        </motion.div>
      </div>

      {/* Logout Dialog */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-orange-600 flex items-center gap-2"><LogOut className="w-5 h-5" /> Log Out?</DialogTitle>
            <DialogDescription>Are you sure you want to log out of your account?</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <Button onClick={() => setShowLogoutConfirm(false)} variant="outline" className="w-full rounded-xl">Cancel</Button>
            <Button onClick={() => { onLogout?.(); setShowLogoutConfirm(false); }} className="w-full bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">Yes, Log Out</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showCloseAccount} onOpenChange={setShowCloseAccount}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Delete Account?</DialogTitle>
            <DialogDescription>This action cannot be undone. All your data will be permanently deleted.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <Button onClick={() => setShowCloseAccount(false)} variant="outline" className="w-full rounded-xl">Cancel</Button>
            <Button className="w-full bg-gradient-to-r from-red-500 to-rose-500 rounded-xl">Yes, Delete Account</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
