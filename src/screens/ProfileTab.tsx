import { useAppStore, getUserRank, RANK_THRESHOLDS } from '../store/useAppStore';

export function ProfileTab() {
  const { xp, completedLessons } = useAppStore();
  
  const currentRank = getUserRank(xp);
  const currentRankIndex = RANK_THRESHOLDS.findIndex(r => r.name === currentRank.name);
  const nextRank = RANK_THRESHOLDS[currentRankIndex + 1];
  
  const progressToNext = nextRank 
    ? ((xp - currentRank.minXp) / (nextRank.minXp - currentRank.minXp)) * 100 
    : 100;

  return (
    <div className="p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-1">Sua Jornada</p>
      <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-6">Perfil</h1>

      <div className="bg-slate-900 dark:bg-slate-900 border border-slate-800 rounded-3xl p-8 text-white mb-8 text-center relative overflow-hidden shadow-2xl">
        <div className={`absolute inset-0 opacity-20 ${currentRank.color.split(' ')[1]}`}></div>
        <div className="relative z-10">
          <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full flex items-center justify-center text-5xl mb-4 shadow-inner">🐨</div>
          <h2 className="text-2xl font-bold mb-1">Guilherme Neves</h2>
          
          <div className="flex justify-center items-center gap-2 mb-6">
            <span className={`px-3 py-1 rounded-lg font-black uppercase tracking-wider text-xs ${currentRank.color}`}>
              {currentRank.name}
            </span>
            <span className="text-slate-400 font-medium text-sm">{xp} XP</span>
          </div>

          {nextRank && (
            <div className="w-full max-w-xs mx-auto text-left">
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                <span>{currentRank.name}</span>
                <span>{nextRank.name} ({nextRank.minXp} XP)</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${currentRank.color.split(' ')[0].replace('text-', 'bg-')} transition-all duration-1000`} 
                  style={{ width: `${progressToNext}%` }} 
                />
              </div>
              <p className="text-xs text-center text-slate-500 mt-2">Faltam {nextRank.minXp - xp} XP para promoção</p>
            </div>
          )}
        </div>
      </div>

      <h3 className="font-bold text-slate-500 dark:text-slate-400 text-sm mb-4 uppercase tracking-wider">Estatísticas</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">Lições Concluídas</p>
          <p className="text-2xl font-black text-slate-800 dark:text-white">{completedLessons.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">Tempo Estimado</p>
          <p className="text-2xl font-black text-slate-800 dark:text-white">{completedLessons.length * 5} min</p>
        </div>
      </div>
    </div>
  );
}
