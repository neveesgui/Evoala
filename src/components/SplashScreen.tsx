import { useEffect } from 'react';
import { EvoalaLogo } from './EvoalaLogo';

interface SplashScreenProps {
  onFinish: () => void;
}

/**
 * 100% STATIC Institutional Splash / Flash Page on Solid Evoala Blue (#29B6F6).
 * Zero movement, bounce, blink, or rotation on the brand mark.
 */
export default function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 1500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-[#29B6F6] flex flex-col items-center justify-between pt-safe pb-safe px-6 py-12 overflow-hidden select-none">
      <div className="h-10" />

      <div className="flex-1 flex items-center justify-center w-full">
        <EvoalaLogo size={180} />
      </div>

      <div className="flex flex-col items-center pb-4 text-center">
        <h1 className="font-display text-[44px] sm:text-5xl font-black tracking-tight text-white leading-none">
          EVOALA
        </h1>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.26em] text-white mt-2">
          DESPERTE O SEU POTENCIAL
        </p>
      </div>
    </div>
  );
}
