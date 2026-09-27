# simPl website

A minimal, English-only landing page for simPl, a local book reader for Windows.
Built with Astro, TypeScript, and CSS. The production page requires no JavaScript,
backend, external fonts, analytics, or cookies.

## Local development

Requires Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

```sh
npm run check
npm run build
npm run preview
```

## Enable downloads

The Windows download is intentionally disabled while the installer is unavailable.
Set `windowsDownloadUrl` in `src/config/product.ts` to the actual HTTPS release asset
URL and rebuild. The disabled button becomes a real download link automatically.

You can also host the installer on this site: place the file in `public/`
(for example `public/simPl-setup.exe`) and set
`windowsDownloadUrl = '/simPl-setup.exe'`. Site-relative paths and absolute HTTPS
URLs are both accepted; the link downloads the file instead of navigating to it.
GitHub Releases can host the installer independently of the website.

Do not add supported formats, version numbers, or performance measurements until
they are confirmed for the release.

## Application screenshots

The frame below the download area is a no-JavaScript gallery driven by hidden
radio inputs and `label` arrows (see `src/components/AppPreview.astro`). It shows
three real 16:9 screenshots and reveals left/right arrows on hover or keyboard
focus.

Replace the images in `src/assets/` and rebuild:

- `app-preview-dark.png` — library, dark appearance (first slide)
- `app-preview-reading.png` — reading view
- `app-preview-light.png` — library, light appearance

Use real app captures at 1918 × 1078 (16:9); Astro generates responsive WebP
variants locally. To change the order or add a slide, edit the `slides` array in
`AppPreview.astro`; the track and arrow rules use three states, so a different
count also needs the `#app-preview-*:checked` rules updated.

## Hosting

The entire production site is in `dist/`. It can be served by Cloudflare Workers
Static Assets or an ordinary static web server on a VPS. No Node.js process is
needed on the production server.

`robots.txt` and `sitemap.xml` are generated at build time by
`src/pages/robots.txt.ts` and `src/pages/sitemap.xml.ts`. `robots.txt` allows
crawling and points at the sitemap; the sitemap lists the homepage. Both need a
public origin, so set `SITE_URL` to see the absolute `Sitemap:` and `<loc>` URLs.

Set `SITE_URL` to the final origin (for example, in the build environment) to enable
canonical and Open Graph URL metadata. `.env.example` documents the variable.

`public/_headers` configures security headers and immutable caching for fingerprinted
assets on compatible Cloudflare hosting. For a VPS, configure equivalent headers
in the web server; `_headers` itself is not interpreted by Nginx or Caddy.

The `.openai/hosting.json` manifest supports a private Sites preview of the same
static build and does not change the portable production output.

## Deployment

Pushing to `main` builds the site and publishes `dist/` to **Cloudflare Workers
Static Assets** through `.github/workflows/deploy.yml`, using
`cloudflare/wrangler-action` and `wrangler.jsonc` (`assets.directory = ./dist`).
Repository secrets: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
Repository variable: `SITE_URL`, the public origin used for canonical, Open
Graph, and sitemap URLs. The first deploy lands on `*.workers.dev`; attach the
custom domain (`reader.app` or whichever is chosen) in the Cloudflare dashboard
or with a `routes` entry in `wrangler.jsonc`.

Alternatively, Cloudflare's own Git integration (Workers Builds) can run
`npm run build` and publish `dist/` without GitHub Actions.

The Windows installer is separate from this site: it can be a GitHub Release
asset (set `windowsDownloadUrl` to that HTTPS URL) or a file in `public/`
(use a site-relative path). The release and native builds for the reader itself
live in the reader repository.

## Design

Neutral monochrome colors, self-hosted Geist, and a centered composition:
the simPl wordmark, one short description, the Windows download button, a
wide frame reserved for the real application screenshot, three short feature
notes, and a one-line privacy footer.
Edit the tokens in `src/styles/global.css` to change the visual direction.

### Light and dark appearance

Dark is the reference palette. A quiet toggle in the top-right corner switches
to the light palette. The switch is a visually hidden checkbox styled as a
button; it changes the theme through the `html:has(#theme-toggle:checked)`
rules in `global.css`, so it still needs no JavaScript. The choice is per page
load and is not persisted; a `localStorage` script would be required for that,
which would add a `script-src` policy and a small amount of JavaScript.
