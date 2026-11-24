import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CoalaFaceLogo } from './CoalaMascot';

interface SplashScreenProps {
  onFinish: () => void;
}

/**
 * Signature Evoala Blue (#29B6F6) Splash Screen inspired by Duolingo's iconic
 * full-color minimalist splash: Koala face centered on vibrant Evoala Blue,
 * with crisp white EVOALA wordmark anchored cleanly at the bottom.
 */
export default function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 1650);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.32, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 bg-[#29B6F6] flex flex-col items-center justify-between pt-safe pb-safe px-6 py-12 overflow-hidden select-none"
    >
      {/* Top spacer to keep face perfectly centered */}
      <div className="h-10" />

      {/* Centered Responsive Koala Face Emblem (Face + Eyes + Leaf) */}
      <div className="flex-1 flex items-center justify-center w-full">
        <CoalaFaceLogo size={172} />
      </div>

      {/* Bottom Anchored Brand Wordmark (Duolingo Splash Layout) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.38 }}
        className="flex flex-col items-center pb-4"
      >
        <h1 className="font-display text-[42px] sm:text-5xl font-black tracking-wide text-white leading-none drop-shadow-[0_3px_0_rgba(12,115,176,0.28)]">
          EVOALA
        </h1>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-white/90 mt-2">
          Desperte o seu potencial
        </p>
      </motion.div>
    </motion.div>
  );
}
