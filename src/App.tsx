import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StickyNavbar from './components/StickyNavbar';
import LandingPage from './components/LandingPage';
import LoginScreen from './components/LoginScreen';
import AdminLoginScreen from './components/AdminLoginScreen';
import StudentDashboard from './components/StudentDashboard';
import ClubsPage from './components/ClubsPage';
import EventsPage from './components/EventsPage';
import WorkshopsPage from './components/WorkshopsPage';
import VolunteeringPage from './components/VolunteeringPage';
import PlacementsPage from './components/PlacementsPage';
import AdminDashboard from './components/AdminDashboard';
import ProfileDrawer from './components/ProfileDrawer';
import LeaderboardScreen from './components/LeaderboardScreen';
import GamificationScreen from './components/GamificationScreen';
import QRScannerScreen from './components/QRScannerScreen';
import SettingsScreen from './components/SettingsScreen';
import DigitalTwinScreen from './components/DigitalTwinScreen';
import CreateEventScreen from './components/CreateEventScreen';
import UploadBannerScreen from './components/UploadBannerScreen';
import EditEventsScreen from './components/EditEventsScreen';
import ViewRequestsScreen from './components/ViewRequestsScreen';
import MyApplicationsPage from './components/MyApplicationsPage';
import MentalHealthScreen from './components/MentalHealthScreen';
import { Toaster } from './components/ui/sonner';
import { login as apiLogin, signup as apiSignup, setAuthHeaders, getUserActivityStats, type UserActivityStats } from './lib/api';
import { toast } from 'sonner';

import type { Screen, UserRole } from './types';

