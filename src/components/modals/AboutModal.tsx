import { Modal } from '../ui/Modal';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="About">
      <div className="space-y-4">
        <div>
          <h3 className="font-serif font-bold text-xl mb-2">SEQUENCES</h3>
          <p className="text-sm text-primary/70">
            A daily number sequence puzzle game. Discover the pattern and complete the sequence!
          </p>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="font-serif font-bold text-xl mb-2">CREATOR</h3>
          <div className="flex flex-col items-center text-center">
            <p className="text-sm text-primary/70 mb-2">
              Hey! I'm <span className="font-semibold">Ron Pechuk</span> 👋
            </p>
            <img 
              src="https://media.licdn.com/dms/image/v2/C5603AQFWKHLCI10NxQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1655058373835?e=1769040000&v=beta&t=qrvw5YKquvfxfFcehrXVd5or-QLN6lCplnlfQAfz1K0"
              alt="Ron Pechuk"
              className="w-20 h-20 rounded-full object-cover mb-3"
            />
            <p className="text-sm text-primary/70 max-w-md">
              I love building things that make people think. When I'm not working on deployment infrastructure at Google, 
              I enjoy creating puzzle games like this one. Hope you're having fun!
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-primary/50 text-center">
            Made with ❤️ for puzzle enthusiasts • v1.0.0
          </p>
        </div>
      </div>
    </Modal>
  );
}
