import React from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertTriangle, Info, Sparkles } from 'lucide-react';

export const FloatingToasts: React.FC = () => {
  const { activeToasts, dismissToast } = useApp();

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-4.5 w-4.5 text-[#F27D26]" />;
      case 'warning':
        return <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />;
      case 'info':
      default:
        return <Info className="h-4.5 w-4.5 text-gold-400" />;
    }
  };

  const getToastBorderClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-[#F27D26]/30 bg-black/90 shadow-[#F27D26]/5';
      case 'warning':
        return 'border-amber-500/30 bg-black/90 shadow-amber-500/[0.02]';
      case 'info':
      default:
        return 'border-gold-500/20 bg-black/90 shadow-gold-500/[0.02]';
    }
  };

  return (
    <div 
      className="fixed bottom-5 right-5 sm:top-24 sm:bottom-auto z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none px-4 sm:px-0"
      id="floating-toasts-container"
    >
      <AnimatePresence mode="popLayout">
        {activeToasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg ${getToastBorderClass(
              toast.type
            )} transition-colors duration-300`}
            id={`visual-toast-${toast.id}`}
          >
            {/* Left side Accent Indicator Line */}
            <div className={`absolute top-0 bottom-0 left-0 w-1 rounded-l-xl ${
              toast.type === 'success' ? 'bg-[#F27D26]' : toast.type === 'warning' ? 'bg-amber-500' : 'bg-gold-500'
            }`} />

            {/* Icon Column */}
            <div className="shrink-0 pt-0.5 ml-1">
              {getToastIcon(toast.type)}
            </div>

            {/* Content Column */}
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-sans text-zinc-300 leading-relaxed font-medium block">
                {toast.message}
              </span>
            </div>

            {/* Close Column */}
            <button
              id={`dismiss-toast-btn-${toast.id}`}
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 p-1 rounded-full text-zinc-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
