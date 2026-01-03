import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

export type SnackbarType = 'success' | 'info';

interface SnackbarProps {
  isOpen: boolean;
  message: string;
  subMessage?: string;
  type?: SnackbarType;
  onClose: () => void;
  autoHideDuration?: number;
}

export function Snackbar({ 
  isOpen, 
  message, 
  subMessage, 
  type = 'info', 
  onClose, 
  autoHideDuration = 3000 
}: SnackbarProps) {
  
  useEffect(() => {
    if (isOpen && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoHideDuration, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] w-auto max-w-[90%] pointer-events-none"
        >
          <div className={clsx(
            "rounded-lg shadow-xl px-6 py-3 text-center backdrop-blur-md border pointer-events-auto",
            type === 'success' 
              ? "bg-green-500/90 text-white border-green-400" 
              : "bg-primary/90 text-background border-primary/20"
          )}>
              <h4 className="font-bold text-lg leading-tight">{message}</h4>
              {subMessage && (
                <p className={clsx(
                  "text-sm leading-snug mt-1",
                  type === 'success' ? "text-green-50" : "text-primary/70"
                )}>
                  {subMessage}
                </p>
              )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
