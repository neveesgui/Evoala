import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowRight, Sparkles, CheckCircle2, Trophy, Briefcase, MessageCircle } from 'lucide-react';
import {
  useAppStore,
  getUserRank,
  type WorkAreaId,
  type BehavioralMetrics,
} from '../store/useAppStore';
import { WORK_AREAS, getAreaMeta } from '../data/curriculum';
import { CoalaMascot } from './CoalaMascot';
import { SkyBackground, TactileButton, TactileCard } from './ui/TactileUI';
import { soundFX } from '../utils/soundEffects';

interface CalibrationOption {
  text: string;
  points: number; // 0 = reactive, 1.5 = passive/partial, 3 = high-EQ assertive
  dimension: 'clarity' | 'empathy' | 'control';
  reaction: string;
}

interface ChatTurnStage {
  kind: 'chat';
  turnNumber: number;
  incoming: string;
  options: CalibrationOption[];
}

interface DilemmaStage {
  kind: 'dilemma';
  badge: string;
  prompt: string;
  options: CalibrationOption[];
}

type CalibrationStage = ChatTurnStage | DilemmaStage;

interface AreaCalibrationPack {
  personaName: string;
  personaRole: string;
  personaInitials: string;
  chatContext: string;
  stages: CalibrationStage[];
}

/**
 * Generates a balanced 5-stage calibration (3-turn realistic mini-conversation
 * + 2 nuanced situational dilemmas) tailored to the user's chosen work area.
 * Options are intentionally nuanced (assertive vs. passive-safe vs. reactive)
 * so leveling is genuinely accurate — neither too easy nor frustrating.
 */
