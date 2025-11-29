'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles, Mic, Zap } from 'lucide-react';
import { useChat } from "@/context/ChatContext";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Types ---
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

export const AIChatButton = () => {
  const { isOpen, openChat, closeChat } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  
  // Session Management
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('chat_session_id');
      if (stored) return stored;
      const newId = `web_${Math.floor(Math.random() * 1000000000)}`;
      localStorage.setItem('chat_session_id', newId);
      return newId;
    }
    return `web_${Math.floor(Math.random() * 1000000000)}`;
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'pt-BR';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText((prev) => prev + (prev ? " " : "") + transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  // Tooltip de chamada de atenção após 8 segundos
  useEffect(() => {
    if (hasInteracted || isOpen) return;
    
    const timer = setTimeout(() => {
      setShowTooltip(true);
      // Esconde o tooltip após 6 segundos
      setTimeout(() => setShowTooltip(false), 6000);
    }, 8000);

    return () => clearTimeout(timer);
  }, [hasInteracted, isOpen]);

  // Marca que o usuário já interagiu
  const handleOpenChat = () => {
    setHasInteracted(true);
    setShowTooltip(false);
    openChat();
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      content: inputText,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const payload = {
        data: {
          key: {
            remoteJid: `${sessionId}@s.whatsapp.net`,
            fromMe: false,
            id: userMsg.id
          },
          pushName: "Visitante Web",
          message: {
            conversation: userMsg.content
          },
          messageType: "conversation",
          messageTimestamp: Math.floor(Date.now() / 1000),
          instanceId: "web-client-integration",
          source: "web"
        },
        sender: `${sessionId}@s.whatsapp.net`
      };

      const response = await fetch("https://webh.procexai.tech/webhook/TizerpaLife", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Falha na comunicação');

      const responseData = await response.text();
      let aiText = "Não consegui processar sua resposta.";
      
      try {
        const json = JSON.parse(responseData);
        aiText = json.text || json.message || json.output || json.response || (typeof json === 'string' ? json : JSON.stringify(json));
      } catch (e) {
        if (responseData.trim()) aiText = responseData;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: aiText,
        sender: 'ai',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      console.error("Erro:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: "Estou com dificuldades de conexão. Tente novamente em instantes.",
        sender: 'ai',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessageContent = (text: string, sender: 'user' | 'ai') => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "underline underline-offset-2 transition-opacity hover:opacity-80",
              sender === 'user' ? "text-white decoration-white/30" : "text-[#1A365D] decoration-[#1A365D]/30"
            )}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans flex flex-col items-end">
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-[85vw] sm:w-[360px] md:w-[400px] h-[500px] max-h-[70vh] flex flex-col bg-[#F9F7F2] shadow-2xl overflow-hidden mb-4 sm:mb-6 rounded-[2rem] border border-white/50 ring-1 ring-black/5"
          >
            {/* --- Header --- */}
            <div className="relative z-10 shrink-0 px-6 py-5 flex items-center justify-between bg-[#F9F7F2]/80 backdrop-blur-md border-b border-[#1A365D]/5">
              <div>
                <h2 className="font-serif text-[#1A365D] text-lg font-medium tracking-wide">Concierge</h2>
                <p className="text-xs text-[#1A365D]/60 uppercase tracking-widest font-medium mt-0.5">TirzepaLife</p>
              </div>
              <button 
                onClick={closeChat}
                className="group p-2 rounded-full hover:bg-[#1A365D]/5 transition-colors duration-300"
              >
                <X className="w-5 h-5 text-[#1A365D]/60 group-hover:text-[#1A365D] transition-colors" />
              </button>
            </div>

            {/* --- Chat Area --- */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-[#F9F7F2] to-white scroll-smooth custom-scrollbar">
               {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-4 opacity-0 animate-[fadeIn_0.8s_ease-out_forwards]">
                    <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-[#1A365D] to-[#2A4A7F] flex items-center justify-center shadow-lg shadow-[#1A365D]/20">
                      <Sparkles className="w-6 h-6 text-[#F9F7F2]" />
                    </div>
                    <h3 className="font-serif text-2xl text-[#1A365D] mb-2">Bem-vindo</h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-[240px]">
                      Estou à disposição para auxiliar com informações sobre o tratamento e acompanhamento.
                    </p>
                  </div>
               ) : (
                 <>
                  {messages.map((msg) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      key={msg.id}
                      className={cn(
                        "flex flex-col max-w-[85%]",
                        msg.sender === 'user' ? "ml-auto items-end" : "items-start"
                      )}
                    >
                      <div className={cn(
                        "px-5 py-3.5 text-[15px] leading-relaxed shadow-sm",
                        msg.sender === 'user'
                          ? "bg-[#1A365D] text-[#F9F7F2] rounded-2xl rounded-tr-sm"
                          : "bg-white text-[#333] border border-gray-100 rounded-2xl rounded-tl-sm"
                      )}>
                        {renderMessageContent(msg.content, msg.sender)}
                      </div>
                      <span className="text-[10px] text-gray-300 mt-1.5 px-1 uppercase tracking-wide font-medium opacity-60">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-start"
                    >
                      <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                        <div className="flex space-x-1.5">
                          <span className="w-1.5 h-1.5 bg-[#1A365D]/40 rounded-full animate-[bounce_1.4s_infinite_both_-0.32s]"></span>
                          <span className="w-1.5 h-1.5 bg-[#1A365D]/40 rounded-full animate-[bounce_1.4s_infinite_both_-0.16s]"></span>
                          <span className="w-1.5 h-1.5 bg-[#1A365D]/40 rounded-full animate-[bounce_1.4s_infinite_both]"></span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                 </>
               )}
            </div>

            {/* --- Input Area --- */}
            <div className="p-5 bg-white border-t border-gray-100">
              <div className="relative flex items-center bg-[#F5F5F5] rounded-full px-2 py-1.5 transition-all duration-300 focus-within:bg-white focus-within:shadow-md focus-within:ring-1 focus-within:ring-[#1A365D]/10">
                <button 
                  onClick={toggleListening}
                  className={cn(
                    "p-2 rounded-full transition-colors duration-300",
                    isListening 
                      ? "text-red-500 bg-red-50 animate-pulse" 
                      : "text-gray-400 hover:text-[#1A365D] hover:bg-gray-100"
                  )}
                  title="Digitar por voz"
                >
                  <Mic className="w-4 h-4" />
                </button>
                
                <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-sm text-[#1A365D] placeholder:text-gray-400 px-2"
                  disabled={isLoading}
                />
                
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isLoading}
                  className={cn(
                    "p-2 rounded-full transition-all duration-300 flex items-center justify-center",
                    inputText.trim() 
                      ? "bg-[#1A365D] text-white shadow-lg shadow-[#1A365D]/20 hover:scale-105 active:scale-95" 
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  )}
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Toggle Button com Tooltip --- */}
      <AnimatePresence>
        {!isOpen && (
          <div className="flex flex-col items-end gap-3">
            {/* Tooltip de chamada de atenção */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 max-w-[220px]"
                >
                  <button 
                    onClick={() => setShowTooltip(false)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs transition-colors"
                  >
                    ✕
                  </button>
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 bg-gradient-to-br from-[#1A365D] to-[#2A4A7F] rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A365D] text-sm mb-1">Resposta em segundos!</p>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Tire suas dúvidas agora com nosso especialista.
                      </p>
                    </div>
                  </div>
                  {/* Seta do tooltip */}
                  <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-gray-100 transform rotate-45"></div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botão principal do chat */}
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0, rotate: 45 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenChat}
              className="relative group flex items-center justify-center w-16 h-16 rounded-full bg-[#1A365D] shadow-[0_8px_30px_rgba(26,54,93,0.25)] border border-[#ffffff]/10"
            >
              {/* Container para efeitos de brilho (sheen) */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Pulse ring animation */}
              <span className="absolute inset-0 rounded-full bg-[#1A365D] animate-ping opacity-20"></span>
              
              <MessageCircle className="w-7 h-7 text-[#F9F7F2] relative z-10" />
              
              {/* Badge "Online" */}
              <span className="absolute -top-2 -right-1 flex items-center gap-1 bg-white text-[10px] font-bold text-green-600 px-2 py-0.5 rounded-full shadow-lg border border-green-100 z-20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                </span>
                Online
              </span>
            </motion.button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
