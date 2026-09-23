// Decorative full-width SVG wave used to transition a gradient hero into a flat section below.
// Purely presentational: hidden from assistive tech.
export default function SectionDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div aria-hidden="true" className={flip ? "rotate-180" : undefined}>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="block h-16 w-full text-surface sm:h-20">
        <path
          d="M0,32 C240,80 480,0 720,16 C960,32 1200,80 1440,40 L1440,80 L0,80 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
