"use client";

import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import { Brain, Ban } from "lucide-react";
import { useRef } from "react";
import { Container } from "@/components/ui/Container";

const CycleStep = ({ step, index, scrollYProgress, totalSteps }: { step: { title: string; desc: string }, index: number, scrollYProgress: MotionValue<number>, totalSteps: number }) => {
  // Calculate the range for this step to activate
  // Usando intervalos mais suaves para melhor resposta em ambas as direções
  const stepStart = index / totalSteps;
  const stepMid = (index + 0.3) / totalSteps;
  
  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, stepStart - 0.05), stepMid],
    [0.3, 1]
  );
  
  const scale = useTransform(
    scrollYProgress,
    [Math.max(0, stepStart - 0.05), stepMid],
    [0.9, 1]
  );

  // Threshold mais suave para transição bidirecional
  const isCompleted = useTransform(
    scrollYProgress,
    [stepStart, stepMid],
    [0, 1]
  );

  return (
    <motion.div 
      style={{ opacity, scale }}
      className="flex items-center gap-6 relative z-10"
    >
      <div className="relative">
        <motion.div 
          className="w-12 h-12 rounded-full bg-medical-navy border border-medical-sand flex items-center justify-center shrink-0 relative z-10 shadow-[0_0_15px_rgba(232,224,213,0.3)]"
          style={{
            backgroundColor: useTransform(isCompleted, [0, 1], ["#1A365D", "#E8E0D5"]),
          }}
        >
          <motion.span 
            className="font-serif text-xl"
            style={{
                color: useTransform(isCompleted, [0, 1], ["#E8E0D5", "#1A365D"]),
            }}
          >
            {index + 1}
          </motion.span>
        </motion.div>
        
        {/* Glow effect when active */}
        <motion.div 
            style={{ opacity: isCompleted }}
            className="absolute inset-0 rounded-full bg-medical-sand blur-md -z-10"
        />
      </div>
      
      <div>
        <motion.h4 
            className="font-semibold text-lg text-white"
            style={{
                color: useTransform(isCompleted, [0, 1], ["rgba(255,255,255,0.7)", "#ffffff"]),
                textShadow: useTransform(isCompleted, [0, 1], ["none", "0 0 20px rgba(255,255,255,0.5)"]),
            }}
        >
            {step.title}
        </motion.h4>
        <p className="text-sm text-gray-400">{step.desc}</p>
      </div>
    </motion.div>
  );
};

export const Problem = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 50%"] // Offset mais simétrico para comportamento bidirecional
  });

  // Spring com configuração otimizada para resposta rápida em ambas as direções
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300, // Maior rigidez = resposta mais rápida
    damping: 40,    // Damping balanceado para evitar oscilação
    restDelta: 0.01 // Threshold maior para evitar micro-atualizações
  });

  // Map progress to height percentage (0% to 100%)
  const height = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  const steps = [
    { title: "Dieta Restritiva", desc: "Você corta calorias drasticamente." },
    { title: "Aumento da Fome", desc: "Hormônios da fome (Grelina) disparam." },
    { title: "Metabolismo Lento", desc: "O corpo entra em modo de economia." },
    { title: "Recuperação de Peso", desc: "O peso volta, muitas vezes maior." }
  ];

  return (
    <section className="py-32 bg-medical-navy text-white relative overflow-hidden">
      {/* Background Noise/Texture */}
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      
      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1 rounded-full border border-white/20 text-sm font-light tracking-widest mb-6 text-medical-sand">
              A CIÊNCIA DO APETITE
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-8">
              Não é falta de força de vontade. <br />
              <span className="text-medical-sand">É biologia.</span>
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-xl">
              Seu cérebro primitivo foi programado para sobreviver à escassez. Em um mundo de abundância, esse mecanismo se torna seu maior inimigo, criando o que chamamos de <strong>&quot;Food Noise&quot;</strong>.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <Brain className="w-8 h-8 text-medical-sand mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Pensamento Intrusivo</h3>
                  <p className="text-sm text-gray-400">Aquele diálogo interno constante sobre o que comer, quando comer e quanto comer, mesmo sem fome física.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <Ban className="w-8 h-8 text-medical-sand mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Resistência Metabólica</h3>
                  <p className="text-sm text-gray-400">Dietas restritivas diminuem seu metabolismo basal, fazendo com que você recupere o peso rapidamente (efeito sanfona).</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-medical-sand/20 blur-3xl rounded-full transform translate-x-10 translate-y-10"></div>
            <div className="glass-panel-dark rounded-3xl p-10 md:p-12 relative border-white/10">
              <h3 className="font-serif text-2xl mb-8 text-center">O Ciclo da Frustração</h3>
              
              <div className="relative" ref={containerRef}>
                {/* Background Guide Line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-white/10"></div>
                
                {/* Animated Progress Line */}
                <motion.div 
                    style={{ height }}
                    className="absolute left-6 top-6 w-0.5 bg-gradient-to-b from-medical-sand via-white to-medical-sand shadow-[0_0_10px_rgba(232,224,213,0.8)]"
                />

                <div className="space-y-10 relative">
                   {steps.map((step, i) => (
                     <CycleStep 
                        key={i} 
                        step={step} 
                        index={i} 
                        scrollYProgress={smoothProgress} 
                        totalSteps={steps.length} 
                     />
                   ))}
                </div>
              </div>
              
              <div className="mt-10 pt-8 border-t border-white/10 text-center">
                 <p className="italic text-medical-sand text-lg">&quot;A culpa não é sua. O tratamento existe.&quot;</p>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
