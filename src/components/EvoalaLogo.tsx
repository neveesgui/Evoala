interface EvoalaLogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

/**
 * Official 100% STATIC Evoala Brand Logo (Zero animations).
 * Bold vector Koala head (#FFFFFF fill, #14171A thick outline, #6E7781 inner slate shading,
 * fluffy scalloped ears, solid eyes with top-left catchlight, oval nose with curved arc shine,
 * smile holding #43B02A eucalyptus leaf).
 */
export function EvoalaLogo({
  size = 176,
  showWordmark = false,
  className = '',
}: EvoalaLogoProps) {
  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg
        width={size}
        height={Math.round(size * 0.78)}
        viewBox="0 0 220 172"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        {/* Left Fluffy Ear */}
        <path
          d="M72 44 C54 20, 22 24, 14 48 C6 70, 16 98, 42 106 C54 110, 64 106, 70 98 Z"
          fill="#FFFFFF"
          stroke="#14171A"
          strokeWidth="6.5"
          strokeLinejoin="round"
        />
        {/* Ear slate-grey inner shading */}
        <path
          d="M66 52 C52 38, 30 42, 26 60 C23 76, 36 92, 56 94 Z"
          fill="#6E7781"
        />
        {/* Ear dark interior */}
        <path
          d="M60 58 C49 49, 36 53, 34 65 C33 76, 43 86, 55 86 Z"
          fill="#14171A"
        />
        {/* White fluffy inner ear tuft */}
        <path
          d="M28 54 C36 52, 43 56, 46 62 C38 62, 33 65, 30 70 C36 69, 41 72, 44 77 C35 78, 28 73, 25 65 Z"
          fill="#FFFFFF"
        />

        {/* Right Fluffy Ear */}
        <path
          d="M148 44 C166 20, 198 24, 206 48 C214 70, 204 98, 178 106 C166 110, 156 106, 150 98 Z"
          fill="#FFFFFF"
          stroke="#14171A"
          strokeWidth="6.5"
          strokeLinejoin="round"
        />
        <path
          d="M154 52 C168 38, 190 42, 194 60 C197 76, 184 92, 164 94 Z"
          fill="#6E7781"
        />
        <path
          d="M160 58 C171 49, 184 53, 186 65 C187 76, 177 86, 165 86 Z"
          fill="#14171A"
        />
        <path
          d="M192 54 C184 52, 177 56, 174 62 C182 62, 187 65, 190 70 C184 69, 179 72, 176 77 C185 78, 192 73, 195 65 Z"
          fill="#FFFFFF"
        />

        {/* Head Outer Base + Subtle Slate Jaw Shading */}
        <ellipse
          cx="110"
          cy="86"
          rx="58"
          ry="52"
          fill="#FFFFFF"
          stroke="#14171A"
          strokeWidth="6.5"
        />
        <path
          d="M58 98 C68 128, 152 128, 162 98 C154 134, 66 134, 58 98 Z"
          fill="#6E7781"
          opacity="0.35"
        />

        {/* Static Eyes (midline, single top-left white catchlight) */}
        <circle cx="76" cy="84" r="8" fill="#14171A" />
        <circle cx="73.5" cy="81.5" r="2.6" fill="#FFFFFF" />

        <circle cx="144" cy="84" r="8" fill="#14171A" />
        <circle cx="141.5" cy="81.5" r="2.6" fill="#FFFFFF" />

        {/* Large Vertical Oval Black Nose with Curved White Arc Highlight */}
        <rect x="96" y="70" width="28" height="36" rx="14" fill="#14171A" />
        <path
          d="M102 82 C102 76, 107 73.5, 113 74.5"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Short Black Smile Arc */}
        <path
          d="M93 111 Q110 124 127 111"
          stroke="#14171A"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Vibrant Green Eucalyptus Leaf (#43B02A) angled down-right */}
        <path
          d="M103 120 C103 137, 118 149, 134 147 C134 131, 119 119, 103 120 Z"
          fill="#43B02A"
          stroke="#14171A"
          strokeWidth="4.2"
          strokeLinejoin="round"
        />
        <path
          d="M107 125 L128 142"
          stroke="#14171A"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </svg>

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
