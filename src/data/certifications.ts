import type { ImageMetadata } from 'astro';

/*
 * Badge artwork lives in src/assets/badges, named by Credly badge id (or by
 * the Coursera certificate code), and is optimised at build time. The files
 * are the issuers' own badge images, downloaded once from Credly and
 * Coursera; nothing is hotlinked.
 */
const artwork = import.meta.glob<{ default: ImageMetadata }>('../assets/badges/*.{png,jpg}', {
  eager: true,
});
const art = (name: string): ImageMetadata | undefined =>
  Object.entries(artwork).find(([path]) => path.split('/').pop()?.startsWith(name))?.[1].default;

const credly = (id: string) => `https://www.credly.com/badges/${id}/public_url`;

export type Cert = {
  name: string;
  issuer: string;
  issued?: string;
  expires?: string;
  verify: string;
  /** The issuer's badge or certificate image, when one exists. */
  image?: ImageMetadata;
  /** 'certificate' artwork is landscape; badges are square. */
  imageShape?: 'badge' | 'certificate';
};

/** The four that lead: certifications rather than course badges. */
export const headlineCerts: Cert[] = [
  {
    name: 'AWS Certified Solutions Architect, Associate',
    issuer: 'Amazon Web Services',
    issued: 'November 2025',
    expires: 'November 2028',
    verify: credly('e096149f-4db9-42ea-b5b8-d05a45a7a63a'),
    image: art('e096149f-4db9-42ea-b5b8-d05a45a7a63a'),
  },
  {
    name: 'Kubernetes and Cloud Native Associate (KCNA)',
    issuer: 'The Linux Foundation',
    issued: 'July 2026',
    expires: 'July 2028',
    verify: credly('b8a9aa21-8ccf-4be5-afe5-10f83ad90dda'),
    image: art('b8a9aa21-8ccf-4be5-afe5-10f83ad90dda'),
  },
  {
    name: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    issued: '2025',
    verify: credly('cedcaae3-7094-49f8-8736-f49bd2dbbeaf'),
    image: art('cedcaae3-7094-49f8-8736-f49bd2dbbeaf'),
  },
  {
    name: 'Aviatrix Certified Engineer, Multicloud Network Associate',
    issuer: 'Aviatrix',
    issued: '2025',
    verify: credly('ba098e8b-a21e-41f4-aba3-a549ef50a541'),
    image: art('ba098e8b-a21e-41f4-aba3-a549ef50a541'),
  },
];

