import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Send,
  Plus,
  Trash2,
  Image as ImageIcon,
  Bot,
  User as UserIcon,
  ChevronDown,
  Copy,
  Check,
  Zap,
  Maximize2,
  Minimize2,
  PanelLeft,
  AlertCircle
} from 'lucide-react';
import { Message, ChatSession, AIModel } from '../types';
import { AI_MODELS, DEFAULT_AI_MODEL } from '../services/constants';
import { ApiService } from '../services/api';

interface AIStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSpeech?: () => void;
}

export const AIStudioModal: React.FC<AIStudioModalProps> = ({
  isOpen,
  onClose,
  onOpenSpeech
}) => {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<AIModel>(DEFAULT_AI_MODEL);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showModelDropdown, setShowModelDropdown] = useState<boolean>(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadChats();
    }
  }, [isOpen]);

  const loadChats = async () => {
    const loaded = await ApiService.getChats();
    if (loaded && loaded.length > 0) {
      setChats(loaded);
      setCurrentChatId(loaded[0].id);
      const model = AI_MODELS.find(m => m.id === loaded[0].model) || DEFAULT_AI_MODEL;
      setSelectedModel(model);
    } else {
      createNewChat(DEFAULT_AI_MODEL);
    }
  };

  const createNewChat = (model: AIModel = selectedModel) => {
    const newSession: ChatSession = {
      id: 'chat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: 'Yangi Chat',
      model: model.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        {
          id: 'welcome_' + Date.now(),
          role: 'assistant',
          content: `**Foldcraft AI Studio**ga xush kelibsiz. **${model.displayName}** neyron modeli faollashtirildi.\n\nSiz bu yerda o'zbek tilida savollar berishingiz va dasturlash kodlarini yaratishingiz mumkin.${
            model.supportsVision ? ' Rasmlarni tahlil qilish uchun Rasm yuklash tugmasidan foydalaning.' : ''
          }`,
          timestamp: Date.now(),
          model: model.displayName
        }
      ]
    };

    setChats(prev => [newSession, ...prev]);
    setCurrentChatId(newSession.id);
    ApiService.saveChat(newSession);
  };

  const currentChat = chats.find(c => c.id === currentChatId) || chats[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages, isLoading]);

  const handleSelectModel = (model: AIModel) => {
    setSelectedModel(model);
    setShowModelDropdown(false);
    
    // If user switches to a non-vision model, clear image preview to prevent model mismatch
    if (!model.supportsVision && imagePreview) {
      setImagePreview(null);
    }

    if (currentChat) {
      const updated = { ...currentChat, model: model.id, updatedAt: Date.now() };
      setChats(chats.map(c => c.id === currentChat.id ? updated : c));
      ApiService.saveChat(updated);
    }
  };

  const handleDeleteChat = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await ApiService.deleteChat(id);
    const filtered = chats.filter(c => c.id !== id);
    setChats(filtered);
    if (currentChatId === id) {
      if (filtered.length > 0) {
        setCurrentChatId(filtered[0].id);
      } else {
        createNewChat();
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedModel.supportsVision) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if ((!inputPrompt.trim() && !imagePreview) || isLoading || !currentChat) return;

    // Strict model mapping & vision constraint: Only include image if model supports vision (Gemma)
    const attachedImage = selectedModel.supportsVision ? imagePreview : null;

    const userMessage: Message = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: inputPrompt.trim() || (attachedImage ? 'Ushbu tasvirni o\'zbek tilida tahlil qiling.' : ''),
      imageUrl: attachedImage || undefined,
      timestamp: Date.now()
    };

    const newMessages = [...currentChat.messages, userMessage];
    const isFirstUserMsg = currentChat.messages.filter(m => m.role === 'user').length === 0;
    const newTitle = isFirstUserMsg
      ? userMessage.content.slice(0, 28) + (userMessage.content.length > 28 ? '...' : '')
      : currentChat.title;

    const updatedSession: ChatSession = {
      ...currentChat,
      title: newTitle,
      model: selectedModel.id,
      messages: newMessages,
      updatedAt: Date.now()
    };

    setChats(chats.map(c => c.id === currentChat.id ? updatedSession : c));
    setInputPrompt('');
    setImagePreview(null);
    setIsLoading(true);

    try {
      // Send message to the EXACT selected model ID to prevent model mixing
      const assistantContent = await ApiService.sendChatMessage(
        newMessages,
        selectedModel.id
      );

      const assistantMessage: Message = {
        id: 'reply_' + Date.now(),
        role: 'assistant',
        content: assistantContent,
        timestamp: Date.now(),
        model: selectedModel.displayName
      };

      const finalSession: ChatSession = {
        ...updatedSession,
        messages: [...newMessages, assistantMessage],
        updatedAt: Date.now()
      };

      setChats(chats.map(c => c.id === currentChat.id ? finalSession : c));
      await ApiService.saveChat(finalSession);
    } catch (err: unknown) {
      const errorMessage: Message = {
        id: 'err_' + Date.now(),
        role: 'assistant',
        content: `**Xatolik (${selectedModel.displayName}):** ${err instanceof Error ? err.message : 'Model javob bera olmadi'}. Iltimos qaytadan urinib ko'ring.`,
        timestamp: Date.now(),
        model: selectedModel.displayName
      };

      const errorSession: ChatSession = {
        ...updatedSession,
        messages: [...newMessages, errorMessage],
        updatedAt: Date.now()
      };

      setChats(chats.map(c => c.id === currentChat.id ? errorSession : c));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-0 sm:p-4 lg:p-6 transition-all duration-300">
      <div
        className={`relative flex flex-col w-full bg-[#0a0a0c] border-0 sm:border border-white/15 rounded-none sm:rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isFullscreen ? 'h-full w-full rounded-none border-none' : 'h-full sm:h-[90vh] max-w-6xl'
        }`}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5 border-b border-white/10 bg-[#0f0f13]">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 active:scale-90 transition-all md:hidden flex items-center gap-1"
              title="Chatlar menyusi"
            >
              <PanelLeft className="w-5 h-5 text-amber-300" />
            </button>

            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span className="font-semibold text-white tracking-tight text-xs sm:text-base flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300 hidden xs:inline" />
                Foldcraft AI
              </span>
            </div>

            {/* Model Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white transition-all active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold">{selectedModel.displayName}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Model Dropdown Menu */}
              {showModelDropdown && (
                <div className="absolute left-0 mt-2 w-72 rounded-xl glass-dropdown p-2 z-50 shadow-2xl border border-white/20">
                  <div className="text-[10px] font-semibold tracking-wider text-white/40 uppercase px-2 py-1">
                    AI Neyron Modelini Tanlang
                  </div>
                  {AI_MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleSelectModel(model)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex flex-col gap-0.5 transition-colors ${
                        selectedModel.id === model.id
                          ? 'bg-white/15 text-white border border-white/20'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{model.displayName}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                          {model.tag}
                        </span>
                      </div>
                      <span className="text-[11px] text-white/50 line-clamp-1">{model.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {onOpenSpeech && (
              <button
                onClick={() => {
                  onClose();
                  onOpenSpeech();
                }}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-lime-500/15 border border-lime-500/30 text-lime-400 text-xs font-medium hover:bg-lime-500/25 transition-all"
              >
                TTS O'zbekcha
              </button>
            )}

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors hidden sm:block"
              title={isFullscreen ? 'Kichik ekran' : 'Katta ekran'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 active:scale-90 transition-all"
              title="Yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Workspace Area: Sidebar + Chat Stream */}
        <div className="flex-1 flex overflow-hidden relative">
          {showMobileSidebar && (
            <div
              onClick={() => setShowMobileSidebar(false)}
              className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm md:hidden"
            />
          )}

          {/* Sidebar Chat History */}
          <div
            className={`absolute md:relative z-40 inset-y-0 left-0 w-72 sm:w-64 border-r border-white/10 bg-[#0c0c0f] flex flex-col transition-transform duration-300 shadow-2xl md:shadow-none ${
              showMobileSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}
          >
            <div className="p-3 border-b border-white/10 flex items-center gap-2">
              <button
                onClick={() => {
                  createNewChat();
                  setShowMobileSidebar(false);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white text-black font-semibold text-xs hover:bg-white/90 active:scale-95 transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
                Yangi Chat Ochish
              </button>

              <button
                onClick={() => setShowMobileSidebar(false)}
                className="p-2 rounded-xl bg-white/10 text-white md:hidden"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
              <div className="text-[10px] font-semibold text-white/40 uppercase px-2 py-1">
                Barcha Chatlar ({chats.length})
              </div>
              {chats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => {
                    setCurrentChatId(chat.id);
                    setShowMobileSidebar(false);
                  }}
                  className={`group flex items-center justify-between px-3 py-3 rounded-xl text-xs cursor-pointer transition-all ${
                    currentChatId === chat.id
                      ? 'bg-white/15 text-white font-medium border border-white/10'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="truncate flex-1 pr-2">{chat.title}</span>
                  <button
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    className="opacity-100 md:opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                    title="O'chirish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Main Chat Stream */}
          <div className="flex-1 flex flex-col bg-gradient-to-b from-[#0a0a0c] to-[#050507] overflow-hidden">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-6 space-y-4 sm:space-y-5">
              {currentChat?.messages.map((msg, index) => (
                <div
                  key={msg.id || index}
                  className={`flex gap-2.5 sm:gap-3 max-w-3xl ${
                    msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                      msg.role === 'user'
                        ? 'bg-white text-black'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`relative rounded-2xl p-3 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-white/15 text-white border border-white/20 max-w-[85vw] sm:max-w-xl'
                        : 'bg-white/5 text-white/90 border border-white/10 max-w-[85vw] sm:max-w-2xl backdrop-blur-md'
                    }`}
                  >
                    {msg.imageUrl && (
                      <div className="mb-3 overflow-hidden rounded-xl border border-white/20 max-w-xs">
                        <img
                          src={msg.imageUrl}
                          alt="Yuklangan tasvir"
                          className="w-full h-auto object-cover max-h-56"
                        />
                      </div>
                    )}

                    <div className="whitespace-pre-wrap select-text font-normal font-geist">
                      {msg.content}
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40">
                      <span>{msg.model || (msg.role === 'user' ? 'Siz' : selectedModel.displayName)}</span>
                      <button
                        onClick={() => handleCopyText(msg.content, index)}
                        className="hover:text-white flex items-center gap-1 transition-colors py-0.5 px-1"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Nusxalandi
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Nusxalash
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 max-w-3xl mr-auto">
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="rounded-2xl p-3 sm:p-4 bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-white/60">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]"></span>
                    <span className="ml-1 text-white/70">{selectedModel.displayName} javob shakllantirmoqda...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Composer Area */}
            <div className="p-2 sm:p-4 border-t border-white/10 bg-[#0c0c0f]">
              {/* Image Preview Thumbnail (Only for Gemma) */}
              {imagePreview && selectedModel.supportsVision && (
                <div className="relative inline-block mb-2 p-1 bg-white/10 rounded-xl border border-white/20">
                  <img src={imagePreview} alt="Biriktirilgan tasvir" className="h-14 w-14 object-cover rounded-lg" />
                  <button
                    onClick={() => setImagePreview(null)}
                    className="absolute -top-1.5 -right-1.5 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="relative flex items-center gap-2 bg-white/5 border border-white/15 focus-within:border-white/40 rounded-2xl p-1.5 sm:p-2 transition-all">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Rasm joyi faqat GEMMA modelida ishlaydi */}
                {selectedModel.supportsVision ? (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-xl text-amber-300 hover:text-white bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 active:scale-90 transition-all flex-shrink-0"
                    title="Gemma Vision uchun rasm yuklash"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const gemmaModel = AI_MODELS.find(m => m.supportsVision);
                      if (gemmaModel) handleSelectModel(gemmaModel);
                    }}
                    className="p-2 rounded-xl text-white/30 hover:text-amber-300 transition-colors flex-shrink-0"
                    title="Rasm yuklash faqat Gemma modelida mavjud. Gemma'ga o'tish uchun bosing."
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>
                )}

                <textarea
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`${selectedModel.displayName} bilan muloqot...${
                    selectedModel.supportsVision ? ' (Rasm biriktirishingiz mumkin)' : ''
                  }`}
                  rows={1}
                  className="flex-1 bg-transparent resize-none text-white text-xs sm:text-sm placeholder-white/30 focus:outline-none py-1.5 px-1 max-h-32 custom-scrollbar font-geist"
                />

                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || (!inputPrompt.trim() && !imagePreview)}
                  className={`p-2.5 rounded-xl font-medium transition-all flex-shrink-0 ${
                    inputPrompt.trim() || (imagePreview && selectedModel.supportsVision)
                      ? 'bg-white text-black hover:scale-105 active:scale-95 shadow-lg'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Status info bar */}
              <div className="flex items-center justify-between mt-1.5 px-1 text-[10px] text-white/40">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  Tanlangan Model: <strong className="text-white/90">{selectedModel.displayName}</strong>
                </span>
                {!selectedModel.supportsVision ? (
                  <span className="text-amber-400/80 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Rasm tahlili faqat Gemma'da
                  </span>
                ) : (
                  <span className="text-emerald-400/90">Multimodal Vision Faol</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
