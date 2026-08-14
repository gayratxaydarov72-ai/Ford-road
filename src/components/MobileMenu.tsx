import React from 'react';
import { Sparkles, Mic, ArrowRight } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onOpenAI: () => void;
  onOpenSpeech: () => void;
  onOpenProjects: () => void;
  onOpenStudio: () => void;
  onOpenReachUs: () => void;
  onOpenLetsTalk: () => void;
  onOpenAuth: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  setIsOpen,
  onOpenAI,
  onOpenSpeech,
  onOpenProjects,
  onOpenStudio,
  onOpenReachUs,
  onOpenLetsTalk,
  onOpenAuth
}) => {
  const handleNavClick = (callback?: () => void) => {
    setIsOpen(false);
    if (callback) {
      setTimeout(() => callback(), 150);
    }
  };

  return (
    <div
      className={`fixed inset-x-0 top-0 z-20 overflow-hidden bg-black/98 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
        isOpen
          ? 'h-screen opacity-100'
          : 'h-0 opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`flex h-full flex-col justify-center px-8 transition-all duration-500 delay-100 ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="flex flex-col space-y-6">
          <button
            onClick={() => handleNavClick()}
            className="text-left text-3xl font-medium text-white/90 hover:text-white transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick(onOpenProjects)}
            className="text-left text-3xl font-medium text-white/90 hover:text-white transition-colors"
          >
            Projects
          </button>
          <button
            onClick={() => handleNavClick(onOpenStudio)}
            className="text-left text-3xl font-medium text-white/90 hover:text-white transition-colors"
          >
            Studio
          </button>
          <button
            onClick={() => handleNavClick(onOpenReachUs)}
            className="text-left text-3xl font-medium text-white/90 hover:text-white transition-colors"
          >
            Reach Us
          </button>

          {/* AI Features in Mobile */}
          <div className="pt-4 border-t border-white/10 flex flex-col space-y-3">
            <button
              onClick={() => handleNavClick(onOpenAI)}
              className="flex items-center justify-between text-xl font-medium text-white bg-white/5 border border-white/10 px-5 py-3 rounded-2xl"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                AI Studio
              </span>
              <ArrowRight className="w-4 h-4 text-white/50" />
            </button>

            <button
              onClick={() => handleNavClick(onOpenSpeech)}
              className="flex items-center justify-between text-xl font-medium text-white bg-white/5 border border-white/10 px-5 py-3 rounded-2xl"
            >
              <span className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-lime-400" />
                Speech Synthesis
              </span>
              <ArrowRight className="w-4 h-4 text-white/50" />
            </button>
            
            <button
              onClick={() => handleNavClick(onOpenAuth)}
              className="text-left text-sm text-white/60 hover:text-white pt-2"
            >
              Google / Supabase OTP Authentication
            </button>
          </div>

          {/* Let's Talk CTA button */}
          <button
            onClick={() => handleNavClick(onOpenLetsTalk)}
            className="mt-6 rounded-full bg-white px-8 py-3.5 text-center text-base font-medium text-black hover:scale-105 active:scale-95 transition-transform shadow-xl shadow-white/20"
          >
            Let's Talk
          </button>
        </div>
      </div>
    </div>
  );
};
