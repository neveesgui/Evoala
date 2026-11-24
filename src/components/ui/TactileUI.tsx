import React from 'react';
import { motion } from 'framer-motion';
import { soundFX } from '../../utils/soundEffects';

export type TactileVariant = 'green' | 'blue' | 'gold' | 'coral' | 'purple' | 'white' | 'orange';

const VARIANT_STYLES: Record<TactileVariant, string> = {
  green:
    'bg-[#43B02A] text-white border-[#1A1D20] shadow-[0px_4px_0px_#1A1D20] hover:bg-[#49BD2E] active:shadow-[0px_1px_0px_#1A1D20]',
  blue:
    'bg-[#29B6F6] text-white border-[#1A1D20] shadow-[0px_4px_0px_#1A1D20] hover:bg-[#38C0FD] active:shadow-[0px_1px_0px_#1A1D20]',
  gold:
    'bg-[#FFC107] text-[#1A1D20] border-[#1A1D20] shadow-[0px_4px_0px_#1A1D20] hover:bg-[#FFCA28] active:shadow-[0px_1px_0px_#1A1D20]',
  coral:
    'bg-[#FF5252] text-white border-[#1A1D20] shadow-[0px_4px_0px_#1A1D20] hover:bg-[#FF6464] active:shadow-[0px_1px_0px_#1A1D20]',
  purple:
    'bg-[#7C4DFF] text-white border-[#1A1D20] shadow-[0px_4px_0px_#1A1D20] hover:bg-[#8C61FF] active:shadow-[0px_1px_0px_#1A1D20]',
  orange:
    'bg-[#FF6D00] text-white border-[#1A1D20] shadow-[0px_4px_0px_#1A1D20] hover:bg-[#FF7F1F] active:shadow-[0px_1px_0px_#1A1D20]',
  white:
    'bg-white text-[#1A1D20] border-[#1A1D20] shadow-[0px_4px_0px_#1A1D20] hover:bg-slate-50 active:shadow-[0px_1px_0px_#1A1D20]',
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
    md: 'px-5 py-3.5 text-sm rounded-2xl',
    lg: 'px-6 py-4 text-base rounded-2xl',
  }[size];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !silent) {
      soundFX.playTap();
    }
    onClick?.(e);
  };

  return (
    <motion.button
      whileTap={disabled ? undefined : { y: 3 }}
      transition={{ type: 'spring', stiffness: 600, damping: 28 }}
      disabled={disabled}
      onClick={handleClick}
      className={`
        inline-flex items-center justify-center gap-2 font-display font-bold tracking-wide
        border-[2.5px] select-none cursor-pointer transition-colors
        ${sizeStyles}
        ${fullWidth ? 'w-full' : ''}
        ${
          disabled
            ? 'bg-[#E0E4E8] text-[#8C959F] border-[#B0B7C0] shadow-[0px_3px_0px_#B0B7C0] cursor-not-allowed'
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
 * Signature Evoala Sky Blue background with subtle floating translucent circles.
 */
export function SkyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 bg-gradient-to-b from-[#29B6F6] via-[#22ADEF] to-[#1CA3EC]">
      <div className="absolute -top-12 -left-10 w-44 h-44 rounded-full bg-white/15 animate-float-slow" />
      <div
        className="absolute top-32 -right-14 w-56 h-56 rounded-full bg-white/10 animate-float-slow"
        style={{ animationDelay: '1.5s' }}
      />
      <div
        className="absolute top-[52%] -left-16 w-48 h-48 rounded-full bg-white/10 animate-float-slow"
        style={{ animationDelay: '3s' }}
      />
      <div
        className="absolute bottom-24 right-4 w-28 h-28 rounded-full bg-white/12 animate-float-slow"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="absolute -bottom-16 left-1/3 w-64 h-64 rounded-full bg-white/10 animate-float-slow"
        style={{ animationDelay: '4s' }}
      />
    </div>
  );
}
