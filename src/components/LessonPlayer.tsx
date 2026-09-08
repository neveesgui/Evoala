import { useState, useMemo } from 'react';
import { X, Check, Leaf } from 'lucide-react';
import type { Lesson } from '../data/lessonsData';
import { useAppStore } from '../store/useAppStore';

interface Props {
  lesson: Lesson;
  onClose: () => void;
}

export default function LessonPlayer({ lesson, onClose }: Props) {
  const { leaves, loseLeaf, addXp, completeLesson, userLevel } = useAppStore();
  
  // Filtro de Nivelamento IA: Pega apenas as perguntas da dificuldade do usuário (Fallback para Júnior)
  const activeQuestions = useMemo(() => {
    const level = userLevel || 'Júnior';
    const filtered = lesson.questions.filter(q => q.level === level);
    return filtered.length > 0 ? filtered : lesson.questions;
  }, [lesson, userLevel]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);

  const question = activeQuestions[currentIndex];
  const isCorrect = selectedOption === question?.correctIndex;

  const handleCheck = () => {
    if (selectedOption === null) return;
    setIsChecked(true);
    if (!isCorrect) loseLeaf();
  };

  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsChecked(false);
    } else {
      setLessonFinished(true);
      addXp(lesson.xpReward);
      completeLesson(lesson.id);
    }
  };

  if (leaves === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
        <Leaf size={64} className="text-slate-300 dark:text-slate-700 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Sem folhas!</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-center">Espere o bambuzal crescer para recuperar suas vidas.</p>
        <button onClick={onClose} className="mt-8 w-full bg-emerald-500 text-white font-bold py-4 rounded-2xl active:scale-95 transition-transform">Voltar</button>
      </div>
    );
  }

  if (lessonFinished) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="text-6xl mb-4">🐨</div>
        <h2 className="text-3xl font-black text-emerald-500 text-center">Lição Concluída!</h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2 font-bold">+{lesson.xpReward} XP</p>
        <button onClick={onClose} className="mt-8 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-[0_4px_0_rgb(16,185,129)] dark:shadow-[0_4px_0_rgb(4,120,87)] active:translate-y-1 active:shadow-none transition-all">
          Continuar
        </button>
      </div>
    );
  }

  const progress = ((currentIndex) / activeQuestions.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 flex flex-col">
      <div className="flex items-center p-4 gap-4 border-b border-slate-100 dark:border-slate-900">
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X size={24} /></button>
        <div className="flex-1 bg-slate-200 dark:bg-slate-800 h-4 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center text-emerald-500 font-bold gap-1"><Leaf size={20} fill="currentColor" /> {leaves}</div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            Nível: {userLevel || 'Júnior'}
          </span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-8 leading-relaxed">{question.prompt}</h2>
        
        <div className="flex flex-col gap-3">
          {question.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            let btnClass = "border-2 p-4 rounded-2xl text-left font-medium transition-all ";
            
            if (isChecked) {
              if (idx === question.correctIndex) btnClass += "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400";
              else if (isSelected) btnClass += "border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400";
              else btnClass += "border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-50";
            } else {
              btnClass += isSelected 
                ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 shadow-[0_4px_0_rgb(14,165,233)] dark:shadow-[0_4px_0_rgb(2,132,199)]" 
                : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-[0_4px_0_rgb(226,232,240)] dark:shadow-[0_4px_0_rgb(30,41,59)]";
            }
            
            return (
              <button key={idx} disabled={isChecked} onClick={() => setSelectedOption(idx)} className={btnClass}>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <div className={`p-6 border-t ${isChecked ? (isCorrect ? 'bg-emerald-100/50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900' : 'bg-rose-100/50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900') : 'bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-900'}`}>
        {isChecked && (
          <div className="mb-4">
            <h3 className={`text-xl font-bold flex items-center gap-2 ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {isCorrect ? <><Check /> Mandou bem!</> : <><X /> Quase lá!</>}
            </h3>
            <p className={`mt-1 font-medium ${isCorrect ? 'text-emerald-800 dark:text-emerald-200' : 'text-rose-800 dark:text-rose-200'}`}>{question.explanation}</p>
          </div>
        )}
        
        <button 
          onClick={isChecked ? handleNext : handleCheck}
          disabled={selectedOption === null && !isChecked}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
            selectedOption === null && !isChecked 
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600' 
              : isChecked 
                ? (isCorrect ? 'bg-emerald-500 text-white shadow-[0_4px_0_rgb(16,185,129)] dark:shadow-[0_4px_0_rgb(4,120,87)]' : 'bg-rose-500 text-white shadow-[0_4px_0_rgb(225,29,72)] dark:shadow-[0_4px_0_rgb(159,18,57)]')
                : 'bg-emerald-500 text-white shadow-[0_4px_0_rgb(16,185,129)] dark:shadow-[0_4px_0_rgb(4,120,87)] active:translate-y-1 active:shadow-none'
          }`}
        >
          {isChecked ? 'Continuar' : 'Verificar'}
        </button>
      </div>
    </div>
  );
}
