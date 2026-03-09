import type { PracticeResult, WordEntry } from '@/types/word';

export function scorePractice(word: WordEntry, elapsedSeconds: number, strokes: number, undoCount: number, confidence: number): PracticeResult {
  const speed = Math.max(0, 100 - Math.abs(elapsedSeconds - word.estimatedSeconds) * 3);
  const efficiency = Math.max(0, 100 - Math.max(0, strokes - word.idealStrokes) * 8);
  const simplicity = Math.max(0, 100 - undoCount * 12);
  const adherence = confidence * 20;
  const score = Math.round(speed * 0.3 + efficiency * 0.3 + simplicity * 0.2 + adherence * 0.2);

  const feedback: string[] = [];
  if (strokes <= word.idealStrokes + 1) feedback.push('excellent Gartic-style simplification');
  else feedback.push('too many strokes');

  if (elapsedSeconds <= word.estimatedSeconds) feedback.push('recognizable, but could be faster');
  else feedback.push('start with the larger silhouette');

  if (confidence >= 4) feedback.push('good start: you drew the key feature early');
  else feedback.push('try exaggerating the key feature');

  if (undoCount > 2) feedback.push('you added detail too soon');

  return {
    wordId: word.id,
    elapsedSeconds,
    strokes,
    undoCount,
    confidence,
    score,
    feedback,
    createdAt: new Date().toISOString()
  };
}
