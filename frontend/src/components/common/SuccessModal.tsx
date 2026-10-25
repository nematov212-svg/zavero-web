import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, PhoneCall, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { useTheme } from '../../hooks/useTheme';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadName?: string;
  businessName?: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  leadName,
  businessName,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#06B6D4', '#6366F1', '#F59E0B'],
        });
      } catch (e) {
        // ignore if canvas not supported
      }
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full max-w-md rounded-3xl p-6 sm:p-8 text-center shadow-2xl z-10 overflow-hidden border ${
              isDark 
                ? 'bg-[#0E1322] border-emerald-500/30' 
                : 'bg-white border-emerald-500/40'
            }`}
          >
            {/* Top glowing ambient effect */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative mb-5">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 mb-2 shadow-inner">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <div className="absolute -top-1 -right-1 flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-black shadow">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            <h3 
              className={`text-2xl font-black mb-2 tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
              style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}
            >
              Rahmat! Tez orada siz bilan bog'lanamiz.
            </h3>

            <p 
              className={`text-sm mb-6 leading-relaxed font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
              style={{ color: isDark ? '#CBD5E1' : '#334155' }}
            >
              {leadName ? (
                <strong 
                  className="font-bold" 
                  style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}
                >
                  {leadName}
                </strong>
              ) : (
                'Hurmatli mijoz'
              )}
              {businessName ? ` (${businessName})` : ''}, arizangiz muvaffaqiyatli qabul qilindi. Mutaxassisimiz 15 daqiqa ichida sizga qo'ng'iroq qiladi!
            </p>

            <div 
              className={`p-3.5 rounded-2xl mb-6 text-xs font-bold flex items-center justify-center gap-2 border ${
                isDark
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800'
              }`}
            >
              <PhoneCall className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Ish vaqti: Har kuni 09:00 - 21:00</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center shadow-lg shadow-red-500/20 py-3.5 text-base"
              onClick={onClose}
            >
              Tushunarli, rahmat!
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
