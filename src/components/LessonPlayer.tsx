import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  X,
  HeartCrack,
  Zap,
  CheckCircle2,
  XCircle,
  Flame,
  Sparkles,
  RotateCcw,
  MessageSquare,
  Mail,
  Hash,
  Target,
  ShieldCheck,
} from 'lucide-react';
import type {
  CurriculumLesson,
  PhraseCompleteChallenge,
  EmotionThermometerChallenge,
  MiniRoleplayChallenge,
} from '../data/curriculum';
import { useAppStore } from '../store/useAppStore';
import { CoalaMascot } from './CoalaMascot';
import { SkyBackground, TactileButton, TactileCard } from './ui/TactileUI';
import { soundFX } from '../utils/soundEffects';

interface LessonPlayerProps {
  lesson: CurriculumLesson;
  onClose: () => void;
}

const CHEER_PHRASES = ['Excelente!', 'Mandou muito bem!', 'Visão de líder!', 'Perfeito!'];
const THERMOMETER_EMOJIS = ['😌', '🙂', '😬', '😰', '🌋'];
const THERMOMETER_COLORS = ['#29B6F6', '#00E676', '#FFD54F', '#FF9600', '#FF4B4B'];

function AnimatedXpCounter({ target }: { target: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let rafId = 0;
    const duration = 900;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target]);

  return <span>+{display}</span>;
}

