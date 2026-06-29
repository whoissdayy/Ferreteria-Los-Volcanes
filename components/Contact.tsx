"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
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

      gsap.from(".contact-col", {
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

  // Envío real desde el servidor: en vez de abrir el cliente de correo del visitante
  // (mailto, comportamiento anterior), el formulario llama a /api/contact, que envía el
  // mensaje directo al correo de la ferretería usando Resend. El cliente de la ferretería
  // solo llena el formulario y da clic en enviar — nunca se abre su propio correo.
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const nombre = (form.elements.namedItem("nombre") as HTMLInputElement).value;
    const correo = (form.elements.namedItem("correo") as HTMLInputElement).value;
    const celular = (form.elements.namedItem("celular") as HTMLInputElement).value;
    const mensaje = (form.elements.namedItem("mensaje") as HTMLTextAreaElement).value;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, celular, mensaje }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const isSending = status === "sending";

  return (
    <section
      id="contacto"
      ref={container}
      className="relative mx-auto max-w-6xl snap-start px-6 py-14 md:py-20"
    >
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <div className="contact-col">
          <div className="overflow-hidden">
            <h2 className="heading-reveal text-2xl font-bold text-foreground md:text-3xl">
              Hablemos
            </h2>
          </div>
          <p className="mt-3 text-base text-muted">
            ¿Necesitas asesoría, cotización para tu obra o compra de mayoreo? Escríbenos.
          </p>
          <div className="mt-6 space-y-1 text-sm text-muted">
            <p>
              <a href="tel:+525517342721" className="transition-colors hover:text-foreground">
                01 55 1734 2721
              </a>
            </p>
            <p>L – V: 7:30 – 17:30h · S: 8:00 – 13:00h</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="contact-col space-y-4">
          <input
            type="text"
            name="nombre"
            required
            placeholder="Nombre"
            disabled={isSending}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none disabled:opacity-60"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="email"
              name="correo"
              required
              placeholder="Correo"
              disabled={isSending}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none disabled:opacity-60"
            />
            <input
              type="tel"
              name="celular"
              required
              placeholder="Celular"
              disabled={isSending}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none disabled:opacity-60"
            />
          </div>
          <textarea
            name="mensaje"
            required
            rows={4}
            placeholder="Tu mensaje"
            disabled={isSending}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none disabled:opacity-60"
          />
          <Button type="submit" variant="primary" className="w-full" disabled={isSending}>
            {status === "sent"
              ? "¡Mensaje enviado!"
              : isSending
                ? "Enviando..."
                : "Enviar mensaje"}
          </Button>
          {status === "sent" && (
            <p className="text-xs text-accent-green">
              Recibimos tu mensaje. Te contactaremos pronto al correo o celular que dejaste.
            </p>
          )}
          {status === "error" && (
            <p className="text-xs text-accent">
              No se pudo enviar tu mensaje. Intenta de nuevo o llámanos directamente.
            </p>
          )}
          {status === "idle" && (
            <p className="text-xs text-muted">
              Tu mensaje llega directo a la ferretería; te contactaremos lo antes posible.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
