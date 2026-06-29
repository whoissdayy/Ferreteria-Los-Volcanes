"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Ubicacion() {
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

      gsap.from(".ubicacion-col", {
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
    },
    { scope: container }
  );

  return (
    <section
      id="ubicacion"
      ref={container}
      className="relative mx-auto max-w-6xl snap-start px-6 py-14 md:py-20"
    >
      <div className="text-center">
        <div className="overflow-hidden">
          <h2 className="heading-reveal text-2xl font-bold text-foreground md:text-3xl">
            Visítanos
          </h2>
        </div>
        <p className="mt-3 text-base text-muted">
          Te esperamos en tienda — también contamos con servicio a domicilio.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {/* foto real de la fachada, al lado del mapa */}
        <div className="ubicacion-col overflow-hidden rounded-2xl border-4 border-accent-yellow">
          <div className="relative h-64 w-full md:h-full">
            <Image
              src="/fotos-originales/ferrefrente.jpg"
              alt="Fachada de Ferretería Los Volcanes"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="ubicacion-col flex flex-col gap-6">
          <div className="space-y-1.5 text-sm text-muted">
            <p className="text-base font-semibold text-foreground">Horarios y contacto</p>
            <p>Lunes a viernes: 7:30 – 17:30 h</p>
            <p>Sábado: 8:00 – 13:00 h</p>
            <p>
              Tel:{" "}
              <a href="tel:+525517342721" className="transition-colors hover:text-foreground">
                01 55 1734 2721
              </a>
            </p>
            <p>
              <a
                href="https://www.facebook.com/Ferreterialosvolcanes/"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-accent"
              >
                Síguenos en Facebook
              </a>
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1158.5496423420564!2d-98.88858047284778!3d19.273413618979383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce1ecdf3000001%3A0x9b60a22aadeacbc8!2sFerreteria%20Los%20Volcanes!5e1!3m2!1ses-419!2smx!4v1782497058483!5m2!1ses-419!2smx"
              width="100%"
              height="280"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Ubicación de Ferretería Los Volcanes en Google Maps"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
