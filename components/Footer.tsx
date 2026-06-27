"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// dividido en dos columnas cortas (en vez de una sola lista de 6) para que el footer se
// reparta a lo ancho en 4 columnas y no quede tan alto/apretado en una sola
const NAVEGACION_1 = [
  { label: "Inicio", href: "#inicio" },
  { label: "Marcas", href: "#marcas" },
  { label: "Sobre nosotros", href: "#sobre-nosotros" },
];

const NAVEGACION_2 = [
  { label: "Nuestra promesa", href: "#promesa" },
  { label: "Líneas de negocio", href: "#lineas-negocio" },
  { label: "Galería", href: "#galeria" },
];

const CONTACTO = [
  { label: "Hablemos", href: "#contacto" },
  { label: "Visítanos", href: "#ubicacion" },
];

const SOCIALS = [{ label: "Facebook", href: "https://www.facebook.com/Ferreterialosvolcanes/" }];

export function Footer() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;
      gsap.from(".footer-col", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "easeOut",
        stagger: 0.1,
        scrollTrigger: {
          trigger: container.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: container }
  );

  return (
    <footer id="contacto-footer" ref={container} className="border-t border-border">
      {/* 4 columnas en desktop: marca, dos mitades de navegación, contacto — reparte el
          contenido a lo ancho en vez de apilarlo en pocas columnas altas */}
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-10 lg:px-10">
        <div className="footer-col">
          {/* solo el logo, sin el texto "LOS VOLCANES" al lado: el logo ya incluye la marca */}
          <Image
            src="/fotos-originales/logo_ferre.png"
            alt="Logo de Ferretería Los Volcanes"
            width={261}
            height={76}
            className="h-11 w-auto rounded-md sm:h-12"
          />
          <p className="mt-3 text-sm text-muted">
            Especialistas en ferretería y herramientas. La mejor calidad al mejor precio, con
            servicio a domicilio en toda la región.
          </p>
          <div className="mt-4 flex gap-4">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-col">
          <p className="text-sm font-semibold text-foreground">Navegación</p>
          <ul className="mt-3 flex flex-col gap-2">
            {NAVEGACION_1.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          {/* invisible (no "hidden") en md+: ocupa el mismo alto que el título real para que
              la lista quede alineada con la columna de Navegación de al lado, sin repetir el
              texto "Navegación" dos veces seguidas cuando ambas columnas quedan lado a lado */}
          <p className="text-sm font-semibold text-foreground md:invisible">Navegación</p>
          <ul className="mt-3 flex flex-col gap-2">
            {NAVEGACION_2.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <p className="text-sm font-semibold text-foreground">Contacto</p>
          <ul className="mt-3 flex flex-col gap-2">
            {CONTACTO.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="tel:+525517342721"
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                01 55 1734 2721
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-6 py-4 text-center text-xs text-muted">
        {"©"} {new Date().getFullYear()} Ferretería Los Volcanes. Todos los derechos reservados.
        {" "}&middot;{" "}
        Creado por{" "}
        <a
          href="https://www.instagram.com/whoissdayy/"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-muted underline-offset-2 transition-colors hover:text-foreground hover:underline"
        >
          Day
        </a>
      </div>
    </footer>
  );
}
