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
  /** Backwards-compatible alias for pose */
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
 * Official Evoala Koala Mascot:
 * Stylized crisp white koala with clean dark contour, green eucalyptus leaf,
 * vibrant blue backpack (#29B6F6), and 9 reactive emotional poses.
 */
export function CoalaMascot({ pose, mood, size = 110, className = '' }: CoalaMascotProps) {
  const activePose = resolvePose(pose, mood);

  const bodyBounce =
    activePose === 'celebrating'
      ? { y: [0, -11, 0], rotate: [-2.5, 2.5, -2.5] }
      : activePose === 'sad'
        ? { y: [0, 3, 0] }
        : activePose === 'encouraging' || activePose === 'thumbsUp'
          ? { y: [0, -5, 0] }
          : { y: [0, -3, 0] };

  const bodyTransition =
    activePose === 'celebrating'
      ? { duration: 0.72, repeat: Infinity, ease: 'easeInOut' as const }
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
        className="w-full h-full overflow-visible drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)]"
      >
        {/* Ambient shadow under koala */}
        <ellipse cx="80" cy="151" rx="34" ry="5.5" fill="#000000" opacity="0.28" />

        {/* === POSE-SPECIFIC BACKDROP FX === */}

        {/* Golden sparkles for waving, celebrating, thumbsUp */}
        {(activePose === 'waving' || activePose === 'celebrating' || activePose === 'thumbsUp') && (
          <g>
            <motion.path
              d="M22 26 L24.5 20 L27 26 L33 28.5 L27 31 L24.5 37 L22 31 L16 28.5 Z"
              fill="#FFD54F"
              animate={{ scale: [0.85, 1.2, 0.85], opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ originX: '24px', originY: '28px' }}
            />
            <motion.path
              d="M135 22 L137 17 L139 22 L144 24 L139 26 L137 31 L135 26 L130 24 Z"
              fill="#FFD54F"
              animate={{ scale: [1.1, 0.8, 1.1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.7, repeat: Infinity }}
              style={{ originX: '137px', originY: '24px' }}
            />
          </g>
        )}

        {/* Blue action rays for encouraging */}
        {activePose === 'encouraging' && (
          <g stroke="#29B6F6" strokeWidth="3.5" strokeLinecap="round">
            <motion.line
              x1="138"
              y1="66"
              x2="150"
              y2="58"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.line
              x1="142"
              y1="82"
              x2="154"
              y2="82"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.line
              x1="138"
              y1="98"
              x2="150"
              y2="105"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </g>
        )}

        {/* Glowing blue lightbulb for idea */}
        {activePose === 'idea' && (
          <motion.g
            animate={{ y: [0, -4, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            style={{ originX: '138px', originY: '34px' }}
          >
            <circle cx="138" cy="30" r="14" fill="#29B6F6" opacity="0.22" />
            <path
              d="M138 20 C132.5 20, 129 24, 129 28.5 C129 31.8, 131.2 34, 133 36 L133 39 L143 39 L143 36 C144.8 34, 147 31.8, 147 28.5 C147 24, 143.5 20, 138 20 Z"
              fill="#29B6F6"
              stroke="#121E26"
              strokeWidth="2.5"
            />
            <rect x="134" y="39" width="8" height="4" rx="1.5" fill="#E2E8F0" stroke="#121E26" strokeWidth="2" />
            <circle cx="136" cy="26" r="2.2" fill="#FFFFFF" opacity="0.85" />
          </motion.g>
        )}

        {/* Sound waves for listening */}
        {activePose === 'listening' && (
          <g stroke="#00E676" strokeWidth="3" strokeLinecap="round" fill="none">
            <motion.path
              d="M142 52 Q150 62 142 72"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
            <motion.path
              d="M149 46 Q159 62 149 78"
              animate={{ opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration: 1.1, delay: 0.2, repeat: Infinity }}
            />
          </g>
        )}

        {/* Question mark for confused */}
        {activePose === 'confused' && (
          <motion.text
            x="132"
            y="36"
            fill="#FFD54F"
            fontSize="24"
            fontWeight="900"
            fontFamily="Nunito, sans-serif"
            animate={{ y: [0, -4, 0], rotate: [-6, 6, -6] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            ?
          </motion.text>
        )}

        {/* === BLUE BACKPACK (#29B6F6) PEEKING BEHIND BODY === */}
        <rect
          x="34"
          y="98"
          width="92"
          height="46"
          rx="18"
          fill="#29B6F6"
          stroke="#121E26"
          strokeWidth="3.2"
        />
        <rect
          x="42"
          y="102"
          width="76"
          height="12"
          rx="6"
          fill="#67D4FF"
          opacity="0.45"
        />

        {/* === EARS (CRISP WHITE KOALA) === */}
        <motion.g
          animate={{ rotate: activePose === 'sad' ? [-9, -7, -9] : [-2.5, 2.5, -2.5] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          style={{ originX: '44px', originY: '60px' }}
        >
          <circle cx="37" cy="58" r="23" fill="#F8FAFC" stroke="#121E26" strokeWidth="3.2" />
          <circle cx="39" cy="60" r="13" fill="#E2E8F0" />
          <circle cx="40" cy="61" r="7" fill="#FDA4AF" opacity="0.45" />
        </motion.g>

        <motion.g
          animate={{ rotate: activePose === 'sad' ? [9, 7, 9] : [2.5, -2.5, 2.5] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          style={{ originX: '116px', originY: '60px' }}
        >
          <circle cx="123" cy="58" r="23" fill="#F8FAFC" stroke="#121E26" strokeWidth="3.2" />
          <circle cx="121" cy="60" r="13" fill="#E2E8F0" />
          <circle cx="120" cy="61" r="7" fill="#FDA4AF" opacity="0.45" />
        </motion.g>

        {/* === BODY / TORSO === */}
        <path
          d="M48 112 C48 98, 112 98, 112 112 L116 142 C116 148, 44 148, 44 142 Z"
          fill="#F8FAFC"
          stroke="#121E26"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
        {/* Soft Belly */}
        <ellipse cx="80" cy="131" rx="20" ry="13" fill="#E2E8F0" opacity="0.7" />

        {/* Blue Backpack Straps on Shoulders */}
        <path
          d="M55 106 C53 118, 53 130, 56 144"
          stroke="#29B6F6"
          strokeWidth="7.5"
          strokeLinecap="round"
        />
        <path
          d="M105 106 C107 118, 107 130, 104 144"
          stroke="#29B6F6"
          strokeWidth="7.5"
          strokeLinecap="round"
        />
        {/* Strap chest buckle */}
        <rect x="66" y="121" width="28" height="5" rx="2.5" fill="#0288D1" />
        <rect x="76" y="119.5" width="8" height="8" rx="2" fill="#E0F7FA" stroke="#121E26" strokeWidth="1.8" />

        {/* === ARMS PER POSE === */}
        {activePose === 'celebrating' ? (
          <g fill="#F8FAFC" stroke="#121E26" strokeWidth="3.2" strokeLinecap="round">
            <path d="M48 118 C30 103, 24 85, 32 78 C40 72, 49 85, 56 102" />
            <path d="M112 118 C130 103, 136 85, 128 78 C120 72, 111 85, 104 102" />
          </g>
        ) : activePose === 'waving' ? (
          <g fill="#F8FAFC" stroke="#121E26" strokeWidth="3.2" strokeLinecap="round">
            <ellipse cx="47" cy="127" rx="9" ry="12" transform="rotate(-16 47 127)" />
            <motion.path
              d="M112 116 C128 104, 138 86, 130 78 C122 72, 112 86, 106 102"
              animate={{ rotate: [-6, 10, -6] }}
              transition={{ duration: 0.9, repeat: Infinity }}
              style={{ originX: '112px', originY: '114px' }}
            />
          </g>
        ) : activePose === 'thinking' ? (
          <g fill="#F8FAFC" stroke="#121E26" strokeWidth="3.2" strokeLinecap="round">
            <ellipse cx="47" cy="127" rx="9" ry="12" transform="rotate(-16 47 127)" />
            {/* Paw resting on chin */}
            <path d="M110 120 C112 108, 98 100, 90 102 C86 104, 88 112, 98 116" />
          </g>
        ) : activePose === 'encouraging' ? (
          <g fill="#F8FAFC" stroke="#121E26" strokeWidth="3.2" strokeLinecap="round">
            <ellipse cx="47" cy="127" rx="9" ry="12" transform="rotate(-16 47 127)" />
            <motion.path
              d="M110 116 C126 108, 142 104, 146 112 C148 119, 133 127, 112 128"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 0.9, repeat: Infinity }}
            />
          </g>
        ) : activePose === 'confused' ? (
          <g fill="#F8FAFC" stroke="#121E26" strokeWidth="3.2" strokeLinecap="round">
            <path d="M48 118 C32 114, 22 106, 26 98 C30 92, 42 98, 52 108" />
            <path d="M112 118 C128 114, 138 106, 134 98 C130 92, 118 98, 108 108" />
          </g>
        ) : activePose === 'listening' ? (
          <g fill="#F8FAFC" stroke="#121E26" strokeWidth="3.2" strokeLinecap="round">
            <ellipse cx="47" cy="127" rx="9" ry="12" transform="rotate(-16 47 127)" />
            {/* Hand cupped behind right ear */}
            <path d="M112 114 C128 100, 138 78, 132 68 C126 62, 118 72, 114 88" />
          </g>
        ) : activePose === 'idea' ? (
          <g fill="#F8FAFC" stroke="#121E26" strokeWidth="3.2" strokeLinecap="round">
            <ellipse cx="47" cy="127" rx="9" ry="12" transform="rotate(-16 47 127)" />
            {/* Raised index finger paw */}
            <path d="M112 116 C124 102, 128 80, 122 72 C117 68, 110 78, 108 98" />
          </g>
        ) : activePose === 'thumbsUp' ? (
          <g fill="#F8FAFC" stroke="#121E26" strokeWidth="3.2" strokeLinecap="round">
            <ellipse cx="47" cy="127" rx="9" ry="12" transform="rotate(-16 47 127)" />
            {/* Thumbs up paw */}
            <path d="M110 120 C124 114, 132 104, 130 94 C128 88, 122 90, 120 98 L112 106" />
          </g>
        ) : (
          /* sad */
          <g fill="#F8FAFC" stroke="#121E26" strokeWidth="3.2">
            <ellipse cx="52" cy="130" rx="9" ry="12" transform="rotate(14 52 130)" />
            <ellipse cx="108" cy="130" rx="9" ry="12" transform="rotate(-14 108 130)" />
          </g>
        )}

        {/* === HEAD (CRISP WHITE KOALA) === */}
        <ellipse cx="80" cy="75" rx="43" ry="38" fill="#FFFFFF" stroke="#121E26" strokeWidth="3.2" />
        {/* Soft specular forehead sheen */}
        <ellipse cx="80" cy="52" rx="25" ry="10" fill="#E0F2FE" opacity="0.45" />
        {/* Cute head tuft */}
        <path
          d="M72 38 C76 28, 84 28, 86 38 C90 32, 95 36, 91 42"
          fill="#FFFFFF"
          stroke="#121E26"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Rosy Cheeks */}
        <ellipse cx="52" cy="84" rx="7" ry="4" fill="#FB7185" opacity="0.45" />
        <ellipse cx="108" cy="84" rx="7" ry="4" fill="#FB7185" opacity="0.45" />

        {/* === EYES PER POSE === */}
        {activePose === 'celebrating' ? (
          <g stroke="#121E26" strokeWidth="3.8" strokeLinecap="round" fill="none">
            <path d="M54 71 Q61 62 68 71" />
            <path d="M92 71 Q99 62 106 71" />
          </g>
        ) : activePose === 'encouraging' || activePose === 'thumbsUp' ? (
          /* Winking right eye + bright left eye */
          <g>
            <circle cx="61" cy="71" r="6.2" fill="#121E26" />
            <circle cx="59" cy="68.8" r="2.2" fill="#FFFFFF" />
            <path
              d="M92 71 Q99 64 106 71"
              stroke="#121E26"
              strokeWidth="3.8"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ) : activePose === 'sad' ? (
          /* Sad eyes + blue tears */
          <g>
            <circle cx="61" cy="72" r="5.8" fill="#121E26" />
            <circle cx="59.5" cy="70" r="2" fill="#FFFFFF" />
            <circle cx="99" cy="72" r="5.8" fill="#121E26" />
            <circle cx="97.5" cy="70" r="2" fill="#FFFFFF" />
            <path d="M53 63 Q60 59 67 61" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M107 63 Q100 59 93 61" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            {/* Blue tears */}
            <motion.path
              d="M55 80 C55 80, 59 87, 59 90 C59 92.2, 57.2 94, 55 94 C52.8 94, 51 92.2, 51 90 C51 87, 55 80, 55 80 Z"
              fill="#29B6F6"
              animate={{ y: [0, 5, 0], opacity: [0.95, 0.5, 0.95] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <motion.path
              d="M105 80 C105 80, 109 87, 109 90 C109 92.2, 107.2 94, 105 94 C102.8 94, 101 92.2, 101 90 C101 87, 105 80, 105 80 Z"
              fill="#29B6F6"
              animate={{ y: [0, 5, 0], opacity: [0.95, 0.5, 0.95] }}
              transition={{ duration: 1.2, delay: 0.3, repeat: Infinity }}
            />
          </g>
        ) : activePose === 'confused' ? (
          /* Raised asymmetric eyebrow */
          <g>
            <circle cx="61" cy="71" r="6" fill="#121E26" />
            <circle cx="59" cy="69" r="2" fill="#FFFFFF" />
            <circle cx="99" cy="71" r="6" fill="#121E26" />
            <circle cx="97" cy="69" r="2" fill="#FFFFFF" />
            <path d="M54 61 Q61 59 68 62" stroke="#121E26" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M92 59 Q99 54 106 58" stroke="#121E26" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          </g>
        ) : (
          /* Standard blinking expressive eyes */
          <motion.g
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ duration: 4.2, times: [0, 0.88, 0.92, 0.96, 1], repeat: Infinity }}
            style={{ originY: '71px' }}
          >
            <circle cx="61" cy="71" r="6.2" fill="#121E26" />
            <circle cx="59" cy="68.8" r="2.2" fill="#FFFFFF" />
            <circle cx="99" cy="71" r="6.2" fill="#121E26" />
            <circle cx="97" cy="68.8" r="2.2" fill="#FFFFFF" />
          </motion.g>
        )}

        {/* Signature Oval Koala Nose */}
        <ellipse cx="80" cy="79" rx="8.8" ry="11.5" fill="#1E293B" />
        <ellipse cx="77" cy="74.5" rx="2.3" ry="3.5" fill="#64748B" />

        {/* === MOUTH === */}
        {activePose === 'sad' ? (
          <path d="M72 99 Q80 93 88 99" stroke="#121E26" strokeWidth="3" strokeLinecap="round" fill="none" />
        ) : activePose === 'confused' ? (
          <path d="M72 97 Q76 94 80 97 Q84 100 88 96" stroke="#121E26" strokeWidth="3" strokeLinecap="round" fill="none" />
        ) : activePose === 'celebrating' ? (
          <path d="M69 93 Q80 107 91 93 Z" fill="#FF4B4B" stroke="#121E26" strokeWidth="2.6" strokeLinejoin="round" />
        ) : (
          <path d="M71 94 Q80 102 89 94" stroke="#121E26" strokeWidth="3" strokeLinecap="round" fill="none" />
        )}

        {/* === GREEN EUCALYPTUS LEAF IN MOUTH === */}
        {activePose !== 'sad' && activePose !== 'celebrating' && (
          <motion.g
            animate={{ rotate: [-4, 6, -4] }}
            transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '88px', originY: '95px' }}
          >
            <path
              d="M87 95 C96 89, 113 89, 118 100 C110 107, 95 105, 87 95 Z"
              fill="#00E676"
              stroke="#121E26"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path d="M90 96 L111 99" stroke="#008C4A" strokeWidth="2" strokeLinecap="round" />
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
}
