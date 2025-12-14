"use client";

import { useState } from "react";
import Link from "next/link";

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    const consent = localStorage.getItem("cookie-consent");
    return !consent;
  });

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-medical-navy/95 text-white p-6 shadow-lg z-50 border-t border-white/10 backdrop-blur-sm animate-fade-in-up">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-300 max-w-3xl">
          <p>
            Utilizamos cookies para melhorar a sua experiência em nosso site. Ao continuar navegando, você concorda com a nossa{" "}
            <Link href="/privacidade" className="text-medical-sand underline hover:text-white transition-colors">
              Política de Privacidade
            </Link>{" "}
            e{" "}
            <Link href="/termos-de-uso" className="text-medical-sand underline hover:text-white transition-colors">
              Termos de Uso
            </Link>.
          </p>
        </div>
        <div className="flex gap-4 shrink-0">
          <button
            onClick={handleAccept}
            className="bg-medical-sand text-medical-navy px-6 py-2 rounded-full text-sm font-semibold hover:bg-white transition-colors"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
};




