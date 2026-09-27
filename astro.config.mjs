import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  // Keep styles compatible with the style-src 'self' policy in public/_headers.
  build: { inlineStylesheets: 'never' },
  site: process.env.SITE_URL || undefined,
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
