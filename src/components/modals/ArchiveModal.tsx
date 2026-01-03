import { Modal } from '../ui/Modal';
import { Check, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useState, useMemo } from 'react';

interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  currentDate: string;
  completedDates: Record<string, 'won' | 'lost'>;
}

export function ArchiveModal({ isOpen, onClose, onSelectDate, currentDate, completedDates }: ArchiveModalProps) {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  // Generate all dates from Dec 1, 2025 to today
  const startDate = new Date(2025, 11, 1); // Dec 1, 2025
  
  // Get dates for the selected month/year
  const datesForMonth = useMemo(() => {
    const dates: Date[] = [];
    const monthStart = new Date(selectedYear, selectedMonth, 1);
    const monthEnd = new Date(selectedYear, selectedMonth + 1, 0);
    
    // Only show dates within our valid range (Dec 1, 2025 to today)
    const rangeStart = monthStart < startDate ? startDate : monthStart;
    const rangeEnd = monthEnd > today ? today : monthEnd;
    
    for (let d = new Date(rangeStart); d <= rangeEnd; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    
    return dates;
  }, [selectedMonth, selectedYear]);

  const formatDate = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const isFutureDate = (date: Date): boolean => {
    const dateStr = formatDate(date);
    const todayStr = formatDate(today);
    return dateStr > todayStr;
  };

  const handleDateClick = (date: Date) => {
    if (isFutureDate(date)) return;
    const dateStr = formatDate(date);
    onSelectDate(dateStr);
    onClose();
  };

  const canGoPrevious = () => {
    const prevMonth = new Date(selectedYear, selectedMonth - 1, 1);
    return prevMonth >= startDate;
  };

  const canGoNext = () => {
    const nextMonth = new Date(selectedYear, selectedMonth + 1, 1);
    return nextMonth <= today;
  };

  const goToPreviousMonth = () => {
    if (canGoPrevious()) {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    }
  };

  const goToNextMonth = () => {
    if (canGoNext()) {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  const monthYearDisplay = new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Archive">
      {/* Month/Year Navigation */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
        <button
          onClick={goToPreviousMonth}
          disabled={!canGoPrevious()}
          className={clsx(
            "p-2 rounded-lg transition-colors",
            canGoPrevious() ? "hover:bg-surface cursor-pointer" : "opacity-30 cursor-not-allowed"
          )}
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h3 className="font-serif font-bold text-lg">{monthYearDisplay}</h3>
        
        <button
          onClick={goToNextMonth}
          disabled={!canGoNext()}
          className={clsx(
            "p-2 rounded-lg transition-colors",
            canGoNext() ? "hover:bg-surface cursor-pointer" : "opacity-30 cursor-not-allowed"
          )}
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="max-h-[50vh] overflow-visible pr-2 -mr-2">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {datesForMonth.map((date) => {
            const dateStr = formatDate(date);
            const completionStatus = completedDates[dateStr];
            const isWon = completionStatus === 'won';
            const isLost = completionStatus === 'lost';
            const isCompleted = isWon || isLost;
            const isCurrent = dateStr === currentDate;
            const isFuture = isFutureDate(date);
            
            return (
              <button
                key={dateStr}
                onClick={() => handleDateClick(date)}
                disabled={isFuture}
                className={clsx(
                  "relative aspect-square rounded-lg transition-all duration-200",
                  "flex flex-col items-center justify-center p-2",
                  "font-sans text-xs sm:text-sm font-bold",
                  isFuture && "opacity-40 cursor-not-allowed",
                  !isFuture && "hover:scale-105 hover:shadow-lg cursor-pointer",
                  // Border style: dashed for current puzzle, solid otherwise
                  isCurrent && !isFuture && "border-2 border-dashed",
                  !isCurrent && "border-2",
                  // Border color and background based on state
                  isWon && "border-correct bg-correct/10",
                  isLost && "border-hint bg-hint/10",
                  !isCompleted && isCurrent && "border-primary bg-primary/10",
                  !isCompleted && !isCurrent && !isFuture && "border-border hover:border-primary/50",
                )}
              >
                <div className="text-center">
                  <div className={clsx(
                    "font-bold",
                    isWon && "text-correct",
                    isLost && "text-hint",
                    !isCompleted && isCurrent && "text-primary",
                  )}>
                    {date.getDate()}
                  </div>
                  <div className={clsx(
                    "text-[10px] uppercase tracking-wide",
                    isWon && "text-correct/70",
                    isLost && "text-hint/70",
                    !isCompleted && isCurrent && "text-primary/70",
                    !isCompleted && !isCurrent && "text-primary/50"
                  )}>
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                </div>
                
                {isWon && (
                  <div className="absolute top-1 right-1">
                    <Check className="w-3 h-3 text-correct" strokeWidth={3} />
                  </div>
                )}
                
                {isLost && (
                  <div className="absolute top-1 right-1">
                    <div className="w-3 h-3 text-hint font-bold text-xs leading-none">✕</div>
                  </div>
                )}
                
                {isFuture && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
                    <Lock className="w-4 h-4 text-primary/30" />
                  </div>
                )}
                

              </button>
            );
          })}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-4 text-xs text-primary/60">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded border-2 border-correct bg-correct/10" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded border-2 border-hint bg-hint/10" />
            <span>Failed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded border-2 border-border" />
            <span>Available</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
