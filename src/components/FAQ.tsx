"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, MessageCircle, ArrowRight } from "lucide-react";
import { useChat } from "@/context/ChatContext";

const faqs = [
  {
    question: "O que é a Tirzepatida (Mounjaro)?",
    answer: "A Tirzepatida é o primeiro medicamento de uma nova classe chamada 'twincretins'. Ela imita dois hormônios naturais do corpo (GIP e GLP-1) que regulam o apetite e o açúcar no sangue, resultando em uma perda de peso significativamente maior do que os medicamentos anteriores."
  },
  {
    question: "Como é feito o acompanhamento?",
    answer: "Você terá suporte contínuo via WhatsApp com nossa equipe de especialistas para monitorar sua evolução, ajustar doses se necessário e garantir que você alcance seus objetivos com segurança e conforto."
  },
  {
    question: "Quais são os efeitos colaterais?",
    answer: "Os efeitos mais comuns são gastrointestinais, como náusea leve e constipação, que tendem a diminuir com o tempo. Nosso protocolo inclui estratégias específicas para minimizar esses efeitos desde o primeiro dia."
  },
  {
    question: "Em quanto tempo vejo resultados?",
    answer: "Muitos pacientes relatam redução do apetite logo na primeira semana. A perda de peso visível geralmente começa nas primeiras 2-4 semanas de tratamento contínuo."
  }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { openChat } = useChat();

  return (
    <section className="py-24 bg-white">
      <Container className="max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-medical-text mb-4">Perguntas Frequentes</h2>
          <p className="text-gray-500">Tudo o que você precisa saber antes de começar.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-2xl overflow-hidden hover:border-medical-navy/30 transition-colors bg-medical-white/30"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex items-center justify-between w-full p-6 text-left"
              >
                <span className="font-serif text-lg text-medical-navy font-medium pr-8">
                  {faq.question}
                </span>
                <div className={`shrink-0 text-medical-navy transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}>
                  {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-100/50 mt-2">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* CTA Contextual - Falar com Especialista */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 relative"
        >
          <div className="bg-gradient-to-r from-medical-navy to-[#2A4A7F] rounded-2xl p-8 md:p-10 text-white overflow-hidden relative">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center shrink-0">
                  <MessageCircle className="w-7 h-7 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-serif text-xl md:text-2xl mb-1">Ainda tem dúvidas?</h3>
                  <p className="text-medical-sand/80 text-sm md:text-base">
                    Converse agora com nosso especialista e descubra se o tratamento é para você.
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={openChat}
                variant="secondary"
                size="lg"
                className="whitespace-nowrap bg-white text-medical-navy hover:bg-medical-sand hover:text-medical-navy shadow-lg group"
              >
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Falar Agora
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
