'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RelationshipSelection = ({ onSelect, selectedRelationship, customRelationship, onCustomChange }) => {
  const [isHovered, setIsHovered] = useState(null);
  const [isPressed, setIsPressed] = useState(null);

  const relationships = [
    { 
      id: 'partner', 
      label: 'Partner', 
      sub: 'girlfriend/boyfriend/wife/husband',
      icon: 'â¤ï¸',
      gradient: 'from-pink-500 to-rose-600'
    },
    { 
      id: 'family', 
      label: 'Family', 
      sub: 'parents/siblings',
      icon: 'ð¥',
      gradient: 'from-purple-500 to-pink-600'
    },
    { 
      id: 'relative', 
      label: 'Relative', 
      sub: 'cousins, etc.',
      icon: 'ð',
      gradient: 'from-indigo-500 to-purple-600'
    },
    { 
      id: 'friend', 
      label: 'Friend', 
      sub: '',
      icon: 'ð',
      gradient: 'from-blue-500 to-indigo-600'
    },
    { 
      id: 'custom', 
      label: 'Custom', 
      sub: 'describe your relationship',
      icon: 'â¨',
      gradient: 'from-amber-500 to-orange-600'
    }
  ];

  const handleCardClick = (id) => {
    setIsPressed(id);
    setTimeout(() => setIsPressed(null), 150);
    onSelect(id);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with radial gradient and vignette */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#2a0a1a] via-[#1a050a] to-[#0a0005]">
        {/* Subtle floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            >
              <div 
                className="w-1 h-1 bg-pink-400 rounded-full opacity-20 blur-sm"
                style={{
                  boxShadow: '0 0 10px rgba(244, 114, 182, 0.3)'
                }}
              />
            </div>
          ))}
        </div>

        {/* Ambient lighting effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600 rounded-full opacity-10 blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-600 rounded-full opacity-10 blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Progress bar */}
        <div className="w-full max-w-md mb-12">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/60 text-sm font-light tracking-wide">Progress</span>
            <span className="text-white/60 text-sm font-light tracking-wide">2 of 9 steps</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div 
              className="h-full bg-gradient-to-r from-pink-500 to-rose-600 rounded-full"
              style={{
                boxShadow: '0 0 20px rgba(244, 114, 182, 0.5)'
              }}
              initial={{ width: "11.11%" }}
              animate={{ width: "22.22%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Title section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-4 leading-tight">
            What's your{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
                relationship
              </span>
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </span>
            {"?"}
          </h1>
          <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed max-w-md mx-auto">
            Let's make this feel just right for them {" "}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block"
            >
              â¤ï¸
            </motion.span>
          </p>
        </motion.div>

        {/* Relationship cards grid */}
        <div className="w-full max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {relationships.slice(0, 4).map((rel, index) => (
              <motion.div
                key={rel.id}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => setIsHovered(rel.id)}
                onHoverEnd={() => setIsHovered(null)}
              >
                <motion.button
                  onClick={() => handleCardClick(rel.id)}
                  className={`w-full p-6 rounded-2xl border transition-all duration-300 backdrop-blur-md relative overflow-hidden group ${
                    selectedRelationship === rel.id
                      ? 'bg-gradient-to-br from-white/10 to-white/5 border-pink-400/50'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                  whileTap={{ scale: isPressed === rel.id ? 0.98 : 1 }}
                  style={{
                    boxShadow: selectedRelationship === rel.id
                      ? '0 0 30px rgba(244, 114, 182, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05)'
                      : isHovered === rel.id
                      ? '0 0 20px rgba(244, 114, 182, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.02)'
                      : 'inset 0 0 10px rgba(255, 255, 255, 0.02)'
                  }}
                >
                  {/* Animated gradient overlay for selected state */}
                  {selectedRelationship === rel.id && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${rel.gradient} opacity-20`}
                      animate={{ opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  {/* Hover glow effect */}
                  {isHovered === rel.id && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${rel.gradient} opacity-10`} />
                  )}

                  <div className="relative z-10 text-left">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl">{rel.icon}</div>
                      {selectedRelationship === rel.id && (
                        <motion.div
                          className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                    <h3 className={`text-xl font-semibold text-white mb-1 ${
                      selectedRelationship === rel.id ? 'text-white' : 'text-white/90'
                    }`}>
                      {rel.label}
                    </h3>
                    {rel.sub && (
                      <p className="text-sm text-white/60 font-light">
                        {rel.sub}
                      </p>
                    )}
                  </div>
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Custom option - full width */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.01 }}
            onHoverStart={() => setIsHovered('custom')}
            onHoverEnd={() => setIsHovered(null)}
          >
            <motion.button
              onClick={() => handleCardClick('custom')}
              className={`w-full p-6 rounded-2xl border transition-all duration-300 backdrop-blur-md relative overflow-hidden group ${
                selectedRelationship === 'custom'
                  ? 'bg-gradient-to-br from-white/10 to-white/5 border-pink-400/50'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
              whileTap={{ scale: isPressed === 'custom' ? 0.98 : 1 }}
              style={{
                boxShadow: selectedRelationship === 'custom'
                  ? '0 0 30px rgba(244, 114, 182, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05)'
                  : isHovered === 'custom'
                  ? '0 0 20px rgba(244, 114, 182, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.02)'
                  : 'inset 0 0 10px rgba(255, 255, 255, 0.02)'
              }}
            >
              {/* Animated gradient overlay for selected state */}
              {selectedRelationship === 'custom' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 opacity-20"
                  animate={{ opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              {/* Hover glow effect */}
              {isHovered === 'custom' && (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 opacity-10" />
              )}

              <div className="relative z-10 text-left">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">â¨</div>
                  {selectedRelationship === 'custom' && (
                    <motion.div
                      className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </div>
                <h3 className={`text-xl font-semibold text-white mb-1 ${
                  selectedRelationship === 'custom' ? 'text-white' : 'text-white/90'
                }`}>
                  Custom
                </h3>
                <p className="text-sm text-white/60 font-light">
                  describe your relationship
                </p>
              </div>
            </motion.button>
          </motion.div>

          {/* Custom input field */}
          <AnimatePresence>
            {selectedRelationship === 'custom' && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: "1.5rem" }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <motion.input
                  type="text"
                  value={customRelationship}
                  onChange={(e) => onCustomChange(e.target.value)}
                  placeholder="Tell us about your relationship..."
                  className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-pink-400/50 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
                  style={{
                    boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.05)'
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RelationshipSelection;
