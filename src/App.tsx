import { useEffect, useState, useCallback, useRef } from 'react';
import { Layout } from './components/layout/Layout';
import { SequenceRow } from './components/game/SequenceRow';
import { VirtualKeypad } from './components/game/VirtualKeypad';
import { StatsModal } from './components/modals/StatsModal';
import { HowToPlayModal } from './components/modals/HowToPlayModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { MenuModal } from './components/modals/MenuModal';
import { ArchiveModal } from './components/modals/ArchiveModal';
import { AboutModal } from './components/modals/AboutModal';
import { useGameStore } from './store/useGameStore';
import { clsx } from 'clsx';
import { Snackbar } from './components/ui/Snackbar';
import { GAME_CONFIG, WIN_MESSAGES, LOSS_MESSAGES } from './lib/constants';

function App() {
  const { initGame, loadPuzzleByDate, submitGuess, gameStatus, dailySequence, isDarkMode, isHighContrastMode, completedDates, currentPlayingDate } = useGameStore();
  const [inputValue, setInputValue] = useState('');
  const [shakingTileIndex, setShakingTileIndex] = useState<number | null>(null);
  const [overrideActiveIndex, setOverrideActiveIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  
  const isGameOver = gameStatus === 'won' || gameStatus === 'lost';
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');

  // Capture game status at mount to prevent animations on reload if already done
  const [initialGameStatus] = useState(() => gameStatus);
  const [isArchiveLoad, setIsArchiveLoad] = useState(false);

  // Track previous date to detect switching
  const prevPlayingDate = useRef(currentPlayingDate);

  // Determine if we just switched dates
  // We check this synchronously during render to affect the initial render of the new date's components
  const isDateSwitch = prevPlayingDate.current !== currentPlayingDate;

  // Disable animations if:
  // 1. Initial load and game is already over
  // 2. We just switched dates and the new game is already over (loading a completed archive puzzle)
  const disableAnimations = (!isArchiveLoad && (initialGameStatus === 'won' || initialGameStatus === 'lost')) || 
                           (isDateSwitch && (gameStatus === 'won' || gameStatus === 'lost'));

  const handleInput = useCallback((digit: string) => {
    if (!isProcessing && inputValue.length < 6) { 
      setInputValue(prev => prev + digit);
    }
  }, [inputValue, isProcessing]);

  const handleDelete = useCallback(() => {
     if (!isProcessing) {
        setInputValue(prev => prev.slice(0, -1));
     }
  }, [isProcessing]);

  const handleSubmit = useCallback(() => {
    if (!inputValue || isProcessing) return;
    const num = parseInt(inputValue, 10);
    
    const { dailySequence, hintsLevel } = useGameStore.getState();
    if (!dailySequence) return;
    
    setIsProcessing(true);

    const visibleCount = GAME_CONFIG.INITIAL_VISIBLE_COUNT; 
    const targetIndex = visibleCount + hintsLevel;
    const target = dailySequence.numbers[targetIndex];
    
    // Lock visual focus to the current tile during animation
    setOverrideActiveIndex(targetIndex);
    
    if (num !== target) {
        setShakingTileIndex(targetIndex);
        
        setTimeout(() => {
            setShakingTileIndex(null);
            submitGuess(num);
             
            // Wait for flip animation
            setTimeout(() => {
                 setInputValue('');
                 setOverrideActiveIndex(null);
                 setIsProcessing(false);
            }, 600);
            
        }, 500);
    } else {
        submitGuess(num);
        
        // Wait for flip animation
        setTimeout(() => {
            setInputValue(''); // Clear input AFTER flip
            setOverrideActiveIndex(null);
            setIsProcessing(false);
        }, 600);
    }
  }, [inputValue, submitGuess, isProcessing]);

  useEffect(() => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    initGame(today);
  }, [initGame]);

  const handleArchiveDateSelect = useCallback((date: string) => {
    setIsArchiveLoad(true);
    loadPuzzleByDate(date);
  }, [loadPuzzleByDate]);

  // Handle Game Over sequence: Snackbar -> Stats Modal
  useEffect(() => {
    // Show completion sequence if:
    // 1. It's a normal daily game (not archive load)
    // 2. OR it's an archive game that we JUST completed (transitioned from playing)
    // AND: We are not just loading a different date that happens to be complete
    const justCompleted = prevGameStatus.current === 'playing' && isGameOver;
    const dateChanged = prevPlayingDate.current !== currentPlayingDate;
    
    // If the date changed, we usually don't want to show the sequence (it's just loading a completed puzzle)
    // Unless we want to support some edge case, but generally loading a completed puzzle shouldn't trigger celebration
    const shouldShowSequence = isGameOver && (!isArchiveLoad || justCompleted) && !dateChanged;

    if (shouldShowSequence) {
      if (disableAnimations) {
        setShowStats(true);
      } else {
        const snackbarDelay = setTimeout(() => {
            const messages = gameStatus === 'won' ? WIN_MESSAGES : LOSS_MESSAGES;
            setCompletionMessage(messages[Math.floor(Math.random() * messages.length)]);
            setShowSnackbar(true);
            setTimeout(() => {
                setShowSnackbar(false);
                setShowStats(true);
            }, 2000);
        }, 1000);

        return () => clearTimeout(snackbarDelay);
      }
    }
  }, [isGameOver, disableAnimations, gameStatus, isArchiveLoad, currentPlayingDate]);

  // Track previous game status to detect completion transitions
  const prevGameStatus = useRef(gameStatus);
  useEffect(() => {
    prevGameStatus.current = gameStatus;
  }, [gameStatus]);

  // Track previous date
  useEffect(() => {
    prevPlayingDate.current = currentPlayingDate;
  }, [currentPlayingDate]);


  // Theme Effects
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (isHighContrastMode) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [isHighContrastMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver || showStats || showMenu || showSettings || showHowToPlay || showArchive || showAbout) return;
      
      if (e.key >= '0' && e.key <= '9') {
        handleInput(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter') {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, showStats, showMenu, showSettings, showHowToPlay, showArchive, showAbout, handleInput, handleDelete, handleSubmit]);

  return (
    <Layout 
      onStatsClick={() => setShowStats(true)}
      onMenuClick={() => setShowMenu(true)}
      onSettingsClick={() => setShowSettings(true)}
      onHowToPlayClick={() => setShowHowToPlay(true)}
      currentPlayingDate={currentPlayingDate}
    >
      <Snackbar 
        isOpen={showSnackbar}
        onClose={() => setShowSnackbar(false)}
        message={completionMessage}
        type="info"
        autoHideDuration={2000}
      />
      <StatsModal 
        isOpen={showStats} 
        onClose={() => setShowStats(false)} 
        onArchiveClick={() => {
          setShowStats(false);
          setShowArchive(true);
        }}
      />
      <HowToPlayModal isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <MenuModal 
        isOpen={showMenu} 
        onClose={() => setShowMenu(false)}
        onArchiveClick={() => setShowArchive(true)}
        onAboutClick={() => setShowAbout(true)}
      />
      <ArchiveModal
        isOpen={showArchive}
        onClose={() => setShowArchive(false)}
        onSelectDate={handleArchiveDateSelect}
        currentDate={currentPlayingDate || ''}
        completedDates={completedDates}
      />
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
      
      <div className="w-full flex-1 flex flex-col justify-between">
        <div className="flex-1 flex flex-col items-center justify-center">
            
            {dailySequence && (
               <div className="flex-1 flex flex-col justify-center w-full">
                   <h2 className="text-xs sm:text-sm font-sans text-primary/60 uppercase tracking-widest mb-2 text-center">
                       {gameStatus === 'won' ? 'Sequence Complete!' : 'Complete the Sequence'}
                   </h2>
                   <SequenceRow 
                        key={currentPlayingDate}
                        inputValue={inputValue} 
                        shakingTileIndex={shakingTileIndex} 
                        activeTileIndex={overrideActiveIndex}
                        disableAnimations={disableAnimations}
                   />
               </div>
            )}
        </div>

        {/* Keypad */}
        <div className={clsx("w-full transition-opacity duration-500", isGameOver && "opacity-50 pointer-events-none")}>
            <VirtualKeypad 
                onInput={handleInput} 
                onDelete={handleDelete} 
                onSubmit={handleSubmit}
                disabled={isGameOver} 
            />
        </div>
      </div>
    </Layout>
  );
}

export default App;
