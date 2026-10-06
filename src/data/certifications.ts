const credly = (id: string) => `https://www.credly.com/badges/${id}/public_url`;

export type Cert = {
  name: string;
  issuer: string;
  issued?: string;
  expires?: string;
  verify: string;
};

/** The four that lead: certifications rather than course badges. */
export const headlineCerts: Cert[] = [
  {
    name: 'AWS Certified Solutions Architect, Associate',
    issuer: 'Amazon Web Services',
    issued: 'November 2025',
    expires: 'November 2028',
    verify: credly('e096149f-4db9-42ea-b5b8-d05a45a7a63a'),
  },
  {
    name: 'Kubernetes and Cloud Native Associate (KCNA)',
    issuer: 'The Linux Foundation',
    issued: 'July 2026',
    expires: 'July 2028',
    verify: credly('b8a9aa21-8ccf-4be5-afe5-10f83ad90dda'),
  },
  {
    name: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    issued: '2025',
    verify: credly('cedcaae3-7094-49f8-8736-f49bd2dbbeaf'),
  },
  {
    name: 'Aviatrix Certified Engineer, Multicloud Network Associate',
    issuer: 'Aviatrix',
    issued: '2025',
    verify: credly('ba098e8b-a21e-41f4-aba3-a549ef50a541'),
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
      },
      {
        name: 'AWS Educate: Getting Started with Serverless',
        issuer: 'AWS',
        issued: 'November 2025',
        verify: credly('58b2239e-95bf-4344-96fb-45e2e40b29e2'),
      },
      {
        name: 'AWS Educate: Getting Started with Cloud Ops',
        issuer: 'AWS',
        issued: 'November 2025',
        verify: credly('99428f31-fc3e-4b25-a042-6d3ba03a6b3a'),
      },
      {
        name: 'AWS Educate: Getting Started with Databases',
        issuer: 'AWS',
        issued: 'November 2025',
        verify: credly('0fed28b4-e15d-4a92-a608-54b955f7ffe7'),
      },
      {
        name: 'AWS Educate: Getting Started with Networking',
        issuer: 'AWS',
        issued: 'November 2025',
        verify: credly('030b628e-4fd3-4457-a8a8-60b307a7c1f1'),
      },
      {
        name: 'AWS Educate: Getting Started with Compute',
        issuer: 'AWS',
        issued: 'November 2025',
        verify: credly('6df781d8-5750-4117-b968-353ab0fd3793'),
      },
      {
        name: 'AWS Educate: Getting Started with Security',
        issuer: 'AWS',
        verify: credly('f2aeb51d-0e77-4504-a0e3-0bb71adde0f8'),
      },
      {
        name: 'AWS Educate: Getting Started with Storage',
        issuer: 'AWS',
        verify: credly('09c40adc-7b88-43e3-82df-252dc97e7ee8'),
      },
      {
        name: 'AWS Educate: Introduction to Cloud 101',
        issuer: 'AWS',
        verify: credly('b33f8399-0757-44e2-9367-7e28bd37aec8'),
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
      },
      {
        name: 'LFS158: Introduction to Kubernetes',
        issuer: 'The Linux Foundation',
        issued: 'May 2026',
        verify: credly('4bdac009-eb47-40dd-8d30-8e2f4e116ace'),
      },
      {
        name: 'LFS101: Introduction to Linux',
        issuer: 'The Linux Foundation',
        issued: 'May 2026',
        verify: credly('a6ce68b9-b34c-402e-a26c-a472270c51fd'),
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
      },
      {
        name: 'Git and GitHub Essentials',
        issuer: 'Coursera',
        issued: 'February 2026',
        verify: credly('d9c3ea24-1c73-4035-968c-b0413484ca82'),
      },
      {
        name: 'DevOps Essentials',
        issuer: 'Coursera',
        issued: 'February 2026',
        verify: credly('b1962c80-8d52-41d8-99ea-ff65b35c31ab'),
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
      },
      {
        name: 'ALX Professional Foundations',
        issuer: 'ALX Africa',
        verify: 'https://savanna.alxafrica.com/certificates/zNRcC7pX3S',
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
      },
      {
        name: 'Advanced Learning Algorithms',
        issuer: 'DeepLearning.AI',
        verify: 'https://www.coursera.org/account/accomplishments/verify/URBKT4HOXOWY',
      },
    ],
  },
];

export const certCount =
  headlineCerts.length + badgeGroups.reduce((n, g) => n + g.badges.length, 0);
