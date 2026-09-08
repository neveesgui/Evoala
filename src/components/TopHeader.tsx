import { useAppStore, getUserRank } from '../store/useAppStore';
import { Flame, Leaf, Moon, Sun } from 'lucide-react';

export default function TopHeader() {
  const { xp, streak, leaves, isDarkMode, toggleDarkMode } = useAppStore();
  const currentRank = getUserRank(xp);
  const RankIcon = currentRank.icon;

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800/80 p-4 flex justify-between items-center transition-colors duration-300">
      <div className="flex items-center gap-2">
        <span className="text-2xl drop-shadow-sm">🐨</span>
        <span className="font-black tracking-tight text-xl dark:text-white">Evo<span className="text-sky-500">ala</span></span>
      </div>
      
      <div className="flex items-center gap-3">
        <button onClick={toggleDarkMode} className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 active:scale-95">
          {isDarkMode ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
        </button>
        <div className="flex items-center bg-slate-100 dark:bg-slate-900 px-3 py-2 rounded-full gap-3 text-sm font-bold shadow-inner border border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center text-orange-500 gap-1"><Flame size={16} fill="currentColor" /> {streak}</div>
          <div className="flex items-center text-emerald-500 gap-1"><Leaf size={16} fill="currentColor" /> {leaves}</div>
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md border ${currentRank.color}`}>
            <RankIcon size={12} strokeWidth={3} /> {currentRank.name}
          </div>
        </div>
      </div>
    </header>
  );
}
