"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Fotos reales de la tienda y de lo que vendemos (carpeta public/fotos-originales).
// El alt describe la foto para accesibilidad; ya no se muestra texto encima de la imagen.
const GALERIA = [
  { src: "/fotos-originales/gale1.jpg", alt: "Compresor de aire en exhibición" },
  { src: "/fotos-originales/gale2.jpg", alt: "PTR y perfiles cuadrados en almacén" },
  { src: "/fotos-originales/gale3.jpg", alt: "Discos de corte y desbaste en exhibición" },
  { src: "/fotos-originales/gale4.jpg", alt: "Productos de plomería y accesorios" },
  { src: "/fotos-originales/gale5.jpg", alt: "Mangueras para riego en almacén" },
  { src: "/fotos-originales/gale6.jpg", alt: "Atención a cliente en mostrador" },
  { src: "/fotos-originales/gale7.jpg", alt: "Tornillería y herrajes en exhibición" },
  { src: "/fotos-originales/gale8.jpg", alt: "Varilla de fierro en almacén" },
  { src: "/fotos-originales/gale9.jpg", alt: "Ángulo estructural en almacén" },
  { src: "/fotos-originales/gale10.jpg", alt: "Resortes y herrajes en exhibición" },
  { src: "/fotos-originales/gale11.jpg", alt: "Perfiles galvanizados en almacén" },
  { src: "/fotos-originales/gale12.jpg", alt: "Cable y tubería conduit en almacén" },
  { src: "/fotos-originales/gale13.jpg", alt: "Clientes siendo atendidos en tienda" },
  { src: "/fotos-originales/gale14.jpg", alt: "Tubería redonda y cuadrada en almacén" },
];

const DOMICILIO = [
  { src: "/fotos-originales/domicilio1.jpg", alt: "Camioneta de entrega a domicilio de Ferretería Los Volcanes, vista de tres cuartos" },
  { src: "/fotos-originales/domicilio2.jpg", alt: "Camioneta de entrega a domicilio de Ferretería Los Volcanes, vista frontal" },
];

const SCROLL_STEP_FALLBACK = 320;

