import { useId } from 'react';
import { motion } from 'framer-motion';

export type CoalaPose =
  | 'waving'
  | 'celebrating'
  | 'thinking'
  | 'sad'
  | 'encouraging'
  | 'confused'
  | 'listening'
  | 'idea'
  | 'thumbsUp';

export type CoalaLegacyMood = 'happy' | 'pointing' | 'stressed';

interface CoalaMascotProps {
  pose?: CoalaPose;
  mood?: CoalaPose | CoalaLegacyMood;
  size?: number;
  className?: string;
}

function resolvePose(pose?: CoalaPose, mood?: CoalaPose | CoalaLegacyMood): CoalaPose {
  if (pose) return pose;
  if (!mood || mood === 'happy') return 'waving';
  if (mood === 'pointing') return 'encouraging';
  if (mood === 'stressed') return 'sad';
  return mood;
}

/**
 * Official Evoala Koala Mascot with strict SVG Face Hierarchy + ClipPath safety:
 * - All facial elements anchored inside <g id="coala-face">
 * - <clipPath> matching exact inner white head prevents eyes from EVER leaving the face
 * - Eye blinking strictly uses scaleY around each eye's own center (transformBox: fill-box)
 * - Bold official outline (#14171A), fluffy ears with dark inner hollow, glossy nose with
 *   curved highlight, coral-pink tongue (#FF758F) or vibrant green leaf (#43B02A).
 */
