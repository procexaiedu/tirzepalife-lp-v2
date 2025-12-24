'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles, Mic, Zap, RotateCcw } from 'lucide-react';
import { useChat } from "@/context/ChatContext";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TriageFormCard } from "@/components/chat/TriageFormCard";
import type { ChatUi, ChatUiFormCard, TriageFormValues, WebhookResponse, WebhookMessage } from "@/types/chatUi";

// --- Types ---
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence?: number;
}

interface SpeechRecognitionResult {
  0: SpeechRecognitionAlternative;
  length: number;
  isFinal?: boolean;
}

interface SpeechRecognitionResultList {
  0: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

const WEBHOOK_URL = "https://webh.procexai.tech/webhook/TizerpaLife";

export const AIChatButton = () => {
  const { isOpen, openChat, closeChat } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [activeUi, setActiveUi] = useState<ChatUi | null>(null);
  const [isSubmittingUi, setIsSubmittingUi] = useState(false);
  const [hasRequestedStart, setHasRequestedStart] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  
  // Session Management
  const [sessionId, setSessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('chat_session_id');
      if (stored) return stored;
      const newId = `web_${Math.floor(Math.random() * 1000000000)}`;
      localStorage.setItem('chat_session_id', newId);
      return newId;
    }
    return `web_${Math.floor(Math.random() * 1000000000)}`;
  });

  const triageCompletedKey = useMemo(() => `triage_completed_${sessionId}`, [sessionId]);
  const triageValuesKey = useMemo(() => `triage_values_${sessionId}`, [sessionId]);

  const isTriageCompleted = () => {
    if (typeof window === 'undefined') return false;
    const completed = localStorage.getItem(triageCompletedKey) === "1";
    const hasData = !!localStorage.getItem(triageValuesKey);
    return completed && hasData;
  };

  const handleResetChat = () => {
    if (typeof window === 'undefined') return;
    if (!confirm("Deseja realmente reiniciar a conversa e a triagem?")) return;

    localStorage.removeItem('chat_session_id');
    localStorage.removeItem(triageCompletedKey);
    localStorage.removeItem(triageValuesKey);
    
    // Gerar novo ID de sessão
    const newId = `web_${Math.floor(Math.random() * 1000000000)}`;
    localStorage.setItem('chat_session_id', newId);
    
    // Limpar estados
    setSessionId(newId);
    setMessages([]);
    setActiveUi(null);
    setHasRequestedStart(false);
    setInputText("");
  };

  const getStoredTriage = (): TriageFormValues | null => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(triageValuesKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as TriageFormValues;
    } catch {
      return null;
    }
  };

  const storeTriage = (values: TriageFormValues) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(triageValuesKey, JSON.stringify(values));
  };

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

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setInputText((prev) => prev + (prev ? " " : "") + transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  useEffect(() => {
    if (hasInteracted || isOpen) return;
    
    const timer = setTimeout(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 6000);
    }, 8000);

    return () => clearTimeout(timer);
  }, [hasInteracted, isOpen]);

  const handleOpenChat = () => {
    setHasInteracted(true);
    setShowTooltip(false);
    openChat();
  };

  const buildClientContext = (history: Message[]) => {
    const triage = getStoredTriage();
    return {
      session_id: sessionId,
      triage_completed: isTriageCompleted(),
      triage,
      last_messages: history.map((m) => ({
        sender: m.sender,
        content: m.content,
        timestamp: m.timestamp,
      })),
      page: typeof window !== "undefined" ? { path: window.location.pathname, url: window.location.href } : null,
      timestamp_ms: Date.now(),
    };
  };

  const construirPayloadBase = (id: string, conversation: string, extras?: Record<string, unknown>, history?: Message[]) => {
    const historyToSend = history ?? messages.slice(-12);
    return {
      data: {
        key: {
          remoteJid: `${sessionId}@s.whatsapp.net`,
          fromMe: false,
          id
        },
        pushName: "Visitante Web",
        message: {
          conversation
        },
        messageType: "conversation",
        messageTimestamp: Math.floor(Date.now() / 1000),
        instanceId: "web-client-integration",
        source: "web",
        client_context: buildClientContext(historyToSend),
        ...(extras ?? {})
      },
      sender: `${sessionId}@s.whatsapp.net`
    };
  };

  const chamarWebhook = async (payload: unknown) => {
    // Timeout de 2 minutos (120000ms)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error('Falha na comunicação');

    const responseData = await response.text();
    try {
      return JSON.parse(responseData) as WebhookResponse;
    } catch {
      return { text: responseData } as WebhookResponse;
    }
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

  const processarRespostasBot = async (response: WebhookResponse) => {
    let webhookMessages: WebhookMessage[] = [];
    
    if (response.messages && Array.isArray(response.messages)) {
      webhookMessages = response.messages;
    } else {
      const text = response.text || response.message || response.output || response.response || 
                   (typeof response === 'string' ? response : JSON.stringify(response));
      webhookMessages = [{ text, delay: 1000 }];
    }

    if (response.ui) {
      setActiveUi(response.ui);
    }

    for (const msg of webhookMessages) {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, msg.delay || 1000));
      setIsTyping(false);
      
      const aiMsg: Message = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        content: msg.text,
        sender: 'ai',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiMsg]);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const iniciarFluxoAoAbrir = async () => {
    if (hasRequestedStart) return;
    if (isLoading || isTyping) return;
    if (messages.length > 0) return;

    setHasRequestedStart(true);
    setIsLoading(true);

    try {
      const startId = `start_${Date.now()}`;
      const bootstrap = (isTriageCompleted() && getStoredTriage()) ? "__resume__" : "__start__";
      const payload = construirPayloadBase(startId, bootstrap, undefined, []);
      const json = await chamarWebhook(payload);
      await processarRespostasBot(json);
    } catch (error) {
      console.error("Erro:", error);
      setIsTyping(false);
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

  useEffect(() => {
    if (!isOpen) return;
    void iniciarFluxoAoAbrir();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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
      const history = [...messages, userMsg].slice(-12);
      const payload = construirPayloadBase(userMsg.id, userMsg.content, undefined, history);
      const json = await chamarWebhook(payload);
      await processarRespostasBot(json);

    } catch (error) {
      console.error("Erro:", error);
      setIsTyping(false);
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

  const handleSubmitTriage = async (schema: ChatUiFormCard, values: TriageFormValues) => {
    setIsSubmittingUi(true);
    try {
      const optionLabel = (fieldName: string) => {
        const field = schema.fields.find(f => f.name === fieldName);
        const opt = field?.options.find(o => o.value === values[fieldName]);
        return opt?.label ?? values[fieldName] ?? "";
      };

      const resumo = `Triagem preenchida: Objetivo=${optionLabel("goal")}; Já usou GLP-1=${optionLabel("used_glp1")}; Grávida/amamentando=${optionLabel("pregnant_lactating")}; Histórico câncer medular/NEM2=${optionLabel("thyroid_history")}.`;

      const userMsg: Message = {
        id: Date.now().toString(),
        content: "Respondi a triagem ✅",
        sender: 'user',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, userMsg]);

      // Persistência local para permitir retomada (ex.: usuário fecha/atualiza e reabre o chat)
      storeTriage(values);

      const history = [...messages, userMsg].slice(-12);
      const payload = construirPayloadBase(userMsg.id, resumo, { form: values, form_id: schema.id }, history);
      const json = await chamarWebhook(payload);

      if (typeof window !== 'undefined') {
        localStorage.setItem(triageCompletedKey, "1");
      }
      setActiveUi(null);
      await processarRespostasBot(json);
    } catch (error) {
      console.error("Erro:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: "Não consegui enviar sua triagem agora. Tente novamente em instantes.",
        sender: 'ai',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSubmittingUi(false);
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
              sender === 'user' ? "text-white decoration-white/30" : "text-[var(--color-medical-navy)] decoration-[var(--color-medical-navy)]/30"
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
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] font-sans flex flex-col items-end">
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-[85vw] sm:w-[360px] md:w-[400px] h-[500px] max-h-[70vh] flex flex-col bg-[var(--color-medical-white)] shadow-2xl overflow-hidden mb-4 sm:mb-6 rounded-[2rem] border border-white/50 ring-1 ring-black/5"
          >
            {/* --- Header --- */}
            <div className="relative z-10 shrink-0 px-6 py-4 flex items-center justify-between bg-[var(--color-medical-white)]/80 backdrop-blur-md border-b border-[var(--color-medical-navy)]/5">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-[var(--color-medical-navy)] rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                 </div>
                 <div>
                   <h2 className="font-serif text-[var(--color-medical-navy)] text-base font-medium tracking-wide">Concierge</h2>
                   <p className="text-[10px] text-[var(--color-medical-navy)]/60 uppercase tracking-widest font-medium">TirzepaLife</p>
                 </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={handleResetChat}
                  title="Reiniciar chat"
                  className="group p-2 rounded-full hover:bg-[var(--color-medical-navy)]/5 transition-colors duration-300"
                >
                  <RotateCcw className="w-4 h-4 text-[var(--color-medical-navy)]/60 group-hover:text-[var(--color-medical-navy)] transition-colors" />
                </button>
                <button 
                  onClick={closeChat}
                  className="group p-2 rounded-full hover:bg-[var(--color-medical-navy)]/5 transition-colors duration-300"
                >
                  <X className="w-5 h-5 text-[var(--color-medical-navy)]/60 group-hover:text-[var(--color-medical-navy)] transition-colors" />
                </button>
              </div>
            </div>

            {/* --- Chat Area --- */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-[var(--color-medical-white)] to-white scroll-smooth custom-scrollbar">
               {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-4 opacity-0 animate-[fadeIn_0.8s_ease-out_forwards]">
                    <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-[var(--color-medical-navy)] to-[#2A4A7F] flex items-center justify-center shadow-lg shadow-[var(--color-medical-navy)]/20">
                      <Sparkles className="w-6 h-6 text-[var(--color-medical-white)]" />
                    </div>
                    <h3 className="font-serif text-2xl text-[var(--color-medical-navy)] mb-2">Bem-vindo</h3>
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
                          ? "bg-[var(--color-medical-navy)] text-[var(--color-medical-white)] rounded-2xl rounded-tr-sm"
                          : "bg-white text-[var(--color-medical-text)] border border-gray-100 rounded-2xl rounded-tl-sm"
                      )}>
                        {renderMessageContent(msg.content, msg.sender)}
                      </div>
                      <span className="text-[10px] text-gray-300 mt-1.5 px-1 uppercase tracking-wide font-medium opacity-60">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </motion.div>
                  ))}

                  {activeUi?.type === "form_card" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="flex items-start"
                    >
                      <TriageFormCard
                        schema={activeUi as ChatUiFormCard}
                        isSubmitting={isSubmittingUi}
                        onSubmit={(vals) => handleSubmitTriage(activeUi as ChatUiFormCard, vals)}
                      />
                    </motion.div>
                  )}
                  
                  {(isLoading || isTyping) && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start"
                    >
                      <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                        <div className="flex space-x-1.5">
                          <span className="w-1.5 h-1.5 bg-[var(--color-medical-navy)]/40 rounded-full animate-[bounce_1.4s_infinite_both_-0.32s]"></span>
                          <span className="w-1.5 h-1.5 bg-[var(--color-medical-navy)]/40 rounded-full animate-[bounce_1.4s_infinite_both_-0.16s]"></span>
                          <span className="w-1.5 h-1.5 bg-[var(--color-medical-navy)]/40 rounded-full animate-[bounce_1.4s_infinite_both]"></span>
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
              <div className="relative flex items-center bg-[#F5F5F5] rounded-full px-2 py-1.5 transition-all duration-300 focus-within:bg-white focus-within:shadow-md focus-within:ring-1 focus-within:ring-[var(--color-medical-navy)]/10">
                <button 
                  onClick={toggleListening}
                  className={cn(
                    "p-2 rounded-full transition-colors duration-300",
                    isListening 
                      ? "text-red-500 bg-red-50 animate-pulse" 
                      : "text-gray-400 hover:text-[var(--color-medical-navy)] hover:bg-gray-100"
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
                  className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-sm text-[var(--color-medical-text)] placeholder:text-gray-400 px-2"
                  disabled={isLoading || isTyping || isSubmittingUi || activeUi?.type === "form_card"}
                />
                
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isLoading || isTyping || isSubmittingUi || activeUi?.type === "form_card"}
                  className={cn(
                    "p-2 rounded-full transition-all duration-300 flex items-center justify-center",
                    inputText.trim() 
                      ? "bg-[var(--color-medical-navy)] text-white shadow-lg shadow-[var(--color-medical-navy)]/20 hover:scale-105 active:scale-95" 
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
                    <div className="shrink-0 w-10 h-10 bg-gradient-to-br from-[var(--color-medical-navy)] to-[#2A4A7F] rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--color-medical-navy)] text-sm mb-1">Resposta em segundos!</p>
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
              className="relative group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[var(--color-medical-navy)] shadow-[0_8px_30px_rgba(26,54,93,0.25)] border border-[#ffffff]/10"
            >
              {/* Container para efeitos de brilho (sheen) */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Pulse ring animation */}
              <span className="absolute inset-0 rounded-full bg-[var(--color-medical-navy)] animate-ping opacity-20"></span>
              
              <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--color-medical-white)] relative z-10" />
              
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
