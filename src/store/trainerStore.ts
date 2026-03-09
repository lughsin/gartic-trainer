import { create } from 'zustand';
import type { PracticeResult, WordEntry, Difficulty } from '@/types/word';
import { normalize } from '@/lib/utils';
import wordsData from '../../data/processed/wordRecipes.json';

const words = wordsData as WordEntry[];

type Mode = 'learn' | 'practice' | 'challenge' | 'category-grind' | 'weakness';

type State = {
  words: WordEntry[];
  selectedWord: WordEntry;
  mode: Mode;
  categoryFilter: string;
  difficultyFilter: Difficulty | 'all';
  query: string;
  favorites: string[];
  history: PracticeResult[];
  setMode: (mode: Mode) => void;
  setQuery: (value: string) => void;
  setCategoryFilter: (value: string) => void;
  setDifficultyFilter: (value: Difficulty | 'all') => void;
  selectWord: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addHistory: (result: PracticeResult) => void;
  filteredWords: () => WordEntry[];
};

export const useTrainerStore = create<State>((set, get) => ({
  words,
  selectedWord: words[0],
  mode: 'learn',
  categoryFilter: 'all',
  difficultyFilter: 'all',
  query: '',
  favorites: [],
  history: [],
  setMode: (mode) => set({ mode }),
  setQuery: (query) => set({ query }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setDifficultyFilter: (difficultyFilter) => set({ difficultyFilter }),
  selectWord: (id) => {
    const selectedWord = get().words.find((w) => w.id === id);
    if (selectedWord) set({ selectedWord });
  },
  toggleFavorite: (id) =>
    set((s) => ({ favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id] })),
  addHistory: (result) => set((s) => ({ history: [result, ...s.history].slice(0, 200) })),
  filteredWords: () => {
    const { words: all, query, categoryFilter, difficultyFilter } = get();
    const q = normalize(query);
    return all.filter((w) => {
      const matchesCategory = categoryFilter === 'all' || w.category === categoryFilter;
      const matchesDifficulty = difficultyFilter === 'all' || w.difficulty === difficultyFilter;
      const matchesQuery = !q || w.normalized.includes(q);
      return matchesCategory && matchesDifficulty && matchesQuery;
    });
  }
}));
