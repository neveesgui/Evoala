import { motion } from 'framer-motion';
import { Trophy, ArrowUp, ArrowDown, Crown, Sparkles } from 'lucide-react';
import { useAppStore, getUserRank, RANK_THRESHOLDS } from '../store/useAppStore';
import { TactileCard } from '../components/ui/TactileUI';

const MOCK_COMPETITORS = [
  { id: 'c1', name: 'Gabriela L.', initials: 'GL', avatarBg: '#7C4DFF', xp: 2650 },
  { id: 'c2', name: 'Heitor P.', initials: 'HP', avatarBg: '#FF6D00', xp: 1920 },
  { id: 'c3', name: 'Isabela N.', initials: 'IN', avatarBg: '#43B02A', xp: 1410 },
  { id: 'c4', name: 'Ana C.', initials: 'AC', avatarBg: '#29B6F6', xp: 980 },
  { id: 'c5', name: 'Felipe M.', initials: 'FM', avatarBg: '#FFC107', xp: 640 },
  { id: 'c6', name: 'Lucas R.', initials: 'LR', avatarBg: '#FF5252', xp: 390 },
  { id: 'c7', name: 'Mariana T.', initials: 'MT', avatarBg: '#00897B', xp: 210 },
  { id: 'c8', name: 'João V.', initials: 'JV', avatarBg: '#607D8B', xp: 90 },
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
      avatarBg: '#FFC107',
      xp,
      isUser: true,
    },
  ].sort((a, b) => b.xp - a.xp);

  const userPosition = leaderboard.findIndex((u) => u.isUser) + 1;

  return (
    <div className="px-4 pt-5 pb-10">
      {/* League Hero Banner */}
      <div className="bg-[#FFC107] border-[2.5px] border-[#1A1D20] shadow-[0px_5px_0px_#1A1D20] rounded-3xl p-4 mb-5 text-[#1A1D20]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1 bg-white border-2 border-[#1A1D20] px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase mb-1.5">
              <Trophy size={11} className="text-[#D39E00]" /> RANKING SEMANAL
            </span>
            <h1 className="font-display text-2xl font-bold leading-tight">
              Liga {currentRank.name}
            </h1>
            <p className="text-xs font-bold text-[#1A1D20]/80 mt-0.5">
              Top 3 sobem de Elo no domingo!
            </p>
          </div>
          <div className="bg-white border-[2.5px] border-[#1A1D20] shadow-[0px_3px_0px_#1A1D20] rounded-2xl px-3.5 py-2 text-center shrink-0">
            <span className="block text-[10px] font-extrabold uppercase text-slate-400">Posição</span>
            <span className="font-display text-2xl font-bold text-[#1A1D20]">#{userPosition}</span>
          </div>
        </div>

        {/* Elo Ladder Mini Strip */}
        <div className="flex items-center gap-1.5 mt-4 overflow-x-auto no-scrollbar pb-1">
          {RANK_THRESHOLDS.map((elo) => {
            const EloIcon = elo.icon;
            const isActive = elo.name === currentRank.name;
            return (
              <div
                key={elo.name}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border-2 text-[10px] font-extrabold shrink-0 ${
                  isActive
                    ? 'bg-[#1A1D20] text-[#FFC107] border-[#1A1D20]'
                    : 'bg-white/80 text-[#1A1D20]/70 border-[#1A1D20]/40'
                }`}
              >
                <EloIcon size={12} />
                {elo.name}
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard List */}
      <TactileCard className="p-3 space-y-2">
        {leaderboard.map((entry, idx) => {
          const rankNum = idx + 1;
          const isPromotion = rankNum <= 3;
          const isDemotion = rankNum > leaderboard.length - 2;
          const entryElo = getUserRank(entry.xp);

          return (
            <div key={entry.id}>
              {rankNum === 1 && (
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#2D7A1C] px-2 pb-1.5">
                  <ArrowUp size={13} strokeWidth={3} /> Zona de Promoção (Top 3)
                </div>
              )}

              {rankNum === 4 && (
                <div className="flex items-center gap-2 my-2 px-2">
                  <div className="h-[2px] flex-1 bg-slate-200" />
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">
                    Zona de Manutenção
                  </span>
                  <div className="h-[2px] flex-1 bg-slate-200" />
                </div>
              )}

              {rankNum === leaderboard.length - 1 && (
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#C62828] px-2 pt-2 pb-1">
                  <ArrowDown size={13} strokeWidth={3} /> Zona de Rebaixamento
                </div>
              )}

              <motion.div
                layout
                className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                  entry.isUser
                    ? 'bg-[#E1F5FE] border-[#1A1D20] shadow-[0px_3px_0px_#1A1D20]'
                    : isPromotion
                      ? 'bg-[#F1FBF0] border-[#43B02A]/40'
                      : isDemotion
                        ? 'bg-[#FFF5F5] border-[#FF5252]/35'
                        : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-display text-sm font-bold shrink-0 ${
                      rankNum === 1
                        ? 'bg-[#FFC107] border-2 border-[#1A1D20] text-[#1A1D20]'
                        : rankNum === 2
                          ? 'bg-[#E0E4E8] border-2 border-[#1A1D20] text-[#1A1D20]'
                          : rankNum === 3
                            ? 'bg-[#FFCC80] border-2 border-[#1A1D20] text-[#1A1D20]'
                            : 'text-slate-500'
                    }`}
                  >
                    {rankNum === 1 ? <Crown size={14} /> : rankNum}
                  </div>

                  <div
                    className="w-9 h-9 rounded-full border-2 border-[#1A1D20] flex items-center justify-center font-display text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: entry.avatarBg }}
                  >
                    {entry.initials}
                  </div>

                  <div className="min-w-0">
                    <p className="font-display text-sm font-bold text-[#1A1D20] truncate">
                      {entry.name} {entry.isUser && '(Você)'}
                    </p>
                    <span className="text-[10px] font-extrabold uppercase text-slate-500">
                      Elo {entryElo.name}
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 bg-white border-2 border-[#1A1D20] px-2.5 py-1 rounded-xl shrink-0">
                  <Sparkles size={12} className="text-[#D39E00]" />
                  <span className="font-display text-xs font-bold text-[#1A1D20]">
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
