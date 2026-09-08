import { useAppStore } from '../store/useAppStore';
import { Play } from 'lucide-react';

export function TodayTab({ onStartLesson }: { onStartLesson: () => void }) {
  const { xp } = useAppStore();
  return (
    <div className="p-6 pb-24">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Bom dia! 🐨</h1>
      <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl p-6 text-white shadow-lg mb-6">
        <h2 className="text-xl font-bold mb-2">Meta Diária</h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center font-bold text-xl">
            {xp}/200
          </div>
          <p className="font-medium opacity-90">Faltam só 50 XP para você bater sua meta de hoje. Continue assim!</p>
        </div>
      </div>
      <button onClick={onStartLesson} className="w-full bg-white border-2 border-gray-100 rounded-3xl p-6 flex items-center justify-between shadow-sm active:scale-95 transition-transform">
        <div className="text-left">
          <h3 className="font-bold text-gray-800 text-lg">Continuar Trilha</h3>
          <p className="text-gray-500">Soft Skills: Empatia</p>
        </div>
        <div className="bg-emerald-500 text-white p-3 rounded-2xl shadow-[0_4px_0_rgb(16,185,129)]"><Play fill="currentColor" /></div>
      </button>
    </div>
  );
}