"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Marcas reales que distribuye Ferretería Los Volcanes, con su logo oficial (foto del
// catálogo del negocio) y enlace a su sitio oficial. "Phillips" aquí es la marca mexicana
// de cerraduras y candados (grupo ASSA ABLOY) — no Royal Philips, son empresas distintas.
const REAL_BRANDS = [
  { name: "Conduit", href: "https://www.rymco.com.mx/", logo: "/fotos-originales/Conduit-320x202.png" },
  { name: "Austromex", href: "https://www.austromex.com.mx/", logo: "/fotos-originales/Austromex-320x202.png" },
  { name: "Arco Metal", href: "https://www.arcometal.com.mx/", logo: "/fotos-originales/Arco-Metal-320x202.png" },
  { name: "Ternium", href: "https://mx.ternium.com/es/", logo: "/fotos-originales/Ternium-320x202.png" },
  { name: "Truper", href: "https://www.truper.com/", logo: "/fotos-originales/Truper-320x202.png" },
  { name: "Phillips", href: "https://www.phillips.com.mx/es/index", logo: "/fotos-originales/Philips.png" },
];

// Copias del set para el marquee infinito. Con solo 2 copias, en pantallas anchas (PC) el
// "carril" completo (2x el ancho de un set) podía ser más angosto que el propio viewport,
// así que al llegar al final del ciclo se veía un hueco en blanco antes de reiniciar. Con
// LOOP_COPIES sets duplicados el carril siempre es mucho más ancho que cualquier monitor.
const LOOP_COPIES = 6;
const MARQUEE_ITEMS = Array.from({ length: LOOP_COPIES }).flatMap((_, set) =>
  REAL_BRANDS.map((brand) => ({ ...brand, key: `${set}-${brand.name}` }))
);

// Cifras reales (nada inventado): se derivan de datos ya verificados del propio sitio —
// las 6 marcas listadas arriba, las 2 líneas de negocio de Services, los días de horario
// de Ubicacion/Contact y el servicio a domicilio mencionado en todo el sitio.
const STATS = [
  { value: 6, suffix: "+", label: "Marcas líderes en herramienta y materiales" },
  { value: 2, suffix: "", label: "Líneas de negocio: fierro y herramienta" },
  { value: 6, suffix: "", label: "Días de atención a la semana, lunes a sábado" },
  { value: 100, suffix: "%", label: "Servicio a domicilio en toda la región" },
];

