"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // sin scroll suave para quienes piden menos movimiento
      return;
    }

    // intensidad estándar para un negocio comercial: lerp moderado, sensación firme y profesional
    // autoRaf: false porque el ticker de GSAP controla el loop (evita doble rAF y desfases con ScrollTrigger)
    const lenis = new Lenis({ lerp: 0.1, autoRaf: false });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // GSAP trabaja en segundos, Lenis espera milisegundos
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
