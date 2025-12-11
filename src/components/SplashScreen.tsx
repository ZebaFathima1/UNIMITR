import { motion } from 'motion/react';
import logo from 'figma:asset/4ca1c7d7f8a4af264f9dbe8cc3242bd351004ed0.png';

export default function SplashScreen() {
  const confettiColors = ['#F33A6A', '#00B7EB', '#FFC107', '#8B5CF6'];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-50 flex items-center justify-center overflow-hidden">
      {/* Confetti Animation */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: confettiColors[i % confettiColors.length],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 1, 0],
            opacity: [0, 1, 1, 0],
            y: [0, -100, -200, -300],
            x: [0, Math.random() * 100 - 50],
          }}
          transition={{
            duration: 2,
            delay: i * 0.05,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      ))}

      <div className="text-center z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.2 
          }}
        >
          <img 
            src={logo} 
            alt="Uniमित्र Logo" 
            className="w-64 h-auto mx-auto mb-8"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-2"
        >
          <motion.h1
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Uniमित्र
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-purple-600"
          >
            Connect. Collaborate. Conquer.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
