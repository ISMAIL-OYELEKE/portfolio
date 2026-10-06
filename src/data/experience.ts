export type Role = {
  title: string;
  company: string;
  companyUrl?: string;
  companyLine: string;
  mode: string;
  period: string;
  startISO: string;
  endISO: string;
  did: string[];
  shipped?: string[];
  tools: string[];
};

export const roles: Role[] = [
  {
    title: 'Cloud / DevOps Engineer (Internship)',
    company: 'Cloud Chariots',
    companyUrl: 'https://cloudchariotsservices.com/',
    companyLine:
      'An AWS Partner delivering cloud solutions, app development, startup enablement and talent development across Africa.',
    mode: 'Hybrid, Lagos, Nigeria',
    period: 'May 2026 to August 2026',
    startISO: '2026-05',
    endISO: '2026-08',
    did: [
      'Built and maintained CI/CD pipelines in Jenkins, GitHub Actions and GitLab CI covering build, test and deploy, which cut the manual work in a release and made deployments repeatable.',
      'Provisioned AWS infrastructure as code in Terraform and CloudFormation, so environments could be rebuilt from version control instead of from memory.',
      'Containerised application workloads and ran them on Amazon ECS, EKS and Fargate under a high-availability design with no single point of failure.',
      'Set up CloudWatch monitoring and observability, so production incidents were caught early and resolved faster.',
      'Brought automation, infrastructure as code and observability into how the engineering teams ship.',
    ],
    shipped: [
      'The Enterprise Staff Portal: a serverless leave and payroll-advance approval system on Lambda, API Gateway, DynamoDB, SES and EventBridge.',
      'An Amazon Connect contact centre for ThinkFinance MFB, with voice and web chat routing, Lagos business-hours logic, Polly greetings and a domain-whitelisted chat widget.',
    ],
    tools: [
      'Jenkins',
      'GitHub Actions',
      'GitLab CI',
      'Terraform',
      'CloudFormation',
      'Docker',
      'ECS',
      'EKS',
      'Fargate',
      'CloudWatch',
    ],
  },
  {
    title: 'Backend Developer (Intern)',
    company: 'KGE Technologies',
    companyUrl: 'https://www.kgetechnologies.com/',
    companyLine: 'A software company based in Chennai, India.',
    mode: 'Remote',
    period: 'July 2025 to December 2025',
    startISO: '2025-07',
    endISO: '2025-12',
    did: [
      'Built REST APIs in ASP.NET Core, tuned for backend performance and data retrieval.',
      'Implemented JWT authentication and authorisation, enforcing access control on protected endpoints.',
      'Optimised Entity Framework Core queries, cutting query latency and improving response times.',
      'Worked in an Agile team with Git, keeping code integrity through to release.',
    ],
    tools: ['C#', 'ASP.NET Core', 'EF Core', 'SQL', 'LINQ', 'JWT', 'Git'],
  },
  {
    title: 'IT Support Specialist (Intern)',
    company: 'Federal Airports Authority of Nigeria',
    companyUrl: 'https://faan.gov.ng/',
    companyLine: 'The government agency that runs Nigeria’s federal airports.',
    mode: 'On site, Lagos, Nigeria',
    period: 'September 2023 to February 2024',
    startISO: '2023-09',
    endISO: '2024-02',
    did: [
      'Maintained the hardware and network infrastructure airport operations depend on, keeping downtime to a minimum.',
      'Resolved incidents and configuration issues affecting staff systems.',
      'Carried out routine maintenance and network troubleshooting to keep the environment stable and secure.',
    ],
    tools: ['Hardware support', 'Network troubleshooting', 'Windows', 'Linux', 'LAN/WAN'],
  },
];

export const education = {
  degree: 'BSc Computer Science',
  school: 'Kwara State University (KWASU), Malete',
  graduated: 'September 2024',
  result: 'First Class Honours, CGPA 3.85 of 4.00',
  research: 'Detection of skin cancer using a residual network (ResNet).',
};

export const community = {
  founded: {
    name: 'CloudUp Community',
    role: 'Founder',
    period: 'October 2025 to now',
    detail: 'A community of around 30 people learning cloud together.',
    href: 'https://chat.whatsapp.com/H07EWvg8roB0ci5YsvWWwa',
  },
  memberships: ['AWS Nigeria User Group', 'NACOS', 'GDSC KWASU'],
};

export const values = [
  {
    title: 'Secure by default',
    body: 'Least privilege, no hardcoded secrets, private subnets and row-level security, from the first commit rather than the review before launch.',
  },
  {
    title: 'Automate everything',
    body: 'Infrastructure as code and pipelines over console clicks, so an environment can be rebuilt and a deploy can be repeated.',
  },
  {
    title: 'Cost aware',
    body: 'Serverless and pay-per-use where the traffic suits it. An idle system should cost close to nothing.',
  },
  {
    title: 'Observable',
    body: 'If it is not monitored, it is not done. Logs and metrics are part of the build, not a follow-up ticket.',
  },
  {
    title: 'Document and share',
    body: 'Every build gets a write-up, a recording or both, on GitHub, YouTube and Medium.',
  },
];

export const remember = [
  'AWS Certified Solutions Architect, Associate, plus KCNA, with 23 verified certifications and badges.',
  'Real AWS delivery at an AWS Partner: serverless applications, Amazon Connect, infrastructure as code, CI/CD and containers.',
  'Ships to production: client systems are live and used daily.',
  'Security first by habit: least-privilege IAM, Secrets Manager, private subnets, strict CSP, row-level security.',
  'A First Class Computer Science graduate who documents and teaches, through YouTube, Medium and CloudUp.',
];

export const story = [
  'I started in IT support at the Federal Airports Authority of Nigeria, keeping hardware and networks running for airport operations. That is where I learned that systems people depend on have to stay up, and how much stops when they do not.',
  'I graduated with a First Class BSc in Computer Science from Kwara State University, then built backend APIs as a developer intern. I kept wanting to own the whole path from code to production, so I moved into cloud. I earned the AWS Solutions Architect, Associate and the Kubernetes and Cloud Native Associate, and documented each AWS build on YouTube and GitHub.',
  'At Cloud Chariots, an AWS Partner, I worked as a Cloud and DevOps Engineer on CI/CD pipelines, infrastructure as code with Terraform and CloudFormation, containers on ECS, EKS and Fargate, and CloudWatch observability. I also helped build a serverless staff portal and an Amazon Connect contact centre for a microfinance bank.',
  'Alongside that, I build and maintain production software for businesses in Lagos, including a point of sale system a gadget shop runs on every day. I also founded CloudUp, a community of about 30 people learning cloud together.',
];
