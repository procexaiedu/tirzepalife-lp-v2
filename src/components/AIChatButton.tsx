'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

export const AIChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Identificador único da sessão do usuário (simulando número de telefone/ID)
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
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

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
      // Payload simulando a estrutura da Evolution API conforme solicitado
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

      const response = await fetch("https://webh.procexai.tech/webhook/c457fa49-542f-49e3-85e8-96faca1f43f6", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Falha na comunicação com a IA');
      }

      // Assume que o n8n retorna a resposta no corpo da requisição (nó "Respond to Webhook")
      // Se o n8n retornar JSON { text: "..." } ou apenas texto, tentamos parsear
      const responseData = await response.text();
      
      let aiText = "Desculpe, não consegui processar sua resposta.";
      try {
        const json = JSON.parse(responseData);
        // Tenta encontrar o texto em campos comuns de resposta de IA
        aiText = json.text || json.message || json.output || json.response || (typeof json === 'string' ? json : JSON.stringify(json));
      } catch (e) {
        // Se não for JSON, usa o texto puro se não estiver vazio
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
      console.error("Erro ao enviar mensagem:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: "Desculpe, estou com dificuldades para conectar no momento. Tente novamente mais tarde.",
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
              "underline font-medium break-all",
              sender === 'user' ? "text-blue-200 hover:text-white" : "text-blue-600 hover:text-blue-800"
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <Card className="w-[350px] h-[500px] mb-4 shadow-2xl border-gray-200 flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
          <CardHeader className="bg-medical-navy text-white p-4 rounded-t-xl flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border-2 border-white/20">
                <AvatarImage src="/bot-avatar.png" />
                <AvatarFallback className="bg-medical-sand text-medical-navy font-bold">IA</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm font-bold">TirzepaLife AI</CardTitle>
                <p className="text-xs text-blue-100">Assistente Virtual</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20 h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 overflow-hidden bg-gray-50">
            <ScrollArea className="h-full p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 mt-20 space-y-4">
                  <Bot className="h-12 w-12 text-medical-navy/30" />
                  <p className="text-sm px-6">
                    Olá! Sou sua assistente virtual. Como posso ajudar você a saber mais sobre o tratamento com Tirzepatida?
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm shadow-sm whitespace-pre-wrap",
                        msg.sender === 'user'
                          ? "ml-auto bg-medical-navy text-white"
                          : "bg-white text-gray-800 border border-gray-100"
                      )}
                    >
                      {renderMessageContent(msg.content, msg.sender)}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-2 bg-white w-max px-3 py-2 rounded-lg border border-gray-100">
                      <div className="w-2 h-2 bg-medical-navy/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-medical-navy/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-medical-navy/50 rounded-full animate-bounce"></div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-3 bg-white border-t border-gray-100">
            <div className="flex w-full items-center gap-2">
              <Input
                placeholder="Digite sua pergunta..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 focus-visible:ring-medical-navy"
                disabled={isLoading}
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage} 
                disabled={isLoading || !inputText.trim()}
                className="bg-medical-navy hover:bg-medical-navy-light text-white shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Toggle Button */}
      <div className={cn("transition-all duration-300 flex flex-col items-end group", isOpen ? "scale-0 opacity-0 absolute" : "scale-100 opacity-100")}>
        {/* Tooltip elegante (aparece no hover) */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-xs font-medium py-1.5 px-3 rounded-lg shadow-lg mb-3 relative mr-1 pointer-events-none">
          <span className="block whitespace-nowrap">Falar com a IA</span>
          <div className="absolute bottom-0 right-5 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
        </div>

        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-medical-navy hover:bg-medical-navy/90 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer"
        >
          <MessageCircle className="h-7 w-7 text-white" />
        </Button>
      </div>
    </div>
  );
};
