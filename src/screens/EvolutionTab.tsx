import { motion } from 'framer-motion';
import { Star, TrendingUp, Award, BrainCircuit } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { TactileCard } from '../components/ui/TactileUI';

export function EvolutionTab() {
  const { weeklyXp, metrics, gatekeeperHistory, completedLessons } = useAppStore();

  const maxWeeklyXp = Math.max(350, ...weeklyXp.map((w) => w.xp));
  const avgScore = Math.round(
    (metrics.clarity +
      metrics.empathy +
      metrics.control +
      metrics.leadership +
      metrics.negotiation) /
      5
  );

  const radarAxes = [
    { label: 'Clareza', value: metrics.clarity, color: '#1CB0F6' },
    { label: 'Empatia', value: metrics.empathy, color: '#FF5E9C' },
    { label: 'Controle', value: metrics.control, color: '#00CD9C' },
    { label: 'Liderança', value: metrics.leadership, color: '#FFC800' },
    { label: 'Negociação', value: metrics.negotiation, color: '#CE82FF' },
  ];

  const cx = 110;
  const cy = 105;
  const maxR = 68;

  const getPoint = (index: number, percent: number) => {
    const angle = (Math.PI * 2 * index) / radarAxes.length - Math.PI / 2;
    const r = (percent / 100) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const polygonPoints = radarAxes
    .map((axis, idx) => {
      const p = getPoint(idx, axis.value);
      return `${p.x},${p.y}`;
    })
    .join(' ');

  return (
    <div className="px-4 pt-5 pb-10 space-y-5">
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-[#00CD9C] mb-0.5">
            <TrendingUp size={12} /> Painel Comportamental
          </span>
          <h1 className="font-display text-2xl font-black text-white">Sua Evolução</h1>
        </div>

        <div className="bg-[#1B2B34] border border-[#2E3F49] rounded-2xl px-3.5 py-2 text-center">
          <span className="block text-[9px] font-bold uppercase text-slate-400">Prontidão</span>
          <span className="font-display text-xl font-black text-[#00CD9C]">{avgScore}%</span>
        </div>
      </div>

      {/* 6-Week Vertical Bar Chart */}
      <TactileCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-base font-extrabold text-white">
              Ritmo das Últimas 6 Semanas
            </h2>
            <p className="text-[11px] font-medium text-slate-400">
              XP acumulado em trilhas e simulações
            </p>
          </div>
          <span className="text-[11px] font-extrabold text-[#00CD9C] bg-[#00CD9C]/15 px-2.5 py-0.5 rounded-full">
            {completedLessons.length} lições
          </span>
        </div>

        <div className="flex items-end justify-between gap-2.5 h-44 pt-8 px-1">
          {weeklyXp.map((point, idx) => {
            const heightPct = Math.max(16, Math.round((point.xp / maxWeeklyXp) * 100));
            return (
              <div
                key={point.label}
                className="flex-1 flex flex-col items-center h-full justify-end"
              >
                <div className="relative w-full flex flex-col items-center justify-end flex-1">
                  {point.isCurrent && (
                    <motion.div
                      animate={{ y: [0, -5, 0], rotate: [-6, 6, -6] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                      className="mb-1"
                    >
                      <Star size={19} fill="#FFC800" stroke="#E5A400" strokeWidth={1.8} />
                    </motion.div>
                  )}

                  <span className="text-[10px] font-bold text-slate-400 mb-1">{point.xp}</span>

                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ duration: 0.65, delay: idx * 0.08, ease: 'easeOut' }}
                    className={`w-full max-w-[34px] rounded-t-xl ${
                      point.isCurrent ? 'bg-[#00CD9C]' : 'bg-[#1CB0F6]/85'
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-bold mt-2 ${
                    point.isCurrent ? 'text-[#00CD9C]' : 'text-slate-400'
                  }`}
                >
                  {point.label}
                </span>
              </div>
            );
          })}
        </div>
      </TactileCard>

      {/* Behavioral Radar Chart */}
      <TactileCard className="p-5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="font-display text-base font-extrabold text-white">
              Radar de Soft Skills
            </h2>
            <p className="text-[11px] font-medium text-slate-400">
              Indicadores quantitativos de maturidade profissional
            </p>
          </div>
          <Award size={20} className="text-[#CE82FF]" />
        </div>

        <div className="flex justify-center my-2">
          <svg
            viewBox="-28 -12 276 234"
            className="w-full max-w-[260px] h-auto overflow-visible"
          >
            {[25, 50, 75, 100].map((level) => (
              <polygon
                key={level}
                points={radarAxes
                  .map((_, idx) => {
                    const p = getPoint(idx, level);
                    return `${p.x},${p.y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="#2E3F49"
                strokeWidth="1.2"
              />
            ))}

            {radarAxes.map((axis, idx) => {
              const outer = getPoint(idx, 100);
              const labelPos = getPoint(idx, 126);
              return (
                <g key={axis.label}>
                  <line x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="#2E3F49" strokeWidth="1.2" />
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-slate-300 text-[10px] font-bold"
                  >
                    {axis.label}
                  </text>
                </g>
              );
            })}

            <motion.polygon
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              points={polygonPoints}
              fill="#00CD9C"
              fillOpacity="0.22"
              stroke="#00CD9C"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {radarAxes.map((axis, idx) => {
              const p = getPoint(idx, axis.value);
              return (
                <circle
                  key={`dot-${axis.label}`}
                  cx={p.x}
                  cy={p.y}
                  r="4.5"
                  fill={axis.color}
                  stroke="#131F24"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          {radarAxes.map((axis) => (
            <div
              key={axis.label}
              className="flex items-center justify-between bg-[#131F24] rounded-xl px-3 py-2"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: axis.color }} />
                <span className="text-xs font-semibold text-slate-300">{axis.label}</span>
              </div>
              <span className="font-display text-xs font-extrabold text-white">
                {axis.value}%
              </span>
            </div>
          ))}
        </div>
      </TactileCard>

      {/* Recent Gatekeeper Simulations */}
      <TactileCard className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <BrainCircuit size={18} className="text-[#CE82FF]" />
          <h2 className="font-display text-base font-extrabold text-white">
            Histórico do Gatekeeper IA
          </h2>
        </div>

        {gatekeeperHistory.length === 0 ? (
          <p className="text-xs font-medium text-slate-400 bg-[#131F24] rounded-2xl p-4 text-center">
            Nenhuma simulação concluída ainda. Teste um cenário na aba Gatekeeper para registrar sua
            telemetria!
          </p>
        ) : (
          <div className="space-y-2">
            {gatekeeperHistory.slice(0, 4).map((rec) => (
              <div
                key={rec.id}
                className="flex items-center justify-between bg-[#131F24] rounded-2xl p-3"
              >
                <div className="min-w-0 pr-2">
                  <p className="font-display text-xs font-extrabold text-white truncate">
                    {rec.scenarioTitle}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                    Clareza {rec.clarity}% • Empatia {rec.empathy}% • Controle {rec.control}%
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Star size={14} fill="#FFC800" stroke="#E5A400" strokeWidth={1.8} />
                  <span className="font-display text-xs font-extrabold text-[#FFC800]">
                    {rec.stars}/5
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </TactileCard>
    </div>
  );
}
