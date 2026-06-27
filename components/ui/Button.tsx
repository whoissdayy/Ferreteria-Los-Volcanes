import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline";

// hover:scale-105 + active:scale-95: micro-interacción tipo "magnetic button" (clearstreet.io
// y sitios de agencia usan este pulso sutil en sus CTAs) — da sensación de tactilidad sin
// requerir Motion/GSAP, solo transition-transform de Tailwind.
const base =
  "inline-flex items-center justify-center px-5 py-2 rounded-full text-sm transition-all duration-200 hover:scale-105 active:scale-95";
const variants: Record<Variant, string> = {
  primary: "bg-accent text-background hover:opacity-90 hover:shadow-lg hover:shadow-accent/30",
  outline: "border border-border text-foreground hover:bg-foreground/5 hover:border-accent",
};

// Componente polimórfico: si recibe `href` renderiza un <a> (ej. botón que navega a un
// ancla de la página, como "Sobre nosotros"); si no, renderiza un <button> normal (ej. el
// submit del formulario de contacto). Evita anidar <button> dentro de <a> en cualquiera
// de los dos casos porque nunca se renderizan ambos a la vez.
type AnchorButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  href: string;
};
type NativeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  href?: undefined;
};
type ButtonProps = AnchorButtonProps | NativeButtonProps;

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (props.href) {
    return <a className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)} />;
  }

  return (
    <button
      className={classes}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );
}
