# andrebowen.com — v2.0 changes (2026-10-23)

Built from a copy of `site/` (no .git). `site/` and `masters/` untouched; nothing pushed or deployed.
Removed files were **moved** to `../v2.0-removed/` (nothing deleted).

## Build
- `_build/images.py` — generates `images/<category>/<slug>-{400,800,1200,1600}.webp` from `masters/` (falls back to old webp). Never upscales; 1600 quality steps q80→q60 to aim ≤200 KB. Writes `_build/image-map.json`.
- `_build/migrate_v2.py` — one-off (already run): pulled inline JS data into `_build/artworks.json`, rewrote page chrome, inserted `<!-- build:* -->` markers.
- `_build/build.py` — repeatable: renders gallery/hero/featured/archive figures, JSON-LD, OG tags, dialog, sitemap, alt-text TODO. Edit `artworks.json` then run `python3 _build/build.py`.
- `_build/check_links.py` — case-sensitive internal link/image check (1104 refs, 0 broken).
- `_build/` is ignored by GitHub Pages' default Jekyll build (underscore dir); move it out before deploy if `.nojekyll` is ever added.

## Fixes (audit 1–13)
1. Moved mockup-nav.html, mockup-option-a.html, design-system.html, src/, images/README.md, original webps (images-original/) and old js (main.v1.js) to `v2.0-removed/`. robots.txt already had Allow + Sitemap.
2. Galleries, hero, featured strips and archive are static `<figure><button><img></button><figcaption>`; JS only enhances. Visible/sr-only `<h1>` on every page, `<main id="main-content">` everywhere (skip link now works on galleries). Alt = "Title, year. Medium, dims." — `_build/alt-text-todo.md` lists every work for Andre's descriptions. Fixed live-site JS error (`initHGalleryArrows` undefined).
3. Lowercase slug folders/filenames (" copy" and "Andre Bowen_" stripped), srcset/sizes/width/height, `loading=lazy`, hero `fetchpriority=high`. Duplicate titles kept as separate works with unique slugs: `queenstown-flowers-2019-oil-on-panel-30x31cm` + `queenstown-flowers`; `roses-2014-oil-on-canvas-50x40cm` + `roses`.
4. `images/og/the-grove-1200x630.jpg` (106 KB) on all pages with og:image:width/height/alt + twitter:image.
5. JSON-LD @graph: Person (image, email andrebowen@me.com, sameAs Instagram only; About keeps existing alumniOf/award), WebSite, VisualArtwork per gallery item (name, dateCreated, artMedium, artform, image, creator). VisualArtwork `height`/`width` (schema.org Distance, e.g. "101 cm") parsed from the size, which Andre confirmed is HEIGHT × WIDTH in cm: 46 works have them; 26 drawings with no size in the data are skipped.
6. sitemap.xml: archive.html added, lastmod, priority dropped.
7. manifest.webmanifest + theme-color (light/dark). Icons: see Favicon below (192/512 now generated).
8. Type: rem tokens, 16px base, 1.25 scale, clamp() headings, min 12.8px (was 11–13px). Stack: Avenir Next Pro/Avenir Next/Avenir → self-hosted Figtree (fonts/, OFL, font-display swap) → Helvetica.
9. Spacing tokens `--space-1…--space-12` (8/16/24/32/48/64/96) replacing matching px values; MD3 elevation, ripple tokens/keyframes/JS removed. Typescale px tokens replaced.
10. Theme toggle moved into the header (no mobile overlap), `aria-pressed`. Home featured strips (Still Life / Landscape / Figure) now rendered.
11. Buttons for hero/gallery/archive items; hamburger `aria-expanded`/`aria-controls`, Esc + focus return; lightbox `role=dialog aria-modal aria-labelledby`, focus trap, Esc, ←/→, focus returns to opener, no empty `src`; Back button now visible on mobile; Instagram "(opens in a new tab)" label; archive chips `aria-pressed`, filtering via `hidden`.
12. 150 ms link-click delay removed; cross-document `@view-transition { navigation: auto }`, respects reduced motion.
13. GA4 Consent Mode default before config: analytics granted, ad_storage/ad_user_data/ad_personalization denied. ID G-JE27G4EEVR unchanged.

Archive redesign: the archive CSS had been lost during the v2.0 CSS rewrite (the ripple-removal regex matched to end of file and deleted the appended archive styles), so thumbnails rendered at full viewport width. Replaced with a scoped (.archive-page) dense catalogue grid: auto-fill minmax(160px,1fr) (6 cols at 1280), 3 cols on mobile (2 under 400px), square neutral tiles with object-fit: contain, caption title/year, medium, H × W cm at 12.8px, 400w images lazy-loaded; filters, sort and keyboard lightbox unchanged.

Favicon: replaced the old sun icon (from another site; originals moved to v2.0-removed/favicons-v1/) with a full-bleed square, no padding/corners/mark, vertical gradient #FF3B1F (orange-red, top) → #0E9F96 (teal, bottom): favicon.svg, favicon.ico (16/32/48), favicon-16x16/32x32.png, apple-touch-icon.png + favicon.png (180), icon-192/512.png; <link> tags and manifest updated.

Also: archive inline `<style>` moved into css/styles.css; About section labels are now `<h2>`; llms*.txt image paths updated.

