
import { useGameStore } from '../../store/useGameStore';
import { NumberTile } from './NumberTile';
import { GAME_CONFIG } from '../../lib/constants';

interface SequenceRowProps {
  inputValue?: string;
  shakingTileIndex?: number | null;
  activeTileIndex?: number | null;
  disableAnimations?: boolean;
}

export function SequenceRow({ inputValue = '', shakingTileIndex = null, activeTileIndex = null, disableAnimations = false }: SequenceRowProps) {
  const { dailySequence, hintsLevel, gameStatus } = useGameStore();

  if (!dailySequence) return null;

  const { numbers } = dailySequence;
  const totalLength = numbers.length;
  const visibleCount = GAME_CONFIG.INITIAL_VISIBLE_COUNT;
  
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 my-4 w-full max-w-[260px] sm:max-w-[300px] place-items-center mx-auto">
      {numbers.map((num, idx) => {
        let status: 'default' | 'correct' | 'hint' | 'empty' = 'default';
        let content: number | string | undefined = num;
        let isVisible = false;
        let label = '';

        // Determine current target index based on hints used (0 hints = index 6, 1 hint = index 7, etc.)
        // visibleCount is 6.
        const currentTargetIndex = visibleCount + hintsLevel;
        
        const isInputTarget = activeTileIndex !== null 
            ? idx === activeTileIndex 
            : (idx === currentTargetIndex && gameStatus === 'playing');

        let frontVariant: 'default' | 'empty' | 'input' | undefined;

        if (gameStatus === 'won') {
             isVisible = true;
             
             if (idx < visibleCount) {
                 status = 'default';
             } else if (idx < currentTargetIndex) {
                 status = 'hint';
             } else if (idx === currentTargetIndex) {
                 status = 'correct';
                 frontVariant = 'input';
             } else {
                 status = 'correct';
                 frontVariant = 'empty';
             }
             
             if (idx === totalLength - 1) label = ''; 
        } else if (gameStatus === 'lost') {
             isVisible = true;
             
             if (idx < visibleCount) {
                 status = 'default';
             } else if (idx < currentTargetIndex) {
                 status = 'hint';
             } else {
                 status = 'default'; 
             }
        } else {
             // Playing state
             if (idx < visibleCount) {
                 // The initial 6 numbers
                 isVisible = true;
                 status = 'default';
             } else if (idx < currentTargetIndex) {
                 isVisible = true;
                 status = 'hint';
             } else if (idx === currentTargetIndex) {
                 isVisible = false;
                 status = 'empty';
                 content = undefined; 
             } else {
                 isVisible = false;
                 status = 'empty';
                 content = undefined;
             }
        }

        return (
          <NumberTile 
            key={idx}
            value={isVisible ? content : '?'} 
            status={status}
            label={label}
            delay={idx * 0.1} // faster staggered delay for 9 items
            isInputTarget={isInputTarget}
            inputValue={inputValue}
            shake={idx === shakingTileIndex}
            frontVariant={frontVariant}
            disableAnimations={disableAnimations}
          />
        );
      })}
    </div>
  );
}
