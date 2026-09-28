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

The Windows download currently points to the v0.1.2 official installer.
Keep `windowsDownloadUrl`, `releaseVersion`, and `downloadSize` in
`src/config/product.ts` aligned when updating the release. Set the URL to `null`
to show the unavailable state. The displayed size is the installer download,
not the installed application's size.

You can also host the installer on this site: place the file in `public/`
(for example `public/simPl-setup.exe`) and set
`windowsDownloadUrl = '/simPl-setup.exe'`. Site-relative paths and absolute HTTPS
URLs are both accepted; the link downloads the file instead of navigating to it.
GitHub Releases can host the installer independently of the website.

Use confirmed product capabilities and release metadata. Do not publish
performance figures until the shipping build has been measured.

## Product and licensing copy

Official releases are free for personal and professional use under the reader's
`LICENSE-BINARY.txt`. The source is separately available under PolyForm
Noncommercial 1.0.0 (`LICENSE.md`); describe it as **source-available**.
The download area links to the release terms; the FAQ and footer link to both
sets of terms.

## Application screenshots

The frame below the download area is a no-JavaScript gallery with always-visible
radio labels (see `src/components/AppPreview.astro`). It opens on the reading
view and offers library and light-appearance previews, each with a caption.
Native radio controls support keyboard arrow navigation. Only the selected
figure is displayed, including in the accessibility tree.

Replace the images in `src/assets/` and rebuild:

- `app-preview-reading.png` — reading view (first preview)
- `app-preview-dark.png` — library, dark appearance
- `app-preview-light.png` — library, light appearance

Use real app captures at 1918 × 1078 (16:9); Astro generates responsive WebP
variants locally. To change the order or add a preview, edit the `slides` array in
`AppPreview.astro`; a different count also needs the `:has(#app-preview-*:checked)`
visibility rules updated. The first image loads eagerly; the others load lazily.
PDF modes are explained in the FAQ until real Document and Book view captures
are available; do not repurpose an EPUB screenshot as a PDF comparison.

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
the simPl wordmark, a short product introduction, Windows download and source
links, a real screenshot gallery, three feature notes, a compact FAQ, and
project/license links.
Gallery selection, theme switching, and disclosures work without JavaScript.
Edit the tokens in `src/styles/global.css` to change the visual direction.

### Light and dark appearance

Dark is the reference palette. A quiet toggle in the top-right corner switches
to the light palette. The switch is a visually hidden checkbox styled as a
button; it changes the theme through the `html:has(#theme-toggle:checked)`
rules in `global.css`, so it still needs no JavaScript. The choice is per page
load and is not persisted; a `localStorage` script would be required for that,
which would add a `script-src` policy and a small amount of JavaScript.
