interface EvoalaLogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

/**
 * Official 100% STATIC Evoala Koala Face Logo (real artwork PNG, zero animations).
 */
export function EvoalaLogo({
  size = 180,
  showWordmark = false,
  className = '',
}: EvoalaLogoProps) {
  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <img
        src="/mascot/face.png"
        alt="Evoala"
        width={size}
        style={{ width: size, height: 'auto' }}
        draggable={false}
        className="block object-contain pointer-events-none select-none"
      />

      {showWordmark && (
        <div className="flex flex-col items-center mt-4">
          <span className="font-display text-5xl font-black tracking-tight text-white leading-none">
            EVOALA
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-[0.26em] text-white mt-2">
            DESPERTE O SEU POTENCIAL
          </span>
        </div>
      )}
    </div>
  );
}
