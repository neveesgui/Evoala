import { motion } from 'framer-motion';

export type CoalaMood = 'happy' | 'thinking' | 'stressed' | 'sad' | 'celebrating' | 'pointing';

interface CoalaMascotProps {
  mood?: CoalaMood;
  size?: number;
  className?: string;
}

/**
 * Modern Duolingo-inspired Flat Vector Koala Mascot:
 * Clean soft vector shapes (no harsh comic black outlines), expressive eyes,
 * subtle depth shading, eucalyptus leaf, and 6 emotional states.
 */
export function CoalaMascot({ mood = 'happy', size = 110, className = '' }: CoalaMascotProps) {
  const bodyBounce =
    mood === 'celebrating'
      ? { y: [0, -10, 0], rotate: [-2.5, 2.5, -2.5] }
      : mood === 'stressed'
        ? { x: [-2, 2, -2, 2, 0] }
        : mood === 'sad'
          ? { y: [0, 3, 0] }
          : mood === 'pointing'
            ? { y: [0, -5, 0] }
            : { y: [0, -3, 0] };

  const bodyTransition =
    mood === 'celebrating'
      ? { duration: 0.72, repeat: Infinity, ease: 'easeInOut' as const }
      : mood === 'stressed'
        ? { duration: 0.45, repeat: Infinity, ease: 'linear' as const }
        : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' as const };

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
        className="w-full h-full overflow-visible drop-shadow-[0_6px_14px_rgba(15,23,42,0.10)]"
      >
        {/* Soft ground shadow */}
        <ellipse cx="80" cy="150" rx="34" ry="6" fill="#0F172A" opacity="0.08" />

        {/* Celebrating sparkles & eucalyptus leaves */}
        {mood === 'celebrating' && (
          <g>
            <motion.circle
              cx="22"
              cy="28"
              r="5"
              fill="#FFC800"
              animate={{ y: [-4, 5, -4], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
            <motion.circle
              cx="140"
              cy="24"
              r="5"
              fill="#1CB0F6"
              animate={{ y: [4, -5, 4], scale: [1, 1.15, 1] }}
              transition={{ duration: 1.3, repeat: Infinity }}
            />
            <motion.path
              d="M134 52 C143 45, 152 51, 145 60 C139 62, 133 58, 134 52 Z"
              fill="#58CC02"
              animate={{ rotate: [0, 18, -10, 0], y: [0, -6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <motion.path
              d="M16 58 C8 50, 20 42, 25 50 C24 57, 19 60, 16 58 Z"
              fill="#58CC02"
              animate={{ rotate: [0, -16, 10, 0], y: [0, -5, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          </g>
        )}

        {/* Thinking AI sparkles */}
        {mood === 'thinking' && (
          <g>
            <motion.circle
              cx="136"
              cy="28"
              r="7"
              fill="#7C4DFF"
              animate={{ scale: [1, 1.2, 1], y: [0, -4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <path d="M136 24 V32 M132 28 H140" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <motion.circle
              cx="24"
              cy="34"
              r="4.5"
              fill="#1CB0F6"
              animate={{ scale: [0.9, 1.2, 0.9] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          </g>
        )}

        {/* Stressed / Sad tear or sweat */}
        {(mood === 'stressed' || mood === 'sad') && (
          <motion.path
            d="M119 60 C119 60, 125 69, 125 73.5 C125 77, 122.3 80, 119 80 C115.7 80, 113 77, 113 73.5 C113 69, 119 60, 119 60 Z"
            fill="#1CB0F6"
            animate={{ y: [0, 6, 0], opacity: [0.95, 0.65, 0.95] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}

        {/* Left Ear */}
        <motion.g
          animate={{ rotate: mood === 'sad' ? [-10, -8, -10] : mood === 'stressed' ? [-5, -1, -5] : [-2.5, 2.5, -2.5] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          style={{ originX: '46px', originY: '64px' }}
        >
          <circle cx="38" cy="60" r="24" fill="#8B9EB0" />
          <circle cx="40" cy="62" r="14.5" fill="#F1F5F9" />
          <circle cx="42" cy="64" r="8" fill="#FECDD3" opacity="0.45" />
        </motion.g>

        {/* Right Ear */}
        <motion.g
          animate={{ rotate: mood === 'sad' ? [10, 8, 10] : mood === 'stressed' ? [5, 1, 5] : [2.5, -2.5, 2.5] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          style={{ originX: '114px', originY: '64px' }}
        >
          <circle cx="122" cy="60" r="24" fill="#8B9EB0" />
          <circle cx="120" cy="62" r="14.5" fill="#F1F5F9" />
          <circle cx="118" cy="64" r="8" fill="#FECDD3" opacity="0.45" />
        </motion.g>

        {/* Body / Torso */}
        <path
          d="M46 114 C46 98, 114 98, 114 114 L118 142 C118 149, 42 149, 42 142 Z"
          fill="#8B9EB0"
        />
        {/* Soft Belly */}
        <ellipse cx="80" cy="131" rx="22" ry="15" fill="#F1F5F9" />

        {/* Arms */}
        {mood === 'celebrating' ? (
          <g>
            <path
              d="M48 118 C32 104, 24 88, 32 80 C40 74, 48 86, 56 102"
              fill="#8B9EB0"
            />
            <path
              d="M112 118 C128 104, 136 88, 128 80 C120 74, 112 86, 104 102"
              fill="#8B9EB0"
            />
          </g>
        ) : mood === 'pointing' ? (
          <g>
            <ellipse cx="46" cy="127" rx="10" ry="13" transform="rotate(-16 46 127)" fill="#8B9EB0" />
            <motion.path
              d="M110 118 C125 112, 141 107, 145 114 C147 120, 133 128, 113 130"
              fill="#8B9EB0"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 0.9, repeat: Infinity }}
            />
          </g>
        ) : (
          <g>
            <ellipse cx="46" cy="127" rx="10" ry="13" transform="rotate(-16 46 127)" fill="#8B9EB0" />
            <ellipse cx="114" cy="127" rx="10" ry="13" transform="rotate(16 114 127)" fill="#8B9EB0" />
          </g>
        )}

        {/* Head */}
        <ellipse cx="80" cy="76" rx="44" ry="39" fill="#A3B4C4" />
        {/* Top soft highlight */}
        <ellipse cx="80" cy="54" rx="28" ry="12" fill="#FFFFFF" opacity="0.18" />
        {/* Head Tuft */}
        <path
          d="M72 39 C76 28, 84 28, 86 39 C90 33, 95 37, 91 43 Z"
          fill="#A3B4C4"
        />

        {/* Rosy Cheeks */}
        <ellipse cx="52" cy="85" rx="7.5" ry="4.5" fill="#FB7185" opacity="0.45" />
        <ellipse cx="108" cy="85" rx="7.5" ry="4.5" fill="#FB7185" opacity="0.45" />

        {/* Eyes */}
        {mood === 'celebrating' ? (
          <g stroke="#1E293B" strokeWidth="4" strokeLinecap="round" fill="none">
            <path d="M54 72 Q61 63 68 72" />
            <path d="M92 72 Q99 63 106 72" />
          </g>
        ) : mood === 'sad' ? (
          <g>
            <circle cx="61" cy="73" r="6" fill="#1E293B" />
            <circle cx="59" cy="71" r="2" fill="#FFFFFF" />
            <circle cx="99" cy="73" r="6" fill="#1E293B" />
            <circle cx="97" cy="71" r="2" fill="#FFFFFF" />
            {/* Worried eyebrows */}
            <path d="M53 64 Q60 60 67 62" stroke="#475569" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M107 64 Q100 60 93 62" stroke="#475569" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
        ) : mood === 'stressed' ? (
          <g>
            <circle cx="61" cy="72" r="7.5" fill="#FFFFFF" />
            <circle cx="61" cy="72" r="3.2" fill="#1E293B" />
            <circle cx="99" cy="72" r="7.5" fill="#FFFFFF" />
            <circle cx="99" cy="72" r="3.2" fill="#1E293B" />
            <path d="M52 60 L68 64" stroke="#334155" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M108 60 L92 64" stroke="#334155" strokeWidth="3.2" strokeLinecap="round" />
          </g>
        ) : (
          <motion.g
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ duration: 4.2, times: [0, 0.88, 0.92, 0.96, 1], repeat: Infinity }}
            style={{ originY: '72px' }}
          >
            <circle cx="61" cy="72" r="6.5" fill="#1E293B" />
            <circle cx="59" cy="69.5" r="2.2" fill="#FFFFFF" />
            <circle cx="99" cy="72" r="6.5" fill="#1E293B" />
            <circle cx="97" cy="69.5" r="2.2" fill="#FFFFFF" />
          </motion.g>
        )}

        {/* Thinking Glass Visor */}
        {mood === 'thinking' && (
          <g>
            <rect
              x="46"
              y="62"
              width="30"
              height="20"
              rx="8"
              fill="#7C4DFF"
              fillOpacity="0.18"
              stroke="#5E35D6"
              strokeWidth="2.8"
            />
            <rect
              x="84"
              y="62"
              width="30"
              height="20"
              rx="8"
              fill="#7C4DFF"
              fillOpacity="0.18"
              stroke="#5E35D6"
              strokeWidth="2.8"
            />
            <line x1="76" y1="71" x2="84" y2="71" stroke="#5E35D6" strokeWidth="2.8" />
          </g>
        )}

        {/* Oval Koala Nose */}
        <ellipse cx="80" cy="80" rx="9" ry="12" fill="#334155" />
        <ellipse cx="77" cy="75.5" rx="2.5" ry="3.8" fill="#64748B" />

        {/* Mouth */}
        {mood === 'sad' ? (
          <path
            d="M72 100 Q80 93 88 100"
            stroke="#334155"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
        ) : mood === 'stressed' ? (
          <path
            d="M71 99 Q75 94 80 99 Q85 94 89 99"
            stroke="#334155"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        ) : mood === 'celebrating' ? (
          <path
            d="M69 94 Q80 108 91 94 Z"
            fill="#FF4B4B"
          />
        ) : (
          <path
            d="M71 95 Q80 103 89 95"
            stroke="#334155"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Eucalyptus Leaf */}
        {(mood === 'happy' || mood === 'pointing') && (
          <motion.g
            animate={{ rotate: [-5, 7, -5] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '88px', originY: '96px' }}
          >
            <path
              d="M87 96 C96 90, 114 90, 119 101 C111 108, 95 106, 87 96 Z"
              fill="#58CC02"
            />
            <path d="M90 97 L112 100" stroke="#46A302" strokeWidth="2" strokeLinecap="round" />
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
}
