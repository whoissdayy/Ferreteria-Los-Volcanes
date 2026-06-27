"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// "Nuestra Promesa": copy real de ferreterialosvolcanes.com.mx. Las clases de acento van
// completas y literales (no por template string) para que Tailwind v4 las detecte al compilar.
const PROMESAS = [
  {
    title: "Servicio",
    description:
      "Haremos lo imposible para que tengas la mejor experiencia al comprar con nosotros.",
    border: "border-t-accent",
    text: "text-accent",
  },
  {
    title: "Calidad",
    description: "¡Nuestros productos siempre serán de la mejor calidad!",
    border: "border-t-accent-yellow",
    text: "text-accent-yellow",
  },
  {
    title: "Trabajo",
    description:
      "Contamos con un amplio equipo de trabajo que se preocupa por estar a la vanguardia, siempre.",
    // accent-blue en vez de accent-red: "Servicio" ya usa el rojo principal, así que esta
    // tarjeta usa el azul secundario para que las 4 tarjetas muestren los 4 colores reales
    // del logo (rojo, amarillo, azul, verde) en vez de repetir el rojo tres veces
    border: "border-t-accent-blue",
    text: "text-accent-blue",
  },
  {
    title: "Precio",
    description:
      "Buscamos tener los mejores precios del mercado sin afectar la calidad de nuestros productos.",
    border: "border-t-accent-green",
    text: "text-accent-green",
  },
];

export function PromoGrid() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      gsap.from(".heading-reveal", {
        yPercent: 100,
        duration: 0.7,
        ease: "easeOut",
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // cada tarjeta tiene su propio ScrollTrigger (no uno compartido por el contenedor),
      // así se anima individualmente al entrar a pantalla y vuelve a animarse si el usuario
      // sube y baja el scroll (toggleActions con "reverse")
      const cards = gsap.utils.toArray<HTMLElement>(".promo-card");
      cards.forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 50,
          scale: 0.92,
          duration: 0.7,
          delay: i * 0.08,
          ease: "easeOut",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    { scope: container }
  );

  return (
    <section
      id="promesa"
      ref={container}
      className="relative mx-auto max-w-6xl snap-start px-6 py-20 md:py-24"
    >
      <div className="overflow-hidden text-center">
        <h2 className="heading-reveal text-2xl font-bold text-foreground md:text-3xl">
          Nuestra Promesa
        </h2>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {PROMESAS.map((promo) => (
          <div
            key={promo.title}
            className={`promo-card rounded-2xl border border-border border-t-4 p-6 ${promo.border}`}
          >
            <h3 className={`text-base font-bold uppercase tracking-wide ${promo.text}`}>
              {promo.title}
            </h3>
            <p className="mt-2 text-sm text-muted">{promo.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
