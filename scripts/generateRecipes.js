import { readJson, writeJson, normalizeWord, slugify, generateRecipe } from './shared';
async function main() {
    const normalized = await readJson('data/processed/normalizedWords.json').catch(() => readJson('data/seeds/manualWords.json'));
    const entries = normalized.map((item) => ({
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
