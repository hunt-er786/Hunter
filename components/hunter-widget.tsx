'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, X, Minimize2, MessageSquare, Send, Settings2, AudioLines } from 'lucide-react';
import { PropertyType } from '../data/properties';

export type HunterCommand = 
  | { type: 'CLOSE' }
  | { type: 'MUTE' }
  | { type: 'SCROLL_TO'; target: string }
  | { type: 'FILTER'; filterType?: PropertyType; minBeds?: number; query?: string }
  | { type: 'UNKNOWN'; text: string };

interface HunterWidgetProps {
  onCommand: (command: HunterCommand) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function HunterWidget({ onCommand, isOpen, setIsOpen }: HunterWidgetProps) {
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: "Hi, I'm Hunter, your AI Property Guide. I can help you find properties, compare options, schedule a visit, or guide you through this website. You can also say 'Hunter, close' anytime." }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => scrollToBottom(), [messages]);

  // Very basic regex-based command parser for demo purposes
  const parseCommand = (input: string): HunterCommand => {
    const lower = input.toLowerCase();
    
    if (lower.includes('close') || lower.includes('hide') || lower.includes('quiet') || lower.includes('stop voice')) {
       return { type: 'CLOSE' };
    }
    if (lower.includes('mute')) {
      return { type: 'MUTE' };
    }
    if (lower.includes('apartments') || lower.includes('apartment')) {
      return { type: 'FILTER', filterType: 'Apartment' };
    }
    if (lower.includes('bungalow')) {
       return { type: 'FILTER', filterType: 'Bungalow' };
    }
    if (lower.includes('plots') || lower.includes('plot')) {
       return { type: 'FILTER', filterType: 'Plot' };
    }
    if (lower.match(/(\d+)\s*bedroom/)) {
       const match = lower.match(/(\d+)\s*bedroom/);
       const beds = match ? parseInt(match[1]) : 0;
       return { type: 'FILTER', minBeds: beds };
    }
    if (lower.includes('properties')) {
       return { type: 'SCROLL_TO', target: 'properties' };
    }
    if (lower.includes('services')) {
       return { type: 'SCROLL_TO', target: 'services' };
    }
    if (lower.includes('contact') || lower.includes('schedule a visit') || lower.includes('agent')) {
       return { type: 'SCROLL_TO', target: 'contact' };
    }
    if (lower.includes('demo')) {
       return { type: 'SCROLL_TO', target: 'demo' };
    }

    return { type: 'UNKNOWN', text: "I can help you filter properties. Try saying 'Show me apartments' or 'Find 2 bedroom homes'." };
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInputText('');
    
    // Parse command
    const cmd = parseCommand(text);
    
    // Delay AI response slightly
    setTimeout(() => {
      // Execute command on parent
      onCommand(cmd);
      
      // Provide AI feedback
      let reply = '';
      switch(cmd.type) {
        case 'CLOSE':
          reply = "Closing up now. Let me know if you need me!";
          setTimeout(() => setIsOpen(false), 1000);
          break;
        case 'MUTE':
          reply = "Muted. I'll stay quiet.";
          setIsMuted(true);
          break;
        case 'SCROLL_TO':
          reply = `Navigating to ${cmd.target}...`;
          break;
        case 'FILTER':
          reply = "I've updated the property listings for you. Let's take a look.";
          break;
        case 'UNKNOWN':
          reply = cmd.text;
          break;
      }
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
      
      if (!isMuted && cmd.type !== 'MUTE' && cmd.type !== 'CLOSE') {
          // Trigger a fake TTS wave animation or similar
      }

    }, 600);
  };

  const toggleListen = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // Simulate listening completion after 3 seconds for demo
      setTimeout(() => {
         setIsListening(false);
         handleSend("Show me apartments"); // Mocking a voice recognition result
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={`fixed z-50 ${isMinimized ? 'bottom-6 right-6 w-auto' : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100%-2rem)] sm:w-[380px]'} bg-[#F9F7F2] border border-black/5 shadow-2xl flex flex-col font-sans`}
      >
        {isMinimized ? (
          <button 
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-3 p-4 hover:bg-black/5 transition-colors"
          >
             <div className="w-10 h-10 bg-black flex items-center justify-center relative flex-shrink-0">
               <div className="absolute inset-0 bg-black animate-ping opacity-20"></div>
               <span className="text-white font-serif italic text-lg">H</span>
             </div>
             <div className="text-left pr-4">
                <div className="text-sm font-serif italic font-medium text-[#1A1A1A]">Hunter</div>
                <div className="text-[10px] uppercase tracking-widest opacity-60 flex items-center gap-1 font-bold">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Online
                </div>
             </div>
          </button>
        ) : (
          <>
            {/* Header */}
            <div className="px-5 py-4 border-b border-black/5 flex items-center justify-between bg-[#F9F7F2] shrink-0">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-black flex items-center justify-center">
                   <span className="text-white font-serif italic text-lg">H</span>
                 </div>
                 <div>
                    <div className="text-base font-medium text-[#1A1A1A] font-serif italic">Hunter</div>
                    <div className="text-[10px] uppercase tracking-widest opacity-60 font-bold flex items-center gap-1">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> AI Property Guide
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsMuted(!isMuted)} className={`p-2 rounded-none hover:bg-black/5 transition-colors ${isMuted ? 'text-red-500' : 'text-[#1A1A1A]/60'}`} title="Mute">
                  <AudioLines className="w-4 h-4" />
                </button>
                <button onClick={() => setIsMinimized(true)} className="p-2 rounded-none hover:bg-black/5 transition-colors text-[#1A1A1A]/60" title="Minimize">
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-none hover:bg-black/5 transition-colors text-[#1A1A1A]/60" title="Close">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 min-h-[300px] max-h-[400px] overflow-y-auto p-5 bg-[#FCFBF9] space-y-4">
              {messages.map((message, idx) => (
                <div key={idx} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-3 text-[11px] font-light leading-relaxed shadow-sm ${
                    message.role === 'user' 
                      ? 'bg-black text-white rounded-2xl rounded-tr-none' 
                      : 'bg-white text-[#1A1A1A] border border-black/5 rounded-2xl rounded-tl-none'
                  }`}>
                     {message.text}
                  </div>
                </div>
              ))}
              {isListening && (
                 <div className="flex justify-start">
                    <div className="bg-white border text-[#1A1A1A] border-black/5 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                       <span className="w-1 h-1 bg-black/40 rounded-full animate-bounce"></span>
                       <span className="w-1 h-1 bg-black/40 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                       <span className="w-1 h-1 bg-black/40 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                    </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-3 flex gap-2 overflow-x-auto whitespace-nowrap hide-scrollbar border-t border-black/5 bg-[#FCFBF9]">
               {['Show apartments', 'Schedule visit', 'Contact agent'].map(act => (
                 <button 
                   key={act} 
                   onClick={() => handleSend(act)}
                   className="text-[10px] uppercase tracking-widest font-bold bg-white border border-black/5 hover:bg-black/5 text-[#1A1A1A] px-3 py-2 transition-colors rounded-none"
                 >
                   {act}
                 </button>
               ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#FCFBF9] border-t border-black/5 shrink-0">
               <div className="relative flex items-center">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
                    placeholder="Type your request or speak..."
                    className="w-full bg-white border border-black/5 rounded-none py-3 pl-4 pr-24 text-[11px] uppercase tracking-widest text-[#1A1A1A] focus:outline-none focus:border-black/20 transition-colors"
                  />
                  <div className="absolute right-1 flex items-center gap-1">
                     <button 
                       onClick={toggleListen}
                       className={`p-2 transition-colors flex items-center justify-center ${isListening ? 'bg-red-500 text-white animate-pulse rounded-full' : 'bg-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-black/5 rounded-none'}`}
                     >
                       <Mic className="w-4 h-4" />
                     </button>
                     <button 
                       onClick={() => handleSend(inputText)}
                       disabled={!inputText.trim()}
                       className="p-2 bg-black text-white hover:bg-[#333] disabled:opacity-50 transition-colors flex items-center justify-center rounded-none"
                     >
                       <Send className="w-4 h-4" />
                     </button>
                  </div>
               </div>
               <div className="text-center mt-2">
                 <span className="text-[9px] text-[#1A1A1A] opacity-40 uppercase tracking-[0.2em] font-bold">Voice unavailable? Type your request</span>
               </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
