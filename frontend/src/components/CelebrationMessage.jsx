import React, { useEffect, useState } from 'react';
import { FaHeart, FaGift, FaCheckCircle } from 'react-icons/fa';

const CelebrationMessage = ({ 
  type = 'savings', // 'savings' | 'donation'
  amount = 0,
  customerName = '',
  onClose,
  autoCloseDelay = 3000 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate confetti particles
    const newParticles = [];
    const colors = ['#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF8C00'];
    
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1 + Math.random() * 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 8
      });
    }
    setParticles(newParticles);

    // Auto close after delay
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, autoCloseDelay);

    return () => clearTimeout(timer);
  }, [autoCloseDelay, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
      {/* Confetti Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute animate-confetti"
            style={{
              left: `${particle.left}%`,
              top: '-20px',
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          >
            <div 
              className="rounded-sm transform rotate-45"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color
              }}
            />
          </div>
        ))}
      </div>

      {/* Message Card */}
      <div className="animate-bounce-in bg-white rounded-3xl p-6 shadow-2xl mx-4 max-w-sm text-center pointer-events-auto">
        {type === 'savings' ? (
          <>
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <FaGift className="text-white text-3xl" />
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">🎉 Hooray!</h3>
            <p className="text-lg text-gray-600 mb-1">You saved</p>
            <p className="text-4xl font-black text-green-600 mb-4">₹{amount}</p>
            <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl">
              <FaCheckCircle />
              <span className="font-semibold">Offer Applied!</span>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <FaHeart className="text-white text-3xl" />
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">💕 Thank You!</h3>
            <p className="text-lg text-gray-600 mb-1">
              {customerName ? `Dear ${customerName},` : 'Dear Customer,'}
            </p>
            <p className="text-lg text-gray-600 mb-2">for your generous donation of</p>
            <p className="text-4xl font-black text-pink-600 mb-4">₹{amount}</p>
            <div className="flex items-center justify-center gap-2 text-pink-600 bg-pink-50 px-4 py-2 rounded-xl">
              <FaHeart />
              <span className="font-semibold">You're Amazing!</span>
            </div>
          </>
        )}
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
        @keyframes bounce-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CelebrationMessage;
