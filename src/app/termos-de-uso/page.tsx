import { Container } from "@/components/ui/Container";
import { Footer } from "@/components/Footer";
import { StickyBar } from "@/components/StickyBar";

export default function TermsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-medical-white">
      <StickyBar />
      <div className="flex-grow pt-32 pb-16">
        <Container>
          <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
            <h1 className="font-serif text-3xl md:text-4xl mb-8 text-medical-navy">Termos de Uso</h1>
            
            <div className="prose prose-slate max-w-none text-gray-600 space-y-6">
              <h2 className="text-xl font-bold text-medical-navy mt-8 mb-4">1. Termos</h2>
              <p>
                Ao acessar o site TirzepaLife, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site.
              </p>

              <h2 className="text-xl font-bold text-medical-navy mt-8 mb-4">2. Isenção de Responsabilidade Médica</h2>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
                <p className="text-red-700 font-semibold">
                  IMPORTANTE: O conteúdo deste site é apenas para fins informativos e educacionais. Não substitui o conselho médico profissional, diagnóstico ou tratamento.
                </p>
              </div>
              <p>
                Sempre procure o conselho de seu médico ou outro profissional de saúde qualificado com qualquer dúvida que possa ter sobre uma condição médica. Nunca desconsidere o conselho médico profissional ou demore a procurá-lo por causa de algo que você leu neste site.
              </p>

              <h2 className="text-xl font-bold text-medical-navy mt-8 mb-4">3. Uso de Licença</h2>
              <p>
                É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site TirzepaLife, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>modificar ou copiar os materiais;</li>
                <li>usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial);</li>
                <li>tentar descompilar ou fazer engenharia reversa de qualquer software contido no site TirzepaLife;</li>
                <li>remover quaisquer direitos autorais ou outras notações de propriedade dos materiais; ou</li>
                <li>transferir os materiais para outra pessoa ou 'espelhe' os materiais em qualquer outro servidor.</li>
              </ul>

              <h2 className="text-xl font-bold text-medical-navy mt-8 mb-4">4. Limitações</h2>
              <p>
                Em nenhum caso o TirzepaLife ou seus fornecedores serão responsáveis ​​por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em TirzepaLife, mesmo que TirzepaLife ou um representante autorizado da TirzepaLife tenha sido notificado oralmente ou por escrito da possibilidade de tais danos.
              </p>

              <h2 className="text-xl font-bold text-medical-navy mt-8 mb-4">5. Precisão dos materiais</h2>
              <p>
                Os materiais exibidos no site da TirzepaLife podem incluir erros técnicos, tipográficos ou fotográficos. TirzepaLife não garante que qualquer material em seu site seja preciso, completo ou atual. TirzepaLife pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio.
              </p>

              <h2 className="text-xl font-bold text-medical-navy mt-8 mb-4">6. Links</h2>
              <p>
                O TirzepaLife não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por TirzepaLife do site. O uso de qualquer site vinculado é por conta e risco do usuário.
              </p>

              <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-500">
                <p>Última atualização: Dezembro/2025</p>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </main>
  );
}




