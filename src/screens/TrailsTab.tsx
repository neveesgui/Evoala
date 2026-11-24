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

/** Smooth S-curve horizontal offset pattern (in px from center) */
const S_CURVE_OFFSETS = [0, 66, 18, -62];

export function TrailsTab({ onSelectLesson }: TrailsTabProps) {
  const { completedLessons } = useAppStore();
  const [previewLessonId, setPreviewLessonId] = useState<string | null>(null);

  // Determine the single global "current" active lesson (first incomplete lesson)
  const activeLesson =
    ALL_LESSONS.find((l) => !completedLessons.includes(l.id)) ||
    ALL_LESSONS[ALL_LESSONS.length - 1];

  return (
    <div className="px-4 pt-5 pb-10 relative">
      {CURRICULUM_UNITS.map((unit) => {
        const unitCompletedCount = unit.lessons.filter((l) =>
          completedLessons.includes(l.id)
        ).length;

        return (
          <section key={unit.id} id={`unit-${unit.id}`} className="mb-10">
            {/* Unit Banner (Neo-Brutalist Tactile Card) */}
            <div
              className="rounded-3xl border-[2.5px] border-[#1A1D20] shadow-[0px_5px_0px_#1A1D20] p-4 mb-8 text-white relative overflow-hidden"
              style={{ backgroundColor: unit.accentColor }}
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/15 pointer-events-none" />
              <div className="flex items-start justify-between gap-3 relative z-10">
                <div>
                  <span className="inline-block bg-[#1A1D20]/25 border border-white/30 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase mb-1.5">
                    {unit.badgeText} • {unitCompletedCount}/{unit.lessons.length} LIÇÕES
                  </span>
                  <h2 className="font-display text-xl font-bold leading-tight text-cartoon-shadow">
                    {unit.title}
                  </h2>
                  <p className="text-xs font-semibold text-white/90 mt-1 leading-snug">
                    {unit.subtitle}
                  </p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-white/20 border-2 border-[#1A1D20] flex items-center justify-center shrink-0">
                  <BookOpen size={20} strokeWidth={2.6} className="text-white" />
                </div>
              </div>
            </div>

            {/* Winding S-Curve Stepping Stone Path */}
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
                    {/* Curved SVG Connector to Next Node */}
                    {idx < unit.lessons.length - 1 && (
                      <svg
                        width="240"
                        height="68"
                        viewBox="-120 0 240 68"
                        className="absolute top-[56px] pointer-events-none z-0 overflow-visible"
                      >
                        {/* Dark outline path */}
                        <path
                          d={`M ${offsetX} 8 C ${offsetX} 38, ${nextOffsetX} 30, ${nextOffsetX} 64`}
                          fill="none"
                          stroke="#1A1D20"
                          strokeWidth="12"
                          strokeLinecap="round"
                          opacity={isCompleted ? 0.9 : 0.25}
                        />
                        {/* Inner colored path */}
                        <path
                          d={`M ${offsetX} 8 C ${offsetX} 38, ${nextOffsetX} 30, ${nextOffsetX} 64`}
                          fill="none"
                          stroke={isCompleted ? '#43B02A' : '#FFFFFF'}
                          strokeWidth="6.5"
                          strokeLinecap="round"
                          strokeDasharray={isCompleted ? undefined : '8 8'}
                          opacity={isCompleted ? 1 : 0.85}
                        />
                      </svg>
                    )}

                    {/* Node Wrapper positioned along the S-curve */}
                    <div
                      className="relative z-10 flex items-center justify-center"
                      style={{ transform: `translateX(${offsetX}px)` }}
                    >
                      {/* Floating "COMEÇAR!" Bubble for active node */}
                      {isCurrent && !isPreviewOpen && (
                        <motion.div
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                          className="absolute -top-11 bg-white border-[2.5px] border-[#1A1D20] shadow-[0px_3px_0px_#1A1D20] px-3 py-1 rounded-xl whitespace-nowrap z-20"
                        >
                          <span className="font-display text-xs font-bold text-[#43B02A] tracking-wide">
                            COMEÇAR!
                          </span>
                          <div className="w-2.5 h-2.5 bg-white border-r-[2.5px] border-b-[2.5px] border-[#1A1D20] rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-[7px]" />
                        </motion.div>
                      )}

                      {/* Floating Coala Mascot beside the current active node */}
                      {isCurrent && (
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 pointer-events-none z-20 ${
                            offsetX >= 0 ? '-left-[104px]' : '-right-[104px]'
                          }`}
                        >
                          <CoalaMascot
                            mood="pointing"
                            size={86}
                            className={offsetX < 0 ? '-scale-x-100' : ''}
                          />
                        </div>
                      )}

                      {/* Animated outer progress ring for current node */}
                      {isCurrent && (
                        <motion.div
                          animate={{ scale: [1, 1.12, 1], opacity: [0.9, 0.45, 0.9] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          className="absolute inset-[-10px] rounded-full border-[4px] border-[#FFD54F] pointer-events-none"
                        />
                      )}

                      {/* Circular 3D Tactile Stepping Stone */}
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
                          relative w-[76px] h-[76px] rounded-full border-[3px] flex items-center justify-center cursor-pointer transition-all
                          ${
                            isCompleted
                              ? 'bg-[#43B02A] border-[#1A1D20] shadow-[0px_6px_0px_#2D7A1C] active:shadow-[0px_2px_0px_#2D7A1C] text-white'
                              : isCurrent
                                ? 'bg-[#FFC107] border-[#1A1D20] shadow-[0px_6px_0px_#D39E00] active:shadow-[0px_2px_0px_#D39E00] text-[#1A1D20]'
                                : 'bg-[#E0E4E8] border-[#9AA4B0] shadow-[0px_5px_0px_#9AA4B0] text-[#8C959F] cursor-not-allowed'
                          }
                        `}
                      >
                        {/* Glossy top highlight */}
                        <div className="absolute top-1.5 left-3 right-3 h-3 rounded-full bg-white/30 pointer-events-none" />

                        {isCompleted ? (
                          <Check size={34} strokeWidth={4} />
                        ) : isCurrent ? (
                          <Star size={34} fill="#FFFFFF" stroke="#1A1D20" strokeWidth={2.5} />
                        ) : (
                          <Lock size={26} strokeWidth={2.6} />
                        )}
                      </motion.button>
                    </div>

                    {/* Lesson Short Title Pill beneath node */}
                    <div
                      className="mt-2.5 text-center max-w-[175px]"
                      style={{ transform: `translateX(${offsetX}px)` }}
                    >
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold leading-tight ${
                          isLocked
                            ? 'text-white/75'
                            : 'bg-white/95 text-[#1A1D20] border-2 border-[#1A1D20] shadow-[0px_2px_0px_#1A1D20]'
                        }`}
                      >
                        {lesson.title}
                      </span>
                    </div>

                    {/* Duolingo-style Expandable Lesson Start Popover */}
                    <AnimatePresence>
                      {isPreviewOpen && !isLocked && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.94 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.94 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                          className="w-full max-w-[320px] mt-3 tactile-card p-4 z-30"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#43B02A]">
                                <Clock size={11} /> {lesson.durationLabel} • {lesson.challenges.length} desafios
                              </span>
                              <h3 className="font-display text-lg font-bold text-[#1A1D20] leading-tight">
                                {lesson.title}
                              </h3>
                            </div>
                            <span className="inline-flex items-center gap-1 bg-[#FFF8E1] border-2 border-[#1A1D20] px-2 py-0.5 rounded-lg text-xs font-extrabold text-[#D39E00] shrink-0">
                              <Sparkles size={12} /> +{lesson.xpReward}
                            </span>
                          </div>

                          <p className="text-xs font-medium text-slate-600 mb-4 leading-relaxed">
                            {lesson.subtitle}
                          </p>

                          <TactileButton
                            variant={isCompleted ? 'blue' : 'green'}
                            size="md"
                            fullWidth
                            onClick={() => {
                              setPreviewLessonId(null);
                              onSelectLesson(lesson);
                            }}
                          >
                            <Play size={16} fill="currentColor" />
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
