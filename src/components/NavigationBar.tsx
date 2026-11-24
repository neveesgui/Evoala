import { Map, BrainCircuit, Trophy, BarChart3, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { soundFX } from '../utils/soundEffects';

export type AppTabId = 'trail' | 'gatekeeper' | 'league' | 'evolution' | 'profile';

interface NavigationBarProps {
  activeTab: AppTabId;
  setActiveTab: (tab: AppTabId) => void;
}

const TABS: { id: AppTabId; label: string; icon: typeof Map; activeColor: string }[] = [
  { id: 'trail', label: 'Trilha', icon: Map, activeColor: '#43B02A' },
  { id: 'gatekeeper', label: 'Gatekeeper', icon: BrainCircuit, activeColor: '#7C4DFF' },
  { id: 'league', label: 'Ligas', icon: Trophy, activeColor: '#D39E00' },
  { id: 'evolution', label: 'Evolução', icon: BarChart3, activeColor: '#29B6F6' },
  { id: 'profile', label: 'Perfil', icon: User, activeColor: '#FF6D00' },
];

export default function NavigationBar({ activeTab, setActiveTab }: NavigationBarProps) {
  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 bg-white border-t-[2.5px] border-[#1A1D20] px-2 pt-2 pb-2 pb-safe">
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
                  layoutId="evoala-nav-pill"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  className="absolute inset-0 bg-[#E1F5FE] border-2 border-[#1A1D20] shadow-[0px_2px_0px_#1A1D20] rounded-2xl"
                />
              )}

              <motion.div
                whileTap={{ scale: 0.86 }}
                className="relative z-10 flex flex-col items-center gap-0.5"
              >
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.6 : 2.1}
                  style={{ color: isActive ? tab.activeColor : '#64748B' }}
                />
                <span
                  className={`text-[10px] font-extrabold tracking-tight ${
                    isActive ? 'text-[#1A1D20]' : 'text-slate-500'
                  }`}
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
