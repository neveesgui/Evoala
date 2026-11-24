import type { BehavioralMetrics, WorkAreaId } from '../store/useAppStore';

export interface WorkAreaOption {
  id: WorkAreaId;
  label: string;
  shortLabel: string;
  emoji: string;
  description: string;
  accent: string;
}

export const WORK_AREAS: WorkAreaOption[] = [
  {
    id: 'vendas',
    label: 'Comercial & Vendas',
    shortLabel: 'Vendas',
    emoji: '🤝',
    description: 'Clientes, negociação, metas e objeções',
    accent: '#00CD9C',
  },
  {
    id: 'saude',
    label: 'Saúde & Atendimento',
    shortLabel: 'Saúde',
    emoji: '🩺',
    description: 'Pacientes, acolhimento e equipe sob pressão',
    accent: '#FF5E9C',
  },
  {
    id: 'gestao',
    label: 'Gestão, RH & Adm',
    shortLabel: 'Gestão',
    emoji: '💼',
    description: 'Equipes, feedbacks, conflitos e diretoria',
    accent: '#FFC800',
  },
  {
    id: 'tecnologia',
    label: 'Tecnologia & Produto',
    shortLabel: 'Tech',
    emoji: '💻',
    description: 'Times ágeis, prazos e stakeholders',
    accent: '#1CB0F6',
  },
  {
    id: 'educacao',
    label: 'Educação & Serviços',
    shortLabel: 'Serviços',
    emoji: '🎓',
    description: 'Alunos, público, ensino e atendimento',
    accent: '#CE82FF',
  },
  {
    id: 'estudante',
    label: 'Estudante / Carreira',
    shortLabel: 'Carreira',
    emoji: '🚀',
    description: 'Entrevistas, estágio e trabalhos em grupo',
    accent: '#FF9600',
  },
];

export function getAreaMeta(area: WorkAreaId): WorkAreaOption {
  return WORK_AREAS.find((a) => a.id === area) || WORK_AREAS[2];
}

/**
 * Area-specific vocabulary & real-world anchors so EVERY unit adapts
 * to the user's initial career mapping.
 */
interface AreaFlavor {
  counterpart: string; // e.g., "cliente", "paciente", "stakeholder"
  leader: string; // e.g., "gerente comercial", "coordenação do plantão"
  teamWord: string; // e.g., "time comercial", "equipe de saúde"
  deliverable: string; // e.g., "proposta", "prontuário/atendimento", "entrega"
  meetingWord: string; // e.g., "reunião de metas", "passagem de plantão", "daily"
  channel: 'WhatsApp' | 'E-mail' | 'Slack';
}

const AREA_FLAVORS: Record<WorkAreaId, AreaFlavor> = {
  vendas: {
    counterpart: 'cliente',
    leader: 'gerente comercial',
    teamWord: 'time de vendas',
    deliverable: 'proposta comercial',
    meetingWord: 'reunião de fechamento',
    channel: 'WhatsApp',
  },
  saude: {
    counterpart: 'paciente ou familiar',
    leader: 'coordenação da unidade',
    teamWord: 'equipe de atendimento',
    deliverable: 'encaminhamento',
    meetingWord: 'passagem de plantão',
    channel: 'WhatsApp',
  },
  gestao: {
    counterpart: 'colega de outra área',
    leader: 'diretor',
    teamWord: 'equipe',
    deliverable: 'relatório estratégico',
    meetingWord: 'reunião de alinhamento',
    channel: 'E-mail',
  },
  tecnologia: {
    counterpart: 'stakeholder de produto',
    leader: 'tech lead',
    teamWord: 'squad',
    deliverable: 'entrega da sprint',
    meetingWord: 'daily',
    channel: 'Slack',
  },
  educacao: {
    counterpart: 'aluno ou responsável',
    leader: 'coordenação pedagógica',
    teamWord: 'equipe de ensino',
    deliverable: 'atividade',
    meetingWord: 'reunião de equipe',
    channel: 'WhatsApp',
  },
  estudante: {
    counterpart: 'colega de grupo',
    leader: 'supervisor de estágio',
    teamWord: 'grupo',
    deliverable: 'apresentação',
    meetingWord: 'reunião do projeto',
    channel: 'WhatsApp',
  },
};

