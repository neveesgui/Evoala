import type { GatekeeperScenario } from '../data/curriculum';

export type AiProviderLabel = 'IA Real • Gemini' | 'IA Real • Gratuita' | 'Motor Local';

export interface GatekeeperEvaluation {
  clarity: number;
  empathy: number;
  control: number;
  stars: number;
  headline: string;
  reason: string;
  personaReply: string;
  xpEarned: number;
  provider: AiProviderLabel;
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

const clamp = (n: number) => Math.max(20, Math.min(98, Math.round(n)));

function buildSystemPrompt(scenario: GatekeeperScenario): string {
  return `Você é o Gatekeeper IA do Evoala, um avaliador executivo de Soft Skills e Inteligência Emocional.
Cenário: "${scenario.title}" (${scenario.context}).
Interlocutor: ${scenario.personaName} (${scenario.personaRole}), que disse: "${scenario.openingMessage}".

Avalie a resposta do usuário em português (PT-BR) e responda EXCLUSIVAMENTE com um JSON válido neste formato exato:
{
  "clarity": <número inteiro de 20 a 98>,
  "empathy": <número inteiro de 20 a 98>,
  "control": <número inteiro de 20 a 98>,
  "stars": <número inteiro de 1 a 5>,
  "headline": "<título curto de 2 a 4 palavras>",
  "reason": "<feedback técnico construtivo em 1 ou 2 frases diretas>",
  "personaReply": "<resposta curta e realista de ${scenario.personaName} reagindo ao que o usuário escreveu, em 1 frase>"
}`;
}

function parseAiJson(raw: string, provider: AiProviderLabel): GatekeeperEvaluation | null {
  try {
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start === -1 || end === -1) return null;
    const parsed = JSON.parse(raw.slice(start, end + 1));

    const clarity = clamp(Number(parsed.clarity) || 70);
    const empathy = clamp(Number(parsed.empathy) || 70);
    const control = clamp(Number(parsed.control) || 70);
    const stars = Math.max(1, Math.min(5, Math.round(Number(parsed.stars) || 3)));

    if (!parsed.headline || !parsed.reason) return null;

    return {
      clarity,
      empathy,
      control,
      stars,
      headline: String(parsed.headline).slice(0, 60),
      reason: String(parsed.reason).slice(0, 320),
      personaReply: String(
        parsed.personaReply || 'Entendi seu ponto. Vamos alinhar os próximos passos.'
      ).slice(0, 220),
      xpEarned: stars >= 4 ? 25 : 15,
      provider,
    };
  } catch {
    return null;
  }
}

/**
 * Tier 1: Google Gemini 2.5 Flash (Free Tier via Google AI Studio key or VITE_GEMINI_API_KEY)
 */
