import { useState, useEffect } from 'react';
import { BrainCircuit, Loader2, Target, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'framer-motion';

const aiQuestions = [
  { prompt: "Você descobre um erro crítico causado por um colega. O cliente ainda não notou. Qual sua primeira ação?", options: [{ text: "Aviso o cliente imediatamente.", weight: 1 }, { text: "Aciono a equipe para aplicarmos um hotfix antes que o cliente perceba.", weight: 3 }, { text: "Arrumo sozinho em silêncio.", weight: 0 }] },
  { prompt: "Sua equipe está sobrecarregada e o prazo final é inegociável. Como você prioriza?", options: [{ text: "Trabalhamos finais de semana.", weight: 0 }, { text: "Corto escopos menos vitais para garantir o núcleo com qualidade.", weight: 3 }, { text: "Peço para adiar o prazo.", weight: 1 }] },
  { prompt: "Seu gestor diz: 'Você precisa ser mais estratégico'. Qual a melhor resposta?", options: [{ text: "Tento mudar minha postura sozinho.", weight: 0 }, { text: "Peço para ele provar onde errei.", weight: 1 }, { text: "Agradeço e peço métricas claras de onde posso melhorar.", weight: 3 }] },
  { prompt: "Um diretor exige uma feature urgente que vai quebrar a arquitetura do app.", options: [{ text: "Faço o que ele mandou.", weight: 0 }, { text: "Digo 'não' diretamente.", weight: 1 }, { text: "Mapeio os riscos e ofereço um prazo alternativo seguro.", weight: 3 }] },
  { prompt: "Um colega interrompe você pela terceira vez na reunião.", options: [{ text: "Imponho respeito elevando a voz.", weight: 0 }, { text: "Digo: 'Ainda não concluí meu raciocínio, me deixe terminar'.", weight: 3 }, { text: "Deixo ele dominar a reunião.", weight: 1 }] }
];

export default function LevelingAssessment() {
  const [step, setStep] = useState<'intro' | 'questions' | 'analyzing'>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const { completeLeveling, userName } = useAppStore();

  const handleSelect = (weight: number) => {
    setScore(prev => prev + weight);
    if (currentQ < aiQuestions.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      setStep('analyzing');
    }
  };

  useEffect(() => {
    if (step === 'analyzing') {
      const timer = setTimeout(() => {
        let level: 'Júnior' | 'Pleno' | 'Sênior' = 'Júnior';
        let startingXp = 0; 
        if (score >= 12) { level = 'Sênior'; startingXp = 750; } 
        else if (score >= 7) { level = 'Pleno'; startingXp = 350; }
        completeLeveling(level, startingXp);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [step, score, completeLeveling]);

  if (step === 'intro') {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-sm">
          <div className="w-16 h-16 bg-sky-500/10 border border-sky-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-sky-500 shadow-inner">
            <Target size={28} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-black text-white mb-3">Diagnóstico IA</h1>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed px-2">
            Olá, <span className="text-white font-bold">{userName || 'competidor'}</span>! Precisamos calibrar seu <strong className="text-sky-500">Elo Inicial</strong>. 
            <br/><br/>
            Responda a 5 cenários. Nossa IA analisará sua inteligência emocional sob pressão.
          </p>
          <button onClick={() => setStep('questions')} className="w-full bg-white text-slate-950 font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
            Iniciar Calibragem <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    );
  }

  if (step === 'analyzing') {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative">
          <BrainCircuit size={64} className="text-sky-500 mb-6 animate-pulse" />
          <div className="absolute inset-0 bg-sky-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
        </div>
        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Analisando Perfil...</h2>
        <p className="text-slate-500 mb-8 max-w-xs text-sm">Alocando sua posição na liga baseada nas suas decisões de liderança.</p>
        <Loader2 className="animate-spin text-sky-500" size={32} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col overflow-hidden">
      <div className="p-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/30 backdrop-blur-md">
        <div className="flex items-center gap-2 text-sky-400 font-bold tracking-wide text-xs">
          <ShieldAlert size={16} /> GATEKEEPER
        </div>
        <div className="flex gap-1.5">
          {aiQuestions.map((_, idx) => (
            <div key={idx} className={`h-1.5 w-5 rounded-full transition-all duration-500 ${idx <= currentQ ? 'bg-sky-500' : 'bg-slate-800'}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-center max-w-md mx-auto w-full relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-sky-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <h2 className="text-xl font-black text-white mb-8 leading-relaxed relative z-10">{aiQuestions[currentQ].prompt}</h2>
        <div className="flex flex-col gap-3 relative z-10">
          {aiQuestions[currentQ].options.map((opt, idx) => (
            <button key={idx} onClick={() => handleSelect(opt.weight)} className="p-4 rounded-2xl text-sm text-left border border-slate-800 bg-slate-900/60 text-slate-300 hover:border-sky-500 hover:bg-sky-900/30 transition-all duration-200 font-medium active:scale-[0.98]">
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}