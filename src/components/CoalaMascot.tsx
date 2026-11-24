import { motion } from 'framer-motion';

export type CoalaMood = 'happy' | 'thinking' | 'stressed' | 'celebrating' | 'pointing';

interface CoalaMascotProps {
  mood?: CoalaMood;
  size?: number;
  className?: string;
}

/**
 * Official Evoala Koala Mascot in animated vector SVG (Tactile Cartoon style).
 * Thick #1A1D20 strokes, eucalyptus leaf, and 5 dynamic emotional states.
 */
export function CoalaMascot({ mood = 'happy', size = 110, className = '' }: CoalaMascotProps) {
  const bodyBounce =
    mood === 'celebrating'
      ? { y: [0, -10, 0], rotate: [-3, 3, -3] }
      : mood === 'stressed'
        ? { x: [-2, 2, -2, 2, 0] }
        : mood === 'pointing'
          ? { y: [0, -5, 0] }
          : { y: [0, -3, 0] };

  const bodyTransition =
    mood === 'celebrating'
      ? { duration: 0.75, repeat: Infinity, ease: 'easeInOut' as const }
      : mood === 'stressed'
        ? { duration: 0.45, repeat: Infinity, ease: 'linear' as const }
        : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' as const };

  return (
    <motion.div
      animate={bodyBounce}
      transition={bodyTransition}
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
    >
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible drop-shadow-[0_4px_0_rgba(26,29,32,0.22)]"
      >
        {/* Celebrating confetti & floating leaves */}
        {mood === 'celebrating' && (
          <g>
            <motion.circle
              cx="22"
              cy="28"
              r="5"
              fill="#FFC107"
              stroke="#1A1D20"
              strokeWidth="2"
              animate={{ y: [-4, 6, -4], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
            <motion.circle
              cx="140"
              cy="24"
              r="5"
              fill="#FF5252"
              stroke="#1A1D20"
              strokeWidth="2"
              animate={{ y: [4, -6, 4], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.3, repeat: Infinity }}
            />
            <motion.path
              d="M135 55 C144 48, 152 54, 146 63 C140 65, 134 61, 135 55 Z"
              fill="#43B02A"
              stroke="#1A1D20"
              strokeWidth="2"
              animate={{ rotate: [0, 20, -10, 0], y: [0, -6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <motion.path
              d="M16 62 C8 54, 20 46, 25 54 C24 61, 19 64, 16 62 Z"
              fill="#43B02A"
              stroke="#1A1D20"
              strokeWidth="2"
              animate={{ rotate: [0, -18, 12, 0], y: [0, -5, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          </g>
        )}

        {/* Thinking / AI floating nodes */}
        {mood === 'thinking' && (
          <g>
            <motion.circle
              cx="138"
              cy="26"
              r="7"
              fill="#7C4DFF"
              stroke="#1A1D20"
              strokeWidth="2.5"
              animate={{ scale: [1, 1.2, 1], y: [0, -4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <motion.path
              d="M138 22 V30 M134 26 H142"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <motion.circle
              cx="22"
              cy="34"
              r="5"
              fill="#FFC107"
              stroke="#1A1D20"
              strokeWidth="2.2"
              animate={{ scale: [0.9, 1.15, 0.9] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          </g>
        )}

        {/* Stressed steam clouds & sweat drop */}
        {mood === 'stressed' && (
          <g>
            <motion.path
              d="M126 30 C134 22, 145 28, 138 38"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -6, -10] }}
              transition={{ duration: 0.9, repeat: Infinity }}
            />
            <motion.path
              d="M28 32 C20 24, 12 30, 18 40"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -6, -10] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.25 }}
            />
            {/* Sweat drop */}
            <motion.path
              d="M118 58 C118 58, 125 68, 125 73 C125 77, 122 80, 118 80 C114 80, 111 77, 111 73 C111 68, 118 58, 118 58 Z"
              fill="#29B6F6"
              stroke="#1A1D20"
              strokeWidth="2.5"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 0.9, repeat: Infinity }}
            />
          </g>
        )}

        {/* Left Ear */}
        <motion.g
          animate={{ rotate: mood === 'stressed' ? [-6, -2, -6] : [-3, 3, -3] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          style={{ originX: '44px', originY: '62px' }}
        >
          <circle cx="38" cy="60" r="24" fill="#90A4AE" stroke="#1A1D20" strokeWidth="4" />
          <circle cx="40" cy="62" r="14" fill="#ECEFF1" />
        </motion.g>

        {/* Right Ear */}
        <motion.g
          animate={{ rotate: mood === 'stressed' ? [6, 2, 6] : [3, -3, 3] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          style={{ originX: '116px', originY: '62px' }}
        >
          <circle cx="122" cy="60" r="24" fill="#90A4AE" stroke="#1A1D20" strokeWidth="4" />
          <circle cx="120" cy="62" r="14" fill="#ECEFF1" />
        </motion.g>

        {/* Body / Torso */}
        <path
          d="M46 116 C46 102, 114 102, 114 116 L118 144 C118 150, 42 150, 42 144 Z"
          fill="#90A4AE"
          stroke="#1A1D20"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {/* Belly */}
        <ellipse cx="80" cy="132" rx="22" ry="15" fill="#ECEFF1" />

        {/* Arms depending on mood */}
        {mood === 'celebrating' ? (
          <g>
            {/* Raised cheering arms */}
            <path
              d="M48 118 C32 104, 24 88, 32 80 C40 74, 48 86, 56 102"
              fill="#90A4AE"
              stroke="#1A1D20"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M112 118 C128 104, 136 88, 128 80 C120 74, 112 86, 104 102"
              fill="#90A4AE"
              stroke="#1A1D20"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        ) : mood === 'pointing' ? (
          <g>
            <path
              d="M48 122 C38 126, 36 138, 46 140"
              fill="#90A4AE"
              stroke="#1A1D20"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Pointing right paw */}
            <motion.path
              d="M112 118 C126 112, 142 106, 146 114 C148 120, 134 128, 114 130"
              fill="#90A4AE"
              stroke="#1A1D20"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 0.9, repeat: Infinity }}
            />
          </g>
        ) : (
          <g>
            <ellipse
              cx="46"
              cy="128"
              rx="10"
              ry="13"
              transform="rotate(-18 46 128)"
              fill="#90A4AE"
              stroke="#1A1D20"
              strokeWidth="4"
            />
            <ellipse
              cx="114"
              cy="128"
              rx="10"
              ry="13"
              transform="rotate(18 114 128)"
              fill="#90A4AE"
              stroke="#1A1D20"
              strokeWidth="4"
            />
          </g>
        )}

        {/* Head */}
        <ellipse cx="80" cy="76" rx="44" ry="39" fill="#B0BEC5" stroke="#1A1D20" strokeWidth="4" />
        {/* Head tuft */}
        <path
          d="M72 38 C76 28, 84 28, 86 38 C90 32, 95 36, 92 42"
          fill="#B0BEC5"
          stroke="#1A1D20"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Rosy Cheeks */}
        <ellipse cx="52" cy="84" rx="7" ry="4.5" fill="#FF8A80" opacity="0.65" />
        <ellipse cx="108" cy="84" rx="7" ry="4.5" fill="#FF8A80" opacity="0.65" />

        {/* Eyes */}
        {mood === 'celebrating' ? (
          /* Happy closed arc eyes */
          <g stroke="#1A1D20" strokeWidth="4" strokeLinecap="round" fill="none">
            <path d="M54 72 Q61 63 68 72" />
            <path d="M92 72 Q99 63 106 72" />
          </g>
        ) : mood === 'stressed' ? (
          /* Wide nervous eyes with angled eyebrows */
          <g>
            <circle cx="61" cy="72" r="7.5" fill="#FFFFFF" stroke="#1A1D20" strokeWidth="3" />
            <circle cx="61" cy="72" r="3" fill="#1A1D20" />
            <circle cx="99" cy="72" r="7.5" fill="#FFFFFF" stroke="#1A1D20" strokeWidth="3" />
            <circle cx="99" cy="72" r="3" fill="#1A1D20" />
            <path d="M52 60 L68 64" stroke="#1A1D20" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M108 60 L92 64" stroke="#1A1D20" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        ) : (
          /* Blinking expressive cartoon eyes */
          <motion.g
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ duration: 4, times: [0, 0.88, 0.92, 0.96, 1], repeat: Infinity }}
            style={{ originY: '72px' }}
          >
            <circle cx="61" cy="72" r="6.5" fill="#1A1D20" />
            <circle cx="59" cy="69.5" r="2.2" fill="#FFFFFF" />
            <circle cx="99" cy="72" r="6.5" fill="#1A1D20" />
            <circle cx="97" cy="69.5" r="2.2" fill="#FFFFFF" />
          </motion.g>
        )}

        {/* Thinking / AI Visor Glasses */}
        {mood === 'thinking' && (
          <g>
            <rect
              x="46"
              y="62"
              width="30"
              height="20"
              rx="7"
              fill="#7C4DFF"
              fillOpacity="0.28"
              stroke="#1A1D20"
              strokeWidth="3.5"
            />
            <rect
              x="84"
              y="62"
              width="30"
              height="20"
              rx="7"
              fill="#7C4DFF"
              fillOpacity="0.28"
              stroke="#1A1D20"
              strokeWidth="3.5"
            />
            <line x1="76" y1="71" x2="84" y2="71" stroke="#1A1D20" strokeWidth="3.5" />
            <line x1="51" y1="67" x2="57" y2="67" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <line x1="89" y1="67" x2="95" y2="67" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* Signature Oval Koala Nose */}
        <ellipse cx="80" cy="80" rx="9" ry="12" fill="#263238" stroke="#1A1D20" strokeWidth="3" />
        <ellipse cx="77" cy="75" rx="2.5" ry="3.8" fill="#546E7A" />

        {/* Mouth */}
        {mood === 'stressed' ? (
          <path
            d="M71 99 Q75 94 80 99 Q85 94 89 99"
            stroke="#1A1D20"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
        ) : mood === 'celebrating' ? (
          <path
            d="M68 94 Q80 109 92 94 Z"
            fill="#FF5252"
            stroke="#1A1D20"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M71 95 Q80 103 89 95"
            stroke="#1A1D20"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Signature Eucalyptus Leaf (chewing in happy & pointing moods) */}
        {(mood === 'happy' || mood === 'pointing') && (
          <motion.g
            animate={{ rotate: [-5, 7, -5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '88px', originY: '96px' }}
          >
            <path
              d="M87 96 C96 90, 114 90, 119 101 C111 108, 95 106, 87 96 Z"
              fill="#43B02A"
              stroke="#1A1D20"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path d="M90 97 L112 100" stroke="#2D7A1C" strokeWidth="2" strokeLinecap="round" />
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
}
