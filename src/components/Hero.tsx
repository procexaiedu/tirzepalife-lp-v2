"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useRef } from "react";

import { TwincretinTooltip } from "@/components/TwincretinTooltip";
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
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Logo */}
      <div className="absolute top-8 left-12 z-20">
        <Image 
          src="/logo.png" 
          alt="TirzepaLife" 
          width={240} 
          height={80} 
          className="h-20 md:h-24 w-auto mix-blend-multiply"
          priority
        />
      </div>

      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 z-0"
      >
         <div className="absolute inset-0 bg-[url('/img.jpg')] bg-cover bg-[85%_center] md:bg-center bg-no-repeat opacity-100" />
         <div className="absolute inset-0 bg-gradient-to-r from-medical-white via-medical-white/90 to-transparent/20" />
         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-medical-white via-transparent to-transparent h-64" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-medical-text leading-[1.1] mb-8 tracking-tight">
              Silencie o <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-navy to-medical-navy-light italic pr-2">
                “ruído da comida”
              </span>
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="font-sans text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-2xl"
          >
            A primeira terapia <TwincretinTooltip /> que reprograma sua biologia metabólica, oferecendo até <WeightLossTooltip /> com acompanhamento médico especializado.
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <Button 
              onClick={openChat} 
              size="lg" 
              className="cursor-pointer text-base h-14 px-8 sm:text-lg sm:h-16 sm:px-10 rounded-full shadow-2xl shadow-medical-navy/20 transition-all duration-200 hover:scale-105 active:scale-[0.98] active:translate-y-0.5 active:shadow-md"
            >
              Falar com Especialista
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
              <div className="flex -space-x-3">
                {[
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&fit=crop",
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&q=80&fit=crop",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&q=80&fit=crop"
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
                <span>+500 pacientes atendidos</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="mt-8"
          >
            <AnvisaBadge />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6"
          >
             {[
                "Sem dietas restritivas",
                "Acompanhamento médico",
                "Medicação original"
             ].map((item) => (
               <div key={item} className="flex items-center gap-2 text-gray-600 font-medium">
                 <CheckCircle2 className="w-5 h-5 text-medical-navy" />
                 {item}
               </div>
             ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
};