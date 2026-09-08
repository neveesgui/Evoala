import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Loader2, Sparkles } from 'lucide-react';

export function SimulatorTab() {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<null | 'success'>(null);

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setIsAnalyzing(true);
      // Simula o tempo de resposta da API Whisper da OpenAI
      setTimeout(() => {
        setIsAnalyzing(false);
        setResult('success');
      }, 3000);
    } else {
      setIsRecording(true);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-1">Simulador AI (Whisper)</p>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Entrevista Oral</h1>
      </div>

      {!result ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-center mb-12 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">"Me fale sobre um erro grave que você cometeu no trabalho."</h2>
            <p className="text-sm text-slate-500">Responda em voz alta. A IA avaliará seu tom de voz e o uso de muletas linguísticas (ex: "ééé", "tipo").</p>
          </div>

          <div className="relative flex items-center justify-center mb-10">
            {isRecording && (
              <>
                <div className="absolute w-32 h-32 bg-rose-500/20 rounded-full animate-ping"></div>
                <div className="absolute w-40 h-40 bg-rose-500/10 rounded-full animate-pulse"></div>
              </>
            )}
            
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={handleRecord}
              disabled={isAnalyzing}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-colors duration-300 ${isAnalyzing ? 'bg-slate-400' : isRecording ? 'bg-rose-500' : 'bg-sky-500'}`}
            >
              {isAnalyzing ? <Loader2 size={32} className="animate-spin" /> : isRecording ? <Square size={28} fill="currentColor" /> : <Mic size={32} />}
            </motion.button>
          </div>
          
          <p className="font-bold text-slate-500">{isAnalyzing ? 'Analisando entonação...' : isRecording ? 'Gravando...' : 'Toque para falar'}</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col justify-center">
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-3xl text-center">
            <Sparkles className="text-emerald-500 mx-auto mb-4" size={40} />
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Ótima postura vocal!</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">Você usou a estrutura STAR perfeitamente e manteve um tom de voz confiante.</p>
            
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 text-left">
              <p className="text-xs font-bold text-slate-400 uppercase mb-2">Relatório da IA</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium dark:text-white">Confiança</span>
                <span className="text-sm font-bold text-emerald-500">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium dark:text-white">Muletas ("ééé")</span>
                <span className="text-sm font-bold text-rose-500">2 detectadas</span>
              </div>
            </div>
            
            <button onClick={() => setResult(null)} className="w-full mt-6 bg-emerald-500 text-white font-bold py-3 rounded-2xl">Próximo Cenário</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
