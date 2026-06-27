"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "motion/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Button } from "@/components/ui/Button";

// Las clases de acento van completas y literales (no por template string) para que
// Tailwind v4 las detecte al compilar — una clase armada en runtime no generaría CSS.
const SLIDES = [
  {
    eyebrow: "Especialistas en Ferretería y Herramientas",
    title: "La mejor calidad al mejor precio",
    description:
      "Todo en fierro, herramienta en general, plomería, electricidad y pintura. Contamos con servicio a domicilio en toda la región.",
    image: "/fotos-originales/calidad.png",
    transparent: true,
    eyebrowClass: "text-accent",
    dotClass: "bg-accent",
  },
  {
    eyebrow: "Todo en Fierro",
    title: "PTR, perfiles, vigas y lámina para tu obra",
    description:
      "Fierro: soleras, cuadrados y redondos. Lámina para techar, negra y galvanizada, tubos industriales y malla ciclón.",
    image: "/fotos-originales/ptrperfiles.png",
    transparent: false,
    eyebrowClass: "text-accent-yellow",
    dotClass: "bg-accent-yellow",
  },
  {
    eyebrow: "Principales Marcas",
    title: "Conduit, Austromex, Truper, Phillips y más",
    description: "Trabajamos con las marcas en las que tú y tu obra pueden confiar.",
    image: "/fotos-originales/variedadmarcas.png",
    transparent: false,
    // accent-blue (no accent-red): la 1ra diapositiva ya usa el rojo principal, así que
    // esta usa el azul institucional secundario para que las 3 diapositivas se vean
    // visualmente distintas (rojo, amarillo, azul) en vez de repetir el mismo rojo dos veces
    eyebrowClass: "text-accent-blue",
    dotClass: "bg-accent-blue",
  },
];

