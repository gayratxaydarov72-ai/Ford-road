import React, { useState } from 'react';
import { X, Send, CheckCircle2, Sparkles, Mail, MessageSquare, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  title = "Let's Talk — Start a Commission"
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState('AI Web Architecture');
  const [budget, setBudget] = useState('$15k - $30k');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const projectTypes = [
    'AI Web Architecture',
    'Spatial 3D & WebGL',
    'Brand & Visual Identity',
    'Neural Voice & Vision Engine',
    'Exclusive Custom Platform'
  ];

  const budgetTiers = [
    '< $10k',
    '$10k - $25k',
    '$25k - $50k',
    '$50k+'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }, 900);
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setName('');
    setEmail('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0a0a0d] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#0e0e12]">
          <div>
            <span className="text-xs text-amber-400 font-semibold tracking-wider uppercase">Direct Inquiries</span>
            <h2 className="text-xl font-semibold text-white tracking-tight">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {isSubmitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Inquiry Received</h3>
              <p className="text-sm text-white/60 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="text-white font-medium">{name}</span>. Our principal creative directors have received your project parameters and will reach out to <span className="text-white font-medium">{email}</span> within 12 hours.
              </p>
              <button
                onClick={handleResetForm}
                className="mt-6 px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:scale-105 transition-all shadow-lg"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Vance"
                    className="w-full bg-white/5 border border-white/15 focus:border-white/40 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@studio.design"
                    className="w-full bg-white/5 border border-white/15 focus:border-white/40 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-2">Scope of Engagement</label>
                <div className="flex flex-wrap gap-2">
                  {projectTypes.map(t => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setProjectType(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                        projectType === t
                          ? 'bg-white text-black font-semibold shadow-md'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-2">Estimated Investment Range</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {budgetTiers.map(b => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => setBudget(b)}
                      className={`py-2 px-3 rounded-lg text-xs text-center transition-all ${
                        budget === b
                          ? 'bg-white text-black font-semibold shadow-md'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">Project Context & Vision</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your goals, timeline requirements, and visual ambitions..."
                  className="w-full bg-white/5 border border-white/15 focus:border-white/40 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none transition-colors custom-scrollbar resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-white/40 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Guaranteed response &lt; 12h
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting || !name || !email}
                  className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    'Transmitting Dispatch...'
                  ) : (
                    <>
                      Send Inquiry
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