export interface DilemmaChallenge {
  id: string;
  type: 'dilemma';
  contextBadge: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/**
 * Intuitive Fill-in-the-Blank Speech Bubble (replaces confusing sentence ordering):
 * User picks the single best empathetic/assertive phrase to complete the highlighted slot.
 */
export interface PhraseCompleteChallenge {
  id: string;
  type: 'phrase_complete';
  contextBadge: string;
  situation: string;
  /** Text before the blank slot */
  prefix: string;
  /** Text after the blank slot */
  suffix: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface EmotionThermometerChallenge {
  id: string;
  type: 'emotion_thermometer';
  prompt: string;
  messageSender: string;
  messageRole: string;
  messageChannel: 'Slack' | 'E-mail' | 'WhatsApp';
  messageBody: string;
  scaleLabels: [string, string, string, string, string];
  idealRange: [number, number];
  explanation: string;
}

export interface RoleplayTurn {
  incoming: string;
  options: {
    text: string;
    isIdeal: boolean;
    feedback: string;
  }[];
}

export interface MiniRoleplayChallenge {
  id: string;
  type: 'mini_roleplay';
  prompt: string;
  contextNote?: string;
  personaName: string;
  personaRole: string;
  personaInitials: string;
  turns: RoleplayTurn[];
  explanation: string;
}

export type MicroChallenge =
  | DilemmaChallenge
  | PhraseCompleteChallenge
  | EmotionThermometerChallenge
  | MiniRoleplayChallenge;

export interface CurriculumLesson {
  id: string;
  unitId: string;
  title: string;
  subtitle: string;
  durationLabel: string;
  xpReward: number;
  skillBoost: Partial<BehavioralMetrics>;
  challenges: MicroChallenge[];
}

export interface CurriculumUnit {
  id: string;
  number: number;
  sectionLabel: string;
  title: string;
  subtitle: string;
  accentColor: string;
  shadowColor: string;
  badgeText: string;
  chestRewardXp: number;
  lessons: CurriculumLesson[];
}

export interface GatekeeperScenario {
  id: string;
  title: string;
  category: string;
  difficulty: 'Médio' | 'Alto' | 'Extremo';
  personaName: string;
  personaRole: string;
  personaInitials: string;
  channel: 'Reunião' | 'Slack' | 'Entrevista' | 'Cliente';
  context: string;
  openingMessage: string;
  tacticalSuggestions: {
    label: string;
    text: string;
    quality: 'master' | 'good' | 'reactive';
  }[];
  idealKeywords: string[];
  avoidKeywords: string[];
}

/* =====================================================================
   UNIT 1: TRILHA INICIAL DE MAPEAMENTO (100% PERSONALIZADA PELA ÁREA)
   ===================================================================== */
function buildIntroMappingUnit(area: WorkAreaId): CurriculumUnit {
  const areaMeta = getAreaMeta(area);
  const f = AREA_FLAVORS[area];

  const areaDilemmaByField: Record<WorkAreaId, DilemmaChallenge> = {
    vendas: {
      id: 'u0-l1-c1',
      type: 'dilemma',
      contextBadge: 'Mapeamento • Comercial',
      prompt:
        'Um cliente em potencial diz: "O concorrente faz 20% mais barato". Qual sua primeira reação?',
      options: [
        'Dou desconto na hora para não perder a venda.',
        'Digo que o concorrente tem qualidade inferior.',
        'Valido a comparação e pergunto quais resultados ele mais valoriza para mostrar nosso diferencial real.',
        'Encerro a conversa porque o orçamento dele é baixo.',
      ],
      correctIndex: 2,
      explanation:
        'Em vendas consultivas, você investiga valor e critério de decisão antes de mexer no preço.',
    },
    saude: {
      id: 'u0-l1-c1',
      type: 'dilemma',
      contextBadge: 'Mapeamento • Saúde',
      prompt:
        'Um familiar está visivelmente ansioso na recepção cobrando informações enquanto você finaliza outro atendimento.',
      options: [
        'Peço para ele aguardar em silêncio sem olhar nos olhos.',
        'Faço contato visual calmo, valido a preocupação dele e informo o tempo exato em que vou atendê-lo.',
        'Interrompo o atendimento atual no meio para evitar reclamação.',
        'Digo que há casos mais graves na frente dele.',
      ],
      correctIndex: 1,
      explanation:
        'Previsibilidade e acolhimento em 10 segundos reduzem drasticamente a ansiedade em ambientes de saúde.',
    },
    gestao: {
      id: 'u0-l1-c1',
      type: 'dilemma',
      contextBadge: 'Mapeamento • Gestão & Adm',
      prompt:
        'Dois colegas de setores diferentes te mandaram pedidos urgentes para o mesmo horário sem alinhamento.',
      options: [
        'Tento fazer os dois correndo mesmo arriscando errar.',
        'Ignoro o pedido de quem tem cargo menor.',
        'Respondo aos dois com transparência, alinho qual impacto é mais crítico agora e confirmo o horário do segundo.',
        'Repasso o problema para outro colega resolver.',
      ],
      correctIndex: 2,
      explanation:
        'Priorização transparente evita sobrecarga silenciosa e constrói confiança entre áreas.',
    },
    tecnologia: {
      id: 'u0-l1-c1',
      type: 'dilemma',
      contextBadge: 'Mapeamento • Tecnologia',
      prompt:
        'Um stakeholder pediu uma mudança "pequena" de última hora que pode afetar a estabilidade da entrega de amanhã.',
      options: [
        'Faço correndo sem testar para agradar.',
        'Digo apenas "não dá" sem explicar o porquê.',
        'Explico o risco em linguagem simples e proponho incluir a melhoria logo após a entrega segura de amanhã.',
        'Ignoro a mensagem até passar o prazo.',
      ],
      correctIndex: 2,
      explanation:
        'Traduzir risco técnico em impacto de negócio protege a qualidade e gera respeito executivo.',
    },
    educacao: {
      id: 'u0-l1-c1',
      type: 'dilemma',
      contextBadge: 'Mapeamento • Educação & Serviços',
      prompt:
        'Durante uma aula ou atendimento em grupo, uma pessoa faz um comentário irônico questionando o seu método.',
      options: [
        'Respondo com ironia para manter autoridade.',
        'Ignoro completamente e continuo falando rápido.',
        'Mantenho a serenidade, acolho a dúvida por trás do comentário e convido a pessoa a compartilhar o ponto de vista dela.',
        'Encerro a atividade mais cedo.',
      ],
      correctIndex: 2,
      explanation:
        'Desarmar ironia com calma e curiosidade genuína transforma resistência em engajamento.',
    },
    estudante: {
      id: 'u0-l1-c1',
      type: 'dilemma',
      contextBadge: 'Mapeamento • Carreira',
      prompt:
        'Faltam 2 dias para entregar um trabalho em grupo importante e um integrante ainda não enviou a parte dele.',
      options: [
        'Faço tudo sozinho de madrugada e reclamo dele no grupo depois.',
        'Deixo sem a parte dele para ele aprender a lição.',
        'Chamo no privado com calma, pergunto se houve algum imprevisto e combino um prazo curto ou redistribuição clara.',
        'Mando uma indireta no grupo geral.',
      ],
      correctIndex: 2,
      explanation:
        'Abordagem direta, privada e focada em solução é a base do trabalho em equipe profissional.',
    },
  };

  const areaRoleplayByField: Record<WorkAreaId, MiniRoleplayChallenge> = {
    vendas: {
      id: 'u0-l4-c1',
      type: 'mini_roleplay',
      prompt: 'Simule uma negociação real de prazo com cliente:',
      contextNote: 'O comprador gostou da proposta, mas travou no prazo de entrega.',
      personaName: 'Carlos Eduardo',
      personaRole: 'Comprador',
      personaInitials: 'CE',
      turns: [
        {
          incoming: 'Olha, gostei da proposta, mas achei o prazo de entrega longo demais para nós.',
          options: [
            {
              text: 'Esse é o nosso prazo padrão, infelizmente não tenho como mudar.',
              isIdeal: false,
              feedback: 'Fecha a negociação sem entender a urgência real.',
            },
            {
              text: 'Entendo, Carlos. Qual data seria ideal para a sua operação não parar?',
              isIdeal: true,
              feedback: 'Ótimo! Você investigou a data crítica real dele.',
            },
          ],
        },
        {
          incoming: 'Se a primeira parte chegasse até dia 15, já resolveria nossa urgência.',
          options: [
            {
              text: 'Perfeito! Consigo dividir em duas entregas: o essencial dia 15 e o restante dia 22. Fechamos assim?',
              isIdeal: true,
              feedback: 'Excelente negociação ganha-ganha!',
            },
            {
              text: 'Vou ver com a logística e semana que vem te falo.',
              isIdeal: false,
              feedback: 'Perde o ritmo da decisão sem dar previsão clara.',
            },
          ],
        },
      ],
      explanation:
        'No Mini Bate-Papo você treina conversas reais passo a passo, conduzindo para acordos práticos.',
    },
    saude: {
      id: 'u0-l4-c1',
      type: 'mini_roleplay',
      prompt: 'Conduza um acolhimento sob pressão na recepção:',
      contextNote: 'Uma paciente está exaltada pela demora no atendimento.',
      personaName: 'Dona Lúcia',
      personaRole: 'Paciente',
      personaInitials: 'DL',
      turns: [
        {
          incoming: 'Já estou esperando há 40 minutos e ninguém me explica nada! Isso é um descaso!',
          options: [
            {
              text: 'A senhora precisa ter paciência, estamos lotados hoje.',
              isIdeal: false,
              feedback: 'Aumenta a sensação de abandono e tensão.',
            },
            {
              text: 'Sinto muito por essa espera, Dona Lúcia. Entendo o cansaço — vou verificar agora exatamente sua posição na fila.',
              isIdeal: true,
              feedback: 'Acolheu o sentimento e assumiu ação imediata!',
            },
          ],
        },
        {
          incoming: 'Obrigada por olhar... eu só estou preocupada com o horário do meu remédio.',
          options: [
            {
              text: 'Que bom que me avisou! Em 10 minutos a senhora será chamada e já sinalizei isso para a equipe.',
              isIdeal: true,
              feedback: 'Empatia prática que gera segurança e calma!',
            },
            {
              text: 'Tudo bem, é só aguardar sentada ali.',
              isIdeal: false,
              feedback: 'Perdeu a chance de tranquilizar a paciente.',
            },
          ],
        },
      ],
      explanation:
        'Acolher a emoção antes de dar a orientação reduz conflitos e fortalece a confiança.',
    },
    gestao: {
      id: 'u0-l4-c1',
      type: 'mini_roleplay',
      prompt: 'Conduza uma conversa de apoio com alguém da equipe:',
      contextNote: 'Uma analista sinalizou sobrecarga no meio da semana.',
      personaName: 'Mariana Silva',
      personaRole: 'Analista',
      personaInitials: 'MS',
      turns: [
        {
          incoming: 'Estou me sentindo sobrecarregada essa semana, acho que não vou dar conta de tudo.',
          options: [
            {
              text: 'Todo mundo está corrido, faz um esforço extra essa semana.',
              isIdeal: false,
              feedback: 'Ignora o sinal de alerta e reduz o engajamento.',
            },
            {
              text: 'Obrigado por me sinalizar cedo, Mariana. Quais duas tarefas estão pesando mais agora?',
              isIdeal: true,
              feedback: 'Excelente escuta ativa com segurança psicológica!',
            },
          ],
        },
        {
          incoming: 'O relatório mensal e o fechamento das planilhas caíram no mesmo dia.',
          options: [
            {
              text: 'Vamos focar no fechamento hoje e eu redistribuo o relatório para quinta. Fica mais leve assim?',
              isIdeal: true,
              feedback: 'Liderança prática que destrava o time!',
            },
            {
              text: 'Entendi, tenta adiantar o que conseguir.',
              isIdeal: false,
              feedback: 'Não resolveu a priorização.',
            },
          ],
        },
      ],
      explanation:
        'Conversas de alinhamento rápidas evitam burnout e aumentam a qualidade das entregas.',
    },
    tecnologia: {
      id: 'u0-l4-c1',
      type: 'mini_roleplay',
      prompt: 'Alinhe prioridades entre Design e Engenharia:',
      contextNote: 'A designer sente que melhorias de UX nunca entram na sprint.',
      personaName: 'Camila Rocha',
      personaRole: 'Product Designer',
      personaInitials: 'CR',
      turns: [
        {
          incoming: 'Sinto que os ajustes de usabilidade sempre ficam por último nas entregas.',
          options: [
            {
              text: 'É porque sempre temos coisas técnicas mais urgentes.',
              isIdeal: false,
              feedback: 'Resposta defensiva que distancia as áreas.',
            },
            {
              text: 'Entendo sua frustração, Camila. Qual ajuste de UX tem maior impacto para o usuário agora?',
              isIdeal: true,
              feedback: 'Validou o ponto e trouxe foco para impacto!',
            },
          ],
        },
        {
          incoming: 'O fluxo de cadastro está fazendo 30% das pessoas desistirem no passo 2.',
          options: [
            {
              text: 'Dado muito forte! Vamos priorizar esse ajuste juntos na reunião de amanhã.',
              isIdeal: true,
              feedback: 'Transformou atrito em parceria orientada a dados!',
            },
            {
              text: 'Registra no sistema que depois a gente olha.',
              isIdeal: false,
              feedback: 'Fecha a porta da colaboração.',
            },
          ],
        },
      ],
      explanation:
        'Escuta ativa + dados concretos destravam decisões entre áreas diferentes.',
    },
    educacao: {
      id: 'u0-l4-c1',
      type: 'mini_roleplay',
      prompt: 'Conduza uma orientação acolhedora:',
      contextNote: 'Um aluno está frustrado achando que não consegue aprender.',
      personaName: 'Pedro Henrique',
      personaRole: 'Aluno / Cliente',
      personaInitials: 'PH',
      turns: [
        {
          incoming: 'Eu simplesmente não consigo entender essa parte, acho que não levo jeito para isso.',
          options: [
            {
              text: 'Você só precisa estudar mais vezes até decorar.',
              isIdeal: false,
              feedback: 'Reforça o bloqueio emocional em vez de destravar.',
            },
            {
              text: 'É super normal travar nesse ponto, Pedro. Qual pedaço exatamente ficou mais confuso para você?',
              isIdeal: true,
              feedback: 'Acolheu a insegurança e isolou a dúvida real!',
            },
          ],
        },
        {
          incoming: 'Na hora de aplicar na prática eu me perco na ordem dos passos.',
          options: [
            {
              text: 'Vamos montar um roteiro de 3 passos juntos e testar um exemplo agora mesmo!',
              isIdeal: true,
              feedback: 'Didática empática e orientada à ação!',
            },
            {
              text: 'Lê o capítulo 4 de novo que lá explica.',
              isIdeal: false,
              feedback: 'Perdeu a conexão construída no primeiro turno.',
            },
          ],
        },
      ],
      explanation:
        'Validar a dificuldade reduz a ansiedade e abre espaço real para o aprendizado.',
    },
    estudante: {
      id: 'u0-l4-c1',
      type: 'mini_roleplay',
      prompt: 'Pratique uma entrevista real de estágio / vaga:',
      contextNote: 'A recrutadora testa sua segurança diante de pouca experiência formal.',
      personaName: 'Juliana Costa',
      personaRole: 'Recrutadora',
      personaInitials: 'JC',
      turns: [
        {
          incoming: 'Vi que você ainda não tem experiência formal na área. Como lidaria com um desafio novo aqui?',
          options: [
            {
              text: 'Eu não tenho experiência ainda, mas sou muito esforçado.',
              isIdeal: false,
              feedback: 'Ficou genérico — traga um exemplo prático!',
            },
            {
              text: 'Embora seja minha primeira experiência formal, já organizei projetos práticos na faculdade aprendendo rápido com feedbacks.',
              isIdeal: true,
              feedback: 'Excelente! Transformou vivência prática em evidência real.',
            },
          ],
        },
        {
          incoming: 'Legal! E se você errasse uma tarefa importante na primeira semana?',
          options: [
            {
              text: 'Avisaria meu líder de imediato, apresentaria o que aconteceu e perguntaria como corrigir para não repetir.',
              isIdeal: true,
              feedback: 'Maturidade e responsabilidade nota 10!',
            },
            {
              text: 'Tentaria consertar escondido para não causar má impressão.',
              isIdeal: false,
              feedback: 'Esconder erros quebra a confiança logo no início.',
            },
          ],
        },
      ],
      explanation:
        'Transparência e exemplos concretos se destacam em qualquer entrevista.',
    },
  };

  return {
    id: 'u0',
    number: 1,
    sectionLabel: 'SEÇÃO 1, UNIDADE 1',
    title: `Mapeamento: ${areaMeta.shortLabel} no Dia a Dia`,
    subtitle: `Situações reais de ${areaMeta.label} nos 4 formatos interativos.`,
    accentColor: '#00CD9C',
    shadowColor: '#00A67E',
    badgeText: 'TRILHA INICIAL',
    chestRewardXp: 40,
    lessons: [
      {
        id: 'u0-l1',
        unitId: 'u0',
        title: 'Dilemas do Dia a Dia',
        subtitle: `Decisões rápidas em situações reais de ${areaMeta.shortLabel}`,
        durationLabel: '3 min',
        xpReward: 45,
        skillBoost: { clarity: 4, control: 3 },
        challenges: [
          areaDilemmaByField[area],
          {
            id: 'u0-l1-c2',
            type: 'phrase_complete',
            contextBadge: `Rotina • ${areaMeta.shortLabel}`,
            situation: `Seu ${f.leader} pediu um(a) ${f.deliverable} verbalmente enquanto passava rápido.`,
            prefix: 'Só para confirmar e evitar retrabalho:',
            suffix: 'para hoje às 17h, certo?',
            options: [
              'você precisa dos dados principais nesse formato',
              'eu não entendi nada do que você falou correndo',
              'vou fazer do meu jeito e depois você vê',
            ],
            correctIndex: 0,
            explanation:
              'Confirmar o combinado por escrito mostra organização e evita retrabalho em qualquer profissão.',
          },
          {
            id: 'u0-l1-c3',
            type: 'mini_roleplay',
            prompt: 'Responda a um imprevisto de última hora:',
            contextNote: `Faltam 20 minutos para a ${f.meetingWord} e o material atrasou.`,
            personaName: 'Lucas Andrade',
            personaRole: f.leader,
            personaInitials: 'LA',
            turns: [
              {
                incoming: `Oi! Conseguiu finalizar o(a) ${f.deliverable} antes da ${f.meetingWord}?`,
                options: [
                  {
                    text: 'Ainda não, mas nem avisei porque achei que ia dar tempo.',
                    isIdeal: false,
                    feedback: 'Surpresas em cima da hora geram desgaste desnecessário.',
                  },
                  {
                    text: 'Faltam 15 minutos para fechar os últimos números — já tenho o resumo principal pronto para começarmos sem atraso.',
                    isIdeal: true,
                    feedback: 'Transparência + solução imediata transmitem segurança!',
                  },
                ],
              },
              {
                incoming: 'Perfeito! Pode me enviar esse resumo agora para eu dar uma olhada?',
                options: [
                  {
                    text: 'Claro, acabei de enviar e já levo a versão final atualizada na hora.',
                    isIdeal: true,
                    feedback: 'Agilidade e clareza impecáveis!',
                  },
                  {
                    text: 'Melhor esperar ficar 100% pronto senão fica feio.',
                    isIdeal: false,
                    feedback: 'Perfeccionismo na hora errada trava o alinhamento.',
                  },
                ],
              },
            ],
            explanation:
              'Sinalizar status cedo com uma solução parcial pronta é sinal de alta maturidade profissional.',
          },
        ],
      },
      {
        id: 'u0-l2',
        unitId: 'u0',
        title: 'Respostas que Conectam',
        subtitle: 'Complete frases assertivas sem soar defensivo',
        durationLabel: '3 min',
        xpReward: 50,
        skillBoost: { clarity: 5, empathy: 4 },
        challenges: [
          {
            id: 'u0-l2-c1',
            type: 'phrase_complete',
            contextBadge: 'Priorização Clara',
            situation: `Você recebeu duas demandas urgentes do ${f.teamWord} para o mesmo horário.`,
            prefix: 'Recebi as duas demandas e quero entregar com qualidade.',
            suffix: 'para eu começar agora?',
            options: [
              'Qual delas tem maior impacto hoje',
              'Vocês precisam se organizar melhor antes de pedir',
              'Vou escolher qualquer uma porque não sou polvo',
            ],
            correctIndex: 0,
            explanation:
              'Perguntar qual tem maior impacto envolve o outro na decisão sem reclamar.',
          },
          {
            id: 'u0-l2-c2',
            type: 'phrase_complete',
            contextBadge: 'Empatia no Retorno',
            situation: `Um(a) ${f.counterpart} reclamou que você demorou para responder.`,
            prefix: 'Entendo que a demora atrapalhou seu planejamento.',
            suffix: 'e te atualizo ainda hoje às 15h.',
            options: [
              'Já estou priorizando seu caso agora',
              'Mas você também não foi o único me chamando',
              'Infelizmente a fila está grande, aguarde',
            ],
            correctIndex: 0,
            explanation:
              'Validar o impacto + assumir ação imediata com horário exato acalma qualquer cobrança.',
          },
          {
            id: 'u0-l2-c3',
            type: 'dilemma',
            contextBadge: `Comunicação • ${areaMeta.shortLabel}`,
            prompt: `Você percebeu um erro importante no material que outro colega do(a) ${f.teamWord} preparou antes de enviar.`,
            options: [
              'Aponto o erro no grupo geral para todos verem que revisei.',
              'Deixo passar porque não é responsabilidade minha.',
              'Chamo o colega no privado, aponto o trecho específico com cuidado e ajudo a corrigir antes do envio.',
              'Envio direto para a liderança avisando da falha dele.',
            ],
            correctIndex: 2,
            explanation:
              'Corrigir no privado protege a relação e garante a qualidade do resultado coletivo.',
          },
        ],
      },
      {
        id: 'u0-l3',
        unitId: 'u0',
        title: 'Leitura de Clima',
        subtitle: 'Identifique emoções ocultas em mensagens reais',
        durationLabel: '3 min',
        xpReward: 50,
        skillBoost: { empathy: 5, control: 3 },
        challenges: [
          {
            id: 'u0-l3-c1',
            type: 'emotion_thermometer',
            prompt: 'Qual é o tom emocional real por trás desta mensagem?',
            messageSender: 'Marcos Lima',
            messageRole: f.leader,
            messageChannel: f.channel,
            messageBody: `Oi. Vi que o(a) ${f.deliverable} ainda não chegou. Já perguntaram duas vezes aqui. Pode ver isso?`,
            scaleLabels: ['Tranquilo', 'Neutro', 'Impaciente', 'Muito Tenso', 'Hostil'],
            idealRange: [2, 3],
            explanation:
              'Frases secas com cobrança externa sinalizam impaciência contida — responda com prazo objetivo e serenidade.',
          },
          {
            id: 'u0-l3-c2',
            type: 'mini_roleplay',
            prompt: 'Responda à mensagem tensa acima sem perder a calma:',
            contextNote: 'Marcos está pressionado e esperando uma resposta objetiva.',
            personaName: 'Marcos Lima',
            personaRole: f.leader,
            personaInitials: 'ML',
            turns: [
              {
                incoming: `Oi. Vi que o(a) ${f.deliverable} ainda não chegou. Já perguntaram duas vezes aqui.`,
                options: [
                  {
                    text: 'Não precisa falar nesse tom, eu já estou fazendo!',
                    isIdeal: false,
                    feedback: 'Escalar o tom transforma pressão em conflito pessoal.',
                  },
                  {
                    text: 'Oi Marcos! Já estou na revisão final e te envio às 14h30 sem falta. Posso te mandar uma prévia agora?',
                    isIdeal: true,
                    feedback: 'Calma + prazo exato + proatividade desarmam a tensão!',
                  },
                ],
              },
              {
                incoming: 'Se puder mandar às 14h30 já me ajuda muito, obrigado.',
                options: [
                  {
                    text: 'Combinado! Às 14h30 estará na sua mão.',
                    isIdeal: true,
                    feedback: 'Fechamento firme e confiável!',
                  },
                  {
                    text: 'Vou tentar, mas não garanto nada.',
                    isIdeal: false,
                    feedback: 'Gera insegurança logo após ter acalmado a conversa.',
                  },
                ],
              },
            ],
            explanation:
              'Quando alguém escreve tenso, responder com clareza e previsibilidade reduz imediatamente o atrito.',
          },
          {
            id: 'u0-l3-c3',
            type: 'emotion_thermometer',
            prompt: 'Como está o clima emocional desta resposta após um feedback?',
            messageSender: 'Rafael Souza',
            messageRole: `Colega • ${areaMeta.shortLabel}`,
            messageChannel: 'E-mail',
            messageBody:
              'Ok, anotado. Vou fazer exatamente como você pediu da próxima vez para não gerar mais problemas.',
            scaleLabels: ['Engajado', 'Aberto', 'Defensivo', 'Ressentido', 'Explosivo'],
            idealRange: [2, 3],
            explanation:
              'Obediência seca ("para não gerar mais problemas") sinaliza defensividade — vale um papo breve e acolhedor.',
          },
        ],
      },
      {
        id: 'u0-l4',
        unitId: 'u0',
        title: 'Diálogo na Prática',
        subtitle: `Bate-papo real no contexto de ${areaMeta.shortLabel}`,
        durationLabel: '4 min',
        xpReward: 60,
        skillBoost: { empathy: 4, clarity: 4, negotiation: 4 },
        challenges: [
          areaRoleplayByField[area],
          {
            id: 'u0-l4-c2',
            type: 'phrase_complete',
            contextBadge: 'Fechamento Assertivo',
            situation: `Após alinhar uma conversa difícil com um(a) ${f.counterpart}, você quer confirmar o acordo.`,
            prefix: 'Ótimo alinharmos isso!',
            suffix: 'para garantirmos que ficou tudo redondo.',
            options: [
              'Vou registrar os 2 próximos passos aqui por mensagem',
              'Espero que agora você não mude de ideia de novo',
              'Então acabou o assunto por aqui',
            ],
            correctIndex: 0,
            explanation:
              'Registrar os próximos passos ao fim de uma conversa fixa o compromisso de forma leve e profissional.',
          },
          {
            id: 'u0-l4-c3',
            type: 'dilemma',
            contextBadge: `Revisão • ${areaMeta.shortLabel}`,
            prompt: `Qual atitude mais fortalece sua reputação no dia a dia de ${areaMeta.label}?`,
            options: [
              'Concordar com tudo para evitar qualquer desconforto.',
              'Falar alto para impor sua opinião em discussões.',
              'Escutar com atenção, alinhar expectativas cedo e propor soluções claras.',
              'Trabalhar isolado para não depender de ninguém.',
            ],
            correctIndex: 2,
            explanation:
              'Escuta ativa + clareza + foco em solução formam o núcleo da inteligência emocional no trabalho.',
          },
        ],
      },
    ],
  };
}

/* =====================================================================
   UNITS 2, 3 & 4 — TAMBÉM ADAPTADAS À ÁREA DO USUÁRIO + MAIS BATE-PAPOS
   ===================================================================== */
function buildPersonalizedCoreUnits(area: WorkAreaId): CurriculumUnit[] {
  const areaMeta = getAreaMeta(area);
  const f = AREA_FLAVORS[area];

  return [
    {
      id: 'u1',
      number: 2,
      sectionLabel: 'SEÇÃO 1, UNIDADE 2',
      title: 'Comunicação Assertiva & Escuta Ativa',
      subtitle: `Fale com clareza e construa confiança em ${areaMeta.label}.`,
      accentColor: '#58CC02',
      shadowColor: '#46A302',
      badgeText: 'UNIDADE 2',
      chestRewardXp: 50,
      lessons: [
        {
          id: 'u1-l1',
          unitId: 'u1',
          title: 'Escuta sem Interromper',
          subtitle: 'Ouvir para entender antes de responder',
          durationLabel: '4 min',
          xpReward: 55,
          skillBoost: { empathy: 5, clarity: 3 },
          challenges: [
            {
              id: 'u1-l1-c1',
              type: 'dilemma',
              contextBadge: f.meetingWord,
              prompt: `Durante uma ${f.meetingWord}, um colega discordou da sua ideia na frente de um(a) ${f.counterpart}.`,
              options: [
                'Corto a fala dele para defender minha autoridade na hora.',
                'Fico em silêncio magoado e não participo mais.',
                'Agradeço o ponto de vista, anoto a preocupação e proponho avaliar ambos os caminhos com calma.',
                'Digo que isso já estava decidido e ele não prestou atenção.',
              ],
              correctIndex: 2,
              explanation:
                'Acolher a divergência com calma transmite maturidade e evita desgaste público.',
            },
            {
              id: 'u1-l1-c2',
              type: 'mini_roleplay',
              prompt: 'Lide com interrupções repetidas na reunião:',
              contextNote: 'Um colega interrompeu sua explicação pela terceira vez.',
              personaName: 'André Vasconcelos',
              personaRole: `Colega • ${areaMeta.shortLabel}`,
              personaInitials: 'AV',
              turns: [
                {
                  incoming: 'Desculpa cortar de novo, mas acho que esse caminho aí não vai funcionar não!',
                  options: [
                    {
                      text: 'André, você não me deixa falar nunca! Cala a boca um minuto!',
                      isIdeal: false,
                      feedback: 'Explodir faz todos esquecerem o seu argumento e focarem no seu tom.',
                    },
                    {
                      text: 'André, quero muito ouvir seu ponto — me deixa só concluir esse raciocínio em 30 segundos e já passo para você.',
                      isIdeal: true,
                      feedback: 'Firmeza elegante! Você retomou a fala sem agressividade.',
                    },
                  ],
                },
                {
                  incoming: 'Ah, perdão! Pode concluir, depois eu falo.',
                  options: [
                    {
                      text: 'Obrigado! Resumindo o impacto aqui... Agora sim, André, qual era sua preocupação?',
                      isIdeal: true,
                      feedback: 'Excelente! Cumpriu o combinado e manteve o respeito mútuo.',
                    },
                    {
                      text: 'Beleza, então agora vamos votar logo sem perder tempo.',
                      isIdeal: false,
                      feedback: 'Prometeu ouvir e cortou ele depois — quebra confiança.',
                    },
                  ],
                },
              ],
              explanation:
                'Assertividade é defender seu espaço de fala com firmeza serena e respeito.',
            },
            {
              id: 'u1-l1-c3',
              type: 'phrase_complete',
              contextBadge: 'Parafraseamento Empático',
              situation: `Um(a) ${f.counterpart} explicou uma reclamação longa e confusa.`,
              prefix: 'Só para garantir que entendi direitinho:',
              suffix: 'É isso mesmo?',
              options: [
                'o ponto principal que mais te incomodou foi o prazo de retorno',
                'você está reclamando de tudo ao mesmo tempo',
                'eu já sei o que fazer, não precisa explicar mais',
              ],
              correctIndex: 0,
              explanation:
                'Resumir a dor principal com suas palavras mostra escuta real e economiza tempo.',
            },
          ],
        },
        {
          id: 'u1-l2',
          unitId: 'u1',
          title: 'A Arte do Feedback',
          subtitle: 'Críticas que constroem sem ferir',
          durationLabel: '4 min',
          xpReward: 60,
          skillBoost: { empathy: 4, clarity: 4, leadership: 2 },
          challenges: [
            {
              id: 'u1-l2-c1',
              type: 'phrase_complete',
              contextBadge: 'Feedback sem Julgamento',
              situation: `Um colega tem se atrasado 15 minutos na ${f.meetingWord}.`,
              prefix: 'Notei que começamos 15 minutos depois nos últimos encontros, o que atrasa o alinhamento.',
              suffix: 'para conseguirmos começar no horário?',
              options: [
                'O que podemos ajustar juntos',
                'Por que você nunca tem compromisso',
                'Da próxima vez vou trancar a sala',
              ],
              correctIndex: 0,
              explanation:
                'Fato observável + impacto + pergunta colaborativa eliminam a defensividade.',
            },
            {
              id: 'u1-l2-c2',
              type: 'mini_roleplay',
              prompt: 'Receba um feedback duro com maturidade:',
              contextNote: `Seu ${f.leader} achou sua apresentação longa e confusa.`,
              personaName: 'Patrícia Gomes',
              personaRole: f.leader,
              personaInitials: 'PG',
              turns: [
                {
                  incoming: 'Sendo sincera, sua apresentação de hoje ficou confusa e longa demais.',
                  options: [
                    {
                      text: 'Mas tinha muita informação importante, não dava para resumir!',
                      isIdeal: false,
                      feedback: 'Justificar de imediato impede você de aproveitar o feedback.',
                    },
                    {
                      text: 'Obrigado pela sinceridade, Patrícia. Qual parte você sentiu que ficou mais pesada para eu enxugar na próxima?',
                      isIdeal: true,
                      feedback: 'Postura de crescimento! Transformou crítica em direção clara.',
                    },
                  ],
                },
                {
                  incoming: 'Os primeiros 10 minutos tiveram muito detalhe antes de mostrar a conclusão.',
                  options: [
                    {
                      text: 'Faz total sentido! Na próxima já abro com a conclusão no slide 1 e deixo os detalhes como apoio.',
                      isIdeal: true,
                      feedback: 'Excelente! Saiu do feedback com ação prática imediata.',
                    },
                    {
                      text: 'Entendi, desculpa mesmo, eu sou péssimo apresentando.',
                      isIdeal: false,
                      feedback: 'Autocrítica exagerada não resolve o ponto técnico.',
                    },
                  ],
                },
              ],
              explanation:
                'Receber feedback sem levar para o lado pessoal acelera sua evolução profissional.',
            },
            {
              id: 'u1-l2-c3',
              type: 'dilemma',
              contextBadge: 'Feedback Vago',
              prompt: `Seu ${f.leader} disse apenas: "Você precisa ser mais proativo". Como reagir?`,
              options: [
                'Fico frustrado e não pergunto nada.',
                'Começo a pegar tarefas de todo mundo sem critério.',
                'Agradeço e peço 2 exemplos práticos de situações onde ele esperava mais iniciativa minha.',
                'Reclamo com colegas que ele não sabe dar feedback.',
              ],
              correctIndex: 2,
              explanation:
                'Pedir exemplos concretos transforma um feedback vago em um plano claro de evolução.',
            },
          ],
        },
        {
          id: 'u1-l3',
          unitId: 'u1',
          title: 'Clareza Executiva',
          subtitle: 'Vá direto ao ponto em conversas decisivas',
          durationLabel: '4 min',
          xpReward: 65,
          skillBoost: { clarity: 6, leadership: 3 },
          challenges: [
            {
              id: 'u1-l3-c1',
              type: 'mini_roleplay',
              prompt: 'Alinhe um prazo decisivo em 2 turnos:',
              contextNote: 'A diretoria quer saber se a entrega sai este mês.',
              personaName: 'Helena Costa',
              personaRole: 'Diretora',
              personaInitials: 'HC',
              turns: [
                {
                  incoming: `Preciso de um resumo direto: o(a) ${f.deliverable} sai este mês ou não?`,
                  options: [
                    {
                      text: 'Depende de várias variáveis que ainda estamos analisando com calma.',
                      isIdeal: false,
                      feedback: 'Executivos precisam primeiro da resposta direta, depois do contexto.',
                    },
                    {
                      text: 'Sim, sai dia 28 com os 3 pontos principais. O complemento extra ficaria para dia 5.',
                      isIdeal: true,
                      feedback: 'Direto ao ponto! Resposta clara logo na primeira frase.',
                    },
                  ],
                },
                {
                  incoming: 'Ótimo. Existe algum risco que eu precise saber antes de avisar os envolvidos?',
                  options: [
                    {
                      text: 'O único ponto de atenção é a aprovação externa; se atrasar até sexta, te aviso já com plano B.',
                      isIdeal: true,
                      feedback: 'Excelente transparência e gestão de riscos!',
                    },
                    {
                      text: 'Acho que não, vai dar tudo certo, pode confiar.',
                      isIdeal: false,
                      feedback: 'Omitir riscos gera surpresas caras depois.',
                    },
                  ],
                },
              ],
              explanation:
                'Regra de ouro executiva: comece pela conclusão, destaque riscos reais e traga o próximo passo.',
            },
            {
              id: 'u1-l3-c2',
              type: 'phrase_complete',
              contextBadge: 'Comunicação Sem Jargão',
              situation: `Você precisa explicar um atraso para um(a) ${f.counterpart} que não conhece os bastidores.`,
              prefix: 'Tivemos um imprevisto operacional hoje, mas já estamos resolvendo.',
              suffix: 'e te confirmo assim que finalizar.',
              options: [
                'O impacto prático é que entregaremos amanhã às 10h',
                'Ocorreu uma falha sistêmica de protocolo nível 3',
                'Não sei explicar direito, mas vai atrasar',
              ],
              correctIndex: 0,
              explanation:
                'Traduzir bastidores em impacto prático e horário claro reduz ansiedade de quem espera.',
            },
            {
              id: 'u1-l3-c3',
              type: 'dilemma',
              contextBadge: 'Resumo de Reunião',
              prompt: `Ao terminar uma ${f.meetingWord} importante com várias decisões, qual a melhor prática?`,
              options: [
                'Confiar que todo mundo anotou mentalmente.',
                'Enviar um resumo curto com 3 bullets: o que foi decidido, quem faz e até quando.',
                'Mandar um texto gigante de 40 linhas com tudo que foi falado.',
                'Esperar alguém perguntar depois.',
              ],
              correctIndex: 1,
              explanation:
                'Resumos curtos com responsável e prazo multiplicam a execução de qualquer equipe.',
            },
          ],
        },
      ],
    },
    {
      id: 'u2',
      number: 3,
      sectionLabel: 'SEÇÃO 2, UNIDADE 3',
      title: 'Liderança & Gestão de Conflitos',
      subtitle: `Negocie limites saudáveis e lidere conversas difíceis em ${areaMeta.label}.`,
      accentColor: '#1CB0F6',
      shadowColor: '#1899D6',
      badgeText: 'UNIDADE 3',
      chestRewardXp: 60,
      lessons: [
        {
          id: 'u2-l1',
          unitId: 'u2',
          title: 'Dizer Não com Elegância',
          subtitle: 'Proteja prioridades sem fechar portas',
          durationLabel: '4 min',
          xpReward: 65,
          skillBoost: { negotiation: 6, clarity: 3 },
          challenges: [
            {
              id: 'u2-l1-c1',
              type: 'dilemma',
              contextBadge: 'Fim de Expediente',
              prompt:
                'Faltam 10 minutos para acabar seu turno e pedem "um favor rápido" que levaria 2 horas.',
              options: [
                'Faço virando a noite para não parecer indisponível.',
                'Respondo seco: "Meu horário acabou, amanhã a gente vê."',
                'Digo: "Consigo começar isso como primeira prioridade amanhã às 9h para entregar bem feito. Te atende?"',
                'Deixo a mensagem sem resposta.',
              ],
              correctIndex: 2,
              explanation:
                'O "não construtivo" protege seus limites oferecendo uma alternativa clara e confiável.',
            },
            {
              id: 'u2-l1-c2',
              type: 'mini_roleplay',
              prompt: 'Negocie um prazo apertado sem perder a parceria:',
              contextNote: `Seu ${f.leader} quer um(a) ${f.deliverable} completo em metade do tempo necessário.`,
              personaName: 'Roberto Nunes',
              personaRole: f.leader,
              personaInitials: 'RN',
              turns: [
                {
                  incoming: `Preciso desse(a) ${f.deliverable} completo até sexta-feira de manhã!`,
                  options: [
                    {
                      text: 'Isso é impossível, você nunca calcula o tempo direito.',
                      isIdeal: false,
                      feedback: 'Ataque direto gera resistência imediata.',
                    },
                    {
                      text: 'Quero garantir que fique excelente, Roberto. Para sexta, consigo a parte essencial; com tudo completo, entregamos terça. Qual prefere?',
                      isIdeal: true,
                      feedback: 'Brilhante! Deu opções claras sem perder o respeito.',
                    },
                  ],
                },
                {
                  incoming: 'A parte essencial na sexta já resolve minha reunião! Fechado para terça o restante.',
                  options: [
                    {
                      text: 'Combinado! Sexta às 9h te entrego o essencial pronto.',
                      isIdeal: true,
                      feedback: 'Acordo fechado com clareza e sem sobrecarga!',
                    },
                    {
                      text: 'Tá bom, mas não me pede mais nada essa semana.',
                      isIdeal: false,
                      feedback: 'Tom irritado estraga um bom acordo recém-fechado.',
                    },
                  ],
                },
              ],
              explanation:
                'Negociar escopo vs. prazo transforma um "não" em uma decisão estratégica compartilhada.',
            },
            {
              id: 'u2-l1-c3',
              type: 'phrase_complete',
              contextBadge: 'Limite Saudável',
              situation: 'Você está com 3 frentes críticas e recebeu uma quarta tarefa.',
              prefix: 'Estou focado em 3 entregas críticas hoje.',
              suffix: 'para manter o padrão de qualidade?',
              options: [
                'Qual delas devemos pausar para encaixar essa nova',
                'Não consigo fazer nada direito com tanta coisa',
                'Vou empurrar com a barriga até sexta',
              ],
              correctIndex: 0,
              explanation:
                'Mostrar o trade-off visível protege a qualidade sem soar resistente.',
            },
          ],
        },
        {
          id: 'u2-l2',
          unitId: 'u2',
          title: 'Mediação de Conflitos',
          subtitle: 'Desarme tensões entre pessoas e setores',
          durationLabel: '4 min',
          xpReward: 70,
          skillBoost: { leadership: 5, negotiation: 5 },
          challenges: [
            {
              id: 'u2-l2-c1',
              type: 'emotion_thermometer',
              prompt: 'Avalie o nível de escalada desta mensagem no grupo:',
              messageSender: 'Bruno Alves',
              messageRole: 'Coordenador',
              messageChannel: f.channel,
              messageBody:
                'Prometeram de novo algo sem consultar nossa equipe! Toda semana é a mesma bagunça.',
              scaleLabels: ['Calmo', 'Alerta', 'Fricção', 'Conflito Aberto', 'Crise Grave'],
              idealRange: [3, 4],
              explanation:
                'Acusação pública com generalização caracteriza conflito aberto — leve a conversa para o privado rapidamente.',
            },
            {
              id: 'u2-l2-c2',
              type: 'mini_roleplay',
              prompt: 'Medie o conflito do Bruno antes que escale:',
              contextNote: 'Bruno está furioso com uma promessa feita por outro setor.',
              personaName: 'Bruno Alves',
              personaRole: 'Coordenador',
              personaInitials: 'BA',
              turns: [
                {
                  incoming: 'Eles prometeram entrega para sexta sem perguntar para ninguém! Não vou aceitar!',
                  options: [
                    {
                      text: 'Calma Bruno, você está exagerando à toa.',
                      isIdeal: false,
                      feedback: 'Mandar alguém "ter calma" só aumenta a irritação.',
                    },
                    {
                      text: 'Entendo o impacto na nossa rotina, Bruno. Vamos fazer uma conversa rápida de 10 min com eles para construir uma saída viável.',
                      isIdeal: true,
                      feedback: 'Acolheu o impacto e tirou a briga do chat público!',
                    },
                  ],
                },
                {
                  incoming: 'Beleza, mas não tem como entregar tudo até sexta sem perder qualidade.',
                  options: [
                    {
                      text: 'Perfeito — vamos levar uma proposta em 2 etapas: o essencial seguro sexta e o restante semana que vem.',
                      isIdeal: true,
                      feedback: 'Mediação focada em solução prática!',
                    },
                    {
                      text: 'Então fala lá que eles vão ter que cancelar tudo.',
                      isIdeal: false,
                      feedback: 'Postura de tudo-ou-nada trava a negociação.',
                    },
                  ],
                },
              ],
              explanation:
                'Mediar conflitos é sair de "quem errou" para "como resolvemos juntos".',
            },
            {
              id: 'u2-l2-c3',
              type: 'dilemma',
              contextBadge: 'Apoio no Time',
              prompt: `Um colega novo no(a) ${f.teamWord} está travado há dois dias na mesma tarefa e com vergonha de pedir ajuda.`,
              options: [
                'Faço tudo por ele para acabar logo.',
                'Digo para ele se virar e pesquisar sozinho.',
                'Convido para 20 minutos juntos, fazendo perguntas que o ajudem a destravar com autonomia.',
                'Exponho na reunião que ele está atrasado.',
              ],
              correctIndex: 2,
              explanation:
                'Liderança sem cargo desenvolve pessoas com segurança psicológica.',
            },
          ],
        },
      ],
    },
    {
      id: 'u3',
      number: 4,
      sectionLabel: 'SEÇÃO 2, UNIDADE 4',
      title: 'Controle de Impulsos & Inteligência Emocional',
      subtitle: `Mantenha a lucidez sob pressão extrema em ${areaMeta.label}.`,
      accentColor: '#CE82FF',
      shadowColor: '#A55EEA',
      badgeText: 'UNIDADE 4',
      chestRewardXp: 70,
      lessons: [
        {
          id: 'u3-l1',
          unitId: 'u3',
          title: 'A Pausa Estratégica',
          subtitle: 'Responda com intenção, não por impulso',
          durationLabel: '4 min',
          xpReward: 70,
          skillBoost: { control: 6, empathy: 2 },
          challenges: [
            {
              id: 'u3-l1-c1',
              type: 'dilemma',
              contextBadge: `Pressão • ${areaMeta.shortLabel}`,
              prompt: `Um(a) ${f.counterpart} escreveu em letras maiúsculas te acusando injustamente de um erro que não foi seu.`,
              options: [
                'Respondo no mesmo tom apontando que a culpa foi dele.',
                'Encerro o contato por falta de respeito.',
                'Respiro por 30 segundos, mantenho a serenidade, apresento os fatos com cordialidade e foco na solução.',
                'Assumo uma culpa que não existiu só para acabar logo.',
              ],
              correctIndex: 2,
              explanation:
                'Você não precisa absorver a raiva do outro nem devolvê-la. Serenidade + fatos desarmam agressividade.',
            },
            {
              id: 'u3-l1-c2',
              type: 'emotion_thermometer',
              prompt: 'Qual o nível de risco emocional de enviar este rascunho no calor do momento?',
              messageSender: 'Seu Rascunho',
              messageRole: 'Antes de enviar',
              messageChannel: 'WhatsApp',
              messageBody:
                'Já expliquei isso três vezes!! Se vocês não leem o que eu mando fica impossível trabalhar aqui.',
              scaleLabels: ['Seguro', 'Leve', 'Arriscado', 'Alto Risco', 'Destrutivo'],
              idealRange: [3, 4],
              explanation:
                'Mensagens enviadas sob pico de estresse deixam marcas duradouras. Aplique a regra dos 5 minutos!',
            },
            {
              id: 'u3-l1-c3',
              type: 'phrase_complete',
              contextBadge: 'Reescrevendo com Calma',
              situation: 'Em vez de mandar o rascunho irritado acima, como reformular?',
              prefix: 'Vi que ainda ficou uma dúvida sobre o processo.',
              suffix: 'para alinharmos rapidinho?',
              options: [
                'Posso te ligar 3 minutos agora ou mandar um resumo em 2 pontos',
                'Dessa vez leia direito o que eu mandei lá em cima',
                'Não vou repetir de novo, pergunte para outra pessoa',
              ],
              correctIndex: 0,
              explanation:
                'Trocar acusação por um canal rápido de alinhamento resolve em 3 minutos o que viraria briga.',
            },
          ],
        },
        {
          id: 'u3-l2',
          unitId: 'u3',
          title: 'Calma em Momentos de Crise',
          subtitle: 'Estabilidade emocional que contagia a equipe',
          durationLabel: '4 min',
          xpReward: 85,
          skillBoost: { control: 6, leadership: 4 },
          challenges: [
            {
              id: 'u3-l2-c1',
              type: 'mini_roleplay',
              prompt: 'Conduza um colega em pânico durante uma crise:',
              contextNote: 'Um problema grave aconteceu no horário de maior movimento.',
              personaName: 'Diego Martins',
              personaRole: `Colega • ${areaMeta.shortLabel}`,
              personaInitials: 'DM',
              turns: [
                {
                  incoming: 'Deu tudo errado no pior horário! Todo mundo está cobrando ao mesmo tempo, não sei o que fazer!',
                  options: [
                    {
                      text: 'Como assim deu errado?! Resolve logo isso antes que a diretoria veja!',
                      isIdeal: false,
                      feedback: 'Pânico no líder paralisa a capacidade de reação do time.',
                    },
                    {
                      text: 'Respira, Diego. Vamos dividir: você checa a causa principal, eu aviso os envolvidos com calma e em 5 minutos nos falamos.',
                      isIdeal: true,
                      feedback: 'Brilhante! Calma estruturada + divisão clara de papéis.',
                    },
                  ],
                },
                {
                  incoming: 'Achei o problema! Em 5 minutos consigo normalizar tudo.',
                  options: [
                    {
                      text: 'Excelente foco! Aplica a correção com calma e me confirma assim que estabilizar.',
                      isIdeal: true,
                      feedback: 'Reforço positivo sob pressão mantém o time preciso e confiante.',
                    },
                    {
                      text: 'Beleza, depois vamos ver de quem foi a culpa disso.',
                      isIdeal: false,
                      feedback: 'Caça às bruxas durante uma crise destrói a segurança psicológica.',
                    },
                  ],
                },
              ],
              explanation:
                'Em crises, a calma estruturada de uma única pessoa organiza o ambiente inteiro.',
            },
            {
              id: 'u3-l2-c2',
              type: 'phrase_complete',
              contextBadge: 'Protagonismo no Erro',
              situation: 'Você descobriu que um ajuste seu causou um atraso importante hoje.',
              prefix: 'Identifiquei que o atraso veio de um ajuste meu.',
              suffix: 'para evitar que se repita.',
              options: [
                'Já corrigi e montei um checklist rápido de conferência',
                'Mas ninguém conferiu comigo antes',
                'Acontece, todo mundo erra às vezes',
              ],
              correctIndex: 0,
              explanation:
                'Assumir responsabilidade rápido acompanhada de correção gera muito mais respeito do que desculpas.',
            },
            {
              id: 'u3-l2-c3',
              type: 'dilemma',
              contextBadge: 'Desapego Profissional',
              prompt: `Você dedicou dias a um(a) ${f.deliverable} que foi cancelado por mudança estratégica da empresa.`,
              options: [
                'Reclamo abertamente da falta de visão da liderança.',
                'Entrego o mínimo nas próximas semanas por desânimo.',
                'Processo a frustração, guardo os aprendizados reaproveitáveis e alinho a nova prioridade.',
                'Continuo trabalhando escondido no projeto antigo.',
              ],
              correctIndex: 2,
              explanation:
                'Desapego emocional da entrega permite pivotar rápido sem carregar ressentimento.',
            },
          ],
        },
      ],
    },
  ];
}

export function getPersonalizedUnits(area: WorkAreaId): CurriculumUnit[] {
  return [buildIntroMappingUnit(area), ...buildPersonalizedCoreUnits(area)];
}

export function getPersonalizedLessons(area: WorkAreaId): CurriculumLesson[] {
  return getPersonalizedUnits(area).flatMap((u) => u.lessons);
}

export const CURRICULUM_UNITS: CurriculumUnit[] = getPersonalizedUnits('gestao');
export const ALL_LESSONS: CurriculumLesson[] = CURRICULUM_UNITS.flatMap((u) => u.lessons);

export const GATEKEEPER_SCENARIOS: GatekeeperScenario[] = [
  {
    id: 'gk-1',
    title: 'Entrevista de Emprego sob Pressão',
    category: 'Carreira',
    difficulty: 'Médio',
    personaName: 'Dra. Patrícia Mendes',
    personaRole: 'Head de Talentos',
    personaInitials: 'PM',
    channel: 'Entrevista',
    context: 'Etapa final para uma vaga estratégica. A entrevistadora testa sua reação a uma objeção direta.',
    openingMessage:
      'Gostei do seu perfil, mas sendo bem direta: você não tem experiência prévia em parte do que a vaga pede. Por que deveríamos apostar em você em vez de outro candidato?',
    tacticalSuggestions: [
      {
        label: 'Foco em Adaptabilidade & Provas',
        text: 'Entendo a preocupação. Embora ainda não tenha atuado nessa parte específica, tenho histórico de aprender rápido e gerar resultado nas primeiras semanas. Minha base prática e comprometimento reduzem muito essa curva.',
        quality: 'master',
      },
      {
        label: 'Honestidade Simples',
        text: 'Eu realmente não tenho essa vivência ainda, mas sou muito esforçado e posso estudar por fora para alcançar a equipe.',
        quality: 'good',
      },
      {
        label: 'Resposta Defensiva',
        text: 'Isso qualquer um aprende, acho que vocês estão olhando demais para o papel e pouco para o meu potencial.',
        quality: 'reactive',
      },
    ],
    idealKeywords: ['entendo', 'aprendizado', 'resultado', 'experiência', 'base', 'curva', 'adapto', 'plano', 'semanas'],
    avoidKeywords: ['qualquer um', 'culpa', 'injusto', 'vocês estão errados', 'tanto faz'],
  },
  {
    id: 'gk-2',
    title: 'Atraso em uma Entrega Crítica',
    category: 'Liderança',
    difficulty: 'Alto',
    personaName: 'Ricardo Viana',
    personaRole: 'Gerente de Operações',
    personaInitials: 'RV',
    channel: 'Slack',
    context: 'São 18h30 de quinta-feira. Uma entrega prometida para hoje atrasou por um imprevisto.',
    openingMessage:
      'Acabei de verificar e a entrega ainda não foi concluída! Eu já tinha alinhado com a diretoria que estaria pronto hoje. O que está acontecendo?!',
    tacticalSuggestions: [
      {
        label: 'Ownership + Plano Claro',
        text: 'Ricardo, assumo a falha de não ter te avisado mais cedo. Tivemos um bloqueio às 15h, já isolamos a causa e garantimos a entrega amanhã às 10h — posso te atualizar às 8h30?',
        quality: 'master',
      },
      {
        label: 'Explicação Genérica',
        text: 'Oi Ricardo, deu um imprevisto hoje à tarde e não conseguimos fechar, mas amanhã a gente tenta terminar.',
        quality: 'good',
      },
      {
        label: 'Transferir Culpa',
        text: 'A culpa não foi minha, o outro setor demorou para mandar os dados e travou tudo.',
        quality: 'reactive',
      },
    ],
    idealKeywords: ['assumo', 'plano', 'correção', 'horário', 'atualizar', 'causa', 'garantimos', 'amanhã', 'solução'],
    avoidKeywords: ['culpa', 'não foi minha', 'calma', 'impossível', 'eles atrasaram'],
  },
  {
    id: 'gk-3',
    title: 'Crítica Dura na Frente da Equipe',
    category: 'Inteligência Emocional',
    difficulty: 'Extremo',
    personaName: 'Eduardo Farias',
    personaRole: 'Diretor',
    personaInitials: 'EF',
    channel: 'Reunião',
    context: 'No meio da reunião semanal com 15 pessoas, o diretor interrompe sua apresentação em tom áspero.',
    openingMessage:
      'Sinceramente, essa análise está superficial. Esperava muito mais profundidade antes de você trazer isso para uma reunião com tanta gente.',
    tacticalSuggestions: [
      {
        label: 'Serenidade + Alinhamento',
        text: 'Obrigado pelo retorno direto, Eduardo. Quero garantir que a decisão seja tomada com a profundidade certa. Quais dois pontos específicos você gostaria que eu detalhasse agora ou logo após a reunião?',
        quality: 'master',
      },
      {
        label: 'Recuar em Silêncio',
        text: 'Desculpa Eduardo, vou refazer tudo depois da reunião e te mando por e-mail.',
        quality: 'good',
      },
      {
        label: 'Rebater em Público',
        text: 'Não acho justo falar assim na frente de todo mundo, eu só tive dois dias para montar isso!',
        quality: 'reactive',
      },
    ],
    idealKeywords: ['obrigado', 'entendo', 'específicos', 'aprofundar', 'alinhamento', 'indicadores', 'reunião', 'clareza'],
    avoidKeywords: ['injusto', 'grosseiro', 'você não viu', 'tanto faz', 'não é minha culpa'],
  },
  {
    id: 'gk-4',
    title: 'Cliente Furioso Ameaçando Cancelar',
    category: 'Empatia & Negociação',
    difficulty: 'Alto',
    personaName: 'Fernanda Nogueira',
    personaRole: 'Cliente VIP',
    personaInitials: 'FN',
    channel: 'Cliente',
    context: 'Um erro de cobrança aconteceu pela segunda vez. A cliente ligou extremamente irritada.',
    openingMessage:
      'É a segunda vez neste trimestre que vocês erram na nossa fatura! Estou cansada de perder tempo com isso, já vou pedir o cancelamento hoje!',
    tacticalSuggestions: [
      {
        label: 'Empatia + Ação Imediata',
        text: 'Fernanda, você tem toda razão em estar frustrada — dois erros seguidos são inaceitáveis. Já acionei o financeiro para estornar hoje mesmo e vou acompanhar pessoalmente os próximos 3 envios para garantir zero erros.',
        quality: 'master',
      },
      {
        label: 'Protocolo Padrão',
        text: 'Sinto muito pelo transtorno, Fernanda. Vou abrir um chamado no financeiro e o prazo de retorno é de até 5 dias úteis.',
        quality: 'good',
      },
      {
        label: 'Minimizar o Erro',
        text: 'Calma Fernanda, isso foi só uma falha automática, não precisa cancelar por causa disso.',
        quality: 'reactive',
      },
    ],
    idealKeywords: ['razão', 'frustrada', 'estornar', 'acompanhar', 'pessoalmente', 'hoje', 'garantir', 'entendo', 'solução'],
    avoidKeywords: ['calma', 'exagerando', 'sistema', '5 dias', 'não precisa'],
  },
  {
    id: 'gk-5',
    title: 'Pedido Impossível da Diretoria',
    category: 'Negociação',
    difficulty: 'Alto',
    personaName: 'Gustavo Prado',
    personaRole: 'CEO',
    personaInitials: 'GP',
    channel: 'Reunião',
    context: 'A diretoria quer lançar um projeto gigante para um evento que acontece em 4 dias.',
    openingMessage:
      'Quero lançar o projeto completo no evento de sexta. Sei que o time está cheio, mas precisamos dar um jeito de entregar tudo!',
    tacticalSuggestions: [
      {
        label: 'Trade-off Inteligente',
        text: 'Gustavo, entendo o peso estratégico do evento. Para garantir impacto sem risco de falhar ao vivo, consigo entregar até sexta a apresentação do fluxo principal. Para o projeto completo, precisamos de mais 10 dias. Qual caminho prefere?',
        quality: 'master',
      },
      {
        label: 'Aceitar sem Filtro',
        text: 'Pode deixar Gustavo, vamos fazer hora extra toda noite para tentar entregar tudo até sexta.',
        quality: 'good',
      },
      {
        label: 'Recusa Seca',
        text: 'Isso é completamente impossível em 4 dias, não tem a menor chance de acontecer.',
        quality: 'reactive',
      },
    ],
    idealKeywords: ['entendo', 'estratégico', 'risco', 'opção', 'principal', 'qualidade', 'prazo', 'prefere'],
    avoidKeywords: ['impossível', 'nunca', 'sem chance', 'absurdo'],
  },
  {
    id: 'gk-6',
    title: 'Conflito Entre Colegas da Equipe',
    category: 'Gestão de Conflitos',
    difficulty: 'Médio',
    personaName: 'Lucas & Thiago',
    personaRole: 'Colegas de Equipe',
    personaInitials: 'LT',
    channel: 'Slack',
    context: 'Dois colegas travaram uma entrega importante discutindo qual abordagem é melhor.',
    openingMessage:
      'Não vou aprovar esse material dele, está totalmente fora do padrão que eu desenhei. Se quiserem seguir assim, eu tiro meu nome da responsabilidade.',
    tacticalSuggestions: [
      {
        label: 'Desarmar & Focar em Critérios',
        text: 'Pessoal, respeito o cuidado dos dois. Vamos pausar o chat e fazer 15 minutos juntos comparando as duas opções por 3 critérios objetivos: prazo, qualidade e impacto no cliente. Assim decidimos pelo melhor resultado.',
        quality: 'master',
      },
      {
        label: 'Pedir para o Chefe Resolver',
        text: 'Gente, parem de brigar no chat, vou chamar o gestor para decidir logo quem está certo.',
        quality: 'good',
      },
      {
        label: 'Tomar Partido Ríspido',
        text: 'Você está sendo teimoso, o trabalho dele funciona e você só quer impor o seu jeito.',
        quality: 'reactive',
      },
    ],
    idealKeywords: ['respeito', 'critérios', 'objetivos', 'juntos', 'resultado', 'comparando', 'minutos', 'solução'],
    avoidKeywords: ['teimoso', 'ego', 'brigar', 'impor', 'culpa'],
  },
];
