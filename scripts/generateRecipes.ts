import { readJson, writeJson, normalizeWord, slugify, generateRecipe, type RawWord, type WordEntry } from './shared';

async function main() {
  const normalized = await readJson<(RawWord & { normalized?: string })[]>('data/processed/normalizedWords.json').catch(() =>
    readJson<RawWord[]>('data/seeds/manualWords.json')
  );

  const entries: WordEntry[] = normalized.map((item) => ({
    id: slugify(item.word),
    word: item.word,
    normalized: item.normalized ?? normalizeWord(item.word),
    category: item.category,
    ...generateRecipe(item.word, item.category)
  }));

  await writeJson('data/processed/wordRecipes.json', entries);
  console.log(`Generated ${entries.length} recipe entries.`);
}

main();
