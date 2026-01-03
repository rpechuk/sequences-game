import { Modal } from '../ui/Modal';
import { useGameStore } from '../../store/useGameStore';
import { clsx } from 'clsx';
import { getFullVersion } from '../../utils/version';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { isDarkMode, toggleDarkMode, isHighContrastMode, toggleHighContrastMode } = useGameStore();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold">Dark Mode</div>
            <div className="text-xs text-primary/60">Toggle dark theme</div>
          </div>
          <button 
            onClick={toggleDarkMode}
            className={clsx(
              "w-12 h-6 rounded-full relative transition-colors duration-200",
              isDarkMode ? "bg-correct border-transparent" : "bg-surface border border-border"
            )}
          >
             <div className={clsx(
               "absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition-all duration-200",
               isDarkMode ? "left-7 bg-white" : "left-1 bg-primary/20"
             )} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold">High Contrast</div>
            <div className="text-xs text-primary/60">For better visibility</div>
          </div>
           <button 
            onClick={toggleHighContrastMode}
            className={clsx(
              "w-12 h-6 rounded-full relative transition-colors duration-200",
              isHighContrastMode ? "bg-correct border-transparent" : "bg-surface border border-border"
            )}
          >
             <div className={clsx(
               "absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition-all duration-200",
               isHighContrastMode ? "left-7 bg-white" : "left-1 bg-primary/20"
             )} />
          </button>
        </div>
        
        <div className="pt-4 border-t border-border">
           <div className="text-xs text-center text-primary/40 text-mono">
             {getFullVersion()}
           </div>
        </div>
      </div>
    </Modal>
  );
}
