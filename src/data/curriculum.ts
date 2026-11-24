import type { BehavioralMetrics } from '../store/useAppStore';

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
  /** Correct ordered sequence of phrase chips */
  correctOrder: string[];
  /** Optional extra distractor chips */
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
  /** 5 labels from index 0 to 4 */
  scaleLabels: [string, string, string, string, string];
  /** Inclusive min and max index (0..4) considered correct */
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
  title: string;
  subtitle: string;
  accentColor: string;
  badgeText: string;
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

export const CURRICULUM_UNITS: CurriculumUnit[] = [
  {
    id: 'u1',
    number: 1,
    title: 'Comunicação Assertiva & Escuta Ativa',
    subtitle: 'Fale com clareza, elimine ruídos e construa pontes em qualquer conversa.',
    accentColor: '#43B02A',
    badgeText: 'UNIDADE 1',
    lessons: [
      {
        id: 'u1-l1',
        unitId: 'u1',
        title: 'O Código da Clareza',
        subtitle: 'Alinhamento sem ruídos no dia a dia',
        durationLabel: '3 min',
        xpReward: 50,
        skillBoost: { clarity: 5, empathy: 2 },
        challenges: [
          {
            id: 'u1-l1-c1',
            type: 'dilemma',
            contextBadge: 'Dilema no Corredor',
            prompt:
              'Seu gestor pediu uma análise urgente verbalmente enquanto saía da sala, sem detalhar métricas ou prazo.',
            options: [
              'Começo a fazer do jeito que acho melhor para mostrar agilidade.',
              'Envio uma mensagem curta confirmando escopo, métricas e horário exato de entrega.',
              'Espero ele lembrar e me mandar um e-mail formal.',
              'Pergunto para um colega o que ele acha que o chefe quis dizer.',
            ],
            correctIndex: 1,
            explanation:
              'Confirmar demandas verbais por escrito evita retrabalho, alinha expectativas e demonstra senioridade.',
          },
          {
            id: 'u1-l1-c2',
            type: 'cnv_builder',
            prompt: 'Monte uma mensagem clara e colaborativa para confirmar a prioridade:',
            situation: 'Você recebeu duas tarefas urgentes para o mesmo horário.',
            correctOrder: [
              'Recebi as duas demandas',
              'e quero entregar com qualidade.',
              'Qual delas tem maior impacto',
              'para eu priorizar agora?',
            ],
            distractors: ['Estou sobrecarregado demais'],
            explanation:
              'Comunicação assertiva expõe o cenário sem reclamar e convida a liderança a decidir a prioridade.',
          },
          {
            id: 'u1-l1-c3',
            type: 'emotion_thermometer',
            prompt: 'Qual é o tom emocional real por trás desta mensagem?',
            messageSender: 'Marcos Lima',
            messageRole: 'Gerente de Produto',
            messageChannel: 'Slack',
            messageBody:
              'Oi. Vi que o relatório ainda não subiu. A diretoria perguntou duas vezes. Pode ver isso?',
            scaleLabels: ['Tranquilo', 'Neutro', 'Impaciente', 'Muito Tenso', 'Hostil'],
            idealRange: [2, 3],
            explanation:
              'Frases curtas com ponto final e menção à cobrança da diretoria sinalizam impaciência e tensão contida — responda com prazo objetivo.',
          },
        ],
      },
      {
        id: 'u1-l2',
        unitId: 'u1',
        title: 'Escuta Ativa na Prática',
        subtitle: 'Ouvir para entender, não só para rebater',
        durationLabel: '4 min',
        xpReward: 55,
        skillBoost: { empathy: 5, clarity: 3 },
        challenges: [
          {
            id: 'u1-l2-c1',
            type: 'mini_roleplay',
            prompt: 'Conduza este diálogo com escuta ativa:',
            personaName: 'Camila Rocha',
            personaRole: 'Designer de Produto',
            personaInitials: 'CR',
            turns: [
              {
                incoming:
                  'Sinto que minhas sugestões de UX nunca entram na sprint. Sempre priorizam só backend.',
                options: [
                  {
                    text: 'Não é verdade, o backend está cheio de dívida técnica urgente.',
                    isIdeal: false,
                    feedback: 'Rebater de imediato invalida a frustração dela.',
                  },
                  {
                    text: 'Entendo sua frustração, Camila. Quais melhorias de UX você sente que mais impactam o usuário agora?',
                    isIdeal: true,
                    feedback: 'Perfeito! Você validou o sentimento e abriu espaço para fatos.',
                  },
                ],
              },
              {
                incoming:
                  'O fluxo de cadastro está fazendo 30% das pessoas desistirem no passo 2.',
                options: [
                  {
                    text: 'Isso é um dado forte! Vamos levar essa métrica juntos para a planning de amanhã.',
                    isIdeal: true,
                    feedback: 'Excelente! Transformou um desabafo em ação concreta.',
                  },
                  {
                    text: 'Ah, então manda no Jira que uma hora a gente vê.',
                    isIdeal: false,
                    feedback: 'Resposta fria que fecha a porta da colaboração.',
                  },
                ],
              },
            ],
            explanation:
              'Escuta ativa combina validação emocional com perguntas abertas que revelam dados reais.',
          },
          {
            id: 'u1-l2-c2',
            type: 'dilemma',
            contextBadge: 'Reunião de Alinhamento',
            prompt:
              'Seu colega discordou da sua proposta técnica na frente de um cliente importante.',
            options: [
              'Corto a fala dele para defender minha autoridade na hora.',
              'Fico em silêncio magoado e não participo mais da reunião.',
              'Agradeço o ponto de vista, anoto a preocupação dele e proponho validar ambos os cenários com o cliente.',
              'Digo que isso já tinha sido decidido antes e ele não leu o documento.',
            ],
            correctIndex: 2,
            explanation:
              'Acolher a divergência com calma transmite maturidade ao cliente e evita desgaste público na equipe.',
          },
          {
            id: 'u1-l2-c3',
            type: 'cnv_builder',
            prompt: 'Organize uma resposta usando parafraseamento empático:',
            situation: 'Um cliente reclamou que o suporte demorou para responder.',
            correctOrder: [
              'Se entendi bem,',
              'a demora no retorno travou sua operação.',
              'Vou priorizar seu caso agora',
              'e te atualizar às 15h.',
            ],
            distractors: ['Mas nossa fila estava cheia'],
            explanation:
              'Parafrasear mostra que você realmente escutou, reduzindo a defensividade do cliente na hora.',
          },
        ],
      },
      {
        id: 'u1-l3',
        unitId: 'u1',
        title: 'A Arte do Feedback CNV',
        subtitle: 'Críticas que constroem sem ferir',
        durationLabel: '4 min',
        xpReward: 60,
        skillBoost: { empathy: 4, clarity: 4, leadership: 2 },
        challenges: [
          {
            id: 'u1-l3-c1',
            type: 'cnv_builder',
            prompt: 'Construa um feedback usando Comunicação Não-Violenta (Fato → Impacto → Pedido):',
            situation: 'Um colega tem chegado 15 minutos atrasado nas dailies.',
            correctOrder: [
              'Notei que nas últimas três dailies',
              'começamos 15 minutos depois.',
              'Isso atrasa o alinhamento do time.',
              'Podemos ajustar o horário ou combinar um lembrete?',
            ],
            distractors: ['Você está sendo descompromissado'],
            explanation:
              'Separar fatos observáveis de julgamentos pessoais faz o outro ouvir o pedido sem entrar na defensiva.',
          },
          {
            id: 'u1-l3-c2',
            type: 'dilemma',
            contextBadge: 'Recebendo Crítica',
            prompt:
              'Seu líder disse que sua apresentação para os diretores ficou "confusa e longa demais".',
            options: [
              'Justifico que tinha muito dado importante e não dava para cortar.',
              'Agradeço a sinceridade e peço 2 exemplos específicos do que posso enxugar na próxima.',
              'Peço desculpas repetidamente dizendo que não sou bom nisso.',
              'Ignoro porque outros colegas elogiaram os slides.',
            ],
            correctIndex: 1,
            explanation:
              'Transformar um feedback duro em perguntas específicas acelera seu crescimento e demonstra inteligência emocional.',
          },
          {
            id: 'u1-l3-c3',
            type: 'emotion_thermometer',
            prompt: 'Meça o nível de abertura emocional deste e-mail após um feedback:',
            messageSender: 'Rafael Souza',
            messageRole: 'Analista Pleno',
            messageChannel: 'E-mail',
            messageBody:
              'Ok, anotado. Vou fazer exatamente como você pediu da próxima vez para não gerar mais problemas.',
            scaleLabels: ['Engajado', 'Aberto', 'Defensivo', 'Ressentido', 'Explosivo'],
            idealRange: [2, 3],
            explanation:
              'A frase "exatamente como você pediu para não gerar mais problemas" indica obediência defensiva/ressentida — vale um 1:1 acolhedor para alinhar.',
          },
        ],
      },
      {
        id: 'u1-l4',
        unitId: 'u1',
        title: 'Tradução Executiva',
        subtitle: 'Adapte sua fala para diferentes públicos',
        durationLabel: '3 min',
        xpReward: 70,
        skillBoost: { clarity: 6, leadership: 3 },
        challenges: [
          {
            id: 'u1-l4-c1',
            type: 'dilemma',
            contextBadge: 'Comunicação entre Áreas',
            prompt:
              'Um bug crítico no banco de dados vai atrasar a campanha de Marketing em 24h. Como você comunica?',
            options: [
              'Envio o stack trace completo e explico o deadlock de índices no PostgreSQL.',
              'Digo apenas "deu erro no sistema, aguardem".',
              'Explico o impacto prático em linguagem simples, o plano de correção e o novo horário seguro de lançamento.',
              'Peço para o Marketing falar com o setor de Infraestrutura.',
            ],
            correctIndex: 2,
            explanation:
              'Comunicação executiva traduz complexidade técnica em impacto de negócio, plano de ação e previsibilidade.',
          },
          {
            id: 'u1-l4-c2',
            type: 'mini_roleplay',
            prompt: 'Alinhe expectativas com a diretoria em 2 passos:',
            personaName: 'Helena Costa',
            personaRole: 'Diretora Comercial',
            personaInitials: 'HC',
            turns: [
              {
                incoming: 'Preciso de um resumo rápido: o projeto sai este mês ou não?',
                options: [
                  {
                    text: 'Depende de várias variáveis que ainda estamos investigando nos microsserviços.',
                    isIdeal: false,
                    feedback: 'Executivos precisam primeiro da resposta direta, depois do contexto.',
                  },
                  {
                    text: 'Sim, sai dia 28 com as 3 funções principais. A parte de relatórios avançados ficaria para dia 5.',
                    isIdeal: true,
                    feedback: 'Direto ao ponto! Resposta clara logo na primeira frase.',
                  },
                ],
              },
              {
                incoming: 'Ótimo. Existe algum risco que eu precise saber antes de avisar os clientes?',
                options: [
                  {
                    text: 'O único risco é a aprovação da integração bancária; se atrasar até sexta, te aviso com plano B pronto.',
                    isIdeal: true,
                    feedback: 'Excelente gestão de riscos com transparência e proatividade!',
                  },
                  {
                    text: 'Acho que não, vai dar tudo certo, pode confiar.',
                    isIdeal: false,
                    feedback: 'Promessas sem mapear riscos geram surpresas caras depois.',
                  },
                ],
              },
            ],
            explanation:
              'A regra de ouro executiva: comece pela conclusão, destaque riscos reais e traga o próximo passo.',
          },
        ],
      },
    ],
  },
  {
    id: 'u2',
    number: 2,
    title: 'Liderança & Gestão de Conflitos',
    subtitle: 'Influencie pessoas, negocie limites e transforme atritos em resultados.',
    accentColor: '#FFC107',
    badgeText: 'UNIDADE 2',
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
              'Faltam 10 minutos para acabar seu turno e um colega de outra área pede "um favorzinho rápido" que levaria 2 horas.',
            options: [
              'Faço virando a noite para não parecer indisponível.',
              'Respondo seco: "Meu expediente já acabou, amanhã a gente vê."',
              'Digo: "Consigo olhar isso como primeira prioridade amanhã às 9h para entregar bem feito. Te atende?"',
              'Deixo a mensagem sem resposta até o dia seguinte.',
            ],
            correctIndex: 2,
            explanation:
              'O "não construtivo" valida a necessidade do outro, estabelece limite saudável e propõe uma alternativa concreta.',
          },
          {
            id: 'u2-l1-c2',
            type: 'cnv_builder',
            prompt: 'Negocie um prazo irrealista mantendo parceria:',
            situation: 'Pediram uma entrega complexa em metade do tempo necessário.',
            correctOrder: [
              'Quero garantir que essa entrega',
              'gere o resultado esperado.',
              'Para sexta, consigo a versão essencial;',
              'com o escopo completo, entregamos terça.',
            ],
            distractors: ['Vocês nunca calculam o prazo direito'],
            explanation:
              'Apresentar opções (trade-off entre escopo e prazo) coloca você como parceiro estratégico, não obstáculo.',
          },
        ],
      },
      {
        id: 'u2-l2',
        unitId: 'u2',
        title: 'Mediação de Conflitos',
        subtitle: 'Desarme tensões entre áreas e colegas',
        durationLabel: '4 min',
        xpReward: 70,
        skillBoost: { leadership: 5, negotiation: 5 },
        challenges: [
          {
            id: 'u2-l2-c1',
            type: 'emotion_thermometer',
            prompt: 'Avalie o nível de escalada deste conflito no grupo da equipe:',
            messageSender: 'Bruno Alves',
            messageRole: 'Tech Lead',
            messageChannel: 'Slack',
            messageBody:
              '@Vendas prometeu de novo algo que não existe sem consultar ninguém! Toda sprint é a mesma bagunça.',
            scaleLabels: ['Calmo', 'Alerta', 'Fricção', 'Conflito Aberto', 'Crise Grave'],
            idealRange: [3, 4],
            explanation:
              'Acusação pública com generalização ("toda sprint é a mesma bagunça") caracteriza conflito aberto que precisa ser movido para conversa privada urgente.',
          },
          {
            id: 'u2-l2-c2',
            type: 'mini_roleplay',
            prompt: 'Intervenha como mediador entre Vendas e Produto:',
            personaName: 'Bruno Alves',
            personaRole: 'Tech Lead',
            personaInitials: 'BA',
            turns: [
              {
                incoming: 'Eles venderam uma integração customizada para sexta sem avisar o time de produto!',
                options: [
                  {
                    text: 'Calma Bruno, você está exagerando. Vendas só está tentando bater meta.',
                    isIdeal: false,
                    feedback: 'Minimizar a dor de um lado só aumenta a revolta.',
                  },
                  {
                    text: 'Entendo o impacto na sprint, Bruno. Vamos chamar a líder de Vendas numa call rápida de 10 min para achar uma saída viável.',
                    isIdeal: true,
                    feedback: 'Perfeito! Acolheu o impacto e tirou a briga do chat público.',
                  },
                ],
              },
              {
                incoming: 'Beleza, mas não tem como entregar tudo até sexta sem quebrar o sistema.',
                options: [
                  {
                    text: 'Então vamos levar uma proposta de entrega em 2 fases: um contorno seguro na sexta e a versão final semana que vem.',
                    isIdeal: true,
                    feedback: 'Excelente mediação! Foco em interesse comum e solução pragmática.',
                  },
                  {
                    text: 'Então fala na call que eles vão ter que cancelar com o cliente.',
                    isIdeal: false,
                    feedback: 'Postura de tudo-ou-nada trava a negociação.',
                  },
                ],
              },
            ],
            explanation:
              'Mediar conflitos exige sair da culpa ("quem errou") e ir para o interesse comum ("como protegemos o cliente e o time").',
          },
        ],
      },
      {
        id: 'u2-l3',
        unitId: 'u2',
        title: 'Liderança sem Cargo',
        subtitle: 'Influência pelo exemplo e mentoria',
        durationLabel: '3 min',
        xpReward: 75,
        skillBoost: { leadership: 6, empathy: 3 },
        challenges: [
          {
            id: 'u2-l3-c1',
            type: 'dilemma',
            contextBadge: 'Mentoria no Time',
            prompt:
              'Um novo integrante júnior está travado há dois dias na mesma tarefa e com vergonha de pedir ajuda.',
            options: [
              'Faço a tarefa por ele para não atrasar a entrega da equipe.',
              'Mando o link da documentação e digo para ler com mais atenção.',
              'Convido para 25 minutos de pair programming, fazendo perguntas que o ajudem a descobrir a solução.',
              'Exponho na daily que ele está atrasando a sprint.',
            ],
            correctIndex: 2,
            explanation:
              'Liderança verdadeira desenvolve autonomia com segurança psicológica — não faz pelo outro nem o expõe.',
          },
          {
            id: 'u2-l3-c2',
            type: 'cnv_builder',
            prompt: 'Ofereça apoio de forma segura e sem parecer controlador:',
            situation: 'Você percebeu um colega sobrecarregado antes de uma entrega grande.',
            correctOrder: [
              'Terminei minhas tarefas da sprint.',
              'Vi que sua frente está intensa.',
              'Quer dividir alguma parte comigo',
              'para fecharmos juntos hoje?',
            ],
            distractors: ['Você parece bem atrasado'],
            explanation:
              'Oferecer ajuda como parceria preserva a dignidade do colega e fortalece a cultura do time.',
          },
        ],
      },
      {
        id: 'u2-l4',
        unitId: 'u2',
        title: 'Decisões com Dados & Influência',
        subtitle: 'Convença sem usar autoridade',
        durationLabel: '4 min',
        xpReward: 80,
        skillBoost: { leadership: 5, negotiation: 5, clarity: 2 },
        challenges: [
          {
            id: 'u2-l4-c1',
            type: 'dilemma',
            contextBadge: 'Resistência à Mudança',
            prompt:
              'Você quer propor um novo processo que economiza 4h por semana, mas o time sênior é resistente a mudanças.',
            options: [
              'Peço para o diretor obrigar todos a usarem a partir de segunda.',
              'Desisto da ideia para não gerar atrito.',
              'Convido 1 aliado aberto a testes, rodo um piloto de 1 semana e mostro os ganhos reais em números.',
              'Mudo o processo sozinho sem avisar ninguém.',
            ],
            correctIndex: 2,
            explanation:
              'Influência sustentável nasce de provas pequenas e resultados visíveis (pilotos), não de imposição.',
          },
          {
            id: 'u2-l4-c2',
            type: 'dilemma',
            contextBadge: 'Discordância Estratégica',
            prompt:
              'Um diretor insiste em lançar uma funcionalidade que pode comprometer a estabilidade do produto.',
            options: [
              'Apenas obedeço e depois digo "eu avisei".',
              'Digo "não" de forma ríspida na frente de todos.',
              'Mapeio os riscos objetivos, estimo o impacto financeiro e proponho um caminho seguro com marco intermediário.',
              'Atraso a entrega propositalmente.',
            ],
            correctIndex: 2,
            explanation:
              'Líderes influentes protegem o negócio apresentando riscos claros acompanhados de alternativas viáveis.',
          },
        ],
      },
    ],
  },
  {
    id: 'u3',
    number: 3,
    title: 'Controle de Impulsos & Inteligência Emocional',
    subtitle: 'Mantenha a lucidez sob pressão extrema e lidere suas emoções.',
    accentColor: '#7C4DFF',
    badgeText: 'UNIDADE 3',
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
            contextBadge: 'Pressão no Chat',
            prompt:
              'Um cliente escreveu em letras maiúsculas te acusando injustamente de um erro que foi do time dele.',
            options: [
              'Respondo apontando na hora que a culpa foi inteiramente dele.',
              'Fecho o atendimento por falta de respeito.',
              'Respiro por 30 segundos, mantenho o tom sereno, apresento os fatos com cordialidade e foco na solução imediata.',
              'Peço desculpas assumindo um erro que não existiu.',
            ],
            correctIndex: 2,
            explanation:
              'Você não precisa absorver a raiva do outro nem devolver na mesma moeda. Fatos + serenidade desarmam agressividade.',
          },
          {
            id: 'u3-l1-c2',
            type: 'emotion_thermometer',
            prompt: 'Qual o nível de risco emocional de enviar esta resposta no calor do momento?',
            messageSender: 'Seu Rascunho',
            messageRole: 'Antes de enviar',
            messageChannel: 'WhatsApp',
            messageBody:
              'Já expliquei isso três vezes!! Se vocês não leem o que eu mando fica impossível trabalhar aqui.',
            scaleLabels: ['Seguro', 'Leve', 'Arriscado', 'Alto Risco', 'Destrutivo'],
            idealRange: [3, 4],
            explanation:
              'Mensagens escritas sob pico de adrenalina deixam registro permanente e corroem confiança. Regra dos 5 minutos antes de responder!',
          },
        ],
      },
      {
        id: 'u3-l2',
        unitId: 'u3',
        title: 'Desapego do Ego',
        subtitle: 'Separe quem você é da sua entrega',
        durationLabel: '4 min',
        xpReward: 75,
        skillBoost: { control: 5, clarity: 4 },
        challenges: [
          {
            id: 'u3-l2-c1',
            type: 'dilemma',
            contextBadge: 'Mudança de Rumo',
            prompt:
              'Você passou duas semanas criando um projeto que acabou sendo cancelado por mudança estratégica da empresa.',
            options: [
              'Reclamo publicamente da falta de visão da liderança.',
              'Fico desmotivado e entrego o mínimo nas próximas semanas.',
              'Processo a frustração, documento os aprendizados reaproveitáveis e alinho a nova prioridade.',
              'Continuo trabalhando escondido no projeto antigo.',
            ],
            correctIndex: 2,
            explanation:
              'Desapego profissional permite pivotar rápido sem carregar ressentimento — uma marca registrada de profissionais seniores.',
          },
          {
            id: 'u3-l2-c2',
            type: 'cnv_builder',
            prompt: 'Reaja com maturidade ao descobrir que cometeu um erro em produção:',
            situation: 'Um ajuste seu causou instabilidade por 15 minutos.',
            correctOrder: [
              'Identifiquei que a falha veio',
              'da minha última atualização.',
              'Já apliquei a correção',
              'e mapeei o teste para evitar recorrência.',
            ],
            distractors: ['Mas ninguém revisou direito'],
            explanation:
              'Assumir responsabilidade rápido (ownership) acompanhada de correção gera mais respeito do que esconder falhas.',
          },
        ],
      },
      {
        id: 'u3-l3',
        unitId: 'u3',
        title: 'Calma em Sala de Crise',
        subtitle: 'Estabilidade emocional contagiosa',
        durationLabel: '4 min',
        xpReward: 85,
        skillBoost: { control: 6, leadership: 4 },
        challenges: [
          {
            id: 'u3-l3-c1',
            type: 'mini_roleplay',
            prompt: 'Conduza a equipe durante um incidente crítico:',
            personaName: 'Diego Martins',
            personaRole: 'Dev Pleno',
            personaInitials: 'DM',
            turns: [
              {
                incoming: 'O checkout caiu em plena Black Friday! Todo mundo tá falando no chat ao mesmo tempo, não sei o que fazer!',
                options: [
                  {
                    text: 'Como assim caiu?! Corrige logo isso antes que o CEO veja!',
                    isIdeal: false,
                    feedback: 'Pânico no líder paralisa a capacidade técnica da equipe.',
                  },
                  {
                    text: 'Respira, Diego. Vamos focar: você olha os logs do gateway, a Ana prepara o rollback e eu atualizo a liderança.',
                    isIdeal: true,
                    feedback: 'Brilhante! Calma estruturada + divisão clara de papéis.',
                  },
                ],
              },
              {
                incoming: 'Achei o erro! Em 3 minutos o rollback estabiliza o checkout.',
                options: [
                  {
                    text: 'Excelente foco! Executa o rollback com calma e me confirma quando o tráfego normalizar.',
                    isIdeal: true,
                    feedback: 'Reforço positivo sob pressão mantém o time preciso e confiante.',
                  },
                  {
                    text: 'Beleza, depois vamos ver quem aprovou esse deploy.',
                    isIdeal: false,
                    feedback: 'Caça às bruxas durante uma crise destrói a segurança psicológica.',
                  },
                ],
              },
            ],
            explanation:
              'Em momentos de crise, a estabilidade emocional de quem coordena define a velocidade da recuperação.',
          },
        ],
      },
      {
        id: 'u3-l4',
        unitId: 'u3',
        title: 'Resiliência & Autogestão',
        subtitle: 'Energia sustentável para alta performance',
        durationLabel: '4 min',
        xpReward: 95,
        skillBoost: { control: 5, empathy: 4, leadership: 4 },
        challenges: [
          {
            id: 'u3-l4-c1',
            type: 'dilemma',
            contextBadge: 'Sinais de Esgotamento',
            prompt:
              'Você percebe que está irritado com pequenos pedidos e perdendo o foco por acúmulo de 3 projetos simultâneos.',
            options: [
              'Continuo absorvendo tudo até explodir ou adoecer.',
              'Começo a responder os colegas com ironia.',
              'Mapeio minhas entregas atuais e marco 15 minutos com meu gestor para repriorizar antes da qualidade cair.',
              'Sumo do Slack por dois dias sem avisar.',
            ],
            correctIndex: 2,
            explanation:
              'Autoconhecimento emocional inclui reconhecer seus sinais de sobrecarga cedo e renegociar carga com transparência.',
          },
          {
            id: 'u3-l4-c2',
            type: 'cnv_builder',
            prompt: 'Comunique limites de capacidade com profissionalismo:',
            situation: 'Você precisa sinalizar sobrecarga sem parecer resistente.',
            correctOrder: [
              'Hoje estou com três frentes críticas',
              'em paralelo.',
              'Para manter o padrão de entrega,',
              'quais duas devemos focar esta semana?',
            ],
            distractors: ['Ninguém aqui se importa com minha saúde'],
            explanation:
              'Trazer visibilidade de carga com foco em qualidade protege você e o resultado do negócio.',
          },
        ],
      },
    ],
  },
];

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
      'Gostei do seu perfil, mas sendo bem direta: você não tem experiência prévia com duas ferramentas da nossa stack. Por que deveríamos apostar em você em vez de outro candidato?',
    tacticalSuggestions: [
      {
        label: 'Foco em Adaptabilidade & Provas',
        text: 'Entendo a preocupação. Embora ainda não tenha usado essas duas ferramentas, já migrei de stack duas vezes entregando resultado nas primeiras 3 semanas. Minha base sólida e velocidade de aprendizado reduzem muito essa curva.',
        quality: 'master',
      },
      {
        label: 'Honestidade Simples',
        text: 'Eu realmente não conheço essas ferramentas ainda, mas sou muito esforçado e posso estudar nos fins de semana para alcançar o time.',
        quality: 'good',
      },
      {
        label: 'Resposta Defensiva',
        text: 'Ferramenta qualquer um aprende, acho que vocês estão olhando demais para requisitos técnicos e pouco para o meu potencial.',
        quality: 'reactive',
      },
    ],
    idealKeywords: ['entendo', 'aprendizado', 'resultado', 'experiência', 'base', 'curva', 'adapto', 'plano', 'semanas'],
    avoidKeywords: ['qualquer um', 'culpa', 'injusto', 'vocês estão errados', 'tanto faz'],
  },
  {
    id: 'gk-2',
    title: 'Sua Equipe Perdeu um Prazo Crítico',
    category: 'Liderança',
    difficulty: 'Alto',
    personaName: 'Ricardo Viana',
    personaRole: 'VP de Operações',
    personaInitials: 'RV',
    channel: 'Slack',
    context: 'São 18h30 de quinta-feira. A entrega prometida para hoje atrasou por um bloqueio técnico inesperado.',
    openingMessage:
      'Acabei de olhar o painel e a entrega não subiu! Eu já tinha alinhado com a diretoria que isso estaria pronto hoje. O que está acontecendo?!',
    tacticalSuggestions: [
      {
        label: 'Ownership + Plano Claro',
        text: 'Ricardo, assumo a falha de não ter te sinalizado mais cedo. Tivemos um bloqueio na integração às 15h. Já isolamos a causa, o time está aplicando a correção e garantimos a subida até amanhã às 10h — posso te atualizar às 8h30?',
        quality: 'master',
      },
      {
        label: 'Explicação Técnica Longa',
        text: 'Oi Ricardo, deu um erro inesperado no servidor de homologação e não conseguimos subir hoje, mas amanhã a gente tenta terminar.',
        quality: 'good',
      },
      {
        label: 'Transferir Culpa',
        text: 'A culpa não foi minha, o time de infraestrutura demorou para liberar o acesso e aí travou tudo.',
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
    personaRole: 'Diretor de Produto',
    personaInitials: 'EF',
    channel: 'Reunião',
    context: 'No meio da review semanal com 15 pessoas, o diretor interrompe sua apresentação em tom áspero.',
    openingMessage:
      'Sinceramente, essa análise está superficial. Esperava muito mais profundidade antes de você trazer isso para uma reunião com tanta gente.',
    tacticalSuggestions: [
      {
        label: 'Serenidade + Alinhamento',
        text: 'Obrigado pelo retorno direto, Eduardo. Quero garantir que a decisão seja tomada com a profundidade certa. Quais dois indicadores específicos você gostaria que eu detalhasse agora ou em um alinhamento logo após a reunião?',
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
    personaRole: 'Cliente Enterprise',
    personaInitials: 'FN',
    channel: 'Cliente',
    context: 'Um bug no faturamento gerou cobrança duplicada. A cliente ligou extremamente irritada.',
    openingMessage:
      'É a segunda vez neste trimestre que vocês erram na nossa fatura! Estou cansada de perder tempo com isso, já vou pedir o cancelamento do contrato hoje!',
    tacticalSuggestions: [
      {
        label: 'Empatia + Ação Imediata',
        text: 'Fernanda, você tem toda razão em estar frustrada — dois erros seguidos são inaceitáveis. Já acionei o financeiro para estornar a duplicidade hoje mesmo e vou acompanhar pessoalmente as próximas 3 faturas antes do envio para garantir zero erros.',
        quality: 'master',
      },
      {
        label: 'Protocolo Padrão',
        text: 'Sinto muito pelo transtorno, Fernanda. Vou abrir um chamado no financeiro e o prazo de retorno é de até 5 dias úteis.',
        quality: 'good',
      },
      {
        label: 'Minimizar o Erro',
        text: 'Calma Fernanda, isso foi só uma falha automática do sistema, não precisa cancelar o contrato por causa disso.',
        quality: 'reactive',
      },
    ],
    idealKeywords: ['razão', 'frustrada', 'estornar', 'acompanhar', 'pessoalmente', 'hoje', 'garantir', 'entendo', 'solução'],
    avoidKeywords: ['calma', 'exagerando', 'sistema', '5 dias', 'não precisa'],
  },
  {
    id: 'gk-5',
    title: 'Escopo Impossível da Diretoria',
    category: 'Negociação',
    difficulty: 'Alto',
    personaName: 'Gustavo Prado',
    personaRole: 'CEO',
    personaInitials: 'GP',
    channel: 'Reunião',
    context: 'O CEO quer incluir uma funcionalidade gigante para uma feira que acontece em 4 dias.',
    openingMessage:
      'Quero lançar o novo módulo de IA completo na feira de sexta. Sei que o time está cheio, mas precisamos dar um jeito de entregar tudo!',
    tacticalSuggestions: [
      {
        label: 'Trade-off Inteligente (MVP)',
        text: 'Gustavo, entendo o peso estratégico da feira. Para garantir impacto sem risco de falhar ao vivo, consigo entregar até sexta uma demonstração interativa do fluxo principal. Para o módulo completo em produção, precisamos de mais 10 dias. Qual caminho prefere?',
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
    idealKeywords: ['entendo', 'estratégico', 'risco', 'opção', 'fluxo principal', 'qualidade', 'prazo', 'prefere', 'mvp'],
    avoidKeywords: ['impossível', 'nunca', 'sem chance', 'absurdo'],
  },
  {
    id: 'gk-6',
    title: 'Conflito de Ego Entre Pares',
    category: 'Gestão de Conflitos',
    difficulty: 'Médio',
    personaName: 'Lucas & Thiago',
    personaRole: 'Colegas de Squad',
    personaInitials: 'LT',
    channel: 'Slack',
    context: 'Dois colegas travaram uma entrega importante discutindo qual arquitetura é melhor.',
    openingMessage:
      'Não vou aprovar esse código dele, está totalmente fora do padrão que eu desenhei. Se quiserem subir assim, eu tiro meu nome da responsabilidade.',
    tacticalSuggestions: [
      {
        label: 'Desarmar & Focar em Critérios',
        text: 'Pessoal, respeito o cuidado técnico dos dois. Vamos pausar o chat e fazer 15 minutos juntos comparando as duas abordagens por 3 critérios objetivos: prazo, manutenção e performance. Assim decidimos pelo melhor para o produto.',
        quality: 'master',
      },
      {
        label: 'Pedir para o Chefe Resolver',
        text: 'Gente, parem de brigar no Slack, vou chamar o gestor para decidir logo quem está certo.',
        quality: 'good',
      },
      {
        label: 'Tomar Partido Ríspido',
        text: 'Você está sendo teimoso, o código dele funciona e você só quer impor o seu jeito.',
        quality: 'reactive',
      },
    ],
    idealKeywords: ['respeito', 'critérios', 'objetivos', 'juntos', 'produto', 'comparando', 'minutos', 'solução'],
    avoidKeywords: ['teimoso', 'ego', 'brigar', 'impor', 'culpa'],
  },
];