function buildCalibrationPack(area: WorkAreaId): AreaCalibrationPack {
  const areaContextMap: Record<
    WorkAreaId,
    {
      personaName: string;
      personaRole: string;
      personaInitials: string;
      chatContext: string;
      turn1Incoming: string;
      turn2Incoming: string;
      turn3Incoming: string;
      dilemma1Prompt: string;
      dilemma2Prompt: string;
    }
  > = {
    vendas: {
      personaName: 'Ricardo Teles',
      personaRole: 'Cliente Estratégico',
      personaInitials: 'RT',
      chatContext: 'Negociação importante em reta final — o cliente ficou tenso com um prazo.',
      turn1Incoming:
        'Olha, já é a segunda vez que vocês pedem mais prazo na proposta. Desse jeito vou fechar com o concorrente hoje mesmo.',
      turn2Incoming:
        'Mas eu preciso dar uma resposta para a minha diretoria ainda hoje às 17h! O que você me garante?',
      turn3Incoming:
        'Ok, se chegar às 16h com esses dois cenários eu seguro a decisão. Podemos combinar assim?',
      dilemma1Prompt:
        'Na reunião de metas, seu gerente comenta na frente do time que sua taxa de conversão caiu este mês.',
      dilemma2Prompt:
        'Um cliente antigo pede um desconto acima da sua alçada prometendo "fechar agora", mas isso compromete sua margem.',
    },
    saude: {
      personaName: 'Cláudia Mendes',
      personaRole: 'Familiar de Paciente',
      personaInitials: 'CM',
      chatContext: 'Recepção movimentada — uma acompanhante está ansiosa cobrando retorno.',
      turn1Incoming:
        'Faz quase uma hora que estamos esperando e ninguém dá uma posição clara! Vocês não se importam com quem está sofrendo?',
      turn2Incoming:
        'Mas eu preciso saber se vai demorar mais uma hora porque preciso avisar minha família e organizar os remédios!',
      turn3Incoming:
        'Obrigada por olhar para mim e me explicar direito... vou aguardar esses 15 minutos então.',
      dilemma1Prompt:
        'Durante a passagem de plantão, um colega te critica em tom ríspido por um registro que ficou incompleto.',
      dilemma2Prompt:
        'Você já está no fim de um turno exaustivo e a coordenação pede para cobrir mais duas demandas urgentes.',
    },
    gestao: {
      personaName: 'Marcos Viana',
      personaRole: 'Gerente de Área',
      personaInitials: 'MV',
      chatContext: 'Alinhamento de fim de tarde — um relatório crítico atrasou por dependência de outro setor.',
      turn1Incoming:
        'Vi que o fechamento ainda não subiu e a diretoria já cobrou duas vezes. Por que ninguém me avisou antes?',
      turn2Incoming:
        'Tudo bem que o outro setor atrasou, mas quem vai responder na reunião das 9h amanhã sou eu. O que dá para fazer agora?',
      turn3Incoming:
        'Fechado. Se essa versão executiva chegar às 8h, eu consigo conduzir a reunião tranquilo.',
      dilemma1Prompt:
        'Um colega discorda da sua recomendação na frente de diretores, questionando os números que você trouxe.',
      dilemma2Prompt:
        'Faltam 20 minutos para encerrar seu expediente e chegam duas demandas classificadas como "para ontem".',
    },
    tecnologia: {
      personaName: 'Daniela Rocha',
      personaRole: 'Product Manager',
      personaInitials: 'DR',
      chatContext: 'Véspera de lançamento — uma instabilidade ameaça a entrega da sprint.',
      turn1Incoming:
        'Acabei de ver que o fluxo principal ainda está falhando em homologação! Já comunicamos o lançamento para amanhã!',
      turn2Incoming:
        'Não dá para adiar tudo sem uma boa justificativa. Qual é o plano real para não passarmos vergonha amanhã?',
      turn3Incoming:
        'Faz sentido subir o núcleo estável amanhã e a parte secundária na quarta. Alinho isso com o comercial agora.',
      dilemma1Prompt:
        'Durante a review técnica, um colega questiona sua arquitetura em tom ácido na frente de toda a squad.',
      dilemma2Prompt:
        'Um diretor pede uma feature urgente fora do escopo que pode gerar dívida técnica pesada no produto.',
    },
    educacao: {
      personaName: 'Sérgio Almeida',
      personaRole: 'Responsável / Cliente',
      personaInitials: 'SA',
      chatContext: 'Atendimento individual — um responsável está insatisfeito com o andamento.',
      turn1Incoming:
        'Sinto que o acompanhamento não está funcionando e ninguém me procurou para explicar o que está acontecendo!',
      turn2Incoming:
        'Eu só quero ver evolução prática nas próximas semanas. O que vocês vão mudar de concreto?',
      turn3Incoming:
        'Se fizermos esse acompanhamento quinzenal e esse plano de 3 pontos, fico bem mais tranquilo.',
      dilemma1Prompt:
        'Em um encontro em grupo, uma pessoa faz um comentário irônico colocando em dúvida sua explicação.',
      dilemma2Prompt:
        'A coordenação pede para você assumir uma turma/atendimento extra justamente na semana em que está sobrecarregado.',
    },
    estudante: {
      personaName: 'Beatriz Lopes',
      personaRole: 'Líder do Projeto / Estágio',
      personaInitials: 'BL',
      chatContext: 'Véspera de apresentação importante — uma parte essencial ficou incompleta.',
      turn1Incoming:
        'Acabei de abrir a apresentação e a parte dos dados ainda está incompleta! Apresentamos amanhã às 10h!',
      turn2Incoming:
        'Eu entendo que teve imprevisto, mas como vamos garantir que amanhã não fique confuso na frente da banca?',
      turn3Incoming:
        'Ótimo, se você fechar esses gráficos até às 21h eu reviso os slides e ensaiamos 15 minutos antes.',
      dilemma1Prompt:
        'Na reunião de feedback do estágio, seu supervisor diz que você precisa ser mais objetivo ao explicar suas tarefas.',
      dilemma2Prompt:
        'Dois colegas do grupo discordam feio sobre o formato do trabalho e ninguém quer ceder.',
    },
  };

  const c = areaContextMap[area];

  return {
    personaName: c.personaName,
    personaRole: c.personaRole,
    personaInitials: c.personaInitials,
    chatContext: c.chatContext,
    stages: [
      /* STAGE 1 — CHAT TURN 1 (Calm under pressure & ownership) */
      {
        kind: 'chat',
        turnNumber: 1,
        incoming: c.turn1Incoming,
        options: [
          {
            text: 'Reconheço a falha de não ter te atualizado antes. Já mapeei o motivo do bloqueio e quero alinhar a solução mais rápida com você agora.',
            points: 3,
            dimension: 'control',
            reaction: 'Excelente controle emocional + protagonismo.',
          },
          {
            text: 'Desculpa mesmo pelo transtorno, estamos correndo aqui e assim que tiver novidade eu te aviso.',
            points: 1.5,
            dimension: 'empathy',
            reaction: 'Educado, mas faltou direção clara.',
          },
          {
            text: 'Não foi culpa minha, outra pessoa atrasou a parte dela e eu também estou pressionado aqui.',
            points: 0,
            dimension: 'control',
            reaction: 'Transferir culpa aumenta a tensão.',
          },
        ],
      },
      /* STAGE 2 — CHAT TURN 2 (Clarity & concrete trade-off) */
      {
        kind: 'chat',
        turnNumber: 2,
        incoming: c.turn2Incoming,
        options: [
          {
            text: 'Consigo garantir a versão essencial revisada ainda no prazo crítico e o complemento completo logo na sequência. Esse formato te atende?',
            points: 3,
            dimension: 'clarity',
            reaction: 'Clareza executiva + proposta viável!',
          },
          {
            text: 'Vou tentar entregar tudo até o horário, mas não consigo prometer 100% porque depende de outras coisas.',
            points: 1.5,
            dimension: 'clarity',
            reaction: 'Sincero, porém deixa insegurança.',
          },
          {
            text: 'Nesse prazo é impossível fazer com qualidade, então melhor cancelar ou adiar tudo.',
            points: 0,
            dimension: 'control',
            reaction: 'Postura rígida trava a negociação.',
          },
        ],
      },
      /* STAGE 3 — CHAT TURN 3 (Agreement & trust closure) */
      {
        kind: 'chat',
        turnNumber: 3,
        incoming: c.turn3Incoming,
        options: [
          {
            text: 'Combinado! Vou registrar esse acordo por escrito aqui e te mando uma confirmação assim que a primeira etapa sair.',
            points: 3,
            dimension: 'empathy',
            reaction: 'Fechamento impecável que gera confiança!',
          },
          {
            text: 'Beleza, combinado então. Qualquer coisa me chama.',
            points: 1.5,
            dimension: 'clarity',
            reaction: 'Funciona, mas pode reforçar mais previsibilidade.',
          },
          {
            text: 'Tá certo, só espero que da próxima vez a gente tenha mais tempo.',
            points: 0,
            dimension: 'empathy',
            reaction: 'Alfinetada no final desgasta o acordo.',
          },
        ],
      },
      /* STAGE 4 — DILEMMA 1 (Handling public criticism) */
      {
        kind: 'dilemma',
        badge: 'ETAPA 4 DE 5 • CRÍTICA E EGO',
        prompt: c.dilemma1Prompt,
        options: [
          {
            text: 'Mantenho a serenidade, agradeço o apontamento e peço para alinharmos os dados específicos e próximos passos com calma.',
            points: 3,
            dimension: 'control',
            reaction: 'Maturidade emocional de alto nível.',
          },
          {
            text: 'Concordo rapidamente para encerrar o assunto desconfortável e depois penso no que fazer.',
            points: 1.5,
            dimension: 'empathy',
            reaction: 'Evita conflito, mas não gera alinhamento real.',
          },
          {
            text: 'Rebato na hora apontando fatores externos para deixar claro que o erro não foi meu.',
            points: 0,
            dimension: 'control',
            reaction: 'Defensividade em público desgasta sua imagem.',
          },
        ],
      },
      /* STAGE 5 — DILEMMA 2 (Boundaries & negotiation) */
      {
        kind: 'dilemma',
        badge: 'ETAPA 5 DE 5 • LIMITES E NEGOCIAÇÃO',
        prompt: c.dilemma2Prompt,
        options: [
          {
            text: 'Mostro de forma transparente minha carga atual e proponho priorizar o mais crítico agora com um prazo seguro para o restante.',
            points: 3,
            dimension: 'clarity',
            reaction: 'Negociação madura e sustentável!',
          },
          {
            text: 'Aceito absorver tudo mesmo sobrecarregado para não parecer pouco colaborativo.',
            points: 1.5,
            dimension: 'empathy',
            reaction: 'Boa intenção, mas compromete qualidade e saúde.',
          },
          {
            text: 'Recuso de forma seca dizendo que não está no meu combinado.',
            points: 0,
            dimension: 'empathy',
            reaction: 'Falta de flexibilidade fecha portas.',
          },
        ],
      },
    ],
  };
}

