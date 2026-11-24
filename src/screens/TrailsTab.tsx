import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Star, Play, Clock, Sparkles, BookOpen, Gift, Check } from 'lucide-react';
import {
  getPersonalizedUnits,
  getPersonalizedLessons,
  type CurriculumLesson,
} from '../data/curriculum';
import { useAppStore } from '../store/useAppStore';
import { CoalaMascot } from '../components/CoalaMascot';
import { LessonNode } from '../components/LessonNode';
import { TactileButton } from '../components/ui/TactileUI';
import { soundFX } from '../utils/soundEffects';

interface TrailsTabProps {
  onSelectLesson: (lesson: CurriculumLesson) => void;
}

/** Mobile-safe S-curve horizontal offsets (strictly <= ±40px so Coala never clips on 320px-390px) */
const S_CURVE_OFFSETS = [0, -28, -40, -16];

/** Solid Vibrant Duolingo-Style Unit Banners (Static Color + 3D Bottom Ledge) */
const UNIT_SOLID_THEMES = [
  { bg: '#1CB0F6', ledge: '#1484B8' },
  { bg: '#00CD9C', ledge: '#009E77' },
  { bg: '#58CC02', ledge: '#46A302' },
  { bg: '#CE82FF', ledge: '#A55EEA' },
];

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
      colors: ['#FFD54F', '#10E8A2', '#29B6F6', '#CE82FF'],
    });
    setChestToast(`Baú aberto! +${rewardXp} XP bônus!`);
    setTimeout(() => setChestToast(null), 2600);
  };

  return (
    <div className="px-4 pt-4 pb-16 relative">
      {/* Floating Chest Bonus Toast */}
      <AnimatePresence>
        {chestToast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-[#FFD54F] to-[#FFB300] text-[#1C1200] font-display text-xs font-black px-4 py-2 rounded-2xl shadow-xl flex items-center gap-1.5"
          >
            <Gift size={15} /> {chestToast}
          </motion.div>
        )}
      </AnimatePresence>

      {units.map((unit, uIdx) => {
        const unitCompletedCount = unit.lessons.filter((l) =>
          completedLessons.includes(l.id)
        ).length;
        const unitAllDone = unitCompletedCount === unit.lessons.length;
        const unitProgress =
          unit.lessons.length > 0 ? Math.max(0.22, unitCompletedCount / unit.lessons.length) : 0.3;
        const chestId = `chest-${unit.id}`;
        const isChestClaimed = claimedChests.includes(chestId);

        return (
          <section key={unit.id} id={`unit-${unit.id}`} className="mb-14">
            {/* Solid Bold Unit Banner with Right Guidebook Divider */}
            <div
              className="rounded-2xl mb-12 text-white overflow-hidden flex items-stretch"
              style={{
                backgroundColor: UNIT_SOLID_THEMES[uIdx % UNIT_SOLID_THEMES.length].bg,
                boxShadow: `0 4px 0 ${UNIT_SOLID_THEMES[uIdx % UNIT_SOLID_THEMES.length].ledge}`,
              }}
            >
              <div className="flex-1 px-4 py-4">
                <span className="block text-[11px] font-extrabold tracking-wider uppercase text-white/90 mb-0.5">
                  {unit.sectionLabel}
                </span>
                <h2 className="font-display text-[17px] font-black leading-snug text-white">
                  {unit.title}
                </h2>
              </div>
              <div className="w-14 border-l-2 border-black/15 flex items-center justify-center shrink-0 bg-black/5">
                <BookOpen size={21} strokeWidth={2.4} className="text-white" />
              </div>
            </div>

            {/* Winding S-Curve Stepping Stone Path with Generous Collision-Free Spacing */}
            <div className="relative flex flex-col items-center gap-11">
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
                    className={`relative flex flex-col items-center w-full ${
                      isCurrent && idx > 0 ? 'mt-4' : ''
                    }`}
                  >
                    {/* Node + Side Mascot Row */}
                    <div
                      className="relative z-10 flex items-center justify-center"
                      style={{ transform: `translateX(${offsetX}px)` }}
                    >
                      <LessonNode
                        lessonId={lesson.id}
                        isCompleted={isCompleted}
                        isCurrent={isCurrent}
                        isLocked={isLocked}
                        isPreviewOpen={isPreviewOpen}
                        showRefreshIcon={idx === 2}
                        ringProgress={unitProgress}
                        onClick={() => setPreviewLessonId(isPreviewOpen ? null : lesson.id)}
                      />

                      {/* Coala Companion with Centered 3 Stars (Zero Horizontal Overflow on 320px+) */}
                      {idx === 1 && (
                        <div className="absolute left-[104px] top-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-[92px] pointer-events-none select-none">
                          <div className="relative w-[88px] h-[88px] rounded-full bg-[#1B2B34] border-2 border-[#2C3E47] flex items-center justify-center">
                            <CoalaMascot
                              pose={
                                unitAllDone
                                  ? 'celebrating'
                                  : isCurrent
                                    ? 'encouraging'
                                    : 'waving'
                              }
                              size={82}
                              className="relative z-10"
                            />
                          </div>
                          <div className="flex items-center justify-center gap-1 mt-1.5 w-full">
                            {[0, 1, 2].map((starIdx) => {
                              const earned = unitCompletedCount > starIdx;
                              return (
                                <Star
                                  key={starIdx}
                                  size={14}
                                  fill={earned ? '#FFC800' : '#26353D'}
                                  stroke={earned ? '#E5A400' : '#26353D'}
                                />
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Clean Lesson Label directly below the 104x104 concentric container */}
                    <div
                      className="mt-1.5 text-center max-w-[170px]"
                      style={{ transform: `translateX(${offsetX}px)` }}
                    >
                      <span
                        className={`text-xs font-bold leading-tight ${
                          isLocked ? 'text-white/35' : 'text-white/90'
                        }`}
                      >
                        {lesson.title}
                      </span>
                    </div>

                    {/* Liquid Glass Start Lesson Popover */}
                    <AnimatePresence>
                      {isPreviewOpen && !isLocked && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                          className="w-full max-w-[315px] mt-3 liquid-glass rounded-3xl p-4 z-30"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-sky-300">
                                <Clock size={11} /> {lesson.durationLabel} •{' '}
                                {lesson.challenges.length} desafios
                              </span>
                              <h3 className="font-display text-base font-black text-white leading-tight mt-0.5">
                                {lesson.title}
                              </h3>
                            </div>
                            <span className="inline-flex items-center gap-1 bg-[#FFD54F]/15 border border-[#FFD54F]/30 px-2.5 py-0.5 rounded-full text-xs font-extrabold text-[#FFD54F] shrink-0">
                              <Sparkles size={11} /> +{lesson.xpReward}
                            </span>
                          </div>

                          <p className="text-xs font-medium text-slate-300 mb-4 leading-relaxed">
                            {lesson.subtitle}
                          </p>

                          <TactileButton
                            variant={isCompleted ? 'gold' : 'blue'}
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

              {/* Interactive Treasure Chest Milestone */}
              <div className="relative flex flex-col items-center pt-2">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  animate={
                    unitAllDone && !isChestClaimed
                      ? { y: [0, -5, 0], rotate: [-2, 2, -2] }
                      : undefined
                  }
                  transition={{ duration: 1.5, repeat: Infinity }}
                  onClick={() => handleOpenChest(chestId, unit.chestRewardXp, unitAllDone)}
                  className="relative cursor-pointer focus:outline-none p-2.5 rounded-3xl liquid-glass-subtle"
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
                    <span className="absolute -top-2 -right-3 bg-gradient-to-r from-[#CE82FF] to-[#6366F1] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
                      +{unit.chestRewardXp} XP
                    </span>
                  )}
                  {isChestClaimed && (
                    <span className="absolute -top-1 -right-2 w-6 h-6 rounded-full bg-[#00E676] text-[#05120A] flex items-center justify-center">
                      <Check size={14} strokeWidth={3.5} />
                    </span>
                  )}
                </motion.button>
                <span className="text-[11px] font-bold text-white/45 mt-2">
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

function TreasureChestSvg({ unlocked, claimed }: { unlocked: boolean; claimed: boolean }) {
  const bodyColor = claimed ? '#00BFA5' : unlocked ? '#FFB300' : '#334652';
  const lidColor = claimed ? '#10E8A2' : unlocked ? '#FFD54F' : '#435866';
  const trimColor = claimed ? '#00796B' : unlocked ? '#B27B00' : '#1E2C35';

  return (
    <svg width="68" height="56" viewBox="0 0 74 62" fill="none">
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
