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

export interface DilemmaChallenge {
  id: string;
  type: 'dilemma';
  contextBadge: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CnvBuilderChallenge {
  id: string;
  type: 'cnv_builder';
  prompt: string;
  situation: string;
  correctOrder: string[];
  distractors?: string[];
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
  personaName: string;
  personaRole: string;
  personaInitials: string;
  turns: [RoleplayTurn, RoleplayTurn];
  explanation: string;
}

export type MicroChallenge =
  | DilemmaChallenge
  | CnvBuilderChallenge
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

/**
 * Generates the Introductory Mapping Trail (Seção 1, Unidade 1)
 * personalized to the user's work area, introducing all 4 question formats
 * using real everyday situations from their field.
 */
function buildIntroMappingUnit(area: WorkAreaId): CurriculumUnit {
  const areaMeta = getAreaMeta(area);

  const areaDilemmaByField: Record<WorkAreaId, DilemmaChallenge> = {
    vendas: {
      id: 'u0-l1-c1',
      type: 'dilemma',
      contextBadge: 'Mapeamento • Comercial',
      prompt:
        'Um cliente em potencial diz: "O concorrente faz 20% mais barato". Qual sua primeira reação?',
      options: [
        'Dou desconto na hora para não perder a venda.',
        'Digo que o concorrente tem qualidade ruim.',
        'Valido a comparação e pergunto quais resultados ele mais valoriza para mostrar nosso diferencial real.',
        'Encerro a conversa porque o orçamento dele é baixo.',
      ],
      correctIndex: 2,
      explanation:
        'Em vendas consultivas, você não defende preço — você investiga valor antes de negociar.',
    },
    saude: {
      id: 'u0-l1-c1',
      type: 'dilemma',
      contextBadge: 'Mapeamento • Saúde',
      prompt:
        'Um familiar está visivelmente ansioso na recepção cobrando informações imediatas enquanto você finaliza outro atendimento.',
      options: [
        'Peço para ele aguardar em silêncio sem olhar nos olhos.',
        'Faço contato visual calmo, valido a preocupação dele e informo o tempo exato em que vou atendê-lo.',
        'Interrompo o atendimento atual no meio para evitar reclamação.',
        'Digo que há pessoas em situação mais grave esperando.',
      ],
      correctIndex: 1,
      explanation:
        'Previsibilidade + acolhimento em 10 segundos reduzem drasticamente a ansiedade em ambientes de saúde.',
    },
    gestao: {
      id: 'u0-l1-c1',
      type: 'dilemma',
      contextBadge: 'Mapeamento • Gestão & Adm',
      prompt:
        'Dois colegas de áreas diferentes te mandaram pedidos urgentes para o mesmo horário sem alinhamento prévio.',
      options: [
        'Tento fazer os dois correndo mesmo arriscando errar.',
        'Ignoro o pedido de quem tem cargo menor.',
        'Respondo aos dois com transparência, alinho qual impacto é mais crítico agora e confirmo o horário do segundo.',
        'Repasso o problema para outro colega resolver.',
      ],
      correctIndex: 2,
      explanation:
        'Priorização visível e comunicação clara evitam sobrecarga silenciosa e constroem confiança.',
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
        'Durante um atendimento/aula em grupo, uma pessoa faz um comentário irônico questionando o método que você está explicando.',
      options: [
        'Respondo com ironia para manter autoridade na sala.',
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
      prompt: 'Pratique um diálogo real de negociação com cliente:',
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
              feedback: 'Fecha a negociação sem entender a necessidade real.',
            },
            {
              text: 'Entendo, Carlos. Qual data seria ideal para a sua operação não parar?',
              isIdeal: true,
              feedback: 'Ótimo! Você investigou o real prazo crítico dele.',
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
        'No formato Mini-Roleplay você treina conversas reais em 2 turnos com feedback instantâneo.',
    },
    saude: {
      id: 'u0-l4-c1',
      type: 'mini_roleplay',
      prompt: 'Pratique um diálogo de acolhimento sob pressão:',
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
        'No formato Mini-Roleplay você treina conversas reais de atendimento com calma e clareza.',
    },
    gestao: {
      id: 'u0-l4-c1',
      type: 'mini_roleplay',
      prompt: 'Pratique uma conversa de alinhamento com sua equipe:',
      personaName: 'Mariana Silva',
      personaRole: 'Analista da Equipe',
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
        'No formato Mini-Roleplay você treina conversas reais de gestão e colaboração.',
    },
    tecnologia: {
      id: 'u0-l4-c1',
      type: 'mini_roleplay',
      prompt: 'Pratique um alinhamento rápido entre áreas:',
      personaName: 'Camila Rocha',
      personaRole: 'Designer de Produto',
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
        'No formato Mini-Roleplay você pratica diálogos reais de colaboração entre áreas.',
    },
    educacao: {
      id: 'u0-l4-c1',
      type: 'mini_roleplay',
      prompt: 'Pratique um diálogo construtivo de orientação:',
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
        'No formato Mini-Roleplay você treina conversas reais de orientação e atendimento.',
    },
    estudante: {
      id: 'u0-l4-c1',
      type: 'mini_roleplay',
      prompt: 'Pratique uma conversa real de entrevista / estágio:',
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
              feedback: 'Excelente! Transformou vivência acadêmica em evidência real.',
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
        'No formato Mini-Roleplay você treina conversas reais de carreira e entrevistas.',
    },
  };

  return {
    id: 'u0',
    number: 1,
    sectionLabel: 'SEÇÃO 1, UNIDADE 1',
    title: `Mapeamento: ${areaMeta.shortLabel} no Dia a Dia`,
    subtitle: `Conheça os 4 formatos de treino em situações reais de ${areaMeta.label}.`,
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
        durationLabel: '2 min',
        xpReward: 40,
        skillBoost: { clarity: 4, control: 3 },
        challenges: [
          areaDilemmaByField[area],
          {
            id: 'u0-l1-c2',
            type: 'dilemma',
            contextBadge: 'Rotina Profissional',
            prompt:
              'Você recebeu um pedido verbal rápido no corredor ou ligação, sem prazo nem detalhes escritos.',
            options: [
              'Faço do jeito que lembrar para economizar tempo.',
              'Envio uma mensagem curta confirmando o combinado e o horário de entrega.',
              'Espero a pessoa cobrar novamente.',
              'Pergunto a terceiros o que ela quis dizer.',
            ],
            correctIndex: 1,
            explanation:
              'Confirmar combinados verbais por escrito elimina mal-entendidos em qualquer profissão.',
          },
        ],
      },
      {
        id: 'u0-l2',
        unitId: 'u0',
        title: 'Construindo Respostas',
        subtitle: 'Monte frases empáticas e claras bloco a bloco',
        durationLabel: '3 min',
        xpReward: 45,
        skillBoost: { clarity: 5, empathy: 4 },
        challenges: [
          {
            id: 'u0-l2-c1',
            type: 'cnv_builder',
            prompt: 'Toque nos blocos na ordem certa para alinhar duas tarefas urgentes:',
            situation: 'Você recebeu duas prioridades para o mesmo horário.',
            correctOrder: [
              'Recebi as duas demandas',
              'e quero entregar com qualidade.',
              'Qual delas tem maior impacto',
              'para eu priorizar agora?',
            ],
            distractors: ['Estou sobrecarregado demais'],
            explanation:
              'Comunicação assertiva mostra organização e convida o outro a priorizar junto com você.',
          },
          {
            id: 'u0-l2-c2',
            type: 'cnv_builder',
            prompt: 'Monte uma resposta acolhedora para um atraso no retorno:',
            situation: 'Alguém reclamou que você demorou para responder.',
            correctOrder: [
              'Entendo que a espera',
              'atrapalhou seu planejamento.',
              'Vou priorizar seu caso agora',
              'e te retorno às 15h.',
            ],
            distractors: ['Mas eu estava ocupado'],
            explanation:
              'Validar o impacto antes de dar a solução desarma a irritação na hora.',
          },
        ],
      },
      {
        id: 'u0-l3',
        unitId: 'u0',
        title: 'Leitura de Clima',
        subtitle: 'Identifique emoções ocultas em mensagens reais',
        durationLabel: '2 min',
        xpReward: 45,
        skillBoost: { empathy: 5, control: 3 },
        challenges: [
          {
            id: 'u0-l3-c1',
            type: 'emotion_thermometer',
            prompt: 'Qual é o tom emocional real por trás desta mensagem?',
            messageSender: 'Marcos Lima',
            messageRole: 'Coordenação',
            messageChannel: 'WhatsApp',
            messageBody:
              'Oi. Vi que o combinado ainda não chegou. Já perguntaram duas vezes aqui. Pode ver isso?',
            scaleLabels: ['Tranquilo', 'Neutro', 'Impaciente', 'Muito Tenso', 'Hostil'],
            idealRange: [2, 3],
            explanation:
              'Frases secas e menção à cobrança externa sinalizam impaciência contida — responda com prazo objetivo e calma.',
          },
        ],
      },
      {
        id: 'u0-l4',
        unitId: 'u0',
        title: 'Diálogo na Prática',
        subtitle: `Simulação em 2 turnos no contexto de ${areaMeta.shortLabel}`,
        durationLabel: '3 min',
        xpReward: 55,
        skillBoost: { empathy: 4, clarity: 4, negotiation: 4 },
        challenges: [areaRoleplayByField[area]],
      },
    ],
  };
}

