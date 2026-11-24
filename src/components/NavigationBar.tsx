import { Home, BrainCircuit, Trophy, BarChart3, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { soundFX } from '../utils/soundEffects';

export type AppTabId = 'trail' | 'gatekeeper' | 'league' | 'evolution' | 'profile';

interface NavigationBarProps {
  activeTab: AppTabId;
  setActiveTab: (tab: AppTabId) => void;
}

const TABS: { id: AppTabId; label: string; icon: typeof Home; color: string }[] = [
  { id: 'trail', label: 'Trilha', icon: Home, color: '#FF9600' },
  { id: 'gatekeeper', label: 'Gatekeeper', icon: BrainCircuit, color: '#CE82FF' },
  { id: 'league', label: 'Ligas', icon: Trophy, color: '#FFC800' },
  { id: 'evolution', label: 'Evolução', icon: BarChart3, color: '#00CD9C' },
  { id: 'profile', label: 'Perfil', icon: User, color: '#1CB0F6' },
];

export default function NavigationBar({ activeTab, setActiveTab }: NavigationBarProps) {
  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 bg-[#131F24] border-t border-[#26353D] px-2.5 pt-2 pb-2 pb-safe">
      <div className="flex items-center justify-between gap-1.5">
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
                  layoutId="evoala-dark-nav-pill"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  className="absolute inset-0 bg-[#1CB0F6]/12 border-2 border-[#1CB0F6] rounded-2xl"
                />
              )}

              <motion.div
                whileTap={{ scale: 0.86 }}
                className="relative z-10 flex flex-col items-center gap-0.5"
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2.1}
                  style={{ color: isActive ? tab.color : '#6B7E88' }}
                />
                <span
                  className="text-[9.5px] sm:text-[10px] font-bold tracking-tight truncate max-w-full px-0.5"
                  style={{ color: isActive ? '#F1F5F9' : '#6B7E88' }}
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
