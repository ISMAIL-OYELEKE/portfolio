# PROGRESS

The single source of truth for where the ismailoyeleke.com rebuild stands.
Update this file in the same commit as any change, on every push.

Last updated: 2026-10-07

## Paste this to resume

Copy everything inside the box into a new Claude chat (Claude Code on the web,
with the `ISMAIL-OYELEKE/portfolio` repository attached):

```text
You are continuing the rebuild of my portfolio site, ismailoyeleke.com.
The repository is ISMAIL-OYELEKE/portfolio. Before doing anything:

1. Read PROGRESS.md at the repo root in full. It holds the goal, every
   decision already made, the rules, what is done, and the next steps in order.
2. Read README.md and docs/deployment.md.
3. Run: npm ci && npm run build && node scripts/qa.mjs && npm run check
   and confirm they pass before changing anything.

Rules that are never negotiable:
- Follow the "Rules" section of PROGRESS.md (production standards, anti
  vibecoding design rules, SEO launch checklist). Do not relax them.
- Never invent testimonials or quotes. The site has no references section,
  on Ismail's mentor's advice; do not add one back.
- Do not show any .NET projects. Lead with cloud and DevOps.
- Never commit secrets. Keys go in GitHub secrets or variables only.
- Do not touch my old portfolio repository.
- Work on a branch, open or update a pull request into main, and keep CI green.
- Update PROGRESS.md in the same commit as every change you push.

Then pick up the first unchecked item under "Next steps" and tell me what you
are doing. Ask me only for things listed under "Waiting on Ismail".
```

## Goal

A production grade personal site that gets Ismail hired as a Cloud / DevOps
Engineer first, with freelance software work as a secondary offer. Multi page,
fast, accessible, indexed by Google, and deployed automatically from GitHub.

## Stack

- Astro 7 (static output, `build.format: 'file'`, `trailingSlash: 'never'`)
- TypeScript, plain CSS with design tokens in `src/styles/global.css`
- `@astrojs/sitemap`, `astro:assets` for WebP images
- Self hosted fonts via Fontsource: Fraunces (display), Sora (body),
  JetBrains Mono (labels)
- Contact form: Web3Forms (`PUBLIC_WEB3FORMS_KEY`)
- Analytics: GA4 (`PUBLIC_GA_ID`), loaded only after cookie consent
- Hosting: private S3 bucket with Origin Access Control, behind CloudFront,
  Route 53 for DNS, ACM certificate in us-east-1
- CI/CD: GitHub Actions, AWS access through OIDC (no stored AWS keys)

## Decisions already made (do not reopen)

