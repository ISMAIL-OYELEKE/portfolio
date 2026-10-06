import { siGithub, siYoutube, siMedium, siCredly, siX, siGmail, siWhatsapp } from 'simple-icons';

export type Brand = {
  title: string;
  /** SVG path on a 24px grid, the company's own logo. */
  path: string;
  /** Official brand colour, without the #. */
  hex: string;
  /**
   * The colour the mark takes on the site's dark green. Brands whose
   * official colour is black or near black use ivory instead, which is
   * what their own guidelines ask for on dark backgrounds.
   */
  onDark: string;
};

const brand = (b: { title: string; path: string; hex: string }, onDark?: string): Brand => ({
  title: b.title,
  path: b.path,
  hex: b.hex,
  onDark: onDark ?? `#${b.hex}`,
});

export const brands: Record<string, Brand> = {
  // LinkedIn asked Simple Icons to remove its mark, so the "in" logo is
  // inlined from LinkedIn's published brand assets.
  linkedin: brand({
    title: 'LinkedIn',
    hex: '0A66C2',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  }, '#4f9fe6'),
  github: brand(siGithub, '#f7f5ee'),
  youtube: brand(siYoutube, '#ff4e45'),
  medium: brand(siMedium, '#f7f5ee'),
  credly: brand(siCredly),
  x: brand(siX, '#f7f5ee'),
  mail: brand(siGmail, '#f07467'),
  whatsapp: brand(siWhatsapp),
};

/** Inline custom properties for a link that wears a brand's colours. */
export const brandStyle = (name: string): string | undefined => {
  const b = brands[name];
  return b ? `--brand:#${b.hex};--brand-on-dark:${b.onDark}` : undefined;
};