export default function LessonPlayer({ lesson, onClose }: LessonPlayerProps) {
  const { energy, streak, loseEnergy, refillEnergy, completeLesson } = useAppStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(false);
  const [combo, setCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [lessonFinished, setLessonFinished] = useState(false);

  const [xpPopId, setXpPopId] = useState<number | null>(null);
  const [energyPopId, setEnergyPopId] = useState<number | null>(null);

  // Format 1 (dilemma) & Format 2 (phrase_complete)
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  // Format 3 (emotion_thermometer)
  const [thermoValue, setThermoValue] = useState<number>(2);
  // Format 4 (mini_roleplay)
  const [roleplayTurn, setRoleplayTurn] = useState<number>(0);
  const [roleplayChoices, setRoleplayChoices] = useState<
    { text: string; isIdeal: boolean; feedback: string }[]
  >([]);

  const challenge = lesson.challenges[currentIndex];

  const resetChallengeState = () => {
    setSelectedOption(null);
    setThermoValue(2);
    setRoleplayTurn(0);
    setRoleplayChoices([]);
    setIsChecked(false);
    setIsCorrect(false);
  };

  const canCheck = useMemo(() => {
    if (!challenge) return false;
    switch (challenge.type) {
      case 'dilemma':
      case 'phrase_complete':
        return selectedOption !== null;
      case 'emotion_thermometer':
        return true;
      case 'mini_roleplay':
        return roleplayChoices.length === challenge.turns.length;
      default:
        return false;
    }
  }, [challenge, selectedOption, roleplayChoices]);

  const evaluateAnswer = (): boolean => {
    if (!challenge) return false;
    switch (challenge.type) {
      case 'dilemma':
      case 'phrase_complete':
        return selectedOption === challenge.correctIndex;
      case 'emotion_thermometer':
        return thermoValue >= challenge.idealRange[0] && thermoValue <= challenge.idealRange[1];
      case 'mini_roleplay': {
        const idealCount = roleplayChoices.filter((c) => c.isIdeal).length;
        return idealCount >= Math.ceil(challenge.turns.length / 2) && Boolean(roleplayChoices[roleplayChoices.length - 1]?.isIdeal);
      }
      default:
        return false;
    }
  };

  const handleCheck = () => {
    if (!canCheck || isChecked) return;
    const passed = evaluateAnswer();
    setIsCorrect(passed);
    setIsChecked(true);

    if (passed) {
      soundFX.playCorrect();
      setCombo((c) => c + 1);
      setCorrectCount((c) => c + 1);
      const popKey = Date.now();
      setXpPopId(popKey);
      setTimeout(() => setXpPopId((curr) => (curr === popKey ? null : curr)), 1100);

      if (combo + 1 >= 2) {
        confetti({
          particleCount: 24,
          spread: 48,
          origin: { y: 0.78 },
          colors: ['#10E8A2', '#00E676', '#FFD54F', '#29B6F6'],
        });
      }
    } else {
      soundFX.playWrong();
      setTimeout(() => soundFX.playHeartLost(), 160);
      setCombo(0);
      loseEnergy();
      const popKey = Date.now();
      setEnergyPopId(popKey);
      setTimeout(() => setEnergyPopId((curr) => (curr === popKey ? null : curr)), 1100);
      setShakeTrigger(true);
      setTimeout(() => setShakeTrigger(false), 400);
    }
  };

  const handleNext = () => {
    if (currentIndex < lesson.challenges.length - 1) {
      resetChallengeState();
      setCurrentIndex((prev) => prev + 1);
    } else {
      setLessonFinished(true);
      completeLesson(lesson.id, lesson.xpReward, lesson.skillBoost);
      soundFX.playVictory();
      confetti({
        particleCount: 95,
        spread: 78,
        origin: { y: 0.55 },
        colors: ['#10E8A2', '#00E676', '#FFD54F', '#29B6F6', '#CE82FF'],
      });
    }
  };

  const handleRoleplayPick = (option: { text: string; isIdeal: boolean; feedback: string }) => {
    if (isChecked || challenge.type !== 'mini_roleplay') return;
    if (option.isIdeal) soundFX.playSelect();
    else soundFX.playTap();

    const nextChoices = [...roleplayChoices, option];
    setRoleplayChoices(nextChoices);

    if (roleplayTurn < challenge.turns.length - 1) {
      setTimeout(() => setRoleplayTurn((t) => t + 1), 240);
    }
  };

  /* LOSS / OUT-OF-ENERGY SCREEN */
  if (energy === 0 && !lessonFinished) {
    const completedSteps = currentIndex;
    return (
      <div className="fixed inset-0 z-50 bg-[#131F24] flex items-center justify-center px-5 py-8 pt-safe pb-safe overflow-y-auto">
        <SkyBackground />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className="w-full max-w-[400px] my-auto flex flex-col items-center text-center relative z-10"
        >
          <div className="relative mb-3">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.15, 0.35] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="absolute inset-0 bg-[#FF4B4B]/25 rounded-full blur-2xl"
            />
            <CoalaMascot pose="sad" size={148} className="relative z-10" />
            <motion.div
              initial={{ scale: 0, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.25, type: 'spring', stiffness: 360 }}
              className="absolute -top-1 -right-2 w-11 h-11 rounded-2xl liquid-glass border-[#FF4B4B]/40 flex items-center justify-center z-20"
            >
              <HeartCrack size={22} className="text-[#FF4B4B]" />
            </motion.div>
          </div>

          <h2 className="font-display text-2xl font-black text-white mb-1.5">
            Energia esgotada por agora
          </h2>
          <p className="text-sm font-medium text-slate-300 mb-6 leading-relaxed max-w-[310px]">
            Errar faz parte do treino emocional. Respire fundo — sua ofensiva está protegida e você
            pode retomar de onde parou!
          </p>

          <div className="grid grid-cols-2 gap-3 w-full mb-7">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="liquid-glass rounded-2xl p-3.5"
            >
              <HeartCrack size={18} className="text-[#FF4B4B] mx-auto mb-1" />
              <span className="block font-display text-lg font-black text-[#FF5E5E]">0 XP</span>
              <span className="text-[10px] font-bold uppercase text-slate-400">
                {completedSteps}/{lesson.challenges.length} etapas
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="liquid-glass rounded-2xl p-3.5"
            >
              <ShieldCheck size={18} className="text-[#10E8A2] mx-auto mb-1" />
              <span className="block font-display text-lg font-black text-[#10E8A2]">
                {streak}d
              </span>
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Ofensiva salva
              </span>
            </motion.div>
          </div>

          <div className="w-full space-y-3">
            <TactileButton
              variant="blue"
              size="lg"
              fullWidth
              onClick={() => {
                refillEnergy();
                soundFX.playCorrect();
              }}
            >
              <RotateCcw size={18} strokeWidth={2.8} /> Recarregar Energia e Tentar
            </TactileButton>
            <TactileButton variant="white" size="md" fullWidth onClick={onClose}>
              Voltar para a Trilha
            </TactileButton>
          </div>
        </motion.div>
      </div>
    );
  }

  /* WIN / XP CELEBRATION SCREEN */
  if (lessonFinished) {
    const accuracy = Math.round((correctCount / lesson.challenges.length) * 100);
    return (
      <div className="fixed inset-0 z-50 bg-[#131F24] flex items-center justify-center px-5 py-8 pt-safe pb-safe overflow-y-auto">
        <SkyBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="w-full max-w-[400px] my-auto flex flex-col items-center text-center relative z-10"
        >
          <div className="relative mb-2">
            <motion.div
              animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0.2, 0.45] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="absolute inset-0 bg-[#FFD54F]/30 rounded-full blur-2xl"
            />
            <CoalaMascot pose="celebrating" size={160} className="relative z-10" />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="font-display text-3xl font-black text-[#FFD54F] mb-1 drop-shadow-[0_0_16px_rgba(255,213,79,0.45)]"
          >
            Lição Concluída!
          </motion.h2>
          <p className="text-sm font-semibold text-slate-300 mb-6">
            {lesson.title} dominada com excelência
          </p>

          <div className="grid grid-cols-3 gap-2.5 w-full mb-8">
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 360 }}
              className="liquid-glass rounded-2xl py-3.5 px-2 flex flex-col items-center justify-center border-[#FFD54F]/40"
            >
              <span className="text-[10px] font-extrabold uppercase text-[#FFD54F] mb-1">
                Total XP
              </span>
              <div className="flex items-center gap-1 font-display text-xl font-black text-[#FFD54F]">
                <Sparkles size={15} fill="#FFD54F" />
                <AnimatedXpCounter target={lesson.xpReward} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.32, type: 'spring', stiffness: 360 }}
              className="liquid-glass rounded-2xl py-3.5 px-2 flex flex-col items-center justify-center border-[#10E8A2]/40"
            >
              <span className="text-[10px] font-extrabold uppercase text-[#10E8A2] mb-1">
                Precisão
              </span>
              <div className="flex items-center gap-1 font-display text-xl font-black text-[#10E8A2]">
                <Target size={15} />
                {accuracy}%
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.44, type: 'spring', stiffness: 360 }}
              className="liquid-glass rounded-2xl py-3.5 px-2 flex flex-col items-center justify-center border-[#FF9600]/40"
            >
              <span className="text-[10px] font-extrabold uppercase text-[#FF9600] mb-1">
                Ofensiva
              </span>
              <div className="flex items-center gap-1 font-display text-xl font-black text-[#FF9600]">
                <Flame size={15} fill="#FF9600" />
                {streak}d
              </div>
            </motion.div>
          </div>

          <TactileButton variant="blue" size="lg" fullWidth onClick={onClose}>
            Continuar na Trilha
          </TactileButton>
        </motion.div>
      </div>
    );
  }

  const progressPercent = Math.round(
    ((currentIndex + (isChecked ? 1 : 0)) / lesson.challenges.length) * 100
  );
  const cheerPhrase = CHEER_PHRASES[currentIndex % CHEER_PHRASES.length];

  return (
    <div className="fixed inset-0 z-50 bg-[#131F24] flex justify-center">
      <SkyBackground />
      <div
        className={`w-full max-w-[480px] mx-auto h-[100dvh] bg-[#131F24] flex flex-col relative z-10 overflow-hidden ${
          shakeTrigger ? 'animate-shake' : ''
        }`}
      >
        {/* Top Progress Header */}
        <div className="pt-safe px-4 py-3.5 apple-glass border-b border-white/10 flex items-center gap-3.5 shrink-0 relative">
          <button
            onClick={() => {
              soundFX.playTap();
              onClose();
            }}
            className="w-9 h-9 rounded-full hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
            aria-label="Fechar lição"
          >
            <X size={22} strokeWidth={2.6} />
          </button>

          <div className="flex-1 h-4 bg-white/10 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-[#29B6F6] to-[#67D4FF] rounded-full relative progress-sheen"
              initial={false}
              animate={{ width: `${Math.max(8, progressPercent)}%` }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            />
          </div>

          <div className="relative flex items-center gap-1.5 shrink-0">
            <motion.div
              key={energy}
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 0.3 }}
              className="liquid-glass rounded-full px-2.5 py-1 flex items-center gap-1 text-[#FF5E9C]"
            >
              <Zap size={14} fill="#FF5E9C" strokeWidth={2.2} />
              <span className="font-display font-extrabold text-xs">{energy}</span>
            </motion.div>

            <AnimatePresence>
              {energyPopId && (
                <motion.span
                  key={energyPopId}
                  initial={{ opacity: 1, y: 0, scale: 0.9 }}
                  animate={{ opacity: 0, y: 22, scale: 1.15 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9 }}
                  className="absolute -bottom-6 right-0 text-xs font-black text-[#FF4B4B] pointer-events-none"
                >
                  -1 ⚡
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {xpPopId && (
              <motion.div
                key={xpPopId}
                initial={{ opacity: 0, y: 12, scale: 0.8 }}
                animate={{ opacity: 1, y: -6, scale: 1 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.7 }}
                className="absolute left-1/2 -translate-x-1/2 top-14 bg-[#FFD54F] text-[#1C1200] font-display text-xs font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1 pointer-events-none z-40"
              >
                <Sparkles size={12} /> +15 XP
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Combo Pill */}
        <AnimatePresence>
          {combo >= 2 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pt-2 flex justify-center"
            >
              <span className="inline-flex items-center gap-1.5 liquid-glass text-[#FF9600] font-display text-xs font-extrabold px-3 py-1 rounded-full">
                <Flame size={14} fill="#FF9600" /> {combo} em seguida!
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exercise Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 pb-52 no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22 }}
            >
              {/* FORMAT 1: DILEMMA */}
              {challenge.type === 'dilemma' && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <CoalaMascot pose="thinking" size={70} className="shrink-0" />
                    <div className="liquid-glass rounded-2xl rounded-tl-sm px-4 py-3 flex-1">
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#10E8A2] mb-1">
                        {challenge.contextBadge}
                      </span>
                      <h2 className="font-display text-[17px] font-extrabold text-white leading-snug">
                        {challenge.prompt}
                      </h2>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {challenge.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      let stateStyle =
                        'tactile-card-interactive text-slate-100';

                      if (isChecked) {
                        if (idx === challenge.correctIndex) {
                          stateStyle =
                            'bg-[#00E676]/15 border-2 border-[#00E676] text-[#80FFBC]';
                        } else if (isSelected) {
                          stateStyle =
                            'bg-[#FF4B4B]/15 border-2 border-[#FF4B4B] text-[#FF8A8A]';
                        } else {
                          stateStyle =
                            'bg-white/5 border border-white/10 text-slate-500 opacity-45';
                        }
                      } else if (isSelected) {
                        stateStyle =
                          'bg-[#29B6F6]/20 border-2 border-[#29B6F6] shadow-[0_0_20px_rgba(41,182,246,0.25)] text-white';
                      }

                      return (
                        <motion.button
                          key={idx}
                          whileTap={isChecked ? undefined : { y: 2 }}
                          disabled={isChecked}
                          onClick={() => {
                            soundFX.playSelect();
                            setSelectedOption(idx);
                          }}
                          className={`w-full text-left p-4 rounded-2xl font-semibold text-sm leading-snug transition-all cursor-pointer flex items-start gap-3 ${stateStyle}`}
                        >
                          <span className="w-6 h-6 rounded-lg border border-current/35 flex items-center justify-center font-display text-xs font-extrabold shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{opt}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* FORMAT 2: COMPLETE A RESPOSTA (Intuitive Fill-in-the-Blank Speech Bubble) */}
              {challenge.type === 'phrase_complete' && (
                <PhraseCompleteView
                  challenge={challenge}
                  selectedOption={selectedOption}
                  isChecked={isChecked}
                  onSelect={(idx) => {
                    if (!isChecked) {
                      soundFX.playSelect();
                      setSelectedOption(idx);
                    }
                  }}
                />
              )}

              {/* FORMAT 3: EMOTION THERMOMETER */}
              {challenge.type === 'emotion_thermometer' && (
                <EmotionThermometerView
                  challenge={challenge}
                  value={thermoValue}
                  onChange={(v) => {
                    if (!isChecked) {
                      soundFX.playSelect();
                      setThermoValue(v);
                    }
                  }}
                  isChecked={isChecked}
                />
              )}

              {/* FORMAT 4: MINI BATE-PAPO */}
              {challenge.type === 'mini_roleplay' && (
                <MiniRoleplayView
                  challenge={challenge}
                  currentTurn={roleplayTurn}
                  choices={roleplayChoices}
                  onPick={handleRoleplayPick}
                  isChecked={isChecked}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Action / Spring Feedback Drawer */}
        <div className="absolute bottom-0 left-0 right-0 z-30">
          <AnimatePresence mode="wait">
            {!isChecked ? (
              <motion.div
                key="check-bar"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="apple-glass border-t border-white/12 p-4 pb-safe"
              >
                <TactileButton
                  variant="blue"
                  size="lg"
                  fullWidth
                  disabled={!canCheck}
                  onClick={handleCheck}
                >
                  Verificar
                </TactileButton>
              </motion.div>
            ) : (
              <motion.div
                key="feedback-sheet"
                initial={{ y: 120 }}
                animate={{ y: 0 }}
                exit={{ y: 120 }}
                transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                className={`p-5 pb-safe border-t backdrop-blur-2xl ${
                  isCorrect
                    ? 'bg-[#092820]/92 border-[#00E676]/40'
                    : 'bg-[#2C1217]/92 border-[#FF4B4B]/40'
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <CoalaMascot
                    pose={
                      isCorrect
                        ? combo >= 2
                          ? 'thumbsUp'
                          : 'idea'
                        : energy <= 1
                          ? 'sad'
                          : 'confused'
                    }
                    size={64}
                    className="shrink-0 -mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-display text-lg font-black flex items-center gap-1.5 ${
                        isCorrect ? 'text-[#10E8A2]' : 'text-[#FF5E5E]'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 size={20} strokeWidth={2.8} /> {cheerPhrase}
                        </>
                      ) : (
                        <>
                          <XCircle size={20} strokeWidth={2.8} /> Quase lá!
                        </>
                      )}
                    </h3>
                    <p
                      className={`text-xs font-semibold mt-1 leading-relaxed ${
                        isCorrect ? 'text-emerald-100/90' : 'text-rose-100/90'
                      }`}
                    >
                      {challenge.explanation}
                    </p>
                  </div>
                </div>

                <TactileButton
                  variant={isCorrect ? 'mint' : 'coral'}
                  size="lg"
                  fullWidth
                  onClick={handleNext}
                >
                  Continuar
                </TactileButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* FORMAT 2: INTUITIVE COMPLETE-THE-RESPONSE SPEECH BUBBLE */
function PhraseCompleteView({
  challenge,
  selectedOption,
  isChecked,
  onSelect,
}: {
  challenge: PhraseCompleteChallenge;
  selectedOption: number | null;
  isChecked: boolean;
  onSelect: (idx: number) => void;
}) {
  const chosenText = selectedOption !== null ? challenge.options[selectedOption] : null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <CoalaMascot pose="idea" size={64} className="shrink-0" />
        <div>
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#29B6F6] mb-0.5">
            Complete a Resposta • {challenge.contextBadge}
          </span>
          <p className="text-xs font-semibold text-slate-300 leading-snug">
            {challenge.situation}
          </p>
        </div>
      </div>

      {/* Interactive Liquid Glass Speech Bubble with Live Blank Slot */}
      <TactileCard className="p-5 mb-5">
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-white/45 mb-2">
          Sua resposta ideal:
        </p>
        <p className="font-display text-base font-bold text-white leading-relaxed">
          "{challenge.prefix}{' '}
          <motion.span
            key={chosenText || 'empty'}
            initial={{ scale: 0.92, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-block px-2.5 py-0.5 mx-0.5 rounded-xl border transition-colors ${
              chosenText
                ? isChecked
                  ? selectedOption === challenge.correctIndex
                    ? 'bg-[#00E676]/20 border-[#00E676] text-[#80FFBC]'
                    : 'bg-[#FF4B4B]/20 border-[#FF4B4B] text-[#FF8A8A]'
                  : 'bg-[#29B6F6]/25 border-[#29B6F6] text-[#8EE0FF]'
                : 'bg-white/8 border-dashed border-white/35 text-white/45'
            }`}
          >
            {chosenText || 'escolha abaixo'}
          </motion.span>{' '}
          {challenge.suffix}"
        </p>
      </TactileCard>

      {/* Crisp Selectable Phrase Cards */}
      <div className="flex flex-col gap-3">
        {challenge.options.map((opt, idx) => {
          const isSelected = selectedOption === idx;
          let stateStyle = 'tactile-card-interactive text-slate-100';

          if (isChecked) {
            if (idx === challenge.correctIndex) {
              stateStyle = 'bg-[#00E676]/15 border-2 border-[#00E676] text-[#80FFBC]';
            } else if (isSelected) {
              stateStyle = 'bg-[#FF4B4B]/15 border-2 border-[#FF4B4B] text-[#FF8A8A]';
            } else {
              stateStyle = 'bg-white/5 border border-white/10 text-slate-500 opacity-45';
            }
          } else if (isSelected) {
            stateStyle =
              'bg-[#29B6F6]/20 border-2 border-[#29B6F6] shadow-[0_0_18px_rgba(41,182,246,0.25)] text-white';
          }

          return (
            <motion.button
              key={idx}
              whileTap={isChecked ? undefined : { y: 2 }}
              disabled={isChecked}
              onClick={() => onSelect(idx)}
              className={`w-full text-left p-4 rounded-2xl font-semibold text-sm leading-snug transition-all cursor-pointer ${stateStyle}`}
            >
              "{opt}"
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* FORMAT 3: EMOTION THERMOMETER */
function EmotionThermometerView({
  challenge,
  value,
  onChange,
  isChecked,
}: {
  challenge: EmotionThermometerChallenge;
  value: number;
  onChange: (val: number) => void;
  isChecked: boolean;
}) {
  const ChannelIcon =
    challenge.messageChannel === 'Slack'
      ? Hash
      : challenge.messageChannel === 'E-mail'
        ? Mail
        : MessageSquare;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <CoalaMascot pose="listening" size={64} className="shrink-0" />
        <div>
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#FF9600] mb-0.5">
            Termômetro de Emoção
          </span>
          <h2 className="font-display text-base font-extrabold text-white leading-snug">
            {challenge.prompt}
          </h2>
        </div>
      </div>

      <TactileCard className="p-4 mb-5">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#29B6F6] flex items-center justify-center font-display font-extrabold text-[#07111A] text-xs">
              {challenge.messageSender.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-sm text-white leading-tight">
                {challenge.messageSender}
              </p>
              <p className="text-[11px] font-medium text-slate-400">{challenge.messageRole}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 bg-white/8 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-300">
            <ChannelIcon size={11} /> {challenge.messageChannel}
          </span>
        </div>
        <p className="text-sm font-medium text-slate-100 leading-relaxed italic">
          "{challenge.messageBody}"
        </p>
      </TactileCard>

      <TactileCard className="p-4">
        <div className="text-center mb-4">
          <motion.div
            key={value}
            initial={{ scale: 0.78 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 450, damping: 18 }}
            className="text-5xl mb-1.5"
          >
            {THERMOMETER_EMOJIS[value]}
          </motion.div>
          <span
            className="inline-block font-display text-sm font-black px-4 py-1 rounded-full text-[#07111A]"
            style={{ backgroundColor: THERMOMETER_COLORS[value] }}
          >
            {challenge.scaleLabels[value]}
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={4}
          step={1}
          disabled={isChecked}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-[#10E8A2] h-2.5 rounded-lg cursor-pointer mb-3.5"
        />

        <div className="grid grid-cols-5 gap-1">
          {challenge.scaleLabels.map((label, idx) => (
            <button
              key={label}
              disabled={isChecked}
              onClick={() => onChange(idx)}
              className={`py-1.5 px-1 min-h-[36px] flex items-center justify-center rounded-xl text-[9px] sm:text-[10px] font-bold text-center leading-tight break-words transition-all cursor-pointer ${
                value === idx
                  ? 'bg-[#10E8A2] text-[#07111A]'
                  : 'bg-white/8 text-slate-300 hover:bg-white/15'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </TactileCard>
    </div>
  );
}

/* FORMAT 4: MINI BATE-PAPO REAL (Multi-turn Liquid Glass Chat) */
function MiniRoleplayView({
  challenge,
  currentTurn,
  choices,
  onPick,
  isChecked,
}: {
  challenge: MiniRoleplayChallenge;
  currentTurn: number;
  choices: { text: string; isIdeal: boolean; feedback: string }[];
  onPick: (opt: { text: string; isIdeal: boolean; feedback: string }) => void;
  isChecked: boolean;
}) {
  const activeTurnData = challenge.turns[currentTurn];
  const needsPick = choices.length === currentTurn && Boolean(activeTurnData);

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <CoalaMascot pose="listening" size={64} className="shrink-0" />
        <div>
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#10E8A2] mb-0.5">
            Mini Bate-Papo Real • {challenge.turns.length} Turnos
          </span>
          <h2 className="font-display text-base font-extrabold text-white leading-snug">
            {challenge.prompt}
          </h2>
        </div>
      </div>

      {challenge.contextNote && (
        <div className="liquid-glass-subtle rounded-xl px-3.5 py-2 mb-4 text-[11px] font-medium text-sky-200/90">
          Cenário: {challenge.contextNote}
        </div>
      )}

      {/* Realistic Chat History up to currentTurn */}
      <div className="space-y-3 mb-5">
        {challenge.turns.slice(0, currentTurn + 1).map((turn, tIdx) => (
          <div key={tIdx} className="space-y-2.5">
            {/* Incoming Persona Bubble */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#CE82FF] to-[#6366F1] text-white font-display font-black text-xs flex items-center justify-center shrink-0 shadow-md">
                {challenge.personaInitials}
              </div>
              <div className="liquid-glass rounded-2xl rounded-tl-sm p-3.5 max-w-[85%]">
                {tIdx === 0 && (
                  <p className="text-[10px] font-bold text-[#CE82FF] uppercase mb-0.5">
                    {challenge.personaName} • {challenge.personaRole}
                  </p>
                )}
                <p className="text-sm font-medium text-slate-100 leading-snug">
                  {turn.incoming}
                </p>
              </div>
            </motion.div>

            {/* User Sent Bubble + Instant Micro-Feedback */}
            {choices[tIdx] && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-end gap-1"
              >
                <div className="bg-gradient-to-br from-[#38C6FF] to-[#1CA3EC] rounded-2xl rounded-tr-sm p-3.5 max-w-[85%] text-[#051520] text-sm font-bold shadow-md">
                  {choices[tIdx].text}
                </div>
                <span
                  className={`text-[11px] font-bold px-2 ${
                    choices[tIdx].isIdeal ? 'text-[#10E8A2]' : 'text-[#FF6B6B]'
                  }`}
                >
                  {choices[tIdx].feedback}
                </span>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Reply Options for Current Turn */}
      {needsPick && !isChecked && (
        <div className="space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-sky-300/80">
            Como você responde? (Turno {currentTurn + 1} de {challenge.turns.length})
          </p>
          {activeTurnData.options.map((opt, idx) => (
            <motion.button
              key={idx}
              whileTap={{ y: 2 }}
              onClick={() => onPick(opt)}
              className="w-full tactile-card-interactive p-3.5 text-left text-sm font-semibold text-slate-100"
            >
              "{opt.text}"
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
