import { Map, BrainCircuit, Trophy, BarChart3, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { soundFX } from '../utils/soundEffects';

export type AppTabId = 'trail' | 'gatekeeper' | 'league' | 'evolution' | 'profile';

interface NavigationBarProps {
  activeTab: AppTabId;
  setActiveTab: (tab: AppTabId) => void;
}

const TABS: { id: AppTabId; label: string; icon: typeof Map; activeColor: string; activeBg: string }[] = [
  { id: 'trail', label: 'Trilha', icon: Map, activeColor: '#58CC02', activeBg: '#EEFBE5' },
  { id: 'gatekeeper', label: 'Gatekeeper', icon: BrainCircuit, activeColor: '#6366F1', activeBg: '#EEF2FF' },
  { id: 'league', label: 'Ligas', icon: Trophy, activeColor: '#D99B00', activeBg: '#FFFBEB' },
  { id: 'evolution', label: 'Evolução', icon: BarChart3, activeColor: '#1CB0F6', activeBg: '#E0F5FF' },
  { id: 'profile', label: 'Perfil', icon: User, activeColor: '#FF9600', activeBg: '#FFF5E6' },
];

export default function NavigationBar({ activeTab, setActiveTab }: NavigationBarProps) {
  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 apple-glass border-t border-slate-200/80 px-2 pt-2 pb-2 pb-safe">
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
                  layoutId="evoala-apple-nav-pill"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  style={{ backgroundColor: tab.activeBg }}
                  className="absolute inset-0 rounded-2xl"
                />
              )}

              <motion.div
                whileTap={{ scale: 0.88 }}
                className="relative z-10 flex flex-col items-center gap-0.5"
              >
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.5 : 2}
                  style={{ color: isActive ? tab.activeColor : '#94A3B8' }}
                />
                <span
                  className="text-[10px] font-bold tracking-tight transition-colors"
                  style={{ color: isActive ? tab.activeColor : '#94A3B8' }}
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
