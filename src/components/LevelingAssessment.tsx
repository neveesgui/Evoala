import { useState, useEffect } from 'react';
import { BrainCircuit, Loader2, Sparkles, Target } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const aiQuestions = [
  {
    prompt: "Você descobre um erro crítico em produção causado por um colega, mas o cliente ainda não notou. Qual sua primeira ação?",
    options: [
      { text: "Aviso o cliente imediatamente para ser transparente.", weight: 1 },
      { text: "Aciono o colega e o líder para aplicarmos um hotfix antes que o cliente perceba.", weight: 3 },
      { text: "Arrumo sozinho em silêncio para evitar pânico.", weight: 0 }
    ]
  },
  {
    prompt: "Sua equipe está sobrecarregada e o prazo final é inegociável. Como você prioriza?",
    options: [
      { text: "Trabalhamos finais de semana até entregar tudo.", weight: 0 },
      { text: "Corto as funcionalidades menos vitais (escopo) para garantir o núcleo do projeto com qualidade.", weight: 3 },
      { text: "Peço para adiar o inegociável.", weight: 1 }
    ]
  }
];

export default function LevelingAssessment() {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { completeLeveling } = useAppStore();

  const handleSelect = (weight: number) => {
    setScore(prev => prev + weight);
    if (currentQ < aiQuestions.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      setIsAnalyzing(true);
    }
  };

  useEffect(() => {
    if (isAnalyzing) {
      const timer = setTimeout(() => {
        let level: 'Júnior' | 'Pleno' | 'Sênior' = 'Júnior';
        let startingXp = 0; // Ferro
        
        if (score >= 5) {
          level = 'Sênior';
          startingXp = 750; // Prata
        } else if (score >= 3) {
          level = 'Pleno';
          startingXp = 350; // Bronze
        }
        
        completeLeveling(level, startingXp);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isAnalyzing, score, completeLeveling]);

  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative">
          <BrainCircuit size={80} className="text-sky-500 mb-6 animate-pulse" />
          <div className="absolute inset-0 bg-sky-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
        </div>
        <h2 className="text-3xl font-black text-white mb-3 tracking-tight">Calibrando seu Elo...</h2>
        <p className="text-slate-400 mb-10 max-w-sm text-lg leading-relaxed">Avaliando suas respostas para posicionar você no ranking inicial adequado.</p>
        <Loader2 className="animate-spin text-sky-500" size={40} />
      </div>
    );
  }

  const question = aiQuestions[currentQ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col overflow-hidden">
      <div className="p-6 flex items-center justify-between border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-2 text-sky-400 font-bold tracking-wide">
          <Target size={20} /> ASSESSMENT IA
        </div>
        <div className="flex gap-1">
          {aiQuestions.map((_, idx) => (
            <div key={idx} className={`h-1.5 w-8 rounded-full transition-all duration-500 ${idx <= currentQ ? 'bg-sky-500' : 'bg-slate-800'}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-center max-w-md mx-auto w-full relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-sky-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-10 leading-snug relative z-10">{question.prompt}</h2>
        <div className="flex flex-col gap-4 relative z-10">
          {question.options.map((opt, idx) => (
            <button 
              key={idx} 
              onClick={() => handleSelect(opt.weight)}
              className="p-5 rounded-2xl text-left border border-slate-800 bg-slate-900/80 text-slate-200 hover:border-sky-500 hover:bg-sky-900/30 transition-all duration-200 font-medium active:scale-[0.98] shadow-lg"
            >
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}