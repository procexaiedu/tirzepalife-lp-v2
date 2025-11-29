"use client";

import Link from "next/link";
import Image from "next/image";

export const AnvisaBadge = () => {
  return (
    <Link 
      href="https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/novos-medicamentos-e-indicacoes/mounjaro-r-tirzepatida-nova-indicacao"
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-3 bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl px-4 py-2 shadow-sm hover:shadow-md transition-all duration-300 hover:border-medical-navy/30"
    >
      <div className="relative w-8 h-8 shrink-0">
        {/*
          Para usar o selo oficial da ANVISA, por favor, adicione o arquivo da imagem oficial (ex: anvisa_logo.png)
          na pasta `public/` do projeto. Certifique-se de que você tem os direitos ou permissões para usar o logo oficial.
          Após adicionar o arquivo, atualize o 'src' abaixo para o caminho correto.
        */}
        <Image 
          src="/anvisa_logo.png"
          alt="Selo ANVISA"
          width={32}
          height={32}
          className="object-contain"
        />
      </div>
      
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold leading-tight group-hover:text-medical-navy transition-colors">
          Recomendado pela ANVISA
        </span>
        <span className="text-xs font-bold text-[#004736] leading-tight">
          Aprovação ANVISA
        </span>
      </div>

      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse ml-1" />
    </Link>
  );
};
