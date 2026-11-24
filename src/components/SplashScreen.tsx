import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CoalaMascot } from './CoalaMascot';
import { SkyBackground } from './ui/TactileUI';

interface SplashScreenProps {
  onFinish: () => void;
}

/**
 * Fast, Apple Liquid Glass Splash / Flash Screen displayed on initial app open (~1.7s).
 */
export default function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 1750);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 bg-[#07111A] flex flex-col items-center justify-center p-6 overflow-hidden select-none"
    >
      <SkyBackground />

      <div className="relative z-10 flex flex-col items-center">
        {/* Luminous Liquid Glass Logo Medallion */}
        <motion.div
          initial={{ scale: 0.65, opacity: 0, y: 14 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative mb-6"
        >
          <motion.div
            animate={{ scale: [1, 1.16, 1], opacity: [0.45, 0.22, 0.45] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-[-14px] rounded-full bg-gradient-to-tr from-[#29B6F6]/35 to-[#00E676]/35 blur-2xl"
          />
          <div className="relative w-36 h-36 rounded-[36px] liquid-glass flex items-center justify-center">
            <CoalaMascot pose="waving" size={118} />
          </div>
        </motion.div>

        {/* EVOALA Brand Wordmark */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.4 }}
          className="font-display text-5xl font-black tracking-wider text-white mb-1.5 drop-shadow-[0_4px_20px_rgba(41,182,246,0.3)]"
        >
          EVO<span className="text-[#10E8A2]">ALA</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.34, duration: 0.4 }}
          className="text-xs font-extrabold uppercase tracking-[0.22em] text-sky-200/75 mb-8"
        >
          Desperte o seu potencial
        </motion.p>

        {/* Sleek Liquid Progress Bar */}
        <div className="w-40 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="h-full rounded-full bg-gradient-to-r from-[#29B6F6] to-[#00E676]"
          />
        </div>
      </div>
    </motion.div>
  );
}
