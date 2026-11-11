# simPl website

A minimal, English-only landing page for simPl, a local book reader for Windows and Android.
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

The Windows download follows the reader's newest release by itself. When the
site builds, `src/config/releases.ts` reads the published releases from the
GitHub API, and `src/config/product.ts` takes the newest `v*.*.*` tag: its
installer and portable ZIP links, their sizes and the installer's SHA-256. If
GitHub can't be reached, the build uses the `pinned` values in `product.ts`
instead, so update those now and then. `SIMPL_PINNED_RELEASE=1` builds from the
pinned values without the network, and `GITHUB_TOKEN` avoids the anonymous rate
limit. The displayed size is the installer download, not the installed
application's size.

A new release reaches the site in two ways: the reader repository's
`website.yml` workflow starts this repository's deployment when a release is
published (it needs the `WEBSITE_DEPLOY_TOKEN` secret there), and
`deploy.yml` also rebuilds every day.

`/download/windows/` forwards to the current installer. Use it for links
outside the site so they never name a version. `/changelog/` is built from the
same release notes.

The **New in** section does not follow the release by itself, because its copy
is written by hand. `featuredVersion` in `product.ts` names the release it
describes. While a newer release is out, the hero badge links to the changelog
instead of naming that section's highlights. To update it, rewrite the items in
`src/components/WhatsNew.astro` and raise `featuredVersion`.

Android has its own release track (`android-v*` tags). The Android button points
to the ARM64 APK, and the download area also links the universal APK. Keep
`androidVersion`, `androidDownloadSize`, and `androidUniversalSize` aligned with
the Android release; set `androidDownloadUrl` to `null` to hide Android.

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
radio labels (see `src/components/AppPreview.astro`): Reading, Library, PDF
(Document view) and PDF as book (Book view). Shots that have both a `dark` and a `light` capture
follow the page's light/dark toggle. A different slide count also needs the
`:has(#app-preview-*:checked)` visibility rules updated. Only the selected figure
is displayed, including in the accessibility tree.

The kit is built in the reader repository with `scripts\capture-promotion.ps1`,
which writes `target\promotion\kit\web\`. The gallery images keep the kit's file
names, so a new kit replaces them directly.

The **New in** section (`src/components/WhatsNew.astro`) and the lasting
features under it (`src/components/WhatItDoes.astro`) share one row layout,
`src/components/FeatureRows.astro`, and use 16:10 close-ups cropped from the
kit: `crop-tools` and `crop-tools-hidden` (the same view with and without the
reading tools, cross-faded), `crop-progress`, `crop-aa`,
`crop-listen`, `crop-translate` and `crop-backup`. Each has a `-dark` twin cut from the
same region of a dark capture, and the row shows the one that matches the page.
Keep every crop at 16:10 so the rows stay the same height. The translation shot contains WikDict data, so
keep its visible CC BY-SA 4.0 attribution and the caption credit when replacing
or reusing it. Demo books in the screenshots were made for the kit and are not
bundled.

`public/og.png` is the image shown when the site is shared. Rebuild it with
`node scripts/og-image.mjs` after replacing the dark reading screenshot.

## Hosting

The entire production site is in `dist/`. It can be served by Cloudflare Workers
Static Assets or an ordinary static web server on a VPS. No Node.js process is
needed on the production server.

`robots.txt` and `sitemap.xml` are generated at build time by
`src/pages/robots.txt.ts` and `src/pages/sitemap.xml.ts`. `robots.txt` allows
crawling and points at the sitemap; the sitemap lists the homepage, changelog and credits. Both need a
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
a release badge, the simPl wordmark, one line of introduction, the Windows and
Android downloads with one line of details, a real screenshot gallery, three
"New in" close-ups, three lasting features in the same layout, four short
notes, a seven-question FAQ, and project/license links.

The page is meant to feel as simple as the reader. Each fact is said once: a
row shows a feature in one sentence, and the FAQ holds the details (shortcuts,
the portable ZIP, the universal APK, checksums). Sections are separated by
space, with a single rule above the footer, and section headings stay one line
so the wordmark is the only large type. The only looping animation is the
cross-fade that shows the reading tools hiding (off for reduced motion).
Gallery selection, theme switching, and disclosures work without JavaScript.
Edit the tokens in `src/styles/global.css` to change the visual direction.

### Light and dark appearance

Dark is the reference palette. The page opens in the visitor's system
appearance, and a quiet toggle in the top-right corner switches to the other
one. Colors are `light-dark()` pairs in `global.css`. The switch is a visually
hidden checkbox styled as a button; it flips `color-scheme` through the
`html:has(#theme-toggle:checked)` rules, so it still needs no JavaScript. The
choice is per page load and is not persisted; a `localStorage` script would be
required for that, which would add a `script-src` policy and a small amount of
JavaScript.
