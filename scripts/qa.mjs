#!/usr/bin/env node
/**
 * Quality checks against the built site in dist/.
 *
 * These are the mistakes that are easy to ship and embarrassing to find in
 * production: a broken internal link, a missing title or description, an
 * image with no alt text, a duplicated meta title, a missing canonical.
 * External links are listed rather than requested, so the check stays fast
 * and does not fail because someone else's server is slow.
 *
 * Run: node scripts/qa.mjs
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';

// The only inline script the Content-Security-Policy allows, by hash. If the
// no-js snippet in Base.astro changes, update this and docs/deployment.md.
const ALLOWED_INLINE_SCRIPT = 'sha256-bRrXOZfzkSHqxbwz5Za8TNTsnrMa7Kvk+eW1MqoTxsQ=';

const DIST = 'dist';
const problems = [];
const warnings = [];

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const files = await htmlFiles(DIST);
if (files.length === 0) {
  console.error('No HTML found in dist. Run the build first.');
  process.exit(1);
}

/** Every path the build produced, as the browser would request it. */
const routes = new Set();
for (const file of files) {
  const route = '/' + relative(DIST, file).replace(/\.html$/, '').replace(/\\/g, '/');
  routes.add(route === '/index' ? '/' : route);
}

const assets = new Set();
async function walkAssets(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walkAssets(full);
    else assets.add('/' + relative(DIST, full).replace(/\\/g, '/'));
  }
}
await walkAssets(DIST);

const titles = new Map();
const descriptions = new Map();
const externalLinks = new Set();

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const page = '/' + relative(DIST, file).replace(/\.html$/, '');
  const name = page === '/index' ? '/' : page;

  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim();
  if (!title) problems.push(`${name}: no <title>`);
  else {
    if (title.length > 65) warnings.push(`${name}: title is ${title.length} characters, over 65`);
    if (titles.has(title)) problems.push(`${name}: duplicate title, also on ${titles.get(title)}`);
    else titles.set(title, name);
  }

  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!description) problems.push(`${name}: no meta description`);
  else {
    if (description.length < 50 || description.length > 170) {
      warnings.push(`${name}: description is ${description.length} characters, outside 50 to 170`);
    }
    if (descriptions.has(description)) {
      problems.push(`${name}: duplicate description, also on ${descriptions.get(description)}`);
    } else descriptions.set(description, name);
  }

  if (!/<link rel="canonical"/.test(html)) problems.push(`${name}: no canonical link`);
  if (!/<meta property="og:image"/.test(html)) problems.push(`${name}: no og:image`);
  if (!/<html lang="/.test(html)) problems.push(`${name}: no lang on <html>`);

  const h1s = html.match(/<h1[\s>]/g)?.length ?? 0;
  if (h1s === 0) problems.push(`${name}: no h1`);
  if (h1s > 1) problems.push(`${name}: ${h1s} h1 elements, expected one`);

  for (const [, attrs, body] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/\bsrc=|application\/ld\+json/.test(attrs)) continue;
    const hash = 'sha256-' + createHash('sha256').update(body).digest('base64');
    if (hash !== ALLOWED_INLINE_SCRIPT) {
      problems.push(`${name}: inline script not allowed by the CSP (${hash})`);
    }
  }

  for (const tag of html.match(/<img\b[^>]*>/g) ?? []) {
    if (!/\balt=/.test(tag)) problems.push(`${name}: an img has no alt attribute`);
  }

  for (const [, href] of html.matchAll(/href="([^"#?][^"]*)"/g)) {
    if (/^(https?:|mailto:|tel:)/.test(href)) {
      externalLinks.add(href.split('#')[0]);
      continue;
    }
    if (!href.startsWith('/')) continue;
    const clean = href.split('#')[0].split('?')[0].replace(/\/$/, '') || '/';
    if (routes.has(clean) || assets.has(clean) || assets.has(href)) continue;
    problems.push(`${name}: link to ${href} goes nowhere in the build`);
  }

  for (const [, src] of html.matchAll(/(?:src|href)="(\/[^"]+\.(?:png|jpe?g|webp|avif|svg|ico|pdf|mp4|css|js|webmanifest|xml))"/g)) {
    if (!assets.has(src)) problems.push(`${name}: missing asset ${src}`);
  }

  if (/—|–/.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) {
    problems.push(`${name}: contains an em dash or en dash`);
  }
}

for (const required of ['/404', '/privacy', '/terms', '/thank-you', '/robots.txt', '/sitemap-index.xml']) {
  if (!routes.has(required) && !assets.has(required)) problems.push(`missing required page ${required}`);
}

console.log(`Checked ${files.length} pages, ${assets.size} files.`);
console.log(`${externalLinks.size} distinct external links (not requested here).`);

if (warnings.length) {
  console.log(`\n${warnings.length} warning${warnings.length === 1 ? '' : 's'}:`);
  warnings.forEach((w) => console.log(`  - ${w}`));
}

if (problems.length) {
  console.error(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}:`);
  problems.forEach((p) => console.error(`  - ${p}`));
  process.exit(1);
}

console.log('\nAll checks passed.');
