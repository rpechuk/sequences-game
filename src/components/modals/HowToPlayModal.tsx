
import { Modal } from '../ui/Modal';
import { NumberTile } from '../game/NumberTile';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How To Play">
      <section className="space-y-4 text-sm sm:text-base">
        <p>Guess the hidden number to complete the sequence.</p>
        
        <div className="my-4">
           <p className="font-bold mb-2">Example</p>
           <div className="flex gap-2">
             <NumberTile value={2} status="default" />
             <NumberTile value={4} status="default" />
             <NumberTile value={8} status="default" />
             <NumberTile value="?" status="empty" />
           </div>
           <p className="mt-2 text-primary/80">The pattern is multiply by 2. The answer is <strong>16</strong>.</p>
        </div>

        <ul className="list-disc pl-5 space-y-2">
          <li>Enter numbers using the on-screen keypad or your keyboard.</li>
          <li>If your guess is <strong>wrong</strong>, a new number will be revealed as a hint.</li>
          <li>You have <strong>3 hints</strong> before the game ends.</li>
          <li>A new puzzle is released every day at midnight.</li>
        </ul>
      </section>
    </Modal>
  );
}
