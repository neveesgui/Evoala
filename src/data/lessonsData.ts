export type Question = { id: string; level: 'Júnior' | 'Pleno' | 'Sênior'; prompt: string; options: string[]; correctIndex: number; explanation: string; };
export type Lesson = { id: string; title: string; description: string; xpReward: number; questions: Question[]; };
export type Module = { id: string; title: string; theme: 'emerald' | 'green' | 'orange' | 'blue' | 'purple' | 'rose'; lessons: Lesson[]; };

export const softSkillsModules: Module[] = [
  {
    id: 'm1', title: 'Fundamentos da Comunicação', theme: 'emerald',
    lessons: [
      {
        id: 'l1-1', title: 'O Código da Clareza', description: 'Elimine ruídos e garanta que foi entendido.', xpReward: 50,
        questions: [
          {
            id: 'q1-j', level: 'Júnior', prompt: 'Seu líder pediu um relatório verbalmente enquanto passava no corredor.', options: ['Faço imediatamente do jeito que lembro.', 'Mando uma mensagem: "Só para confirmar, você precisa do relatório X com os dados Y para hoje?"', 'Espero ele cobrar por e-mail.', 'Pergunto para outro colega o que ele acha que o líder quis dizer.'], correctIndex: 1, explanation: 'Júnior: Formalizar e confirmar demandas verbais evita retrabalho e demonstra profissionalismo.'
          },
          {
            id: 'q1-p', level: 'Pleno', prompt: 'Você precisa explicar um bug técnico complexo para a equipe de Marketing.', options: ['Uso os termos técnicos exatos para mostrar gravidade.', 'Digo apenas "deu problema no sistema".', 'Uso uma analogia simples (ex: "o encanamento do servidor entupiu") e explico o impacto no prazo deles.', 'Mando lerem a documentação da API.'], correctIndex: 2, explanation: 'Pleno: Adequar a linguagem ao público não-técnico é essencial para alinhamento entre áreas.'
          },
          {
            id: 'q1-s', level: 'Sênior', prompt: 'A diretoria cortou o orçamento do seu projeto pela metade em uma reunião rápida.', options: ['Bato na mesa e digo que é impossível entregar.', 'Aceito e repasso a pressão para a equipe.', 'Agradeço o contexto financeiro e imediatamente proponho cortar escopos secundários para salvar o núcleo do projeto.', 'Peço demissão.'], correctIndex: 2, explanation: 'Sênior: Comunicação executiva exige pragmatismo. Foco imediato na adaptação do escopo, não na reclamação.'
          }
        ]
      },
      {
        id: 'l1-2', title: 'A Arte do Feedback', description: 'Críticas que constroem.', xpReward: 60,
        questions: [
          {
            id: 'q2-j', level: 'Júnior', prompt: 'Você recebeu um feedback negativo sobre a qualidade do seu código.', options: ['Fico na defensiva e justifico que o prazo era curto.', 'Agradeço, anoto os pontos falhos e pergunto qual a melhor referência de código no projeto para eu estudar.', 'Ignoro porque sei que meu código funciona.', 'Reclamo do revisor.'], correctIndex: 1, explanation: 'Júnior: O feedback é uma ferramenta gratuita de mentoria. Receba-o com foco prático em melhoria.'
          },
          {
            id: 'q2-p', level: 'Pleno', prompt: 'Você precisa apontar um erro repetitivo de um colega do mesmo nível.', options: ['Falo em tom de brincadeira na frente de todos.', 'Corrijo eu mesmo em silêncio.', 'Chamo em particular, uso fatos específicos e pergunto: "Como posso ajudar a evitar que isso aconteça?"', 'Aviso direto o chefe dele.'], correctIndex: 2, explanation: 'Pleno: Feedback lateral exige empatia e colaboração (1:1), nunca exposição pública.'
          },
          {
            id: 'q2-s', level: 'Sênior', prompt: 'Seu gestor direto te deu um feedback vago ("você precisa ser mais estratégico").', options: ['Fico frustrado e não mudo nada.', 'Assumo tarefas de outros setores aleatoriamente.', 'Peço uma reunião de alinhamento e solicito exemplos claros de onde falhei e métricas exatas do que ele considera "estratégico".', 'Pergunto a opinião de outros diretores.'], correctIndex: 2, explanation: 'Sênior: Você deve guiar seu próprio feedback. Se for vago, force o gestor a definir indicadores práticos (KPIs).'
          }
        ]
      }
    ]
  },
  {
    id: 'm2', title: 'Inteligência Emocional', theme: 'green',
    lessons: [
      {
        id: 'l2-1', title: 'Controle de Impulsos', description: 'Pausar antes de reagir.', xpReward: 70,
        questions: [
          {
            id: 'q3-j', level: 'Júnior', prompt: 'Um cliente foi grosseiro com você no chat de suporte.', options: ['Respondo no mesmo tom.', 'Fecho o chamado.', 'Respiro fundo, mantenho a formalidade profissional e foco exclusivamente na resolução técnica do problema dele.', 'Choro e vou embora.'], correctIndex: 2, explanation: 'Júnior: Profissionalismo é não absorver a raiva do cliente. Foque no processo.'
          },
          {
            id: 'q3-p', level: 'Pleno', prompt: 'Uma feature que você passou semanas desenvolvendo foi descartada pelo Product Manager.', options: ['Faço um texto enorme no Slack reclamando da falta de visão dele.', 'Apago o código imediatamente com raiva.', 'Controlo a frustração e marco um papo para entender a mudança estratégica do produto, documentando o código para uso futuro.', 'Trabalho mal pelos próximos dias.'], correctIndex: 2, explanation: 'Pleno: Desapego ao código. Entender o impacto no negócio é mais importante que o ego técnico.'
          },
          {
            id: 'q3-s', level: 'Sênior', prompt: 'Durante um incidente crítico que derrubou o sistema, a equipe está em pânico.', options: ['Grito para todos focarem.', 'Tento consertar tudo sozinho rapidamente.', 'Mantenho a calma absoluta, abro uma sala de crise, distribuo papéis claros (quem comunica, quem investiga, quem corrige) e izolo o ruído.', 'Deleto o banco de dados.'], correctIndex: 2, explanation: 'Sênior: O líder define o clima emocional. Calma estruturada é contagiante e resolve crises.'
          }
        ]
      }
    ]
  },
  {
    id: 'm3', title: 'Gestão de Conflitos', theme: 'orange',
    lessons: [
      {
        id: 'l3-1', title: 'Negociação Diária', description: 'Como dizer não e manter pontes.', xpReward: 80,
        questions: [
          {
            id: 'q4-j', level: 'Júnior', prompt: 'Te pediram uma tarefa faltando 10 minutos para o fim do expediente.', options: ['Faço reclamando.', 'Simplesmente vou embora e não respondo.', 'Digo: "Consigo iniciar isso como primeira prioridade amanhã às 9h, tudo bem para você?"', 'Fico até meia-noite para impressionar.'], correctIndex: 2, explanation: 'Júnior: Dizer "não" oferecendo um prazo alternativo seguro demonstra compromisso sem sacrificar limites.'
          },
          {
            id: 'q4-p', level: 'Pleno', prompt: 'Você discorda frontalmente da abordagem técnica do Líder Técnico.', options: ['Implemento a minha em segredo.', 'Discuto agressivamente na Daily.', 'Crio uma PoC (Prova de Conceito) rápida mostrando com dados (tempo/recursos) porque a minha sugestão é mais viável, e apresento a ele.', 'Aceito calado e deixo dar erro.'], correctIndex: 2, explanation: 'Pleno: Argumentos não ganham discussões técnicas. Dados e código (PoC) sim.'
          },
          {
            id: 'q4-s', level: 'Sênior', prompt: 'Dois departamentos vitais (Vendas e Produto) estão travando o lançamento do sistema por discordâncias.', options: ['Deixo eles brigarem até alguém ceder.', 'Apoio Produto porque sou de Tech.', 'Atuo como mediador, traduzindo as necessidades de Vendas para viabilidade de Produto, focando no MVP que gere lucro rápido para ambos.', 'Cancelo o projeto.'], correctIndex: 2, explanation: 'Sênior: Resolução de conflito executiva exige encontrar o alinhamento de interesses financeiros/estratégicos invisível às partes.'
          }
        ]
      }
    ]
  },
  {
    id: 'm4', title: 'Liderança e Influência', theme: 'blue',
    lessons: [
      {
        id: 'l4-1', title: 'Liderança sem Cargo', description: 'Como influenciar positivamente.', xpReward: 100,
        questions: [
          {
            id: 'q5-j', level: 'Júnior', prompt: 'Você terminou suas tarefas mais cedo.', options: ['Fico jogando no celular.', 'Vou embora antes da hora.', 'Pergunto no grupo da equipe: "Terminei minha sprint, alguém precisa de ajuda em alguma task ou revisão de código?"', 'Finjo que estou trabalhando.'], correctIndex: 2, explanation: 'Júnior: Liderança começa com proatividade e senso de equipe.'
          },
          {
            id: 'q5-p', level: 'Pleno', prompt: 'Um novo membro Júnior entrou na equipe e está travado há dois dias na mesma tarefa.', options: ['Faço a tarefa por ele para não atrasar a sprint.', 'Digo para ele pesquisar no Google.', 'Faço pair programming (programação em pares) com ele por 30 minutos, guiando-o com perguntas para ele encontrar a solução.', 'Reclamo da lentidão dele na Daily.'], correctIndex: 2, explanation: 'Pleno: Mentoria é sobre habilitar o outro a pensar, não apenas dar a resposta pronta.'
          },
          {
            id: 'q5-s', level: 'Sênior', prompt: 'A empresa precisa adotar uma nova tecnologia, mas a equipe sênior é resistente à mudança.', options: ['Obrigo o uso da tecnologia por autoridade.', 'Desisto da ideia.', 'Identifico um "early adopter" na equipe, crio um projeto piloto de sucesso com ele e uso os resultados para convencer os demais organicamente.', 'Demitir os resistentes.'], correctIndex: 2, explanation: 'Sênior: Influência real não usa força. Usa evangelização e casos de sucesso internos para quebrar barreiras culturais.'
          }
        ]
      }
    ]
  }
];
