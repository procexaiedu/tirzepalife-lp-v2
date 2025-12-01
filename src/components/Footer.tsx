"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const Footer = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-medical-navy text-white py-12 border-t border-white/10">
      <Container>
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-serif text-2xl mb-4 text-medical-sand">TirzepaLife</h3>
            <p className="text-gray-300/80 max-w-xs mb-6">
              Medicina de precisão para o tratamento da obesidade e longevidade saudável. Transformando vidas através da ciência.
            </p>
            <div className="flex gap-4">
              {/* Social Icons placeholder */}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-medical-sand">Navegação</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <button onClick={() => scrollToSection('mechanism')} className="hover:text-white transition-colors text-left">
                  Como Funciona
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('benefits')} className="hover:text-white transition-colors text-left">
                  Benefícios
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('faq')} className="hover:text-white transition-colors text-left">
                  Perguntas Frequentes
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-medical-sand">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/termos-de-uso" className="hover:text-white transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="hover:text-white transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos-de-uso" className="hover:text-white transition-colors">
                  Isenção de Responsabilidade
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} TirzepaLife. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <p>Responsável Técnico: Dr. Exemplo CRM/SP 123456</p>
          </div>
        </div>
      </Container>
    </footer>
  );
};
