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
  Briefcase,
} from 'lucide-react';
import { useAppStore, getUserRank, RANK_THRESHOLDS } from '../store/useAppStore';
import { WORK_AREAS, getAreaMeta, getPersonalizedLessons } from '../data/curriculum';
import { CoalaMascot } from '../components/CoalaMascot';
import { TactileButton, TactileCard } from '../components/ui/TactileUI';
import { soundFX } from '../utils/soundEffects';

export function ProfileTab() {
  const {
    userName,
    userLevel,
    userArea,
    xp,
    streak,
    completedLessons,
    gatekeeperHistory,
    metrics,
    soundEnabled,
    geminiApiKey,
    toggleSound,
    setUserArea,
    setGeminiApiKey,
    resetProgress,
  } = useAppStore();

  const [copiedPortfolio, setCopiedPortfolio] = useState(false);
  const [keyInput, setKeyInput] = useState(geminiApiKey);
  const [keySaved, setKeySaved] = useState(false);

  const areaMeta = getAreaMeta(userArea);
  const totalLessons = getPersonalizedLessons(userArea).length;

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
      color: '#00CD9C',
    },
    {
      id: 'b2',
      title: 'Sob Pressão',
      desc: '1 cenário no Gatekeeper',
      unlocked: gatekeeperHistory.length >= 1,
      icon: BrainCircuit,
      color: '#CE82FF',
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
    const summary = `Evoala — Portfólio de Soft Skills | ${userName || 'Profissional'} (${areaMeta.label}) | Elo ${currentRank.name} (${xp} XP) | Prontidão: ${readinessScore}% (Clareza ${metrics.clarity}%, Empatia ${metrics.empathy}%, Controle ${metrics.control}%)`;
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
      {/* Profile Hero Card */}
      <TactileCard className="p-5 text-center relative">
        <div className="absolute top-3.5 right-3.5">
          <button
            onClick={toggleSound}
            className="w-9 h-9 rounded-xl bg-[#131F24] border border-[#2E3F49] hover:bg-[#223540] flex items-center justify-center cursor-pointer transition-colors"
            title={soundEnabled ? 'Desativar sons' : 'Ativar sons'}
          >
            {soundEnabled ? (
              <Volume2 size={18} className="text-[#00CD9C]" />
            ) : (
              <VolumeX size={18} className="text-slate-500" />
            )}
          </button>
        </div>

        <CoalaMascot mood="happy" size={104} className="mx-auto mb-1" />

        <h1 className="font-display text-2xl font-black text-white">
          {userName || 'Competidor Evoala'}
        </h1>
        <p className="text-xs font-semibold text-slate-400 mb-3">
          {areaMeta.emoji} {areaMeta.label} • {userLevel || 'Júnior'} • {completedLessons.length}/
          {totalLessons} lições
        </p>

        <div className="inline-flex items-center gap-1.5 bg-[#FFC800]/15 px-3.5 py-1 rounded-full mb-4">
          <Sparkles size={13} className="text-[#FFC800]" />
          <span className="font-display text-xs font-extrabold text-[#FFC800]">
            Elo {currentRank.name} • {xp} XP
          </span>
        </div>

        {nextRank && (
          <div className="text-left bg-[#131F24] rounded-2xl p-3.5">
            <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1.5">
              <span>{currentRank.name}</span>
              <span>
                {nextRank.name} ({nextRank.minXp} XP)
              </span>
            </div>
            <div className="h-3 bg-[#26353D] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00CD9C] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-[10px] font-semibold text-slate-400 mt-1.5 text-center">
              Faltam {Math.max(0, nextRank.minXp - xp)} XP para subir para {nextRank.name}
            </p>
          </div>
        )}
      </TactileCard>

      {/* Switch Professional Area Anytime */}
      <TactileCard className="p-4">
        <div className="flex items-center gap-2 mb-2.5">
          <Briefcase size={15} className="text-[#00CD9C]" />
          <h3 className="font-display text-sm font-extrabold text-white">
            Sua Área de Atuação
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {WORK_AREAS.map((area) => {
            const active = area.id === userArea;
            return (
              <button
                key={area.id}
                onClick={() => {
                  soundFX.playSelect();
                  setUserArea(area.id);
                }}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  active
                    ? 'bg-[#00CD9C]/15 border-[#00CD9C] text-white'
                    : 'bg-[#131F24] border-[#2E3F49] text-slate-400 hover:text-white'
                }`}
              >
                <span className="block text-base">{area.emoji}</span>
                <span className="text-[10px] font-bold">{area.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </TactileCard>

      {/* Soft Skills Readiness Certificate */}
      <TactileCard className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div>
            <span className="inline-block bg-[#00CD9C]/15 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase text-[#00CD9C] mb-1">
              Portfólio RH / B2B
            </span>
            <h2 className="font-display text-base font-extrabold text-white">
              Certificado de Prontidão
            </h2>
          </div>
          <span className="font-display text-xl font-black text-[#00CD9C]">{readinessScore}%</span>
        </div>

        <p className="text-xs font-medium text-slate-400 mb-4 leading-relaxed">
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
                className={`p-4 text-center ${badge.unlocked ? '' : 'opacity-45'}`}
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mx-auto mb-2"
                  style={{ backgroundColor: badge.unlocked ? badge.color : '#26353D' }}
                >
                  <Icon
                    size={20}
                    className={badge.unlocked ? 'text-[#131F24]' : 'text-slate-500'}
                    strokeWidth={2.5}
                  />
                </div>
                <p className="font-display text-xs font-extrabold text-white">{badge.title}</p>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5">{badge.desc}</p>
              </TactileCard>
            );
          })}
        </div>
      </div>

      {/* Optional Free Gemini API Key */}
      <TactileCard className="p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <KeyRound size={15} className="text-[#CE82FF]" />
          <h3 className="font-display text-sm font-extrabold text-white">
            IA Real no Gatekeeper
          </h3>
        </div>
        <p className="text-[11px] font-medium text-slate-400 mb-3 leading-relaxed">
          O Gatekeeper já usa IA gratuita automaticamente. Para velocidade dedicada com{' '}
          <strong className="text-white">Google Gemini 2.5 Flash</strong> (grátis), cole sua chave:
        </p>
        <div className="flex gap-2">
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="AIza... (opcional)"
            className="flex-1 min-w-0 bg-[#131F24] border border-[#37464F] rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-[#CE82FF]"
          />
          <TactileButton variant="purple" size="sm" onClick={handleSaveKey} className="shrink-0">
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
