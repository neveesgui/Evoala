import { motion } from 'framer-motion';
import { Trophy, ArrowUp, ArrowDown, Crown, Sparkles } from 'lucide-react';
import { useAppStore, getUserRank, RANK_THRESHOLDS } from '../store/useAppStore';
import { TactileCard } from '../components/ui/TactileUI';

const MOCK_COMPETITORS = [
  { id: 'c1', name: 'Gabriela L.', initials: 'GL', avatarBg: '#CE82FF', xp: 2650 },
  { id: 'c2', name: 'Heitor P.', initials: 'HP', avatarBg: '#FF9600', xp: 1920 },
  { id: 'c3', name: 'Isabela N.', initials: 'IN', avatarBg: '#00CD9C', xp: 1410 },
  { id: 'c4', name: 'Ana C.', initials: 'AC', avatarBg: '#1CB0F6', xp: 980 },
  { id: 'c5', name: 'Felipe M.', initials: 'FM', avatarBg: '#FFC800', xp: 640 },
  { id: 'c6', name: 'Lucas R.', initials: 'LR', avatarBg: '#FF5E9C', xp: 390 },
  { id: 'c7', name: 'Mariana T.', initials: 'MT', avatarBg: '#14B8A6', xp: 210 },
  { id: 'c8', name: 'João V.', initials: 'JV', avatarBg: '#64748B', xp: 90 },
];

export function LeagueTab() {
  const { xp, userName } = useAppStore();
  const currentRank = getUserRank(xp);

  const leaderboard = [
    ...MOCK_COMPETITORS.map((c) => ({ ...c, isUser: false })),
    {
      id: 'current-user',
      name: userName || 'Você',
      initials: (userName || 'VC').slice(0, 2).toUpperCase(),
      avatarBg: '#1CB0F6',
      xp,
      isUser: true,
    },
  ].sort((a, b) => b.xp - a.xp);

  const userPosition = leaderboard.findIndex((u) => u.isUser) + 1;

  return (
    <div className="px-4 pt-5 pb-10">
      <TactileCard className="p-5 mb-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1 bg-[#FFC800]/15 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase text-[#FFC800] mb-1.5">
              <Trophy size={11} /> Ranking Semanal
            </span>
            <h1 className="font-display text-2xl font-black text-white leading-tight">
              Liga {currentRank.name}
            </h1>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Top 3 avançam de Elo no domingo
            </p>
          </div>
          <div className="bg-[#131F24] border border-[#2E3F49] rounded-2xl px-3.5 py-2 text-center shrink-0">
            <span className="block text-[10px] font-bold uppercase text-slate-400">Posição</span>
            <span className="font-display text-2xl font-black text-[#FFC800]">#{userPosition}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-4 overflow-x-auto no-scrollbar pb-0.5">
          {RANK_THRESHOLDS.map((elo) => {
            const EloIcon = elo.icon;
            const isActive = elo.name === currentRank.name;
            return (
              <div
                key={elo.name}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold shrink-0 ${
                  isActive
                    ? 'bg-[#FFC800] text-[#131F24]'
                    : 'bg-[#131F24] text-slate-400'
                }`}
              >
                <EloIcon size={12} />
                {elo.name}
              </div>
            );
          })}
        </div>
      </TactileCard>

      <TactileCard className="p-3 space-y-1.5">
        {leaderboard.map((entry, idx) => {
          const rankNum = idx + 1;
          const isPromotion = rankNum <= 3;
          const isDemotion = rankNum > leaderboard.length - 2;
          const entryElo = getUserRank(entry.xp);

          return (
            <div key={entry.id}>
              {rankNum === 1 && (
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#00CD9C] px-2.5 pb-1.5">
                  <ArrowUp size={13} strokeWidth={2.8} /> Zona de Promoção (Top 3)
                </div>
              )}

              {rankNum === 4 && (
                <div className="flex items-center gap-2 my-2 px-2">
                  <div className="h-px flex-1 bg-[#2A3942]" />
                  <span className="text-[10px] font-bold uppercase text-slate-500">
                    Zona de Manutenção
                  </span>
                  <div className="h-px flex-1 bg-[#2A3942]" />
                </div>
              )}

              {rankNum === leaderboard.length - 1 && (
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#FF5E5E] px-2.5 pt-2 pb-1">
                  <ArrowDown size={13} strokeWidth={2.8} /> Zona de Rebaixamento
                </div>
              )}

              <motion.div
                layout
                className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                  entry.isUser
                    ? 'bg-[#1CB0F6]/15 ring-2 ring-[#1CB0F6]'
                    : isPromotion
                      ? 'bg-[#00CD9C]/8'
                      : isDemotion
                        ? 'bg-[#FF4B4B]/8'
                        : 'hover:bg-[#223540]/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-display text-xs font-black shrink-0 ${
                      rankNum === 1
                        ? 'bg-[#FFC800] text-[#131F24]'
                        : rankNum === 2
                          ? 'bg-slate-300 text-[#131F24]'
                          : rankNum === 3
                            ? 'bg-[#FF9600] text-[#131F24]'
                            : 'text-slate-400'
                    }`}
                  >
                    {rankNum === 1 ? <Crown size={14} /> : rankNum}
                  </div>

                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-display text-xs font-black text-[#131F24] shrink-0"
                    style={{ backgroundColor: entry.avatarBg }}
                  >
                    {entry.initials}
                  </div>

                  <div className="min-w-0">
                    <p className="font-display text-sm font-extrabold text-white truncate">
                      {entry.name} {entry.isUser && '(Você)'}
                    </p>
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Elo {entryElo.name}
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 bg-[#131F24] border border-[#2E3F49] px-2.5 py-1 rounded-full shrink-0">
                  <Sparkles size={11} className="text-[#FFC800]" />
                  <span className="font-display text-xs font-extrabold text-[#FFC800]">
                    {entry.xp} XP
                  </span>
                </div>
              </motion.div>
            </div>
          );
        })}
      </TactileCard>
    </div>
  );
}