const CORE_UNIVERSAL_UNITS: CurriculumUnit[] = [
  {
    id: 'u1',
    number: 2,
    sectionLabel: 'SEÇÃO 1, UNIDADE 2',
    title: 'Comunicação Assertiva & Escuta Ativa',
    subtitle: 'Fale com clareza, elimine ruídos e construa pontes em qualquer conversa.',
    accentColor: '#58CC02',
    shadowColor: '#46A302',
    badgeText: 'UNIDADE 2',
    chestRewardXp: 50,
    lessons: [
      {
        id: 'u1-l1',
        unitId: 'u1',
        title: 'Escuta sem Interromper',
        subtitle: 'Ouvir para entender, não só para rebater',
        durationLabel: '3 min',
        xpReward: 55,
        skillBoost: { empathy: 5, clarity: 3 },
        challenges: [
          {
            id: 'u1-l1-c1',
            type: 'dilemma',
            contextBadge: 'Reunião Importante',
            prompt:
              'Um colega discordou da sua proposta na frente de um cliente ou gestor importante.',
            options: [
              'Corto a fala dele para defender minha autoridade na hora.',
              'Fico em silêncio magoado e não participo mais.',
              'Agradeço o ponto de vista, anoto a preocupação e proponho avaliar ambos os cenários com clareza.',
              'Digo que isso já estava decidido e ele não prestou atenção.',
            ],
            correctIndex: 2,
            explanation:
              'Acolher a divergência com calma transmite maturidade e evita desgaste público.',
          },
          {
            id: 'u1-l1-c2',
            type: 'emotion_thermometer',
            prompt: 'Meça o nível de abertura emocional deste retorno após uma orientação:',
            messageSender: 'Rafael Souza',
            messageRole: 'Colega de Equipe',
            messageChannel: 'E-mail',
            messageBody:
              'Ok, anotado. Vou fazer exatamente como você pediu da próxima vez para não gerar mais problemas.',
            scaleLabels: ['Engajado', 'Aberto', 'Defensivo', 'Ressentido', 'Explosivo'],
            idealRange: [2, 3],
            explanation:
              'Obediência seca ("para não gerar mais problemas") sinaliza defensividade — vale uma conversa rápida e acolhedora.',
          },
        ],
      },
      {
        id: 'u1-l2',
        unitId: 'u1',
        title: 'A Arte do Feedback CNV',
        subtitle: 'Críticas que constroem sem ferir',
        durationLabel: '4 min',
        xpReward: 60,
        skillBoost: { empathy: 4, clarity: 4, leadership: 2 },
        challenges: [
          {
            id: 'u1-l2-c1',
            type: 'cnv_builder',
            prompt: 'Monte um feedback usando Fato → Impacto → Pedido:',
            situation: 'Um colega tem chegado 15 minutos atrasado nos encontros da equipe.',
            correctOrder: [
              'Notei que nos últimos três encontros',
              'começamos 15 minutos depois.',
              'Isso atrasa o alinhamento de todos.',
              'Podemos ajustar o horário ou combinar um lembrete?',
            ],
            distractors: ['Você está sendo descompromissado'],
            explanation:
              'Separar fatos observáveis de julgamentos pessoais faz o outro ouvir sem se fechar.',
          },
          {
            id: 'u1-l2-c2',
            type: 'dilemma',
            contextBadge: 'Recebendo Crítica',
            prompt:
              'Seu líder disse que sua apresentação ficou "confusa e longa demais". Qual a melhor postura?',
            options: [
              'Justifico que tinha muita informação importante e não dava para cortar.',
              'Agradeço a sinceridade e peço 2 exemplos objetivos do que posso enxugar na próxima.',
              'Peço desculpas repetidamente dizendo que não sou bom nisso.',
              'Ignoro porque outros colegas elogiaram.',
            ],
            correctIndex: 1,
            explanation:
              'Transformar críticas duras em perguntas específicas acelera sua evolução.',
          },
        ],
      },
      {
        id: 'u1-l3',
        unitId: 'u1',
        title: 'Clareza Executiva',
        subtitle: 'Vá direto ao ponto em conversas decisivas',
        durationLabel: '3 min',
        xpReward: 65,
        skillBoost: { clarity: 6, leadership: 3 },
        challenges: [
          {
            id: 'u1-l3-c1',
            type: 'mini_roleplay',
            prompt: 'Alinhe um prazo com a diretoria em 2 passos:',
            personaName: 'Helena Costa',
            personaRole: 'Diretora',
            personaInitials: 'HC',
            turns: [
              {
                incoming: 'Preciso de um resumo direto: a entrega sai este mês ou não?',
                options: [
                  {
                    text: 'Depende de várias variáveis que ainda estamos analisando com calma.',
                    isIdeal: false,
                    feedback: 'Líderes precisam primeiro da resposta direta, depois do contexto.',
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
                    text: 'O único ponto de atenção é a aprovação do fornecedor; se atrasar até sexta, te aviso já com plano B.',
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
        ],
      },
    ],
  },
  {
    id: 'u2',
    number: 3,
    sectionLabel: 'SEÇÃO 2, UNIDADE 3',
    title: 'Liderança & Gestão de Conflitos',
    subtitle: 'Influencie pessoas, negocie limites saudáveis e transforme atritos em parceria.',
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
        durationLabel: '3 min',
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
            type: 'cnv_builder',
            prompt: 'Negocie um prazo apertado mantendo parceria:',
            situation: 'Pediram uma entrega grande em metade do tempo necessário.',
            correctOrder: [
              'Quero garantir que essa entrega',
              'gere o resultado esperado.',
              'Para sexta, consigo a versão essencial;',
              'com tudo completo, entregamos terça.',
            ],
            distractors: ['Vocês nunca calculam o prazo direito'],
            explanation:
              'Apresentar opções (escopo vs prazo) coloca você como parceiro estratégico.',
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
            prompt: 'Avalie o nível de escalada desta mensagem no grupo da empresa:',
            messageSender: 'Bruno Alves',
            messageRole: 'Coordenador',
            messageChannel: 'WhatsApp',
            messageBody:
              'Prometeram de novo algo sem consultar nossa equipe! Toda semana é a mesma bagunça.',
            scaleLabels: ['Calmo', 'Alerta', 'Fricção', 'Conflito Aberto', 'Crise Grave'],
            idealRange: [3, 4],
            explanation:
              'Acusação pública com generalização caracteriza conflito aberto — leve a conversa para o privado rapidamente.',
          },
          {
            id: 'u2-l2-c2',
            type: 'dilemma',
            contextBadge: 'Apoio no Time',
            prompt:
              'Um colega novo está travado há dois dias na mesma tarefa e com vergonha de pedir ajuda.',
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
    subtitle: 'Mantenha a lucidez sob pressão extrema e lidere suas emoções.',
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
        durationLabel: '3 min',
        xpReward: 70,
        skillBoost: { control: 6, empathy: 2 },
        challenges: [
          {
            id: 'u3-l1-c1',
            type: 'dilemma',
            contextBadge: 'Pressão no Atendimento',
            prompt:
              'Um cliente escreveu em letras maiúsculas te acusando injustamente de um erro que não foi seu.',
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
            type: 'cnv_builder',
            prompt: 'Comunique um erro seu com maturidade e protagonismo:',
            situation: 'Um deslize seu causou um atraso importante hoje.',
            correctOrder: [
              'Identifiquei que o atraso veio',
              'de um ajuste que eu fiz.',
              'Já apliquei a correção',
              'e criei um checklist para não repetir.',
            ],
            distractors: ['Mas ninguém conferiu comigo'],
            explanation:
              'Assumir responsabilidade rápido acompanhada de prevenção gera muito mais respeito do que esconder falhas.',
          },
        ],
      },
    ],
  },
];

export function getPersonalizedUnits(area: WorkAreaId): CurriculumUnit[] {
  return [buildIntroMappingUnit(area), ...CORE_UNIVERSAL_UNITS];
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
