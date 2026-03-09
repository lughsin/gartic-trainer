import { readJson, writeJson, normalizeWord, type RawWord } from './shared';

async function main() {
  const imported = await readJson<RawWord[]>('data/raw/importedWords.json').catch(async () => {
    console.log('Raw import not found, using manual seed.');
    return readJson<RawWord[]>('data/seeds/manualWords.json');
  });

  const dedup = new Map<string, RawWord>();
  imported.forEach((entry) => {
    const key = normalizeWord(entry.word);
    if (!dedup.has(key)) dedup.set(key, entry);
  });

  await writeJson('data/processed/normalizedWords.json', [...dedup.values()].map((e) => ({ ...e, normalized: normalizeWord(e.word) })));
  console.log(`Normalized ${dedup.size} unique words.`);
}

main();
