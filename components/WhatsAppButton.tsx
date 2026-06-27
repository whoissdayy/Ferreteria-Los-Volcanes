"use client";

// Número y mensaje predefinidos del negocio — wa.me abre directo la app de WhatsApp en
// celular (Android/iOS) y WhatsApp Web en escritorio, sin necesitar guardar el contacto.
const WHATSAPP_NUMBER = "525540615646"; // 52 = México, sin signos ni espacios
const WHATSAPP_MESSAGE =
  "Hola, vi su página web y me gustaría recibir más información.";
const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

// Botón flotante fijo en la esquina inferior derecha, visible en cualquier sección y en
// cualquier dispositivo (fixed, no relative — no se mueve con el scroll de la página).
// El anillo de "ping" detrás del ícono es lo que le da el movimiento que pide el cliente,
// para que el botón llame la atención sin ser tan intrusivo como un rebote constante.
// motion-safe: respeta prefers-reduced-motion — si el usuario lo tiene activado, el botón
// se queda quieto en vez de animarse.
export function WhatsAppButton() {
  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 motion-safe:animate-ping"
      />
      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noreferrer"
        aria-label="Escríbenos por WhatsApp"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 transition-transform duration-300 hover:scale-110 active:scale-95"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
          className="h-7 w-7"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.64 14.07c-.24.67-1.39 1.28-1.92 1.36-.49.08-1.11.11-1.79-.11-.41-.13-.94-.31-1.61-.6-2.84-1.23-4.69-4.08-4.83-4.27-.14-.19-1.16-1.55-1.16-2.95s.73-2.09.99-2.38c.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.15.07.15.12.33.02.53-.1.2-.15.32-.3.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29 1.13 1.86 2.32 2.94 1.59 1.44 2.34 1.5 2.6 1.5.19 0 .4-.05.55-.15.18-.12.4-.34.59-.55.14-.15.31-.18.52-.1.21.08 1.31.62 1.53.73.22.11.37.17.42.27.06.1.05.55-.19 1.22z" />
        </svg>
      </a>
    </div>
  );
}
