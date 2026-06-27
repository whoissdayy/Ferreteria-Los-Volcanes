"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

// "Inicio" se quitó: el logo ya cumple esa función (clic en logo -> #inicio).
const NAV_LINKS = [
  { label: "Marcas", href: "#marcas" },
  { label: "Sobre nosotros", href: "#sobre-nosotros" },
  { label: "Nuestra promesa", href: "#promesa" },
  { label: "Líneas de negocio", href: "#lineas-negocio" },
  { label: "Galería", href: "#galeria" },
  { label: "Hablemos", href: "#contacto" },
  { label: "Visítanos", href: "#ubicacion" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md"
    >
      {/* announcement bar (hidden on mobile) */}
      <div className="hidden items-center justify-center gap-px md:flex">
        <div className="flex-1 bg-accent py-1.5 text-center text-xs font-semibold uppercase tracking-wide text-background">
          ¡Contamos con servicio a domicilio!
        </div>
        <div className="flex-1 bg-accent-yellow py-1.5 text-center text-xs font-semibold uppercase tracking-wide text-[#1a1a1a]">
          La mejor calidad al mejor precio
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* solo el logo, sin texto al lado: clic lleva a #inicio (ancla nativa, consistente
            con el resto de la nav, que también usa <a> en vez de next/link para que Lenis
            intercepte el scroll suave del mismo modo en todos los enlaces del header) */}
        <a href="#inicio" aria-label="Ir al inicio" className="flex shrink-0 items-center">
          <Image
            src="/fotos-originales/logo_ferre.png"
            alt="Logo de Ferretería Los Volcanes"
            width={261}
            height={76}
            priority
            className="h-12 w-auto rounded-md sm:h-14 md:h-16"
          />
        </a>
        <nav className="hidden items-center gap-5 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center lg:flex">
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Abrir menú"
            aria-expanded={mobileOpen}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-foreground/5"
          >
            <span className="text-2xl">{mobileOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-border px-6 py-6 lg:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="py-2 text-base text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </motion.header>
  );
}