// URL to Screen mapping
const getScreenFromPath = (): Screen => {
  const path = window.location.pathname.toLowerCase();
  if (path === '/admin' || path === '/admin/') return 'admin';
  if (path === '/events' || path === '/events/') return 'events';
  if (path === '/clubs' || path === '/clubs/') return 'clubs';
  if (path === '/workshops' || path === '/workshops/') return 'workshops';
  if (path === '/volunteering' || path === '/volunteering/') return 'volunteering';
  if (path === '/internships' || path === '/internships/') return 'internships';
  if (path === '/login' || path === '/login/') return 'login';
  if (path === '/dashboard' || path === '/dashboard/') return 'dashboard';
  return 'home';
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(getScreenFromPath);
  const [screenHistory, setScreenHistory] = useState<Screen[]>([]);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userName, setUserName] = useState('SRU');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userActivity, setUserActivity] = useState<UserActivityStats>({
    eventsAttended: 0,
    volunteeringHours: 0,
    workshopsCompleted: 0,
    challengesCompleted: 0,
  });

  // Fetch user activity stats when user logs in
  useEffect(() => {
    if (userEmail) {
      getUserActivityStats(userEmail)
        .then(stats => setUserActivity(stats))
        .catch(() => {
          // If API fails, keep defaults
          console.log('Could not fetch user activity stats');
        });
    }
  }, [userEmail]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentScreen(getScreenFromPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL when screen changes
  useEffect(() => {
    const screenToPath: Record<Screen, string> = {
      home: '/',
      splash: '/',
      login: '/login',
      dashboard: '/dashboard',
      clubs: '/clubs',
      events: '/events',
      workshops: '/workshops',
      volunteering: '/volunteering',
      internships: '/internships',
      admin: '/admin',
      leaderboard: '/leaderboard',
      gamification: '/gamification',
      qrscanner: '/qrscanner',
      settings: '/settings',
      digitaltwin: '/digitaltwin',
      createevent: '/admin',
      uploadbanner: '/admin',
      editevents: '/admin',
      viewrequests: '/admin',
      myapplications: '/my-applications',
      mentalhealth: '/mental-health',
    };
    
    const targetPath = screenToPath[currentScreen] || '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  }, [currentScreen]);

  // Theme init - Force light mode only (no dark mode)
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  const handleLogin = async (payload: { role: 'student' | 'admin'; email: string; name?: string; password?: string; isSignup?: boolean }) => {
    try {
      let response;
      
      if (payload.isSignup) {
        // Handle signup
        if (!payload.password || !payload.name) {
          toast.error('Please provide all required information');
          return;
        }
        
        const nameParts = payload.name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';
        
        await apiSignup({
          username: payload.email,
          email: payload.email,
          password: payload.password,
          first_name: firstName,
          last_name: lastName,
        });
        
        toast.success('Account created successfully! Please login.');
        return;
      }
      
      // Handle login - enforce password-based auth only (persisted users)
      if (!payload.password) {
        toast.error('Password is required to login. If you do not have an account, please sign up.');
        return;
      }
      response = await apiLogin({ 
        email: payload.email, 
        password: payload.password 
      });
      
      // Use actual email from response if available, otherwise fallback to payload
      const actualEmail = response.user?.email || payload.email;
      
      setAuthHeaders(payload.role, actualEmail);
      setUserRole(payload.role);
      setUserEmail(actualEmail);
      setUserName(response.user?.first_name || payload.name || 'User');
      
      // Store BOTH username and email in localStorage for profile persistence
      localStorage.setItem('userEmail', actualEmail);
      localStorage.setItem('userName', payload.email); // This is the username used to login
      
      // Rely on backend to determine admin/staff privileges; do not override on client
      
      const newScreen = payload.role === 'admin' ? 'admin' : 'dashboard';
      setCurrentScreen(newScreen);
      setScreenHistory([newScreen]);
      toast.success('Logged in successfully!');
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.detail || err.response?.data?.error || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    }
  };

  const handleNavigation = (screen: Screen) => {
    setScreenHistory([...screenHistory, currentScreen]);
    setCurrentScreen(screen);
    setDrawerOpen(false);
  };

  const handleBack = () => {
    if (screenHistory.length > 0) {
      const previousScreen = screenHistory[screenHistory.length - 1];
      setScreenHistory(screenHistory.slice(0, -1));
      setCurrentScreen(previousScreen);
    }
  };

  const handleLogout = () => {
    setAuthHeaders(undefined, undefined);
    setUserRole(null);
    setUserEmail(null);
    setCurrentScreen('home');
    setDrawerOpen(false);
    setScreenHistory([]);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <LandingPage onGetStarted={() => setCurrentScreen('login')} />;
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      case 'dashboard':
        return <StudentDashboard userName={userName} onNavigate={handleNavigation} />;
      case 'clubs':
        return <ClubsPage isAdmin={userRole === 'admin'} />;
      case 'events':
        return <EventsPage userEmail={userEmail || undefined} />;
      case 'workshops':
        return <WorkshopsPage />;
      case 'volunteering':
        return <VolunteeringPage />;
      case 'internships':
        return <PlacementsPage />;
      case 'admin':
        // Show admin login if not logged in as admin
        if (userRole !== 'admin') {
          return <AdminLoginScreen onLogin={handleLogin} />;
        }
        return <AdminDashboard onNavigate={handleNavigation} onLogout={handleLogout} />;
      case 'leaderboard':
        return <LeaderboardScreen onBack={handleBack} />;
      case 'gamification':
        return <GamificationScreen onBack={handleBack} />;
      case 'qrscanner':
        return <QRScannerScreen onBack={handleBack} />;
      case 'settings':
        return <SettingsScreen onBack={handleBack} onLogout={handleLogout} userEmail={userEmail || ''} userName={userName} />;
      case 'digitaltwin':
        return (
          <DigitalTwinScreen
            onBack={handleBack}
            userName={userName}
            userActivity={{
              ...userActivity,
              lastActive: new Date(),
            }}
          />
        );
      case 'createevent':
        return <CreateEventScreen onBack={handleBack} />;
      case 'uploadbanner':
        return <UploadBannerScreen onBack={handleBack} />;
      case 'editevents':
        return <EditEventsScreen onBack={handleBack} />;
      case 'viewrequests':
        return <ViewRequestsScreen onBack={handleBack} />;
      case 'myapplications':
        return <MyApplicationsPage onBack={handleBack} />;
      case 'mentalhealth':
        return <MentalHealthScreen onBack={handleBack} userEmail={userEmail} />;
      default:
        return <LandingPage onGetStarted={() => setCurrentScreen('login')} />;
    }
  };

  // Hide navbar on login, home, splash, admin dashboard, and when drawer is open
  const showNavbar = currentScreen !== 'login' && currentScreen !== 'home' && currentScreen !== 'splash' && currentScreen !== 'admin' && !drawerOpen;

  return (
    <div className={
      `relative min-h-screen ` +
      `bg-gradient-to-br from-amber-50 via-white to-blue-50 ` +
      `dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100`
    }>
      {/* Toaster for notifications */}
      <Toaster position="top-center" richColors />

      {/* Profile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <ProfileDrawer
            onClose={() => setDrawerOpen(false)}
            onLogout={handleLogout}
            onNavigate={handleNavigation}
            userName={userName}
          />
        )}
      </AnimatePresence>

      {/* Sticky Navigation Bar */}
      {showNavbar && (
        <StickyNavbar
          currentTab={currentScreen}
          onNavigate={handleNavigation}
          onLogin={() => setCurrentScreen('login')}
          isLoggedIn={userRole !== null}
          userName={userName}
          onProfileClick={() => setDrawerOpen(true)}
        />
      )}

      {/* Main Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}