export function CoalaMascot({ pose, mood, size = 110, className = '' }: CoalaMascotProps) {
  const uid = useId().replace(/:/g, '');
  const faceClipId = `face-bounds-${uid}`;
  const activePose = resolvePose(pose, mood);

  const bodyBounce =
    activePose === 'celebrating'
      ? { y: [0, -7, 0] }
      : activePose === 'sad'
        ? { y: [0, 2, 0] }
        : { y: [0, -3, 0] };

  const bodyTransition =
    activePose === 'celebrating'
      ? { duration: 0.9, repeat: Infinity, ease: 'easeInOut' as const }
      : { duration: 3, repeat: Infinity, ease: 'easeInOut' as const };

  return (
    <motion.div
      animate={bodyBounce}
      transition={bodyTransition}
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Strict inner face clipPath: mathematically prevents eyes from ever exiting the white face */}
          <clipPath id={faceClipId}>
            <ellipse cx="100" cy="84" rx="46" ry="41" />
          </clipPath>
        </defs>

        {/* === POSE-SPECIFIC ACCENT FX === */}
        {activePose === 'idea' && (
          <g>
            <circle cx="164" cy="34" r="14" fill="#29B6F6" opacity="0.22" />
            <path
              d="M164 23 C158 23, 154 27, 154 32 C154 35.5, 156.5 38, 158.5 40 L158.5 43 L169.5 43 L169.5 40 C171.5 38, 174 35.5, 174 32 C174 27, 170 23, 164 23 Z"
              fill="#29B6F6"
              stroke="#14171A"
              strokeWidth="2.5"
            />
            <rect x="160" y="44" width="8" height="4" rx="1.5" fill="#E2E8F0" stroke="#14171A" strokeWidth="2" />
          </g>
        )}

        {activePose === 'confused' && (
          <text
            x="156"
            y="40"
            fill="#FFC800"
            fontSize="26"
            fontWeight="900"
            fontFamily="Nunito, sans-serif"
          >
            ?
          </text>
        )}

        {/* === BODY & LIMBS (WARM GREY + WHITE BELLY + BOLD #14171A CONTOUR) === */}
        {/* Back legs */}
        <path
          d="M72 156 C62 164, 58 178, 66 186 C74 192, 86 188, 90 176 Z"
          fill="#8C949C"
          stroke="#14171A"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        <path
          d="M128 156 C138 164, 142 178, 134 186 C126 192, 114 188, 110 176 Z"
          fill="#8C949C"
          stroke="#14171A"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />

        {/* Torso */}
        <path
          d="M66 118 C62 140, 66 168, 82 174 C94 178, 106 178, 118 174 C134 168, 138 140, 134 118 Z"
          fill="#8C949C"
          stroke="#14171A"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        {/* White Oval Belly */}
        <ellipse cx="100" cy="148" rx="22" ry="20" fill="#F4F6F8" />

        {/* Arms per pose */}
        {activePose === 'celebrating' ? (
          <g fill="#8C949C" stroke="#14171A" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M68 126 C50 112, 42 94, 50 86 C58 80, 68 92, 74 110" />
            <path d="M132 126 C150 112, 158 94, 150 86 C142 80, 132 92, 126 110" />
          </g>
        ) : activePose === 'waving' || activePose === 'encouraging' || activePose === 'thumbsUp' ? (
          <g fill="#8C949C" stroke="#14171A" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M68 128 C56 134, 52 146, 62 152 C68 155, 74 146, 76 136" />
            {/* Right waving paw with cute dark paw pad */}
            <path d="M132 128 C148 118, 162 104, 156 94 C150 86, 138 96, 130 112" />
            <ellipse cx="149" cy="103" rx="3.5" ry="5" transform="rotate(20 149 103)" fill="#262E36" stroke="none" />
          </g>
        ) : activePose === 'thinking' ? (
          <g fill="#8C949C" stroke="#14171A" strokeWidth="4.5" strokeLinecap="round">
            <path d="M68 128 C56 134, 52 146, 62 152 C68 155, 74 146, 76 136" />
            <path d="M130 130 C136 118, 124 110, 114 114" />
          </g>
        ) : activePose === 'listening' ? (
          <g fill="#8C949C" stroke="#14171A" strokeWidth="4.5" strokeLinecap="round">
            <path d="M68 128 C56 134, 52 146, 62 152 C68 155, 74 146, 76 136" />
            <path d="M132 124 C150 112, 162 94, 156 80" />
          </g>
        ) : (
          <g fill="#8C949C" stroke="#14171A" strokeWidth="4.5" strokeLinecap="round">
            <path d="M68 128 C56 136, 54 148, 64 154 C70 156, 75 148, 76 136" />
            <path d="M132 128 C144 136, 146 148, 136 154 C130 156, 125 148, 124 136" />
          </g>
        )}

        {/* === HEAD & EARS GROUP (RIGID HIERARCHY) === */}
        <g id="coala-head">
          {/* Left Fluffy Ear */}
          <path
            d="M66 50 C50 28, 22 32, 16 54 C10 74, 20 98, 42 104 C54 107, 62 102, 66 96 Z"
            fill="#FFFFFF"
            stroke="#14171A"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <path d="M60 58 C48 46, 30 50, 27 65 C25 78, 36 91, 52 93 Z" fill="#6E7781" />
          <path d="M55 63 C46 56, 36 60, 34 70 C33 79, 41 87, 51 87 Z" fill="#14171A" />
          <path d="M29 60 C35 58, 41 62, 43 67 C37 67, 33 70, 31 74 C36 74, 40 76, 42 80 C34 81, 29 76, 27 69 Z" fill="#FFFFFF" />

          {/* Right Fluffy Ear */}
          <path
            d="M134 50 C150 28, 178 32, 184 54 C190 74, 180 98, 158 104 C146 107, 138 102, 134 96 Z"
            fill="#FFFFFF"
            stroke="#14171A"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <path d="M140 58 C152 46, 170 50, 173 65 C175 78, 164 91, 148 93 Z" fill="#6E7781" />
          <path d="M145 63 C154 56, 164 60, 166 70 C167 79, 159 87, 149 87 Z" fill="#14171A" />
          <path d="M171 60 C165 58, 159 62, 157 67 C163 67, 167 70, 169 74 C164 74, 160 76, 158 80 C166 81, 171 76, 173 69 Z" fill="#FFFFFF" />

          {/* Crisp White Round Head */}
          <ellipse
            cx="100"
            cy="84"
            rx="50"
            ry="44"
            fill="#FFFFFF"
            stroke="#14171A"
            strokeWidth="5"
          />
          {/* Subtle lower jaw slate tint */}
          <path
            d="M56 96 C66 122, 134 122, 144 96 C136 126, 64 126, 56 96 Z"
            fill="#6E7781"
            opacity="0.22"
          />

          {/* === ALL FACIAL ELEMENTS INSIDE RIGID #coala-face GROUP === */}
          <g id="coala-face">
            {/* Rosy Cheeks */}
            <ellipse cx="67" cy="92" rx="7.5" ry="4.5" fill="#F8B4C4" opacity="0.68" />
            <ellipse cx="133" cy="92" rx="7.5" ry="4.5" fill="#F8B4C4" opacity="0.68" />

            {/* EYES — Strictly clipped inside #face-bounds so they can NEVER leave the white face */}
            <g clipPath={`url(#${faceClipId})`}>
              {activePose === 'celebrating' ? (
                <g stroke="#14171A" strokeWidth="4" strokeLinecap="round" fill="none">
                  <path d="M67 82 Q73 74 79 82" />
                  <path d="M121 82 Q127 74 133 82" />
                </g>
              ) : activePose === 'encouraging' || activePose === 'thumbsUp' ? (
                <g>
                  <circle cx="73" cy="82" r="6.5" fill="#14171A" />
                  <circle cx="71" cy="80" r="2.2" fill="#FFFFFF" />
                  <path
                    d="M121 82 Q127 75 133 82"
                    stroke="#14171A"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>
              ) : activePose === 'sad' ? (
                <g>
                  <circle cx="73" cy="83" r="6" fill="#14171A" />
                  <circle cx="71" cy="81" r="2" fill="#FFFFFF" />
                  <circle cx="127" cy="83" r="6" fill="#14171A" />
                  <circle cx="125" cy="81" r="2" fill="#FFFFFF" />
                  <path d="M66 74 Q72 70 79 73" stroke="#475569" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                  <path d="M134 74 Q128 70 121 73" stroke="#475569" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                  {/* Blue tears */}
                  <path d="M70 92 C70 92, 73 98, 73 100.5 C73 102.2, 71.6 103.5, 70 103.5 C68.4 103.5, 67 102.2, 67 100.5 C67 98, 70 92, 70 92 Z" fill="#29B6F6" />
                  <path d="M130 92 C130 92, 133 98, 133 100.5 C133 102.2, 131.6 103.5, 130 103.5 C128.4 103.5, 127 102.2, 127 100.5 C127 98, 130 92, 130 92 Z" fill="#29B6F6" />
                </g>
              ) : (
                /* Contained natural blink: scaleY around each eye's exact center, zero translateY! */
                <g>
                  {/* Subtle eyebrow arcs matching reference */}
                  <path d="M68 70 Q73 67 78 69" stroke="#4B555E" strokeWidth="2.6" strokeLinecap="round" fill="none" />
                  <path d="M122 69 Q127 67 132 70" stroke="#4B555E" strokeWidth="2.6" strokeLinecap="round" fill="none" />

                  <motion.g
                    animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                    transition={{ duration: 4, times: [0, 0.88, 0.92, 0.96, 1], repeat: Infinity }}
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  >
                    <circle cx="73" cy="82" r="6.5" fill="#14171A" />
                    <circle cx="71" cy="80" r="2.2" fill="#FFFFFF" />
                  </motion.g>

                  <motion.g
                    animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                    transition={{ duration: 4, times: [0, 0.88, 0.92, 0.96, 1], repeat: Infinity }}
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  >
                    <circle cx="127" cy="82" r="6.5" fill="#14171A" />
                    <circle cx="125" cy="80" r="2.2" fill="#FFFFFF" />
                  </motion.g>
                </g>
              )}
            </g>

            {/* Large Vertical Oval Black Nose + Curved Top Highlight */}
            <rect x="88" y="70" width="24" height="31" rx="12" fill="#14171A" />
            <path
              d="M93 80 C93 75, 97.5 73, 102.5 74"
              stroke="#FFFFFF"
              strokeWidth="2.8"
              strokeLinecap="round"
            />

            {/* Mouth */}
            {activePose === 'sad' ? (
              <path
                d="M89 113 Q100 106 111 113"
                stroke="#14171A"
                strokeWidth="3.8"
                strokeLinecap="round"
                fill="none"
              />
            ) : activePose === 'confused' ? (
              <path
                d="M89 110 Q94 107 100 110 Q106 113 111 109"
                stroke="#14171A"
                strokeWidth="3.6"
                strokeLinecap="round"
                fill="none"
              />
            ) : activePose === 'celebrating' || activePose === 'waving' || activePose === 'thumbsUp' ? (
              /* Joyful open smile with coral-pink tongue (#FF758F) matching reference! */
              <g>
                <path d="M84 104 Q100 114 116 104 C113 118, 87 118, 84 104 Z" fill="#14171A" />
                <ellipse cx="100" cy="113" rx="7" ry="3.5" fill="#FF758F" />
              </g>
            ) : (
              <path
                d="M88 106 Q100 116 112 106"
                stroke="#14171A"
                strokeWidth="4.2"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Signature Green Eucalyptus Leaf (#43B02A) */}
            {activePose !== 'sad' && (
              <g>
                <path
                  d="M98 113 C98 126, 111 136, 125 134 C125 121, 112 112, 98 113 Z"
                  fill="#43B02A"
                  stroke="#14171A"
                  strokeWidth="3.2"
                  strokeLinejoin="round"
                />
                <path
                  d="M102 117 L120 130"
                  stroke="#14171A"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            )}
          </g>
        </g>
      </svg>
    </motion.div>
  );
}

/** Backwards-compatible alias pointing to static EvoalaLogo */
export { EvoalaLogo as CoalaFaceLogo } from './EvoalaLogo';
