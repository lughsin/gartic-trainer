import { readFile, writeFile, mkdir } from 'node:fs/promises';

export type RawWord = { word: string; category: string };
export type Difficulty = 'easy' | 'medium' | 'hard' | 'abstract' | 'ambiguous';
export type WordEntry = {
  id: string;
  word: string;
  normalized: string;
  category: string;
  difficulty: Difficulty;
  tags: string[];
  keyFeature: string;
  recognitionStrategy: string;
  idealStrokes: number;
  estimatedSeconds: number;
  primitiveRecipe: string[];
  steps: string[];
  tips: string[];
  ambiguityNotes: string[];
  aliases: string[];
  recommendedVisualCues: string[];
};

export const normalizeWord = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

export const slugify = (value: string) => normalizeWord(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const verbPatterns = ['ando', 'endo', 'indo', 'ar', 'er', 'ir'];

export function classifyDifficulty(word: string, category: string): Difficulty {
  const n = normalizeWord(word);
  if (category === 'verbos') return 'hard';
  if (category === 'desenho animado') return 'medium';
  if (/amor|saudade|justica|tempo/.test(n)) return 'abstract';
  if (/manga|vela|banco/.test(n)) return 'ambiguous';
  if (verbPatterns.some((p) => n.endsWith(p))) return 'hard';
  return n.length <= 5 ? 'easy' : 'medium';
}

export function generateRecipe(word: string, category: string): Omit<WordEntry, 'id' | 'word' | 'normalized' | 'category'> {
  const n = normalizeWord(word);
  const generic = {
    difficulty: classifyDifficulty(word, category),
    tags: [category],
    keyFeature: 'silhueta principal',
    recognitionStrategy: 'Desenhe primeiro a silhueta mais icônica, depois um detalhe único.',
    idealStrokes: 6,
    estimatedSeconds: 14,
    primitiveRecipe: ['oval', 'line', 'curve'],
    steps: ['Desenhe a forma principal.', 'Adicione forma secundária.', 'Inclua detalhe distintivo.', 'Se estiver reconhecível, pare.'],
    tips: ['Evite detalhes cedo.', 'Exagere o traço que define a palavra.'],
    ambiguityNotes: [],
    aliases: [],
    recommendedVisualCues: ['silhueta clara']
  };

  const special: Record<string, Partial<typeof generic>> = {
    girafa: {
      keyFeature: 'pescoço muito longo',
      recognitionStrategy: 'Pescoço primeiro, cabeça pequena depois.',
      idealStrokes: 6,
      estimatedSeconds: 12,
      primitiveRecipe: ['line', 'small oval', 'oval', 'dots'],
      steps: ['Trace um pescoço longo vertical.', 'Adicione cabeça pequena.', 'Faça corpo oval.', 'Marque manchas.'],
      tips: ['Exagere o pescoço.', 'Pernas podem ser simples.'],
      recommendedVisualCues: ['pescoço alto', 'manchas']
    },
    elefante: {
      keyFeature: 'tromba + orelhas grandes',
      idealStrokes: 7,
      steps: ['Desenhe cabeça grande.', 'Adicione orelhas abertas.', 'Puxe tromba longa.', 'Faça corpo simples.'],
      recommendedVisualCues: ['tromba', 'orelhões']
    },
    banana: {
      keyFeature: 'curva de crescente',
      idealStrokes: 2,
      estimatedSeconds: 4,
      primitiveRecipe: ['curved capsule'],
      tips: ['Não desenhe muitos detalhes da casca.']
    },
    correndo: {
      keyFeature: 'postura inclinada + linhas de movimento',
      primitiveRecipe: ['stick line', 'motion lines'],
      steps: ['Desenhe stickman inclinado para frente.', 'Estique uma perna para trás.', 'Adicione linhas de velocidade.'],
      recommendedVisualCues: ['inclinação', 'movimento']
    },
    chorando: {
      keyFeature: 'lágrimas visíveis',
      primitiveRecipe: ['circle', 'dots', 'tear lines'],
      steps: ['Desenhe rosto.', 'Faça olhos fechados/tristes.', 'Adicione lágrimas grandes.'],
      recommendedVisualCues: ['gotas grandes']
    },
    'mickey mouse': {
      keyFeature: 'orelhas redondas duplas',
      steps: ['Desenhe círculo da cabeça.', 'Adicione duas orelhas redondas grandes.', 'Marque olhos e sorriso.'],
      recommendedVisualCues: ['orelhas redondas']
    }
  };

  return { ...generic, ...(special[n] ?? {}) };
}

export async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T;
}

export async function writeJson(path: string, data: unknown): Promise<void> {
  await mkdir(path.split('/').slice(0, -1).join('/'), { recursive: true });
  await writeFile(path, JSON.stringify(data, null, 2));
}
