"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "O que é a Tirzepatida (Mounjaro)?",
    answer: "A Tirzepatida é o primeiro medicamento de uma nova classe chamada 'twincretins'. Ela imita dois hormônios naturais do corpo (GIP e GLP-1) que regulam o apetite e o açúcar no sangue, resultando em uma perda de peso significativamente maior do que os medicamentos anteriores."
  },
  {
    question: "Preciso de receita médica?",
    answer: "Sim. A Tirzepatida é um medicamento controlado e exige prescrição médica. Nossa equipe realiza uma avaliação completa do seu histórico de saúde antes de prescrever o tratamento."
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
      </Container>
    </section>
  );
};
