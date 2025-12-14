import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';

interface AdminLoginScreenProps {
  onLogin: (payload: { role: 'admin'; email: string; password: string }) => Promise<void> | void;
}

export default function AdminLoginScreen({ onLogin }: AdminLoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await onLogin({ 
        role: 'admin', 
        email, 
        password 
      });
    } catch (error) {
      console.error('Admin login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 space-y-6 border border-purple-500/30">
          {/* Header */}
          <div className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30"
            >
              <ShieldCheck className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white">
              Admin Portal
            </h2>
            <p className="text-purple-200">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
              <Input
                type="text"
                placeholder="Admin Username or Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 rounded-2xl bg-white/10 border-purple-400/30 text-white placeholder:text-purple-300 focus:border-purple-400 h-12"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 rounded-2xl bg-white/10 border-purple-400/30 text-white placeholder:text-purple-300 focus:border-purple-400 h-12"
              />
            </div>
          </div>

          {/* Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all text-base font-semibold"
          >
            <ShieldCheck className="w-5 h-5 mr-2" />
            {loading ? 'Signing in...' : 'Sign in as Admin'}
          </Button>

          {/* Info */}
          <div className="text-center pt-4 border-t border-purple-500/30">
            <p className="text-purple-300 text-sm">
              Only authorized administrators can access this portal.
            </p>
          </div>
        </form>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-purple-400 text-sm">UniMitr Admin Console</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
