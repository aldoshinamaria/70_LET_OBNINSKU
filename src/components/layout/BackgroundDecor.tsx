/** Декоративный «звёздный» фон с золотым свечением. Без логики, чисто визуал. */
export function BackgroundDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute right-0 top-1/3 h-[380px] w-[min(380px,55vw)] translate-x-1/4 rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-0 left-0 h-[420px] w-[min(420px,60vw)] -translate-x-1/4 translate-y-1/4 rounded-full bg-success/5 blur-[140px]" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(217,179,108,0.12) 1px, transparent 1px)',
          backgroundSize: '38px 38px',
          maskImage:
            'radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent 75%)',
        }}
      />
    </div>
  );
}
