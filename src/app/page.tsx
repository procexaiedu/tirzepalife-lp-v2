import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { Mechanism } from "@/components/Mechanism";
import { Benefits } from "@/components/Benefits";
import { FAQ } from "@/components/FAQ";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { StickyBar } from "@/components/StickyBar";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <StickyBar />
      <Hero />
      <Problem />
      <Mechanism />
      <Benefits />
      <FAQ />
      <ContactSection />
      <Footer />
    </main>
  );
}