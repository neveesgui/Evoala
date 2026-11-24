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
    toggleSound,
    resetProgress,
  } = useAppStore();

  const [copiedPortfolio, setCopiedPortfolio] = useState(false);

  const currentRank = getUserRank(xp);
  const rankIdx = RANK_THRESHOLDS.findIndex((r) => r.name === currentRank.name);
  const nextRank = RANK_THRESHOLDS[rankIdx + 1];

  const progressPct = nextRank
    ? Math.min(
        100,
        Math.max(0, Math.round(((xp - currentRank.minXp) / (nextRank.minXp - currentRank.minXp)) * 100))
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
      color: '#43B02A',
    },
    {
      id: 'b2',
      title: 'Sob Pressão',
      desc: '1 cenário no Gatekeeper',
      unlocked: gatekeeperHistory.length >= 1,
      icon: BrainCircuit,
      color: '#7C4DFF',
    },
    {
      id: 'b3',
      title: 'Em Chamas',
      desc: 'Ofensiva de 3 dias',
      unlocked: streak >= 3,
      icon: Flame,
      color: '#FF6D00',
    },
    {
      id: 'b4',
      title: 'Mestre das Soft Skills',
      desc: 'Chegue ao Elo Ouro',
      unlocked: xp >= 1100,
      icon: Award,
      color: '#FFC107',
    },
  ];

  const handleCopyCertificate = () => {
    soundFX.playCorrect();
    const summary = `Evoala — Portfólio de Soft Skills | ${userName || 'Profissional'} | Elo ${currentRank.name} (${xp} XP) | Prontidão: ${readinessScore}% (Clareza ${metrics.clarity}%, Empatia ${metrics.empathy}%, Controle ${metrics.control}%)`;
    navigator.clipboard?.writeText(summary).catch(() => {});
    setCopiedPortfolio(true);
    setTimeout(() => setCopiedPortfolio(false), 2400);
  };

  return (
    <div className="px-4 pt-5 pb-10 space-y-5">
      {/* Profile Hero Card */}
      <TactileCard className="p-5 text-center relative overflow-hidden">
        <div className="absolute top-3 right-3">
          <button
            onClick={() => {
              toggleSound();
            }}
            className="w-10 h-10 rounded-xl border-2 border-[#1A1D20] bg-slate-50 hover:bg-slate-100 shadow-[0px_2px_0px_#1A1D20] flex items-center justify-center cursor-pointer"
            title={soundEnabled ? 'Desativar sons' : 'Ativar sons'}
          >
            {soundEnabled ? (
              <Volume2 size={18} className="text-[#43B02A]" />
            ) : (
              <VolumeX size={18} className="text-slate-400" />
            )}
          </button>
        </div>

        <CoalaMascot mood="happy" size={108} className="mx-auto mb-1" />

        <h1 className="font-display text-2xl font-bold text-[#1A1D20]">
          {userName || 'Competidor Evoala'}
        </h1>
        <p className="text-xs font-bold text-slate-500 mb-3">
          Nível {userLevel || 'Júnior'} • {completedLessons.length}/{ALL_LESSONS.length} lições
        </p>

        <div className="inline-flex items-center gap-2 bg-[#FFF8E1] border-2 border-[#1A1D20] px-3.5 py-1 rounded-full mb-4">
          <Sparkles size={14} className="text-[#D39E00]" />
          <span className="font-display text-xs font-bold text-[#1A1D20]">
            Elo {currentRank.name} • {xp} XP
          </span>
        </div>

        {/* Elo Progress Bar */}
        {nextRank && (
          <div className="text-left bg-slate-50 border-2 border-[#1A1D20] rounded-2xl p-3">
            <div className="flex justify-between text-[11px] font-extrabold text-[#1A1D20] mb-1.5">
              <span>{currentRank.name}</span>
              <span>
                {nextRank.name} ({nextRank.minXp} XP)
              </span>
            </div>
            <div className="h-3.5 bg-[#E0E4E8] border-2 border-[#1A1D20] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#43B02A] transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-[10px] font-bold text-slate-500 mt-1.5 text-center">
              Faltam {Math.max(0, nextRank.minXp - xp)} XP para subir para {nextRank.name}
            </p>
          </div>
        )}
      </TactileCard>

      {/* Soft Skills Readiness Certificate / Portfolio */}
      <TactileCard className="p-4 bg-[#FFFDF5]">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <span className="inline-block bg-[#E8F5E9] border border-[#1A1D20] px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase text-[#2D7A1C] mb-1">
              PORTFÓLIO VERIFICÁVEL • RH/B2B
            </span>
            <h2 className="font-display text-base font-bold text-[#1A1D20]">
              Certificado de Prontidão
            </h2>
          </div>
          <span className="font-display text-xl font-bold text-[#43B02A]">{readinessScore}%</span>
        </div>

        <p className="text-xs font-semibold text-slate-600 mb-4 leading-relaxed">
          Compartilhe seu resumo de Soft Skills (Clareza {metrics.clarity}%, Empatia{' '}
          {metrics.empathy}%, Controle {metrics.control}%) no LinkedIn ou processos seletivos.
        </p>

        <TactileButton variant="blue" size="md" fullWidth onClick={handleCopyCertificate}>
          {copiedPortfolio ? (
            <>
              <Check size={16} strokeWidth={3} /> Resumo Copiado!
            </>
          ) : (
            <>
              <Share2 size={16} /> Copiar Resumo do Portfólio
            </>
          )}
        </TactileButton>
      </TactileCard>

      {/* Achievements Grid */}
      <div>
        <h2 className="font-display text-base font-bold text-white text-cartoon-shadow mb-2.5 px-1">
          Conquistas
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <TactileCard
                key={badge.id}
                className={`p-3.5 text-center ${badge.unlocked ? '' : 'opacity-65'}`}
              >
                <div
                  className="w-11 h-11 rounded-2xl border-2 border-[#1A1D20] flex items-center justify-center mx-auto mb-2"
                  style={{ backgroundColor: badge.unlocked ? badge.color : '#E0E4E8' }}
                >
                  <Icon
                    size={20}
                    className={badge.unlocked ? 'text-white' : 'text-[#8C959F]'}
                    strokeWidth={2.6}
                  />
                </div>
                <p className="font-display text-xs font-bold text-[#1A1D20]">{badge.title}</p>
                <p className="text-[10px] font-semibold text-slate-500 mt-0.5">{badge.desc}</p>
              </TactileCard>
            );
          })}
        </div>
      </div>

      {/* Reset Demo Button */}
      <div className="pt-2">
        <TactileButton
          variant="white"
          size="sm"
          fullWidth
          onClick={() => {
            resetProgress();
          }}
        >
          <RotateCcw size={14} /> Reiniciar Progresso e Onboarding
        </TactileButton>
      </div>
    </div>
  );
}
