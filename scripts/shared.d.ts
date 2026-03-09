export type RawWord = {
    word: string;
    category: string;
};
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
export declare const normalizeWord: (value: string) => string;
export declare const slugify: (value: string) => string;
export declare function classifyDifficulty(word: string, category: string): Difficulty;
export declare function generateRecipe(word: string, category: string): Omit<WordEntry, 'id' | 'word' | 'normalized' | 'category'>;
export declare function readJson<T>(path: string): Promise<T>;
export declare function writeJson(path: string, data: unknown): Promise<void>;
