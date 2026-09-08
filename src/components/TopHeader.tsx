import { Flame, Leaf } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function TopHeader() {
  const { streak, leaves } = useAppStore();

  return (
    <header className="px-6 py-4 flex items-center justify-between z-30 bg-slate-950/60 backdrop-blur-xl border-b border-slate-800/40 sticky top-0">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl flex items-center justify-center text-sm shadow-inner shadow-white/5">
          🐨
        </div>
        <span className="font-black tracking-tight text-white text-lg">Evo<span className="text-sky-500">ala</span></span>
      </div>
      
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800/60 px-3 py-1.5 rounded-full shadow-sm">
          <Flame size={14} className="text-orange-500" strokeWidth={2.5} />
          <span className="text-xs font-bold text-slate-200">{streak}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800/60 px-3 py-1.5 rounded-full shadow-sm">
          <Leaf size={14} className="text-emerald-500" strokeWidth={2.5} />
          <span className="text-xs font-bold text-slate-200">{leaves}</span>
        </div>
      </div>
    </header>
  );
}