export default function OnboardingScreen() {
  const [step, setStep] = useState<'welcome' | 'area' | 'diagnostic' | 'result'>('welcome');
  const [name, setName] = useState('');
  const [selectedArea, setSelectedArea] = useState<WorkAreaId | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [answers, setAnswers] = useState<CalibrationOption[]>([]);
  const { completeQuickOnboarding } = useAppStore();

  const pack = useMemo(() => buildCalibrationPack(selectedArea || 'gestao'), [selectedArea]);
  const currentStage = pack.stages[stageIndex];

  const totalScore = useMemo(
    () => answers.reduce((acc, item) => acc + item.points, 0),
    [answers]
  );

  const calibratedMetrics = useMemo<Partial<BehavioralMetrics>>(() => {
    const scoreRatio = Math.min(1, totalScore / 15);
    const base = Math.round(45 + scoreRatio * 42);
    const dimBonus = (dim: 'clarity' | 'empathy' | 'control') => {
      const relevant = answers.filter((a) => a.dimension === dim);
      if (relevant.length === 0) return 0;
      const avg = relevant.reduce((s, a) => s + a.points, 0) / (relevant.length * 3);
      return Math.round((avg - 0.5) * 14);
    };
    const clamp = (v: number) => Math.max(38, Math.min(92, v));
    return {
      clarity: clamp(base + dimBonus('clarity')),
      empathy: clamp(base + dimBonus('empathy')),
      control: clamp(base + dimBonus('control')),
      leadership: clamp(base - 4),
      negotiation: clamp(base - 2),
    };
  }, [answers, totalScore]);

  const getCalibration = (scoreVal: number) => {
    if (scoreVal >= 13) {
      return {
        level: 'Sênior' as const,
        startingXp: 1150,
        message: 'Excelente maturidade emocional sob pressão! Você já estreia no Elo Ouro.',
      };
    }
    if (scoreVal >= 10) {
      return {
        level: 'Pleno' as const,
        startingXp: 650,
        message: 'Ótima leitura de contexto e equilíbrio! Você começa no Elo Prata.',
      };
    }
    if (scoreVal >= 6) {
      return {
        level: 'Júnior' as const,
        startingXp: 300,
        message: 'Boa base inicial! Você começa no Elo Bronze com ótimo potencial de evolução.',
      };
    }
    return {
      level: 'Júnior' as const,
      startingXp: 100,
      message: 'Sua jornada começa no Elo Ferro — a trilha inicial foi calibrada para acelerar sua base!',
    };
  };

  const handleWelcomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return;
    soundFX.playTap();
    setStep('area');
  };

  const handleConfirmArea = () => {
    if (!selectedArea) return;
    soundFX.playTap();
    setStageIndex(0);
    setAnswers([]);
    setStep('diagnostic');
  };

  const handlePickOption = (option: CalibrationOption) => {
    const nextAnswers = [...answers, option];
    setAnswers(nextAnswers);

    if (option.points >= 3) soundFX.playCorrect();
    else soundFX.playSelect();

    if (stageIndex < pack.stages.length - 1) {
      setTimeout(() => setStageIndex((prev) => prev + 1), 220);
    } else {
      setTimeout(() => {
        setStep('result');
        soundFX.playLevelUp();
        confetti({
          particleCount: 75,
          spread: 68,
          origin: { y: 0.6 },
          colors: ['#10E8A2', '#29B6F6', '#FFD54F', '#CE82FF'],
        });
      }, 260);
    }
  };

  const calibration = getCalibration(totalScore);
  const calibratedRank = getUserRank(calibration.startingXp);
  const areaMeta = getAreaMeta(selectedArea || 'gestao');

  // Collect chat stages already shown for realistic threaded conversation
  const chatHistoryStages = pack.stages
    .slice(0, Math.min(3, stageIndex + 1))
    .filter((s): s is ChatTurnStage => s.kind === 'chat');

  return (
    <div className="min-h-[100dvh] w-full relative flex items-center justify-center px-4 py-8 pt-safe pb-safe overflow-y-auto overflow-x-hidden bg-[#07111A]">
      <SkyBackground />

      <div className="w-full max-w-[430px] my-auto relative z-10">
        <AnimatePresence mode="wait">
          {/* STEP 1: WELCOME + NAME */}
          {step === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="flex flex-col items-center"
            >
              <CoalaMascot pose="waving" size={146} className="mb-2" />

              <h1 className="font-display text-4xl font-black text-white tracking-tight mb-1">
                Evo<span className="text-[#10E8A2]">ala</span>
              </h1>
              <p className="text-sm font-semibold text-slate-400 mb-6 text-center">
                Desperte o seu potencial
              </p>

              <TactileCard className="w-full p-6">
                <div className="inline-flex items-center gap-1.5 bg-[#10E8A2]/15 px-3 py-1 rounded-full text-[11px] font-extrabold text-[#10E8A2] mb-4">
                  <Sparkles size={13} />
                  SOFT SKILLS & INTELIGÊNCIA EMOCIONAL
                </div>

                <h2 className="font-display text-xl font-black text-white mb-1.5">
                  Vamos calibrar seu perfil real
                </h2>
                <p className="text-sm text-slate-300 mb-5 leading-relaxed">
                  Você vai passar por uma mini conversa real da sua área + 2 decisões rápidas para
                  definir seu Elo com precisão.
                </p>

                <form onSubmit={handleWelcomeSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Como podemos te chamar?
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Guilherme"
                      className="w-full bg-white/8 border border-white/20 rounded-2xl px-4 py-3.5 text-base font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#10E8A2] transition-all"
                    />
                  </div>

                  <TactileButton
                    type="submit"
                    variant="mint"
                    size="lg"
                    fullWidth
                    disabled={name.trim().length < 2}
                  >
                    Continuar <ArrowRight size={18} strokeWidth={2.8} />
                  </TactileButton>
                </form>
              </TactileCard>
            </motion.div>
          )}

          {/* STEP 2: AREA SELECTION */}
          {step === 'area' && (
            <motion.div
              key="area"
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -36 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="flex flex-col"
            >
              <div className="flex items-center gap-3 mb-5">
                <CoalaMascot pose="encouraging" size={78} className="shrink-0" />
                <div className="liquid-glass rounded-2xl rounded-tl-sm px-4 py-3 flex-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold tracking-widest text-[#10E8A2] uppercase mb-0.5">
                    <Briefcase size={11} /> PERFIL PROFISSIONAL
                  </span>
                  <h2 className="font-display text-base font-extrabold text-white leading-snug">
                    Em qual área você atua hoje, {name}?
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {WORK_AREAS.map((area) => {
                  const active = selectedArea === area.id;
                  return (
                    <motion.button
                      key={area.id}
                      whileTap={{ y: 2 }}
                      onClick={() => {
                        soundFX.playSelect();
                        setSelectedArea(area.id);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        active
                          ? 'bg-[#29B6F6]/20 border-[#29B6F6] shadow-[0_0_20px_rgba(41,182,246,0.28)]'
                          : 'tactile-card-interactive'
                      }`}
                    >
                      <span className="text-2xl block mb-1.5">{area.emoji}</span>
                      <p className="font-display text-sm font-extrabold text-white leading-tight">
                        {area.label}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400 mt-1 leading-snug">
                        {area.description}
                      </p>
                    </motion.button>
                  );
                })}
              </div>

              <TactileButton
                variant="mint"
                size="lg"
                fullWidth
                disabled={!selectedArea}
                onClick={handleConfirmArea}
              >
                Iniciar Calibragem (5 Etapas) <ArrowRight size={18} strokeWidth={2.8} />
              </TactileButton>
            </motion.div>
          )}

          {/* STEP 3: 5-STAGE CALIBRATION (3-TURN MINI-CHAT + 2 DILEMMAS) */}
          {step === 'diagnostic' && currentStage && (
            <motion.div
              key={`stage-${stageIndex}`}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="flex flex-col"
            >
              {/* Top Progress Bar (5 stages) */}
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-300">
                  Calibragem • {areaMeta.emoji} {areaMeta.shortLabel}
                </span>
                <span className="text-[11px] font-extrabold text-white/70">
                  {stageIndex + 1} / {pack.stages.length}
                </span>
              </div>
              <div className="w-full flex gap-1.5 mb-4">
                {pack.stages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 flex-1 rounded-full transition-colors ${
                      idx <= stageIndex
                        ? 'bg-gradient-to-r from-[#29B6F6] to-[#00E676]'
                        : 'bg-white/12'
                    }`}
                  />
                ))}
              </div>

              {/* MINI CONVERSATION (STAGES 1..3) */}
              {currentStage.kind === 'chat' ? (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <CoalaMascot pose="listening" size={68} className="shrink-0" />
                    <div className="liquid-glass rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#10E8A2]">
                        <MessageCircle size={11} /> Mini Conversa • Turno {currentStage.turnNumber} de 3
                      </span>
                      <p className="text-xs font-medium text-slate-300 mt-0.5 leading-snug">
                        {pack.chatContext}
                      </p>
                    </div>
                  </div>

                  {/* Threaded Chat Window */}
                  <TactileCard className="p-4 mb-4 space-y-3 max-h-[270px] overflow-y-auto no-scrollbar">
                    {chatHistoryStages.map((chatStage, cIdx) => (
                      <div key={cIdx} className="space-y-2.5">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#CE82FF] to-[#6366F1] text-white font-display font-black text-[11px] flex items-center justify-center shrink-0">
                            {pack.personaInitials}
                          </div>
                          <div className="bg-white/10 border border-white/15 rounded-2xl rounded-tl-sm p-3 max-w-[86%]">
                            {cIdx === 0 && (
                              <p className="text-[10px] font-bold text-[#CE82FF] uppercase mb-0.5">
                                {pack.personaName} • {pack.personaRole}
                              </p>
                            )}
                            <p className="text-xs sm:text-sm font-medium text-slate-100 leading-snug">
                              {chatStage.incoming}
                            </p>
                          </div>
                        </div>

                        {answers[cIdx] && (
                          <div className="flex justify-end">
                            <div className="bg-gradient-to-br from-[#38C6FF] to-[#1CA3EC] rounded-2xl rounded-tr-sm p-3 max-w-[86%] text-[#051520] text-xs sm:text-sm font-bold">
                              {answers[cIdx].text}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </TactileCard>

                  {/* Reply Choices */}
                  <p className="text-[11px] font-bold uppercase tracking-wider text-sky-300/80 mb-2 px-1">
                    Como você responderia agora?
                  </p>
                  <div className="flex flex-col gap-2.5">
                    {currentStage.options.map((opt, idx) => (
                      <motion.button
                        key={idx}
                        whileTap={{ y: 2 }}
                        onClick={() => handlePickOption(opt)}
                        className="tactile-card-interactive p-3.5 text-left text-xs sm:text-sm font-semibold text-slate-100 leading-snug"
                      >
                        "{opt.text}"
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                /* SITUATIONAL DILEMMAS (STAGES 4..5) */
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <CoalaMascot pose="thinking" size={76} className="shrink-0" />
                    <div className="liquid-glass rounded-2xl rounded-tl-sm px-4 py-3 flex-1">
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#CE82FF] mb-0.5">
                        {currentStage.badge}
                      </span>
                      <p className="text-xs font-medium text-slate-300 leading-snug">
                        Avalie o cenário e escolha a reação mais próxima da sua postura real.
                      </p>
                    </div>
                  </div>

                  <TactileCard className="p-5">
                    <h2 className="font-display text-base sm:text-lg font-extrabold text-white leading-snug mb-4">
                      {currentStage.prompt}
                    </h2>

                    <div className="flex flex-col gap-2.5">
                      {currentStage.options.map((opt, idx) => (
                        <motion.button
                          key={idx}
                          whileTap={{ y: 2 }}
                          onClick={() => handlePickOption(opt)}
                          className="tactile-card-interactive p-3.5 text-left text-xs sm:text-sm font-semibold text-slate-100 leading-snug"
                        >
                          {opt.text}
                        </motion.button>
                      ))}
                    </div>
                  </TactileCard>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 4: CALIBRATED ELO + INITIAL BEHAVIORAL PROFILE */}
          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="flex flex-col items-center"
            >
              <CoalaMascot pose="celebrating" size={150} className="mb-2" />

              <TactileCard className="w-full p-6 text-center">
                <div className="inline-flex items-center gap-1.5 bg-[#FFD54F]/15 border border-[#FFD54F]/30 px-3.5 py-1 rounded-full text-xs font-extrabold text-[#FFD54F] mb-3">
                  <Trophy size={14} />
                  DIAGNÓSTICO COMPLETO
                </div>

                <h2 className="font-display text-3xl font-black text-white mb-1.5">
                  Elo {calibratedRank.name}!
                </h2>
                <p className="text-xs sm:text-sm font-medium text-slate-300 mb-5 leading-relaxed">
                  {calibration.message}
                </p>

                {/* Initial Calibrated Telemetry Preview */}
                <div className="bg-white/6 border border-white/12 rounded-2xl p-3.5 mb-5 text-left space-y-2.5">
                  <MiniMetricBar label="Clareza" value={calibratedMetrics.clarity || 60} color="#29B6F6" />
                  <MiniMetricBar label="Empatia" value={calibratedMetrics.empathy || 60} color="#FF5E9C" />
                  <MiniMetricBar label="Controle Emocional" value={calibratedMetrics.control || 60} color="#10E8A2" />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="liquid-glass-subtle rounded-2xl p-3">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      XP Inicial
                    </span>
                    <span className="font-display text-2xl font-black text-[#FFD54F]">
                      +{calibration.startingXp} XP
                    </span>
                  </div>
                  <div className="liquid-glass-subtle rounded-2xl p-3">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      Trilha
                    </span>
                    <span className="font-display text-base font-black text-[#10E8A2] truncate block mt-1">
                      {areaMeta.emoji} {areaMeta.shortLabel}
                    </span>
                  </div>
                </div>

                <TactileButton
                  variant="mint"
                  size="lg"
                  fullWidth
                  onClick={() =>
                    completeQuickOnboarding(
                      name,
                      calibration.startingXp,
                      calibration.level,
                      selectedArea || 'gestao',
                      calibratedMetrics
                    )
                  }
                >
                  <CheckCircle2 size={19} strokeWidth={2.8} /> Começar Minha Trilha
                </TactileButton>
              </TactileCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MiniMetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] font-bold mb-1">
        <span className="text-slate-300">{label}</span>
        <span className="text-white">{value}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
