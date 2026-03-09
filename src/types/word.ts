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

export type PracticeResult = {
  wordId: string;
  elapsedSeconds: number;
  strokes: number;
  undoCount: number;
  confidence: number;
  score: number;
  feedback: string[];
  createdAt: string;
};
