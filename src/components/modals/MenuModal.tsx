
import { Modal } from '../ui/Modal';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArchiveClick: () => void;
  onAboutClick: () => void;
}

export function MenuModal({ isOpen, onClose, onArchiveClick, onAboutClick }: MenuModalProps) {
  const handleReportBug = () => {
    window.open('https://github.com/rpechuk/sequences-game/issues/new?template=bug_report.md', '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Menu">
       <nav className="space-y-2">
         <button 
           onClick={() => {
             onArchiveClick();
             onClose();
           }}
           className="w-full text-left p-3 hover:bg-surface rounded-lg font-bold"
         >
           Archive
         </button>
         <hr className="border-border my-2" />
         <button 
           onClick={handleReportBug}
           className="w-full text-left p-3 hover:bg-surface rounded-lg text-primary/70"
         >
           Report Bug
         </button>
         <button 
           onClick={() => {
             onAboutClick();
             onClose();
           }}
           className="w-full text-left p-3 hover:bg-surface rounded-lg text-primary/70"
         >
           About
         </button>
       </nav>
    </Modal>
  );
}
