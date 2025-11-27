"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRight, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

export const ContactSection = () => {
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
      // Check immediate disqualification logic if needed, or wait for submit
      return newState;
    });
    // Reset status if they uncheck something
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
      // Payload structure for n8n
      const payload = {
        name: formData.name,
        phone: formData.phone,
        weight: formData.weight,
        height: formData.height,
        goal: formData.goal,
        qualified: true,
        source: "landing_page_form",
        timestamp: new Date().toISOString()
      };

      // Using the same webhook logic/base URL as AI Chat, 
      // Assuming a specific endpoint for form leads might be needed, 
      // but utilizing the provided domain. 
      // Note: Ideally this should be a different UUID or endpoint in production.
      const response = await fetch("https://webh.procexai.tech/webhook/c457fa49-542f-49e3-85e8-96faca1f43f6", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
           // Wrapping in 'data' key to match typical n8n/Evolution API structures if they reuse the flow
           data: {
               ...payload,
               message: `Nova solicitação de avaliação:\nNome: ${payload.name}\nTel: ${payload.phone}\nPeso: ${payload.weight}\nAltura: ${payload.height}`
           },
           sender: "form_submission"
        }),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <section id="lead-form" className="py-24 bg-medical-sand/20 relative overflow-hidden">
      <Container>
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Side - Visual & Value Prop */}
          <div className="md:w-5/12 bg-medical-navy p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-medical-accent/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

            <div className="relative z-10">
              <h3 className="font-serif text-3xl mb-6">Fale com um Especialista</h3>
              <p className="text-medical-sand mb-8">
                Preencha o formulário para que nossa IA médica verifique sua elegibilidade. Se aprovado, entraremos em contato via WhatsApp imediatamente.
              </p>
              
              <ul className="space-y-4 mb-8">
                {[ 
                  "Avaliação de segurança clínica",
                  "Atendimento via WhatsApp",
                  "Tire suas dúvidas na hora"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-medium text-gray-200">
                    <CheckCircle className="w-4 h-4 text-medical-accent" />
                    {item}
                  </div>
                ))}
              </ul>
            </div>
            
            <div className="relative z-10 pt-8 border-t border-white/10">
               <p className="text-xs text-gray-400">
                 Seus dados de saúde são estritamente confidenciais.
               </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-7/12 p-10 md:p-12">
            {status === 'success' ? (
               <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                     <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h4 className="font-serif text-2xl text-medical-navy">Solicitação Recebida!</h4>
                  <p className="text-gray-600">
                    Sua avaliação preliminar foi aprovada. Nossa equipe entrará em contato pelo WhatsApp fornecido em instantes.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setStatus('idle')}
                    className="mt-4"
                  >
                    Enviar nova solicitação
                  </Button>
               </div>
            ) : (
             <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                   <h4 className="font-semibold text-medical-navy border-b pb-2">1. Dados Pessoais</h4>
                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium text-gray-700">Nome Completo</label>
                          <input 
                            required
                            id="name" 
                            type="text" 
                            placeholder="Seu nome"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-medical-navy focus:ring-1 focus:ring-medical-navy outline-none transition-all bg-gray-50"
                          />
                      </div>
                      <div className="space-y-2">
                          <label htmlFor="whatsapp" className="text-sm font-medium text-gray-700">WhatsApp (com DDD)</label>
                          <input 
                            required
                            id="whatsapp" 
                            type="tel" 
                            placeholder="(11) 99999-9999"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-medical-navy focus:ring-1 focus:ring-medical-navy outline-none transition-all bg-gray-50"
                          />
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-semibold text-medical-navy border-b pb-2">2. Perfil Biométrico</h4>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="weight" className="text-sm font-medium text-gray-700">Peso (kg)</label>
                            <input 
                                required
                                id="weight" 
                                type="number" 
                                step="0.1"
                                placeholder="Ex: 85.5"
                                value={formData.weight}
                                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-medical-navy focus:ring-1 focus:ring-medical-navy outline-none transition-all bg-gray-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="height" className="text-sm font-medium text-gray-700">Altura (cm)</label>
                            <input 
                                required
                                id="height" 
                                type="number" 
                                placeholder="Ex: 170"
                                value={formData.height}
                                onChange={(e) => setFormData({...formData, height: e.target.value})}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-medical-navy focus:ring-1 focus:ring-medical-navy outline-none transition-all bg-gray-50"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-semibold text-medical-navy border-b pb-2 flex items-center gap-2">
                        3. Critérios de Segurança
                        <span className="text-xs font-normal text-gray-500">(Marque se aplicar)</span>
                    </h4>
                    
                    <div className="space-y-3">
                        <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                            <input 
                                type="checkbox"
                                checked={exclusions.pregnant}
                                onChange={() => handleExclusionChange('pregnant')}
                                className="mt-1 w-4 h-4 text-medical-navy rounded border-gray-300 focus:ring-medical-navy"
                            />
                            <span className="text-sm text-gray-700">
                                Estou grávida ou amamentando no momento.
                            </span>
                        </label>

                        <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                            <input 
                                type="checkbox"
                                checked={exclusions.cancerHistory}
                                onChange={() => handleExclusionChange('cancerHistory')}
                                className="mt-1 w-4 h-4 text-medical-navy rounded border-gray-300 focus:ring-medical-navy"
                            />
                            <span className="text-sm text-gray-700">
                                Histórico pessoal/familiar de Carcinoma Medular de Tireoide ou NEM 1.
                            </span>
                        </label>

                        <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                            <input 
                                type="checkbox"
                                checked={exclusions.pancreatitis}
                                onChange={() => handleExclusionChange('pancreatitis')}
                                className="mt-1 w-4 h-4 text-medical-navy rounded border-gray-300 focus:ring-medical-navy"
                            />
                            <span className="text-sm text-gray-700">
                                Histórico de pancreatite aguda ou crônica.
                            </span>
                        </label>
                    </div>
                </div>
                
                {status === 'disqualified' && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-red-800">
                            <p className="font-medium mb-1">Atenção: Contraindicação Identificada</p>
                            Com base nos critérios marcados, o tratamento pode não ser seguro para você. Recomendamos consultar seu médico presencialmente.
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                        Ocorreu um erro ao enviar. Tente novamente ou nos chame no WhatsApp direto.
                    </div>
                )}

                <Button 
                    className="w-full h-14 text-lg mt-4"
                    size="lg"
                    disabled={status === 'submitting'}
                >
                   {status === 'submitting' ? (
                       <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analisando...
                       </>
                   ) : (
                       <>
                        Solicitar Análise
                        <ArrowRight className="ml-2 w-5 h-5" />
                       </>
                   )}
                </Button>
             </form>
            )}
          </div>

        </div>
      </Container>
    </section>
  );
};