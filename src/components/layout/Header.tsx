
import { Menu, Info, BarChart2, Settings, Archive } from 'lucide-react';

interface HeaderProps {
  onStatsClick?: () => void;
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
  onHowToPlayClick?: () => void;
  currentPlayingDate?: string | null;
}

export function Header({ onStatsClick, onMenuClick, onSettingsClick, onHowToPlayClick, currentPlayingDate }: HeaderProps) {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const isPlayingArchive = currentPlayingDate && currentPlayingDate !== todayStr;
  
  // Parse the current playing date or use today
  const displayDate = currentPlayingDate ? new Date(currentPlayingDate + 'T00:00:00') : today;
  
  return (
    <header className="relative flex items-center justify-between px-4 py-2 border-b border-border h-16 w-full shrink-0">
      <div className="flex items-center gap-2">
        <button 
          onClick={onMenuClick}
          className="p-1 hover:bg-surface rounded-full transition-colors" 
          aria-label="Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <button 
          onClick={onHowToPlayClick}
          className="p-1 hover:bg-surface rounded-full transition-colors" 
          aria-label="How to Play"
        >
          <Info className="w-6 h-6" />
        </button>
      </div>
      
      <div className="absolute left-1/2 -translate-x-1/2 text-center">
        <h1 className="font-serif font-bold text-2xl tracking-tight">SEQUENCES</h1>
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-sans font-bold tracking-widest text-primary/60 uppercase">
          {isPlayingArchive && (
            <Archive className="w-3 h-3" />
          )}
          <span>
            {displayDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
         <button 
           onClick={onStatsClick}
           className="p-1 hover:bg-surface rounded-full transition-colors" 
           aria-label="Statistics"
         >
          <BarChart2 className="w-6 h-6" />
        </button>
        <button 
          onClick={onSettingsClick}
          className="p-1 hover:bg-surface rounded-full transition-colors" 
          aria-label="Settings"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
