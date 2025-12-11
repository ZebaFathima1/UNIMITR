import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, DollarSign, Award } from 'lucide-react';
import { Button } from './ui/button';
import WorkshopRegistrationForm from './WorkshopRegistrationForm';

export default function WorkshopsPage() {
  const [selectedWorkshop, setSelectedWorkshop] = useState<{ name: string; price: string } | null>(null);

  const workshops = [
    {
      id: 1,
      title: 'Web Development Bootcamp',
      date: 'Nov 18-20, 2024',
      duration: '3 days',
      price: 'Free',
      icon: '💻',
      instructor: 'Prof. Sharma',
      seats: 45,
    },
    {
      id: 2,
      title: 'UI/UX Design Masterclass',
      date: 'Nov 22, 2024',
      duration: '1 day',
      price: '₹299',
      icon: '🎨',
      instructor: 'Dr. Patel',
      seats: 30,
    },
    {
      id: 3,
      title: 'Data Science with Python',
      date: 'Nov 25-27, 2024',
      duration: '3 days',
      price: '₹499',
      icon: '📊',
      instructor: 'Prof. Kumar',
      seats: 40,
    },
    {
      id: 4,
      title: 'Digital Marketing',
      date: 'Dec 1, 2024',
      duration: '1 day',
      price: 'Free',
      icon: '📱',
      instructor: 'Ms. Gupta',
      seats: 50,
    },
  ];

  return (
    <div className="min-h-screen pb-24 pt-20 px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-gray-800 mb-1">Workshops</h1>
        <p className="text-purple-600">Learn new skills and grow</p>
      </div>

      {/* Workshops List */}
      <div className="space-y-4">
        {workshops.map((workshop, idx) => (
          <motion.div
            key={workshop.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-5"
          >
            <div className="flex gap-4">
              <motion.div 
                className="text-5xl"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: 'spring' }}
              >
                {workshop.icon}
              </motion.div>
              <div className="flex-1">
                <h3 className="text-gray-800 mb-2">{workshop.title}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-pink-500" />
                    <span>{workshop.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4 text-cyan-500" />
                    <span>{workshop.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span>{workshop.instructor}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.span 
                      className={`px-4 py-2 rounded-full ${
                        workshop.price === 'Free' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {workshop.price}
                    </motion.span>
                    <span className="text-gray-500">{workshop.seats} seats left</span>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => setSelectedWorkshop({ name: workshop.title, price: workshop.price })}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl shadow-md"
                    >
                      Register
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Workshop Registration Form Modal */}
      <AnimatePresence>
        {selectedWorkshop && (
          <WorkshopRegistrationForm 
            workshopName={selectedWorkshop.name}
            price={selectedWorkshop.price}
            onClose={() => setSelectedWorkshop(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}