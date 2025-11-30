"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Zap, Activity, ArrowRight } from "lucide-react";
import { useState, useRef } from "react";

export const Mechanism = () => {
  const [activeCard, setActiveCard] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const cards = [
    {
      title: "Saciedade Prolongada",
      icon: <Activity className="w-8 h-8" />,
      desc: "Retarda o esvaziamento gástrico, fazendo você se sentir satisfeito com porções muito menores.",
      color: "bg-blue-50 text-blue-900"
    },
    {
      title: "Silêncio Mental",
      icon: <Zap className="w-8 h-8" />,
      desc: "Atua nos centros de recompensa do cérebro, desligando o desejo compulsivo por comida.",
      color: "bg-indigo-50 text-indigo-900"
    },
    {
      title: "Metabolismo Otimizado",
      icon: <Activity className="w-8 h-8" />, // Reusing icon for demo
      desc: "Melhora a sensibilidade à insulina e favorece a queima de gordura como fonte de energia.",
      color: "bg-amber-50 text-amber-900"
    }
  ];

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.offsetWidth;
      const newActiveCard = Math.round(scrollPosition / cardWidth);
      setActiveCard(newActiveCard);
    }
  };

  const scrollToCard = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
      setActiveCard(index);
    }
  };

  return (
    <section id="mechanism" className="py-32 bg-gradient-to-b from-medical-white to-[#EFEBE4] overflow-hidden">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-medical-navy font-bold tracking-wider text-sm uppercase">Ciência de Ponta</span>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl text-medical-text leading-tight">
              O Poder do Efeito <br/><span className="text-medical-navy italic">Twincretin</span>
            </h2>
            <p className="mt-6 text-lg text-gray-600">
              Diferente de tratamentos anteriores que atuavam apenas em um receptor (GLP-1), a Tirzepatida atua em dois (GLP-1 + GIP), potencializando os resultados.
            </p>
          </motion.div>
        </div>

        {/* Mobile Carousel / Desktop Grid */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-visible snap-x snap-mandatory gap-0 md:gap-8 mb-8 md:mb-16 pb-4 md:pb-0 scrollbar-hide -mx-4 md:mx-0 px-4 md:px-0"
        >
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="min-w-full md:min-w-0 snap-center px-2 md:px-0"
            >
              <div className="h-full group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 ${card.color} opacity-10 rounded-bl-[100px] transition-transform group-hover:scale-110`} />
                
                <div className={`w-14 h-14 rounded-2xl ${card.color} flex items-center justify-center mb-6`}>
                  {card.icon}
                </div>
                
                <h3 className="font-serif text-2xl text-medical-text mb-4">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {card.desc}
                </p>
                
                <div className="flex items-center text-medical-navy font-semibold text-sm group-hover:translate-x-2 transition-transform">
                  Saiba mais <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Navigation Dots */}
        <div className="flex justify-center gap-3 mb-12 md:hidden">
          {cards.map((_, i) => (
            <button 
              key={i}
              onClick={() => scrollToCard(i)}
              aria-label={`Ir para slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${activeCard === i ? 'w-8 bg-medical-navy' : 'w-2 bg-gray-300'}`}
            />
          ))}
        </div>

        {/* Comparison Table / Visual */}
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
        >
          <div className="grid md:grid-cols-2">
            <div className="p-10 md:p-16 bg-medical-navy text-white flex flex-col justify-center">
              <h3 className="font-serif text-3xl mb-6">Semaglutida vs. Tirzepatida</h3>
              <p className="text-medical-sand text-lg mb-8">
                Enquanto a Semaglutida (Ozempic/Wegovy) atua em 1 receptor, a Tirzepatida (Mounjaro) atua em 2. É a evolução do tratamento.
              </p>
              <div className="text-4xl md:text-6xl font-serif font-bold text-white mb-2">
                -20.9%
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-widest">Perda média de peso (Estudos Clínicos)</div>
            </div>
            <div className="p-10 md:p-16 bg-white flex flex-col justify-center relative">
                {/* Decorative Grid */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-50"></div>
                
                <div className="relative z-10 space-y-6">
                    <div>
                        <div className="flex justify-between text-sm font-semibold text-gray-500 mb-2">
                            <span>Dieta e Exercício Isolados</span>
                            <span>~3-5%</span>
                        </div>
                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: "15%" }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-full bg-gray-400 rounded-full" 
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm font-semibold text-gray-500 mb-2">
                            <span>Agonistas GLP-1 (1ª Geração)</span>
                            <span>~15%</span>
                        </div>
                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: "60%" }}
                                transition={{ duration: 1, delay: 0.7 }}
                                className="h-full bg-medical-navy-light/60 rounded-full" 
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm font-semibold text-medical-navy mb-2">
                            <span>Tirzepatida (Twincretin)</span>
                            <span>Até 20.9%</span>
                        </div>
                        <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                            <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: "90%" }}
                                transition={{ duration: 1, delay: 0.9 }}
                                className="h-full bg-gradient-to-r from-medical-navy to-medical-accent rounded-full relative" 
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </motion.div>

      </Container>
    </section>
  );
};
