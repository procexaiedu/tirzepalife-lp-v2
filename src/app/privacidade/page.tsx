import { Container } from "@/components/ui/Container";
import { Footer } from "@/components/Footer";
import { StickyBar } from "@/components/StickyBar";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen flex flex-col bg-medical-white">
      <StickyBar />
      <div className="flex-grow pt-32 pb-16">
        <Container>
          <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
            <h1 className="font-serif text-3xl md:text-4xl mb-8 text-medical-navy">Política de Privacidade</h1>
            
            <div className="prose prose-slate max-w-none text-gray-600 space-y-6">
              <p>
                A sua privacidade é importante para nós. É política do TirzepaLife respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site TirzepaLife, e outros sites que possuímos e operamos.
              </p>

              <h2 className="text-xl font-bold text-medical-navy mt-8 mb-4">1. Informações que coletamos</h2>
              <p>
                Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
              </p>

              <h2 className="text-xl font-bold text-medical-navy mt-8 mb-4">2. Uso de Dados</h2>
              <p>
                Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
              </p>

              <h2 className="text-xl font-bold text-medical-navy mt-8 mb-4">3. Compartilhamento de Dados</h2>
              <p>
                Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.
              </p>

              <h2 className="text-xl font-bold text-medical-navy mt-8 mb-4">4. Cookies</h2>
              <p>
                Utilizamos cookies para melhorar a experiência de navegação. Você tem a liberdade de recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.
              </p>

              <h2 className="text-xl font-bold text-medical-navy mt-8 mb-4">5. Compromisso do Usuário</h2>
              <p>
                O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o TirzepaLife oferece no site e com caráter enunciativo, mas não limitativo:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>A) Não se envolver em atividades que sejam ilegais ou contrárias à boa fé a à ordem pública;</li>
                <li>B) Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, ou casas de apostas legais (ex.: Moosh), jogos de sorte e azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos;</li>
                <li>C) Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) do TirzepaLife, de seus fornecedores ou terceiros.</li>
              </ul>

              <h2 className="text-xl font-bold text-medical-navy mt-8 mb-4">6. Direitos do Titular (LGPD)</h2>
              <p>
                Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a acessar, corrigir, portar, eliminar seus dados, além de confirmar a existência de tratamento. Para exercer seus direitos, entre em contato conosco.
              </p>

              <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-500">
                <p>Esta política é efetiva a partir de Dezembro/2025.</p>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </main>
  );
}

