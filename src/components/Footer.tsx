"use client";

import { Container } from "@/components/ui/Container";

export const Footer = () => {
  return (
    <footer className="bg-medical-navy text-white py-12 border-t border-white/10">
      <Container>
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-serif text-2xl mb-4">TirzepaLife</h3>
            <p className="text-medical-sand/80 max-w-xs">
              Medicina de precisão para o tratamento da obesidade e longevidade saudável.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-medical-sand">Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mecanismo</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Resultados</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-medical-sand">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política Médica</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} TirzepaLife. Todos os direitos reservados.</p>
          <p>Responsável Técnico: Dr. Exemplo CRM/SP 123456</p>
        </div>
      </Container>
    </footer>
  );
};
