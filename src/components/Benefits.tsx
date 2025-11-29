"use client";

import { Container } from "@/components/ui/Container";
import { Check, Star, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    title: "Avaliação Especializada",
    desc: "Análise detalhada do seu perfil para o protocolo ideal."
  },
  {
    title: "Envio para todo o Brasil",
    desc: "Entrega rápida, segura e discreta em qualquer região do país."
  },
  {
    title: "Acompanhamento Contínuo",
    desc: "Monitoramento mensal da sua evolução e ajustes."
  },
  {
    title: "Suporte Humanizado",
    desc: "Equipe disponível no WhatsApp para tirar todas as dúvidas."
  }
];

export const Benefits = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-medical-sand/10 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] bg-medical-navy/5 rounded-full blur-3xl opacity-60" />
      </div>

      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* Coluna da Esquerda: Copy Persuasivo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medical-navy/5 text-medical-navy text-sm font-medium mb-6">
              <Star className="w-4 h-4 fill-current" />
              <span>Experiência Premium</span>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl text-medical-navy mb-6 leading-tight">
              Emagrecimento Científico, <br/>
              <span className="italic text-medical-sand-dark relative">
                No Conforto do Seu Lar
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-medical-sand/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Unimos a eficácia comprovada do protocolo Twincretin (Mounjaro) à conveniência que você merece. 
              Sem filas de espera, sem julgamentos e com total discrição.
            </p>
            
            <div className="space-y-6">
              {benefits.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 group"
                >
                  <div className="bg-medical-white p-3 rounded-2xl shrink-0 group-hover:bg-medical-sand/20 transition-colors duration-300 border border-medical-sand/20">
                     <Check className="w-5 h-5 text-medical-navy" />
                  </div>
                  <div>
                    <h3 className="text-medical-navy font-semibold text-lg">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Coluna da Direita: Visual Lifestyle/Aspiracional */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Card Principal da Imagem */}
            <div className="relative h-[600px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100">
               {/* Imagem Lifestyle: Mulher confiante, ambiente leve */}
               <div 
                 className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                 style={{ backgroundImage: "url('https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1000&auto=format&fit=crop')" }}
               />
               
               {/* Overlay Gradiente Suave */}
               <div className="absolute inset-0 bg-gradient-to-t from-medical-navy/80 via-transparent to-transparent" />

               {/* Floating Card 1: Aprovado */}
               <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 max-w-[200px]"
               >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-full text-green-600">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-gray-800 text-sm">100% Seguro</span>
                  </div>
                  <p className="text-xs text-gray-500">Acompanhamento médico validado.</p>
               </motion.div>

               {/* Floating Card 2: Depoimento/Resultado */}
               <div className="absolute bottom-8 left-8 right-8 text-white">
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                    <div className="flex items-center gap-2 mb-3 text-medical-sand">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <p className="font-serif text-xl italic mb-2">&quot;O processo foi muito mais simples do que imaginei. Me senti acolhida.&quot;</p>
                    <p className="text-sm opacity-80 font-medium">- Paciente Verificada</p>
                  </div>
               </div>
            </div>
            
            {/* Decorative Blob atras da imagem */}
            <div className="absolute -z-10 top-1/2 -right-12 w-64 h-64 bg-medical-sand/30 rounded-full blur-3xl transform -translate-y-1/2" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
