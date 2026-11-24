import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Lock, Star, Play, Clock, Sparkles, BookOpen, RefreshCw, Gift, Check } from 'lucide-react';
import { getPersonalizedUnits, getPersonalizedLessons, type CurriculumLesson } from '../data/curriculum';
import { useAppStore } from '../store/useAppStore';
import { CoalaMascot } from '../components/CoalaMascot';
import { TactileButton } from '../components/ui/TactileUI';
import { soundFX } from '../utils/soundEffects';

interface TrailsTabProps {
  onSelectLesson: (lesson: CurriculumLesson) => void;
}

/** Duolingo-style gentle S-curve horizontal offsets */
const S_CURVE_OFFSETS = [0, -36, -54, -22];

export function TrailsTab({ onSelectLesson }: TrailsTabProps) {
  const { completedLessons, claimedChests, userArea, claimChest } = useAppStore();
  const [previewLessonId, setPreviewLessonId] = useState<string | null>(null);
  const [chestToast, setChestToast] = useState<string | null>(null);

  const units = getPersonalizedUnits(userArea);
  const allLessons = getPersonalizedLessons(userArea);

  const activeLesson =
    allLessons.find((l) => !completedLessons.includes(l.id)) || allLessons[allLessons.length - 1];

  const handleOpenChest = (chestId: string, rewardXp: number, unlocked: boolean) => {
    if (!unlocked) {
      soundFX.playWrong();
      return;
    }
    if (claimedChests.includes(chestId)) {
      soundFX.playTap();
      return;
    }
    claimChest(chestId, rewardXp);
    soundFX.playVictory();
    confetti({
      particleCount: 70,
      spread: 65,
      origin: { y: 0.6 },
      colors: ['#FFC800', '#00CD9C', '#1CB0F6', '#CE82FF'],
    });
    setChestToast(`Baú aberto! +${rewardXp} XP bônus!`);
    setTimeout(() => setChestToast(null), 2600);
  };

  return (
    <div className="px-4 pt-4 pb-12 relative">
      {/* Floating Chest Bonus Toast */}
      <AnimatePresence>
        {chestToast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#FFC800] text-[#131F24] font-display text-xs font-black px-4 py-2 rounded-2xl shadow-xl flex items-center gap-1.5"
          >
            <Gift size={15} /> {chestToast}
          </motion.div>
        )}
      </AnimatePresence>

      {units.map((unit) => {
        const unitCompletedCount = unit.lessons.filter((l) =>
          completedLessons.includes(l.id)
        ).length;
        const unitAllDone = unitCompletedCount === unit.lessons.length;
        const chestId = `chest-${unit.id}`;
        const isChestClaimed = claimedChests.includes(chestId);

        return (
          <section key={unit.id} id={`unit-${unit.id}`} className="mb-12">
            {/* Authentic Duolingo Unit Banner with Right Guidebook Divider */}
            <div
              className="rounded-2xl mb-10 text-white overflow-hidden flex items-stretch"
              style={{
                backgroundColor: unit.accentColor,
                boxShadow: `0px 4px 0px ${unit.shadowColor}`,
              }}
            >
              <div className="flex-1 px-4 py-3.5">
                <span className="block text-[11px] font-extrabold tracking-wider uppercase text-white/85 mb-0.5">
                  {unit.sectionLabel}
                </span>
                <h2 className="font-display text-[17px] font-black leading-snug text-white">
                  {unit.title}
                </h2>
              </div>
              <div className="w-14 border-l-2 border-black/15 flex items-center justify-center shrink-0 bg-black/5">
                <BookOpen size={22} strokeWidth={2.4} className="text-white" />
              </div>
            </div>

            {/* Winding S-Curve Stepping Stone Path */}
            <div className="relative flex flex-col items-center">
              {unit.lessons.map((lesson, idx) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isCurrent = activeLesson.id === lesson.id;
                const globalIndex = allLessons.findIndex((l) => l.id === lesson.id);
                const prevLesson = globalIndex > 0 ? allLessons[globalIndex - 1] : null;
                const isLocked =
                  !isCompleted &&
                  !isCurrent &&
                  prevLesson !== null &&
                  !completedLessons.includes(prevLesson.id);

                const offsetX = S_CURVE_OFFSETS[idx % S_CURVE_OFFSETS.length];
                const isPreviewOpen = previewLessonId === lesson.id;

                return (
                  <div
                    key={lesson.id}
                    className="relative flex flex-col items-center w-full mb-7"
                  >
                    {/* Node Row */}
                    <div
                      className="relative z-10 flex items-center justify-center"
                      style={{ transform: `translateX(${offsetX}px)` }}
                    >
                      {/* Floating "COMEÇAR" Bubble above active node */}
                      {isCurrent && !isPreviewOpen && (
                        <motion.div
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                          className="absolute -top-12 bg-[#1B2B34] border-2 border-[#37464F] px-3.5 py-1 rounded-xl whitespace-nowrap z-20 shadow-lg"
                        >
                          <span
                            className="font-display text-xs font-black tracking-wider"
                            style={{ color: unit.accentColor }}
                          >
                            COMEÇAR
                          </span>
                          <div className="w-2.5 h-2.5 bg-[#1B2B34] border-r-2 border-b-2 border-[#37464F] rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-[6px]" />
                        </motion.div>
                      )}

                      {/* Coala Companion on Dark Oval Platform with 3 Stars (Reference Style!) */}
                      {idx === 1 && (
                        <div className="absolute left-[104px] top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none select-none">
                          <div className="relative flex items-center justify-center">
                            <div className="absolute bottom-1 w-24 h-10 rounded-full bg-[#24343D] -rotate-6" />
                            <CoalaMascot
                              mood={unitAllDone ? 'celebrating' : isCurrent ? 'pointing' : 'happy'}
                              size={88}
                              className="relative z-10"
                            />
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {[0, 1, 2].map((starIdx) => (
                              <Star
                                key={starIdx}
                                size={13}
                                fill={unitCompletedCount > starIdx ? '#FFC800' : '#2C3C45'}
                                stroke={unitCompletedCount > starIdx ? '#E5A400' : '#2C3C45'}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Segmented Progress Ring around Active Node (Reference Style!) */}
                      {isCurrent && (
                        <svg
                          width="98"
                          height="98"
                          viewBox="0 0 98 98"
                          className="absolute pointer-events-none"
                        >
                          <circle
                            cx="49"
                            cy="49"
                            r="43"
                            fill="none"
                            stroke="#2A3942"
                            strokeWidth="6"
                            strokeDasharray="62 12"
                            strokeLinecap="round"
                          />
                          <motion.circle
                            cx="49"
                            cy="49"
                            r="43"
                            fill="none"
                            stroke={unit.accentColor}
                            strokeWidth="6"
                            strokeDasharray="115 160"
                            strokeLinecap="round"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                            style={{ originX: '49px', originY: '49px' }}
                          />
                        </svg>
                      )}

                      {/* 3D Duolingo Cylinder Node */}
                      <motion.button
                        whileTap={isLocked ? { x: [-3, 3, -2, 0] } : { y: 4 }}
                        onClick={() => {
                          if (isLocked) {
                            soundFX.playWrong();
                            return;
                          }
                          soundFX.playTap();
                          setPreviewLessonId(isPreviewOpen ? null : lesson.id);
                        }}
                        style={
                          isCompleted
                            ? {
                                backgroundColor: '#FFC800',
                                boxShadow: '0px 7px 0px #CC9600',
                              }
                            : isCurrent
                              ? {
                                  backgroundColor: unit.accentColor,
                                  boxShadow: `0px 7px 0px ${unit.shadowColor}`,
                                }
                              : {
                                  backgroundColor: '#37464F',
                                  boxShadow: '0px 6px 0px #243138',
                                }
                        }
                        className={`relative w-[72px] h-[68px] rounded-full flex items-center justify-center cursor-pointer transition-transform ${
                          isLocked ? 'cursor-not-allowed' : ''
                        }`}
                      >
                        {/* Glossy top arc */}
                        <div className="absolute top-1.5 left-4 right-4 h-2.5 rounded-full bg-white/25 pointer-events-none" />

                        {isCompleted ? (
                          <Star size={32} fill="#B87D00" stroke="#B87D00" strokeWidth={1.5} />
                        ) : isCurrent ? (
                          idx === 2 ? (
                            <RefreshCw size={28} strokeWidth={3} className="text-white" />
                          ) : (
                            <Star size={32} fill="#FFFFFF" stroke="#FFFFFF" strokeWidth={1.5} />
                          )
                        ) : (
                          <Lock size={24} strokeWidth={2.5} className="text-[#52656D]" />
                        )}
                      </motion.button>
                    </div>

                    {/* Subtle Title under Node */}
                    <div
                      className="mt-2.5 text-center max-w-[165px]"
                      style={{ transform: `translateX(${offsetX}px)` }}
                    >
                      <span
                        className={`text-[11px] font-bold leading-tight ${
                          isLocked ? 'text-[#52656D]' : 'text-slate-300'
                        }`}
                      >
                        {lesson.title}
                      </span>
                    </div>

                    {/* Dark Tactile Start Lesson Popover */}
                    <AnimatePresence>
                      {isPreviewOpen && !isLocked && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                          className="w-full max-w-[315px] mt-3 tactile-card p-4 z-30"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                <Clock size={11} /> {lesson.durationLabel} •{' '}
                                {lesson.challenges.length} desafios
                              </span>
                              <h3 className="font-display text-base font-black text-white leading-tight mt-0.5">
                                {lesson.title}
                              </h3>
                            </div>
                            <span className="inline-flex items-center gap-1 bg-[#FFC800]/15 px-2.5 py-0.5 rounded-full text-xs font-extrabold text-[#FFC800] shrink-0">
                              <Sparkles size={11} /> +{lesson.xpReward}
                            </span>
                          </div>

                          <p className="text-xs font-medium text-slate-400 mb-4 leading-relaxed">
                            {lesson.subtitle}
                          </p>

                          <TactileButton
                            variant={isCompleted ? 'gold' : 'mint'}
                            size="md"
                            fullWidth
                            onClick={() => {
                              setPreviewLessonId(null);
                              onSelectLesson(lesson);
                            }}
                          >
                            <Play size={15} fill="currentColor" />
                            {isCompleted ? 'Praticar Novamente' : 'Iniciar Lição'}
                          </TactileButton>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Interactive Treasure Chest Milestone (Reference Style!) */}
              <div className="relative flex flex-col items-center mt-1">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  animate={
                    unitAllDone && !isChestClaimed
                      ? { y: [0, -5, 0], rotate: [-2, 2, -2] }
                      : undefined
                  }
                  transition={{ duration: 1.5, repeat: Infinity }}
                  onClick={() => handleOpenChest(chestId, unit.chestRewardXp, unitAllDone)}
                  className="relative cursor-pointer focus:outline-none"
                  title={
                    isChestClaimed
                      ? 'Baú já resgatado'
                      : unitAllDone
                        ? `Abrir baú (+${unit.chestRewardXp} XP)`
                        : 'Conclua as lições da unidade para abrir'
                  }
                >
                  <TreasureChestSvg unlocked={unitAllDone} claimed={isChestClaimed} />
                  {unitAllDone && !isChestClaimed && (
                    <span className="absolute -top-2 -right-3 bg-[#CE82FF] text-[#131F24] text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
                      +{unit.chestRewardXp} XP
                    </span>
                  )}
                  {isChestClaimed && (
                    <span className="absolute -top-1 -right-2 w-6 h-6 rounded-full bg-[#58CC02] text-[#131F24] flex items-center justify-center">
                      <Check size={14} strokeWidth={3.5} />
                    </span>
                  )}
                </motion.button>
                <span className="text-[10px] font-bold text-[#52656D] mt-1.5">
                  {isChestClaimed
                    ? 'Recompensa resgatada'
                    : unitAllDone
                      ? 'Toque para abrir!'
                      : `Baú da Unidade (+${unit.chestRewardXp} XP)`}
                </span>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

/** Duolingo-style 3D Treasure Chest SVG */
function TreasureChestSvg({ unlocked, claimed }: { unlocked: boolean; claimed: boolean }) {
  const bodyColor = claimed ? '#46A302' : unlocked ? '#FFC800' : '#465863';
  const lidColor = claimed ? '#58CC02' : unlocked ? '#FFD84D' : '#586D7A';
  const trimColor = claimed ? '#2D6B00' : unlocked ? '#CC9600' : '#2C3A42';

  return (
    <svg width="74" height="62" viewBox="0 0 74 62" fill="none">
      <rect x="6" y="24" width="62" height="32" rx="8" fill={trimColor} />
      <rect x="6" y="20" width="62" height="30" rx="8" fill={bodyColor} />
      <path d="M8 20 C8 10, 66 10, 66 20 L66 28 L8 28 Z" fill={lidColor} />
      <rect x="6" y="24" width="62" height="6" fill={trimColor} opacity="0.45" />
      <rect x="18" y="13" width="8" height="37" rx="2" fill={trimColor} opacity="0.35" />
      <rect x="48" y="13" width="8" height="37" rx="2" fill={trimColor} opacity="0.35" />
      <rect x="31" y="22" width="12" height="13" rx="3" fill={trimColor} />
      <circle cx="37" cy="28" r="2.5" fill="#FFFFFF" opacity={unlocked ? 0.95 : 0.35} />
    </svg>
  );
}
