#!/usr/bin/env node
/**
 * Preview builds only.
 *
 * GitHub Pages serves this repository from a subpath
 * (https://ismail-oyeleke.github.io/portfolio), while the real site is served
 * from the domain root. Astro already prefixes the assets it bundles; this
 * script prefixes the hand-written root-relative links too (navigation, the
 * CV, favicons, media), so every link works on the preview.
 *
 * Production builds never run this.
 *
 * Usage: node scripts/apply-base.mjs dist /portfolio
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const [dist = 'dist', rawBase] = process.argv.slice(2);
if (!rawBase) {
  console.error('Usage: node scripts/apply-base.mjs <dist> <base>');
  process.exit(1);
}
const base = '/' + rawBase.replace(/^\/|\/$/g, '');

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (/\.(html|css|webmanifest)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const prefix = (url) =>
  url.startsWith('//') || url === base || url.startsWith(base + '/') ? url : base + url;

let changed = 0;
const files = await walk(dist);
for (const file of files) {
  const before = await readFile(file, 'utf8');
  const after = before
    .replace(/(href|src|poster|action)="(\/[^"]*)"/g, (_, attr, url) => `${attr}="${prefix(url)}"`)
    .replace(/url\((\/[^)"']*)\)/g, (_, url) => `url(${prefix(url)})`)
    .replace(/"src":\s*"(\/[^"]*)"/g, (_, url) => `"src": "${prefix(url)}"`)
    .replace(/location\.href\s*=\s*'(\/[^']*)'/g, (_, url) => `location.href = '${prefix(url)}'`);
  if (after !== before) {
    await writeFile(file, after);
    changed++;
  }
}
console.log(`Prefixed root-relative links with ${base} in ${changed} of ${files.length} files.`);
