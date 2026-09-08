import { softSkillsModules } from '../data/lessonsData';
import { useAppStore } from '../store/useAppStore';
import { Check, Lock, Sparkles, BrainCircuit, Leaf, BookOpen } from 'lucide-react';

export function TrailsTab({ onSelectLesson }: { onSelectLesson: (l: any) => void }) {
  const { completedLessons, hasCompletedLeveling } = useAppStore();

  const themeGradients = {
    emerald: 'from-emerald-400 to-teal-500',
    green: 'from-green-400 to-emerald-500',
    orange: 'from-orange-400 to-rose-500',
    blue: 'from-blue-400 to-indigo-500',
    purple: 'from-purple-400 to-fuchsia-500',
    rose: 'from-rose-400 to-pink-500'
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Mapa de Lições</p>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Trilha de Soft Skills</h1>
      </div>

      <div className={`transition-opacity duration-500 ${hasCompletedLeveling ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        {softSkillsModules.map((module) => (
          <div key={module.id} className="mb-10">
            <div className={`bg-gradient-to-r ${themeGradients[module.theme]} p-5 rounded-3xl text-white mb-6 shadow-lg`}>
              <h2 className="text-xl font-bold flex items-center gap-2"><Leaf size={20} /> {module.title}</h2>
              <p className="text-sm opacity-90 mt-1">Conclua lições para avançar.</p>
            </div>
            
            <div className="flex flex-col gap-4 relative px-2">
              <div className="absolute left-10 top-8 bottom-8 w-1 bg-slate-200 dark:bg-slate-800 z-0 rounded-full"></div>
              {module.lessons.map((lesson, idx) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isLocked = idx > 0 && !completedLessons.includes(module.lessons[idx-1].id);
                
                return (
                  <button 
                    key={lesson.id} 
                    disabled={isLocked}
                    onClick={() => onSelectLesson(lesson)}
                    className="relative z-10 flex items-center gap-4 group text-left w-full"
                  >
                    <div className={`w-16 h-16 rounded-full border-[3px] flex items-center justify-center transition-all bg-white dark:bg-slate-950
                      ${isCompleted ? 'border-emerald-500 text-emerald-500' : isLocked ? 'border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700' : 'border-sky-500 text-sky-500 shadow-[0_4px_0_rgb(14,165,233)] dark:shadow-[0_4px_0_rgb(2,132,199)]'}`}>
                      {isCompleted ? <Check size={28} strokeWidth={3} /> : isLocked ? <Lock size={24} /> : <BookOpen size={24} />}
                    </div>
                    <div className={`p-4 rounded-3xl border flex-1 flex justify-between items-center ${isLocked ? 'bg-transparent border-transparent opacity-50' : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-sm'}`}>
                      <div>
                        <h3 className="font-bold text-slate-800 dark:text-white text-[15px]">{lesson.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{lesson.description}</p>
                      </div>
                      <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-slate-600 dark:text-slate-300">+{lesson.xpReward} XP</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