| Topic | Decision |
| --- | --- |
| Repository | New repo `ISMAIL-OYELEKE/portfolio`. Old repo stays untouched. |
| Domain | ismailoyeleke.com (www redirects to apex) |
| Framework | Astro, multi page |
| Deploy | GitHub Actions + AWS OIDC role, S3 + CloudFront |
| Preview | GitHub Pages at https://ismail-oyeleke.github.io/portfolio/ (noindex) |
| Brand | Harbour navy `#0F1E33`, blue `#1D5BA6` and amber `#E0A33A` on paper `#F4F5F2` (chosen 2026-10-06 after his mentor asked for a reason beyond favourite colour). Blue is accent text on light; amber only on navy or as the button fill, never text on paper. Tokens in `src/styles/global.css`. Logo shapes are final. |
| Positioning | Cloud / DevOps first, freelance second |
| Content excluded | No .NET projects |
| Headshot | `headshot-portrait-cutout.png` (transparent, with sash) with no frame, edges faded into the page (Ismail, 2026-10-08). `src/components/Portrait.astro` |
| References | None on the site (mentor's advice, 2026-10-06). Available on request only. |
| Pages | Home, About, Experience, Projects (+ 8 case studies), Certifications, Freelance, Writing, Contact, Thank you, 404, Privacy, Terms |

## Where things live

In the repo:

- `src/data/` holds every word the site says. Edit content here, not in pages.
  - `site.ts` name, role, email, phone, WhatsApp, socials, nav, headline stats
  - `projects.ts` all 8 projects and their case studies
  - `experience.ts` roles, education, community, values, About story
  - `certifications.ts` 23 certifications and badge groups
  - `skills.ts`
- `src/components/`, `src/layouts/`, `src/pages/` layout and routes
- `src/assets/` logo SVGs, headshots, project screenshots (optimised at build)
- `public/` favicons, manifest, `og-image.jpg` (1200x630, under 300KB for WhatsApp), the CV PDF, the demo video
- `scripts/qa.mjs` build time quality checks (titles, descriptions,
  canonicals, alt text, single h1, broken internal links, no dashes)
- `scripts/apply-base.mjs` preview only link prefixing for GitHub Pages
- `.github/workflows/` `ci.yml` (checks), `preview.yml` (GitHub Pages),
  `deploy.yml` (production to AWS)
- `docs/deployment.md` the full AWS and GitHub setup, step by step

In the shared project folder (`/mnt/project-files/portfolio-rebuild/`):

- `content.md` the source content gathered from Ismail's form and CV
- `brand/` logo kit, brand brief, all headshot variants
- `proof/` POS screenshots and the Cloud Dimex demo video
- `how-the-rebuild-works.md` the original plan and explanation
- `preview/` screenshots of the built pages
- `PROGRESS.md` a mirror of this file

## Rules

The project instructions hold the full text. Every change must keep to them.

1. Production standards: privacy policy, terms, cookie consent, unique meta
   title and description per page, OG tags and image, favicons, sitemap,
   robots.txt, alt text, compressed images, WCAG AA contrast, responsive from
   360px, a CTA above the fold, a sticky mobile CTA, thank you page, 404 page,
   zero broken links, client and server form validation, error and loading
   states, spam protection, analytics, real contact details.
2. Anti vibecoding design rules: no em or en dashes in copy, no Inter, Geist or
   Space Grotesk, no pure white, no fake testimonials, no rows of 3 identical
   cards, no bento grids, no Lucide icons, no gradients, glow, neon or pastel,
   no glassmorphism, no green checkmark lists, no fake terminals.
3. SEO and launch checklist: Search Console, Bing Webmaster Tools, GA4 with
   consent, sitemap submitted, canonical URLs, JSON-LD, OG, internal links,
   PageSpeed 90+, business email with SPF, DKIM and DMARC, live chat option.

`node scripts/qa.mjs` enforces the mechanical parts. Run it before every push.

## Done

- [x] Content gathered and approved (`content.md`)
- [x] Logo kit and brand colours (green and gold)
- [x] Astro site, 20 pages, all content in `src/data/`
- [x] Eight case studies (six cloud, two freelance) with proof and video
- [x] Contact form with honeypot, time trap, client validation, error and
      loading states, email and WhatsApp fallback when no key is set
- [x] Cookie consent gating GA4, privacy and terms pages
- [x] Per page meta, canonical, OG, Twitter, JSON-LD (Person, ContactPage,
      CreativeWork), sitemap, robots
- [x] WCAG AA contrast checked, responsive from 360px, reduced motion respected
- [x] QA script and CI workflow, production deploy workflow (S3 + CloudFront)
- [x] AWS setup guide in `docs/deployment.md`
- [x] Pull request #1 open from `claude/portfolio-rebuild` into `main`
- [x] Automatic preview on GitHub Pages (noindex) on every push, live since
      2026-10-06 (Pages source set to GitHub Actions)
- [x] This progress file
- [x] Visual QA pass on the live preview (2026-10-06): hero sized to fit
      short laptop screens with both buttons above the fold, portrait capped
      by screen height, compact cookie bar, no horizontal overflow at any
      width (footer email, contact form), no orphan cards in grids, missing
      spaces before inline links fixed
- [x] Real badge images on every certification (2026-10-06): 19 Credly
      badges and 2 Coursera certificates in `src/assets/badges/`, named by
      Credly badge id or Coursera code. Shown on the certifications page and
      the home page.
- [x] Project 1 (this portfolio, v1 on S3, CloudFront and Route 53) given a
      full case study at /projects/portfolio-on-s3-cloudfront-route-53,
      featured on the home page and second in the project list
- [x] Motion and real brand icons (2026-10-06): hover lift on cards, button
      rise with arrow step, underline draw on links and nav, gold bar on list
      rows, header shadow on scroll, staggered scroll reveals, a one-time
      entrance on page heroes, count-up stats. All off under reduced motion.
      Social icons are the real logos (Simple Icons, LinkedIn inlined from
      its own brand assets) via `src/lib/brands.ts`, in brand colours.
- [x] Mobile hero shows the portrait on the first screen (2026-10-06): on
      phones a centred circular portrait sits at the top (Ismail did not
      like the arch shape on phones), the availability pill is centred under
      it, and the headline and both buttons stay above the fold from 360x740.
      Desktop keeps the arch.
- [x] Social preview and favicon fix (2026-10-06): og:image now includes the
      base path (it pointed outside /portfolio on the preview, so WhatsApp got
      a 404) and is a 70KB JPG instead of a 323KB PNG. Canonical and og:url
      drop the .html suffix. New favicon is a solid green rounded tile with
      the ivory and gold mark, readable on light and dark browser tabs, with
      matching ico, PNG, apple touch and manifest icons.
- [x] About page portrait centred under the buttons on phones and tablets.
- [x] Whole home hero, stats row included, on the first screen on desktop
      (2026-10-06): headline, spacing and stats sized by screen height.
      Checked at 1920x1080, 1920x950, 1536x730, 1440x780, 1366x650,
      1280x765 (1920 screen at 150% scaling), 1280x640 and 1024x690.
      On desktop the hero fills exactly one screen, so the ivory section
      below never peeks in.
- [x] Real logos on the Skills list (2026-10-06): AWS services use the
      official AWS Architecture Icons (`aws-icons` package), other tools use
      Simple Icons marks in brand colour, via `src/lib/skillIcons.ts`.
      Skills with no logo (SQL, Boto3, REST APIs) stay as text. On desktop
      each group sits in its own bordered panel (AWS full width on top, the
      rest two to a row with matching heights); phones keep the plain list.
- [x] Mobile menu opens as an ivory sheet with a gold top edge over a
      dimmed page, closes on outside tap or Escape.
- [x] Contact form redirect is base aware, so a preview submission lands on
      the preview thank-you page. Thank-you page left out of the sitemap.
- [x] ALX certificates (Cloud Practitioner, August 2025; Professional
      Foundations, June 2025) shown as images with Verify links. Every
      certification tile now has real artwork.
- [x] References section removed from Home (2026-10-06), with its data file.
- [x] Strict CSP ready: every script ships as a file (no inline scripts except
      the hashed no-js line), and `scripts/qa.mjs` fails on any new inline
      script. OIDC trust policy in `docs/deployment.md` corrected to the
      `environment:production` subject the deploy job actually presents.
- [x] Step-by-step go-live guide for Ismail: `go-live-guide.md` in the
      project folder.
- [x] Share card (`public/og-image.jpg`, 27KB) redesigned around the logo,
      centred, because WhatsApp crops link previews to a centre square.
      Name and role sit under the mark; no photo.
- [x] Cloud Chariots role is a full position, not an internship (confirmed
      by his manager, 2026-10-06). Title is "Cloud / DevOps Engineer".
- [x] Plain-language finish list for Ismail in the project folder:
      `finish-checklist.md`.
- Headshot without the sash was tried and rolled back (2026-10-06): the
  edited area looked rough, so Ismail chose the original photo with the
  sash. Do not swap it again unless he sends a new photo.
- [x] Recoloured to harbour navy, blue and amber (2026-10-06). Three
      options were compared with WCAG contrast scores and Ismail picked
      navy. Tokens renamed to neutral names (`--brand-*`, `--highlight`,
      `--accent-text`, `--paper`). Logo SVGs, favicon set, app icons, manifest,
      theme colour and share card all regenerated. Headshot switched to the
      grey-backdrop version so the green photo background does not clash.

## In progress

- LIVE on 2026-10-07. ismailoyeleke.com and www.ismailoyeleke.com serve the new
  site from distribution `E2BH4ZWLFJV2MA` (`dwhxjqyi603va.cloudfront.net`, Free
  plan, private bucket `ismailoyeleke-com-site` via OAC, clean-urls function,
  managed SecurityHeadersPolicy, CSP as a meta tag, TLSv1.2_2021), certificate
  `1d9649e6...` covering both names. Route 53 has A and AAAA aliases for the apex
  and www. Deploys run from main via GitHub OIDC; the role trust sub is
  `repo:ISMAIL-OYELEKE@98213704/portfolio@1407159421:environment:production`
  (GitHub now includes owner and repo IDs). Default branch is main.
  The old distribution `E1AMGG14CCOU14` (no domain names now), old bucket
  `ismailoyeleke.com` and old certificate `4fc97a3a...` are kept as a fallback;
  retire them only with Ismail's go-ahead. The contact form on the live site
  works: Ismail got the Web3Forms email and the /thank-you page on 2026-10-07.
  WAF switched to blocking. GA4 live (`G-96WC89XFFM` as repo variable
  `PUBLIC_GA_ID`, confirmed in Realtime after consent). Search Console verified (TXT record in Route 53, keep
  it) with sitemap-index.xml submitted; Bing imported from GSC with the sitemap
  submitted. Lighthouse on the production build (2026-10-07, local, because the
  PageSpeed API quota was used up): Home, About, Projects, Contact score 97-99
  performance on mobile and 100 on desktop, 100 accessibility, best practices
  and SEO.

- Pull request #1 merged into main (2026-10-07).

## Waiting on Ismail

1. Done 2026-10-07: PR #1 merged and default branch set to `main`.
2. Done 2026-10-07: Web3Forms key saved as secret `PUBLIC_WEB3FORMS_KEY`.
3. Done 2026-10-07: GA4 ID saved as repository variable `PUBLIC_GA_ID`.
4. Done 2026-10-07: AWS setup and the production environment secrets.
5. Optionally the Project 1 architecture diagram as an image.

## Next steps, in order

1-4. Done 2026-10-07: merged, deployed, live on apex and www, form tested.
4b-5. Done 2026-10-07: WAF blocking; GA4 live after consent.
6-7. Done 2026-10-07: Search Console and Bing set up; Lighthouse 97+ everywhere.
8. Business email: not needed for now (Ismail, 2026-10-07).
9. Retire the old site around 2026-10-14, only with Ismail's go-ahead.
   Nothing gets deleted before then.
10. Writing page: Medium posts now flow in automatically. Each build reads
    the Medium feed. The Deploy workflow also runs every six hours (00:17,
    06:17, 12:17, 18:17 UTC). On 2026-10-08, GitHub never ran the first
    scheduled 06:00 run, so the schedule moved off the hour and runs more often.
11. Live chat: WhatsApp only, no widget (Ismail, 2026-10-07).
12. Architecture diagrams (official AWS icons) for the four AWS case studies,
    in `public/diagrams/<slug>.svg` and shown on each case study page under
    "The problem", linked full size. All four approved by Ismail on
    2026-10-07.
13. Diagrams for the Enterprise staff portal and the Amazon Connect contact
    centre drafted (staff portal region and routes from its app.js). Approved by
    Ismail on 2026-10-07.
14. 2026-10-08, approved by Ismail from screenshots:
    - Headshot has no shape: a transparent cutout on the page colour, with
      the cropped shoulders faded at the sides and bottom.
    - Homepage heading split in two: the title, then "I build secure,
      automated infrastructure that ships to production." smaller in amber.
      On phones the hero copy and buttons are centred under the photo.
    - Certifications count comes from certifications.ts everywhere. Keep the
      count-up animation: Ismail likes it. A "14" a reviewer saw was a
      mid-animation screenshot, not a data error.
    - Staff portal case study says "reduces always-on compute costs" instead
      of claiming no cost when idle.
    - cloud-chariots-portal PR #3 adds a README: frontend only, backend lives
      in the company's AWS account (Ismail no longer has access).
15. 2026-10-08: the four headline certification cards (Certifications page)
    centre their badge, text and link. The other badge groups stay
    left-aligned. Approved by Ismail from screenshots.
16. 2026-10-08: case study header (every project page) is centred: crumbs,
    title and summary, then one strip with When, Context and Role in three
    equal columns (rows on phones), then the stack tags and the links.
    Ismail picked this (option C) over a side card and a left-aligned strip.

## Open questions


## How to run, preview and deploy

Local (needs Node 22+):

```bash
npm ci
npm run dev            # http://localhost:4321
npm run build          # writes dist/
node scripts/qa.mjs    # quality checks on dist/
npm run check          # type and Astro diagnostics
```

Optional `.env` (copy `.env.example`): `PUBLIC_WEB3FORMS_KEY`, `PUBLIC_GA_ID`.

Preview: every push to a `claude/**` branch (not `main`, which goes live) runs
`.github/workflows/preview.yml`, which builds with `BASE_PATH=/portfolio` and
`PUBLIC_NOINDEX=true`, prefixes links with `scripts/apply-base.mjs`, and
publishes to https://ismail-oyeleke.github.io/portfolio/. The preview is never
indexed (robots `Disallow: /` and a noindex meta tag).

Production: every push to `main` runs `.github/workflows/deploy.yml`. It
builds, runs QA, assumes the AWS role through OIDC, syncs to S3 (hashed assets
cached for a year, HTML not cached) and invalidates CloudFront. Rollback is
reverting the commit on `main`. Full details in `docs/deployment.md`.
