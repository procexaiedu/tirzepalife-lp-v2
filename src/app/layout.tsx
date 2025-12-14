import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import { AIChatButton } from "@/components/AIChatButton";
import { ChatProvider } from "@/context/ChatContext";
import { CookieBanner } from "@/components/CookieBanner";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tirzepatida - Controle de Peso com Ciência",
  description: "Controle o apetite e o peso com Tirzepatida, com acompanhamento médico e foco em segurança.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${playfair.variable} ${manrope.variable} antialiased bg-medical-white text-medical-text font-sans`}
      >
        <ChatProvider>
          {children}
          <AIChatButton />
          <CookieBanner />
        </ChatProvider>
      </body>
    </html>
  );
}
