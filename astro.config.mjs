import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL and BASE_PATH are only set by the preview workflow, which serves the
// site from a subpath on GitHub Pages. Production uses the defaults.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://ismailoyeleke.com',
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'auto' },
  // The thank-you page is noindex, so it stays out of the sitemap too.
  integrations: [sitemap({ filter: (page) => !page.includes('/thank-you') })],
  image: { responsiveStyles: true },
  // Ship every script as its own file instead of inlining small ones, so the
  // Content-Security-Policy in docs/deployment.md can stay strict.
  vite: { build: { assetsInlineLimit: 0 } },
});
