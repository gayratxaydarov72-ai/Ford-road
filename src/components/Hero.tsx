import React from 'react';
import { ArrowRight, Sparkles, Mic } from 'lucide-react';

interface HeroProps {
  onExploreWork: () => void;
  onOpenAI: () => void;
  onOpenSpeech: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreWork,
  onOpenAI,
  onOpenSpeech
}) => {
  return (
    <>
      {/* Video Background:
          - URL: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204221_5339e40b-e73d-4ab0-9c65-79c18c66fd50.mp4
          - Attributes: autoPlay, muted, loop, playsInline
          - Styling: absolute positioned, full width/height, object-cover, object-position at 70% horizontal center
          - The video sits behind all content (no z-index or z-0)
      */}
      <video
        className="absolute inset-0 h-full w-full object-cover [object-position:70%_center] pointer-events-none select-none"
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204221_5339e40b-e73d-4ab0-9c65-79c18c66fd50.mp4"
          type="video/mp4"
        />
      </video>

      {/* Subtle cinematic gradient overlay to ensure contrast without sacrificing video brilliance */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

      {/* Hero Content (z-10):
          - Flex column, justify-between, fills remaining height: h-[calc(100vh-80px)]
          - Padding: px-6 pb-10 pt-12 sm:pb-12 sm:pt-16 md:px-12 md:pb-16 md:pt-20 lg:px-16
      */}
      <div className="relative z-10 flex h-[calc(100vh-80px)] flex-col justify-between px-6 pb-10 pt-12 sm:pb-12 sm:pt-16 md:px-12 md:pb-16 md:pt-20 lg:px-16">
        
        {/* Top Section (max-w-3xl) */}
        <div className="max-w-3xl">
          {/* Badge: "Brand & Visual Storytelling" */}
          <div className="mb-4 sm:mb-6 animate-[fadeSlideUp_0.8s_ease_0.2s_both]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1 text-xs sm:text-sm text-white/90 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              Brand & Visual Storytelling
            </span>
          </div>

          {/* Heading h1 */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight text-white animate-[fadeSlideUp_0.8s_ease_0.4s_both]">
            Shaping visual <br className="hidden sm:inline" />
            narratives, <br />
            one pixel at a time.
          </h1>
        </div>

        {/* Bottom Section */}
        <div>
          {/* Paragraph */}
          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-white/60 max-w-sm sm:max-w-lg mb-5 sm:mb-6 animate-[fadeSlideUp_0.8s_ease_0.7s_both]">
            Turning vision into reality through craft, motion, and an endless pursuit of beauty.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 animate-[fadeSlideUp_0.8s_ease_0.9s_both]">
            {/* Main Explore Work button */}
            <button
              onClick={onExploreWork}
              className="rounded-lg bg-white px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-medium text-black hover:scale-105 transition-transform inline-flex items-center gap-2 shadow-xl shadow-white/10 active:scale-95"
            >
              Explore Work
              <ArrowRight size={16} />
            </button>

            {/* AI Studio trigger */}
            <button
              onClick={onOpenAI}
              className="rounded-lg bg-black/50 border border-white/25 backdrop-blur-md px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-medium text-white hover:bg-white/15 hover:scale-105 transition-all inline-flex items-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              Launch AI Studio
            </button>

            {/* Speech Studio trigger */}
            <button
              onClick={onOpenSpeech}
              className="rounded-lg bg-black/50 border border-white/25 backdrop-blur-md px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-medium text-white hover:bg-white/15 hover:scale-105 transition-all inline-flex items-center gap-2 active:scale-95"
            >
              <Mic className="w-4 h-4 text-lime-400" />
              Voice Synthesis
            </button>
          </div>
        </div>

      </div>
    </>
  );
};
