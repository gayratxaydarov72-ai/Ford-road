import React, { useState } from 'react';
import { X, ShieldCheck, Mail, CheckCircle2, ArrowRight, RefreshCw, Sparkles, Copy } from 'lucide-react';
import { ApiService } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [demoCodeNotice, setDemoCodeNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await ApiService.sendOTP(email);
      if (res.success) {
        setStep('otp');
        if (res.demoCode) {
          setDemoCodeNotice(res.demoCode);
        }
      } else {
        setErrorMsg(res.message || 'OTP kodni yuborishda xatolik bo\'ldi.');
      }
    } catch {
      setErrorMsg('Autentifikatsiya xizmati bilan aloqa bog\'lanmadi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.slice(0, 6).split('');
      const newOtp = [...otpCode];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtpCode(newOtp);
      return;
    }

    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpCode.join('');
    if (fullCode.length < 6) {
      setErrorMsg('Iltimos 6 xonali kodning barchasini kiriting.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await ApiService.verifyOTP(email, fullCode);
      if (res.success) {
        onSuccess(email);
        onClose();
      } else {
        setErrorMsg(res.message || 'Kiritilgan tasdiqlash kodi noto\'g\'ri.');
      }
    } catch {
      setErrorMsg('Tasdiqlashda xatolik bo\'ldi. Qaytadan urinib ko\'ring.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCode = (codeStr: string) => {
    const digits = codeStr.slice(0, 6).split('');
    setOtpCode(digits);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-6">
      <div className="relative w-full max-w-md bg-[#0a0a0e] border border-white/15 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#0e0e14]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-tight">Supabase & Google OTP Autentifikatsiya</h2>
              <span className="text-[10px] text-white/50">Foldcraft Xavfsiz Kirish Tizimi</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs leading-relaxed">
              {errorMsg}
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <p className="text-xs text-white/70 leading-relaxed">
                Google / Work e-pochta manzilingizni kiriting. Pochtaga 6 xonali bir martalik tasdiqlash kodi yuboriladi.
              </p>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Email Manzil</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full bg-white/5 border border-white/15 focus:border-white/40 rounded-xl px-3.5 py-2.5 pl-10 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
                  />
                  <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full mt-2 py-3 rounded-xl bg-white text-black font-semibold text-xs sm:text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    6-Xonali OTP Kodni Yuborish
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div>
                <p className="text-xs text-white/70">
                  Tasdiqlash kodi <strong className="text-white">{email}</strong> manziliga yuborildi.
                </p>

                {demoCodeNotice && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] text-amber-400/80 uppercase font-semibold">Tezkor Avto-Tasdiqlash Kodi:</span>
                      <strong className="font-mono text-white text-base tracking-wider">{demoCodeNotice}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => fillDemoCode(demoCodeNotice)}
                      className="px-3 py-1.5 rounded-lg bg-amber-400 text-black font-semibold text-xs hover:scale-105 active:scale-95 transition-all shadow"
                    >
                      Kiritish
                    </button>
                  </div>
                )}
              </div>

              {/* 6 Digit Input Boxes */}
              <div className="flex justify-between gap-1.5 my-4">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-12 text-center text-lg font-bold font-mono bg-white/5 border border-white/20 focus:border-amber-400 rounded-xl text-white focus:outline-none transition-all"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-white/50">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="hover:text-white underline"
                >
                  Emailni o'zgartirish
                </button>
                <button
                  type="button"
                  onClick={() => handleSendOTP({ preventDefault: () => {} } as React.FormEvent)}
                  className="hover:text-white underline flex items-center gap-1"
                >
                  Kodni qayta yuborish
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || otpCode.join('').length < 6}
                className="w-full py-3 rounded-xl bg-white text-black font-semibold text-xs sm:text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Tasdiqlash va Kirish
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
