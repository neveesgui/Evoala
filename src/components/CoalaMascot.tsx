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
 * Faithful flat-vector recreation with fluffy scalloped white-rimmed ears,
 * pearl-white head, large glossy black nose with curved highlight, rosy cheeks,
 * vibrant green eucalyptus leaf, warm grey body with big white oval belly,
 * cute jumping legs & paw pads — animated across 9 reactive poses.
 */
export function CoalaMascot({ pose, mood, size = 110, className = '' }: CoalaMascotProps) {
  const activePose = resolvePose(pose, mood);

  const bodyBounce =
    activePose === 'celebrating'
      ? { y: [0, -12, 0], rotate: [-3, 3, -3] }
      : activePose === 'sad'
        ? { y: [0, 3, 0] }
        : activePose === 'waving' || activePose === 'encouraging' || activePose === 'thumbsUp'
          ? { y: [0, -6, 0], rotate: [-1.5, 1.5, -1.5] }
          : { y: [0, -3.5, 0] };

  const bodyTransition =
    activePose === 'celebrating'
      ? { duration: 0.72, repeat: Infinity, ease: 'easeInOut' as const }
      : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const };

  return (
    <motion.div
      animate={bodyBounce}
      transition={bodyTransition}
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
    >
      <svg
        viewBox="0 0 200 210"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible drop-shadow-[0_10px_18px_rgba(0,0,0,0.32)]"
      >
        <defs>
          <linearGradient id="evoalaLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#65D632" />
            <stop offset="100%" stopColor="#3AA31F" />
          </linearGradient>
        </defs>

        {/* Soft ground shadow */}
        <ellipse cx="98" cy="199" rx="38" ry="6" fill="#000000" opacity="0.22" />

        {/* === POSE-SPECIFIC ACCENT FX === */}
        {(activePose === 'waving' || activePose === 'celebrating' || activePose === 'thumbsUp') && (
          <g>
            {/* Reference-style colorful joyful rays on right */}
            <motion.line
              x1="168"
              y1="100"
              x2="180"
              y2="92"
              stroke="#FFC800"
              strokeWidth="4.5"
              strokeLinecap="round"
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
            <motion.line
              x1="173"
              y1="112"
              x2="187"
              y2="110"
              stroke="#FFD54F"
              strokeWidth="4.5"
              strokeLinecap="round"
              animate={{ opacity: [1, 0.45, 1] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
            <motion.line
              x1="170"
              y1="124"
              x2="183"
              y2="128"
              stroke="#7DD6FF"
              strokeWidth="4.5"
              strokeLinecap="round"
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 1.1, delay: 0.2, repeat: Infinity }}
            />
            {/* Top golden sparkle */}
            <motion.path
              d="M158 24 L161 16 L164 24 L172 27 L164 30 L161 38 L158 30 L150 27 Z"
              fill="#FFD54F"
              animate={{ scale: [0.85, 1.2, 0.85] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ originX: '161px', originY: '27px' }}
            />
          </g>
        )}

        {activePose === 'encouraging' && (
          <g stroke="#29B6F6" strokeWidth="4" strokeLinecap="round">
            <motion.line
              x1="172"
              y1="96"
              x2="186"
              y2="88"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.line
              x1="176"
              y1="112"
              x2="190"
              y2="112"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.line
              x1="172"
              y1="128"
              x2="186"
              y2="135"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </g>
        )}

        {activePose === 'idea' && (
          <motion.g
            animate={{ y: [0, -4, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            style={{ originX: '166px', originY: '36px' }}
          >
            <circle cx="166" cy="34" r="18" fill="#29B6F6" opacity="0.24" />
            <path
              d="M166 22 C159 22, 155 27, 155 32.5 C155 36.5, 157.8 39, 160 41.5 L160 45 L172 45 L172 41.5 C174.2 39, 177 36.5, 177 32.5 C177 27, 173 22, 166 22 Z"
              fill="#29B6F6"
            />
            <rect x="161" y="46" width="10" height="4.5" rx="2" fill="#E2E8F0" />
            <circle cx="163" cy="30" r="2.6" fill="#FFFFFF" opacity="0.85" />
          </motion.g>
        )}

        {activePose === 'listening' && (
          <g stroke="#00E676" strokeWidth="3.5" strokeLinecap="round" fill="none">
            <motion.path
              d="M174 58 Q184 72 174 86"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
            <motion.path
              d="M183 50 Q195 72 183 94"
              animate={{ opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration: 1.1, delay: 0.2, repeat: Infinity }}
            />
          </g>
        )}

        {activePose === 'confused' && (
          <motion.text
            x="160"
            y="42"
            fill="#FFD54F"
            fontSize="28"
            fontWeight="900"
            fontFamily="Nunito, sans-serif"
            animate={{ y: [0, -5, 0], rotate: [-6, 6, -6] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            ?
          </motion.text>
        )}

        {/* === JUMPING / PLAYFUL CHUBBY LEGS === */}
        {/* Back/Right leg (slightly darker grey for depth) */}
        <path
          d="M108 156 C122 162, 129 175, 123 186 C118 194, 104 194, 98 184 C94 178, 94 166, 96 158 Z"
          fill="#7D858D"
        />
        {/* Front/Left jumping bent leg */}
        <path
          d="M66 146 C48 154, 42 172, 50 185 C56 194, 70 194, 78 184 C83 177, 83 166, 88 158 Z"
          fill="#8E969E"
        />

        {/* === BODY / TORSO (WARM GREY + BIG BRIGHT WHITE BELLY) === */}
        <path
          d="M62 110 C58 134, 58 162, 74 170 C90 178, 118 175, 126 162 C134 148, 130 120, 122 106 Z"
          fill="#8E969E"
        />
        {/* Large Bright Oval White Belly */}
        <ellipse
          cx="90"
          cy="141"
          rx="24"
          ry="27"
          transform="rotate(6 90 141)"
          fill="#F4F6F8"
        />

        {/* === ARMS WITH CUTE PAWS & DARK PAW PADS === */}
        {activePose === 'thinking' ? (
          <g>
            {/* Left arm relaxed */}
            <path
              d="M64 118 C46 124, 40 138, 48 146 C55 152, 66 144, 72 134 Z"
              fill="#8E969E"
            />
            {/* Right paw raised to chin */}
            <path
              d="M122 124 C132 112, 122 100, 108 104 C102 106, 104 116, 114 126 Z"
              fill="#8E969E"
            />
          </g>
        ) : activePose === 'sad' ? (
          <g>
            <path
              d="M64 118 C52 130, 50 146, 58 152 C65 156, 72 146, 74 132 Z"
              fill="#8E969E"
            />
            <path
              d="M122 118 C134 130, 134 146, 126 152 C119 156, 114 146, 112 132 Z"
              fill="#8E969E"
            />
          </g>
        ) : activePose === 'listening' ? (
          <g>
            <path
              d="M64 118 C46 122, 38 134, 46 142 C53 148, 66 140, 72 130 Z"
              fill="#8E969E"
            />
            {/* Right arm cupped behind ear */}
            <path
              d="M124 118 C144 108, 160 88, 154 74 C148 66, 138 76, 132 96 Z"
              fill="#8E969E"
            />
          </g>
        ) : activePose === 'idea' ? (
          <g>
            <path
              d="M64 118 C46 122, 38 134, 46 142 C53 148, 66 140, 72 130 Z"
              fill="#8E969E"
            />
            {/* Raised pointer arm */}
            <path
              d="M124 118 C142 104, 152 80, 144 70 C138 64, 130 76, 124 98 Z"
              fill="#8E969E"
            />
          </g>
        ) : (
          /* Default joyful outstretched waving/celebrating arms matching reference image! */
          <g>
            {/* Left arm raised joyfully */}
            <motion.g
              animate={activePose === 'waving' || activePose === 'celebrating' ? { rotate: [-6, 8, -6] } : undefined}
              transition={{ duration: 0.9, repeat: Infinity }}
              style={{ originX: '64px', originY: '116px' }}
            >
              <path
                d="M66 114 C48 106, 36 94, 32 82 C29 74, 38 68, 46 74 C52 78, 56 88, 72 98 Z"
                fill="#8E969E"
              />
              {/* Cute thumb & dark paw pad */}
              <ellipse cx="43" cy="84" rx="4.5" ry="6.5" transform="rotate(-24 43 84)" fill="#242B33" />
            </motion.g>

            {/* Right arm outstretched joyfully */}
            <motion.g
              animate={activePose === 'celebrating' ? { rotate: [6, -8, 6] } : { rotate: [0, -4, 0] }}
              transition={{ duration: 1.1, repeat: Infinity }}
              style={{ originX: '124px', originY: '118px' }}
            >
              <path
                d="M120 112 C138 108, 154 102, 162 108 C168 114, 164 126, 154 128 C142 130, 130 128, 118 128 Z"
                fill="#8E969E"
              />
              {/* Cute dark paw pad */}
              <ellipse cx="151" cy="117" rx="4.5" ry="7" transform="rotate(10 151 117)" fill="#242B33" />
            </motion.g>
          </g>
        )}

        {/* === BIG FLUFFY SCALLOPED EARS (EXACT REFERENCE SIGNATURE!) === */}
        {/* Left Fluffy Ear */}
        <motion.g
          animate={{ rotate: activePose === 'sad' ? [-8, -6, -8] : [-2.5, 2.5, -2.5] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          style={{ originX: '66px', originY: '60px' }}
        >
          {/* Fluffy white outer rim with soft scalloped fur tufts */}
          <path
            d="M72 34 C56 16, 34 18, 24 34 C16 42, 16 58, 22 68 C26 82, 42 90, 60 84 Z"
            fill="#F4F6F8"
          />
          {/* Fluffy fur scallop accents */}
          <path
            d="M46 21 C40 16, 33 18, 30 24 C22 25, 18 33, 22 40 C16 48, 18 58, 25 63"
            fill="#F4F6F8"
          />
          {/* Inner warm grey ear */}
          <ellipse cx="48" cy="54" rx="21" ry="24" transform="rotate(-14 48 54)" fill="#A3ABB3" />
          {/* Inner dark charcoal ear hollow */}
          <ellipse cx="52" cy="58" rx="13" ry="15" transform="rotate(-14 52 58)" fill="#4D565F" />
        </motion.g>

        {/* Right Fluffy Ear */}
        <motion.g
          animate={{ rotate: activePose === 'sad' ? [8, 6, 8] : [2.5, -2.5, 2.5] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          style={{ originX: '134px', originY: '68px' }}
        >
          {/* Fluffy white outer rim */}
          <path
            d="M128 44 C146 32, 168 38, 174 56 C180 68, 176 84, 166 94 C156 106, 138 108, 124 96 Z"
            fill="#F4F6F8"
          />
          {/* Inner warm grey ear */}
          <ellipse cx="148" cy="70" rx="21" ry="24" transform="rotate(18 148 70)" fill="#A3ABB3" />
          {/* Inner dark charcoal ear hollow */}
          <ellipse cx="142" cy="74" rx="13" ry="15" transform="rotate(18 142 74)" fill="#4D565F" />
        </motion.g>

        {/* === PEARL-WHITE ROUND KOALA HEAD === */}
        <ellipse
          cx="98"
          cy="74"
          rx="47"
          ry="43"
          transform="rotate(5 98 74)"
          fill="#EDF1F4"
        />
        {/* Subtle bottom-chin soft grey shading */}
        <path
          d="M56 88 C64 110, 108 122, 138 96 C126 116, 76 122, 56 88 Z"
          fill="#D7DFE5"
          opacity="0.7"
        />

        {/* Pastel Peach-Pink Blush Cheeks */}
        <ellipse cx="64" cy="79" rx="9" ry="5.5" transform="rotate(6 64 79)" fill="#F7B8C4" opacity="0.72" />
        <ellipse cx="122" cy="88" rx="9" ry="5.5" transform="rotate(6 122 88)" fill="#F7B8C4" opacity="0.72" />

        {/* === EYES PER POSE === */}
        {activePose === 'celebrating' ? (
          <g stroke="#1A2128" strokeWidth="4.2" strokeLinecap="round" fill="none">
            <path d="M64 67 Q71 58 78 68" />
            <path d="M111 74 Q118 65 125 75" />
          </g>
        ) : activePose === 'encouraging' || activePose === 'thumbsUp' ? (
          <g>
            <circle cx="71" cy="67" r="6.5" fill="#1A2128" />
            <circle cx="73.2" cy="64.8" r="2.3" fill="#FFFFFF" />
            <path
              d="M111 75 Q118 67 125 76"
              stroke="#1A2128"
              strokeWidth="4.2"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ) : activePose === 'sad' ? (
          <g>
            <circle cx="71" cy="68" r="6" fill="#1A2128" />
            <circle cx="73" cy="66" r="2" fill="#FFFFFF" />
            <circle cx="118" cy="75" r="6" fill="#1A2128" />
            <circle cx="120" cy="73" r="2" fill="#FFFFFF" />
            <path d="M63 59 Q70 55 77 58" stroke="#475569" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M126 67 Q119 63 112 65" stroke="#475569" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Blue tears */}
            <motion.path
              d="M66 78 C66 78, 70 86, 70 89 C70 91.5, 68.2 93, 66 93 C63.8 93, 62 91.5, 62 89 C62 86, 66 78, 66 78 Z"
              fill="#29B6F6"
              animate={{ y: [0, 5, 0], opacity: [0.95, 0.5, 0.95] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <motion.path
              d="M122 85 C122 85, 126 93, 126 96 C126 98.5, 124.2 100, 122 100 C119.8 100, 118 98.5, 118 96 C118 93, 122 85, 122 85 Z"
              fill="#29B6F6"
              animate={{ y: [0, 5, 0], opacity: [0.95, 0.5, 0.95] }}
              transition={{ duration: 1.2, delay: 0.3, repeat: Infinity }}
            />
          </g>
        ) : activePose === 'confused' ? (
          <g>
            <circle cx="71" cy="67" r="6.2" fill="#1A2128" />
            <circle cx="73" cy="65" r="2.2" fill="#FFFFFF" />
            <circle cx="118" cy="75" r="6.2" fill="#1A2128" />
            <circle cx="120" cy="73" r="2.2" fill="#FFFFFF" />
            <path d="M63 58 Q70 56 77 59" stroke="#1A2128" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M111 63 Q118 57 126 62" stroke="#1A2128" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
        ) : (
          /* Signature Wide-Set Glossy Friendly Eyes */
          <motion.g
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ duration: 4.2, times: [0, 0.88, 0.92, 0.96, 1], repeat: Infinity }}
            style={{ originY: '70px' }}
          >
            <circle cx="71" cy="67" r="6.5" fill="#1A2128" />
            <circle cx="73.2" cy="64.8" r="2.4" fill="#FFFFFF" />
            <circle cx="118" cy="75" r="6.5" fill="#1A2128" />
            <circle cx="120.2" cy="72.8" r="2.4" fill="#FFFFFF" />
          </motion.g>
        )}

        {/* === SIGNATURE BIG GLOSSY BLACK OVAL NOSE WITH CURVED HIGHLIGHT === */}
        <g transform="rotate(8 94 74)">
          <rect x="81" y="57" width="26" height="33" rx="13" fill="#1A2128" />
          {/* Crisp curved white specular shine */}
          <path
            d="M87 69 C87 63, 92 60.5, 97 61.5"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.88"
          />
        </g>

        {/* === EXPRESSIVE MOUTH === */}
        {activePose === 'sad' ? (
          <path
            d="M81 102 Q91 94 102 104"
            stroke="#1A2128"
            strokeWidth="3.6"
            strokeLinecap="round"
            fill="none"
          />
        ) : activePose === 'confused' ? (
          <path
            d="M81 98 Q86 95 92 99 Q97 102 103 98"
            stroke="#1A2128"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
        ) : activePose === 'thinking' ? (
          <path
            d="M83 98 Q93 102 102 97"
            stroke="#1A2128"
            strokeWidth="3.6"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          /* Signature Joyful Wide Open Smile + Coral Tongue */
          <g>
            <path
              d="M75 91 Q92 103 109 94 C106 108, 84 111, 75 91 Z"
              fill="#1A2128"
            />
            {/* Smile corner dimples */}
            <circle cx="75" cy="91" r="2.4" fill="#1A2128" />
            <circle cx="109" cy="94" r="2.4" fill="#1A2128" />
            {/* Cute coral tongue */}
            <ellipse cx="92" cy="102" rx="8" ry="4" transform="rotate(4 92 102)" fill="#EB5757" />
          </g>
        )}

        {/* === SIGNATURE GREEN EUCALYPTUS LEAF TUCKED AT MOUTH === */}
        {activePose !== 'sad' && (
          <motion.g
            animate={{ rotate: [-4, 5, -4] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '84px', originY: '104px' }}
          >
            <path
              d="M84 103 C82 117, 94 128, 108 128 C110 114, 98 103, 84 103 Z"
              fill="url(#evoalaLeafGrad)"
              stroke="#246B15"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path
              d="M87 107 L104 124"
              stroke="#246B15"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
}
