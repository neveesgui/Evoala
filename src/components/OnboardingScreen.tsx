import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const { completeOnboarding } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length > 2) {
      completeOnboarding(name, age);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-center px-8 selection:bg-sky-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-900/10 via-slate-950 to-slate-950"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-sm mx-auto relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-sky-500/10 mb-4"
          >
            🐨
          </motion.div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-1.5">
            Evo<span className="text-sky-500">ala</span>
          </h1>
          <p className="text-slate-400 mt-2 text-center text-xs font-medium max-w-[260px]">
            Desenvolva inteligência emocional e suba no ranking corporativo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Como devemos te chamar?</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome..." 
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Sua idade (Opcional)</label>
            <input 
              type="number" 
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Ex: 22" 
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={name.trim().length < 3}
            className="w-full mt-6 bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(14,165,233,0.2)] disabled:shadow-none"
          >
            <Sparkles size={16} /> Iniciar Avaliação IA <ArrowRight size={16} />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}