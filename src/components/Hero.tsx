"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useRef } from "react";

import { WeightLossTooltip } from "@/components/WeightLossTooltip";
import { AnvisaBadge } from "@/components/AnvisaBadge";
import { useChat } from "@/context/ChatContext";

export const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { openChat } = useChat();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-8 md:pb-0">
      {/* Logo */}
      <div className="absolute top-2 left-2 md:top-8 md:left-12 z-20">
        <Image 
          src="/logo.png" 
          alt="TirzepaLife" 
          width={240} 
          height={80} 
          className="h-16 md:h-24 w-auto mix-blend-multiply"
          priority
        />
      </div>

      {/* Background Image - All devices */}
      <div className="absolute inset-0 z-0">
         {/* Imagem de fundo posicionada para mostrar a modelo à direita */}
         <div className="absolute inset-0 bg-[url('/img.jpg')] bg-no-repeat bg-cover bg-[70%_30%] md:bg-[80%_center] lg:bg-right opacity-100" />
         {/* Gradiente para legibilidade do texto - mais suave no mobile para mostrar mais da modelo */}
         <div className="pointer-events-none absolute inset-y-0 left-0 w-[65%] md:w-[85%] lg:w-[70%] bg-gradient-to-r from-medical-white via-medical-white/85 md:via-medical-white/95 to-transparent" />
         {/* Gradiente inferior */}
         <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-medical-white via-transparent to-transparent h-32 md:h-64" />
      </div>

      <Container className="relative z-10 flex-1 flex items-center">
        <div className="max-w-[65%] sm:max-w-[70%] md:max-w-3xl lg:max-w-xl xl:max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl text-medical-text leading-[1.1] mb-4 md:mb-8 tracking-tight">
              Mais saciedade, menos fome: <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-navy to-medical-navy-light italic pr-2">
                Emagreça com comprovação científica
              </span>
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="font-sans text-sm sm:text-base md:text-xl lg:text-2xl text-gray-600 mb-4 md:mb-8 leading-relaxed max-w-2xl"
          >
            Controle o apetite e retome o comando do seu corpo com <span className="font-semibold text-medical-navy">Tirzepatida</span>. <br className="hidden sm:block" />
            Resultados de até <WeightLossTooltip /> com acompanhamento médico especializado.
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col gap-3 md:gap-6"
          >
            <div className="flex flex-col items-start gap-2">
              <Button 
                onClick={openChat} 
                size="lg" 
                className="cursor-pointer text-sm h-12 px-6 sm:text-base sm:h-14 sm:px-8 md:text-lg md:h-16 md:px-10 rounded-full shadow-2xl shadow-medical-navy/20 transition-all duration-200 hover:scale-105 active:scale-[0.98] active:translate-y-0.5 active:shadow-md"
              >
                Ver se é pra mim
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
              </Button>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 font-medium">
                Resposta em segundos • Sem compromisso
              </p>
            </div>
            
            <div className="flex flex-col gap-2 md:gap-3">
              <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm font-medium text-gray-500">
                <div className="flex -space-x-2 md:-space-x-3">
                  {[
                    "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=64&h=64&q=80&fit=crop",
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&q=80&fit=crop",
                    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=64&h=64&q=80&fit=crop"
                  ].map((src, i) => (
                    <div key={i} className="w-7 h-7 md:w-10 md:h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden relative">
                      <img 
                        src={src} 
                        alt={`Paciente ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex gap-0.5 text-yellow-500 text-[10px] md:text-sm">★★★★★</div>
                  <span className="text-[10px] md:text-sm">+500 vidas transformadas</span>
                </div>
              </div>
              <AnvisaBadge />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-4 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6"
          >
             {[
                "Menos fome e ansiedade",
                "Acompanhamento médico",
                "Entrega rápida"
             ].map((item) => (
               <div key={item} className="flex items-center gap-1.5 md:gap-2 text-gray-600 font-medium text-xs md:text-base">
                 <CheckCircle2 className="w-3.5 h-3.5 md:w-5 md:h-5 text-medical-navy flex-shrink-0" />
                 {item}
               </div>
             ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
};