const AUTOPLAY_MS = 5500;
// distancia/velocidad mínima de arrastre para considerar que el usuario quiso cambiar de
// diapositiva (si suelta antes de este umbral, se queda en la misma)
const SWIPE_OFFSET_THRESHOLD = 60;
const SWIPE_VELOCITY_THRESHOLD = 400;

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const dragStartIndex = useRef(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  // intensidad estándar: 60px de desplazamiento; si el usuario prefiere menos movimiento, fade simple
  const offset = reduceMotion ? 0 : 60;

  // glow ambiental detrás de la imagen: respiración lenta e infinita (sine.inOut + yoyo) para
  // dar profundidad sin distraer, inspirado en los fondos animados sutiles de clearstreet.io.
  // Se omite por completo si el usuario prefiere menos movimiento.
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion || !glowRef.current) return;

      gsap.to(glowRef.current, {
        scale: 1.15,
        opacity: 0.35,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { scope: sectionRef }
  );

  // setTimeout (no setInterval) reiniciado en cada cambio de `index`: así, sin importar si
  // el cambio vino del autoplay o de un clic/arrastre manual, el siguiente avance automático
  // siempre espera el AUTOPLAY_MS completo. Con setInterval (versión anterior) un clic manual
  // no reiniciaba el reloj del autoplay, así que el avance automático podía dispararse casi
  // de inmediato después del manual y se veía como un "doble salto" / reinicio de la animación.
  useEffect(() => {
    if (reduceMotion) return; // respeta prefers-reduced-motion: no autoplay forzado
    const id = setTimeout(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [reduceMotion, index]);

  function goTo(i: number) {
    setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }

  // arrastre con clic sostenido (PC) o swipe (celular): se evalúa distancia Y velocidad al
  // soltar, igual que un carrusel nativo; al soltar, el autoplay sigue corriendo solo
  // (el useEffect de arriba se reinicia con el nuevo index).
  function handleDragEnd(_: unknown, info: PanInfo) {
    const { offset: dragOffset, velocity } = info;
    if (dragOffset.x < -SWIPE_OFFSET_THRESHOLD || velocity.x < -SWIPE_VELOCITY_THRESHOLD) {
      goTo(dragStartIndex.current + 1);
    } else if (dragOffset.x > SWIPE_OFFSET_THRESHOLD || velocity.x > SWIPE_VELOCITY_THRESHOLD) {
      goTo(dragStartIndex.current - 1);
    }
  }

  const slide = SLIDES[index];

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="relative flex min-h-screen snap-start flex-col items-center justify-center gap-10 overflow-hidden px-4 pt-24 sm:px-6 sm:pt-20 md:flex-row md:gap-16 md:pt-16"
    >
      {/* motivo decorativo de "volcanes": los 3 picos son la misma forma y los mismos
          colores que el ícono del logo real (public/logo-volcanes.svg), solo escalados */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center opacity-[0.1] md:opacity-[0.12]"
      >
        <svg width="600" height="270" viewBox="0 0 600 270" className="w-full max-w-4xl">
          <polygon points="31,259 161,48 266,259" className="fill-accent-red" />
          <polygon points="199,259 319,91 434,259" className="fill-accent-yellow" />
          <polygon points="386,259 463,158 540,259" className="fill-accent-green" />
        </svg>
      </div>

      {/* glow ambiental detrás de la imagen del carrusel: blob borroso, z-0 para quedar
          siempre debajo del texto y de la imagen (ambos z-10) */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[62%] z-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 blur-3xl md:left-auto md:right-10 md:top-1/2 md:h-96 md:w-96"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={slide.title}
          initial={{ opacity: 0, y: offset }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : -offset }}
          transition={{ duration: reduceMotion ? 0.3 : 0.7, ease: "easeOut" }}
          className="relative z-10 max-w-xl text-center md:text-left"
        >
          <p className={`text-sm font-bold uppercase tracking-widest ${slide.eyebrowClass}`}>
            {slide.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-foreground md:text-6xl">
            {slide.title}
          </h1>
          <p className="mt-6 text-lg text-muted">{slide.description}</p>
          {/* un solo botón: lleva a la sección "Sobre nosotros" */}
          <div className="mt-8 flex justify-center md:justify-start">
            <Button href="#sobre-nosotros" variant="primary">
              Sobre nosotros
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* zona de arrastre: clic sostenido + arrastre en PC, swipe en celular. cursor-grab
          comunica visualmente que el bloque se puede arrastrar */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.image}
          drag="x"
          dragElastic={0.2}
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={() => {
            dragStartIndex.current = index;
          }}
          onDragEnd={handleDragEnd}
          initial={{ opacity: 0, y: offset, scale: reduceMotion ? 1 : 0.94, rotate: reduceMotion ? 0 : -3 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.94 }}
          transition={{ duration: reduceMotion ? 0.3 : 0.8, ease: "easeOut" }}
          className={
            // "sin fondo": el PNG de "calidad" ya viene con fondo transparente, así que en
            // ese slide se quita la caja con borde/sombra/recorte (object-cover) que usan
            // las fotos normales, y se muestra flotando con object-contain en su lugar.
            slide.transparent
              ? "relative z-10 h-52 w-52 shrink-0 cursor-grab touch-pan-y active:cursor-grabbing sm:h-72 sm:w-72 md:h-96 md:w-96"
              : "relative z-10 h-52 w-52 shrink-0 cursor-grab touch-pan-y overflow-hidden rounded-3xl border-4 border-accent-yellow shadow-2xl active:cursor-grabbing sm:h-72 sm:w-72 md:h-96 md:w-96"
          }
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            draggable={false}
            className={slide.transparent ? "object-contain" : "object-cover"}
          />
        </motion.div>
      </AnimatePresence>

      {/* indicadores de slide, cada uno usa el color de acento de su propia diapositiva */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.title}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ir a la diapositiva ${i + 1}`}
            className={`h-2 w-2 rounded-full transition-colors ${
              i === index ? s.dotClass : "bg-border"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
