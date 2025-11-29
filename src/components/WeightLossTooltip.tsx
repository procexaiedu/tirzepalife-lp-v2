"use client";

import React from "react";
import Link from "next/link";

export const WeightLossTooltip = () => {
  return (
    <span className="group relative inline-block align-baseline">
      {/* Mobile Link / Desktop Hover Trigger */}
      <Link 
        href="#mechanism"
        className="text-medical-navy font-bold underline decoration-dotted decoration-medical-navy/50 hover:decoration-solid cursor-help md:cursor-help"
      >
        20,9% de perda de peso
      </Link>

      {/* Tooltip - Hidden on Mobile, Visible on Desktop Hover */}
      <span
        role="tooltip"
        className="hidden md:block invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 p-4 bg-medical-navy text-white text-sm rounded-xl shadow-2xl z-50 pointer-events-none"
      >
        <span className="font-semibold mb-1 text-medical-sand text-base block">Como?</span>
        <span className="leading-relaxed text-white/90 text-xs block">
          Resultados baseados no estudo clínico SURMOUNT-1 (72 semanas), onde a Tirzepatida demonstrou superioridade em relação a outros tratamentos, agindo na redução do apetite e otimização metabólica.
        </span>
        {/* Arrow */}
        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-2 border-8 border-transparent border-t-medical-navy block"></span>
      </span>
    </span>
  );
};
