// Prüft alle internen Links, Bilder und Sprungmarken (#anker) der Website – ohne Internetzugriff.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';

const pages = [...readdirSync('.').filter((f) => f.endsWith('.html')), ...readdirSync('en').filter((f) => f.endsWith('.html')).map((f) => 'en/' + f)];
const ids = new Map();
const idsOf = (file) => {
  if (!ids.has(file)) ids.set(file, new Set([...readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  return ids.get(file);
};

const errors = [];
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const [, attr, raw] of html.matchAll(/\s(href|src)="([^"]*)"/g)) {
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(raw)) continue;
    const [path, hash] = raw.split('#');
    let target = path === '' ? page : path.startsWith('/') ? path.slice(1) : normalize(join(dirname(page), path));
    if (target === '' || target.endsWith('/')) target += 'index.html';
    if (!existsSync(target)) { errors.push(`${page}: ${attr}="${raw}" – Datei fehlt`); continue; }
    if (hash && target.endsWith('.html') && !idsOf(target).has(hash)) errors.push(`${page}: ${attr}="${raw}" – Sprungmarke #${hash} fehlt`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} kaputte Verweise gefunden.`);
  process.exit(1);
}
console.log(`Alle Verweise in ${pages.length} Seiten in Ordnung.`);
