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
  CnvBuilderChallenge,
  EmotionThermometerChallenge,
  MiniRoleplayChallenge,
} from '../data/curriculum';
import { useAppStore } from '../store/useAppStore';
import { CoalaMascot } from './CoalaMascot';
import { TactileButton, TactileCard } from './ui/TactileUI';
import { soundFX } from '../utils/soundEffects';

interface LessonPlayerProps {
  lesson: CurriculumLesson;
  onClose: () => void;
}

const CHEER_PHRASES = ['Excelente!', 'Mandou muito bem!', 'Visão de líder!', 'Perfeito!'];
const THERMOMETER_EMOJIS = ['😌', '🙂', '😬', '😰', '🌋'];
const THERMOMETER_COLORS = ['#1CB0F6', '#00CD9C', '#FFC800', '#FF9600', '#FF4B4B'];

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

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [thermoValue, setThermoValue] = useState<number>(2);
  const [roleplayTurn, setRoleplayTurn] = useState<0 | 1>(0);
  const [roleplayChoices, setRoleplayChoices] = useState<
    { text: string; isIdeal: boolean; feedback: string }[]
  >([]);

  const challenge = lesson.challenges[currentIndex];

  const cnvPool = useMemo(() => {
    if (!challenge || challenge.type !== 'cnv_builder') return [];
    const all = [...challenge.correctOrder, ...(challenge.distractors || [])];
    return all
      .map((text, idx) => ({ text, sortKey: (idx * 7 + text.length * 3) % 11 }))
      .sort((a, b) => a.sortKey - b.sortKey)
      .map((item) => item.text);
  }, [challenge]);

  const resetChallengeState = () => {
    setSelectedOption(null);
    setSelectedBlocks([]);
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
        return selectedOption !== null;
      case 'cnv_builder':
        return selectedBlocks.length === challenge.correctOrder.length;
      case 'emotion_thermometer':
        return true;
      case 'mini_roleplay':
        return roleplayChoices.length === 2;
      default:
        return false;
    }
  }, [challenge, selectedOption, selectedBlocks, roleplayChoices]);

  const evaluateAnswer = (): boolean => {
    if (!challenge) return false;
    switch (challenge.type) {
      case 'dilemma':
        return selectedOption === challenge.correctIndex;
      case 'cnv_builder':
        return (
          selectedBlocks.length === challenge.correctOrder.length &&
          selectedBlocks.every((blk, idx) => blk === challenge.correctOrder[idx])
        );
      case 'emotion_thermometer':
        return thermoValue >= challenge.idealRange[0] && thermoValue <= challenge.idealRange[1];
      case 'mini_roleplay':
        return roleplayChoices.filter((c) => c.isIdeal).length >= 1 && roleplayChoices[1]?.isIdeal;
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
          colors: ['#00CD9C', '#58CC02', '#FFC800', '#1CB0F6'],
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
        colors: ['#00CD9C', '#58CC02', '#FFC800', '#1CB0F6', '#CE82FF'],
      });
    }
  };

  const handleToggleCnvBlock = (block: string) => {
    if (isChecked) return;
    soundFX.playSelect();
    if (selectedBlocks.includes(block)) {
      setSelectedBlocks((prev) => prev.filter((b) => b !== block));
    } else {
      const cnv = challenge as CnvBuilderChallenge;
      if (selectedBlocks.length < cnv.correctOrder.length) {
        setSelectedBlocks((prev) => [...prev, block]);
      }
    }
  };

  const handleRoleplayPick = (option: { text: string; isIdeal: boolean; feedback: string }) => {
    if (isChecked) return;
    if (option.isIdeal) soundFX.playSelect();
    else soundFX.playTap();

    const nextChoices = [...roleplayChoices, option];
    setRoleplayChoices(nextChoices);

    if (roleplayTurn === 0) {
      setTimeout(() => setRoleplayTurn(1), 220);
    }
  };

  /* LOSS / OUT-OF-ENERGY SCREEN */
  if (energy === 0 && !lessonFinished) {
    const completedSteps = currentIndex;
    return (
      <div className="fixed inset-0 z-50 bg-[#131F24] flex items-center justify-center px-5 py-8 pt-safe pb-safe overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className="w-full max-w-[400px] my-auto flex flex-col items-center text-center"
        >
          <div className="relative mb-3">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.15, 0.35] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="absolute inset-0 bg-[#FF4B4B]/25 rounded-full blur-2xl"
            />
            <CoalaMascot mood="sad" size={148} className="relative z-10" />
            <motion.div
              initial={{ scale: 0, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.25, type: 'spring', stiffness: 360 }}
              className="absolute -top-1 -right-2 w-11 h-11 rounded-2xl bg-[#2A1C21] border-2 border-[#FF4B4B]/50 flex items-center justify-center z-20"
            >
              <HeartCrack size={22} className="text-[#FF4B4B]" />
            </motion.div>
          </div>

          <h2 className="font-display text-2xl font-black text-white mb-1.5">
            Energia esgotada por agora
          </h2>
          <p className="text-sm font-medium text-slate-400 mb-6 leading-relaxed max-w-[310px]">
            Errar faz parte do treino emocional. Respire fundo — sua ofensiva está protegida e você
            pode retomar de onde parou!
          </p>

          <div className="grid grid-cols-2 gap-3 w-full mb-7">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="bg-[#1B2B34] border-2 border-[#FF4B4B]/40 rounded-2xl p-3.5"
            >
              <HeartCrack size={18} className="text-[#FF4B4B] mx-auto mb-1" />
              <span className="block font-display text-lg font-black text-[#FF4B4B]">0 XP</span>
              <span className="text-[10px] font-bold uppercase text-slate-400">
                {completedSteps}/{lesson.challenges.length} etapas
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="bg-[#1B2B34] border-2 border-[#00CD9C]/40 rounded-2xl p-3.5"
            >
              <ShieldCheck size={18} className="text-[#00CD9C] mx-auto mb-1" />
              <span className="block font-display text-lg font-black text-[#00CD9C]">
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
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="w-full max-w-[400px] my-auto flex flex-col items-center text-center"
        >
          <div className="relative mb-2">
            <motion.div
              animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.18, 0.4] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="absolute inset-0 bg-[#FFC800]/30 rounded-full blur-2xl"
            />
            <CoalaMascot mood="celebrating" size={160} className="relative z-10" />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="font-display text-3xl font-black text-[#FFC800] mb-1"
          >
            Lição Concluída!
          </motion.h2>
          <p className="text-sm font-semibold text-slate-400 mb-6">
            {lesson.title} dominada com excelência
          </p>

          <div className="grid grid-cols-3 gap-2.5 w-full mb-8">
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 360 }}
              className="bg-[#FFC800] p-[2px] rounded-2xl shadow-[0_4px_0_#CC9600]"
            >
              <div className="bg-[#1B2B34] rounded-[14px] py-3 px-2 h-full flex flex-col items-center justify-center">
                <span className="text-[10px] font-extrabold uppercase text-[#FFC800] mb-1">
                  Total XP
                </span>
                <div className="flex items-center gap-1 font-display text-xl font-black text-[#FFC800]">
                  <Sparkles size={15} fill="#FFC800" />
                  <AnimatedXpCounter target={lesson.xpReward} />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.32, type: 'spring', stiffness: 360 }}
              className="bg-[#00CD9C] p-[2px] rounded-2xl shadow-[0_4px_0_#00A67E]"
            >
              <div className="bg-[#1B2B34] rounded-[14px] py-3 px-2 h-full flex flex-col items-center justify-center">
                <span className="text-[10px] font-extrabold uppercase text-[#00CD9C] mb-1">
                  Precisão
                </span>
                <div className="flex items-center gap-1 font-display text-xl font-black text-[#00CD9C]">
                  <Target size={15} />
                  {accuracy}%
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.44, type: 'spring', stiffness: 360 }}
              className="bg-[#FF9600] p-[2px] rounded-2xl shadow-[0_4px_0_#DF7B00]"
            >
              <div className="bg-[#1B2B34] rounded-[14px] py-3 px-2 h-full flex flex-col items-center justify-center">
                <span className="text-[10px] font-extrabold uppercase text-[#FF9600] mb-1">
                  Ofensiva
                </span>
                <div className="flex items-center gap-1 font-display text-xl font-black text-[#FF9600]">
                  <Flame size={15} fill="#FF9600" />
                  {streak}d
                </div>
              </div>
            </motion.div>
          </div>

          <TactileButton variant="mint" size="lg" fullWidth onClick={onClose}>
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
    <div className="fixed inset-0 z-50 bg-[#0D161A]/95 flex justify-center">
      <div
        className={`w-full max-w-[480px] h-[100dvh] bg-[#131F24] flex flex-col relative overflow-hidden sm:border-x sm:border-[#24333B] ${
          shakeTrigger ? 'animate-shake' : ''
        }`}
      >
        {/* Top Progress Header */}
        <div className="pt-safe px-4 py-3.5 bg-[#131F24] flex items-center gap-3.5 shrink-0 relative">
          <button
            onClick={() => {
              soundFX.playTap();
              onClose();
            }}
            className="w-9 h-9 rounded-full hover:bg-[#1B2B34] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
            aria-label="Fechar lição"
          >
            <X size={22} strokeWidth={2.6} />
          </button>

          <div className="flex-1 h-4 bg-[#26353D] rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-[#00CD9C] rounded-full relative progress-sheen"
              initial={false}
              animate={{ width: `${Math.max(8, progressPercent)}%` }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            />
          </div>

          {/* Energy counter */}
          <div className="relative flex items-center gap-1.5 shrink-0">
            <motion.div
              key={energy}
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-1 text-[#FF5E9C]"
            >
              <span className="inline-flex items-center justify-center w-6 h-4 rounded-[5px] bg-[#FF5E9C] text-white">
                <Zap size={11} fill="#FFFFFF" strokeWidth={2.5} />
              </span>
              <span className="font-display font-extrabold text-sm">{energy}</span>
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

          {/* Floating +15 XP reward pill */}
          <AnimatePresence>
            {xpPopId && (
              <motion.div
                key={xpPopId}
                initial={{ opacity: 0, y: 12, scale: 0.8 }}
                animate={{ opacity: 1, y: -6, scale: 1 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.7 }}
                className="absolute left-1/2 -translate-x-1/2 top-14 bg-[#FFC800] text-[#131F24] font-display text-xs font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1 pointer-events-none z-40"
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
              className="px-4 pb-1 flex justify-center"
            >
              <span className="inline-flex items-center gap-1.5 bg-[#FF9600]/15 text-[#FF9600] font-display text-xs font-extrabold px-3 py-1 rounded-full">
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
                    <CoalaMascot mood="happy" size={70} className="shrink-0" />
                    <div className="bg-[#1B2B34] border-2 border-[#2E3F49] rounded-2xl rounded-tl-sm px-4 py-3 flex-1">
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#00CD9C] mb-1">
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
                        'bg-[#1B2B34] border-2 border-[#37464F] border-b-4 border-b-[#25333B] text-slate-100 hover:bg-[#223540]';

                      if (isChecked) {
                        if (idx === challenge.correctIndex) {
                          stateStyle =
                            'bg-[#00CD9C]/15 border-2 border-[#00CD9C] border-b-4 border-b-[#00A67E] text-[#66F2CF]';
                        } else if (isSelected) {
                          stateStyle =
                            'bg-[#FF4B4B]/15 border-2 border-[#FF4B4B] border-b-4 border-b-[#EA2B2B] text-[#FF8A8A]';
                        } else {
                          stateStyle =
                            'bg-[#16232A] border-2 border-[#25333B] text-slate-500 opacity-50';
                        }
                      } else if (isSelected) {
                        stateStyle =
                          'bg-[#1CB0F6]/15 border-2 border-[#1CB0F6] border-b-4 border-b-[#1899D6] text-[#7DD6FF]';
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

              {/* FORMAT 2: CNV WORD BANK BUILDER */}
              {challenge.type === 'cnv_builder' && (
                <div>
                  <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#CE82FF] mb-1.5">
                    Monte a resposta assertiva
                  </span>
                  <h2 className="font-display text-lg font-extrabold text-white leading-snug mb-1.5">
                    {challenge.prompt}
                  </h2>
                  <p className="text-xs font-medium text-slate-400 mb-5">{challenge.situation}</p>

                  <div className="min-h-[124px] bg-[#1B2B34] border-2 border-dashed border-[#37464F] rounded-2xl p-3.5 mb-5 flex flex-wrap gap-2 content-start">
                    {selectedBlocks.length === 0 ? (
                      <span className="text-xs font-semibold text-slate-500 m-auto">
                        Toque nos blocos abaixo na ordem correta
                      </span>
                    ) : (
                      selectedBlocks.map((block) => (
                        <motion.button
                          layout
                          key={`chosen-${block}`}
                          initial={{ scale: 0.88, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          disabled={isChecked}
                          onClick={() => handleToggleCnvBlock(block)}
                          className="bg-[#1CB0F6]/20 border-2 border-[#1CB0F6] border-b-4 border-b-[#1899D6] px-3.5 py-2 rounded-xl text-xs font-bold text-[#7DD6FF] cursor-pointer text-left"
                        >
                          {block}
                        </motion.button>
                      ))
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {cnvPool.map((block) => {
                      const isUsed = selectedBlocks.includes(block);
                      return (
                        <motion.button
                          layout
                          key={`pool-${block}`}
                          whileTap={isUsed || isChecked ? undefined : { y: 2 }}
                          disabled={isUsed || isChecked}
                          onClick={() => handleToggleCnvBlock(block)}
                          className={`px-3.5 py-2.5 rounded-xl border-2 text-xs font-bold text-left transition-all ${
                            isUsed
                              ? 'bg-[#18252C] border-[#24333B] text-transparent select-none cursor-default'
                              : 'bg-[#1B2B34] border-[#37464F] border-b-4 border-b-[#25333B] text-slate-100 hover:bg-[#223540] cursor-pointer'
                          }`}
                        >
                          {block}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
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

              {/* FORMAT 4: MINI-ROLEPLAY */}
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
                className="bg-[#131F24] border-t border-[#26353D] p-4 pb-safe"
              >
                <TactileButton
                  variant="mint"
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
                className={`p-5 pb-safe border-t-2 ${
                  isCorrect
                    ? 'bg-[#142D28] border-[#00CD9C]/50'
                    : 'bg-[#2E1A1F] border-[#FF4B4B]/50'
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <CoalaMascot
                    mood={isCorrect ? 'celebrating' : 'sad'}
                    size={62}
                    className="shrink-0 -mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-display text-lg font-black flex items-center gap-1.5 ${
                        isCorrect ? 'text-[#00CD9C]' : 'text-[#FF5E5E]'
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
      <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#FF9600] mb-1.5">
        Termômetro de Emoção
      </span>
      <h2 className="font-display text-lg font-extrabold text-white leading-snug mb-4">
        {challenge.prompt}
      </h2>

      <TactileCard className="p-4 mb-5">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#2A3942]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#1CB0F6] flex items-center justify-center font-display font-extrabold text-[#131F24] text-xs">
              {challenge.messageSender.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-sm text-white leading-tight">
                {challenge.messageSender}
              </p>
              <p className="text-[11px] font-medium text-slate-400">{challenge.messageRole}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 bg-[#131F24] px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-300">
            <ChannelIcon size={11} /> {challenge.messageChannel}
          </span>
        </div>
        <p className="text-sm font-medium text-slate-200 leading-relaxed italic">
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
            className="inline-block font-display text-sm font-black px-4 py-1 rounded-full text-[#131F24]"
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
          className="w-full accent-[#00CD9C] h-2.5 rounded-lg cursor-pointer mb-3.5"
        />

        <div className="grid grid-cols-5 gap-1">
          {challenge.scaleLabels.map((label, idx) => (
            <button
              key={label}
              disabled={isChecked}
              onClick={() => onChange(idx)}
              className={`py-1.5 px-1 min-h-[36px] flex items-center justify-center rounded-xl text-[9px] sm:text-[10px] font-bold text-center leading-tight break-words transition-all cursor-pointer ${
                value === idx
                  ? 'bg-[#00CD9C] text-[#131F24]'
                  : 'bg-[#131F24] text-slate-400 hover:text-white'
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

function MiniRoleplayView({
  challenge,
  currentTurn,
  choices,
  onPick,
  isChecked,
}: {
  challenge: MiniRoleplayChallenge;
  currentTurn: 0 | 1;
  choices: { text: string; isIdeal: boolean; feedback: string }[];
  onPick: (opt: { text: string; isIdeal: boolean; feedback: string }) => void;
  isChecked: boolean;
}) {
  const activeTurnData = challenge.turns[currentTurn];
  const needsPick = choices.length === currentTurn;

  return (
    <div>
      <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#00CD9C] mb-1.5">
        Mini-Roleplay • 2 Turnos
      </span>
      <h2 className="font-display text-lg font-extrabold text-white leading-snug mb-4">
        {challenge.prompt}
      </h2>

      <div className="space-y-3 mb-5">
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#CE82FF] text-[#131F24] font-display font-black text-xs flex items-center justify-center shrink-0">
            {challenge.personaInitials}
          </div>
          <div className="bg-[#1B2B34] border border-[#2E3F49] rounded-2xl rounded-tl-sm p-3.5 max-w-[85%]">
            <p className="text-[10px] font-bold text-[#CE82FF] uppercase mb-0.5">
              {challenge.personaName} • {challenge.personaRole}
            </p>
            <p className="text-sm font-medium text-slate-100 leading-snug">
              {challenge.turns[0].incoming}
            </p>
          </div>
        </div>

        {choices[0] && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-end gap-1"
          >
            <div className="bg-[#1CB0F6] rounded-2xl rounded-tr-sm p-3.5 max-w-[85%] text-[#131F24] text-sm font-bold">
              {choices[0].text}
            </div>
            <span
              className={`text-[11px] font-bold px-2 ${
                choices[0].isIdeal ? 'text-[#00CD9C]' : 'text-[#FF5E5E]'
              }`}
            >
              {choices[0].feedback}
            </span>
          </motion.div>
        )}

        {currentTurn === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2.5"
          >
            <div className="w-9 h-9 rounded-full bg-[#CE82FF] text-[#131F24] font-display font-black text-xs flex items-center justify-center shrink-0">
              {challenge.personaInitials}
            </div>
            <div className="bg-[#1B2B34] border border-[#2E3F49] rounded-2xl rounded-tl-sm p-3.5 max-w-[85%]">
              <p className="text-sm font-medium text-slate-100 leading-snug">
                {challenge.turns[1].incoming}
              </p>
            </div>
          </motion.div>
        )}

        {choices[1] && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-end gap-1"
          >
            <div className="bg-[#1CB0F6] rounded-2xl rounded-tr-sm p-3.5 max-w-[85%] text-[#131F24] text-sm font-bold">
              {choices[1].text}
            </div>
            <span
              className={`text-[11px] font-bold px-2 ${
                choices[1].isIdeal ? 'text-[#00CD9C]' : 'text-[#FF5E5E]'
              }`}
            >
              {choices[1].feedback}
            </span>
          </motion.div>
        )}
      </div>

      {needsPick && !isChecked && (
        <div className="space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Sua resposta (Turno {currentTurn + 1} de 2):
          </p>
          {activeTurnData.options.map((opt, idx) => (
            <motion.button
              key={idx}
              whileTap={{ y: 2 }}
              onClick={() => onPick(opt)}
              className="w-full tactile-card-interactive p-3.5 text-left text-sm font-semibold text-slate-100"
            >
              {opt.text}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