function BrandBadge({ brand }: { brand: (typeof MARQUEE_ITEMS)[number] }) {
  return (
    <a
      href={brand.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Visitar el sitio de ${brand.name}`}
      // hover:-translate-y-1 + shadow: lift de tarjeta tipo "card premium" al pasar el mouse,
      // en vez de solo cambiar el color del borde — da más sensación de profundidad/calidad
      className="flex shrink-0 flex-col items-center gap-2 rounded-xl border border-border bg-background px-6 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-accent/10"
    >
      <Image
        src={brand.logo}
        alt={`Logo de ${brand.name}`}
        width={120}
        height={76}
        draggable={false}
        className="h-12 w-auto select-none object-contain sm:h-14"
      />
      <span className="text-sm font-bold uppercase tracking-tight text-foreground/80">
        {brand.name}
      </span>
    </a>
  );
}

// Sección unificada "Marcas": combina las cifras del negocio ("Ferretería Los Volcanes en
// números") y el marquee de marcas reales en un solo bloque visual, en vez de dos secciones
// separadas — así, al hacer clic en "Marcas" desde el header, se ve como una sola pieza
// cohesiva en lugar de dos franjas inconexas.
// Usa bg-background/text-foreground (los mismos colores del sitio, no invertidos): con el
// fondo invertido anterior (bg-foreground/text-background) la sección se veía bien en modo
// claro pero se volvía un bloque claro roto sobre fondo oscuro al activar modo oscuro — con
// las variables normales del tema, esta sección respeta el modo activo igual que el resto.
export function BrandStrip() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // posición horizontal del carril en píxeles. Va en un ref (no en estado de React)
  // porque se actualiza en cada frame del ticker de GSAP — usar useState aquí forzaría
  // un re-render ~60 veces por segundo.
  const xRef = useRef(0);
  const setWidthRef = useRef(0);
  const speedRef = useRef(36); // autoplay, en px/segundo
  const isDraggingRef = useRef(false);
  // true desde pointerdown hasta pointerup, sin importar si hubo arrastre real — separado
  // de isDraggingRef porque el arrastre (y el setPointerCapture que lo acompaña) solo debe
  // activarse si el puntero se movió más que DRAG_THRESHOLD; ver por qué en handlePointerMove
  const isPressingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartTrackXRef = useRef(0);
  // px mínimos de movimiento antes de considerarlo arrastre (y no un clic normal)
  const DRAG_THRESHOLD = 6;

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const track = trackRef.current;

      const numberEls = gsap.utils.toArray<HTMLElement>(".stat-number");

      if (prefersReducedMotion) {
        numberEls.forEach((el, i) => {
          el.textContent = `${STATS[i].value}${STATS[i].suffix}`;
        });
      } else {
        // entrada de toda la sección al hacer scroll hasta ella (una sola vez)
        gsap.from(sectionRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: "easeOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        numberEls.forEach((el, i) => {
          const target = { value: 0 };
          gsap.to(target, {
            value: STATS[i].value,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
            onUpdate: () => {
              el.textContent = `${Math.round(target.value)}${STATS[i].suffix}`;
            },
          });
        });

        gsap.from(".stat-card", {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: "easeOut",
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }

      if (!track || prefersReducedMotion) return;

      // ancho de un solo set de marcas (incluye sus gaps): se obtiene dividiendo el ancho
      // total renderizado entre la cantidad de copias, ya que todas son idénticas — más
      // confiable que sumar anchos individuales a mano y se recalcula si cambia el viewport
      function measureSetWidth() {
        if (track) setWidthRef.current = track.scrollWidth / LOOP_COPIES;
      }
      measureSetWidth();
      window.addEventListener("resize", measureSetWidth);

      function tick(_time: number, deltaMs: number) {
        if (!track || setWidthRef.current === 0) return;
        if (!isDraggingRef.current) {
          xRef.current -= (speedRef.current * deltaMs) / 1000;
        }
        // wrap-around: mantiene xRef.current siempre dentro de (-setWidth, 0], así el
        // carril nunca se queda "vacío" a la vista sin importar cuánto se arrastre
        const setWidth = setWidthRef.current;
        while (xRef.current <= -setWidth) xRef.current += setWidth;
        while (xRef.current > 0) xRef.current -= setWidth;
        track.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
      }

      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        window.removeEventListener("resize", measureSetWidth);
      };
    },
    { scope: sectionRef }
  );

  // arrastre con mouse Y con touch: a diferencia de la franja de la Galería (que usa
  // overflow-x-auto nativo), este carril es un transform animado, así que aquí sí hace
  // falta capturar también el touch para poder "jalarlo" en celular.
  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    isPressingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartTrackXRef.current = xRef.current;
    // OJO: aquí NO se llama setPointerCapture todavía. Hacerlo de inmediato en pointerdown
    // era el bug reportado: el navegador reasigna también el evento "click" nativo al
    // elemento que capturó el puntero, así que un clic simple sobre un logo (sin arrastrar)
    // nunca llegaba al <a> y el enlace jamás navegaba. Ahora la captura se activa solo si
    // handlePointerMove detecta arrastre real (ver abajo), dejando que el clic normal pase.
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isPressingRef.current) return;
    const delta = e.clientX - dragStartXRef.current;

    if (!isDraggingRef.current) {
      if (Math.abs(delta) < DRAG_THRESHOLD) return; // todavía podría ser solo un clic
      isDraggingRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    xRef.current = dragStartTrackXRef.current + delta;
  }

  function handlePointerUp() {
    isPressingRef.current = false;
    isDraggingRef.current = false;
  }

  return (
    <section
      id="marcas"
      ref={sectionRef}
      className="snap-start overflow-hidden bg-background text-foreground"
    >
      {/* bloque 1: cifras del negocio */}
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted">
          Ferretería Los Volcanes en números
        </p>
        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="stat-card text-center">
              <p className="stat-number text-4xl font-bold text-accent md:text-5xl">0</p>
              <p className="mt-2 text-xs text-muted md:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* bloque 2: marquee de marcas, mismo fondo que el bloque de cifras de arriba —
          un borde sutil separa ambos en vez de un salto de color completo */}
      <div className="border-t border-border py-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted">
          Principales marcas con las que trabajamos
        </p>
        {/* touchAction: "pan-y" deja que el scroll vertical de la página siga funcionando
            con el dedo; el desplazamiento horizontal del carril lo maneja el pointermove
            de arriba, no el gesto nativo del navegador */}
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ touchAction: "pan-y" }}
          className="mt-6 flex w-max cursor-grab select-none items-center gap-10 active:cursor-grabbing"
        >
          {MARQUEE_ITEMS.map((brand) => (
            <BrandBadge key={brand.key} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
}
