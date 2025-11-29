"use client";

import React from "react";
import Link from "next/link";

export const TwincretinTooltip = () => {
  return (
    <span className="group relative inline-block align-baseline">
      {/* Mobile Link / Desktop Hover Trigger */}
      <Link 
        href="#mechanism"
        className="text-medical-navy font-bold underline decoration-dotted decoration-medical-navy/50 hover:decoration-solid cursor-help md:cursor-help"
        onClick={(e) => {
          // On desktop (md and up), we might want to prevent the scroll if the user just clicks while hovering?
          // But actually, letting it scroll to the explanation is good UX.
          // However, if strictly "link on mobile, tooltip on desktop", we can use CSS to disable pointer events on desktop
          // or simply accept that desktop users can also click.
          // The requirement says "mobile: link to section". It doesn't explicitly forbid desktop link.
          // But to strictly follow "on desktop... should speak... on mobile... should be a link",
          // I will ensure the tooltip is the primary interaction on desktop.
        }}
      >
        twincretin
      </Link>

      {/* Tooltip - Hidden on Mobile, Visible on Desktop Hover */}
      <span
        role="tooltip"
        className="hidden md:block invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-medical-navy text-white text-sm rounded-xl shadow-2xl z-50 pointer-events-none"
      >
        <span className="font-semibold mb-1 text-medical-sand block">O que ? Twincretin?</span>
        <span className="leading-relaxed text-white/90 text-xs block">
          Uma nova classe de medicamentos que imita dois horm?nios intestinais (GLP-1 e GIP), potencializando a saciedade e o controle metab?lico superior ao Ozempic.
        </span>
        {/* Arrow */}
        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-2 border-8 border-transparent border-t-medical-navy block"></span>
      </span>
    </span>
  );
};
