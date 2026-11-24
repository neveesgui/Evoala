import React from 'react';
import { motion } from 'framer-motion';
import { soundFX } from '../../utils/soundEffects';

export type TactileVariant = 'green' | 'blue' | 'gold' | 'coral' | 'purple' | 'white' | 'orange';

/**
 * Modern Duolingo 3D Tactile Button Styles:
 * Same-hue darker 4px bottom ledge (no heavy black outlines) + Apple crispness.
 */
const VARIANT_STYLES: Record<TactileVariant, string> = {
  green:
    'bg-[#58CC02] text-white border-b-[#46A302] hover:bg-[#61DA06] active:border-b-0 active:translate-y-[3px]',
  blue:
    'bg-[#1CB0F6] text-white border-b-[#1899D6] hover:bg-[#2BC0FF] active:border-b-0 active:translate-y-[3px]',
  gold:
    'bg-[#FFC800] text-[#5C3D00] border-b-[#E5A400] hover:bg-[#FFD21E] active:border-b-0 active:translate-y-[3px]',
  coral:
    'bg-[#FF4B4B] text-white border-b-[#EA2B2B] hover:bg-[#FF5E5E] active:border-b-0 active:translate-y-[3px]',
  purple:
    'bg-[#7C4DFF] text-white border-b-[#5E35D6] hover:bg-[#8B61FF] active:border-b-0 active:translate-y-[3px]',
  orange:
    'bg-[#FF9600] text-white border-b-[#DF7B00] hover:bg-[#FFA31F] active:border-b-0 active:translate-y-[3px]',
  white:
    'bg-white text-[#3C3C3C] border-2 border-[#E5E7EB] border-b-4 border-b-[#D5D9DF] hover:bg-[#F9FAFB] active:border-b-2 active:translate-y-[2px]',
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
        inline-flex items-center justify-center gap-2 font-display font-extrabold tracking-wide uppercase
        select-none cursor-pointer transition-all
        ${variant === 'white' ? '' : 'border-b-4'}
        ${sizeStyles}
        ${fullWidth ? 'w-full' : ''}
        ${
          disabled
            ? 'bg-[#E5E7EB] text-[#AFAFAF] border-b-4 border-b-[#D1D5DB] cursor-not-allowed'
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
 * Clean Apple-minimalist ambient backdrop with subtle sky-blue radial aura.
 */
export function SkyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 bg-[#F4F6F9]">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[540px] h-[340px] rounded-full bg-gradient-to-b from-[#1CB0F6]/12 via-[#58CC02]/6 to-transparent blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#7C4DFF]/6 blur-3xl" />
    </div>
  );
}
