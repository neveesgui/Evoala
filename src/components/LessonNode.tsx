import { motion } from 'framer-motion';
import { Lock, Star, RefreshCw } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

interface LessonNodeProps {
  lessonId: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  isPreviewOpen: boolean;
  showRefreshIcon?: boolean;
  /** 0..1 progress value displayed on the concentric active ring */
  ringProgress?: number;
  onClick: () => void;
}

const RING_RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS; // ~282.74

/**
 * Clean Duolingo Flat-3D Stepping Stone Node:
 * Static vibrant solid colors, crisp diagonal gloss stripes on the button face,
 * solid 3D cylinder base ledge, and concentric static SVG ring (zero glass blur or neon glow).
 */
export function LessonNode({
  isCompleted,
  isCurrent,
  isLocked,
  isPreviewOpen,
  showRefreshIcon = false,
  ringProgress = 0.38,
  onClick,
}: LessonNodeProps) {
  const clampedProgress = Math.max(0.22, Math.min(1, ringProgress));
  const dashOffset = CIRCUMFERENCE * (1 - clampedProgress);

  const handlePress = () => {
    if (isLocked) {
      soundFX.playWrong();
      return;
    }
    soundFX.playTap();
    onClick();
  };

  return (
    <div className="relative w-[104px] h-[104px] flex items-center justify-center shrink-0">
      {/* Clean Solid "COMEÇAR" Bubble (Zero Collision, Zero Glass Blur) */}
      {isCurrent && !isPreviewOpen && (
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 z-30 bg-[#1B2B34] border-2 border-[#37464F] px-3.5 py-1.5 rounded-xl whitespace-nowrap pointer-events-none"
        >
          <span className="font-display text-xs font-black tracking-wider text-[#1CB0F6]">
            COMEÇAR
          </span>
          <div className="w-2.5 h-2.5 bg-[#1B2B34] border-r-2 border-b-2 border-[#37464F] rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-[6px]" />
        </motion.div>
      )}

      {/* Concentric Static SVG Progress Ring (Strictly Centered at 52,52, Solid Colors) */}
      {isCurrent && (
        <svg
          viewBox="0 0 104 104"
          className="absolute inset-0 w-full h-full pointer-events-none -rotate-90"
        >
          {/* Solid dark slate track */}
          <circle
            cx="52"
            cy="52"
            r={RING_RADIUS}
            fill="none"
            stroke="#26363F"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Solid vibrant Evoala Blue progress arc */}
          <circle
            cx="52"
            cy="52"
            r={RING_RADIUS}
            fill="none"
            stroke="#1CB0F6"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
          />
        </svg>
      )}

      {/* Centered Solid 3D Cylinder Button (74x74) with Crisp Diagonal Gloss Stripes */}
      <motion.button
        whileTap={isLocked ? { x: [-3, 3, -2, 0] } : { y: 4 }}
        transition={{ type: 'spring', stiffness: 520, damping: 28 }}
        onClick={handlePress}
        style={
          isCompleted
            ? {
                backgroundColor: '#FFC800',
                boxShadow: '0 7px 0 #CC9600',
              }
            : isCurrent
              ? {
                  backgroundColor: '#1CB0F6',
                  boxShadow: '0 7px 0 #1484B8',
                }
              : {
                  backgroundColor: '#37464F',
                  boxShadow: '0 6px 0 #26333B',
                }
        }
        className={`relative z-10 w-[74px] h-[74px] rounded-full flex items-center justify-center overflow-hidden cursor-pointer transition-transform ${
          isLocked ? 'cursor-not-allowed' : ''
        }`}
      >
        {/* Crisp Duolingo-Style Diagonal Gloss Stripes (Matching Reference!) */}
        {!isLocked && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
            <div
              className="absolute -top-4 left-2 w-4 h-28 rotate-[35deg]"
              style={{
                backgroundColor: isCompleted ? 'rgba(255, 240, 120, 0.55)' : 'rgba(255, 255, 255, 0.22)',
              }}
            />
            <div
              className="absolute -top-4 left-9 w-2 h-28 rotate-[35deg]"
              style={{
                backgroundColor: isCompleted ? 'rgba(255, 240, 120, 0.45)' : 'rgba(255, 255, 255, 0.18)',
              }}
            />
          </div>
        )}

        {/* Icon */}
        <div className="relative z-10 flex items-center justify-center">
          {isCompleted ? (
            <Star size={32} fill="#B86E00" stroke="#B86E00" strokeWidth={1.6} />
          ) : isCurrent ? (
            showRefreshIcon ? (
              <RefreshCw size={28} strokeWidth={3.2} className="text-white" />
            ) : (
              <Star size={32} fill="#FFFFFF" stroke="#FFFFFF" strokeWidth={1.6} />
            )
          ) : (
            <Lock size={24} strokeWidth={2.5} className="text-[#52656D]" />
          )}
        </div>
      </motion.button>
    </div>
  );
}
