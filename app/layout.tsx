import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import SmoothScroll from "@/components/SmoothScroll";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ferretería Los Volcanes | Herramientas y materiales de construcción",
  description:
    "Ferretería Los Volcanes — herramientas, plomería, electricidad y pintura. Todo para tu obra, entrega rápida en toda la región.",
  openGraph: {
    title: "Ferretería Los Volcanes",
    description: "Herramientas y materiales de construcción de confianza.",
    type: "website",
  },
};

// width=device-width + initial-scale=1: necesario para que el sitio se vea a escala real
// en iPads, tablets y celulares (Android/iOS) en vez del zoom-out tipo "sitio de escritorio".
// No se fija maximumScale para no bloquear el pinch-zoom (accesibilidad).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning es obligatorio junto a next-themes (evita warning de hidratación, no es un descuido).
    // snap-y snap-proximity: cada sección con snap-start "lockea" al hacer scroll, pero
    // "proximity" (no "mandatory") permite seguir desplazándose libremente dentro de
    // secciones más altas que la pantalla (ej. Galería) sin sentirse atrapado.
    // scroll-pt-*: compensa la altura del header fijo para que el ancla no quede tapada.
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} h-full antialiased snap-y snap-proximity scroll-pt-20 md:scroll-pt-28`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SmoothScroll>{children}</SmoothScroll>
          <WhatsAppButton />
          <ScrollToTopButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
