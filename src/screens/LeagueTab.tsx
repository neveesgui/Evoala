import { motion } from 'framer-motion';
import { Trophy, ArrowUp, ArrowDown, Crown, Sparkles } from 'lucide-react';
import { useAppStore, getUserRank, RANK_THRESHOLDS } from '../store/useAppStore';
import { TactileCard } from '../components/ui/TactileUI';

const MOCK_COMPETITORS = [
  { id: 'c1', name: 'Gabriela L.', initials: 'GL', avatarBg: '#7C4DFF', xp: 2650 },
  { id: 'c2', name: 'Heitor P.', initials: 'HP', avatarBg: '#FF9600', xp: 1920 },
  { id: 'c3', name: 'Isabela N.', initials: 'IN', avatarBg: '#58CC02', xp: 1410 },
  { id: 'c4', name: 'Ana C.', initials: 'AC', avatarBg: '#1CB0F6', xp: 980 },
  { id: 'c5', name: 'Felipe M.', initials: 'FM', avatarBg: '#FFC800', xp: 640 },
  { id: 'c6', name: 'Lucas R.', initials: 'LR', avatarBg: '#FF4B4B', xp: 390 },
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
      {/* Clean Premium League Card */}
      <TactileCard className="p-5 mb-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1 bg-[#FFF8DC] px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase text-[#B8860B] mb-1.5">
              <Trophy size={11} /> Ranking Semanal
            </span>
            <h1 className="font-display text-2xl font-black text-slate-800 leading-tight">
              Liga {currentRank.name}
            </h1>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Top 3 avançam de Elo no domingo
            </p>
          </div>
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl px-3.5 py-2 text-center shrink-0">
            <span className="block text-[10px] font-bold uppercase text-slate-400">Posição</span>
            <span className="font-display text-2xl font-black text-slate-800">#{userPosition}</span>
          </div>
        </div>

        {/* Elo Ladder */}
        <div className="flex items-center gap-1.5 mt-4 overflow-x-auto no-scrollbar pb-0.5">
          {RANK_THRESHOLDS.map((elo) => {
            const EloIcon = elo.icon;
            const isActive = elo.name === currentRank.name;
            return (
              <div
                key={elo.name}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold shrink-0 transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-[#FFC800]'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <EloIcon size={12} />
                {elo.name}
              </div>
            );
          })}
        </div>
      </TactileCard>

      {/* Leaderboard List */}
      <TactileCard className="p-3 space-y-1.5">
        {leaderboard.map((entry, idx) => {
          const rankNum = idx + 1;
          const isPromotion = rankNum <= 3;
          const isDemotion = rankNum > leaderboard.length - 2;
          const entryElo = getUserRank(entry.xp);

          return (
            <div key={entry.id}>
              {rankNum === 1 && (
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#46A302] px-2.5 pb-1.5">
                  <ArrowUp size={13} strokeWidth={2.8} /> Zona de Promoção (Top 3)
                </div>
              )}

              {rankNum === 4 && (
                <div className="flex items-center gap-2 my-2 px-2">
                  <div className="h-px flex-1 bg-slate-100" />
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    Zona de Manutenção
                  </span>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
              )}

              {rankNum === leaderboard.length - 1 && (
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#EA2B2B] px-2.5 pt-2 pb-1">
                  <ArrowDown size={13} strokeWidth={2.8} /> Zona de Rebaixamento
                </div>
              )}

              <motion.div
                layout
                className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                  entry.isUser
                    ? 'bg-[#E0F5FF] ring-2 ring-[#1CB0F6]'
                    : isPromotion
                      ? 'bg-[#F6FDF2]'
                      : isDemotion
                        ? 'bg-[#FFF5F5]'
                        : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-display text-xs font-black shrink-0 ${
                      rankNum === 1
                        ? 'bg-[#FFC800] text-[#5C3D00]'
                        : rankNum === 2
                          ? 'bg-slate-200 text-slate-700'
                          : rankNum === 3
                            ? 'bg-[#FDBA74] text-[#7C2D12]'
                            : 'text-slate-400'
                    }`}
                  >
                    {rankNum === 1 ? <Crown size={14} /> : rankNum}
                  </div>

                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-display text-xs font-extrabold text-white shrink-0"
                    style={{ backgroundColor: entry.avatarBg }}
                  >
                    {entry.initials}
                  </div>

                  <div className="min-w-0">
                    <p className="font-display text-sm font-extrabold text-slate-800 truncate">
                      {entry.name} {entry.isUser && '(Você)'}
                    </p>
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Elo {entryElo.name}
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-full shrink-0">
                  <Sparkles size={11} className="text-[#E5A400]" />
                  <span className="font-display text-xs font-extrabold text-slate-700">
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
