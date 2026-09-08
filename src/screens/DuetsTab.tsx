import { motion } from 'framer-motion';
import { Swords, ThumbsUp } from 'lucide-react';

export function DuetsTab() {
  return (
    <div className="p-6 h-full">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">Modo Competitivo</p>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Arena de Duetos</h1>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-rose-600 rounded-3xl p-6 text-white mb-8 shadow-lg shadow-orange-500/20 text-center">
        <Swords size={40} className="mx-auto mb-3" />
        <h2 className="text-xl font-bold mb-1">O chefe pediu algo impossível</h2>
        <p className="text-sm text-orange-100 mb-4">Qual resolução demonstra mais liderança?</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Resposta A */}
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-500">J</div>
            <span className="font-bold text-sm text-slate-700 dark:text-slate-300">Jogador Oculto A</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm italic mb-4">"Eu diria que é impossível e pediria para ele rever o escopo, senão a equipe toda vai pedir demissão."</p>
          <button className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-sky-500 hover:text-white transition-colors">
            <ThumbsUp size={16} /> Votar na A
          </button>
        </motion.div>

        {/* Resposta B */}
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-500">P</div>
            <span className="font-bold text-sm text-slate-700 dark:text-slate-300">Jogador Oculto B</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm italic mb-4">"Eu faria um mapa de risco rápido, mostrando o que dá para entregar no prazo e o que precisa ser cortado para não perdermos a qualidade."</p>
          <button className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-sky-500 hover:text-white transition-colors">
            <ThumbsUp size={16} /> Votar na B
          </button>
        </motion.div>
      </div>
    </div>
  );
}