export function Gallery() {
  const container = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const truckRef = useRef<HTMLDivElement>(null);

  // refs (no estado) para el arrastre con mouse: evitan re-renders en cada movimiento,
  // que sería muy costoso disparados decenas de veces por segundo durante un drag
  const isDraggingRef = useRef(false);
  // true desde pointerdown hasta pointerup, sin importar si hubo arrastre real — el arrastre
  // (isDraggingRef) y su setPointerCapture solo se activan si el movimiento supera
  // DRAG_THRESHOLD; antes de eso se trata como un clic normal para que abra el lightbox
  // (mismo bug/arreglo que en BrandStrip: capturar el puntero de inmediato en pointerdown
  // hacía que el navegador redirigiera también el "click" nativo al contenedor, así que un
  // clic simple sobre una foto nunca llegaba al botón y el lightbox jamás se abría).
  const isPressingRef = useRef(false);
  const DRAG_THRESHOLD = 6;
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);

  // tracking de velocidad del puntero, para el "empujón" de inercia al soltar el drag
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0); // px de puntero por ms

  // tween activo de scrollLeft (flecha o inercia): se guarda para poder cancelarlo si el
  // usuario interrumpe la animación agarrando la franja con el mouse a medio recorrido
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null);

  // controla si las flechas se muestran/habilitan: false cuando ya se llegó al límite de
  // ese lado, para que no quede una flecha "activa" que al hacer clic no hace nada
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    function updateScrollLimits() {
      if (!el) return; // TS no propaga el "if (!el) return" de arriba dentro de esta función anidada
      const max = el.scrollWidth - el.clientWidth;
      setCanScrollPrev(el.scrollLeft > 4);
      setCanScrollNext(el.scrollLeft < max - 4);
    }

    updateScrollLimits();
    // "scroll" (no solo resize) porque tanto el drag con mouse como el tween de GSAP de las
    // flechas/inercia mueven scrollLeft directamente, y eso ya dispara este evento nativo —
    // no hace falta enganchar la lógica de las flechas ni del drag por separado
    el.addEventListener("scroll", updateScrollLimits, { passive: true });
    window.addEventListener("resize", updateScrollLimits);
    return () => {
      el.removeEventListener("scroll", updateScrollLimits);
      window.removeEventListener("resize", updateScrollLimits);
    };
  }, []);

  // lightbox: índice de la foto abierta en grande (null = cerrado)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  function closeLightbox() {
    setLightboxIndex(null);
  }

  function showPrev() {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + GALERIA.length) % GALERIA.length));
  }

  function showNext() {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % GALERIA.length));
  }

  // teclado (Escape para cerrar, flechas para navegar) + bloquear el scroll del body
  // mientras el lightbox está abierto, para que no se pueda seguir scrolleando "detrás"
  useEffect(() => {
    if (lightboxIndex === null) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") showPrev();
      else if (e.key === "ArrowRight") showNext();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex]);

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

      // toggleActions con "reverse": cada vez que el usuario sube y vuelve a bajar el
      // scroll, la animación se repite en vez de solo jugarse una vez por carga de página
      gsap.from(".gallery-item", {
        opacity: 0,
        x: 60,
        scale: 0.94,
        duration: 0.6,
        ease: "easeOut",
        stagger: 0.08,
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".domicilio-item", {
        opacity: 0,
        y: 50,
        duration: 0.7,
        ease: "easeOut",
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".domicilio-block",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      // camioncito recorriendo la ruta punteada de la tienda a la casa, en bucle infinito
      // mientras el bloque está en pantalla (mismo truco de loop continuo que el marquee de
      // marcas: una propiedad animada con repeat: -1)
      if (truckRef.current) {
        gsap.to(truckRef.current, {
          left: "100%",
          duration: 4,
          ease: "linear",
          repeat: -1,
          scrollTrigger: {
            trigger: ".domicilio-block",
            start: "top 90%",
            toggleActions: "play pause resume pause",
          },
        });
      }
    },
    { scope: container }
  );

  function killScrollTween() {
    scrollTweenRef.current?.kill();
    scrollTweenRef.current = null;
  }

  // navegación por flechas animada con GSAP (en vez de scrollBy nativo): así la easing es
  // consistente entre navegadores y se puede cancelar limpiamente si el usuario interviene
  // a media animación arrastrando la franja con el mouse.
  function scrollGallery(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".gallery-item");
    const amount = card ? card.offsetWidth + 16 : SCROLL_STEP_FALLBACK;
    const max = el.scrollWidth - el.clientWidth;
    const target = Math.min(Math.max(el.scrollLeft + direction * amount, 0), max);
    killScrollTween();
    scrollTweenRef.current = gsap.to(el, {
      scrollLeft: target,
      duration: 0.6,
      ease: "power2.out",
    });
  }

  // arrastre con mouse: overflow-x-auto ya soporta swipe táctil nativo en celular, pero en
  // PC no hay forma de "arrastrar" con el mouse por defecto — solo con el scroll/rueda.
  // Se ignora pointerType "touch"/"pen" para no interferir con el scroll nativo del navegador.
  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const el = scrollerRef.current;
    if (!el) return;
    killScrollTween();
    isPressingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartScrollRef.current = el.scrollLeft;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    // setPointerCapture se difiere a handlePointerMove (ver DRAG_THRESHOLD arriba)
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isPressingRef.current) return;
    const el = scrollerRef.current;
    if (!el) return;
    const delta = e.clientX - dragStartXRef.current;

    if (!isDraggingRef.current) {
      if (Math.abs(delta) < DRAG_THRESHOLD) return; // todavía podría ser solo un clic
      isDraggingRef.current = true;
      el.setPointerCapture(e.pointerId);
    }

    el.scrollLeft = dragStartScrollRef.current - delta;

    // velocidad instantánea del puntero (px/ms), usada al soltar para proyectar el
    // "empujón" de inercia — sin esto el arrastre se detenía en seco al soltar el mouse,
    // que es justo lo que se sentía "trabado"
    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 0) {
      velocityRef.current = (e.clientX - lastXRef.current) / dt;
    }
    lastXRef.current = e.clientX;
    lastTimeRef.current = now;
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const wasDragging = isDraggingRef.current;
    isPressingRef.current = false;
    isDraggingRef.current = false;
    if (!wasDragging) return;

    const el = scrollerRef.current;
    if (!el) return;

    // inercia: proyecta una distancia extra de scroll a partir de la velocidad con la que
    // se soltó el mouse, y la anima con desaceleración (power3.out) en vez de cortar el
    // movimiento de golpe — es lo que da la sensación de "flick" fluido tipo galería nativa
    const momentum = -velocityRef.current * 220;
    if (Math.abs(momentum) < 4) return;

    const max = el.scrollWidth - el.clientWidth;
    const target = Math.min(Math.max(el.scrollLeft + momentum, 0), max);
    killScrollTween();
    scrollTweenRef.current = gsap.to(el, {
      scrollLeft: target,
      duration: 0.8,
      ease: "power3.out",
    });
  }

  return (
    <section
      id="galeria"
      ref={container}
      className="relative mx-auto max-w-6xl snap-start overflow-hidden px-6 py-14 md:py-20"
    >
      <div className="text-center sm:text-left">
        <div className="overflow-hidden">
          <h2 className="heading-reveal text-2xl font-bold text-foreground md:text-3xl">
            Galería
          </h2>
        </div>
        <p className="mt-3 text-base text-muted">
          Así es Ferretería Los Volcanes: nuestra tienda y lo que vendemos.
        </p>
      </div>

      {/* envoltura relativa para las flechas: quedan superpuestas a los costados de la
          franja de fotos (no arriba, separadas del título), centradas verticalmente */}
      <div className="relative mt-8">
        <button
          type="button"
          onClick={() => scrollGallery(-1)}
          disabled={!canScrollPrev}
          aria-label="Ver fotos anteriores"
          className={`absolute left-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-md shadow-black/5 backdrop-blur-sm transition-all duration-200 md:left-2 ${
            canScrollPrev
              ? "hover:scale-110 hover:border-accent hover:text-accent hover:shadow-lg active:scale-95"
              : "pointer-events-none opacity-0"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="h-5 w-5"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scrollGallery(1)}
          disabled={!canScrollNext}
          aria-label="Ver más fotos"
          className={`absolute right-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-md shadow-black/5 backdrop-blur-sm transition-all duration-200 md:right-2 ${
            canScrollNext
              ? "hover:scale-110 hover:border-accent hover:text-accent hover:shadow-lg active:scale-95"
              : "pointer-events-none opacity-0"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="h-5 w-5"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* mask-image: difumina los bordes izquierdo/derecho de la franja, así la tarjeta
            que queda parcialmente visible al borde se ve "desvanecida a propósito" en vez
            de cortada a la mitad. Sin scroll-snap: el snap nativo del navegador competía con
            las animaciones de scrollLeft de GSAP (flechas e inercia), lo que se sentía como
            un "tirón" al final de cada movimiento — quitarlo es lo que vuelve el scroll fluido. */}
        <div
          ref={scrollerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="flex cursor-grab gap-4 overflow-x-auto px-1 pb-4 [scrollbar-width:none] [-webkit-mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        >
          {GALERIA.map((item, idx) => (
            // aspect-[8/5] (no aspect-square): las fotos originales son 320x202 (~1.58:1,
            // bastante apaisadas) — en un recuadro cuadrado object-cover recortaba ~37% del
            // ancho de cada foto, cortando de más los costados. 8/5 (1.6:1) casi no recorta.
            // <button> (no <div>): para que sea clicable/enfocable y abra el lightbox.
            <button
              key={item.src}
              type="button"
              onClick={() => setLightboxIndex(idx)}
              aria-label={`Ver en grande: ${item.alt}`}
              className="gallery-item group relative aspect-[8/5] w-[68%] shrink-0 cursor-zoom-in overflow-hidden rounded-2xl border border-border sm:w-[42%] md:w-[30%] lg:w-[22%]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, (min-width: 640px) 42vw, 68vw"
                className="pointer-events-none object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </button>
          ))}
        </div>
      </div>

      {/* servicio a domicilio: debajo de la galería, mismas fotos reales de las camionetas */}
      <div className="domicilio-block relative mt-16 overflow-hidden">
        <div className="text-center">
          <h3 className="text-xl font-bold text-foreground md:text-2xl">Servicio a domicilio</h3>
          <p className="mt-2 text-base text-muted">
            Llevamos tu pedido directo a tu obra o tu casa.
          </p>
        </div>

        {/* ruta punteada decorativa: de la tienda a la casa del cliente, con un camioncito
            recorriéndola en bucle. scale-x-[-1] voltea el emoji del camión para que el frente
            mire hacia la derecha (sentido del recorrido); sin el flip se veía "manejando
            al revés" porque el emoji por defecto mira hacia la izquierda */}
        <div
          aria-hidden
          className="relative mx-auto mt-6 flex max-w-md items-center gap-3"
        >
          <span className="text-lg">🏪</span>
          <div className="relative h-6 flex-1">
            <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 border-t-2 border-dashed border-accent/40" />
            <div
              ref={truckRef}
              className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-x-[-1] text-xl"
            >
              🚚
            </div>
          </div>
          <span className="text-lg">🏠</span>
        </div>

        {/* sin texto sobre las fotos: solo el acercamiento al hacer hover/tap */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-6">
          {DOMICILIO.map((item) => (
            <div
              key={item.src}
              className="domicilio-item group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      {/* lightbox: fondo oscuro fijo (independiente del tema claro/oscuro del sitio, como
          en cualquier lightbox moderno) con la foto en grande, flechas para navegar entre
          todas las fotos de la galería y una X clara para cerrar. Clic fuera de la foto
          también cierra (overlay con onClick), pero un stopPropagation en la foto y en los
          controles evita que un clic ahí cierre por accidente. */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
            onClick={closeLightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              aria-label="Cerrar"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20 active:scale-95 sm:right-6 sm:top-6"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="h-5 w-5"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label="Foto anterior"
              className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20 active:scale-95 sm:left-6 sm:h-12 sm:w-12"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="h-6 w-6"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label="Foto siguiente"
              className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20 active:scale-95 sm:right-6 sm:h-12 sm:w-12"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="h-6 w-6"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={lightboxIndex}
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative h-[70vh] w-full max-w-4xl sm:h-[80vh]"
              >
                <Image
                  src={GALERIA[lightboxIndex].src}
                  alt={GALERIA[lightboxIndex].alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70 sm:bottom-6">
              {lightboxIndex + 1} / {GALERIA.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
