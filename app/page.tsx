import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { BrandStrip } from "@/components/BrandStrip";
import { SobreNosotros } from "@/components/SobreNosotros";
import { PromoGrid } from "@/components/PromoGrid";
import { Services } from "@/components/Services";
import { Gallery } from "@/components/Gallery";
import { Contact } from "@/components/Contact";
import { Ubicacion } from "@/components/Ubicacion";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <BrandStrip />
        <SobreNosotros />
        <PromoGrid />
        <Services />
        <Gallery />
        <Contact />
        <Ubicacion />
      </main>
      <Footer />
    </>
  );
}
