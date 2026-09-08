import { useAppStore } from '../store/useAppStore';
export function MarketTab() {
  const { softSkillScore, hardSkillScore } = useAppStore();
  return (
    <div className="p-6 pb-24">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Empregabilidade</h1>
      <div className="bg-gray-800 rounded-3xl p-6 text-white mb-6">
        <h2 className="text-sm uppercase tracking-wider font-bold text-gray-400 mb-1">Seu Verified Score</h2>
        <div className="flex items-end gap-2">
          <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">
            {softSkillScore + hardSkillScore}
          </span>
          <span className="text-gray-400 mb-1">/ 1000</span>
        </div>
      </div>
      <h3 className="font-bold text-gray-800 mb-4">Vagas em Destaque</h3>
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
        <h4 className="font-bold text-lg">Estágio Dev Frontend</h4>
        <p className="text-gray-500 text-sm mb-3">TechCorp S/A</p>
        <div className="flex gap-2">
          <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded-lg">Match Soft Skills: 90%</span>
        </div>
      </div>
    </div>
  );
}