import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowRight, Sparkles, CheckCircle2, Trophy } from 'lucide-react';
import { useAppStore, getUserRank } from '../store/useAppStore';
import { CoalaMascot } from './CoalaMascot';
import { SkyBackground, TactileButton, TactileCard } from './ui/TactileUI';
import { soundFX } from '../utils/soundEffects';

const DIAGNOSTIC_QUESTIONS = [
  {
    badge: 'PERGUNTA 1 DE 2',
    prompt:
      'Um colega discordou da sua ideia na frente de um cliente importante. Qual é sua reação imediata?',
    options: [
      {
        text: 'Agradeço o ponto de vista, anoto a preocupação e proponho validar ambos os caminhos com o cliente.',
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
      'Seu gestor pede uma entrega urgente faltando 15 minutos para o fim do expediente, quando você já está no limite.',
    options: [
      {
        text: 'Confirmo o impacto e proponho iniciar como primeira prioridade amanhã às 9h com foco total.',
        points: 3,
      },
      {
        text: 'Aceito fazer virando a noite para evitar desconforto, mesmo sabendo que a qualidade vai cair.',
        points: 1,
      },
      {
        text: 'Digo apenas que meu horário acabou e fecho o computador.',
        points: 0,
      },
    ],
  },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState<'welcome' | 'diagnostic' | 'result'>('welcome');
  const [name, setName] = useState('');
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
        message: 'Bom começo! Você começa no Elo Bronze com muito espaço para crescer.',
      };
    }
    return {
      level: 'Júnior' as const,
      startingXp: 100,
      message: 'Sua jornada começa agora no Elo Ferro — prepare-se para evoluir rápido!',
    };
  };

  const handleStartDiagnostic = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return;
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
        colors: ['#58CC02', '#FFC800', '#1CB0F6', '#FF4B4B', '#7C4DFF'],
      });
    }
  };

  const calibration = getCalibration(score);
  const calibratedRank = getUserRank(calibration.startingXp);

  return (
    <div className="min-h-[100dvh] w-full relative flex items-center justify-center p-5 overflow-hidden">
      <SkyBackground />

      <div className="w-full max-w-[420px] relative z-10">
        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="flex flex-col items-center"
            >
              <CoalaMascot mood="happy" size={140} className="mb-2" />

              <h1 className="font-display text-4xl font-black text-slate-800 tracking-tight mb-1">
                Evo<span className="text-[#58CC02]">ala</span>
              </h1>
              <p className="text-sm font-semibold text-slate-500 mb-6 text-center">
                Desperte o seu potencial
              </p>

              <TactileCard className="w-full p-6">
                <div className="inline-flex items-center gap-1.5 bg-[#EEFBE5] px-3 py-1 rounded-full text-[11px] font-extrabold text-[#46A302] mb-4">
                  <Sparkles size={13} />
                  SOFT SKILLS & INTELIGÊNCIA EMOCIONAL
                </div>

                <h2 className="font-display text-xl font-black text-slate-800 mb-1.5">
                  Vamos calibrar seu Elo
                </h2>
                <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                  Em menos de 30 segundos, nosso Gatekeeper define seu nível inicial na trilha.
                </p>

                <form onSubmit={handleStartDiagnostic} className="space-y-4">
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
                      className="w-full bg-[#F8FAFC] border-2 border-slate-200 rounded-2xl px-4 py-3.5 text-base font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#1CB0F6] focus:ring-4 focus:ring-[#1CB0F6]/15 transition-all"
                    />
                  </div>

                  <TactileButton
                    type="submit"
                    variant="green"
                    size="lg"
                    fullWidth
                    disabled={name.trim().length < 2}
                  >
                    Começar Diagnóstico <ArrowRight size={18} strokeWidth={2.8} />
                  </TactileButton>
                </form>
              </TactileCard>
            </motion.div>
          )}

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
                <CoalaMascot mood="thinking" size={82} className="shrink-0" />
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 flex-1 shadow-xs">
                  <span className="inline-block text-[10px] font-extrabold tracking-widest text-[#6366F1] uppercase mb-0.5">
                    GATEKEEPER IA • {DIAGNOSTIC_QUESTIONS[qIndex].badge}
                  </span>
                  <p className="text-xs font-medium text-slate-500 leading-snug">
                    Olá, <strong className="text-slate-800">{name}</strong>! Escolha a atitude mais
                    próxima da sua reação real.
                  </p>
                </div>
              </div>

              {/* Clean Progress Bar */}
              <div className="w-full flex gap-2 mb-4">
                {DIAGNOSTIC_QUESTIONS.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2.5 flex-1 rounded-full transition-colors ${
                      idx <= qIndex ? 'bg-[#58CC02]' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              <TactileCard className="w-full p-5">
                <h2 className="font-display text-lg font-extrabold text-slate-800 leading-snug mb-5">
                  {DIAGNOSTIC_QUESTIONS[qIndex].prompt}
                </h2>

                <div className="flex flex-col gap-3">
                  {DIAGNOSTIC_QUESTIONS[qIndex].options.map((opt, idx) => (
                    <motion.button
                      key={idx}
                      whileTap={{ y: 2 }}
                      onClick={() => handleAnswer(opt.points)}
                      className="tactile-card-interactive p-4 text-left text-sm font-semibold text-slate-700 leading-snug hover:bg-[#F0F9FF]"
                    >
                      {opt.text}
                    </motion.button>
                  ))}
                </div>
              </TactileCard>
            </motion.div>
          )}

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
                <div className="inline-flex items-center gap-1.5 bg-[#FFF8DC] px-3.5 py-1 rounded-full text-xs font-extrabold text-[#B8860B] mb-4">
                  <Trophy size={14} />
                  ELO INICIAL CALIBRADO
                </div>

                <h2 className="font-display text-3xl font-black text-slate-800 mb-1.5">
                  Elo {calibratedRank.name}!
                </h2>
                <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">
                  {calibration.message}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-3.5">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      XP Inicial
                    </span>
                    <span className="font-display text-2xl font-black text-[#D99B00]">
                      +{calibration.startingXp} XP
                    </span>
                  </div>
                  <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-3.5">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      Perfil
                    </span>
                    <span className="font-display text-2xl font-black text-[#46A302]">
                      {calibration.level}
                    </span>
                  </div>
                </div>

                <TactileButton
                  variant="green"
                  size="lg"
                  fullWidth
                  onClick={() =>
                    completeQuickOnboarding(name, calibration.startingXp, calibration.level)
                  }
                >
                  <CheckCircle2 size={19} strokeWidth={2.8} /> Ir para a Trilha 1
                </TactileButton>
              </TactileCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
