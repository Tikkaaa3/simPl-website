import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const entries = site
    ? ['/', '/credits/'].map((path) => `  <url>\n    <loc>${new URL(path, site).href}</loc>\n  </url>\n`).join('')
    : '';
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}</urlset>\n`;
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
