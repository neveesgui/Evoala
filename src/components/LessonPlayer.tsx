import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  X,
  Heart,
  CheckCircle2,
  XCircle,
  Flame,
  Sparkles,
  RotateCcw,
  MessageSquare,
  Mail,
  Hash,
  Target,
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

const CHEER_PHRASES = ['Excelente!', 'Mandou bem demais!', 'Visão de líder!', 'Perfeito!'];

const THERMOMETER_EMOJIS = ['😌', '🙂', '😬', '😰', '🌋'];
const THERMOMETER_COLORS = ['#29B6F6', '#43B02A', '#FFC107', '#FF6D00', '#FF5252'];

export default function LessonPlayer({ lesson, onClose }: LessonPlayerProps) {
  const { energy, streak, loseEnergy, refillEnergy, completeLesson } = useAppStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(false);
  const [combo, setCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [lessonFinished, setLessonFinished] = useState(false);

  // State for Format 1: Dilemma (Multiple choice)
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // State for Format 2: CNV Builder (Word/Phrase Bank)
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);

  // State for Format 3: Emotion Thermometer (Slider 0..4)
  const [thermoValue, setThermoValue] = useState<number>(2);

  // State for Format 4: Mini-Roleplay (2 turns)
  const [roleplayTurn, setRoleplayTurn] = useState<0 | 1>(0);
  const [roleplayChoices, setRoleplayChoices] = useState<
    { text: string; isIdeal: boolean; feedback: string }[]
  >([]);

  const challenge = lesson.challenges[currentIndex];

  // Deterministic shuffle for CNV Builder chips per challenge
  const cnvPool = useMemo(() => {
    if (!challenge || challenge.type !== 'cnv_builder') return [];
    const all = [...challenge.correctOrder, ...(challenge.distractors || [])];
    // Stable pseudo-shuffle so chips are never already in exact order
    return all
      .map((text, idx) => ({ text, sortKey: ((idx * 7 + text.length * 3) % 11) }))
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
        return (
          thermoValue >= challenge.idealRange[0] && thermoValue <= challenge.idealRange[1]
        );
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
      if (combo + 1 >= 2) {
        confetti({
          particleCount: 28,
          spread: 50,
          origin: { y: 0.78 },
          colors: ['#43B02A', '#FFC107', '#29B6F6'],
        });
      }
    } else {
      soundFX.playWrong();
      setTimeout(() => soundFX.playHeartLost(), 160);
      setCombo(0);
      loseEnergy();
      setShakeTrigger(true);
      setTimeout(() => setShakeTrigger(false), 420);
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
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#43B02A', '#FFC107', '#29B6F6', '#FF5252', '#7C4DFF'],
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

  // Out of Energy Modal
  if (energy === 0 && !lessonFinished) {
    return (
      <div className="fixed inset-0 z-50 bg-[#29B6F6] flex items-center justify-center p-5">
        <TactileCard className="w-full max-w-[400px] p-6 text-center">
          <CoalaMascot mood="stressed" size={124} className="mb-2" />
          <h2 className="font-display text-2xl font-bold text-[#1A1D20] mb-2">
            Sua energia zerou!
          </h2>
          <p className="text-sm font-medium text-slate-600 mb-6 leading-relaxed">
            Fazer pausas faz parte da inteligência emocional. Recarregue sua energia para continuar
            treinando agora mesmo!
          </p>
          <div className="space-y-3">
            <TactileButton
              variant="green"
              size="lg"
              fullWidth
              onClick={() => {
                refillEnergy();
                soundFX.playCorrect();
              }}
            >
              <RotateCcw size={18} strokeWidth={2.8} /> Recarregar Energia (❤️ 5)
            </TactileButton>
            <TactileButton variant="white" size="md" fullWidth onClick={onClose}>
              Voltar para a Trilha
            </TactileButton>
          </div>
        </TactileCard>
      </div>
    );
  }

  // Victory Screen
  if (lessonFinished) {
    const accuracy = Math.round((correctCount / lesson.challenges.length) * 100);
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#29B6F6] to-[#1CA3EC] flex items-center justify-center p-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          className="w-full max-w-[420px] flex flex-col items-center"
        >
          <CoalaMascot mood="celebrating" size={156} className="mb-1" />

          <h2 className="font-display text-4xl font-bold text-white text-cartoon-outline mb-1 text-center">
            Lição Concluída!
          </h2>
          <p className="font-display text-sm font-semibold text-white/95 mb-5 text-center">
            {lesson.title} dominada com sucesso
          </p>

          <TactileCard className="w-full p-5 mb-5">
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-[#FFF8E1] border-2 border-[#1A1D20] rounded-2xl p-3 text-center">
                <Sparkles size={18} className="text-[#D39E00] mx-auto mb-1" />
                <span className="block font-display text-xl font-bold text-[#1A1D20]">
                  +{lesson.xpReward}
                </span>
                <span className="text-[10px] font-extrabold uppercase text-slate-500">XP Ganho</span>
              </div>

              <div className="bg-[#E8F5E9] border-2 border-[#1A1D20] rounded-2xl p-3 text-center">
                <Target size={18} className="text-[#43B02A] mx-auto mb-1" />
                <span className="block font-display text-xl font-bold text-[#1A1D20]">
                  {accuracy}%
                </span>
                <span className="text-[10px] font-extrabold uppercase text-slate-500">Precisão</span>
              </div>

              <div className="bg-[#FFF3E0] border-2 border-[#1A1D20] rounded-2xl p-3 text-center">
                <Flame size={18} className="text-[#FF6D00] mx-auto mb-1" fill="#FF6D00" />
                <span className="block font-display text-xl font-bold text-[#1A1D20]">
                  {streak}d
                </span>
                <span className="text-[10px] font-extrabold uppercase text-slate-500">Ofensiva</span>
              </div>
            </div>
          </TactileCard>

          <TactileButton variant="gold" size="lg" fullWidth onClick={onClose}>
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
    <div className="fixed inset-0 z-50 bg-[#1CA3EC]/90 backdrop-blur-sm flex justify-center">
      <div
        className={`w-full max-w-[480px] h-[100dvh] bg-[#F8FAFC] flex flex-col relative overflow-hidden sm:border-x-[3px] sm:border-[#1A1D20] ${
          shakeTrigger ? 'animate-shake' : ''
        }`}
      >
        {/* Top Progress Header */}
        <div className="pt-safe px-4 py-3.5 bg-white border-b-[2.5px] border-[#1A1D20] flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              soundFX.playTap();
              onClose();
            }}
            className="w-9 h-9 rounded-xl border-2 border-[#1A1D20] bg-slate-50 hover:bg-slate-100 flex items-center justify-center cursor-pointer shrink-0"
            aria-label="Fechar lição"
          >
            <X size={18} strokeWidth={3} />
          </button>

          {/* Animated Eucalyptus Progress Bar */}
          <div className="flex-1 h-5 bg-[#E0E4E8] border-2 border-[#1A1D20] rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-[#43B02A] rounded-full relative progress-sheen"
              initial={false}
              animate={{ width: `${Math.max(8, progressPercent)}%` }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            />
          </div>

          {/* Hearts */}
          <div className="flex items-center gap-1 bg-[#FFEBEE] border-2 border-[#1A1D20] px-2.5 py-1 rounded-xl shrink-0">
            <Heart size={15} fill="#FF5252" className="text-[#FF5252]" strokeWidth={2.5} />
            <span className="font-display font-bold text-xs text-[#1A1D20]">{energy}</span>
          </div>
        </div>

        {/* Combo Banner */}
        <AnimatePresence>
          {combo >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-[#FFF3E0] border-b-2 border-[#1A1D20] px-4 py-1.5 flex items-center justify-center gap-1.5"
            >
              <Flame size={15} fill="#FF6D00" className="text-[#FF6D00]" />
              <span className="font-display text-xs font-bold text-[#FF6D00]">
                {combo} ACERTOS SEGUIDOS! VOCÊ ESTÁ EM CHAMAS!
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Challenge Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 pb-36 no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22 }}
            >
              {/* FORMAT 1: CORPORATE DILEMMA */}
              {challenge.type === 'dilemma' && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <CoalaMascot mood="happy" size={68} className="shrink-0" />
                    <div>
                      <span className="inline-block bg-[#E1F5FE] border-2 border-[#1A1D20] px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider text-[#1A1D20] mb-1">
                        {challenge.contextBadge}
                      </span>
                      <p className="text-xs font-bold text-slate-500">
                        Escolha a postura mais assertiva
                      </p>
                    </div>
                  </div>

                  <TactileCard className="p-4 mb-5 bg-[#FFFDF5]">
                    <h2 className="font-display text-lg font-bold text-[#1A1D20] leading-snug">
                      {challenge.prompt}
                    </h2>
                  </TactileCard>

                  <div className="flex flex-col gap-3">
                    {challenge.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      let stateStyle =
                        'bg-white border-[#1A1D20] shadow-[0px_4px_0px_#1A1D20] text-[#1A1D20] hover:bg-slate-50';

                      if (isChecked) {
                        if (idx === challenge.correctIndex) {
                          stateStyle =
                            'bg-[#E8F5E9] border-[#43B02A] shadow-[0px_4px_0px_#2D7A1C] text-[#1B5E20]';
                        } else if (isSelected) {
                          stateStyle =
                            'bg-[#FFEBEE] border-[#FF5252] shadow-[0px_4px_0px_#C62828] text-[#B71C1C]';
                        } else {
                          stateStyle =
                            'bg-slate-100 border-slate-300 shadow-none text-slate-400 opacity-60';
                        }
                      } else if (isSelected) {
                        stateStyle =
                          'bg-[#E1F5FE] border-[#29B6F6] shadow-[0px_4px_0px_#0288D1] text-[#01579B]';
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
                          className={`w-full text-left p-4 rounded-2xl border-[2.5px] font-semibold text-sm leading-snug transition-all cursor-pointer flex items-start gap-3 ${stateStyle}`}
                        >
                          <span className="w-6 h-6 rounded-lg border-2 border-current flex items-center justify-center font-display text-xs font-bold shrink-0 mt-0.5">
                            {String.fromCharCode(65 + idx)}
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
                  <span className="inline-block bg-[#EDE7F6] border-2 border-[#1A1D20] px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider text-[#7C4DFF] mb-2">
                    CONSTRUTOR DE RESPOSTA CNV
                  </span>
                  <h2 className="font-display text-lg font-bold text-[#1A1D20] leading-snug mb-2">
                    {challenge.prompt}
                  </h2>
                  <p className="text-xs font-semibold text-slate-500 mb-4">
                    Cenário: {challenge.situation}
                  </p>

                  {/* Answer Tray */}
                  <div className="min-h-[124px] bg-white border-[2.5px] border-dashed border-[#1A1D20] rounded-2xl p-3.5 mb-5 flex flex-wrap gap-2 content-start">
                    {selectedBlocks.length === 0 ? (
                      <span className="text-xs font-semibold text-slate-400 m-auto">
                        Toque nos blocos abaixo na ordem correta...
                      </span>
                    ) : (
                      selectedBlocks.map((block, idx) => (
                        <motion.button
                          layout
                          key={`chosen-${block}`}
                          initial={{ scale: 0.85, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          disabled={isChecked}
                          onClick={() => handleToggleCnvBlock(block)}
                          className="bg-[#E1F5FE] border-2 border-[#1A1D20] shadow-[0px_3px_0px_#1A1D20] px-3 py-2 rounded-xl text-xs font-bold text-[#1A1D20] cursor-pointer text-left"
                        >
                          <span className="text-[#0288D1] mr-1">{idx + 1}.</span>
                          {block}
                        </motion.button>
                      ))
                    )}
                  </div>

                  {/* Available Chips Bank */}
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
                              ? 'bg-[#E0E4E8] border-slate-300 text-transparent select-none cursor-default'
                              : 'bg-white border-[#1A1D20] shadow-[0px_3px_0px_#1A1D20] text-[#1A1D20] hover:bg-[#FFF8E1] cursor-pointer'
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

              {/* FORMAT 4: MINI-ROLEPLAY (2 TURNS) */}
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
                className="bg-white border-t-[2.5px] border-[#1A1D20] p-4 pb-safe"
              >
                <TactileButton
                  variant="green"
                  size="lg"
                  fullWidth
                  disabled={!canCheck}
                  onClick={handleCheck}
                >
                  Verificar Resposta
                </TactileButton>
              </motion.div>
            ) : (
              <motion.div
                key="feedback-sheet"
                initial={{ y: 120 }}
                animate={{ y: 0 }}
                exit={{ y: 120 }}
                transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                className={`border-t-[3px] p-4 pb-safe ${
                  isCorrect
                    ? 'bg-[#E8F5E9] border-[#43B02A]'
                    : 'bg-[#FFEBEE] border-[#FF5252]'
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <CoalaMascot
                    mood={isCorrect ? 'celebrating' : 'stressed'}
                    size={62}
                    className="shrink-0 -mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-display text-lg font-bold flex items-center gap-1.5 ${
                        isCorrect ? 'text-[#2D7A1C]' : 'text-[#C62828]'
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
                        isCorrect ? 'text-[#1B5E20]' : 'text-[#8E1C1C]'
                      }`}
                    >
                      {challenge.explanation}
                    </p>
                  </div>
                </div>

                <TactileButton
                  variant={isCorrect ? 'green' : 'coral'}
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

/* Subcomponent for Format 3: Emotion Thermometer */
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
      <span className="inline-block bg-[#FFF3E0] border-2 border-[#1A1D20] px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider text-[#FF6D00] mb-2">
        TERMÔMETRO DE EMOÇÃO
      </span>
      <h2 className="font-display text-lg font-bold text-[#1A1D20] leading-snug mb-4">
        {challenge.prompt}
      </h2>

      {/* Realistic Message Card */}
      <TactileCard className="p-4 mb-6">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#29B6F6] border-2 border-[#1A1D20] flex items-center justify-center font-display font-bold text-white text-sm">
              {challenge.messageSender.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-sm text-[#1A1D20] leading-tight">
                {challenge.messageSender}
              </p>
              <p className="text-[11px] font-semibold text-slate-500">{challenge.messageRole}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-lg text-[10px] font-extrabold text-slate-600">
            <ChannelIcon size={11} /> {challenge.messageChannel}
          </span>
        </div>
        <p className="text-sm font-medium text-[#1A1D20] leading-relaxed italic">
          "{challenge.messageBody}"
        </p>
      </TactileCard>

      {/* Calibrated Thermometer Display */}
      <TactileCard className="p-4">
        <div className="text-center mb-4">
          <motion.div
            key={value}
            initial={{ scale: 0.75 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 450, damping: 18 }}
            className="text-5xl mb-1"
          >
            {THERMOMETER_EMOJIS[value]}
          </motion.div>
          <span
            className="inline-block font-display text-base font-bold px-3.5 py-1 rounded-full border-2 border-[#1A1D20] text-white"
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
          className="w-full accent-[#1A1D20] h-3 rounded-lg cursor-pointer mb-3"
        />

        <div className="grid grid-cols-5 gap-1">
          {challenge.scaleLabels.map((label, idx) => (
            <button
              key={label}
              disabled={isChecked}
              onClick={() => onChange(idx)}
              className={`py-1.5 px-1 rounded-xl text-[10px] font-extrabold text-center border-2 transition-all cursor-pointer ${
                value === idx
                  ? 'bg-[#1A1D20] text-white border-[#1A1D20]'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-[#1A1D20]'
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

/* Subcomponent for Format 4: Mini-Roleplay (2 turns) */
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
      <span className="inline-block bg-[#E8F5E9] border-2 border-[#1A1D20] px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider text-[#2D7A1C] mb-2">
        MINI-ROLEPLAY • 2 TURNOS
      </span>
      <h2 className="font-display text-lg font-bold text-[#1A1D20] leading-snug mb-4">
        {challenge.prompt}
      </h2>

      {/* Chat Thread */}
      <div className="space-y-3 mb-5">
        {/* Turn 1 Incoming */}
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#7C4DFF] border-2 border-[#1A1D20] text-white font-display font-bold text-xs flex items-center justify-center shrink-0">
            {challenge.personaInitials}
          </div>
          <div className="bg-white border-2 border-[#1A1D20] shadow-[0px_3px_0px_#1A1D20] rounded-2xl rounded-tl-sm p-3.5 max-w-[85%]">
            <p className="text-[10px] font-extrabold text-[#7C4DFF] uppercase mb-0.5">
              {challenge.personaName} • {challenge.personaRole}
            </p>
            <p className="text-sm font-medium text-[#1A1D20] leading-snug">
              {challenge.turns[0].incoming}
            </p>
          </div>
        </div>

        {/* User Reply 1 */}
        {choices[0] && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-end gap-1"
          >
            <div className="bg-[#29B6F6] border-2 border-[#1A1D20] shadow-[0px_3px_0px_#1A1D20] rounded-2xl rounded-tr-sm p-3.5 max-w-[85%] text-white text-sm font-semibold">
              {choices[0].text}
            </div>
            <span
              className={`text-[11px] font-bold px-2 ${
                choices[0].isIdeal ? 'text-[#2D7A1C]' : 'text-[#C62828]'
              }`}
            >
              {choices[0].feedback}
            </span>
          </motion.div>
        )}

        {/* Turn 2 Incoming */}
        {currentTurn === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2.5"
          >
            <div className="w-9 h-9 rounded-full bg-[#7C4DFF] border-2 border-[#1A1D20] text-white font-display font-bold text-xs flex items-center justify-center shrink-0">
              {challenge.personaInitials}
            </div>
            <div className="bg-white border-2 border-[#1A1D20] shadow-[0px_3px_0px_#1A1D20] rounded-2xl rounded-tl-sm p-3.5 max-w-[85%]">
              <p className="text-sm font-medium text-[#1A1D20] leading-snug">
                {challenge.turns[1].incoming}
              </p>
            </div>
          </motion.div>
        )}

        {/* User Reply 2 */}
        {choices[1] && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-end gap-1"
          >
            <div className="bg-[#29B6F6] border-2 border-[#1A1D20] shadow-[0px_3px_0px_#1A1D20] rounded-2xl rounded-tr-sm p-3.5 max-w-[85%] text-white text-sm font-semibold">
              {choices[1].text}
            </div>
            <span
              className={`text-[11px] font-bold px-2 ${
                choices[1].isIdeal ? 'text-[#2D7A1C]' : 'text-[#C62828]'
              }`}
            >
              {choices[1].feedback}
            </span>
          </motion.div>
        )}
      </div>

      {/* Options for current turn */}
      {needsPick && !isChecked && (
        <div className="space-y-2.5">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            Sua resposta (Turno {currentTurn + 1} de 2):
          </p>
          {activeTurnData.options.map((opt, idx) => (
            <motion.button
              key={idx}
              whileTap={{ y: 2 }}
              onClick={() => onPick(opt)}
              className="w-full tactile-card-interactive p-3.5 text-left text-sm font-semibold text-[#1A1D20] hover:bg-[#E1F5FE]/50"
            >
              {opt.text}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
