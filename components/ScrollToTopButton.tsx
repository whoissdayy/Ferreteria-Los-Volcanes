"use client";

import { useEffect, useState } from "react";

// Solo aparece después de bajar un poco — mostrarlo ya desde el tope de la página no
// tendría sentido (no hay a dónde "subir" todavía).
const SCROLL_SHOW_THRESHOLD = 400;

// Botón flotante fijo en la esquina inferior izquierda, simétrico al de WhatsApp (que está
// en la inferior derecha). href="#inicio" en vez de un manejador de scroll manual: es el
// mismo truco que ya usa el logo del Header para volver al inicio, así Lenis intercepta el
// salto y lo hace con scroll suave en vez de un salto brusco — funciona igual en celular.
export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > SCROLL_SHOW_THRESHOLD);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-5 left-5 z-50 transition-opacity duration-300 sm:bottom-6 sm:left-6 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <a
        href="#inicio"
        aria-label="Subir al inicio"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg shadow-black/25 transition-transform duration-300 hover:scale-110 active:scale-95"
      >
        {/* motion-safe:animate-bounce: la flecha rebota hacia arriba en bucle, sugiriendo el
            efecto de "subir" — se desactiva solo si el visitante prefiere menos movimiento */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="h-6 w-6 motion-safe:animate-bounce"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </a>
    </div>
  );
}
