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
    <section ref={ref} className="relative min-h-screen flex flex-col md:flex-row md:items-center overflow-hidden pt-20 pb-8 md:pb-0">
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

      {/* Desktop Background - Hidden on mobile */}
      <div className="hidden md:block absolute inset-0 z-0">
         <div className="absolute inset-0 bg-[url('/img.jpg')] bg-no-repeat bg-cover bg-[80%_center] lg:bg-right opacity-100" />
         <div className="pointer-events-none absolute inset-y-0 left-0 w-[85%] lg:w-[70%] bg-gradient-to-r from-medical-white via-medical-white/95 to-transparent" />
         <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-medical-white via-transparent to-transparent h-64" />
      </div>

      {/* Mobile Background - Subtle gradient only */}
      <div className="md:hidden absolute inset-0 z-0 bg-gradient-to-b from-medical-white via-medical-white to-medical-sand/30" />

      {/* Mobile Hero Image - Visible only on mobile */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="md:hidden relative w-full h-[45vh] min-h-[320px] mt-16 mb-4 overflow-hidden"
      >
        <Image
          src="/img.jpg"
          alt="Mulher sorrindo segurando produto TirzepaLife"
          fill
          className="object-cover object-[65%_20%]"
          priority
          sizes="100vw"
        />
        {/* Gradiente suave na parte inferior para transição com o conteúdo */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-medical-white to-transparent" />
      </motion.div>

      <Container className="relative z-10 flex-1 flex items-center">
        <div className="max-w-3xl lg:max-w-xl xl:max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl text-medical-text leading-[1.1] mb-6 md:mb-8 tracking-tight">
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
            className="font-sans text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 md:mb-8 leading-relaxed max-w-2xl"
          >
            Controle o apetite e retome o comando do seu corpo com <span className="font-semibold text-medical-navy">Tirzepatida</span>. <br className="hidden sm:block" />
            Resultados de até <WeightLossTooltip /> com acompanhamento médico especializado.
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6"
          >
            <div className="flex flex-col items-start gap-2">
              <Button 
                onClick={openChat} 
                size="lg" 
                className="cursor-pointer text-base h-14 px-8 sm:text-lg sm:h-16 sm:px-10 rounded-full shadow-2xl shadow-medical-navy/20 transition-all duration-200 hover:scale-105 active:scale-[0.98] active:translate-y-0.5 active:shadow-md"
              >
                Ver se é pra mim
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Resposta em segundos • Sem compromisso
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                <div className="flex -space-x-3">
                  {[
                    "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=64&h=64&q=80&fit=crop",
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&q=80&fit=crop",
                    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=64&h=64&q=80&fit=crop"
                  ].map((src, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden relative">
                      <img 
                        src={src} 
                        alt={`Paciente ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex gap-1 text-yellow-500">★★★★★</div>
                  <span>+500 vidas transformadas</span>
                </div>
              </div>
              <AnvisaBadge />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-8 md:mt-16 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
          >
             {[
                "Menos fome e ansiedade",
                "Acompanhamento médico",
                "Entrega rápida"
             ].map((item) => (
               <div key={item} className="flex items-center gap-2 text-gray-600 font-medium text-sm md:text-base">
                 <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-medical-navy flex-shrink-0" />
                 {item}
               </div>
             ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
};