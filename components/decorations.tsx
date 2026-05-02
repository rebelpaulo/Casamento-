import type { SVGProps } from "react"

/** Tiny heart used in dividers and accents. */
export function HeartGlyph({ className = "h-3 w-3", ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M12 21s-7.5-4.6-9.5-9.2C1 8.5 3 5 6.5 5c2 0 3.4 1.1 4.5 2.6C12.1 6.1 13.5 5 15.5 5 19 5 21 8.5 19.5 11.8 17.5 16.4 12 21 12 21z" />
    </svg>
  )
}

/** A pair of olive sprigs framing optional children. */
export function OliveFlourish({ className = "" }: { className?: string }) {
  const Sprig = ({ flip = false }: { flip?: boolean }) => (
    <svg
      viewBox="0 0 80 18"
      className="h-3 w-16"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <path d="M2 9 Q 30 9 70 9" />
        <path d="M14 9 q 4 -5 10 -3" fill="currentColor" fillOpacity="0.25" />
        <path d="M26 9 q 4 5 10 3" fill="currentColor" fillOpacity="0.25" />
        <path d="M38 9 q 4 -5 10 -3" fill="currentColor" fillOpacity="0.25" />
        <path d="M50 9 q 4 5 10 3" fill="currentColor" fillOpacity="0.25" />
      </g>
    </svg>
  )
  return (
    <div className={`flex items-center justify-center gap-3 text-primary/70 ${className}`}>
      <Sprig />
      <HeartGlyph className="h-3 w-3 text-accent/70" />
      <Sprig flip />
    </div>
  )
}

/** Dashed horizontal line. */
export function DottedDivider({ className = "" }: { className?: string }) {
  return <div className={`dotted-rule ${className}`} />
}

/** Dashed line with a heart in the middle (used between sections). */
export function HeartDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 text-accent/60 ${className}`}>
      <span className="dotted-rule flex-1" />
      <HeartGlyph className="h-3 w-3" />
      <span className="dotted-rule flex-1" />
    </div>
  )
}

/** Dotted scalloped wave (used at the bottom of the hero). */
export function ScallopWave({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 12"
      className={`h-3 w-full text-border ${className}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 6 Q 12.5 0 25 6 T 50 6 T 75 6 T 100 6 T 125 6 T 150 6 T 175 6 T 200 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 3"
      />
    </svg>
  )
}

/** Decorative sealed envelope corner accent. */
export function CornerSpray({
  position = "top-left",
  className = "",
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  className?: string
}) {
  const transform =
    position === "top-right"
      ? "scaleX(-1)"
      : position === "bottom-left"
        ? "scaleY(-1)"
        : position === "bottom-right"
          ? "scale(-1, -1)"
          : undefined
  return (
    <svg
      viewBox="0 0 90 90"
      className={`h-16 w-16 text-primary/50 ${className}`}
      style={{ transform }}
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
        <path d="M8 8 Q 30 18 42 38" />
        <path d="M14 12 q 6 -3 12 -1" fill="currentColor" fillOpacity="0.2" />
        <path d="M22 22 q 6 -2 12 0" fill="currentColor" fillOpacity="0.2" />
        <path d="M30 32 q 6 -2 12 0" fill="currentColor" fillOpacity="0.2" />
        <circle cx="46" cy="42" r="1.6" fill="currentColor" />
        <path d="M50 36 l 4 -2 M52 42 l 4 0" />
      </g>
    </svg>
  )
}
