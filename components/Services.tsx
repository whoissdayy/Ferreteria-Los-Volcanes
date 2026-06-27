"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Copy real tomado de ferreterialosvolcanes.com.mx ("Ferretería en general" / "Herramientas").
// Las clases de acento van completas y literales para que Tailwind v4 las detecte al compilar.
const LINEAS = [
  {
    eyebrow: "Ferretería en general",
    title: "Todo en Fierro",
    description:
      "PTR, perfiles pintados y zintro, monten, vigas IPR, canal U, fierro: soleras, cuadrados y redondos, lámina para techar, lámina negra y galvanizada, tubos industriales y galvanizados, metales despejados, malla ciclón y mucho más.",
    image: "/fotos-originales/fierro.jpg",
    accent: "text-accent",
    clip: "md:[clip-path:polygon(0_0,100%_0,100%_92%,0_100%)]",
  },
  {
    eyebrow: "Herramientas",
    title: "Herramienta en General",
    description:
      "Soldaduras, compresoras, soldadoras, inversores, chapas, candados, discos abrasivos y todo el equipo que necesitas para tu obra o tu taller.",
    image: "/fotos-originales/herramientasgrl.jpg",
    accent: "text-accent-yellow",
    clip: "md:[clip-path:polygon(0_8%,100%_0,100%_100%,0_100%)]",
  },
];

export function Services() {
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

      // stagger marcado entre bloques, se activa al entrar al 80% del viewport
      gsap.from(".linea-block", {
        opacity: 0,
        y: 80,
        duration: 0.9,
        ease: "easeOut",
        stagger: 0.2,
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: container }
  );

  return (
    <section
      id="lineas-negocio"
      ref={container}
      className="relative mx-auto max-w-6xl snap-start px-6 py-20 md:py-24"
    >
      <div className="text-center">
        <div className="overflow-hidden">
          <h2 className="heading-reveal text-2xl font-bold text-foreground md:text-3xl">
            Nuestras líneas de negocio
          </h2>
        </div>
        <p className="mt-3 text-base text-muted">
          De la obra gruesa al acabado final, todo en un solo lugar.
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-16">
        {LINEAS.map((linea, i) => (
          <div
            key={linea.title}
            className="linea-block grid items-center gap-8 md:grid-cols-2 md:gap-12"
          >
            <div
              className={`relative h-64 w-full overflow-hidden rounded-2xl border border-border transition-transform duration-500 hover:scale-[1.02] md:h-80 ${linea.clip} ${
                i % 2 === 1 ? "md:order-2" : ""
              }`}
            >
              <Image
                src={linea.image}
                alt={`${linea.title} en Ferretería Los Volcanes`}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className={`text-sm font-bold uppercase tracking-widest ${linea.accent}`}>
                {linea.eyebrow}
              </p>
              <h3 className="mt-3 text-2xl font-bold text-foreground md:text-3xl">
                {linea.title}
              </h3>
              <p className="mt-4 text-base text-muted">{linea.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
