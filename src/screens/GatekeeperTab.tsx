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
  Cpu,
} from 'lucide-react';
import { GATEKEEPER_SCENARIOS, type GatekeeperScenario } from '../data/curriculum';
import {
  evaluateGatekeeperResponseAsync,
  type GatekeeperEvaluation,
} from '../utils/gatekeeperEngine';
import { useAppStore } from '../store/useAppStore';
import { CoalaMascot } from '../components/CoalaMascot';
import { TactileButton, TactileCard } from '../components/ui/TactileUI';
import { soundFX } from '../utils/soundEffects';

export function GatekeeperTab() {
  const { recordGatekeeperSession, geminiApiKey } = useAppStore();
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

  const handleSubmit = async (
    text: string,
    presetQuality?: 'master' | 'good' | 'reactive'
  ) => {
    if (!activeScenario || !text.trim() || isAnalyzing) return;
    soundFX.playSelect();
    setSentMessage(text.trim());
    setInputText('');
    setIsAnalyzing(true);

    const result = await evaluateGatekeeperResponseAsync(activeScenario, text.trim(), {
      presetQuality,
      userGeminiKey: geminiApiKey,
    });

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
        colors: ['#58CC02', '#1CB0F6', '#FFC800', '#7C4DFF'],
      });
    } else {
      soundFX.playWrong();
    }
  };

  // Scenario Hub View
  if (!activeScenario) {
    return (
      <div className="px-4 pt-5 pb-8">
        {/* Clean Minimalist Hero */}
        <div className="rounded-3xl bg-gradient-to-br from-[#6366F1] to-[#7C4DFF] p-5 text-white mb-6 shadow-[0_8px_24px_rgba(99,102,241,0.22)] relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
          <div className="flex items-center gap-3.5 relative z-10">
            <CoalaMascot mood="thinking" size={82} className="shrink-0" />
            <div>
              <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1.5">
                <BrainCircuit size={11} /> IA Real • Alta Pressão
              </span>
              <h1 className="font-display text-2xl font-black leading-tight">
                Gatekeeper IA
              </h1>
              <p className="text-xs font-medium text-white/90 mt-1 leading-relaxed">
                Escreva sua resposta real e receba telemetria instantânea de Clareza, Empatia e Controle.
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
          Cenários Corporativos
        </p>

        <div className="flex flex-col gap-3">
          {GATEKEEPER_SCENARIOS.map((scenario) => {
            const diffColor =
              scenario.difficulty === 'Extremo'
                ? 'bg-[#FFF0F0] text-[#EA2B2B]'
                : scenario.difficulty === 'Alto'
                  ? 'bg-[#FFF5E6] text-[#DF7B00]'
                  : 'bg-[#EEFBE5] text-[#46A302]';

            return (
              <motion.button
                key={scenario.id}
                whileTap={{ y: 2 }}
                onClick={() => startScenario(scenario)}
                className="tactile-card-interactive p-4 text-left w-full"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-bold text-[#6366F1] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full">
                    {scenario.channel} • {scenario.category}
                  </span>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${diffColor}`}>
                    {scenario.difficulty}
                  </span>
                </div>

                <h3 className="font-display text-base font-extrabold text-slate-800 mb-1">
                  {scenario.title}
                </h3>
                <p className="text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed">
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
      {/* Minimal Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            soundFX.playTap();
            setActiveScenario(null);
          }}
          className="inline-flex items-center gap-1 bg-white border border-slate-200 shadow-xs px-3 py-1.5 rounded-xl font-display text-xs font-extrabold text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          <ChevronLeft size={16} strokeWidth={2.8} /> Cenários
        </button>

        <span className="inline-flex items-center gap-1 bg-[#EEF2FF] text-[#6366F1] px-3 py-1 rounded-full text-[11px] font-bold">
          <ShieldAlert size={13} /> {activeScenario.difficulty}
        </span>
      </div>

      {/* Apple-style Chat Card */}
      <TactileCard className="p-4 mb-4">
        <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4B4B] to-[#FF7676] text-white font-display font-extrabold text-sm flex items-center justify-center shrink-0">
            {activeScenario.personaInitials}
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-sm font-extrabold text-slate-800 truncate">
              {activeScenario.personaName}
            </h2>
            <p className="text-[11px] font-medium text-slate-400">
              {activeScenario.personaRole} • {activeScenario.channel}
            </p>
          </div>
        </div>

        <p className="text-[11px] font-medium text-slate-500 bg-slate-50 rounded-xl p-2.5 mb-3.5 leading-relaxed">
          {activeScenario.context}
        </p>

        {/* Incoming message */}
        <div className="bg-slate-100 rounded-2xl rounded-tl-sm p-3.5 mb-3">
          <p className="text-sm font-medium text-slate-800 leading-relaxed">
            "{activeScenario.openingMessage}"
          </p>
        </div>

        {/* User sent response */}
        {sentMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end mb-3"
          >
            <div className="bg-[#1CB0F6] rounded-2xl rounded-tr-sm p-3.5 max-w-[90%] text-white text-sm font-medium shadow-xs">
              {sentMessage}
            </div>
          </motion.div>
        )}

        {/* Live AI persona follow-up */}
        {evaluation?.personaReply && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-100 rounded-2xl rounded-tl-sm p-3.5 mt-1"
          >
            <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              {activeScenario.personaName} respondeu:
            </span>
            <p className="text-sm font-medium text-slate-800 leading-relaxed">
              "{evaluation.personaReply}"
            </p>
          </motion.div>
        )}

        {/* Analyzing indicator */}
        {isAnalyzing && (
          <div className="flex items-center gap-3 bg-[#F5F3FF] rounded-2xl p-3 mt-3">
            <CoalaMascot mood="thinking" size={52} className="shrink-0" />
            <div>
              <p className="font-display text-sm font-extrabold text-[#6366F1]">
                Gatekeeper IA analisando...
              </p>
              <p className="text-xs font-medium text-slate-500">
                Avaliando Clareza, Empatia e Controle em tempo real
              </p>
            </div>
          </div>
        )}
      </TactileCard>

      {/* Response Input & Tactical Approaches */}
      {!sentMessage && (
        <div className="space-y-4">
          <TactileCard className="p-3.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Escreva sua resposta (analisada por IA real):
            </label>
            <div className="flex gap-2">
              <textarea
                rows={2}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Digite como você responderia na vida real..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#1CB0F6] focus:ring-2 focus:ring-[#1CB0F6]/20 resize-none transition-all"
              />
              <TactileButton
                variant="blue"
                size="sm"
                disabled={inputText.trim().length < 5}
                onClick={() => handleSubmit(inputText)}
                className="self-end h-11 px-3.5"
              >
                <Send size={17} />
              </TactileButton>
            </div>
          </TactileCard>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1 px-1">
              <Zap size={13} className="text-[#FFC800]" fill="#FFC800" /> Ou teste uma abordagem pronta:
            </p>
            <div className="space-y-2.5">
              {activeScenario.tacticalSuggestions.map((sug, idx) => (
                <motion.button
                  key={idx}
                  whileTap={{ y: 2 }}
                  onClick={() => handleSubmit(sug.text, sug.quality)}
                  className="w-full tactile-card-interactive p-3.5 text-left"
                >
                  <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#6366F1] mb-1">
                    {sug.label}
                  </span>
                  <p className="text-xs font-medium text-slate-700 leading-relaxed">
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
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          >
            <TactileCard className="p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <CoalaMascot
                    mood={evaluation.stars >= 4 ? 'celebrating' : 'sad'}
                    size={68}
                    className="shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className="inline-flex items-center gap-1 bg-[#FFF8DC] px-2.5 py-0.5 rounded-full text-[11px] font-extrabold text-[#B8860B]">
                        <Sparkles size={11} /> +{evaluation.xpEarned} XP
                      </span>
                      <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-500">
                        <Cpu size={10} /> {evaluation.provider}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-black text-slate-800 leading-tight">
                      {evaluation.headline}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Stars Row */}
              <div className="flex items-center justify-center gap-1.5 bg-[#F8FAFC] rounded-2xl py-2.5 mb-4">
                {[1, 2, 3, 4, 5].map((starIdx) => (
                  <motion.div
                    key={starIdx}
                    initial={{ scale: 0, rotate: -24 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: starIdx * 0.08, type: 'spring', stiffness: 400 }}
                  >
                    <Star
                      size={26}
                      fill={starIdx <= evaluation.stars ? '#FFC800' : '#E5E7EB'}
                      stroke={starIdx <= evaluation.stars ? '#E5A400' : '#D1D5DB'}
                      strokeWidth={1.8}
                    />
                  </motion.div>
                ))}
              </div>

              {/* 3 Animated Telemetry Bars */}
              <div className="space-y-3 mb-4">
                <TelemetryBar label="Clareza" value={evaluation.clarity} color="#1CB0F6" delay={0.1} />
                <TelemetryBar label="Empatia" value={evaluation.empathy} color="#FF4B4B" delay={0.22} />
                <TelemetryBar
                  label="Controle / Confiança"
                  value={evaluation.control}
                  color="#58CC02"
                  delay={0.34}
                />
              </div>

              <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-3.5 mb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Parecer Comportamental
                </p>
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  {evaluation.reason}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <TactileButton
                  variant="white"
                  size="md"
                  onClick={() => startScenario(activeScenario)}
                >
                  <RotateCcw size={15} /> Repetir
                </TactileButton>
                <TactileButton
                  variant="green"
                  size="md"
                  onClick={() => setActiveScenario(null)}
                >
                  Próximo
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
        <span className="text-xs font-bold text-slate-600">{label}</span>
        <span className="font-display text-xs font-extrabold text-slate-800">{value}%</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
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
