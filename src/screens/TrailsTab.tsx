import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lock, Star, Play, Clock, Sparkles, BookOpen } from 'lucide-react';
import { CURRICULUM_UNITS, ALL_LESSONS, type CurriculumLesson } from '../data/curriculum';
import { useAppStore } from '../store/useAppStore';
import { CoalaMascot } from '../components/CoalaMascot';
import { TactileButton } from '../components/ui/TactileUI';
import { soundFX } from '../utils/soundEffects';

interface TrailsTabProps {
  onSelectLesson: (lesson: CurriculumLesson) => void;
}

const S_CURVE_OFFSETS = [0, 62, 16, -58];

const UNIT_PALETTE = [
  { bg: '#58CC02', shadow: '#46A302' },
  { bg: '#1CB0F6', shadow: '#1899D6' },
  { bg: '#7C4DFF', shadow: '#5E35D6' },
];

export function TrailsTab({ onSelectLesson }: TrailsTabProps) {
  const { completedLessons } = useAppStore();
  const [previewLessonId, setPreviewLessonId] = useState<string | null>(null);

  const activeLesson =
    ALL_LESSONS.find((l) => !completedLessons.includes(l.id)) ||
    ALL_LESSONS[ALL_LESSONS.length - 1];

  return (
    <div className="px-4 pt-5 pb-12 relative">
      {CURRICULUM_UNITS.map((unit, uIdx) => {
        const unitCompletedCount = unit.lessons.filter((l) =>
          completedLessons.includes(l.id)
        ).length;
        const theme = UNIT_PALETTE[uIdx % UNIT_PALETTE.length];

        return (
          <section key={unit.id} id={`unit-${unit.id}`} className="mb-10">
            {/* Clean Modern Duolingo Unit Banner */}
            <div
              className="rounded-2xl p-4 mb-9 text-white relative overflow-hidden"
              style={{
                backgroundColor: theme.bg,
                boxShadow: `0px 4px 0px ${theme.shadow}`,
              }}
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/12 pointer-events-none" />
              <div className="flex items-start justify-between gap-3 relative z-10">
                <div>
                  <span className="inline-block text-[10px] font-extrabold tracking-widest uppercase text-white/85 mb-1">
                    {unit.badgeText} • {unitCompletedCount}/{unit.lessons.length} CONCLUÍDAS
                  </span>
                  <h2 className="font-display text-lg font-black leading-tight">{unit.title}</h2>
                  <p className="text-xs font-medium text-white/90 mt-1 leading-snug">
                    {unit.subtitle}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <BookOpen size={19} strokeWidth={2.4} className="text-white" />
                </div>
              </div>
            </div>

            {/* Winding S-Curve Path */}
            <div className="relative flex flex-col items-center">
              {unit.lessons.map((lesson, idx) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isCurrent = activeLesson.id === lesson.id;
                const globalIndex = ALL_LESSONS.findIndex((l) => l.id === lesson.id);
                const prevLesson = globalIndex > 0 ? ALL_LESSONS[globalIndex - 1] : null;
                const isLocked =
                  !isCompleted &&
                  !isCurrent &&
                  prevLesson !== null &&
                  !completedLessons.includes(prevLesson.id);

                const offsetX = S_CURVE_OFFSETS[idx % S_CURVE_OFFSETS.length];
                const nextOffsetX =
                  idx < unit.lessons.length - 1
                    ? S_CURVE_OFFSETS[(idx + 1) % S_CURVE_OFFSETS.length]
                    : offsetX;

                const isPreviewOpen = previewLessonId === lesson.id;

                return (
                  <div
                    key={lesson.id}
                    className="relative flex flex-col items-center w-full"
                    style={{ marginBottom: idx < unit.lessons.length - 1 ? '34px' : '8px' }}
                  >
                    {/* Minimalist Curved SVG Path Connector */}
                    {idx < unit.lessons.length - 1 && (
                      <svg
                        width="240"
                        height="68"
                        viewBox="-120 0 240 68"
                        className="absolute top-[56px] pointer-events-none z-0 overflow-visible"
                      >
                        <path
                          d={`M ${offsetX} 8 C ${offsetX} 38, ${nextOffsetX} 30, ${nextOffsetX} 64`}
                          fill="none"
                          stroke={isCompleted ? '#58CC02' : '#E2E8F0'}
                          strokeWidth="7"
                          strokeLinecap="round"
                          strokeDasharray={isCompleted ? undefined : '8 9'}
                        />
                      </svg>
                    )}

                    {/* Node Wrapper */}
                    <div
                      className="relative z-10 flex items-center justify-center"
                      style={{ transform: `translateX(${offsetX}px)` }}
                    >
                      {/* Clean Duolingo "COMEÇAR" Speech Bubble */}
                      {isCurrent && !isPreviewOpen && (
                        <motion.div
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                          className="absolute -top-11 bg-white border-2 border-[#E5E7EB] shadow-sm px-3.5 py-1 rounded-xl whitespace-nowrap z-20"
                        >
                          <span className="font-display text-xs font-black text-[#58CC02] tracking-wider">
                            COMEÇAR
                          </span>
                          <div className="w-2.5 h-2.5 bg-white border-r-2 border-b-2 border-[#E5E7EB] rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-[6px]" />
                        </motion.div>
                      )}

                      {/* Coala Companion floating beside active node */}
                      {isCurrent && (
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 pointer-events-none z-20 ${
                            offsetX >= 0 ? '-left-[100px]' : '-right-[100px]'
                          }`}
                        >
                          <CoalaMascot
                            mood="pointing"
                            size={84}
                            className={offsetX < 0 ? '-scale-x-100' : ''}
                          />
                        </div>
                      )}

                      {/* Soft Progress Ring */}
                      {isCurrent && (
                        <motion.div
                          animate={{ scale: [1, 1.1, 1], opacity: [0.85, 0.35, 0.85] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                          className="absolute inset-[-9px] rounded-full border-[3.5px] border-[#58CC02]/45 pointer-events-none"
                        />
                      )}

                      {/* Modern Duolingo 3D Circular Stepping Stone (Same-hue depth) */}
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
                        className={`
                          relative w-[72px] h-[72px] rounded-full flex items-center justify-center cursor-pointer transition-all
                          ${
                            isCompleted
                              ? 'bg-[#FFC800] shadow-[0px_6px_0px_#E5A400] active:shadow-[0px_2px_0px_#E5A400] text-white'
                              : isCurrent
                                ? 'bg-[#58CC02] shadow-[0px_6px_0px_#46A302] active:shadow-[0px_2px_0px_#46A302] text-white'
                                : 'bg-[#E5E7EB] shadow-[0px_5px_0px_#D1D5DB] text-[#9CA3AF] cursor-not-allowed'
                          }
                        `}
                      >
                        <div className="absolute top-1.5 left-3.5 right-3.5 h-2.5 rounded-full bg-white/30 pointer-events-none" />

                        {isCompleted ? (
                          <Check size={32} strokeWidth={3.8} />
                        ) : isCurrent ? (
                          <Star size={32} fill="#FFFFFF" stroke="#FFFFFF" strokeWidth={1.8} />
                        ) : (
                          <Lock size={24} strokeWidth={2.4} />
                        )}
                      </motion.button>
                    </div>

                    {/* Clean Minimalist Title beneath Node */}
                    <div
                      className="mt-2.5 text-center max-w-[170px]"
                      style={{ transform: `translateX(${offsetX}px)` }}
                    >
                      <span
                        className={`text-xs font-bold leading-tight ${
                          isLocked ? 'text-slate-400' : 'text-slate-700'
                        }`}
                      >
                        {lesson.title}
                      </span>
                    </div>

                    {/* Apple-crisp Lesson Start Popover */}
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
                              <h3 className="font-display text-base font-black text-slate-800 leading-tight mt-0.5">
                                {lesson.title}
                              </h3>
                            </div>
                            <span className="inline-flex items-center gap-1 bg-[#FFF8DC] px-2.5 py-0.5 rounded-full text-xs font-extrabold text-[#B8860B] shrink-0">
                              <Sparkles size={11} /> +{lesson.xpReward}
                            </span>
                          </div>

                          <p className="text-xs font-medium text-slate-500 mb-4 leading-relaxed">
                            {lesson.subtitle}
                          </p>

                          <TactileButton
                            variant={isCompleted ? 'gold' : 'green'}
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
            </div>
          </section>
        );
      })}
    </div>
  );
}