async function evaluateWithGemini(
  scenario: GatekeeperScenario,
  userResponse: string,
  apiKey: string
): Promise<GatekeeperEvaluation | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${buildSystemPrompt(scenario)}\n\nResposta do usuário: "${userResponse}"`,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.4,
          },
        }),
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;
    return parseAiJson(text, 'IA Real • Gemini');
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Tier 2: Free Zero-Key Real LLM via Pollinations AI (CORS-friendly public endpoint)
 */
async function evaluateWithFreePublicAI(
  scenario: GatekeeperScenario,
  userResponse: string
): Promise<GatekeeperEvaluation | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7500);
  try {
    const res = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        messages: [
          { role: 'system', content: buildSystemPrompt(scenario) },
          { role: 'user', content: `Resposta do usuário: "${userResponse}"` },
        ],
        model: 'openai',
        jsonMode: true,
      }),
    });

    if (!res.ok) return null;
    const rawText = await res.text();
    return parseAiJson(rawText, 'IA Real • Gratuita');
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Tier 3: Instant Heuristic Fallback (guaranteed availability even offline)
 */
export function evaluateLocally(
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
      headline: 'Liderança Exemplar',
      reason:
        'Sua escuta ativa e postura calma desarmaram a pressão e direcionaram a conversa para um plano objetivo.',
      personaReply:
        'Agradeço pela clareza e transparência. Esse plano faz total sentido — vamos seguir assim.',
      xpEarned: 25,
      provider: 'Motor Local',
    };
  }

  if (presetQuality === 'good') {
    return {
      clarity: 74,
      empathy: 78,
      control: 80,
      stars: 4,
      headline: 'Boa Postura',
      reason:
        'Você manteve o respeito e o equilíbrio. Para alcançar 5 estrelas, proponha um próximo passo mais objetivo com prazo.',
      personaReply:
        'Ok, entendi o cenário. Só preciso que você me passe uma previsão concreta ainda hoje.',
      xpEarned: 20,
      provider: 'Motor Local',
    };
  }

  if (presetQuality === 'reactive') {
    return {
      clarity: 48,
      empathy: 32,
      control: 38,
      stars: 2,
      headline: 'Tom Defensivo',
      reason:
        'A resposta soou reativa sob pressão. Valide o ponto do outro primeiro e conduza o foco para soluções práticas.',
      personaReply:
        'Não foi bem o alinhamento que eu esperava. Vamos retomar essa conversa com mais calma depois.',
      xpEarned: 15,
      provider: 'Motor Local',
    };
  }

  const text = userResponse.toLowerCase().trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  let clarity = 56;
  let empathy = 54;
  let control = 62;

  scenario.idealKeywords.forEach((kw) => {
    if (text.includes(kw)) {
      clarity += 7;
      control += 5;
    }
  });

  EMPATHY_MARKERS.forEach((kw) => {
    if (text.includes(kw)) empathy += 9;
  });

  CLARITY_MARKERS.forEach((kw) => {
    if (text.includes(kw)) clarity += 7;
  });

  const allAvoid = [...REACTIVE_MARKERS, ...scenario.avoidKeywords];
  let reactiveHits = 0;
  allAvoid.forEach((kw) => {
    if (text.includes(kw)) {
      reactiveHits += 1;
      empathy -= 12;
      control -= 14;
    }
  });

  if (
    text.includes('!!') ||
    (userResponse.length > 10 && userResponse === userResponse.toUpperCase())
  ) {
    control -= 18;
    empathy -= 10;
  }

  if (wordCount >= 14) {
    clarity += 10;
    control += 8;
  } else if (wordCount < 6) {
    clarity -= 14;
    empathy -= 10;
  }

  if (text.includes('?')) {
    empathy += 8;
    clarity += 5;
  }

  clarity = clamp(clarity);
  empathy = clamp(empathy);
  control = clamp(control);

  const avg = (clarity + empathy + control) / 3;
  const stars = avg >= 86 ? 5 : avg >= 74 ? 4 : avg >= 60 ? 3 : avg >= 45 ? 2 : 1;

  let headline: string;
  let reason: string;
  let personaReply: string;

  if (stars === 5) {
    headline = 'Domínio Comportamental';
    reason =
      'Excelente combinação de empatia genuína, clareza executiva e autocontrole sob pressão.';
    personaReply = 'Excelente posicionamento. Fico bem mais tranquilo seguindo com esse plano.';
  } else if (stars === 4) {
    headline = 'Abordagem Madura';
    reason =
      'Você conduziu bem o cenário. Incluir uma pergunta aberta ou prazo específico tornaria a resposta impecável.';
    personaReply = 'Faz sentido. Me mantenha atualizado assim que avançarmos nisso.';
  } else if (stars === 3) {
    headline = 'No Caminho Certo';
    reason =
      'Boa intenção construtiva, mas vale fortalecer a validação emocional antes de apresentar sua solução.';
    personaReply = 'Entendi, mas ainda gostaria de ver mais detalhes de como vamos resolver isso.';
  } else {
    headline = reactiveHits > 0 ? 'Atenção ao Tom' : 'Resposta Muito Curta';
    reason =
      reactiveHits > 0
        ? 'Evite termos acusatórios sob pressão. Respire, valide o contexto e proponha um próximo passo claro.'
        : 'Respostas curtas demais podem soar frias sob pressão. Detalhe sua compreensão e traga um plano objetivo.';
    personaReply = 'Acho que precisamos conversar melhor sobre isso para alinharmos as expectativas.';
  }

  return {
    clarity,
    empathy,
    control,
    stars,
    headline,
    reason,
    personaReply,
    xpEarned: stars >= 4 ? 25 : 15,
    provider: 'Motor Local',
  };
}

/**
 * Main async evaluator: Gemini (if key set) -> Free Public LLM -> Local fallback.
 */
export async function evaluateGatekeeperResponseAsync(
  scenario: GatekeeperScenario,
  userResponse: string,
  options?: {
    presetQuality?: 'master' | 'good' | 'reactive';
    userGeminiKey?: string;
  }
): Promise<GatekeeperEvaluation> {
  const envKey = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim();
  const activeGeminiKey = options?.userGeminiKey?.trim() || envKey;

  if (activeGeminiKey) {
    const geminiResult = await evaluateWithGemini(scenario, userResponse, activeGeminiKey);
    if (geminiResult) return geminiResult;
  }

  const publicResult = await evaluateWithFreePublicAI(scenario, userResponse);
  if (publicResult) return publicResult;

  return evaluateLocally(scenario, userResponse, options?.presetQuality);
}
