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
    'bg-[#10D998] text-[#071A14] border-b-[#00A676] hover:bg-[#1EE6A6] active:border-b-0 active:translate-y-[3px]',
  blue:
    'bg-[#1CB0F6] text-[#07161F] border-b-[#148AC2] hover:bg-[#31BCFF] active:border-b-0 active:translate-y-[3px]',
  gold:
    'bg-[#FFC800] text-[#1C1200] border-b-[#CC9A00] hover:bg-[#FFD324] active:border-b-0 active:translate-y-[3px]',
  coral:
    'bg-[#FF4B4B] text-white border-b-[#CC2929] hover:bg-[#FF6060] active:border-b-0 active:translate-y-[3px]',
  purple:
    'bg-[#CE82FF] text-[#131F24] border-b-[#A55EEA] hover:bg-[#D899FF] active:border-b-0 active:translate-y-[3px]',
  orange:
    'bg-[#FF9600] text-[#1C0F00] border-b-[#CC7600] hover:bg-[#FFA524] active:border-b-0 active:translate-y-[3px]',
  white:
    'bg-[#1B2B34] text-white border-2 border-[#2F424C] border-b-4 border-b-[#101A1F] hover:bg-[#223540] active:border-b-2 active:translate-y-[2px]',
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
            ? 'bg-[#23323A] text-[#52656D] border-b-4 border-b-[#1A262D] cursor-not-allowed'
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
 * Clean single solid color backdrop (#131F24) — zero aurora blobs or multi-tone gradients.
 */
export function SkyBackground() {
  return <div className="pointer-events-none fixed inset-0 z-0 bg-[#131F24]" />;
}
