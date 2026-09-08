import { useAppStore, getUserRank } from '../store/useAppStore';
import { Trophy, ChevronUp, ChevronDown, Minus } from 'lucide-react';

export function LeagueTab() {
  const { xp } = useAppStore();

  // O banco de dados de competidores simulados
  const baseLeaderboard = [
    { id: '1', name: 'Gabriela L.', xp: 4950, current: false },
    { id: '2', name: 'Heitor P.', xp: 3600, current: false },
    { id: '3', name: 'Isabela N.', xp: 2550, current: false },
    { id: '4', name: 'Ana C.', xp: 1850, current: false },
    { id: '5', name: 'Carla S.', xp: 1200, current: false },
    { id: '6', name: 'Felipe M.', xp: 750, current: false },
    { id: '7', name: 'Lucas R.', xp: 300, current: false },
    { id: '8', name: 'Mariana T.', xp: 150, current: false },
    { id: '9', name: 'João V.', xp: 50, current: false },
    { id: 'user', name: 'Você', xp: xp, current: true }, // Seu XP real injetado
  ];

  // Ordenação automática do maior para o menor XP
  const leaderboard = baseLeaderboard
    .sort((a, b) => b.xp - a.xp)
    .map((user, index) => {
      let trend: 'up' | 'down' | 'same' = 'same';
      if (index % 3 === 0) trend = 'up';
      else if (index % 2 === 0) trend = 'down';
      return { ...user, rank: index + 1, trend };
    });

  const currentUserData = leaderboard.find(u => u.current);
  const userRankPosition = currentUserData?.rank || 0;
  const userElo = getUserRank(xp);

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-1">
        <Trophy size={16} className="text-sky-500" />
        <p className="text-xs font-bold uppercase tracking-widest text-sky-500">Temporada 1</p>
      </div>
      <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-8">Ligas & Ranking</h1>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white mb-8 shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-purple-500/20 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl filter drop-shadow-md">🐨</span>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Sua posição</h2>
              <p className="text-sm text-slate-400 font-medium">{xp} XP Acumulado</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
              #{userRankPosition}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {leaderboard.map((user, index) => {
          const rowElo = getUserRank(user.xp);
          const EloIcon = rowElo.icon;
          
          let zoneClass = "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50";
          let zoneIndicator = null;

          if (index < 3) {
            zoneClass = "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/5";
            zoneIndicator = <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-2xl shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>;
          } else if (index >= leaderboard.length - 3) {
            zoneClass = "border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/5";
            zoneIndicator = <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-l-2xl"></div>;
          }

          if (user.current) {
            zoneClass = "border-sky-500 bg-sky-500/10 shadow-[0_0_15px_rgba(14,165,233,0.15)] ring-1 ring-sky-500/50 animate-pulse-slow";
          }

          return (
            <div key={user.id} className={`relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${zoneClass}`}>
              {zoneIndicator}
              
              <div className="flex items-center gap-4 pl-2">
                <span className={`font-black w-6 text-center text-lg ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-orange-400' : 'text-slate-500'}`}>
                  {user.rank}
                </span>
                
                <div className="flex flex-col items-center justify-center w-6">
                  {user.trend === 'up' && <ChevronUp size={16} className="text-emerald-500" strokeWidth={3} />}
                  {user.trend === 'down' && <ChevronDown size={16} className="text-rose-500" strokeWidth={3} />}
                  {user.trend === 'same' && <Minus size={16} className="text-slate-500" strokeWidth={3} />}
                </div>

                <div>
                  <span className={`font-bold block text-[15px] ${user.current ? 'text-sky-600 dark:text-sky-400' : 'text-slate-700 dark:text-slate-200'}`}>
                    {user.name}
                  </span>
                  <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${rowElo.color.split(' ')[0]}`}>
                    <EloIcon size={10} /> {rowElo.name}
                  </div>
                </div>
              </div>

              <div className="text-right pr-2">
                <span className="font-black text-slate-700 dark:text-slate-300">{user.xp}</span>
                <span className="text-xs text-slate-500 font-bold ml-1">XP</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
