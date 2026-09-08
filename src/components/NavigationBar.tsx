import { BookOpen, Mic, Swords, BarChart2, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NavigationBar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  const tabs = [
    { id: 'trail', icon: BookOpen, label: 'Trilha' },
    { id: 'simulator', icon: Mic, label: 'Voz AI' },
    { id: 'duets', icon: Swords, label: 'Duetos' },
    { id: 'league', icon: BarChart2, label: 'Ligas' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="w-full shrink-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-t border-slate-200 dark:border-slate-800/80 pb-safe z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
      <div className="flex justify-around items-center p-2 relative">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`relative flex flex-col items-center p-2 min-w-[64px] z-10 ${isActive ? 'text-sky-500' : 'text-slate-400 dark:text-slate-500'}`}
            >
              {isActive && (
                <motion.div 
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-sky-500/10 dark:bg-sky-500/20 rounded-2xl -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <motion.div animate={{ y: isActive ? -4 : 0 }} transition={{ type: "spring", stiffness: 300 }}>
                <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              <span className="text-[10px] mt-1 font-bold tracking-wide">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
