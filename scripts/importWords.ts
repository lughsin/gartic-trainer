import { writeJson, normalizeWord, type RawWord } from './shared';

const sources = [
  { url: 'https://respostadogartic.blogspot.com/2017/10/lista-de-alimentos-gartic.html', category: 'alimentos' },
  { url: 'https://listasdogartic.blogspot.com/p/lista-de-objetos.html', category: 'objetos' },
  { url: 'https://respostadogartic.blogspot.com/2020/08/lista-de-geral-gartic.html', category: 'geral' },
  { url: 'https://listasdogartic.blogspot.com/p/lista-de-animais.html', category: 'animais' },
  { url: 'https://respostadogartic.blogspot.com/2017/10/lista-de-verbos-gartic.html', category: 'verbos' },
  { url: 'https://respostadogartic.blogspot.com/2017/11/lista-de-desenho-animado-gartic.html', category: 'desenho animado' }
];

function parseWords(html: string): string[] {
  const text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ');

  return text
    .split(/[\n,;|]/)
    .map((v) => v.trim())
    .filter((v) => v.length > 1 && v.length < 40 && /[a-zà-ú]/i.test(v))
    .filter((v) => !/^lista|gartic|resposta/i.test(v));
}

async function main() {
  const out: RawWord[] = [];
  for (const source of sources) {
    try {
      const res = await fetch(source.url);
      const html = await res.text();
      const words = parseWords(html);
      for (const word of words) out.push({ word, category: source.category });
    } catch (error) {
      console.warn(`Failed to fetch ${source.url}:`, error);
    }
  }

  if (!out.length) {
    const seed = await import('../data/seeds/manualWords.json', { with: { type: 'json' } });
    out.push(...(seed.default as RawWord[]));
    console.log('Used manual seed fallback due to network or parsing issues.');
  }

  const dedup = new Map<string, RawWord>();
  for (const item of out) {
    const key = `${normalizeWord(item.word)}::${item.category}`;
    if (!dedup.has(key)) dedup.set(key, item);
  }

  await writeJson('data/raw/importedWords.json', [...dedup.values()]);
  console.log(`Imported ${dedup.size} words into data/raw/importedWords.json`);
}

main();
