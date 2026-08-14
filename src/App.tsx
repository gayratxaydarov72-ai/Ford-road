import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MobileMenu } from './components/MobileMenu';
import { Hero } from './components/Hero';
import { AIStudioModal } from './components/AIStudioModal';
import { SpeechStudioModal } from './components/SpeechStudioModal';
import { ProjectsModal } from './components/ProjectsModal';
import { StudioModal } from './components/StudioModal';
import { ContactModal } from './components/ContactModal';
import { AuthModal } from './components/AuthModal';

export const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [speechModalOpen, setSpeechModalOpen] = useState(false);
  const [projectsModalOpen, setProjectsModalOpen] = useState(false);
  const [studioModalOpen, setStudioModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactTitle, setContactTitle] = useState("Let's Talk — Start a Commission");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [pendingModal, setPendingModal] = useState<'ai' | 'speech' | null>(null);

  // Check persisted user session
  useEffect(() => {
    const savedUser = localStorage.getItem('foldcraft_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.email) setUserEmail(parsed.email);
      } catch {
        // ignore
      }
    }
  }, []);

  const handleOpenAI = () => {
    if (!userEmail) {
      setPendingModal('ai');
      setAuthModalOpen(true);
    } else {
      setAiModalOpen(true);
    }
  };

  const handleOpenSpeech = () => {
    if (!userEmail) {
      setPendingModal('speech');
      setAuthModalOpen(true);
    } else {
      setSpeechModalOpen(true);
    }
  };

  const handleOpenLetsTalk = () => {
    setContactTitle("Let's Talk — Start a Commission");
    setContactModalOpen(true);
  };

  const handleOpenReachUs = () => {
    setContactTitle("Reach Us — Studio Headquarters");
    setContactModalOpen(true);
  };

  const handleAuthSuccess = (email: string) => {
    setUserEmail(email);
    if (pendingModal === 'ai') {
      setAiModalOpen(true);
    } else if (pendingModal === 'speech') {
      setSpeechModalOpen(true);
    }
    setPendingModal(null);
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black font-geist select-none">
      {/* Background Video and Cinematic Hero */}
      <Hero
        onExploreWork={() => setProjectsModalOpen(true)}
        onOpenAI={handleOpenAI}
        onOpenSpeech={handleOpenSpeech}
      />

      {/* Top Fixed Navbar (z-30) */}
      <div className="absolute top-0 inset-x-0 z-30">
        <Navbar
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          onOpenAI={handleOpenAI}
          onOpenSpeech={handleOpenSpeech}
          onOpenProjects={() => setProjectsModalOpen(true)}
          onOpenStudio={() => setStudioModalOpen(true)}
          onOpenReachUs={handleOpenReachUs}
          onOpenLetsTalk={handleOpenLetsTalk}
          onOpenAuth={() => setAuthModalOpen(true)}
          userEmail={userEmail}
        />
      </div>

      {/* Fullscreen Mobile Menu Overlay (z-20) */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
        onOpenAI={handleOpenAI}
        onOpenSpeech={handleOpenSpeech}
        onOpenProjects={() => setProjectsModalOpen(true)}
        onOpenStudio={() => setStudioModalOpen(true)}
        onOpenReachUs={handleOpenReachUs}
        onOpenLetsTalk={handleOpenLetsTalk}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* AI Studio Modal */}
      <AIStudioModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onOpenSpeech={handleOpenSpeech}
      />

      {/* Neural Speech TTS Studio Modal */}
      <SpeechStudioModal
        isOpen={speechModalOpen}
        onClose={() => setSpeechModalOpen(false)}
        onOpenAI={handleOpenAI}
      />

      {/* Projects Showcase Modal */}
      <ProjectsModal
        isOpen={projectsModalOpen}
        onClose={() => setProjectsModalOpen(false)}
        onOpenLetsTalk={handleOpenLetsTalk}
      />

      {/* Studio Manifesto Modal */}
      <StudioModal
        isOpen={studioModalOpen}
        onClose={() => setStudioModalOpen(false)}
        onOpenLetsTalk={handleOpenLetsTalk}
      />

      {/* Contact & Let's Talk Inquiries Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        title={contactTitle}
      />

      {/* Google / Supabase OTP Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setPendingModal(null);
        }}
        onSuccess={handleAuthSuccess}
      />
    </main>
  );
};
export default App;
