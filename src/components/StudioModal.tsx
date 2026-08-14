import React from 'react';
import { X, Award, Compass, Layers, Eye, Sparkles } from 'lucide-react';

interface StudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLetsTalk?: () => void;
}

export const StudioModal: React.FC<StudioModalProps> = ({
  isOpen,
  onClose,
  onOpenLetsTalk
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#09090b] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#0e0e12]">
          <div>
            <span className="text-xs text-amber-400 font-semibold tracking-wider uppercase">Manifesto & Practice</span>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">The Foldcraft Philosophy</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar space-y-8 flex-1">
          {/* Main Statement */}
          <div className="border-l-2 border-white/40 pl-4 sm:pl-6 py-1">
            <p className="text-lg sm:text-xl font-medium text-white/95 leading-relaxed">
              "We fuse precision engineering, computational motion, and multimodal intelligence to sculpt visual languages that redefine how brands inhabit digital space."
            </p>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Hyper-Crafted Motion</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                60fps physics-driven interactions with custom easing cubic-beziers designed for sensory delight and emotional resonance.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center text-lime-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Neural Generative Pipelines</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Seamless real-time AI reasoning, multi-modal vision synthesis, and neural speech engines embedded into native web surfaces.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-blue-300">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Spatial Design Systems</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Multi-dimensional depth tokens, glassmorphism physics, and typographic hierarchies scaled for next-generation spatial computing.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-purple-300">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Exclusivity & Distinction</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Bespoke digital presences engineered for industry leaders, pioneering tech studios, and visionary creative founders.
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-white/10 via-white/5 to-transparent border border-white/15 flex flex-wrap items-center justify-around gap-4 text-center">
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-white block">100%</span>
              <span className="text-[11px] text-white/50 uppercase tracking-wider">Custom Codebase</span>
            </div>
            <div className="h-8 w-px bg-white/10 hidden sm:block" />
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-white block">60 FPS</span>
              <span className="text-[11px] text-white/50 uppercase tracking-wider">Hardware Accelerated</span>
            </div>
            <div className="h-8 w-px bg-white/10 hidden sm:block" />
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-white block">Multi-AI</span>
              <span className="text-[11px] text-white/50 uppercase tracking-wider">Vision & Voice Integrated</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0e0e12] flex items-center justify-between">
          <span className="text-xs text-white/50">Foldcraft — Studio Headquarters & Creative Lab</span>
          <button
            onClick={() => {
              onClose();
              if (onOpenLetsTalk) onOpenLetsTalk();
            }}
            className="rounded-xl bg-white px-5 py-2 text-xs font-semibold text-black hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            Initiate Dialogue
          </button>
        </div>
      </div>
    </div>
  );
};
