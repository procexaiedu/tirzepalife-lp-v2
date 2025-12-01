"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRight, CheckCircle, AlertTriangle, Loader2, MessageCircle, Zap, Clock, Shield } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { motion } from "framer-motion";

export const ContactSection = () => {
  const { openChat } = useChat();
  const [activeTab, setActiveTab] = useState<'chat' | 'form'>('chat');
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    weight: "",
    height: "",
    goal: ""
  });

  const [exclusions, setExclusions] = useState({
    pregnant: false,
    cancerHistory: false,
    pancreatitis: false
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'disqualified'>('idle');

  const handleExclusionChange = (key: keyof typeof exclusions) => {
    setExclusions(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      return newState;
    });
    if (status === 'disqualified') setStatus('idle');
  };

  const checkEligibility = () => {
    if (exclusions.pregnant || exclusions.cancerHistory || exclusions.pancreatitis) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkEligibility()) {
      setStatus('disqualified');
      return;
    }

    setStatus('submitting');

    try {
      const payload = {
        nome: formData.name,
        telefone_whatsapp: formData.phone,
        condicao_medica: "Avaliação Peso/Altura",
        gestante_lactante: exclusions.pregnant,
        historico_tireoide: exclusions.cancerHistory,
        uso_anterior_glp1: false,
        dosagem_interesse: null,
        origem: "site_formulario",
        observacoes: `Peso: ${formData.weight}kg, Altura: ${formData.height}cm, Histórico Pancreatite: ${exclusions.pancreatitis ? 'Sim' : 'Não'}`
      };

      // Usando mode: 'no-cors' para contornar bloqueio de CORS
      // Nota: Não é possível ler a resposta, mas os dados são enviados
      await fetch("https://webh.procexai.tech/webhook/TizerpaLife-Formulario", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain", // no-cors só aceita alguns content-types
        },
        body: JSON.stringify(payload),
      });

      // Como não podemos verificar response.ok com no-cors, assumimos sucesso
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <section id="lead-form" className="py-24 bg-medical-sand/20 relative overflow-hidden">
      <Container>
        {/* Header da Seção */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-medical-navy font-bold tracking-wider text-sm uppercase">Comece Agora</span>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl text-medical-text leading-tight">
              Como podemos <span className="text-medical-navy italic">ajudá-lo?</span>
            </h2>
            <p className="mt-4 text-gray-600">
              Fale com nossos especialistas no WhatsApp para comprar com segurança e entrega rápida.
            </p>
          </motion.div>
        </div>

        {/* Cards de Opção */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 md:gap-8">
          
          {/* Card 1: Chat IA - RECOMENDADO */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -top-3 left-6 z-10">
              <span className="bg-[#D4AF37] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                <Zap className="w-3 h-3" />
                RECOMENDADO
              </span>
            </div>
            
            <div className="h-full bg-gradient-to-br from-medical-navy to-[#2A4A7F] rounded-3xl p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group hover:shadow-[0_20px_60px_-15px_rgba(26,54,93,0.4)] transition-shadow duration-300">
              {/* Background pattern */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-8 h-8 text-[#D4AF37]" />
                </div>
                
                <h3 className="font-serif text-2xl md:text-3xl mb-3">Atendimento Imediato</h3>
                <p className="text-medical-sand/90 mb-8 leading-relaxed">
                  Converse agora com nosso especialista IA e descubra em minutos se o tratamento é ideal para você.
                </p>
                
                {/* Benefícios */}
                <ul className="space-y-4 mb-8">
                  {[
                    { icon: <Zap className="w-4 h-4" />, text: "Resposta em segundos" },
                    { icon: <Clock className="w-4 h-4" />, text: "Disponível 24 horas" },
                    { icon: <Shield className="w-4 h-4" />, text: "Qualificação instantânea" }
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-[#D4AF37]">
                        {item.icon}
                      </div>
                      <span className="text-white/90">{item.text}</span>
                    </li>
                  ))}
                </ul>
                
                {/* CTA Button */}
                <Button 
                  onClick={openChat}
                  size="lg"
                  className="w-full bg-white text-medical-navy hover:bg-medical-sand hover:text-medical-navy font-bold text-lg h-14 shadow-lg group/btn"
                >
                  <span className="relative flex h-2.5 w-2.5 mr-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  Iniciar Conversa
                  <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
                
                <p className="text-center text-xs text-white/50 mt-4">
                  Sem cadastro • Sem espera • 100% gratuito
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Formulário Tradicional */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="h-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Tab Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-medical-navy/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-medical-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-medical-navy">Solicitar Contato</h3>
                    <p className="text-xs text-gray-500">Retornamos em até 2 horas</p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 md:p-8">
                {status === 'success' ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="font-serif text-xl text-medical-navy">Recebemos seu contato!</h4>
                    <p className="text-gray-600 text-sm">
                      Nossa equipe entrará em contato pelo WhatsApp em breve.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setStatus('idle')}
                      size="sm"
                      className="mt-2"
                    >
                      Enviar outro
                    </Button>
                  </div>
                ) : (
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1.5 block">Nome</label>
                        <input 
                          required
                          id="name" 
                          type="text" 
                          placeholder="Seu nome"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-medical-navy focus:ring-1 focus:ring-medical-navy outline-none transition-all bg-gray-50 text-sm"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="whatsapp" className="text-sm font-medium text-gray-700 mb-1.5 block">WhatsApp</label>
                        <input 
                          required
                          id="whatsapp" 
                          type="tel" 
                          placeholder="(11) 99999-9999"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-medical-navy focus:ring-1 focus:ring-medical-navy outline-none transition-all bg-gray-50 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="weight" className="text-sm font-medium text-gray-700 mb-1.5 block">Peso (kg)</label>
                        <input 
                          required
                          id="weight" 
                          type="number" 
                          step="0.1"
                          placeholder="Ex: 85"
                          value={formData.weight}
                          onChange={(e) => setFormData({...formData, weight: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-medical-navy focus:ring-1 focus:ring-medical-navy outline-none transition-all bg-gray-50 text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="height" className="text-sm font-medium text-gray-700 mb-1.5 block">Altura (cm)</label>
                        <input 
                          required
                          id="height" 
                          type="number" 
                          placeholder="Ex: 170"
                          value={formData.height}
                          onChange={(e) => setFormData({...formData, height: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-medical-navy focus:ring-1 focus:ring-medical-navy outline-none transition-all bg-gray-50 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <p className="text-sm font-medium text-gray-700">Critérios de segurança:</p>
                      {[
                        { key: 'pregnant', label: 'Grávida ou amamentando' },
                        { key: 'cancerHistory', label: 'Histórico de câncer de tireoide' },
                        { key: 'pancreatitis', label: 'Histórico de pancreatite' }
                      ].map((item) => (
                        <label key={item.key} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                          <input 
                            type="checkbox"
                            checked={exclusions[item.key as keyof typeof exclusions]}
                            onChange={() => handleExclusionChange(item.key as keyof typeof exclusions)}
                            className="w-4 h-4 text-medical-navy rounded border-gray-300 focus:ring-medical-navy"
                          />
                          <span className="text-sm text-gray-600">{item.label}</span>
                        </label>
                      ))}
                    </div>
                    
                    {status === 'disqualified' && (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-amber-800">
                              Infelizmente não podemos atendê-lo(a)
                            </p>
                            <p className="text-xs text-amber-700 leading-relaxed">
                              O uso de Mounjaro (tirzepatida) é <strong>contraindicado</strong> para pessoas que estão grávidas, amamentando, ou que possuem histórico de câncer de tireoide ou pancreatite.
                            </p>
                            <p className="text-xs text-amber-700 leading-relaxed">
                              Recomendamos que consulte seu médico para avaliar outras opções de tratamento adequadas ao seu caso.
                            </p>
                            <p className="text-xs text-amber-600 mt-2">
                              Agradecemos seu interesse e desejamos saúde! 💛
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {status === 'error' && (
                      <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center">
                        Erro ao enviar. Tente novamente.
                      </div>
                    )}

                    <Button 
                      className="w-full h-12"
                      variant="outline"
                      disabled={status === 'submitting'}
                    >
                      {status === 'submitting' ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          Solicitar Contato
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                    
                    <p className="text-center text-xs text-gray-400">
                      Seus dados estão seguros e protegidos.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};