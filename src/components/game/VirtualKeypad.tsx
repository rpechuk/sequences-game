
import { Delete } from 'lucide-react';
import { clsx } from 'clsx';

interface VirtualKeypadProps {
  onInput: (digit: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function VirtualKeypad({ onInput, onDelete, onSubmit, disabled }: VirtualKeypadProps) {
  const keys = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    'DEL', '0', 'ENTER'
  ];

  return (
    <div className="w-full max-w-sm mx-auto grid grid-cols-3 gap-2 p-2">
      {keys.map((key) => {
        const isDelete = key === 'DEL';
        const isEnter = key === 'ENTER';
        
        // Base styling
        const baseClasses = "h-14 sm:h-16 rounded-lg text-xl sm:text-2xl font-bold transition-all active:scale-95 flex items-center justify-center select-none touch-manipulation";
        
        // Color variants
        let colorClasses = "bg-surface hover:bg-border/50 text-primary border border-border";
        if (isEnter) {
            colorClasses = "bg-primary text-background border-primary hover:opacity-90";
        } else if (isDelete) {
            colorClasses = "bg-surface text-primary border border-border";
        }

        return (
          <button
            key={key}
            onClick={() => {
              if (isDelete) onDelete();
              else if (isEnter) onSubmit();
              else onInput(key);
            }}
            disabled={disabled}
            className={clsx(baseClasses, colorClasses, disabled && "opacity-50 cursor-not-allowed")}
            aria-label={isDelete ? "Backspace" : (isEnter ? "Submit" : key)}
          >
            {isDelete ? <Delete className="w-6 h-6" /> : (isEnter ? "ENTER" : key)}
          </button>
        );
      })}
    </div>
  );
}
