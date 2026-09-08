import { softSkillsModules } from '../data/lessonsData';
import { useAppStore } from '../store/useAppStore';
import { Check, Lock, Leaf, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

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

  // Variáveis de animação em cascata (Framer Motion)
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-sky-500 mb-1">Mapa de Missões</p>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Trilha de Soft Skills</h1>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className={`transition-opacity duration-500 pb-10 ${hasCompletedLeveling ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}
      >
        {softSkillsModules.map((module) => (
          <div key={module.id} className="mb-10">
            {/* Header do Módulo mais compacto e elegante */}
            <motion.div variants={itemVariants} className={`bg-gradient-to-r ${themeGradients[module.theme]} p-4 rounded-2xl text-white mb-5 shadow-lg shadow-${module.theme}-500/20`}>
              <h2 className="text-base font-bold flex items-center gap-2"><Leaf size={16} /> {module.title}</h2>
              <p className="text-[11px] opacity-90 mt-0.5 font-medium">Conclua lições para avançar na liga.</p>
            </motion.div>
            
            <div className="flex flex-col gap-3 relative px-1">
              {/* Linha guia mais fina e sutil */}
              <div className="absolute left-7 top-6 bottom-6 w-[2px] bg-slate-200 dark:bg-slate-800/80 z-0 rounded-full"></div>
              
              {module.lessons.map((lesson, idx) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isLocked = idx > 0 && !completedLessons.includes(module.lessons[idx-1].id);
                
                return (
                  <motion.button 
                    variants={itemVariants}
                    whileHover={!isLocked ? { scale: 1.01 } : {}}
                    whileTap={!isLocked ? { scale: 0.98 } : {}}
                    key={lesson.id} 
                    disabled={isLocked}
                    onClick={() => onSelectLesson(lesson)}
                    className="relative z-10 flex items-center gap-4 group text-left w-full"
                  >
                    {/* Ícones circulares reduzidos de 64px para 48px */}
                    <div className={`w-12 h-12 rounded-full border-[2px] flex items-center justify-center shrink-0 transition-all bg-slate-50 dark:bg-slate-950
                      ${isCompleted ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5' : isLocked ? 'border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600' : 'border-sky-500 text-sky-500 shadow-[0_0_12px_rgba(14,165,233,0.3)] bg-sky-500/5'}`}>
                      {isCompleted ? <Check size={20} strokeWidth={3} /> : isLocked ? <Lock size={18} /> : <BookOpen size={18} />}
                    </div>
                    
                    {/* Cartão de conteúdo mais minimalista */}
                    <div className={`p-3.5 rounded-2xl flex-1 flex justify-between items-center transition-all ${isLocked ? 'bg-transparent border border-transparent opacity-50' : 'bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm'}`}>
                      <div className="pr-2">
                        <h3 className={`font-bold text-[14px] leading-tight mb-0.5 ${isLocked ? 'text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>{lesson.title}</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{lesson.description}</p>
                      </div>
                      
                      {/* Badge de XP polido */}
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg shrink-0 ${isCompleted ? 'text-emerald-500 bg-emerald-500/10' : isLocked ? 'text-slate-500 bg-slate-800/50' : 'text-sky-500 bg-sky-500/10'}`}>
                        +{lesson.xpReward} XP
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}