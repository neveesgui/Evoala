import { Compass, User, Trophy, Mic, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NavigationBar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  const tabs = [
    { id: 'trail', icon: Compass, label: 'Trilha' },
    { id: 'duets', icon: Shield, label: 'Duetos' },
    { id: 'simulator', icon: Mic, label: 'Simular' },
    { id: 'league', icon: Trophy, label: 'Liga' },
    { id: 'profile', icon: User, label: 'Perfil' }
  ];

  return (
    <div className="absolute bottom-6 left-0 right-0 px-6 z-40 pointer-events-none">
      <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 rounded-[28px] p-2 flex justify-between items-center shadow-2xl shadow-sky-900/10 pointer-events-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex-1 flex flex-col items-center justify-center py-2.5 outline-none -webkit-tap-highlight-color-transparent group"
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-pill"
                  className="absolute inset-0 bg-sky-500/15 rounded-3xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              
              <motion.div 
                whileTap={{ scale: 0.85 }}
                className="relative z-10 flex flex-col items-center gap-1"
              >
                <Icon 
                  size={22} 
                  className={`transition-colors duration-300 ${isActive ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-400'}`} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={`text-[9px] font-bold tracking-wide transition-colors duration-300 ${isActive ? 'text-sky-400' : 'text-slate-500'}`}>
                  {tab.label}
                </span>
              </motion.div>
            </button>
          );
        })}
      </div>
    </div>
  );
}