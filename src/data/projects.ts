export type Project = {
  slug: string;
  title: string;
  kind: 'cloud' | 'freelance';
  date: string;
  dateISO: string;
  context: string;
  summary: string;
  problem: string;
  stack: string[];
  featured?: boolean;
  repo?: string;
  video?: string;
  live?: string;
  build: { heading: string; points: string[] }[];
  decisions?: { title: string; body: string }[];
  result?: string[];
  lessons?: string[];
  note?: string;
  metaTitle?: string;
  metaDescription?: string;
  media?: { type: 'image' | 'video'; src: string; poster?: string; alt: string; caption?: string }[];
  /** Architecture diagram in public/diagrams, named after the slug. */
  diagram?: { width: number; height: number; alt: string };
};

export const projects: Project[] = [
  {
    slug: 'enterprise-staff-portal',
    title: 'Enterprise Staff Portal',
    kind: 'cloud',
    date: 'July 2026',
    dateISO: '2026-07',
    context: 'Built at Cloud Chariots, an AWS Partner',
    summary:
      'A serverless leave and payroll-advance approval system on Lambda and API Gateway, with DynamoDB-backed notifications and scheduled SES email.',
    problem:
      'Leave requests and payroll-advance approvals ran on manual back and forth between staff, managers and finance. Nothing was tracked, so nobody could say where a request was or who was holding it up.',
    stack: ['AWS Lambda', 'API Gateway', 'DynamoDB', 'Amazon SES', 'EventBridge', 'IAM'],
    featured: true,
    repo: 'https://github.com/ISMAIL-OYELEKE/cloud-chariots-portal',
    build: [
      {
        heading: 'Serverless application tier',
        points: [
          'A decoupled application on AWS Lambda behind API Gateway, so the portal costs nothing when nobody is using it and scales on its own when everyone requests leave in the same week.',
          'DynamoDB holds request state, sessions and the notification feed, read back in real time by the portal.',
        ],
      },
      {
        heading: 'Workflow automation',
        points: [
          'Amazon SES sends transactional status email as a request moves through approval.',
          'EventBridge schedules drive reminders and status digests rather than a polling loop.',
        ],
      },
      {
        heading: 'Access control',
        points: [
          'Role-based access control separates staff, managers and admin operations.',
          'Input validation gates sit in front of every admin workflow, so unauthorised submissions are rejected before they reach the data layer.',
        ],
      },
    ],
    decisions: [
      {
        title: 'Serverless over a always-on server',
        body: 'Approval traffic is bursty and internal. Pay-per-use removes idle cost and the patching work that comes with instances.',
      },
      {
        title: 'Events over polling',
        body: 'EventBridge schedules the reminder work, so the system does nothing between events rather than running a cron host.',
      },
    ],
    result: [
      'Leave and payroll-advance approvals run as a tracked workflow with an audit trail instead of email threads.',
      'No servers to patch, and no cost while the portal is idle.',
    ],
  },
  {
    slug: 'portfolio-on-s3-cloudfront-route-53',
    diagram: {
      width: 1720,
      height: 1170,
      alt: 'Architecture diagram: visitors resolve ismailoyeleke.com in Route 53 and reach CloudFront, protected by AWS WAF with an ACM certificate, which reads from a private S3 bucket through Origin Access Control. GitHub Actions deploys through an IAM role assumed with OIDC.',
    },
    title: 'This Portfolio: Static Hosting on S3, CloudFront and Route 53',
    kind: 'cloud',
    date: 'December 2025',
    dateISO: '2025-12',
    context: 'Project 1, my first AWS build, still serving ismailoyeleke.com',
    summary:
      'The site you are reading started here: S3 for the files, CloudFront for HTTPS and edge caching, an ACM certificate, and a domain I registered and run in Route 53.',
    problem:
      'I needed a portfolio of my own that was fast anywhere, served over HTTPS on a real domain, and cost almost nothing to run. A portfolio does not need a server, so I built it without one.',
    stack: ['Amazon S3', 'CloudFront', 'Route 53', 'AWS Certificate Manager'],
    featured: true,
    repo: 'https://github.com/ISMAIL-OYELEKE/Project-1-Static-Website-Hosting-Host-a-website-on-S3-with-Route-53-CloudFront',
    live: 'https://ismailoyeleke.com',
    video: 'https://www.youtube.com/watch?v=XOSVDGpVcy8',
    metaTitle: 'This Portfolio on S3, CloudFront and Route 53',
    metaDescription:
      'Project 1: how Ismail Oyeleke hosts this portfolio on S3, CloudFront, ACM and Route 53, and how version two moved it to a private bucket with CI/CD.',
    build: [
      {
        heading: 'Storage',
        points: [
          'An S3 bucket named after the domain, in us-east-1, with static website hosting switched on and index.html as the index document.',
          'The HTML, CSS and JavaScript uploaded to the bucket, with a bucket policy allowing public read of the site files.',
        ],
      },
      {
        heading: 'Domain and DNS',
        points: [
          'ismailoyeleke.com registered through Route 53, with a public hosted zone to manage its records.',
          'An A record set as an alias to the CloudFront distribution, so the apex domain resolves without a fixed IP address.',
        ],
      },
      {
        heading: 'Delivery and HTTPS',
        points: [
          'A CloudFront distribution in front of the bucket, with the domain as an alternate name and HTTP redirected to HTTPS.',
          'A public certificate from AWS Certificate Manager, validated through DNS in Route 53 and attached to the distribution.',
        ],
      },
    ],
    decisions: [
      {
        title: 'No server at all',
        body: 'S3 and CloudFront serve static files without an instance to patch, scale or pay for while idle. The monthly bill is cents plus the domain.',
      },
      {
        title: 'CloudFront in front of S3, not the bucket alone',
        body: 'An S3 website endpoint cannot serve HTTPS on a custom domain. CloudFront adds the certificate, enforces HTTPS and caches the site close to visitors outside the region.',
      },
      {
        title: 'Keep the domain and DNS in AWS',
        body: 'With the domain registered in Route 53, the certificate validates through a DNS record in the same account, and the alias record can point straight at CloudFront.',
      },
    ],
    result: [
      'ismailoyeleke.com served over HTTPS from CloudFront, with no server to run.',
      'Every page cached at the edge, so the site loads quickly from Lagos and from abroad.',
      'The setup is documented step by step in the repository and on YouTube.',
    ],
    lessons: [
      'Edits to index.html did not appear until I invalidated the CloudFront cache, so an invalidation is part of every deploy, not an afterthought.',
      'DNS changes take time to propagate. The fix was to check the records once and wait, not to keep changing them.',
      'A custom domain on HTTPS needs a validated certificate first. DNS validation through Route 53 made that a single record.',
    ],
    note: 'This rebuild is version two of the same project. The bucket is now private behind Origin Access Control, security headers come from CloudFront, and every change deploys from GitHub Actions through an OIDC role instead of a manual upload.',
  },
  {
    slug: 'cloud-contact-center',
    title: 'Cloud Contact Centre for ThinkFinance MFB',
    kind: 'cloud',
    date: 'June 2026',
    dateISO: '2026-06',
    context: 'Client project delivered through Cloud Chariots',
    summary:
      'An omnichannel Amazon Connect contact centre with voice and web chat, Lagos business-hours routing and a domain-whitelisted chat widget.',
    problem:
      'A microfinance bank needed voice and web chat support that follows Lagos business hours, answers properly out of hours, and only runs on its own website.',
    stack: ['Amazon Connect', 'Amazon Polly', 'Web Chat', 'JavaScript', 'IAM'],
    featured: true,
    build: [
      {
        heading: 'Routing',
        points: [
          'Inbound contact flows branch on Africa/Lagos business hours, so after-hours callers get a clear message rather than an unanswered queue.',
          'Amazon Polly speaks the greetings and the out-of-hours message, so the bank can change wording without re-recording audio.',
          'Agent queues and routing profiles in the Contact Control Panel put each customer with an agent who can actually help.',
        ],
      },
      {
        heading: 'Web chat widget',
        points: [
          'A styled chat widget embedded in the bank site, integrated through client-side JavaScript.',
          'Domain whitelisting restricts which origins can open a chat session, so the widget cannot be lifted and run from somewhere else.',
        ],
      },
    ],
    decisions: [
      {
        title: 'Managed contact centre over self-hosted telephony',
        body: 'Amazon Connect removes the telephony estate entirely and bills per minute, which suits a bank growing its support desk.',
      },
    ],
    result: [
      'Voice and web chat run as one queue with a single set of routing rules.',
      'Out-of-hours contacts get a correct answer instead of ringing out.',
    ],
    note: 'Client work, so the configuration and recordings stay private. This write-up describes the delivered design.',
  },
  {
    slug: 'serverless-ai-recruiter-assistant',
    diagram: {
      width: 1720,
      height: 840,
      alt: 'Architecture diagram: a recruiter chats through a Kommunicate widget, which sends messages to an Amazon Lex V2 bot. Lex calls a Python Lambda function for the answer, under least-privilege IAM roles, and each turn is logged in CloudWatch.',
    },
    title: 'Serverless AI Recruiter Assistant',
    kind: 'cloud',
    date: 'February 2026',
    dateISO: '2026-02',
    context: 'Personal project',
    summary:
      'An Amazon Lex V2 chatbot with a Python Lambda fulfilment handler that answers recruiter questions about my work, inside the AWS Free Tier.',
    problem:
      'A static portfolio makes a recruiter hunt for answers. They want to ask directly: do you know AWS, what have you built, can I see the projects.',
    stack: ['Amazon Lex V2', 'AWS Lambda', 'Python 3.9', 'IAM', 'CloudWatch'],
    featured: true,
    repo: 'https://github.com/ISMAIL-OYELEKE/Project-4-Serverless-Chatbot-Build-an-AI-powered-chatbot-with-AWS-Lex-Lambda',
    video: 'https://www.youtube.com/watch?v=1r-oNw4T_lU',
    build: [
      {
        heading: 'Conversation design',
        points: [
          'A Lex V2 bot with six intents covering greetings, skills, projects, certifications, contact and a fallback.',
          'A Python 3.9 Lambda handler returns the fulfilment response for each recognised intent.',
        ],
      },
      {
        heading: 'Operations',
        points: [
          'Least-privilege IAM between Lex, Lambda and logs.',
          'CloudWatch logs carry the intent and confidence of each turn, which is how both bugs below were found.',
        ],
      },
    ],
    lessons: [
      'A silent welcome: the bot opened with nothing until an onInit trigger fired the greeting intent on session start.',
      'Natural language confusion between similar questions, fixed by raising the NLU confidence threshold to 0.70 and writing a real fallback response.',
    ],
    result: ['Runs inside the AWS Free Tier, with no server to keep warm.'],
  },
  {
    slug: 'highly-available-multi-tier-web-application',
    diagram: {
      width: 1720,
      height: 1460,
      alt: 'Architecture diagram: users reach an Application Load Balancer through the internet gateway. It sends traffic to EC2 web servers in private subnets across two Availability Zones in an Auto Scaling group, which read credentials from Secrets Manager and query RDS MySQL in private database subnets.',
    },
    title: 'Highly Available Multi-Tier Web Application on AWS',
    metaTitle: 'Multi-Tier Web Application on AWS',
    kind: 'cloud',
    date: 'January 2026',
    dateISO: '2026-01',
    context: 'Personal project',
    summary:
      'A single-server PHP and MySQL application re-architected into three tiers across two Availability Zones, with private subnets, Secrets Manager and auto scaling.',
    problem:
      'A single-server application is one failure away from an outage, and it keeps its database credentials and its database on the same public box.',
    stack: ['Amazon VPC', 'EC2', 'RDS MySQL', 'Application Load Balancer', 'Auto Scaling', 'Secrets Manager', 'Systems Manager'],
    featured: true,
    repo: 'https://github.com/ISMAIL-OYELEKE/Project-3-Enterprise-Multi-Tier-Web-App-Deployment',
    video: 'https://www.youtube.com/watch?v=Q7ZUihGmsmU',
    build: [
      {
        heading: 'Network',
        points: [
          'A custom VPC on 10.0.0.0/16 spanning two Availability Zones.',
          'Public subnets carry only the load balancer and NAT. The web and data tiers sit in private subnets with no inbound route from the internet.',
          'Security groups chain rather than open: the load balancer reaches the web tier, and only the web tier reaches the database.',
        ],
      },
      {
        heading: 'Application tier',
        points: [
          'EC2 User Data bootstraps the LAMP stack and the application on first boot, so an instance joins the fleet with no manual step.',
          'The load balancer health check hits /health.html, so a half-booted instance never takes traffic.',
          'An Auto Scaling group with CPU target tracking adds and removes instances without intervention.',
        ],
      },
      {
        heading: 'Data and access',
        points: [
          'RDS MySQL in isolated subnets, with credentials held in AWS Secrets Manager instead of a config file.',
          'Administrative access runs through SSM Session Manager, so there is no SSH port and no key material to lose.',
        ],
      },
    ],
    decisions: [
      {
        title: 'Session Manager instead of a bastion host',
        body: 'It removes an internet-facing instance, the SSH port and the key rotation problem, and every session is logged.',
      },
      {
        title: 'Secrets Manager instead of environment files',
        body: 'The credential never lands in the AMI, the repository or the User Data script.',
      },
    ],
    result: [
      'Losing an instance, or an entire Availability Zone, no longer takes the application down.',
      'The database is unreachable from the internet, and no credential is stored on disk.',
    ],
  },
  {
    slug: 'wordpress-on-lightsail',
    diagram: {
      width: 1720,
      height: 900,
      alt: 'Architecture diagram: readers reach a Lightsail instance through its static IP over HTTPS. The instance runs Bitnami WordPress with Apache, PHP and MySQL, and a Let’s Encrypt certificate. Lightsail takes daily snapshots.',
    },
    title: 'WordPress on AWS Lightsail',
    kind: 'cloud',
    date: 'December 2025',
    dateISO: '2025-12-01',
    context: 'Personal project',
    summary:
      'A WordPress blog on a Lightsail instance with a static IP, a Let’s Encrypt certificate and automatic daily snapshots, for five dollars a month.',
    problem:
      'A content site needs a predictable monthly bill, HTTPS and a backup story, without an EC2 and RDS build behind it.',
    stack: ['AWS Lightsail', 'Bitnami', 'Linux', 'Let’s Encrypt'],
    repo: 'https://github.com/ISMAIL-OYELEKE/Project-2-WordPress-on-AWS-Lightsail-Deploying-a-WordPress-blog-on-AWS-Lightsail',
    video: 'https://www.youtube.com/watch?v=bGjOyoxUrqg',
    build: [
      {
        heading: 'Instance and hardening',
        points: [
          'A Bitnami WordPress blueprint on the five dollar plan.',
          'A static IP attached, so the address survives a reboot.',
          'HTTPS issued with the Bitnami bncert tool and renewed automatically.',
          'Automatic daily snapshots for recovery.',
        ],
      },
    ],
    lessons: [
      'The Bitnami application password lives on the instance and is read over SSH, not set in the console.',
      'A Lightsail public IP changes on reboot until a static IP is attached, which is what broke the first DNS record.',
    ],
  },

  /* ---------------- freelance software engineering ---------------- */
  {
    slug: 'cloud-dimex-website',
    title: 'Cloud Dimex marketing site',
    kind: 'freelance',
    date: 'October 2026',
    dateISO: '2026-10-05',
    context: 'Cloud Dimex LTD, an AWS consulting company in Lagos',
    summary:
      'A thirteen-page marketing site shipped with a build-time Content Security Policy, consent-gated analytics and automated QA, scoring 100 for accessibility, best practices and SEO.',
    metaDescription:
      'A thirteen-page marketing site for an AWS consultancy, with a build-time Content Security Policy, consent-gated analytics and automated QA.',
    problem:
      'A cloud consultancy is judged on its own site. It had to load fast, pass a security review, and collect enquiries without leaking anything.',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'Three.js', 'Vercel', 'Web3Forms', 'hCaptcha', 'GA4'],
    featured: true,
    live: 'https://clouddimex.com',
    build: [
      {
        heading: 'Security',
        points: [
          'A Content Security Policy generated at build time with SHA-256 hashes for inline scripts and no unsafe-inline, plus a per-build nonce so the live-chat widget runs under the policy rather than around it.',
          'HSTS preload and a full set of security response headers.',
          'The contact form combines hCaptcha, a honeypot field and validation on both the client and the server.',
        ],
      },
      {
        heading: 'Privacy and compliance',
        points: [
          'Google Analytics only loads after the visitor accepts cookies.',
          'A privacy policy written against the Nigeria Data Protection Act 2023.',
        ],
      },
      {
        heading: 'Quality',
        points: [
          'Lighthouse mobile: 100 for accessibility, best practices and SEO on every page tested.',
          'WCAG AA contrast verified across all twenty colour pairs, and no horizontal overflow from 360px to 1440px.',
          'Playwright scripts check links, the CSP, the form, overflow and page metadata on every run.',
          'Search Console and Bing Webmaster Tools set up and the sitemap submitted.',
        ],
      },
    ],
    result: [
      'Thirteen indexable pages live on a static export, indexed and monitored.',
      'Enquiries arrive through a form that is validated, rate-limited by captcha and free of unsafe-inline script.',
    ],
    media: [
      {
        type: 'video',
        src: '/media/cloud-dimex-demo.mp4',
        poster: '/media/cloud-dimex-poster.jpg',
        alt: 'A short walkthrough of the Cloud Dimex site',
        caption: 'A short walkthrough: the hero, the services menu, the migration flow and the thank-you page.',
      },
    ],
  },
  {
    slug: 'cerbiol-gadgets-pos',
    title: 'Cerbiol Gadgets point of sale',
    kind: 'freelance',
    date: 'Live in production',
    dateISO: '2026-10',
    context: 'Cerbiol International Co Ltd, a phone and gadget retailer in Nigeria',
    summary:
      'A point of sale and inventory system the shop runs on every day, with per-device IMEI tracking, part payments, invoices, debt follow-up and an audit log.',
    problem:
      'The shop tracked stock, part payments and debts on paper. Devices are individually identifiable by IMEI, so quantity-based inventory could not say which handset was sold to whom, and no record showed who changed what.',
    stack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Supabase',
      'PostgreSQL',
      'Row-level security',
      'Tailwind CSS v4',
      'Vercel',
    ],
    featured: true,
    live: undefined,
    build: [
      {
        heading: 'What the shop uses it for',
        points: [
          'Devices are tracked one by one by IMEI or serial number; accessories are tracked by quantity.',
          'A sale takes full or part payment in cash, transfer or card, and records which business account a transfer landed in.',
          'Every sale produces a printable invoice, numbered INV-YYYYMMDD-####, carrying its payment history and outstanding balance.',
          'Outstanding debts are tracked with follow-up payments against the original invoice.',
          'Staff accounts get a temporary password and a forced change on first login, and can be deactivated and reactivated.',
        ],
      },
      {
        heading: 'How the money is protected',
        points: [
          'Money is only ever written through two PostgreSQL functions, process_sale and record_payment. Each one locks the rows it touches and updates stock, totals, payments and the audit log in a single transaction, so a half-finished sale cannot exist.',
          'Both functions run SECURITY DEFINER with their own checks: only an active, signed-in user can call them, and the seller recorded is always the signed-in user, never a value sent by the browser.',
          'Supabase row-level security backs the functions, and the service-role key never leaves the server.',
          'An audit log records who did what, which is what makes a discount or a price change answerable.',
        ],
      },
      {
        heading: 'How it ships',
        points: [
          'Database changes go out as dated migrations, and each function is backed up before it is replaced, so a rollback is one file.',
          'Production deploys run from main through Vercel preview builds on every pull request, and merges happen after shop hours.',
        ],
      },
    ],
    result: [
      'The shop runs its daily trading on it: sales, part payments, debts and staff accounts.',
      'Every money-moving action is transactional, attributable and reversible by record.',
    ],
    media: [
      {
        type: 'image',
        src: 'pos-dashboard.png',
        alt: 'The point of sale dashboard, with customer names, invoice numbers and amounts blurred',
        caption: 'Dashboard. Customer names, invoice numbers and amounts are blurred.',
      },
      { type: 'image', src: 'pos-login.png', alt: 'The point of sale sign-in screen' },
    ],
    note: 'Private client repository. The screenshots are redacted.',
  },
];

export const cloudProjects = projects.filter((p) => p.kind === 'cloud');
export const freelanceProjects = projects.filter((p) => p.kind === 'freelance');
export const featuredProjects = projects.filter((p) => p.featured && p.kind === 'cloud');
