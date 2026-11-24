import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowRight, Sparkles, CheckCircle2, Trophy, Briefcase } from 'lucide-react';
import { useAppStore, getUserRank, type WorkAreaId } from '../store/useAppStore';
import { WORK_AREAS, getAreaMeta } from '../data/curriculum';
import { CoalaMascot } from './CoalaMascot';
import { SkyBackground, TactileButton, TactileCard } from './ui/TactileUI';
import { soundFX } from '../utils/soundEffects';

const DIAGNOSTIC_QUESTIONS = [
  {
    badge: 'PERGUNTA 1 DE 2',
    prompt:
      'Um colega discordou da sua ideia na frente de um cliente ou gestor importante. Qual é sua reação imediata?',
    options: [
      {
        text: 'Agradeço o ponto de vista, anoto a preocupação e proponho avaliar ambos os caminhos com clareza.',
        points: 3,
      },
      {
        text: 'Fico em silêncio na hora e depois mando uma mensagem longa explicando que ele me atrapalhou.',
        points: 1,
      },
      {
        text: 'Interrompo imediatamente para mostrar que minha proposta já tinha sido validada.',
        points: 0,
      },
    ],
  },
  {
    badge: 'PERGUNTA 2 DE 2',
    prompt:
      'Te pedem uma entrega urgente faltando 15 minutos para o fim do expediente, quando você já está no limite.',
    options: [
      {
        text: 'Confirmo a importância e proponho iniciar como primeira prioridade amanhã às 9h com foco total.',
        points: 3,
      },
      {
        text: 'Aceito fazer virando a noite para evitar desconforto, mesmo sabendo que a qualidade vai cair.',
        points: 1,
      },
      {
        text: 'Digo apenas que meu horário acabou e encerro o expediente.',
        points: 0,
      },
    ],
  },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState<'welcome' | 'area' | 'diagnostic' | 'result'>('welcome');
  const [name, setName] = useState('');
  const [selectedArea, setSelectedArea] = useState<WorkAreaId | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const { completeQuickOnboarding } = useAppStore();

  const getCalibration = (totalScore: number) => {
    if (totalScore >= 6) {
      return {
        level: 'Sênior' as const,
        startingXp: 1150,
        message: 'Excelente maturidade emocional! Você já estreia no Elo Ouro.',
      };
    }
    if (totalScore >= 4) {
      return {
        level: 'Pleno' as const,
        startingXp: 650,
        message: 'Ótima base comportamental! Você começa no Elo Prata.',
      };
    }
    if (totalScore >= 2) {
      return {
        level: 'Júnior' as const,
        startingXp: 300,
        message: 'Bom começo! Você começa no Elo Bronze com muito espaço para evoluir.',
      };
    }
    return {
      level: 'Júnior' as const,
      startingXp: 100,
      message: 'Sua jornada começa agora no Elo Ferro — prepare-se para evoluir rápido!',
    };
  };

  const handleWelcomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return;
    soundFX.playTap();
    setStep('area');
  };

  const handleConfirmArea = () => {
    if (!selectedArea) return;
    soundFX.playTap();
    setStep('diagnostic');
  };

  const handleAnswer = (points: number) => {
    const nextScore = score + points;
    setScore(nextScore);

    if (points >= 3) soundFX.playCorrect();
    else soundFX.playSelect();

    if (qIndex < DIAGNOSTIC_QUESTIONS.length - 1) {
      setQIndex((prev) => prev + 1);
    } else {
      setStep('result');
      soundFX.playLevelUp();
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#00CD9C', '#58CC02', '#FFC800', '#1CB0F6', '#CE82FF'],
      });
    }
  };

  const calibration = getCalibration(score);
  const calibratedRank = getUserRank(calibration.startingXp);
  const areaMeta = getAreaMeta(selectedArea || 'gestao');

  return (
    <div className="min-h-[100dvh] w-full relative flex items-center justify-center px-4 py-8 pt-safe pb-safe overflow-y-auto overflow-x-hidden bg-[#131F24]">
      <SkyBackground />

      <div className="w-full max-w-[430px] my-auto relative z-10">
        <AnimatePresence mode="wait">
          {/* STEP 1: WELCOME + NAME */}
          {step === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="flex flex-col items-center"
            >
              <CoalaMascot mood="happy" size={138} className="mb-2" />

              <h1 className="font-display text-4xl font-black text-white tracking-tight mb-1">
                Evo<span className="text-[#00CD9C]">ala</span>
              </h1>
              <p className="text-sm font-semibold text-slate-400 mb-6 text-center">
                Desperte o seu potencial
              </p>

              <TactileCard className="w-full p-6">
                <div className="inline-flex items-center gap-1.5 bg-[#00CD9C]/15 px-3 py-1 rounded-full text-[11px] font-extrabold text-[#00CD9C] mb-4">
                  <Sparkles size={13} />
                  SOFT SKILLS & INTELIGÊNCIA EMOCIONAL
                </div>

                <h2 className="font-display text-xl font-black text-white mb-1.5">
                  Vamos personalizar sua trilha
                </h2>
                <p className="text-sm text-slate-400 mb-5 leading-relaxed">
                  Adaptamos os exercícios para a sua profissão e calibramos seu Elo inicial.
                </p>

                <form onSubmit={handleWelcomeSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Como podemos te chamar?
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Guilherme"
                      className="w-full bg-[#131F24] border-2 border-[#37464F] rounded-2xl px-4 py-3.5 text-base font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#00CD9C] transition-all"
                    />
                  </div>

                  <TactileButton
                    type="submit"
                    variant="mint"
                    size="lg"
                    fullWidth
                    disabled={name.trim().length < 2}
                  >
                    Continuar <ArrowRight size={18} strokeWidth={2.8} />
                  </TactileButton>
                </form>
              </TactileCard>
            </motion.div>
          )}

          {/* STEP 2: AREA OF WORK SELECTION */}
          {step === 'area' && (
            <motion.div
              key="area"
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -36 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="flex flex-col"
            >
              <div className="flex items-center gap-3 mb-5">
                <CoalaMascot mood="pointing" size={76} className="shrink-0" />
                <div className="bg-[#1B2B34] border-2 border-[#2E3F49] rounded-2xl rounded-tl-sm px-4 py-3 flex-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold tracking-widest text-[#00CD9C] uppercase mb-0.5">
                    <Briefcase size={11} /> PERFIL PROFISSIONAL
                  </span>
                  <h2 className="font-display text-base font-extrabold text-white leading-snug">
                    Em qual área você atua hoje, {name}?
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {WORK_AREAS.map((area) => {
                  const active = selectedArea === area.id;
                  return (
                    <motion.button
                      key={area.id}
                      whileTap={{ y: 2 }}
                      onClick={() => {
                        soundFX.playSelect();
                        setSelectedArea(area.id);
                      }}
                      className={`p-3.5 rounded-2xl border-2 border-b-4 text-left transition-all cursor-pointer ${
                        active
                          ? 'bg-[#1CB0F6]/15 border-[#1CB0F6] border-b-[#1899D6]'
                          : 'bg-[#1B2B34] border-[#37464F] border-b-[#25333B] hover:bg-[#223540]'
                      }`}
                    >
                      <span className="text-2xl block mb-1.5">{area.emoji}</span>
                      <p className="font-display text-sm font-extrabold text-white leading-tight">
                        {area.label}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400 mt-1 leading-snug">
                        {area.description}
                      </p>
                    </motion.button>
                  );
                })}
              </div>

              <TactileButton
                variant="mint"
                size="lg"
                fullWidth
                disabled={!selectedArea}
                onClick={handleConfirmArea}
              >
                Avançar para Nivelamento <ArrowRight size={18} strokeWidth={2.8} />
              </TactileButton>
            </motion.div>
          )}

          {/* STEP 3: QUICK 2-QUESTION LEVELING */}
          {step === 'diagnostic' && (
            <motion.div
              key={`diag-${qIndex}`}
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -36 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="flex flex-col items-center"
            >
              <div className="flex items-center gap-3 w-full mb-4">
                <CoalaMascot mood="thinking" size={80} className="shrink-0" />
                <div className="bg-[#1B2B34] border-2 border-[#2E3F49] rounded-2xl rounded-tl-sm px-4 py-3 flex-1">
                  <span className="inline-block text-[10px] font-extrabold tracking-widest text-[#CE82FF] uppercase mb-0.5">
                    NIVELAMENTO • {DIAGNOSTIC_QUESTIONS[qIndex].badge}
                  </span>
                  <p className="text-xs font-medium text-slate-300 leading-snug">
                    Trilha adaptada para <strong className="text-[#00CD9C]">{areaMeta.label}</strong>.
                  </p>
                </div>
              </div>

              <div className="w-full flex gap-2 mb-4">
                {DIAGNOSTIC_QUESTIONS.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2.5 flex-1 rounded-full transition-colors ${
                      idx <= qIndex ? 'bg-[#00CD9C]' : 'bg-[#2A3840]'
                    }`}
                  />
                ))}
              </div>

              <TactileCard className="w-full p-5">
                <h2 className="font-display text-lg font-extrabold text-white leading-snug mb-5">
                  {DIAGNOSTIC_QUESTIONS[qIndex].prompt}
                </h2>

                <div className="flex flex-col gap-3">
                  {DIAGNOSTIC_QUESTIONS[qIndex].options.map((opt, idx) => (
                    <motion.button
                      key={idx}
                      whileTap={{ y: 2 }}
                      onClick={() => handleAnswer(opt.points)}
                      className="tactile-card-interactive p-4 text-left text-sm font-semibold text-slate-200 leading-snug"
                    >
                      {opt.text}
                    </motion.button>
                  ))}
                </div>
              </TactileCard>
            </motion.div>
          )}

          {/* STEP 4: ELO CALIBRATED RESULT */}
          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="flex flex-col items-center"
            >
              <CoalaMascot mood="celebrating" size={146} className="mb-2" />

              <TactileCard className="w-full p-6 text-center">
                <div className="inline-flex items-center gap-1.5 bg-[#FFC800]/15 px-3.5 py-1 rounded-full text-xs font-extrabold text-[#FFC800] mb-4">
                  <Trophy size={14} />
                  TRILHA PERSONALIZADA PRONTA
                </div>

                <h2 className="font-display text-3xl font-black text-white mb-1.5">
                  Elo {calibratedRank.name}!
                </h2>
                <p className="text-sm font-medium text-slate-400 mb-5 leading-relaxed">
                  {calibration.message} Preparamos sua trilha inicial para{' '}
                  <strong className="text-[#00CD9C]">{areaMeta.label}</strong>.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-[#131F24] border border-[#FFC800]/40 rounded-2xl p-3.5">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      XP Inicial
                    </span>
                    <span className="font-display text-2xl font-black text-[#FFC800]">
                      +{calibration.startingXp} XP
                    </span>
                  </div>
                  <div className="bg-[#131F24] border border-[#00CD9C]/40 rounded-2xl p-3.5">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      Área
                    </span>
                    <span className="font-display text-lg font-black text-[#00CD9C] truncate block mt-1">
                      {areaMeta.emoji} {areaMeta.shortLabel}
                    </span>
                  </div>
                </div>

                <TactileButton
                  variant="mint"
                  size="lg"
                  fullWidth
                  onClick={() =>
                    completeQuickOnboarding(
                      name,
                      calibration.startingXp,
                      calibration.level,
                      selectedArea || 'gestao'
                    )
                  }
                >
                  <CheckCircle2 size={19} strokeWidth={2.8} /> Começar Trilha Inicial
                </TactileButton>
              </TactileCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
