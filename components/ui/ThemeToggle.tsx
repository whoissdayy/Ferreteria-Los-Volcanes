"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // evita mismatch de hidratación: no se sabe el tema real hasta que el componente monta en cliente
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-11 w-11" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      // h-11 w-11 (44px): tamaño grande pedido explícitamente para el toggle, también
      // coincide con el mínimo recomendado de área táctil en móvil
      className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-xl text-foreground transition-colors hover:bg-foreground/5"
    >
      {isDark ? "☀" : "☾"}
    </button>
  );
}
