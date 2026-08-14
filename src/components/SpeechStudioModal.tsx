import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  RotateCcw,
  Play,
  Pause,
  Download,
  Mic,
  ChevronDown
} from 'lucide-react';
import { AudioRecord, TTSModel } from '../types';
import { TTS_MODELS, DEFAULT_TTS_MODEL } from '../services/constants';
import { ApiService } from '../services/api';

interface SpeechStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAI?: () => void;
}

const DEFAULT_PROMPT_TEXT =
  "The warm light flows across the OpenRouter office as the evening settles in and the routing never stops. One interface, hundreds of models. Ready when you are.";

export const SpeechStudioModal: React.FC<SpeechStudioModalProps> = ({
  isOpen,
  onClose,
  onOpenAI
}) => {
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT_TEXT);
  const [format, setFormat] = useState<string>('mp3');
  const [selectedModel, setSelectedModel] = useState<TTSModel>(DEFAULT_TTS_MODEL);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentAudio, setCurrentAudio] = useState<AudioRecord | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [audioHistory, setAudioHistory] = useState<AudioRecord[]>([]);
  const [showModelDropdown, setShowModelDropdown] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    const records = await ApiService.getTTSRecords();
    setAudioHistory(records);
    if (records.length > 0 && !currentAudio) {
      setCurrentAudio(records[0]);
    }
  };

  const handleReset = () => {
    setPrompt(DEFAULT_PROMPT_TEXT);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setIsPlaying(false);
    setPlaybackTime(0);

    try {
      const record = await ApiService.generateSpeech(prompt, selectedModel.id, format);
      setCurrentAudio(record);
      setAudioHistory(prev => [record, ...prev]);

      // Auto play generated audio
      setTimeout(() => {
        if (audioRef.current && record.audioUrl) {
          audioRef.current.src = record.audioUrl;
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      }, 250);
    } catch (err) {
      console.error('TTS audio error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayPause = () => {
    if (!currentAudio) return;

    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      if (audioRef.current && currentAudio.audioUrl) {
        audioRef.current.play().catch(() => {});
      }
      if ('speechSynthesis' in window && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      setIsPlaying(true);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setPlaybackTime(prev => {
          if (prev >= (currentAudio.duration || 12)) {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handleDownload = () => {
    if (!currentAudio) return;
    if (currentAudio.audioUrl) {
      const a = document.createElement('a');
      a.href = currentAudio.audioUrl;
      a.download = `foldcraft_speech_${currentAudio.id}.${currentAudio.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-2 sm:p-6 transition-all duration-300 overflow-y-auto">
      <audio ref={audioRef} onEnded={() => { setIsPlaying(false); setPlaybackTime(0); }} className="hidden" />

      <div className="relative flex flex-col w-full max-w-5xl bg-[#09090b] border border-white/15 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10 bg-[#0e0e12]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-lime-400/20 border border-lime-400/30 flex items-center justify-center">
              <Mic className="w-4 h-4 text-lime-400" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                Foldcraft Neural TTS Studio
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-lime-400/10 text-lime-400 border border-lime-400/20">
                  Tiniq O'zbekcha / Audio
                </span>
              </h2>
              <p className="text-[11px] text-white/50 hidden sm:block">Shovqinsiz High-Fidelity Ovoz Generatsiyasi</p>
            </div>
          </div>

          {/* Model Selector & Close */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white"
              >
                <span className="font-medium">{selectedModel.displayName}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-white/50 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showModelDropdown && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl glass-dropdown p-2 z-50 shadow-2xl border border-white/20">
                  <div className="text-[10px] font-semibold tracking-wider text-white/40 uppercase px-2 py-1">
                    TTS Ovoz Neyron Dvigatelini Tanlang
                  </div>
                  {TTS_MODELS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedModel(m);
                        setShowModelDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex flex-col gap-0.5 transition-colors ${
                        selectedModel.id === m.id
                          ? 'bg-lime-400/20 text-lime-300 border border-lime-400/30'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="font-medium">{m.displayName}</span>
                      <span className="text-[10px] text-white/40">{m.provider}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {onOpenAI && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAI();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-lg hover:bg-amber-400/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Studio
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Grid: Exact layout from reference screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6">
          {/* Left Column: PROMPT & Controls */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-2">
                PROMPT
              </label>

              <div className="relative rounded-xl border border-white/15 bg-black/60 focus-within:border-white/40 transition-colors p-3.5">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate();
                    }
                  }}
                  rows={5}
                  className="w-full bg-transparent resize-none text-white text-xs sm:text-sm leading-relaxed placeholder-white/30 focus:outline-none custom-scrollbar font-geist"
                  placeholder="Ovozlashtirish uchun matn kiriting..."
                />
              </div>

              <p className="text-xs text-white/40 mt-2 font-geist">
                Enter to generate · Shift+Enter for a new line
              </p>
            </div>

            {/* Bottom Controls Row: Format Dropdown + Action Buttons */}
            <div className="flex flex-wrap items-end justify-between gap-4 pt-2">
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Format</label>
                <div className="relative">
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="appearance-none bg-black/80 border border-white/15 hover:border-white/30 rounded-lg px-4 py-2 pr-8 text-xs text-white focus:outline-none focus:border-lime-400 font-medium cursor-pointer"
                  >
                    <option value="mp3">mp3</option>
                    <option value="wav">wav</option>
                    <option value="aac">aac</option>
                    <option value="flac">flac</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-white/50 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 border border-white/10 transition-all active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>

                {/* Bright Neon Lime Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#c8ff00] text-black hover:bg-[#d6ff33] active:scale-95 transition-all shadow-[0_0_20px_rgba(200,255,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4 text-black fill-black" />
                  {isGenerating ? 'Ovoz Tayyorlanmoqda...' : 'Generate'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Audio Output Card */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="relative rounded-2xl bg-[#111115] border border-white/15 p-4 sm:p-6 shadow-2xl flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-white/90">
                    Audio output{' '}
                    <span className="font-mono text-white/50 text-[11px]">
                      {currentAudio ? currentAudio.id : 'b347db033a6549378b48d00acb0d06cd'} · {format.toUpperCase()}
                    </span>
                  </span>
                  <span className="h-2 w-2 rounded-full bg-lime-400 animate-pulse"></span>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 my-3">
                  <button
                    onClick={togglePlayPause}
                    disabled={isGenerating}
                    className="flex-shrink-0 w-12 h-12 rounded-full bg-black border border-white/20 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all shadow-lg hover:border-white/40"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-white" />
                    ) : (
                      <Play className="w-5 h-5 fill-white translate-x-0.5" />
                    )}
                  </button>

                  <div className="flex-1 flex flex-col justify-center gap-1.5">
                    {/* Noise-free studio waveform animation */}
                    <div className="h-7 flex items-center gap-1 w-full overflow-hidden px-1">
                      {Array.from({ length: 32 }).map((_, i) => {
                        const height = isPlaying
                          ? Math.max(4, Math.sin(i * 0.4 + playbackTime) * 22 + 6)
                          : ((i % 5) + 1) * 3.5;
                        return (
                          <span
                            key={i}
                            style={{ height: `${height}px` }}
                            className={`flex-1 rounded-full transition-all duration-150 ${
                              isPlaying ? 'bg-lime-400' : 'bg-white/20'
                            }`}
                          />
                        );
                      })}
                    </div>

                    <div className="flex justify-between text-[11px] font-mono text-white/60">
                      <span>{formatSeconds(playbackTime)}</span>
                      <span>{formatSeconds(currentAudio?.duration || 12)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-white/10">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white hover:underline transition-colors font-medium"
                >
                  Download
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {audioHistory.length > 1 && (
              <div className="mt-4">
                <span className="text-[10px] font-semibold uppercase text-white/40 tracking-wider">
                  Yaqinda Yaratilganlar ({audioHistory.length})
                </span>
                <div className="mt-1 space-y-1 max-h-28 overflow-y-auto custom-scrollbar">
                  {audioHistory.slice(1, 4).map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => {
                        setCurrentAudio(rec);
                        setIsPlaying(false);
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 cursor-pointer flex items-center justify-between"
                    >
                      <span className="truncate max-w-[200px]">{rec.prompt}</span>
                      <span className="text-[10px] text-white/40 font-mono">
                        {formatSeconds(rec.duration)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
