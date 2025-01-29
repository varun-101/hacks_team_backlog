import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, ChevronRight, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  onLogin: (type: 'manager' | 'client') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [view, setView] = useState('selection');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Animation variants
  const pageTransition = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 }
  };

  // Floating animation for background elements
  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-20, 20, -20],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(view === 'clientLogin' ? 'client' : 'manager');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Animated gradient orbs */}
        <motion.div
          variants={floatingAnimation}
          initial="initial"
          animate="animate"
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
        />
        <motion.div
          variants={floatingAnimation}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.5 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"
        />
        
        {/* Mesh gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),rgba(15,23,42,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(124,58,237,0.1),rgba(15,23,42,0))]" />
      </motion.div>

      <AnimatePresence mode="wait">
        {view === 'selection' ? (
          <motion.div
            key="selection"
            className="w-full max-w-md relative"
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
              <div className="p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-3xl font-bold text-white mb-6">Welcome Back</h1>
                  <p className="text-slate-300 mb-8">Choose your role to continue</p>
                </motion.div>
                
                <div className="space-y-4">
                  <motion.button
                    onClick={() => setView('clientLogin')}
                    className="w-full group bg-gradient-to-r from-purple-700 to-violet-800 hover:from-purple-600 hover:to-violet-700 text-white rounded-xl p-4 flex items-center justify-between transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5" />
                      <span className="font-medium">Client Access</span>
                    </div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.div>
                  </motion.button>

                  <motion.button
                    onClick={() => setView('managerLogin')}
                    className="w-full group bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white rounded-xl p-4 flex items-center justify-between transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">Manager Portal</span>
                    </div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.div>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="login"
            className="w-full max-w-md relative"
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
              <div className="p-8">
                <motion.button
                  onClick={() => setView('selection')}
                  className="text-slate-400 hover:text-white flex items-center gap-2 mb-6 transition-colors"
                  whileHover={{ x: -5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </motion.button>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {view === 'clientLogin' ? 'Client Login' : 'Manager Login'}
                  </h1>
                  <p className="text-slate-300 mb-8">
                    {view === 'clientLogin' 
                      ? 'Access your social media management dashboard'
                      : 'Access the manager control panel'}
                  </p>
                </motion.div>

                <form className="space-y-6" onSubmit={handleLogin}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="Enter your email"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="Enter your password"
                    />
                  </motion.div>

                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-500 hover:to-violet-600 text-white font-medium rounded-lg py-3 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign In
                  </motion.button>
                </form>

                <motion.div
                  className="mt-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <button 
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      // Handle forgot password
                    }}
                  >
                    Forgot your password?
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;