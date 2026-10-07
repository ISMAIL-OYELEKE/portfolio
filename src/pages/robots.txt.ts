import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  if (import.meta.env.PUBLIC_NOINDEX === 'true') {
    return new Response('User-agent: *\nDisallow: /\n', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
  const body = `User-agent: *
Allow: /
Disallow: /thank-you

Sitemap: ${new URL('sitemap-index.xml', site)}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
