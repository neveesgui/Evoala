import { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Award,
  Flame,
  BookOpen,
  BrainCircuit,
  Share2,
  Check,
  RotateCcw,
  Sparkles,
  KeyRound,
} from 'lucide-react';
import { useAppStore, getUserRank, RANK_THRESHOLDS } from '../store/useAppStore';
import { ALL_LESSONS } from '../data/curriculum';
import { CoalaMascot } from '../components/CoalaMascot';
import { TactileButton, TactileCard } from '../components/ui/TactileUI';
import { soundFX } from '../utils/soundEffects';

export function ProfileTab() {
  const {
    userName,
    userLevel,
    xp,
    streak,
    completedLessons,
    gatekeeperHistory,
    metrics,
    soundEnabled,
    geminiApiKey,
    toggleSound,
    setGeminiApiKey,
    resetProgress,
  } = useAppStore();

  const [copiedPortfolio, setCopiedPortfolio] = useState(false);
  const [keyInput, setKeyInput] = useState(geminiApiKey);
  const [keySaved, setKeySaved] = useState(false);

  const currentRank = getUserRank(xp);
  const rankIdx = RANK_THRESHOLDS.findIndex((r) => r.name === currentRank.name);
  const nextRank = RANK_THRESHOLDS[rankIdx + 1];

  const progressPct = nextRank
    ? Math.min(
        100,
        Math.max(
          0,
          Math.round(((xp - currentRank.minXp) / (nextRank.minXp - currentRank.minXp)) * 100)
        )
      )
    : 100;

  const readinessScore = Math.round(
    (metrics.clarity +
      metrics.empathy +
      metrics.control +
      metrics.leadership +
      metrics.negotiation) /
      5
  );

  const badges = [
    {
      id: 'b1',
      title: 'Primeiro Passo',
      desc: 'Conclua 1 lição',
      unlocked: completedLessons.length >= 1,
      icon: BookOpen,
      color: '#58CC02',
    },
    {
      id: 'b2',
      title: 'Sob Pressão',
      desc: '1 cenário no Gatekeeper',
      unlocked: gatekeeperHistory.length >= 1,
      icon: BrainCircuit,
      color: '#6366F1',
    },
    {
      id: 'b3',
      title: 'Em Chamas',
      desc: 'Ofensiva de 3 dias',
      unlocked: streak >= 3,
      icon: Flame,
      color: '#FF9600',
    },
    {
      id: 'b4',
      title: 'Elo Ouro',
      desc: 'Alcance 1.100 XP',
      unlocked: xp >= 1100,
      icon: Award,
      color: '#FFC800',
    },
  ];

  const handleCopyCertificate = () => {
    soundFX.playCorrect();
    const summary = `Evoala — Portfólio de Soft Skills | ${userName || 'Profissional'} | Elo ${currentRank.name} (${xp} XP) | Prontidão: ${readinessScore}% (Clareza ${metrics.clarity}%, Empatia ${metrics.empathy}%, Controle ${metrics.control}%)`;
    navigator.clipboard?.writeText(summary).catch(() => {});
    setCopiedPortfolio(true);
    setTimeout(() => setCopiedPortfolio(false), 2400);
  };

  const handleSaveKey = () => {
    setGeminiApiKey(keyInput);
    soundFX.playCorrect();
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  };

  return (
    <div className="px-4 pt-5 pb-10 space-y-5">
      {/* Clean Profile Hero Card */}
      <TactileCard className="p-5 text-center relative">
        <div className="absolute top-3.5 right-3.5">
          <button
            onClick={toggleSound}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200/80 flex items-center justify-center cursor-pointer transition-colors"
            title={soundEnabled ? 'Desativar sons' : 'Ativar sons'}
          >
            {soundEnabled ? (
              <Volume2 size={18} className="text-[#58CC02]" />
            ) : (
              <VolumeX size={18} className="text-slate-400" />
            )}
          </button>
        </div>

        <CoalaMascot mood="happy" size={104} className="mx-auto mb-1" />

        <h1 className="font-display text-2xl font-black text-slate-800">
          {userName || 'Competidor Evoala'}
        </h1>
        <p className="text-xs font-semibold text-slate-400 mb-3">
          Nível {userLevel || 'Júnior'} • {completedLessons.length}/{ALL_LESSONS.length} lições
        </p>

        <div className="inline-flex items-center gap-1.5 bg-[#FFF8DC] px-3.5 py-1 rounded-full mb-4">
          <Sparkles size={13} className="text-[#D99B00]" />
          <span className="font-display text-xs font-extrabold text-[#B8860B]">
            Elo {currentRank.name} • {xp} XP
          </span>
        </div>

        {nextRank && (
          <div className="text-left bg-[#F8FAFC] rounded-2xl p-3.5">
            <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1.5">
              <span>{currentRank.name}</span>
              <span>
                {nextRank.name} ({nextRank.minXp} XP)
              </span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#58CC02] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-[10px] font-semibold text-slate-400 mt-1.5 text-center">
              Faltam {Math.max(0, nextRank.minXp - xp)} XP para subir para {nextRank.name}
            </p>
          </div>
        )}
      </TactileCard>

      {/* Soft Skills Readiness Certificate */}
      <TactileCard className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div>
            <span className="inline-block bg-[#EEFBE5] px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase text-[#46A302] mb-1">
              Portfólio RH / B2B
            </span>
            <h2 className="font-display text-base font-extrabold text-slate-800">
              Certificado de Prontidão
            </h2>
          </div>
          <span className="font-display text-xl font-black text-[#58CC02]">{readinessScore}%</span>
        </div>

        <p className="text-xs font-medium text-slate-500 mb-4 leading-relaxed">
          Compartilhe seu índice de Soft Skills (Clareza {metrics.clarity}%, Empatia{' '}
          {metrics.empathy}%, Controle {metrics.control}%) no LinkedIn ou processos seletivos.
        </p>

        <TactileButton variant="blue" size="md" fullWidth onClick={handleCopyCertificate}>
          {copiedPortfolio ? (
            <>
              <Check size={16} strokeWidth={2.8} /> Resumo Copiado!
            </>
          ) : (
            <>
              <Share2 size={16} /> Copiar Resumo do Portfólio
            </>
          )}
        </TactileButton>
      </TactileCard>

      {/* Achievements */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 px-1">
          Conquistas
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <TactileCard
                key={badge.id}
                className={`p-4 text-center ${badge.unlocked ? '' : 'opacity-55'}`}
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mx-auto mb-2"
                  style={{ backgroundColor: badge.unlocked ? badge.color : '#E5E7EB' }}
                >
                  <Icon
                    size={20}
                    className={badge.unlocked ? 'text-white' : 'text-slate-400'}
                    strokeWidth={2.4}
                  />
                </div>
                <p className="font-display text-xs font-extrabold text-slate-800">{badge.title}</p>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5">{badge.desc}</p>
              </TactileCard>
            );
          })}
        </div>
      </div>

      {/* Optional Free Gemini API Key Configuration */}
      <TactileCard className="p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <KeyRound size={15} className="text-[#6366F1]" />
          <h3 className="font-display text-sm font-extrabold text-slate-800">
            IA Real no Gatekeeper
          </h3>
        </div>
        <p className="text-[11px] font-medium text-slate-500 mb-3 leading-relaxed">
          O Gatekeeper já usa IA gratuita automaticamente. Se quiser velocidade dedicada com{' '}
          <strong>Google Gemini 2.5 Flash</strong> (tier gratuito), cole sua chave abaixo:
        </p>
        <div className="flex gap-2">
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="AIza... (opcional)"
            className="flex-1 bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#6366F1]"
          />
          <TactileButton variant="purple" size="sm" onClick={handleSaveKey}>
            {keySaved ? 'Salvo!' : 'Salvar'}
          </TactileButton>
        </div>
      </TactileCard>

      {/* Reset Demo */}
      <div className="pt-1">
        <TactileButton variant="white" size="sm" fullWidth onClick={resetProgress}>
          <RotateCcw size={14} /> Reiniciar Progresso e Onboarding
        </TactileButton>
      </div>
    </div>
  );
}
