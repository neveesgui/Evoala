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

const POSE_SRC: Record<CoalaPose, string> = {
  waving: '/mascot/waving.png',
  celebrating: '/mascot/celebrating.png',
  thinking: '/mascot/thinking.png',
  sad: '/mascot/sad.png',
  encouraging: '/mascot/encouraging.png',
  confused: '/mascot/confused.png',
  listening: '/mascot/listening.png',
  idea: '/mascot/idea.png',
  thumbsUp: '/mascot/thumbsUp.png',
};

function resolvePose(pose?: CoalaPose, mood?: CoalaPose | CoalaLegacyMood): CoalaPose {
  if (pose) return pose;
  if (!mood || mood === 'happy') return 'waving';
  if (mood === 'pointing') return 'encouraging';
  if (mood === 'stressed') return 'sad';
  return mood;
}

/**
 * Official Evoala Koala Mascot using the exact 9-pose official artwork PNGs
 * with subtle Framer Motion motion physics (breathing / celebrating jump).
 */
export function CoalaMascot({ pose, mood, size = 110, className = '' }: CoalaMascotProps) {
  const activePose = resolvePose(pose, mood);

  const bodyMotion =
    activePose === 'celebrating'
      ? { y: [0, -8, 0], scale: [1, 1.03, 1] }
      : activePose === 'sad'
        ? { y: [0, 2, 0] }
        : { y: [0, -3, 0] };

  const bodyTransition =
    activePose === 'celebrating'
      ? { duration: 0.85, repeat: Infinity, ease: 'easeInOut' as const }
      : { duration: 3, repeat: Infinity, ease: 'easeInOut' as const };

  return (
    <motion.div
      animate={bodyMotion}
      transition={bodyTransition}
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
    >
      <img
        src={POSE_SRC[activePose]}
        alt={`Coala Evoala (${activePose})`}
        draggable={false}
        className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_6px_12px_rgba(0,0,0,0.3)]"
      />
    </motion.div>
  );
}

export { EvoalaLogo as CoalaFaceLogo } from './EvoalaLogo';
