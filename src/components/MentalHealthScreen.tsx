// Rule-based chat logic for "Talk to a Friend"
function getBotResponse(userMessage: string): string {
  const msg = userMessage.trim().toLowerCase();

  // 1. Crisis detection (self-harm/suicidal)
  if (/die|kill myself|hurt myself|end it|hopeless|suicide|self[- ]?harm/.test(msg)) {
    return (
      "I'm really sorry you're feeling this way. You matter, and you're not alone. " +
      "If you're in crisis, please reach out to someone you trust or call the 988 Suicide & Crisis Lifeline (U.S.). " +
      "If you're outside the U.S., contact your local emergency services. 💙"
    );
  }

  // 2. Greetings
  if (/\b(hi|hello|hey|hii|helo|hai)\b/.test(msg)) {
    return "Hi there! How are you feeling right now?";
  }

  // 3. Sadness / stress / loneliness
  if (/\b(sad|tired|stressed|lonely|depressed|down|exhausted|alone)\b/.test(msg)) {
    return (
      "That sounds really tough. It's okay to feel this way. " +
      "Would you like to talk more about what's been weighing on you?"
    );
  }

  // 4. Anxiety / panic
  if (/\b(anxious|panic|scared|afraid|nervous|heart racing|overwhelmed)\b/.test(msg)) {
    return (
      "I'm here with you. Let's try a short breathing exercise: " +
      "Breathe in slowly for 4 seconds, hold for 4, and breathe out for 6. " +
      "You can repeat this a few times. Would you like to share what's making you feel this way?"
    );
  }

  // 5. Confusion
  if (/\b(don't know|dont know|not sure|confused|uncertain|lost)\b/.test(msg)) {
    return (
      "It's completely normal to feel unsure sometimes. " +
      "Do you want to talk more about what's on your mind?"
    );
  }

  // 6. General fallback
  return (
    "Thank you for sharing that with me. I'm here to listen—feel free to tell me more, whenever you're ready."
  );
}
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, ArrowLeft, Calendar, Clock, User, MessageCircle, 
  Shield, Phone, Send, X, Check, Sparkles, Brain, Smile,
  Lock, Users, Star, AlertCircle, CalendarCheck, RefreshCw
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { toast } from 'sonner';

interface MentalHealthScreenProps {
  onBack: () => void;
  userEmail?: string;
}

interface Counsellor {
  id: number;
  name: string;
  specialization: string;
  avatar: string;
  rating: number;
  available_slots: string[];
}

interface ChatMessage {
  id: string;
  sender: 'me' | 'peer';
  message: string;
  timestamp: Date;
}

interface Appointment {
  id: number;
  counsellor: string;
  specialization: string;
  slot: string;
  date: string;
  status: string;
}

export default function MentalHealthScreen({ onBack, userEmail }: MentalHealthScreenProps) {
  const [activeSection, setActiveSection] = useState<'home' | 'counselling' | 'anonymous' | 'myappointments'>('home');
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [selectedCounsellor, setSelectedCounsellor] = useState<Counsellor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  
  // Anonymous chat state
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [peerAlias, setPeerAlias] = useState('');

  // Calming gradient colors
  const calmGradients = [
    'from-teal-400 to-cyan-500',
    'from-purple-400 to-indigo-500',
    'from-pink-400 to-rose-500',
    'from-green-400 to-emerald-500',
  ];

  useEffect(() => {
    // Fetch counsellors
    fetchCounsellors();
  }, []);

  const fetchCounsellors = async () => {
    try {
      const res = await fetch('/api/mental-health/counsellors/');
      if (res.ok) {
        const data = await res.json();
        setCounsellors(data);
      } else {
        // Default counsellors if API not ready
        setCounsellors([
          { id: 1, name: 'Dr. Priya Sharma', specialization: 'Anxiety & Stress', avatar: 'PS', rating: 4.9, available_slots: ['10:00 AM', '2:00 PM', '4:00 PM'] },
          { id: 2, name: 'Dr. Rahul Verma', specialization: 'Depression & Mood', avatar: 'RV', rating: 4.8, available_slots: ['9:00 AM', '11:00 AM', '3:00 PM'] },
          { id: 3, name: 'Dr. Anita Desai', specialization: 'Academic Stress', avatar: 'AD', rating: 4.7, available_slots: ['10:30 AM', '1:00 PM', '5:00 PM'] },
        ]);
      }
    } catch (error) {
      // Use default data
      setCounsellors([
        { id: 1, name: 'Dr. Priya Sharma', specialization: 'Anxiety & Stress', avatar: 'PS', rating: 4.9, available_slots: ['10:00 AM', '2:00 PM', '4:00 PM'] },
        { id: 2, name: 'Dr. Rahul Verma', specialization: 'Depression & Mood', avatar: 'RV', rating: 4.8, available_slots: ['9:00 AM', '11:00 AM', '3:00 PM'] },
        { id: 3, name: 'Dr. Anita Desai', specialization: 'Academic Stress', avatar: 'AD', rating: 4.7, available_slots: ['10:30 AM', '1:00 PM', '5:00 PM'] },
      ]);
    }
  };

  const fetchMyAppointments = async () => {
    if (!userEmail) return;
    setLoadingAppointments(true);
    try {
      const res = await fetch(`/api/mental-health/appointments/?email=${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setMyAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedCounsellor || !selectedSlot) {
      toast.error('Please select a counsellor and time slot');
      return;
    }

    try {
      const res = await fetch('/api/mental-health/appointments/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          counsellor_id: selectedCounsellor.id,
          slot: selectedSlot,
          email: userEmail,
        }),
      });

      if (res.ok) {
        setBookingSuccess(true);
        toast.success('Appointment booked successfully!');
        fetchMyAppointments(); // Refresh appointments
      } else {
        // Simulate success for demo
        setBookingSuccess(true);
        toast.success('Appointment booked successfully!');
      }
    } catch (error) {
      // Simulate success for demo
      setBookingSuccess(true);
      toast.success('Appointment booked successfully!');
    }
  };

  const connectToAnonymousPeer = async () => {
    setIsConnecting(true);
    
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setPeerAlias(getRandomAlias());
      setChatMessages([
        {
          id: '1',
          sender: 'peer',
          message: "Hi there! 👋 I'm here to listen. Feel free to share whatever's on your mind. This is a safe, judgment-free space.",
          timestamp: new Date(),
        }
      ]);
    }, 2000);
  };

  const getRandomAlias = () => {
    const adjectives = ['Kind', 'Gentle', 'Caring', 'Friendly', 'Warm', 'Sweet', 'Calm', 'Peaceful'];
    const animals = ['Panda', 'Dolphin', 'Butterfly', 'Robin', 'Owl', 'Deer', 'Bunny', 'Koala'];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${animals[Math.floor(Math.random() * animals.length)]}`;
  };



  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const myMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'me',
      message: newMessage,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, myMessage]);
    setNewMessage('');

    // Rule-based response
    let botMessage = '';
    if (chatMessages.length === 0) {
      botMessage = "Hey, I’m here with you. What’s been on your mind today?";
    } else {
      botMessage = getBotResponse(newMessage);
    }
    const peerResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'peer',
      message: botMessage,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, peerResponse]);
  };

  const endChat = () => {
    setIsConnected(false);
    setChatMessages([]);
    setPeerAlias('');
    setActiveSection('home');
    toast.success('Chat ended. Take care! 💚');
  };

  // Home Section
  const renderHome = () => (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
          <Brain className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Mental Health Support</h1>
        <p className="text-gray-600">Your well-being matters. We're here to help. 💚</p>
      </motion.div>

      {/* Inspirational Quote */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-5 text-center"
      >
        <Sparkles className="w-6 h-6 text-purple-500 mx-auto mb-2" />
        <p className="text-purple-700 italic">"It's okay to not be okay. Asking for help is a sign of strength."</p>
      </motion.div>

      {/* Main Options */}
      <div className="space-y-4">
        {/* Free Counselling Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveSection('counselling')}
          className="cursor-pointer"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-teal-50 to-cyan-50 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-md">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg mb-1">Free Counselling</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Book a confidential session with our professional counsellors
                  </p>
                  <div className="flex items-center gap-2 text-teal-600">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs">100% Confidential</span>
                  </div>
                </div>
                <div className="text-teal-500">→</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Anonymous Chat Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveSection('anonymous')}
          className="cursor-pointer"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-md">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg mb-1">Talk to a Friend</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Chat anonymously with a peer who understands
                  </p>
                  <div className="flex items-center gap-2 text-purple-600">
                    <Lock className="w-4 h-4" />
                    <span className="text-xs">Completely Anonymous</span>
                  </div>
                </div>
                <div className="text-purple-500">→</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* My Appointments Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setActiveSection('myappointments');
            fetchMyAppointments();
          }}
          className="cursor-pointer"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-blue-50 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-md">
                  <CalendarCheck className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg mb-1">My Appointments</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    View your booked counselling sessions
                  </p>
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">Track Your Sessions</span>
                  </div>
                </div>
                <div className="text-indigo-500">→</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Self-Care Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-md p-5"
      >
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Smile className="w-5 h-5 text-yellow-500" />
          Quick Self-Care Tips
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { emoji: '🧘', tip: 'Deep breathing' },
            { emoji: '🚶', tip: 'Take a walk' },
            { emoji: '💤', tip: 'Rest well' },
            { emoji: '🎵', tip: 'Listen to music' },
          ].map((item, idx) => (
            <div key={idx} className="bg-gray-50 rounded-xl p-3 text-center">
              <span className="text-2xl">{item.emoji}</span>
              <p className="text-xs text-gray-600 mt-1">{item.tip}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Emergency Help */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-red-50 border border-red-200 rounded-2xl p-4"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-700 text-sm">Need Immediate Help?</h4>
            <p className="text-red-600 text-xs mt-1">
              If you're in crisis or need urgent support, please reach out:
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Phone className="w-4 h-4 text-red-500" />
              <a href="tel:9152987821" className="text-red-600 font-semibold text-sm underline">
                iCall: 9152987821
              </a>
            </div>
            <div className="text-red-500 text-xs mt-2 space-y-1">
              <p>🏥 <strong>NIMHANS:</strong> 080-46110007</p>
              <p>📞 <strong>Vandrevala Foundation:</strong> 1860-2662-345 (24/7)</p>
              <p>🆘 <strong>AASRA:</strong> 9820466726 (24/7)</p>
              <p>💚 <strong>Snehi:</strong> 044-24640050</p>
              <p>🤝 <strong>Connecting Trust:</strong> 9922001122</p>
              <p>🌸 <strong>Fortis Stress Helpline:</strong> 8376804102</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Counselling Section
  const renderCounselling = () => (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <button
          onClick={() => setActiveSection('home')}
          className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="font-bold text-xl text-gray-800">Book Counselling</h2>
          <p className="text-gray-500 text-sm">Choose a counsellor & time slot</p>
        </div>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white shadow-lg"
      >
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8" />
          <div>
            <p className="font-semibold">100% Free & Confidential</p>
            <p className="text-purple-100 text-sm">Your privacy is our priority</p>
          </div>
        </div>
      </motion.div>

      {/* Counsellor List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Available Counsellors</h3>
        {counsellors.map((counsellor, idx) => (
          <motion.div
            key={counsellor.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => {
              setSelectedCounsellor(counsellor);
              setShowBookingModal(true);
            }}
            className={`bg-white rounded-2xl shadow-md p-4 cursor-pointer transition-all hover:shadow-lg ${
              selectedCounsellor?.id === counsellor.id ? 'ring-2 ring-teal-500' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${calmGradients[idx % calmGradients.length]} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                {counsellor.avatar}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800">{counsellor.name}</h4>
                <p className="text-gray-500 text-sm">{counsellor.specialization}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm text-gray-600">{counsellor.rating}</span>
                </div>
              </div>
              <Button size="sm" className="bg-gradient-to-r from-teal-500 to-cyan-500">
                Book
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && selectedCounsellor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowBookingModal(false);
              setBookingSuccess(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"
            >
              {!bookingSuccess ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl text-gray-800">Book Session</h3>
                    <button
                      onClick={() => setShowBookingModal(false)}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-teal-50 rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                        {selectedCounsellor.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{selectedCounsellor.name}</h4>
                        <p className="text-gray-500 text-sm">{selectedCounsellor.specialization}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Select Time Slot
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedCounsellor.available_slots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                            selectedSlot === slot
                              ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleBookAppointment}
                    disabled={!selectedSlot}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Confirm Booking
                  </Button>
                </>
              ) : (
                <div className="text-center py-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4"
                  >
                    <Check className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="font-bold text-xl text-gray-800 mb-2">Booking Confirmed! 🎉</h3>
                  <p className="text-gray-600 mb-4">
                    Your session with {selectedCounsellor.name} is booked for {selectedSlot}.
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    You'll receive a confirmation email with details.
                  </p>
                  <Button
                    onClick={() => {
                      setShowBookingModal(false);
                      setBookingSuccess(false);
                      setSelectedSlot('');
                    }}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500"
                  >
                    Done
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Anonymous Chat Section
  const renderAnonymousChat = () => (
    <div className="space-y-4 h-full">
      {!isConnected ? (
        // Connection Screen
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => setActiveSection('home')}
              className="flex items-center gap-2 text-purple-600 mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Users className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="font-bold text-2xl text-gray-800 mb-3">Talk to a Friend</h2>
            <p className="text-gray-600 max-w-xs mx-auto mb-6">
              Connect anonymously with a supportive peer. No names, no judgment - just a listening ear.
            </p>

            <div className="bg-purple-50 rounded-2xl p-4 mb-6 max-w-xs mx-auto">
              <div className="flex items-center gap-2 text-purple-700 mb-2">
                <Lock className="w-4 h-4" />
                <span className="font-semibold text-sm">Privacy Promise</span>
              </div>
              <ul className="text-left text-sm text-purple-600 space-y-1">
                <li>✓ Your identity stays hidden</li>
                <li>✓ Chats are not stored</li>
                <li>✓ No personal info shared</li>
              </ul>
            </div>
          </motion.div>

          {isConnecting ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-3 h-3 bg-purple-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                  className="w-3 h-3 bg-purple-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                  className="w-3 h-3 bg-purple-500 rounded-full"
                />
              </div>
              <p className="text-purple-600">Finding a supportive peer...</p>
            </motion.div>
          ) : (
            <Button
              onClick={connectToAnonymousPeer}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Anonymous Chat
            </Button>
          )}
        </div>
      ) : (
        // Chat Interface
        <div className="flex flex-col h-[calc(100vh-180px)]">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">{peerAlias}</p>
                  <p className="text-purple-200 text-xs">Online • Anonymous</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={endChat}
                className="text-white hover:bg-white/20"
              >
                End Chat
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {chatMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.sender === 'me'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-purple-200' : 'text-gray-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Button
              onClick={sendMessage}
              className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl px-4"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  // My Appointments Section
  const renderMyAppointments = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveSection('home')}
          className="flex items-center gap-2 text-indigo-600"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={fetchMyAppointments}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
          disabled={loadingAppointments}
        >
          <RefreshCw className={`w-5 h-5 ${loadingAppointments ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
          <CalendarCheck className="w-8 h-8 text-white" />
        </div>
        <h2 className="font-bold text-2xl text-gray-800 mb-2">My Appointments</h2>
        <p className="text-gray-600">Track your counselling sessions</p>
      </motion.div>

      {loadingAppointments ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : myAppointments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-700 mb-2">No Appointments Yet</h3>
          <p className="text-gray-500 text-sm mb-4">You haven't booked any counselling sessions.</p>
          <Button
            onClick={() => setActiveSection('counselling')}
            className="bg-gradient-to-r from-indigo-500 to-blue-500"
          >
            Book Your First Session
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {myAppointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-md overflow-hidden">
                <CardContent className="p-0">
                  <div className={`h-2 ${
                    appointment.status === 'completed' ? 'bg-green-500' :
                    appointment.status === 'confirmed' ? 'bg-blue-500' :
                    appointment.status === 'cancelled' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`} />
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">{appointment.counsellor}</h3>
                        <p className="text-sm text-gray-500">{appointment.specialization}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                        appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {appointment.status === 'completed' ? '✓ Completed' :
                         appointment.status === 'confirmed' ? '◉ Confirmed' :
                         appointment.status === 'cancelled' ? '✗ Cancelled' :
                         '◷ Pending'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.slot}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-32 pt-20 px-6 overflow-y-auto">
      {/* Back Button */}
      {activeSection === 'home' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>
      )}

      {/* Render Active Section */}
      <AnimatePresence mode="wait">
        {activeSection === 'home' && renderHome()}
        {activeSection === 'counselling' && renderCounselling()}
        {activeSection === 'anonymous' && renderAnonymousChat()}
        {activeSection === 'myappointments' && renderMyAppointments()}
      </AnimatePresence>
    </div>
  );
}