## Images
Before: 73 webp, 13.7 MB (single size each). After: 252 files, 21 MB total across sizes (400: 1.1 MB, 800: 4.0 MB, 1200: 8.6 MB, 1600: 7.4 MB) — browsers download one size per image; the 800-wide set for all works is 4.1 MB vs 13.7 MB before.
27 works have no 1600 version (source smaller; not upscaled). 14 top-size files remain >200 KB at the q60 floor (heavily textured paintings): figure-15, landwehrkanal, velazquez-study-iii/iv, queenstown-lake-ii, two-trees, queenstown-lake-v, abyssinian-roses, flowers-in-a-mason-jar, outdoor-still-life, skull-and-sketchbooks, sneakers, roses, studio-corner-iv.

## Deploy notes
GitHub Pages is case-sensitive; all paths are lowercase and verified case-sensitively. Old image URLs will 404 (consider this acceptable or add redirects). CNAME kept.
- **Home = Still Life flow.** index.html now renders the Still Life split view directly (no redirect), first painting shown; canonical stays https://andrebowen.com/, Person/WebSite JSON-LD kept (VisualArtwork stays on still-life.html), nav shows Still Life active. Old hero/featured home saved to v2.0-removed/index-home-hero-featured.html.
- **Series split view + "All works" sheet.** Still Life, Landscape, Figure and Drawings are now one-work-at-a-time split views (left: title/medium/dims, Prev/Next within series, n / N, "All works"; right: painting, uncropped). "All works" opens a contact sheet reusing the archive grid (title, year). Linkable: `#all` and `#work-<slug>`; clicking a thumb returns to the flow at that work. Keyboard: real links/buttons, ←/→ step. Built by `_build/build.py` (`series()`); one-off markup change in `_build/migrate_series.py`. 0 broken links, no console errors.
- **Type scale (approved audit 2026-10-23).** Five roles as custom properties: `--type-display` clamp(1.5rem,1.2rem+1.2vw,2rem) 500/1.1 · `--type-brand` clamp(1.25rem,1.1rem+0.6vw,1.5rem) 500/1.1, ls .01em · `--type-title` clamp(1.125rem,1rem+0.5vw,1.25rem) 500/1.3 · `--type-body` 1rem 400/1.6 · `--type-small` 0.8125rem 1.45. Greys --ink #1d1d1f / --ink-2 #3c3c43 / --ink-3 #6e6e73 (dark #e5e5ea / #c7c7cc / #98989d); #8e8e93 and #5c5c60 no longer used for text. Contact nav = body; All works/Back, counter, counts, chips, sort, captions, footer = small; series label small caps 0.08em. Year split from title in split view and lightbox (`.dp-year`, body). Removed --text-xs/base/md/lg/xl/2xl and undefined --text-sm, unused MD3 tokens; line-heights collapsed to 4 values; weights 400/500 only. Measured order 32 > 24 > 20 > 16 > 13 (mobile 24 > 20 > 18 > 16 > 13). AA: #6e6e73 is 4.4:1 on the #eeeeee panel, so ink-3 text on panels (series label, counter, CV labels/years) uses --ink-2; everything else passes in light and dark. Previous CSS saved to v2.0-removed/styles.pre-type-scale.css.
- **About redesign.** No grey card. Split layout like the series pages: portrait on the left (~40%, natural 0.744 ratio, `height:auto`, never distorted, with an "André Bowen" caption) and on the right an h1 "About" (display role) and the bio (body role, max 65ch). The CV sits below in headed groups (Education [formerly "Studies"], Awards, Exhibitions, Residencies, Collections, Bibliography) as year | entry rows with small-role labels. On mobile: photo, then bio, then CV. Wording and facts are unchanged (text diff checked). The inline `opacity:0.6` on Bibliography notes is replaced by `.cv-note` (--ink-3) so it passes AA. The previous page is saved to v2.0-removed/about.pre-redesign.html.
- **Contact folded into About.** Contact is removed from the desktop and mobile nav on every page (nav is now Still Life, Landscape, Figure, Drawings, Archive, About). about.html has a `#contact` section at the end of the bio column: a small-role "Contact" label, the andrebowen@me.com mailto (title role) and the existing Instagram link. Every footer now shows the email (mailto, small role) next to the copyright. contact.html is now a noindex redirect to about.html#contact (meta refresh, canonical and `location.replace`); the old page is saved to v2.0-removed/contact.v2.html. contact.html is removed from the sitemap and from PAGES in build.py, and llms.txt points to about.html#contact. Contrast passes AA in light and dark.
- Removed the sentence "Enquiries regarding available works, exhibitions, or commissions are welcome." everywhere in v2.0 (About contact section; llms.txt Contact line now lists just the email and Instagram).
- Contact email, Instagram link and footer email restyled to body role (body size, 400 weight, #3c3c43 / dark #c7c7cc) with thin underline (1px, offset 0.15em); no bold/accent.
- About portrait reduced: ~27% column, max 280px wide on desktop, natural ratio, top-aligned with bio; on mobile max 60% width, left-aligned.
- Removed the "André Bowen" caption under the About portrait (image alt text unchanged).
- Preserved Search Console redirect stubs and custom 404.html from main (PR #1).
