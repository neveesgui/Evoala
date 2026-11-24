import React from 'react';
import { motion } from 'framer-motion';
import { soundFX } from '../../utils/soundEffects';

export type TactileVariant =
  | 'green'
  | 'mint'
  | 'blue'
  | 'gold'
  | 'coral'
  | 'purple'
  | 'white'
  | 'orange';

const VARIANT_STYLES: Record<TactileVariant, string> = {
  green:
    'bg-gradient-to-b from-[#5EE000] to-[#4CC000] text-[#05120A] border-b-[#389400] shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.55),0_8px_20px_-4px_rgba(88,204,2,0.4)] active:border-b-0 active:translate-y-[3px]',
  mint:
    'bg-gradient-to-b from-[#16F0AB] to-[#00C49A] text-[#041A15] border-b-[#008C6E] shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.6),0_8px_22px_-4px_rgba(16,232,162,0.45)] active:border-b-0 active:translate-y-[3px]',
  blue:
    'bg-gradient-to-b from-[#38C6FF] to-[#1CA3EC] text-[#051520] border-b-[#1279B5] shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.6),0_8px_22px_-4px_rgba(41,182,246,0.45)] active:border-b-0 active:translate-y-[3px]',
  gold:
    'bg-gradient-to-b from-[#FFE066] to-[#FFB300] text-[#1C1200] border-b-[#B27B00] shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.65),0_8px_22px_-4px_rgba(255,193,7,0.4)] active:border-b-0 active:translate-y-[3px]',
  coral:
    'bg-gradient-to-b from-[#FF6666] to-[#EB3B3B] text-white border-b-[#B81D1D] shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.45),0_8px_22px_-4px_rgba(255,75,75,0.4)] active:border-b-0 active:translate-y-[3px]',
  purple:
    'bg-gradient-to-b from-[#D799FF] to-[#9B51E0] text-white border-b-[#6D28B8] shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.5),0_8px_22px_-4px_rgba(155,81,224,0.4)] active:border-b-0 active:translate-y-[3px]',
  orange:
    'bg-gradient-to-b from-[#FFB03A] to-[#FF8000] text-[#1C0F00] border-b-[#C45E00] shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.55),0_8px_22px_-4px_rgba(255,150,0,0.4)] active:border-b-0 active:translate-y-[3px]',
  white:
    'liquid-glass text-white border-b-[3px] border-b-white/25 hover:bg-white/15 active:border-b active:translate-y-[2px]',
};

interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TactileVariant;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  silent?: boolean;
  children: React.ReactNode;
}

export function TactileButton({
  variant = 'blue',
  size = 'md',
  fullWidth = false,
  silent = false,
  disabled,
  className = '',
  onClick,
  children,
  ...rest
}: TactileButtonProps) {
  const sizeStyles = {
    sm: 'px-3.5 py-2 text-xs rounded-xl',
    md: 'px-5 py-3 text-sm rounded-2xl',
    lg: 'px-6 py-3.5 text-[15px] rounded-2xl',
  }[size];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !silent) {
      soundFX.playTap();
    }
    onClick?.(e);
  };

  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 550, damping: 30 }}
      disabled={disabled}
      onClick={handleClick}
      className={`
        inline-flex items-center justify-center gap-2 font-display font-black tracking-wide uppercase
        select-none cursor-pointer transition-all
        ${variant === 'white' ? '' : 'border-b-4'}
        ${sizeStyles}
        ${fullWidth ? 'w-full' : ''}
        ${
          disabled
            ? 'bg-white/8 text-white/30 border-b-4 border-b-white/10 cursor-not-allowed shadow-none'
            : VARIANT_STYLES[variant]
        }
        ${className}
      `}
      {...(rest as Record<string, unknown>)}
    >
      {children}
    </motion.button>
  );
}

interface TactileCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export function TactileCard({
  children,
  className = '',
  interactive = false,
  onClick,
}: TactileCardProps) {
  return (
    <div
      onClick={onClick}
      className={`${interactive ? 'tactile-card-interactive cursor-pointer' : 'tactile-card'} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Apple Liquid Glass Aurora Mesh Background:
 * Deep midnight #07111A canvas with strategic Sky Blue, Emerald, and Indigo radial orbs
 * so translucent glass panels refract vivid ambient light.
 */
export function SkyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 bg-[#061320]">
      {/* Strong Signature Evoala Sky Blue top-center aura */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[620px] h-[440px] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(41,182,246,0.38) 0%, rgba(28,163,236,0.14) 52%, transparent 76%)',
        }}
      />
      {/* Evoala Blue mid-left refraction orb */}
      <div
        className="absolute top-[38%] -left-24 w-[400px] h-[400px] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(41,182,246,0.24) 0%, rgba(41,182,246,0.05) 60%, transparent 76%)',
        }}
      />
      {/* Deep Ocean Blue + Subtle Indigo bottom-right orb */}
      <div
        className="absolute bottom-[-80px] -right-20 w-[440px] h-[440px] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(2,136,209,0.28) 0%, rgba(99,102,241,0.1) 58%, transparent 76%)',
        }}
      />
    </div>
  );
}
