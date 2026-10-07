# ismailoyeleke.com

> Picking this project up in a new chat? Start with [PROGRESS.md](PROGRESS.md).

The personal site of Ismail Oyeleke, Cloud and DevOps Engineer in Lagos, Nigeria.

Built with [Astro](https://astro.build), shipped as static files to Amazon S3 and
served through CloudFront.

## Running it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # writes dist/
npm run preview  # serves the built site
npm run check    # TypeScript and Astro diagnostics
node scripts/qa.mjs   # quality checks against dist/
```

Copy `.env.example` to `.env` and fill it in if you want the contact form or
analytics working locally. Neither is required to run the site.

## Where things live

```
src/
  data/           Everything the site says that is not layout
    site.ts         Name, role, contact details, navigation, stats
    projects.ts     Every project and its case study
    experience.ts   Roles, education, values, the About story
    certifications.ts  All 23 certifications and badges, with verify links
    skills.ts       Skill groups
  components/     Header, footer, cards, the contact form, consent banner
  layouts/        Base (head, schema, consent), Legal (privacy and terms)
  pages/          One file per route; projects/[slug] builds a case study each
  styles/global.css  Design tokens and the shared rules
public/           Favicons, the CV, the og image, self-hosted video
scripts/qa.mjs    Build-time quality checks
docs/deployment.md  The AWS and GitHub setup, step by step
```

**To change content, edit a file in `src/data`.** Adding a project to
`projects.ts` creates its case study page, its card on the home page and its
sitemap entry. Nothing else needs touching.

## Design

The palette and type come from the brand guidelines: deep emerald surfaces, gold
as an accent only, ivory for the light sections. Headings are Fraunces, body text
is Sora, and labels are JetBrains Mono, all self-hosted.

Gold is never used for body text on a light background, where it fails contrast.
`--gold-text` (`#7d6013`) is used there instead. Every colour pair on the site
clears WCAG AA.

## What the quality checks cover

`scripts/qa.mjs` runs on every pull request and before every deploy. It fails the
build on a broken internal link, a missing or duplicated title or description, a
missing canonical or og:image, a missing or repeated `h1`, an image with no alt
text, a referenced asset that is not in the build, or an em dash in the copy.

Accessibility, responsiveness and performance are checked with Lighthouse and
PageSpeed before a release rather than in CI.

## Deployment

Merging to `main` builds the site and deploys it. See
[docs/deployment.md](docs/deployment.md) for the AWS setup, the IAM role, the
OIDC trust policy, the security headers and the Search Console steps.

No AWS access key is stored in this repository. The workflow assumes a role
through GitHub's OIDC provider, scoped to pushes on `main` in this repository.
