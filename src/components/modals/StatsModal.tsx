
import { Modal } from '../ui/Modal';
import { useGameStore } from '../../store/useGameStore';
import { Share2, Archive } from 'lucide-react';
import { GAME_CONFIG } from '../../lib/constants';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArchiveClick?: () => void;
}

const StatItem = ({ label, value }: { label: string, value: string | number }) => (
  <div className="flex flex-col items-center">
    <div className="text-2xl sm:text-3xl font-bold font-mono">{value}</div>
    <div className="text-xs uppercase tracking-wider text-center text-primary/60">{label}</div>
  </div>
);

export function StatsModal({ isOpen, onClose, onArchiveClick }: StatsModalProps) {
  const { stats, gameStatus, hintsLevel, dailySequence, guesses } = useGameStore();

  const handleShare = async () => {
    // Generate share text
    const date = new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
    const isWon = gameStatus === 'won';
    const result = isWon ? 'Solved' : 'Failed';
    const attempts = guesses.length;
    
    
    // Generate grid
    // Row 1 & 2: Visible numbers (Clues) - Always White
    const row1 = '⬜⬜⬜';
    const row2 = '⬜⬜⬜';
    
    // Row 3: Hidden numbers - Dynamic based on results
    let row3 = '';
    const totalHidden = GAME_CONFIG?.HIDDEN_COUNT || 3; // Fallback to 3 if undefined, strictly it's SEQUENCE_LENGTH - INITIAL_VISIBLE_COUNT
    
    for (let i = 0; i < totalHidden; i++) {
        if (gameStatus === 'won') {
             // If we won, indices before the win-level are Red (missed), 
             // current and subsequent are Green (Solved/Revealed)
             if (i < hintsLevel) {
                 row3 += '🟥';
             } else {
                 row3 += '🟩';
             }
        } else if (gameStatus === 'lost') {
             // If lost, all were attempted and failed (or we gave up)
             // simplified: Red for all attempted, which in a loss is all of them
             row3 += '🟥';
        } else {
             // Playing state (should be rare for share, but handle it)
             if (i < hintsLevel) {
                 row3 += '🟥';
             } else {
                 row3 += '⬜'; // Unknown/Pending
             }
        }
    }

    const grid = `${row1}\n${row2}\n${row3}`;

    const text = `Sequences ${date}\n${result} in ${attempts}\n\n${grid}\nhttps://sequences-game.com`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        console.log('Share canceled');
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };



  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Statistics">
       <div className="flex justify-between mb-8">
         <StatItem label="Played" value={stats.played} />
         <StatItem label="Win %" value={stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0} />
         <StatItem label="Streak" value={stats.currentStreak} />
         <StatItem label="Max Streak" value={stats.maxStreak} />
       </div>
       
       <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Guess Distribution</h3>
       <div className="flex pb-4">
          <div className="flex flex-col gap-2 border-r border-border w-8 py-2">
            {[1, 2, 3].map((attempts) => (
              <div key={attempts} className="h-6 flex items-center justify-center">
                <span className="font-mono text-sm">{attempts}</span>
              </div>
            ))}
          </div>
          <div className="flex-1 flex flex-col gap-2 py-2">
            {[1, 2, 3].map((attempts) => {
              const count = stats.guessDistribution[attempts] || 0;
              const max = Math.max(...Object.values(stats.guessDistribution), 1);
              const width = Math.max((count / max) * 100, 7);
              
              return (
                <div key={attempts} className="h-6 flex items-center">
                   <div 
                     className={(attempts === (hintsLevel + 1) && gameStatus === 'won' ? "bg-correct text-correct-content" : "bg-surface text-primary") + " pl-2 pr-4 border border-l-0 border-border rounded-r-xl flex items-center h-full"}
                     style={{ width: `${width}%` }}
                   >
                     <span className="text-xs font-bold">{count}</span>
                   </div>
                </div>
              );
            })}
          </div>
       </div>

       {gameStatus !== 'playing' && (
         <div className="border-t border-border pt-4">
            {dailySequence && (
              <div className="mb-6 bg-surface rounded-lg p-4 text-center">
                <h3 className="font-bold text-xs uppercase tracking-widest mb-1 text-primary/60">Sequence Explanation</h3>
                <div className="font-bold text-lg mb-1">{dailySequence.patternName}</div>
                <p className="text-sm opacity-80 mb-3 leading-relaxed">{dailySequence.explanation}</p>
                <div className="flex flex-wrap justify-center gap-1.5 font-mono text-sm">
                    {dailySequence.numbers.map((n, i) => (
                        <span key={i} className="bg-background/50 px-2 py-1 rounded border border-border/50">
                            {n}
                        </span>
                    ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-center gap-3">
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 bg-correct text-correct-content border-2 border-correct px-6 py-2 text-sm rounded-full font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Share <Share2 className="w-4 h-4" />
              </button>
              
              {onArchiveClick && (
                <button 
                  onClick={onArchiveClick}
                  className="flex items-center gap-2 bg-surface text-primary border-2 border-border px-6 py-2 text-sm rounded-full font-bold uppercase tracking-widest hover:bg-border/50 transition-all"
                >
                  Archive <Archive className="w-4 h-4" />
                </button>
              )}
            </div>
         </div>
       )}
    </Modal>
  );
}
