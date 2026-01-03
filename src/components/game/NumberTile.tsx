import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx'; // Using clsx for conditional classes

interface NumberTileProps {
  value?: number | string;
  status?: 'default' | 'correct' | 'hint' | 'empty';
  label?: string; // Optional label e.g. "Hint 1"
  delay?: number;
  frontVariant?: 'default' | 'empty' | 'input';
  disableAnimations?: boolean;
}

export function NumberTile({ value, status = 'default', label, delay = 0, isInputTarget = false, inputValue = '', shake = false, frontVariant, disableAnimations = false }: NumberTileProps & { isInputTarget?: boolean; inputValue?: string; shake?: boolean }) {
  const isFlipped = status === 'correct' || status === 'hint';
  
  // Base classes for the card container
  const containerClasses = clsx(
      "relative w-full aspect-square perspective-1000",
      shake && "animate-shake"
  );
  
  // Inner card that rotates
  const cardClasses = "w-full h-full relative transition-all duration-500 transform-style-3d";
  
  // Common face styles
  const faceClasses = "absolute inset-0 w-full h-full flex items-center justify-center border-2 rounded-sm text-xl sm:text-2xl font-bold backface-hidden select-none";

  // Front face styles (Unrevealed / Input)
  // Logic: 
  // 1. If explicit frontVariant provided, use it.
  // 2. Else use isInputTarget / status logic.
  const isFrontEmpty = frontVariant === 'empty' || (!frontVariant && status === 'empty' && !isInputTarget);
  const isFrontInput = frontVariant === 'input' || (!frontVariant && isInputTarget);
  
  const frontClasses = clsx(
    faceClasses,
     // Input target gets special styling (e.g. blinking cursor underline effect effectively handled by value display)
    isFrontInput ? "bg-surface border-primary text-primary" : "bg-surface border-border text-primary",
    isFrontEmpty && "bg-transparent border-dashed text-primary/30"
  );

  // Back face styles (Revealed)
  const backClasses = clsx(
    faceClasses,
    "transform rotate-x-180", // Start rotated
    status === 'correct' ? "bg-correct border-border text-correct-content" : "bg-hint border-border text-hint-content"
  );
  
  // Snapshot input for smooth transitions
  const [frozenInput, setFrozenInput] = useState('');
  
  useEffect(() => {
    if (isInputTarget && inputValue) {
      setFrozenInput(inputValue);
    }
  }, [isInputTarget, inputValue]);

  // Display content logic:
  // 1. If actively typing (isInputTarget), show current inputValue.
  // 2. If it WAS the target (status changed to hint/correct), show the last frozen input on the front face.
  //    This ensures that during the flip, the front face still shows what the user typed ("11") 
  //    while the back face shows the result ("12").
  // 3. Otherwise show standard state (value or '?').
  
  let frontContent: React.ReactNode = '?';
  
  if (isInputTarget) {
      frontContent = inputValue || <span className="animate-pulse text-primary/20">_</span>;
  } else if (status === 'hint' || status === 'correct') {
      // Use frozen input if available, otherwise fallback to '?'
      // Note: If frozenInput is empty (e.g. submit empty?), logic in App prevents submission.
      frontContent = frozenInput || '?';
  } else if (status === 'default') {
      frontContent = value; // Revealed normal number
  } else {
      frontContent = '?'; // Empty future tile
  }

  return (
    <motion.div
      initial={disableAnimations ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={disableAnimations ? { duration: 0 } : { delay, type: "spring", stiffness: 300, damping: 20 }}
      className={containerClasses}
    >
        <motion.div
            className={cardClasses}
            initial={disableAnimations ? { rotateX: isFlipped ? 180 : 0 } : undefined}
            animate={{ rotateX: isFlipped ? 180 : 0 }}
            transition={disableAnimations ? { duration: 0 } : { duration: 0.6, type: "spring" }}
        >
            {/* Front Face */}
            <div className={frontClasses}>
                {frontContent} 
            </div>

            {/* Back Face */}
            <div className={backClasses}>
                {status === 'hint' && frozenInput && (
                    <span className="absolute top-1 right-1.5 text-[10px] sm:text-xs text-primary/40 font-mono">
                        {frozenInput}
                    </span>
                )}
                {value}
            </div>
        </motion.div>

        {label && (
         <span className={clsx(
             "absolute -bottom-6 left-0 right-0 text-center text-[10px] font-sans font-bold uppercase tracking-wider text-primary/50 transition-opacity duration-300",
             isInputTarget ? "opacity-100" : (status === 'empty' ? "opacity-0" : "opacity-100")
         )}>
           {label}
         </span>
       )}
    </motion.div>
  );
}
