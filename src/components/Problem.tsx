"use client";

import { motion } from "framer-motion";
import { Brain, AlertCircle, Ban, XCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";

export const Problem = () => {
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
              
              <div className="relative">
                {/* Vertical line connecting items */}
                <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-medical-sand/0 via-medical-sand/50 to-medical-sand/0"></div>

                <div className="space-y-10 relative">
                   {[
                     { title: "Dieta Restritiva", desc: "Você corta calorias drasticamente." },
                     { title: "Aumento da Fome", desc: "Hormônios da fome (Grelina) disparam." },
                     { title: "Metabolismo Lento", desc: "O corpo entra em modo de economia." },
                     { title: "Recuperação de Peso", desc: "O peso volta, muitas vezes maior." }
                   ].map((step, i) => (
                     <div key={i} className="flex items-center gap-6">
                       <div className="w-12 h-12 rounded-full bg-medical-navy border border-medical-sand flex items-center justify-center shrink-0 z-10 shadow-[0_0_15px_rgba(232,224,213,0.3)]">
                         <span className="font-serif text-xl text-medical-sand">{i + 1}</span>
                       </div>
                       <div>
                         <h4 className="font-semibold text-lg text-white">{step.title}</h4>
                         <p className="text-sm text-gray-400">{step.desc}</p>
                       </div>
                     </div>
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