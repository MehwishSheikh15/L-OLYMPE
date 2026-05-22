import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, X, MessageSquare, Bot, ArrowRight, RefreshCw, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export const AIChatConcierge: React.FC = () => {
  const { settings } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Salutations, honored guest. I am **Ambrosia**, the AI Concierge of ${settings.restaurantName || "L'Olympe Paris"}.\n\nIt is my absolute privilege to assist with your culinary desires today. How may I introduce you to our legendary three-Michelin-starred menu, dynamic kitchen theater, or exclusive reservation options?`,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Map message history into standard backend API format: { role: 'user' | 'model', text: string }
      const historyPayload = messages.map(m => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error('Our AI concierge channels are busy at the moment.');
      }

      const data = await res.json();
      
      const assistantMsg: Message = {
        id: Math.random().toString(),
        role: 'model',
        text: data.text || 'Gracious apologies, the server signal is momentarily unavailable.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: Math.random().toString(),
        role: 'model',
        text: `*Gracious apologies, an echo in the wine cellars has disrupted my voice.* Let me attempt to re-connect shortly. (Error: ${err.message || "Connection timed out"})`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: `Salutations, honored guest. I am **Ambrosia**, the AI Concierge of ${settings.restaurantName || "L'Olympe Paris"}.\n\nHow may I guild your selection today? Ask me about our caviar selection, booking our wine vault, or finding a premium vintage pairing.`,
        timestamp: new Date(),
      }
    ]);
  };

  // Luxury Recommended Prompts
  const suggestedQueries = [
    "Suggest a 3-course menu pairing",
    "Where is the restaurant located?",
    "Tell me about Chef Alain Gauthier's legacy",
    "Details on the Golden Osetra Caviar",
    "How do I reserve the private Wine Cellar?"
  ];

  return (
    <>
      {/* Floating Sparkle Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group p-4 rounded-full bg-gradient-to-br from-[#050505] to-[#121212] border border-[#C5A059]/40 hover:border-[#F27D26]/80 text-[#C5A059] hover:text-white transition-all duration-300 shadow-[0_4px_30px_rgba(197,160,89,0.15)] hover:shadow-[0_8px_35px_rgba(242,125,38,0.3)] hover:scale-105 cursor-pointer flex items-center justify-center"
          aria-label="Open AI Concierge Butler"
          id="ai-assistant-trigger"
        >
          {/* Subtle pulsator ring */}
          <span className="absolute inset-0 rounded-full bg-[#C5A059]/10 animate-ping opacity-75 pointer-events-none group-hover:bg-[#F27D26]/20"></span>
          
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <X className="h-6 w-6 text-[#F27D26]" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 relative"
              >
                <Sparkles className="h-6 w-6 text-[#C5A059] group-hover:text-[#F27D26] animate-pulse" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out text-[10px] font-bold tracking-widest uppercase text-white whitespace-nowrap">
                  Chef Butler
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Slide-out Overlay Chat Drawer / Screen Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs z-45"
            />

            {/* Chat Frame */}
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] max-h-[78vh] h-[640px] bg-gradient-to-b from-[#050505] to-[#0c0c0c] border border-gold-900/40 rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden"
              id="ai-assistant-panel"
            >
              {/* Header */}
              <div className="p-4 border-b border-gold-900/20 bg-gradient-to-r from-[#030303] to-[#0d0d0d] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#C5A059]/40 bg-gold-950/20">
                    <Bot className="h-5 w-5 text-[#C5A059]" />
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-black"></span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold tracking-widest text-[#C5A059] uppercase flex items-center gap-1.5">
                      Ambrosia <span className="text-[8px] bg-[#F27D26]/20 text-[#F27D26] px-1.5 py-0.5 rounded font-mono uppercase font-bold">VIP Butler</span>
                    </h4>
                    <p className="text-[9px] text-zinc-400 font-light truncate max-w-[200px]">Live Gastronomic Concierge</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={handleClearChat}
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
                    title="Reset Dialogue"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-zinc-444 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
                    aria-label="Close panel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Body Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800">
                {messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs font-light leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-r from-[#F27D26] to-[#d66513] text-white rounded-tr-none' 
                          : 'bg-white/5 border border-white/5 text-zinc-100 rounded-tl-none font-sans'
                      }`}
                    >
                      {/* Rich representation simulation */}
                      <p className="whitespace-pre-line">
                        {msg.text.split('\n\n').map((paragraph, index) => {
                          // Simple markdown replacement for bold strings **text**
                          const items = paragraph.split('**');
                          return (
                            <span key={index} className="block mb-2 last:mb-0">
                              {items.map((chunk, i) => (
                                i % 2 === 1 ? <strong key={i} className="font-semibold text-[#C5A059]">{chunk}</strong> : chunk
                              ))}
                            </span>
                          );
                        })}
                      </p>
                    </div>
                    <span className="text-[8px] text-zinc-500 font-mono mt-1 px-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2.5 bg-white/5 border border-white/5 py-3 px-4 rounded-xl text-xs text-[#C5A059] w-fit font-light italic animate-pulse rounded-tl-none">
                    <Sparkles className="h-4.5 w-4.5 animate-spin text-[#F27D26]" />
                    <span>Ambrosia is composing dynamic recommendations...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested dynamic queries helper list */}
              {messages.length === 1 && (
                <div className="px-4 pb-1 pt-0">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#C5A059] uppercase tracking-wider font-semibold mb-2">
                    <HelpCircle className="h-3.5 w-3.5 text-[#F27D26]" />
                    <span>Inquire about:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                    {suggestedQueries.map((query, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(query)}
                        className="text-[10px] text-left px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 hover:border-[#F27D26]/40 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer flex items-center gap-1"
                      >
                        {query}
                        <ArrowRight className="h-2.5 w-2.5 text-[#F27D26] opacity-0 hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input form footer */}
              <form onSubmit={handleSubmit} className="p-3 border-t border-gold-900/10 bg-[#040404] flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Ambrosia..."
                  disabled={isLoading}
                  className="flex-1 bg-white/5 hover:bg-white/10 focus:bg-[#0c0c0c] border border-white/10 focus:border-[#F27D26]/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-all duration-300 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="p-2 rounded-xl bg-gradient-to-r from-[#F17E26] to-[#E26A18] text-white hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all duration-300 cursor-pointer flex items-center justify-center"
                  aria-label="Send query"
                >
                  <Send className="h-4.5 w-4.5" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
