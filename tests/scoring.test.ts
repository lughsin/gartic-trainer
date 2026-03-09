import { describe, expect, it } from 'vitest';
import { scorePractice } from '@/features/trainer/scoring';
import type { WordEntry } from '@/types/word';

const baseWord: WordEntry = {
  id: 'banana',
  word: 'banana',
  normalized: 'banana',
  category: 'alimentos',
  difficulty: 'easy',
  tags: [],
  keyFeature: 'curva',
  recognitionStrategy: 'curva primeiro',
  idealStrokes: 2,
  estimatedSeconds: 5,
  primitiveRecipe: [],
  steps: [],
  tips: [],
  ambiguityNotes: [],
  aliases: [],
  recommendedVisualCues: []
};

describe('scorePractice', () => {
  it('returns high score for efficient attempt', () => {
    const result = scorePractice(baseWord, 5, 2, 0, 5);
    expect(result.score).toBeGreaterThan(80);
  });
});
