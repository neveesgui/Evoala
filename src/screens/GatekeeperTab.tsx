import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  BrainCircuit,
  Send,
  Star,
  Sparkles,
  RotateCcw,
  ChevronLeft,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { GATEKEEPER_SCENARIOS, type GatekeeperScenario } from '../data/curriculum';
import {
  evaluateGatekeeperResponse,
  type GatekeeperEvaluation,
} from '../utils/gatekeeperEngine';
import { useAppStore } from '../store/useAppStore';
import { CoalaMascot } from '../components/CoalaMascot';
import { TactileButton, TactileCard } from '../components/ui/TactileUI';
import { soundFX } from '../utils/soundEffects';

export function GatekeeperTab() {
  const { recordGatekeeperSession } = useAppStore();
  const [activeScenario, setActiveScenario] = useState<GatekeeperScenario | null>(null);
  const [inputText, setInputText] = useState('');
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [evaluation, setEvaluation] = useState<GatekeeperEvaluation | null>(null);

  const startScenario = (scenario: GatekeeperScenario) => {
    soundFX.playTap();
    setActiveScenario(scenario);
    setInputText('');
    setSentMessage(null);
    setEvaluation(null);
    setIsAnalyzing(false);
  };

  const handleSubmit = (
    text: string,
    presetQuality?: 'master' | 'good' | 'reactive'
  ) => {
    if (!activeScenario || !text.trim() || isAnalyzing) return;
    soundFX.playSelect();
    setSentMessage(text.trim());
    setInputText('');
    setIsAnalyzing(true);

    setTimeout(() => {
      const result = evaluateGatekeeperResponse(activeScenario, text, presetQuality);
      setEvaluation(result);
      setIsAnalyzing(false);

      recordGatekeeperSession({
        scenarioId: activeScenario.id,
        scenarioTitle: activeScenario.title,
        clarity: result.clarity,
        empathy: result.empathy,
        control: result.control,
        stars: result.stars,
        xpEarned: result.xpEarned,
      });

      if (result.stars >= 4) {
        soundFX.playVictory();
        confetti({
          particleCount: 55,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#7C4DFF', '#43B02A', '#FFC107', '#29B6F6'],
        });
      } else {
        soundFX.playWrong();
      }
    }, 950);
  };

  // Scenario Hub View
  if (!activeScenario) {
    return (
      <div className="px-4 pt-5 pb-8">
        {/* Hero Card */}
        <div className="bg-[#7C4DFF] border-[2.5px] border-[#1A1D20] shadow-[0px_5px_0px_#1A1D20] rounded-3xl p-4 text-white mb-6 relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <CoalaMascot mood="thinking" size={84} className="shrink-0" />
            <div>
              <span className="inline-flex items-center gap-1 bg-white/20 border border-white/30 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <BrainCircuit size={11} /> MOTOR IA • ALTA PRESSÃO
              </span>
              <h1 className="font-display text-2xl font-bold leading-tight text-cartoon-shadow">
                Gatekeeper IA
              </h1>
              <p className="text-xs font-semibold text-white/90 mt-0.5 leading-snug">
                Treine respostas difíceis em tempo real com telemetria de Clareza, Empatia e Controle.
              </p>
            </div>
          </div>
        </div>

        <p className="font-display text-sm font-bold text-white text-cartoon-shadow mb-3 px-1">
          Escolha um cenário corporativo (+20 XP):
        </p>

        <div className="flex flex-col gap-3">
          {GATEKEEPER_SCENARIOS.map((scenario) => {
            const diffColor =
              scenario.difficulty === 'Extremo'
                ? 'bg-[#FFEBEE] text-[#C62828]'
                : scenario.difficulty === 'Alto'
                  ? 'bg-[#FFF3E0] text-[#E65100]'
                  : 'bg-[#E8F5E9] text-[#2D7A1C]';

            return (
              <motion.button
                key={scenario.id}
                whileTap={{ y: 2 }}
                onClick={() => startScenario(scenario)}
                className="tactile-card-interactive p-4 text-left w-full"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7C4DFF] bg-[#EDE7F6] border border-[#1A1D20] px-2 py-0.5 rounded-lg">
                    {scenario.channel} • {scenario.category}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-lg border border-[#1A1D20] ${diffColor}`}
                  >
                    {scenario.difficulty}
                  </span>
                </div>

                <h3 className="font-display text-base font-bold text-[#1A1D20] mb-1">
                  {scenario.title}
                </h3>
                <p className="text-xs font-medium text-slate-600 line-clamp-2 leading-relaxed">
                  {scenario.context}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Chat + Live Telemetry View
  return (
    <div className="px-4 pt-4 pb-8">
      {/* Back Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            soundFX.playTap();
            setActiveScenario(null);
          }}
          className="inline-flex items-center gap-1 bg-white border-2 border-[#1A1D20] shadow-[0px_3px_0px_#1A1D20] px-3 py-1.5 rounded-xl font-display text-xs font-bold text-[#1A1D20] cursor-pointer"
        >
          <ChevronLeft size={16} strokeWidth={3} /> Cenários
        </button>

        <span className="inline-flex items-center gap-1 bg-[#7C4DFF] text-white border-2 border-[#1A1D20] px-3 py-1 rounded-xl text-[11px] font-extrabold">
          <ShieldAlert size={13} /> {activeScenario.difficulty}
        </span>
      </div>

      {/* Chat Container */}
      <TactileCard className="p-4 mb-4">
        <div className="flex items-center gap-2.5 pb-3 mb-3 border-b-2 border-slate-100">
          <div className="w-10 h-10 rounded-full bg-[#FF5252] border-2 border-[#1A1D20] text-white font-display font-bold text-sm flex items-center justify-center shrink-0">
            {activeScenario.personaInitials}
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-sm font-bold text-[#1A1D20] truncate">
              {activeScenario.personaName}
            </h2>
            <p className="text-[11px] font-semibold text-slate-500">
              {activeScenario.personaRole} • {activeScenario.channel}
            </p>
          </div>
        </div>

        <p className="text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-2.5 mb-3">
          {activeScenario.context}
        </p>

        {/* Incoming high-pressure message */}
        <div className="bg-[#FFF8F8] border-2 border-[#1A1D20] rounded-2xl rounded-tl-sm p-3.5 mb-3">
          <p className="text-sm font-semibold text-[#1A1D20] leading-relaxed">
            "{activeScenario.openingMessage}"
          </p>
        </div>

        {/* User sent response */}
        {sentMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end mb-2"
          >
            <div className="bg-[#29B6F6] border-2 border-[#1A1D20] shadow-[0px_3px_0px_#1A1D20] rounded-2xl rounded-tr-sm p-3.5 max-w-[90%] text-white text-sm font-semibold">
              {sentMessage}
            </div>
          </motion.div>
        )}

        {/* Analyzing indicator */}
        {isAnalyzing && (
          <div className="flex items-center gap-3 bg-[#EDE7F6] border-2 border-[#1A1D20] rounded-2xl p-3 mt-3">
            <CoalaMascot mood="thinking" size={54} className="shrink-0" />
            <div>
              <p className="font-display text-sm font-bold text-[#7C4DFF]">
                Gatekeeper analisando sua postura...
              </p>
              <p className="text-xs font-semibold text-slate-600">
                Calculando Clareza, Empatia e Controle Emocional
              </p>
            </div>
          </div>
        )}
      </TactileCard>

      {/* Response Input & Tactical Approaches (when not yet evaluated) */}
      {!sentMessage && (
        <div className="space-y-4">
          {/* Free text input */}
          <TactileCard className="p-3.5">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Digite sua resposta livremente:
            </label>
            <div className="flex gap-2">
              <textarea
                rows={2}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escreva como você responderia na vida real..."
                className="flex-1 bg-slate-50 border-2 border-[#1A1D20] rounded-xl p-2.5 text-sm font-medium text-[#1A1D20] placeholder-slate-400 focus:outline-none focus:bg-white resize-none"
              />
              <TactileButton
                variant="purple"
                size="sm"
                disabled={inputText.trim().length < 5}
                onClick={() => handleSubmit(inputText)}
                className="self-end h-11 px-3.5"
              >
                <Send size={17} />
              </TactileButton>
            </div>
          </TactileCard>

          {/* Quick tactical approaches */}
          <div>
            <p className="font-display text-xs font-bold text-white text-cartoon-shadow mb-2 flex items-center gap-1 px-1">
              <Zap size={14} fill="#FFC107" className="text-[#FFC107]" /> Ou teste uma abordagem tática:
            </p>
            <div className="space-y-2.5">
              {activeScenario.tacticalSuggestions.map((sug, idx) => (
                <motion.button
                  key={idx}
                  whileTap={{ y: 2 }}
                  onClick={() => handleSubmit(sug.text, sug.quality)}
                  className="w-full tactile-card-interactive p-3.5 text-left"
                >
                  <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#7C4DFF] mb-1">
                    {sug.label}
                  </span>
                  <p className="text-xs font-semibold text-[#1A1D20] leading-relaxed">
                    "{sug.text}"
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LIVE TELEMETRY EVALUATION PANEL */}
      <AnimatePresence>
        {evaluation && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          >
            <TactileCard className="p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <CoalaMascot
                    mood={evaluation.stars >= 4 ? 'celebrating' : 'stressed'}
                    size={70}
                    className="shrink-0"
                  />
                  <div>
                    <span className="inline-flex items-center gap-1 bg-[#FFF8E1] border-2 border-[#1A1D20] px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold text-[#D39E00] mb-1">
                      <Sparkles size={12} /> +{evaluation.xpEarned} XP
                    </span>
                    <h3 className="font-display text-lg font-bold text-[#1A1D20] leading-tight">
                      {evaluation.headline}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Stars Row */}
              <div className="flex items-center justify-center gap-1.5 bg-slate-50 border-2 border-[#1A1D20] rounded-2xl py-2.5 mb-4">
                {[1, 2, 3, 4, 5].map((starIdx) => (
                  <motion.div
                    key={starIdx}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: starIdx * 0.08, type: 'spring', stiffness: 400 }}
                  >
                    <Star
                      size={26}
                      fill={starIdx <= evaluation.stars ? '#FFC107' : '#E0E4E8'}
                      stroke="#1A1D20"
                      strokeWidth={2.2}
                    />
                  </motion.div>
                ))}
              </div>

              {/* 3 Animated Telemetry Bars */}
              <div className="space-y-3 mb-4">
                <TelemetryBar label="Clareza" value={evaluation.clarity} color="#29B6F6" delay={0.1} />
                <TelemetryBar label="Empatia" value={evaluation.empathy} color="#FF5252" delay={0.22} />
                <TelemetryBar
                  label="Controle / Confiança"
                  value={evaluation.control}
                  color="#43B02A"
                  delay={0.34}
                />
              </div>

              <div className="bg-[#F8FAFC] border-2 border-[#1A1D20] rounded-2xl p-3.5 mb-4">
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                  Parecer Comportamental
                </p>
                <p className="text-xs font-semibold text-[#1A1D20] leading-relaxed">
                  {evaluation.reason}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <TactileButton
                  variant="white"
                  size="md"
                  onClick={() => startScenario(activeScenario)}
                >
                  <RotateCcw size={15} /> Tentar de novo
                </TactileButton>
                <TactileButton
                  variant="green"
                  size="md"
                  onClick={() => setActiveScenario(null)}
                >
                  Outro Cenário
                </TactileButton>
              </div>
            </TactileCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TelemetryBar({
  label,
  value,
  color,
  delay,
}: {
  label: string;
  value: number;
  color: string;
  delay: number;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-extrabold text-[#1A1D20]">{label}</span>
        <span className="font-display text-xs font-bold text-[#1A1D20]">{value}%</span>
      </div>
      <div className="h-4 bg-[#E0E4E8] border-2 border-[#1A1D20] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.75, delay, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
