import React, { useState } from 'react';
import { MessageCircle, Phone, Check, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ContactOptionsProps {
  onWhatsAppClick: () => void;
  onPhoneSubmit: (phone: string) => void;
}

export const ContactOptions: React.FC<ContactOptionsProps> = ({ onWhatsAppClick, onPhoneSubmit }) => {
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    // Simple mask (XX) XXXXX-XXXX
    if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 9) {
      value = `${value.slice(0, 10)}-${value.slice(10)}`;
    }
    
    setPhone(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 14) { // (XX) XXXXX-XXXX
      onPhoneSubmit(phone);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-100 p-4 rounded-xl flex flex-col items-center text-center gap-2 my-2"
      >
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-1">
          <Check className="w-5 h-5" />
        </div>
        <h4 className="font-serif text-green-800 font-medium">Solicitação Recebida</h4>
        <p className="text-xs text-green-700/80">
          Nossa equipe entrará em contato com você pelo número <strong>{phone}</strong> em instantes.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--color-medical-white)] border border-[var(--color-medical-sand-dark)]/30 rounded-xl p-4 my-3 shadow-sm"
    >
      <h4 className="font-serif text-[var(--color-medical-navy)] font-medium text-sm mb-3 text-center">
        Como prefere falar com o especialista?
      </h4>

      <div className="space-y-3">
        {/* Option A: WhatsApp */}
        <button
          onClick={onWhatsAppClick}
          className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md group"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Chamar no WhatsApp</span>
          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -ml-1 group-hover:ml-0" />
        </button>

        <div className="relative flex items-center py-1">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-3 text-[10px] text-gray-400 uppercase tracking-wider">ou nós ligamos</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Option B: Phone Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="(DD) 99999-9999"
            className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[var(--color-medical-text)] focus:border-[var(--color-medical-navy)] focus:ring-1 focus:ring-[var(--color-medical-navy)]/20 outline-none transition-all placeholder:text-gray-300"
          />
          <button
            type="submit"
            disabled={phone.length < 14}
            className="bg-[var(--color-medical-navy)] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 rounded-lg hover:bg-[var(--color-medical-navy-light)] transition-colors flex items-center justify-center"
          >
            <Phone className="w-4 h-4" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};
