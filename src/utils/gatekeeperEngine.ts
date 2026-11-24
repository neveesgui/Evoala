import type { GatekeeperScenario } from '../data/curriculum';

export interface GatekeeperEvaluation {
  clarity: number;
  empathy: number;
  control: number;
  stars: number;
  headline: string;
  reason: string;
  xpEarned: number;
}

const EMPATHY_MARKERS = [
  'entendo',
  'compreendo',
  'obrigado',
  'obrigada',
  'razão',
  'respeito',
  'frustr',
  'juntos',
  'parceria',
  'sinto muito',
  'ajudar',
  'apoio',
];

const CLARITY_MARKERS = [
  'plano',
  'horário',
  'prazo',
  'etapa',
  'critério',
  'indicador',
  'amanhã',
  'hoje',
  'proposta',
  'solução',
  'opção',
  'garantir',
  'atualizar',
  'priorizar',
];

const REACTIVE_MARKERS = [
  'culpa',
  'impossível',
  'injusto',
  'calma',
  'exager',
  'não foi minha',
  'problema seu',
  'tanto faz',
  'absurdo',
  'nunca',
  'sempre',
];

/**
 * Structured behavioral evaluation engine for Gatekeeper IA.
 * Designed as an isolated service so a live Gemini/OpenAI API call
 * can drop in later without changing any UI component.
 */
export function evaluateGatekeeperResponse(
  scenario: GatekeeperScenario,
  userResponse: string,
  presetQuality?: 'master' | 'good' | 'reactive'
): GatekeeperEvaluation {
  if (presetQuality === 'master') {
    return {
      clarity: 94,
      empathy: 92,
      control: 96,
      stars: 5,
      headline: 'Resposta de Alta Liderança!',
      reason:
        'Ótima resposta! Sua escuta ativa se destacou, você assumiu protagonismo sem entrar na defensiva e ofereceu um próximo passo concreto.',
      xpEarned: 20,
    };
  }

  if (presetQuality === 'good') {
    return {
      clarity: 74,
      empathy: 78,
      control: 80,
      stars: 4,
      headline: 'Boa postura profissional!',
      reason:
        'Você manteve o respeito e o controle emocional. Para chegar às 5 estrelas, traga um plano de ação com prazos ou opções mais objetivos.',
      xpEarned: 20,
    };
  }

  if (presetQuality === 'reactive') {
    return {
      clarity: 48,
      empathy: 32,
      control: 38,
      stars: 2,
      headline: 'Cuidado com o tom reativo!',
      reason:
        'A resposta soou defensiva sob pressão. Em momentos tensos, valide o ponto do outro primeiro e conduza a conversa para soluções práticas.',
      xpEarned: 20,
    };
  }

  // Free-text heuristic analysis
  const text = userResponse.toLowerCase().trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  let clarity = 56;
  let empathy = 54;
  let control = 62;

  // Scenario-specific ideal keywords
  scenario.idealKeywords.forEach((kw) => {
    if (text.includes(kw)) {
      clarity += 7;
      control += 5;
    }
  });

  // General empathy & clarity signals
  EMPATHY_MARKERS.forEach((kw) => {
    if (text.includes(kw)) empathy += 9;
  });

  CLARITY_MARKERS.forEach((kw) => {
    if (text.includes(kw)) clarity += 7;
  });

  // Penalize reactive / defensive language
  const allAvoid = [...REACTIVE_MARKERS, ...scenario.avoidKeywords];
  let reactiveHits = 0;
  allAvoid.forEach((kw) => {
    if (text.includes(kw)) {
      reactiveHits += 1;
      empathy -= 12;
      control -= 14;
    }
  });

  // All-caps or excessive exclamation marks signal impulse
  if (text.includes('!!') || (userResponse.length > 10 && userResponse === userResponse.toUpperCase())) {
    control -= 18;
    empathy -= 10;
  }

  // Reward well-articulated responses (not one-word replies)
  if (wordCount >= 14) {
    clarity += 10;
    control += 8;
  } else if (wordCount < 6) {
    clarity -= 14;
    empathy -= 10;
  }

  // Questions invite dialogue
  if (text.includes('?')) {
    empathy += 8;
    clarity += 5;
  }

  const clamp = (n: number) => Math.max(20, Math.min(98, Math.round(n)));
  clarity = clamp(clarity);
  empathy = clamp(empathy);
  control = clamp(control);

  const avg = (clarity + empathy + control) / 3;
  const stars = avg >= 86 ? 5 : avg >= 74 ? 4 : avg >= 60 ? 3 : avg >= 45 ? 2 : 1;

  let headline: string;
  let reason: string;

  if (stars === 5) {
    headline = 'Domínio Comportamental!';
    reason =
      'Excelente combinação de empatia genuína, clareza executiva e autocontrole. Nível de liderança sênior!';
  } else if (stars === 4) {
    headline = 'Muito boa abordagem!';
    reason =
      'Você conduziu o cenário com maturidade. Incluir uma pergunta aberta ou um prazo exato deixaria a resposta impecável.';
  } else if (stars === 3) {
    headline = 'No caminho certo!';
    reason =
      'Sua intenção foi construtiva, mas vale fortalecer a validação emocional antes de apresentar sua solução.';
  } else {
    headline = reactiveHits > 0 ? 'Atenção ao tom defensivo!' : 'Resposta muito curta!';
    reason =
      reactiveHits > 0
        ? 'Evite termos acusatórios ou defensivos sob pressão. Respire, valide o contexto e proponha um próximo passo claro.'
        : 'Respostas muito curtas podem soar frias em cenários de pressão. Detalhe sua compreensão e ofereça um plano objetivo.';
  }

  return {
    clarity,
    empathy,
    control,
    stars,
    headline,
    reason,
    xpEarned: 20,
  };
}