export const badgeGroups: { issuer: string; badges: Cert[] }[] = [
  {
    issuer: 'Amazon Web Services',
    badges: [
      {
        name: 'AWS Partner: Technical Accredited',
        issuer: 'AWS',
        issued: 'May 2026',
        verify: credly('e0c65759-44ba-4e10-a527-141699c4db67'),
        image: art('e0c65759-44ba-4e10-a527-141699c4db67'),
      },
      {
        name: 'AWS Educate: Getting Started with Serverless',
        issuer: 'AWS',
        issued: 'November 2025',
        verify: credly('58b2239e-95bf-4344-96fb-45e2e40b29e2'),
        image: art('58b2239e-95bf-4344-96fb-45e2e40b29e2'),
      },
      {
        name: 'AWS Educate: Getting Started with Cloud Ops',
        issuer: 'AWS',
        issued: 'November 2025',
        verify: credly('99428f31-fc3e-4b25-a042-6d3ba03a6b3a'),
        image: art('99428f31-fc3e-4b25-a042-6d3ba03a6b3a'),
      },
      {
        name: 'AWS Educate: Getting Started with Databases',
        issuer: 'AWS',
        issued: 'November 2025',
        verify: credly('0fed28b4-e15d-4a92-a608-54b955f7ffe7'),
        image: art('0fed28b4-e15d-4a92-a608-54b955f7ffe7'),
      },
      {
        name: 'AWS Educate: Getting Started with Networking',
        issuer: 'AWS',
        issued: 'November 2025',
        verify: credly('030b628e-4fd3-4457-a8a8-60b307a7c1f1'),
        image: art('030b628e-4fd3-4457-a8a8-60b307a7c1f1'),
      },
      {
        name: 'AWS Educate: Getting Started with Compute',
        issuer: 'AWS',
        issued: 'November 2025',
        verify: credly('6df781d8-5750-4117-b968-353ab0fd3793'),
        image: art('6df781d8-5750-4117-b968-353ab0fd3793'),
      },
      {
        name: 'AWS Educate: Getting Started with Security',
        issuer: 'AWS',
        verify: credly('f2aeb51d-0e77-4504-a0e3-0bb71adde0f8'),
        image: art('f2aeb51d-0e77-4504-a0e3-0bb71adde0f8'),
      },
      {
        name: 'AWS Educate: Getting Started with Storage',
        issuer: 'AWS',
        verify: credly('09c40adc-7b88-43e3-82df-252dc97e7ee8'),
        image: art('09c40adc-7b88-43e3-82df-252dc97e7ee8'),
      },
      {
        name: 'AWS Educate: Introduction to Cloud 101',
        issuer: 'AWS',
        verify: credly('b33f8399-0757-44e2-9367-7e28bd37aec8'),
        image: art('b33f8399-0757-44e2-9367-7e28bd37aec8'),
      },
    ],
  },
  {
    issuer: 'The Linux Foundation',
    badges: [
      {
        name: 'LFS250: Kubernetes and Cloud Native Essentials',
        issuer: 'The Linux Foundation',
        issued: 'June 2026',
        verify: credly('7e324575-6c82-41cf-804e-0daa97425ef8'),
        image: art('7e324575-6c82-41cf-804e-0daa97425ef8'),
      },
      {
        name: 'LFS158: Introduction to Kubernetes',
        issuer: 'The Linux Foundation',
        issued: 'May 2026',
        verify: credly('4bdac009-eb47-40dd-8d30-8e2f4e116ace'),
        image: art('4bdac009-eb47-40dd-8d30-8e2f4e116ace'),
      },
      {
        name: 'LFS101: Introduction to Linux',
        issuer: 'The Linux Foundation',
        issued: 'May 2026',
        verify: credly('a6ce68b9-b34c-402e-a26c-a472270c51fd'),
        image: art('a6ce68b9-b34c-402e-a26c-a472270c51fd'),
      },
    ],
  },
  {
    issuer: 'Coursera and IBM',
    badges: [
      {
        name: 'Linux Commands and Shell Scripting Essentials V2',
        issuer: 'Coursera',
        issued: 'March 2026',
        verify: credly('19102cb3-2ffd-46ed-a58f-f408387ad5ca'),
        image: art('19102cb3-2ffd-46ed-a58f-f408387ad5ca'),
      },
      {
        name: 'Git and GitHub Essentials',
        issuer: 'Coursera',
        issued: 'February 2026',
        verify: credly('d9c3ea24-1c73-4035-968c-b0413484ca82'),
        image: art('d9c3ea24-1c73-4035-968c-b0413484ca82'),
      },
      {
        name: 'DevOps Essentials',
        issuer: 'Coursera',
        issued: 'February 2026',
        verify: credly('b1962c80-8d52-41d8-99ea-ff65b35c31ab'),
        image: art('b1962c80-8d52-41d8-99ea-ff65b35c31ab'),
      },
    ],
  },
  {
    issuer: 'ALX Africa',
    badges: [
      {
        name: 'ALX Cloud Practitioner',
        issuer: 'ALX Africa',
        verify: 'https://savanna.alxafrica.com/certificates/RBXzYHGEx9',
        issued: 'August 2025',
        image: art('alx-RBXzYHGEx9'),
        imageShape: 'certificate',
      },
      {
        name: 'ALX Professional Foundations',
        issuer: 'ALX Africa',
        verify: 'https://savanna.alxafrica.com/certificates/zNRcC7pX3S',
        issued: 'June 2025',
        image: art('alx-zNRcC7pX3S'),
        imageShape: 'certificate',
      },
    ],
  },
  {
    issuer: 'DeepLearning.AI and Stanford',
    badges: [
      {
        name: 'Supervised Machine Learning: Regression and Classification',
        issuer: 'DeepLearning.AI',
        verify: 'https://www.coursera.org/account/accomplishments/verify/9ULFTVBYDUPZ',
        image: art('coursera-9ULFTVBYDUPZ'),
        imageShape: 'certificate',
      },
      {
        name: 'Advanced Learning Algorithms',
        issuer: 'DeepLearning.AI',
        verify: 'https://www.coursera.org/account/accomplishments/verify/URBKT4HOXOWY',
        image: art('coursera-URBKT4HOXOWY'),
        imageShape: 'certificate',
      },
    ],
  },
];

export const certCount =
  headlineCerts.length + badgeGroups.reduce((n, g) => n + g.badges.length, 0);
