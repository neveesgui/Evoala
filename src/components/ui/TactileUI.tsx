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
    'bg-[#58CC02] text-[#0D161A] border-b-[#46A302] hover:bg-[#61DA06] active:border-b-0 active:translate-y-[3px]',
  mint:
    'bg-[#00CD9C] text-[#0D161A] border-b-[#00A67E] hover:bg-[#10DFAD] active:border-b-0 active:translate-y-[3px]',
  blue:
    'bg-[#1CB0F6] text-[#0D161A] border-b-[#1899D6] hover:bg-[#32BCFF] active:border-b-0 active:translate-y-[3px]',
  gold:
    'bg-[#FFC800] text-[#131F24] border-b-[#E5A400] hover:bg-[#FFD324] active:border-b-0 active:translate-y-[3px]',
  coral:
    'bg-[#FF4B4B] text-white border-b-[#EA2B2B] hover:bg-[#FF6060] active:border-b-0 active:translate-y-[3px]',
  purple:
    'bg-[#CE82FF] text-[#131F24] border-b-[#A55EEA] hover:bg-[#D899FF] active:border-b-0 active:translate-y-[3px]',
  orange:
    'bg-[#FF9600] text-[#131F24] border-b-[#DF7B00] hover:bg-[#FFA524] active:border-b-0 active:translate-y-[3px]',
  white:
    'bg-[#1B2B34] text-[#F1F5F9] border-2 border-[#37464F] border-b-4 border-b-[#25333B] hover:bg-[#223540] active:border-b-2 active:translate-y-[2px]',
};

interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TactileVariant;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  silent?: boolean;
  children: React.ReactNode;
}

export function TactileButton({
  variant = 'green',
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
            ? 'bg-[#26353D] text-[#52656D] border-b-4 border-b-[#1D2A31] cursor-not-allowed'
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
 * Deep Duolingo Dark ambient backdrop for eye comfort and vivid color contrast.
 */
export function SkyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 bg-[#0D161A]">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[520px] h-[300px] rounded-full bg-[#00CD9C]/8 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#1CB0F6]/6 blur-3xl" />
    </div>
  );
}
