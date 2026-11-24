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

  // Radar Pentagon coordinates
  const radarAxes = [
    { label: 'Clareza', value: metrics.clarity, color: '#29B6F6' },
    { label: 'Empatia', value: metrics.empathy, color: '#FF5252' },
    { label: 'Controle', value: metrics.control, color: '#43B02A' },
    { label: 'Liderança', value: metrics.leadership, color: '#FFC107' },
    { label: 'Negociação', value: metrics.negotiation, color: '#7C4DFF' },
  ];

  const cx = 110;
  const cy = 105;
  const maxR = 68;

  const getPoint = (index: number, percent: number) => {
    const angle = (Math.PI * 2 * index) / radarAxes.length - Math.PI / 2;
    const r = (percent / 100) * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const polygonPoints = radarAxes
    .map((axis, idx) => {
      const p = getPoint(idx, axis.value);
      return `${p.x},${p.y}`;
    })
    .join(' ');

  return (
    <div className="px-4 pt-5 pb-10 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1 bg-white border-2 border-[#1A1D20] px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase text-[#1A1D20] mb-1">
            <TrendingUp size={11} className="text-[#43B02A]" /> PAINEL COMPORTAMENTAL
          </span>
          <h1 className="font-display text-2xl font-bold text-white text-cartoon-outline">
            Sua Evolução
          </h1>
        </div>

        <div className="bg-white border-[2.5px] border-[#1A1D20] shadow-[0px_4px_0px_#1A1D20] rounded-2xl px-3.5 py-2 text-center">
          <span className="block text-[9px] font-extrabold uppercase text-slate-400">Prontidão</span>
          <span className="font-display text-xl font-bold text-[#43B02A]">{avgScore}%</span>
        </div>
      </div>

      {/* 6-Week Vertical Bar Chart (Blue bars + Green current week with Golden Star) */}
      <TactileCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-base font-bold text-[#1A1D20]">
              Ritmo das Últimas 6 Semanas
            </h2>
            <p className="text-[11px] font-semibold text-slate-500">
              XP acumulado em trilhas e simulações
            </p>
          </div>
          <span className="text-[11px] font-extrabold text-[#43B02A] bg-[#E8F5E9] border border-[#1A1D20] px-2 py-0.5 rounded-lg">
            {completedLessons.length} lições
          </span>
        </div>

        <div className="flex items-end justify-between gap-2.5 h-44 pt-8 px-1">
          {weeklyXp.map((point, idx) => {
            const heightPct = Math.max(16, Math.round((point.xp / maxWeeklyXp) * 100));
            return (
              <div key={point.label} className="flex-1 flex flex-col items-center h-full justify-end">
                <div className="relative w-full flex flex-col items-center justify-end flex-1">
                  {/* Golden Star floating on top of current week */}
                  {point.isCurrent && (
                    <motion.div
                      animate={{ y: [0, -5, 0], rotate: [-6, 6, -6] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                      className="mb-1"
                    >
                      <Star size={20} fill="#FFC107" stroke="#1A1D20" strokeWidth={2.2} />
                    </motion.div>
                  )}

                  <span className="text-[10px] font-extrabold text-slate-500 mb-1">
                    {point.xp}
                  </span>

                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ duration: 0.65, delay: idx * 0.08, ease: 'easeOut' }}
                    className={`w-full max-w-[38px] rounded-t-xl border-2 border-[#1A1D20] ${
                      point.isCurrent ? 'bg-[#43B02A]' : 'bg-[#29B6F6]'
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-extrabold mt-2 ${
                    point.isCurrent ? 'text-[#2D7A1C]' : 'text-slate-500'
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
      <TactileCard className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="font-display text-base font-bold text-[#1A1D20]">
              Radar de Soft Skills
            </h2>
            <p className="text-[11px] font-semibold text-slate-500">
              Indicadores quantitativos de maturidade profissional
            </p>
          </div>
          <Award size={20} className="text-[#7C4DFF]" />
        </div>

        <div className="flex justify-center my-2">
          <svg width="220" height="210" viewBox="0 0 220 210" className="overflow-visible">
            {/* Concentric pentagon grid */}
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
                stroke="#CBD5E1"
                strokeWidth="1.5"
              />
            ))}

            {/* Axis lines & labels */}
            {radarAxes.map((axis, idx) => {
              const outer = getPoint(idx, 100);
              const labelPos = getPoint(idx, 126);
              return (
                <g key={axis.label}>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={outer.x}
                    y2={outer.y}
                    stroke="#CBD5E1"
                    strokeWidth="1.5"
                  />
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-[#1A1D20] text-[10px] font-extrabold"
                  >
                    {axis.label}
                  </text>
                </g>
              );
            })}

            {/* Data polygon */}
            <motion.polygon
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              points={polygonPoints}
              fill="#29B6F6"
              fillOpacity="0.32"
              stroke="#1A1D20"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {radarAxes.map((axis, idx) => {
              const p = getPoint(idx, axis.value);
              return (
                <circle
                  key={`dot-${axis.label}`}
                  cx={p.x}
                  cy={p.y}
                  r="4.5"
                  fill={axis.color}
                  stroke="#1A1D20"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>

        {/* Individual Metric Pills */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          {radarAxes.map((axis) => (
            <div
              key={axis.label}
              className="flex items-center justify-between bg-slate-50 border-2 border-[#1A1D20] rounded-xl px-3 py-2"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-[#1A1D20]"
                  style={{ backgroundColor: axis.color }}
                />
                <span className="text-xs font-bold text-[#1A1D20]">{axis.label}</span>
              </div>
              <span className="font-display text-xs font-bold text-[#1A1D20]">{axis.value}%</span>
            </div>
          ))}
        </div>
      </TactileCard>

      {/* Recent Gatekeeper Simulations */}
      <TactileCard className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <BrainCircuit size={18} className="text-[#7C4DFF]" />
          <h2 className="font-display text-base font-bold text-[#1A1D20]">
            Histórico do Gatekeeper IA
          </h2>
        </div>

        {gatekeeperHistory.length === 0 ? (
          <p className="text-xs font-semibold text-slate-500 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center">
            Nenhuma simulação concluída ainda. Teste um cenário na aba Gatekeeper para registrar sua
            telemetria!
          </p>
        ) : (
          <div className="space-y-2.5">
            {gatekeeperHistory.slice(0, 4).map((rec) => (
              <div
                key={rec.id}
                className="flex items-center justify-between bg-slate-50 border-2 border-[#1A1D20] rounded-2xl p-3"
              >
                <div className="min-w-0 pr-2">
                  <p className="font-display text-xs font-bold text-[#1A1D20] truncate">
                    {rec.scenarioTitle}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 mt-0.5">
                    Clareza {rec.clarity}% • Empatia {rec.empathy}% • Controle {rec.control}%
                  </p>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <Star size={14} fill="#FFC107" stroke="#1A1D20" strokeWidth={2} />
                  <span className="font-display text-xs font-bold text-[#1A1D20]">
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
