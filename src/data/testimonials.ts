/**
 * References.
 *
 * Nothing here is invented. A slot stays `pending` until the real quote
 * arrives; to publish one, fill in `quote`, `name`, `role` and `company`
 * and set `pending` to false. Never write a quote on someone's behalf.
 */
export type Reference = {
  slot: string;
  pending: boolean;
  quote?: string;
  name?: string;
  role?: string;
  company?: string;
};

export const references: Reference[] = [
  { slot: 'Mentor', pending: true },
  { slot: 'Former manager', pending: true },
];

export const referencesNote =
  'Written references are on the way. Until they are here, these slots stay empty rather than filled with words nobody said. Full references are available on request.';
