"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SobreNosotros() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      gsap.from(".sobre-col", {
        opacity: 0,
        y: 60,
        duration: 0.8,
        ease: "easeOut",
        stagger: 0.15,
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // efecto "cortina": el título se desliza desde abajo dentro de un contenedor
      // overflow-hidden, en vez de solo aparecer con fade (look editorial tipo Büro/Clear Street)
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
    },
    { scope: container }
  );

  return (
    <section
      id="sobre-nosotros"
      ref={container}
      className="relative mx-auto max-w-6xl snap-start px-6 py-20 md:py-24"
    >
      <div className="grid gap-10 md:grid-cols-2 md:items-stretch md:gap-16">
        <div className="sobre-col overflow-hidden rounded-2xl border-4 border-accent md:h-full">
          <div className="relative h-64 w-full md:h-full">
            <Image
              src="/fotos-originales/sobrenosotros.jpg"
              alt="Equipo y tienda de Ferretería Los Volcanes"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="sobre-col relative">
          <p className="text-sm font-bold uppercase tracking-widest text-accent">
            Sobre nosotros
          </p>
          <div className="mt-3 overflow-hidden">
            <h2 className="heading-reveal text-2xl font-bold text-foreground md:text-3xl">
              Todo para tu obra y tu hogar, en un solo lugar
            </h2>
          </div>
          <p className="mt-5 text-base text-muted">
            En Ferretería Los Volcanes nos dedicamos a la venta de fierro, herramienta en
            general, plomería, electricidad y pintura — todo lo que necesitas para tu obra
            o tu casa, en un solo lugar. Trabajamos únicamente con las mejores marcas
            nacionales e internacionales (Conduit, Austromex, Truper, Ternium, Arco Metal y
            Phillips, entre otras) para poder ofrecerte siempre productos de calidad real.
          </p>
          <p className="mt-4 text-base text-muted">
            Nuestra promesa se resume en cuatro cosas: servicio, calidad, trabajo y precio.
            Contamos con un equipo que te asesora directo en mostrador y, si no puedes
            acercarte a la tienda, llevamos tu pedido hasta tu obra o tu casa con nuestro
            servicio a domicilio.
          </p>
          <p className="mt-4 text-base text-muted">
            Te esperamos de lunes a viernes de 7:30 a 17:30 h y sábados de 8:00 a 13:00 h.
          </p>
        </div>
      </div>
    </section>
  );
}
