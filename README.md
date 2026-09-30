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

The Windows download currently points to the v0.1.5 official installer, and the
download area also links the portable ZIP. Keep `windowsDownloadUrl`,
`releaseVersion`, `downloadSize`, `portableDownloadUrl`, and `portableSize` in
`src/config/product.ts` aligned when updating the release. Set
`portableDownloadUrl` to `null` to hide the portable link. Set the URL to `null`
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

Dictionary data and simPl's adaptations retain their independent CC BY-SA 4.0
rights, including commercial reuse under that license. `/credits/` documents
the screenshot's sources, changes, all optional dictionary providers and the
license boundary; the shared footer and visible translation caption link to it.

## Application screenshots

Screenshots live in `src/assets/screens/` and come from the reader's promotional
media kit (2560 × 1600, 16:10, lossless WebP). Astro generates responsive WebP
variants at build time.

The frame below the download area is a no-JavaScript gallery with always-visible
radio labels (see `src/components/AppPreview.astro`): Reading, Library, Themes
(a 2 × 2 grid of the four reading themes), Notes, PDF (Document view) and
PDF as book (Book view). Shots that have both a `dark` and a `light` capture
follow the page's light/dark toggle. A different slide count also needs the
`:has(#app-preview-*:checked)` visibility rules updated. Only the selected figure
is displayed, including in the accessibility tree.

The **New in 0.1.5** section (`src/components/WhatsNew.astro`) uses 16:10
close-ups cropped from the kit: `crop-listen`, `crop-translate`, `crop-backup`
and `crop-typography`. The translation shot contains WikDict data, so keep its
visible CC BY-SA 4.0 attribution and the caption credit when replacing or reusing
it. Demo books in the screenshots were made for the kit and are not bundled.

## Hosting

The entire production site is in `dist/`. It can be served by Cloudflare Workers
Static Assets or an ordinary static web server on a VPS. No Node.js process is
needed on the production server.

`robots.txt` and `sitemap.xml` are generated at build time by
`src/pages/robots.txt.ts` and `src/pages/sitemap.xml.ts`. `robots.txt` allows
crawling and points at the sitemap; the sitemap lists the homepage and credits. Both need a
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
Repository variable: `SITE_URL` (`https://simplreader.app`), the public origin
used for canonical, Open Graph, and sitemap URLs.

The site is served at **https://simplreader.app**, attached to the `reader`
Worker as a custom domain in the Cloudflare dashboard. `www.simplreader.app` is
also attached and redirected to the root by a 301 Redirect Rule, and
Always Use HTTPS is on. The production `*.workers.dev` URL is disabled so the
site has a single public address.

Alternatively, Cloudflare's own Git integration (Workers Builds) can run
`npm run build` and publish `dist/` without GitHub Actions.

The Windows installer is separate from this site: it can be a GitHub Release
asset (set `windowsDownloadUrl` to that HTTPS URL) or a file in `public/`
(use a site-relative path). The release and native builds for the reader itself
live in the reader repository.

## Design

Neutral monochrome colors, self-hosted Geist, and a centered composition:
a release badge, the simPl wordmark, a short product introduction, Windows
download and source links, a real screenshot gallery, a "New in" section with
alternating close-ups, six feature notes, a compact FAQ, and project/license
links. The FAQ covers formats, PDF views, Listen, word translation and
dictionary credits, notes and export, typography, backups, and installation.
"New in" rows fade in with a CSS scroll-driven animation where supported
(disabled for reduced motion).
Gallery selection, theme switching, and disclosures work without JavaScript.
Edit the tokens in `src/styles/global.css` to change the visual direction.

### Light and dark appearance

Dark is the reference palette. A quiet toggle in the top-right corner switches
to the light palette. The switch is a visually hidden checkbox styled as a
button; it changes the theme through the `html:has(#theme-toggle:checked)`
rules in `global.css`, so it still needs no JavaScript. The choice is per page
load and is not persisted; a `localStorage` script would be required for that,
which would add a `script-src` policy and a small amount of JavaScript.
