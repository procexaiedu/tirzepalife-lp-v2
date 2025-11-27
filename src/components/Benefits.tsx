"use client";

import { Container } from "@/components/ui/Container";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  "Avaliação médica especializada em obesidade",
  "Prescrição digital válida em todo território nacional",
  "Acompanhamento mensal da evolução",
  "Ajuste de dosagem personalizado",
  "Suporte via WhatsApp para dúvidas",
  "Protocolo twincretin (Mounjaro/Tirzepatida)",
];

export const Benefits = () => {
  return (
    <section className="py-24 bg-medical-white relative">
      <Container>
        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-medical-sand/20 overflow-hidden relative">
          
          {/* Decorative */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-medical-sand/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-serif text-4xl md:text-5xl text-medical-navy mb-6">
                  Tratamento Premium, <br/>
                  <span className="italic text-medical-sand-dark">Sem Sair de Casa</span>
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Esqueça as salas de espera lotadas. Oferecemos uma experiência de telemedicina de alto padrão, focada exclusivamente em emagrecimento avançado.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {benefits.map((benefit, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3"
                    >
                      <div className="bg-medical-navy/10 rounded-full p-1 mt-1 shrink-0">
                         <Check className="w-3 h-3 text-medical-navy" />
                      </div>
                      <span className="text-medical-text font-medium">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative h-[400px] w-full bg-gray-200 rounded-3xl overflow-hidden shadow-lg"
            >
               {/* Placeholder for a lifestyle or doctor image */}
               <div 
                 className="absolute inset-0 bg-cover bg-center"
                 style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')" }}
               />
               <div className="absolute inset-0 bg-gradient-to-t from-medical-navy/60 to-transparent flex items-end p-8">
                  <div className="text-white">
                    <p className="font-serif text-2xl italic">&quot;A obesidade é complexa. O tratamento não precisa ser.&quot;</p>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
};
