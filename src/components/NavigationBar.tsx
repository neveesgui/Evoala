import { Home, BrainCircuit, Trophy, BarChart3, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { soundFX } from '../utils/soundEffects';

export type AppTabId = 'trail' | 'gatekeeper' | 'league' | 'evolution' | 'profile';

interface NavigationBarProps {
  activeTab: AppTabId;
  setActiveTab: (tab: AppTabId) => void;
}

const TABS: { id: AppTabId; label: string; icon: typeof Home; color: string }[] = [
  { id: 'trail', label: 'Trilha', icon: Home, color: '#29B6F6' },
  { id: 'gatekeeper', label: 'Gatekeeper', icon: BrainCircuit, color: '#CE82FF' },
  { id: 'league', label: 'Ligas', icon: Trophy, color: '#FFD54F' },
  { id: 'evolution', label: 'Evolução', icon: BarChart3, color: '#38C6FF' },
  { id: 'profile', label: 'Perfil', icon: User, color: '#FF9600' },
];

export default function NavigationBar({ activeTab, setActiveTab }: NavigationBarProps) {
  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 backdrop-blur-2xl bg-slate-900/65 border-t border-white/15 px-2.5 pt-2 pb-2 pb-safe">
      <div className="flex items-center justify-between gap-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (!isActive) soundFX.playTap();
                setActiveTab(tab.id);
              }}
              className="relative flex-1 flex flex-col items-center justify-center py-1.5 rounded-2xl cursor-pointer outline-none select-none"
            >
              {isActive && (
                <motion.div
                  layoutId="evoala-liquid-dock-pill"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  className="absolute inset-0 bg-sky-400/20 border border-sky-300/40 shadow-[0_0_16px_rgba(41,182,246,0.35)] rounded-2xl"
                />
              )}

              <motion.div
                whileTap={{ scale: 0.86 }}
                className="relative z-10 flex flex-col items-center gap-0.5"
              >
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.5 : 2}
                  style={{ color: isActive ? tab.color : 'rgba(255,255,255,0.48)' }}
                />
                <span
                  className="text-[9.5px] sm:text-[10px] font-bold tracking-tight truncate max-w-full px-0.5"
                  style={{ color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.48)' }}
                >
                  {tab.label}
                </span>
              </motion.div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
