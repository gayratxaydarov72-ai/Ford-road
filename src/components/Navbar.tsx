import React from 'react';
import { Menu, X, Sparkles, Mic, User } from 'lucide-react';

interface NavbarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onOpenAI: () => void;
  onOpenSpeech: () => void;
  onOpenProjects: () => void;
  onOpenStudio: () => void;
  onOpenReachUs: () => void;
  onOpenLetsTalk: () => void;
  onOpenAuth: () => void;
  userEmail?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  onOpenAI,
  onOpenSpeech,
  onOpenProjects,
  onOpenStudio,
  onOpenReachUs,
  onOpenLetsTalk,
  onOpenAuth,
  userEmail
}) => {
  return (
    <header className="relative z-30 flex items-center justify-between px-6 py-5 md:px-12 lg:px-16 w-full">
      {/* Left side: Logo text followed by desktop nav links */}
      <div className="flex items-center gap-8 lg:gap-12">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-lg font-semibold tracking-tight text-white sm:text-xl hover:opacity-90 transition-opacity flex items-center gap-2 group text-left"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-white group-hover:scale-125 transition-transform"></span>
          Foldcraft
        </button>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-sm text-white/80 hover:text-white transition-colors"
          >
            Home
          </button>
          <button 
            onClick={onOpenProjects}
            className="text-sm text-white/80 hover:text-white transition-colors"
          >
            Projects
          </button>
          <button 
            onClick={onOpenStudio}
            className="text-sm text-white/80 hover:text-white transition-colors"
          >
            Studio
          </button>
          <button 
            onClick={onOpenReachUs}
            className="text-sm text-white/80 hover:text-white transition-colors"
          >
            Reach Us
          </button>

          {/* AI Feature Direct Links */}
          <div className="h-4 w-px bg-white/20 mx-1" />

          <button
            onClick={onOpenAI}
            className="text-xs font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,255,255,0.07)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            AI Studio
          </button>

          <button
            onClick={onOpenSpeech}
            className="text-xs font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all"
          >
            <Mic className="w-3.5 h-3.5 text-lime-400" />
            Speech
          </button>
        </nav>
      </div>

      {/* Right side: Desktop actions & Mobile hamburger */}
      <div className="flex items-center gap-4">
        {/* User Auth Status / Trigger */}
        <button
          onClick={onOpenAuth}
          className="hidden sm:flex items-center gap-2 text-xs text-white/70 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
          title={userEmail ? `Logged in as ${userEmail}` : 'Sign in with Google OTP'}
        >
          <User className="w-3.5 h-3.5" />
          <span className="max-w-[120px] truncate">{userEmail ? userEmail.split('@')[0] : 'OTP Sign In'}</span>
        </button>

        {/* Right side (desktop): Let's Talk button */}
        <button
          onClick={onOpenLetsTalk}
          className="hidden md:inline-flex rounded-lg bg-white px-5 py-2 text-sm font-medium text-black hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-white/10"
        >
          Let's Talk
        </button>

        {/* Right side (mobile): hamburger toggle button (40x40, z-50) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur-md active:scale-90 transition-transform md:hidden"
        >
          <div className="relative h-5 w-5">
            <Menu
              className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                mobileMenuOpen
                  ? 'rotate-90 scale-0 opacity-0'
                  : 'rotate-0 scale-100 opacity-100'
              }`}
            />
            <X
              className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                mobileMenuOpen
                  ? 'rotate-0 scale-100 opacity-100'
                  : '-rotate-90 scale-0 opacity-0'
              }`}
            />
          </div>
        </button>
      </div>
    </header>
  );
};
