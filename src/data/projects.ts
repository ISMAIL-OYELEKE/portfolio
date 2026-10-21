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
    slug: 'kestrel-loan-platform',
    diagram: {
      width: 1800,
      height: 1260,
      alt: 'Architecture diagram: customers reach an Application Load Balancer protected by AWS WAF in public subnets across two availability zones in eu-west-1. ECS Fargate API tasks in private subnets store applications in RDS PostgreSQL (Multi-AZ, isolated subnets) and queue them on SQS. A Lambda scorer reads the queue, saves the decision and publishes it to SNS. VPC endpoints are the only way out of the private subnets. KMS customer managed keys, Secrets Manager, ECR and CloudWatch sit alongside, with CloudTrail, GuardDuty, Security Hub, Config and GitHub OIDC deploy roles at account level.',
    },
    title: 'Kestrel Loan Platform on AWS',
    kind: 'cloud',
    date: 'October 2026',
    dateISO: '2026-10-14',
    context: 'A production style build for a fictional microfinance bank',
    summary:
      'A loan application platform built end to end with Terraform: an API on ECS Fargate, a Lambda scorer behind SQS, and a pipeline that deploys to prod only after a human approves.',
    problem:
      'Kestrel Microfinance Bank, a fictional lender, needed customers to apply for a loan through an API and get a decision in seconds, not overnight. It had to be secure enough for bank data, survive a payday rush, recover from a lost database and stay under a USD 1,500 monthly budget. I built, tested, load tested, recovered and then tore it all down in 5 days.',
    stack: [
      'ECS Fargate',
      'RDS PostgreSQL',
      'AWS Lambda',
      'Amazon SQS',
      'AWS WAF',
      'AWS KMS',
      'Terraform',
      'GitHub Actions',
      'Application Load Balancer',
      'VPC endpoints',
      'CloudWatch',
      'k6',
    ],
    featured: true,
    repo: 'https://github.com/ISMAIL-OYELEKE/kestrel-platform',
    metaTitle: 'Kestrel Loan Platform on AWS with Terraform',
    metaDescription:
      'How Ismail Oyeleke built a loan platform on ECS Fargate, RDS, SQS and Lambda with Terraform, then load tested it, ran a restore drill and tore it down for USD 9.20.',
    build: [
      {
        heading: 'The application',
        points: [
          'Customers reach a Python API on ECS Fargate through an Application Load Balancer protected by AWS WAF, with common attack rules and a rate limit of 2,000 requests per IP per 5 minutes.',
          'Applications are stored in PostgreSQL on RDS, Multi-AZ in prod, and queued on SQS.',
          'A Lambda scorer reads the queue, scores each application and publishes the decision. Decisions are idempotent, so a retried message never creates a second decision.',
        ],
      },
      {
        heading: 'Network and data protection',
        points: [
          'Everything runs in private subnets with no internet route. AWS services are reached through VPC endpoints instead of a NAT gateway.',
          'HTTPS for customers and TLS to the database. Data at rest is encrypted with customer managed KMS keys.',
          "The customer's BVN (bank verification number) is encrypted at field level, so it is never readable in the database.",
        ],
      },
      {
        heading: 'Infrastructure as code',
        points: [
          '9 reusable Terraform modules: network, database, api, messaging, worker, kms, observability, security and governance.',
          'Dev and prod use the same modules with different settings. Prod runs 2 tasks across 2 availability zones with a standby database and auto scales up to 20 tasks.',
        ],
      },
      {
        heading: 'CI/CD and security',
        points: [
          'A GitHub Actions pipeline runs lint, unit and database tests, terraform fmt and validate, a Checkov security scan, and posts the Terraform plan on every pull request.',
          'After merge it deploys to dev, waits for a human approval, then deploys the same tested image to prod.',
          'GitHub signs in to AWS with OIDC, so there are no long lived access keys anywhere, and no IAM user has an access key.',
          'Each deploy stops on a critical container vulnerability (an ECR scan gate) and checks that every resource carries cost tags.',
          'CloudTrail in every region to a tamper resistant encrypted bucket, plus GuardDuty, Security Hub (AWS Foundational Security Best Practices) and AWS Config.',
        ],
      },
      {
        heading: 'Observability',
        points: [
          'A CloudWatch dashboard per environment and 6 alarms that email on fire and on recovery: API 5xx error rate, p95 latency, no healthy tasks, a stuck scoring queue, the dead letter queue and low database storage.',
          'A runbook entry for every alarm: how to confirm it, the immediate fix and the permanent fix.',
        ],
      },
    ],
    decisions: [
      {
        title: 'VPC endpoints instead of a NAT gateway',
        body: 'Nothing in the private subnets has a route to the internet. The tasks and the scorer reach AWS services only through VPC endpoints.',
      },
      {
        title: 'Scorer on Lambda with idempotent decisions',
        body: 'The scorer reads from SQS, which can deliver a message more than once. Making each decision idempotent means a retry never creates a second decision.',
      },
      {
        title: 'Field level protection for the BVN',
        body: 'Disk encryption is not enough for a bank verification number. It is encrypted at field level, so it is never readable in the database.',
      },
      {
        title: 'A pipeline with a prod approval',
        body: 'Every merge deploys to dev first. Prod gets the same tested image only after a human approves it.',
      },
    ],
    result: [
      'Load test with k6 against prod at a payday peak of 50 requests a second, 25 times a normal day: 19,602 requests in 8 minutes, 0 failed, and p95 latency of 58 ms against a 1 second target. Auto scaling went from 2 to 5 tasks and back down, and no alarm fired.',
      'Automatic rollback proven: a deliberately broken image was deployed, and the ECS deployment circuit breaker rolled back to the working version by itself while customers kept being served.',
      'Restore drill on prod: the service was stable 21 minutes after the restore was requested, against a 2 hour target, and the newest restorable point was under 5 minutes old, against a 15 minute target.',
      'Estimated running cost at the client\'s scale: about USD 273 a month, against a USD 1,500 limit.',
      'Actual AWS spend for the whole build: USD 9.20, confirmed in Cost Explorer. Everything was torn down with terraform destroy on 17 October 2026, and spend on 18 October was USD 0.00.',
    ],
    lessons: [
      "GitHub's OIDC token used permanent owner and repository IDs in its subject, so AWS rejected it. I found the real subject in CloudTrail and fixed the role trust policy.",
      'terraform destroy failed on large versioned log buckets with a provider error (bufio token too long). I emptied the buckets with the AWS CLI in batches and re-ran the destroy.',
      'The rollback check originally passed too easily, so I rewrote it to pass only when ECS itself logs the failed deployment and the rollback.',
      'AWS Config was 76% of the whole bill (USD 6.98 of USD 9.20), because it bills for every recorded change while infrastructure is created and destroyed.',
    ],
    media: [
      {
        type: 'image',
        src: 'kestrel-k6-summary.png',
        alt: 'k6 summary of the prod load test: 19,602 checks, 100% succeeded, 0% of requests failed, p95 request duration 58.08 ms',
        caption: 'The k6 payday load test against prod: 19,602 requests, 0 failed, p95 58 ms.',
      },
      {
        type: 'image',
        src: 'kestrel-dashboard-peak.png',
        alt: 'The kestrel-prod CloudWatch dashboard during the load test: requests climbing to about 3,000 a minute, a 5xx error rate of 0, latency far below the 1 second alarm line, and empty scoring and dead letter queues',
        caption: 'The prod dashboard at peak: about 3,000 requests a minute, no errors, queues empty.',
      },
      {
        type: 'image',
        src: 'kestrel-cost-daily.png',
        alt: 'Cost Explorer daily spend from 14 to 18 October 2026, rising to under 4 US dollars a day and falling to zero on 18 October after the teardown',
        caption: 'Daily AWS spend for the whole build: USD 9.20 in total, USD 0.00 after the teardown.',
      },
    ],
  },
  {
    slug: 'enterprise-staff-portal',
    diagram: {
      width: 1720,
      height: 1090,
      alt: 'Architecture diagram: staff and leadership use a browser portal that calls an API Gateway HTTP API in eu-west-2. Lambda handlers check roles, store requests, sessions and notifications in DynamoDB, and send status email through Amazon SES. EventBridge schedules run reminders and digests.',
    },
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
          'A decoupled application on AWS Lambda behind API Gateway, so it reduces always-on compute costs and scales on its own when everyone requests leave in the same week.',
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
        title: 'Serverless over an always-on server',
        body: 'Approval traffic is bursty and internal. Pay-per-use reduces always-on compute costs and removes the patching work that comes with instances.',
      },
      {
        title: 'Events over polling',
        body: 'EventBridge schedules the reminder work, so the system does nothing between events rather than running a cron host.',
      },
    ],
    result: [
      'Leave and payroll-advance approvals run as a tracked workflow with an audit trail instead of email threads.',
      'No servers to patch, and serverless pay-per-use reduces always-on compute costs.',
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
    diagram: {
      width: 1720,
      height: 1090,
      alt: 'Architecture diagram: callers and web chat customers, from allowlisted bank domains only, enter one Amazon Connect contact flow that checks Africa/Lagos business hours. In hours they join an agent queue and reach an agent in the Contact Control Panel. Out of hours, Amazon Polly reads a closed message and the contact ends.',
    },
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
        alt: 'The point of sale dashboard in the test environment: today\'s revenue, items in stock, low stock alerts, debts owed, a low stock list and recent sales with paid, partial and unpaid status',
        caption: 'Dashboard, from the test environment. All names and figures are sample data.',
      },
      { type: 'image', src: 'pos-login.png', alt: 'The point of sale sign-in screen' },
    ],
    note: 'Private client repository. The screenshots come from a separate test environment with sample data.',
  },
];

export const cloudProjects = projects.filter((p) => p.kind === 'cloud');
export const freelanceProjects = projects.filter((p) => p.kind === 'freelance');
export const featuredProjects = projects.filter((p) => p.featured && p.kind === 'cloud');
