import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Camera, Bell, AlertTriangle, HelpCircle, Save, ArrowLeft, Moon, Sun } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface SettingsScreenProps {
  onBack: () => void;
  darkMode: boolean;
  onToggleDarkMode: (enabled: boolean) => void;
}

export default function SettingsScreen({ onBack, darkMode, onToggleDarkMode }: SettingsScreenProps) {
  const [name, setName] = useState('SRU');
  const [notifications, setNotifications] = useState({
    events: true,
    workshops: true,
    messages: false,
    reminders: true,
  });
  const [showCloseAccount, setShowCloseAccount] = useState(false);

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

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-gray-800 mb-1">Settings</h1>
        <p className="text-purple-600">Manage your account preferences</p>
      </div>

      {/* Dark Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-md p-5 mb-4"
      >
        <div className="flex items-center gap-2 mb-4">
          {darkMode ? <Moon className="w-5 h-5 text-purple-600" /> : <Sun className="w-5 h-5 text-yellow-600" />}
          <h3 className="text-gray-800">Appearance</h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-800">Dark Mode</p>
            <p className="text-gray-500 text-sm">Switch to dark theme</p>
          </div>
          <Switch
            checked={darkMode}
            onCheckedChange={onToggleDarkMode}
          />
        </div>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-2xl shadow-md p-5 mb-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-purple-600" />
          <h3 className="text-gray-800">Profile Information</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-gray-600 mb-2 block">Full Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border-purple-200 focus:border-purple-400"
            />
          </div>

          <div>
            <label className="text-gray-600 mb-2 block">Email</label>
            <Input
              value="sru@university.edu"
              disabled
              className="rounded-xl bg-gray-50"
            />
          </div>

          <div>
            <label className="text-gray-600 mb-2 block">Branch</label>
            <Input
              value="Management"
              disabled
              className="rounded-xl bg-gray-50"
            />
          </div>

          <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </motion.div>

      {/* Profile Picture */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-md p-5 mb-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Camera className="w-5 h-5 text-cyan-600" />
          <h3 className="text-gray-800">Profile Picture</h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl">
            S
          </div>
          <Button variant="outline" className="rounded-xl border-2 border-cyan-300 text-cyan-600 hover:bg-cyan-50">
            <Camera className="w-4 h-4 mr-2" />
            Change Picture
          </Button>
        </div>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl shadow-md p-5 mb-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-yellow-600" />
          <h3 className="text-gray-800">Notification Preferences</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-800">Event Notifications</p>
              <p className="text-gray-500 text-sm">Get notified about new events</p>
            </div>
            <Switch
              checked={notifications.events}
              onCheckedChange={(checked) => setNotifications({ ...notifications, events: checked })}
            />
          </div>

          <div className="h-px bg-gray-200" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-800">Workshop Updates</p>
              <p className="text-gray-500 text-sm">Stay updated on workshops</p>
            </div>
            <Switch
              checked={notifications.workshops}
              onCheckedChange={(checked) => setNotifications({ ...notifications, workshops: checked })}
            />
          </div>

          <div className="h-px bg-gray-200" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-800">Messages</p>
              <p className="text-gray-500 text-sm">New message alerts</p>
            </div>
            <Switch
              checked={notifications.messages}
              onCheckedChange={(checked) => setNotifications({ ...notifications, messages: checked })}
            />
          </div>

          <div className="h-px bg-gray-200" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-800">Reminders</p>
              <p className="text-gray-500 text-sm">Event & workshop reminders</p>
            </div>
            <Switch
              checked={notifications.reminders}
              onCheckedChange={(checked) => setNotifications({ ...notifications, reminders: checked })}
            />
          </div>
        </div>
      </motion.div>

      {/* About & Help */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-md p-5 mb-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <h3 className="text-gray-800">About & Help</h3>
        </div>

        <div className="space-y-3">
          <button className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <p className="text-gray-800">Help Center</p>
            <p className="text-gray-500 text-sm">Get answers to your questions</p>
          </button>

          <button className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <p className="text-gray-800">Privacy Policy</p>
            <p className="text-gray-500 text-sm">Learn how we protect your data</p>
          </button>

          <button className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <p className="text-gray-800">Terms of Service</p>
            <p className="text-gray-500 text-sm">Read our terms and conditions</p>
          </button>

          <div className="pt-2">
            <p className="text-gray-500 text-sm text-center">Version 1.0.0</p>
          </div>
        </div>
      </motion.div>

      {/* Close Account */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-2xl shadow-md p-5"
      >
        <Button
          onClick={() => setShowCloseAccount(true)}
          variant="outline"
          className="w-full rounded-xl border-2 border-red-300 text-red-600 hover:bg-red-50"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Close Account
        </Button>
      </motion.div>

      {/* Close Account Confirmation Dialog */}
      <Dialog open={showCloseAccount} onOpenChange={setShowCloseAccount}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-red-600">Close Account?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All your data, badges, and progress will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <Button
              onClick={() => setShowCloseAccount(false)}
              variant="outline"
              className="w-full rounded-xl border-2 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 rounded-xl"
            >
              Yes, Close My Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}