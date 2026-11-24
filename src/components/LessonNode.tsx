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
 * Geometrically concentric LessonNode (104x104 container, 74x74 button, static -90deg SVG ring).
 * Zero rotation on the SVG ring prevents any eccentric wobble or label overlap.
 */
export function LessonNode({
  lessonId,
  isCompleted,
  isCurrent,
  isLocked,
  isPreviewOpen,
  showRefreshIcon = false,
  ringProgress = 0.38,
  onClick,
}: LessonNodeProps) {
  const gradientId = `evoalaLiquidRing-${lessonId}`;
  const clampedProgress = Math.max(0.18, Math.min(1, ringProgress));
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
      {/* Liquid Glass Floating "COMEÇAR" Bubble (Zero Collision) */}
      {isCurrent && !isPreviewOpen && (
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 z-30 liquid-glass px-4 py-1.5 rounded-2xl whitespace-nowrap pointer-events-none"
        >
          <span className="font-display text-xs font-black tracking-wider text-[#38C6FF] drop-shadow-[0_0_8px_rgba(41,182,246,0.65)]">
            COMEÇAR
          </span>
          {/* Downward Glass Pointer */}
          <div className="w-2.5 h-2.5 bg-[#122633] border-r border-b border-white/25 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-[5.5px]" />
        </motion.div>
      )}

      {/* Soft Symmetric Pulsing Ambient Halo for Active Node (Evoala Blue) */}
      {isCurrent && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none animate-pulse"
          style={{
            background:
              'radial-gradient(circle, rgba(41,182,246,0.32) 0%, rgba(41,182,246,0.12) 55%, transparent 72%)',
          }}
        />
      )}

      {/* Concentric SVG Progress Ring (Strictly Static, Centered at 52,52) */}
      {isCurrent && (
        <svg
          viewBox="0 0 104 104"
          className="absolute inset-0 w-full h-full pointer-events-none -rotate-90"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7DD6FF" />
              <stop offset="100%" stopColor="#29B6F6" />
            </linearGradient>
          </defs>
          {/* Static base track */}
          <circle
            cx="52"
            cy="52"
            r={RING_RADIUS}
            fill="none"
            stroke="rgba(255, 255, 255, 0.14)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Luminous gradient progress arc */}
          <circle
            cx="52"
            cy="52"
            r={RING_RADIUS}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className="drop-shadow-[0_0_8px_rgba(41,182,246,0.65)] transition-all duration-500"
          />
        </svg>
      )}

      {/* Centered Circular Tactile Button (74x74) */}
      <motion.button
        whileTap={isLocked ? { x: [-3, 3, -2, 0] } : { scale: 0.94, y: 2 }}
        transition={{ type: 'spring', stiffness: 520, damping: 28 }}
        onClick={handlePress}
        style={
          isCompleted
            ? {
                background: 'linear-gradient(180deg, #FFD54F 0%, #FFB300 100%)',
                boxShadow:
                  '0 6px 0 #B27B00, inset 0 2px 2px rgba(255,255,255,0.65), 0 10px 22px rgba(255,179,0,0.32)',
              }
            : isCurrent
              ? {
                  background: 'linear-gradient(180deg, #38C6FF 0%, #1CA3EC 100%)',
                  boxShadow:
                    '0 6px 0 #1279B5, inset 0 2px 2px rgba(255,255,255,0.68), 0 12px 28px rgba(41,182,246,0.48)',
                }
              : {
                  background: 'rgba(255, 255, 255, 0.07)',
                  boxShadow:
                    '0 5px 0 rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.18)',
                }
        }
        className={`relative z-10 w-[74px] h-[74px] rounded-full flex items-center justify-center cursor-pointer transition-transform ${
          isLocked
            ? 'backdrop-blur-md border border-white/15 cursor-not-allowed'
            : 'border border-white/30'
        }`}
      >
        {/* Apple Specular Half-Moon Gloss Highlight */}
        {!isLocked && (
          <div
            className="absolute top-1.5 left-3.5 right-3.5 h-3.5 rounded-full pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0.04) 100%)',
            }}
          />
        )}

        {isCompleted ? (
          <Star
            size={31}
            fill="#FFFFFF"
            stroke="#FFFFFF"
            strokeWidth={1.6}
            className="drop-shadow-[0_2px_4px_rgba(178,123,0,0.45)]"
          />
        ) : isCurrent ? (
          showRefreshIcon ? (
            <RefreshCw
              size={28}
              strokeWidth={3}
              className="text-white drop-shadow-[0_2px_4px_rgba(0,121,107,0.45)]"
            />
          ) : (
            <Star
              size={31}
              fill="#FFFFFF"
              stroke="#FFFFFF"
              strokeWidth={1.6}
              className="drop-shadow-[0_2px_4px_rgba(0,121,107,0.45)]"
            />
          )
        ) : (
          <Lock size={23} strokeWidth={2.4} className="text-white/35" />
        )}
      </motion.button>
    </div>
  );
}
