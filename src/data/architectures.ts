/*
 * Simplified request flows for the live architecture diagrams, taken from
 * each project's full diagram in public/diagrams. Coordinates are in an
 * 800 x 400 box. Edges run in the direction traffic flows, and packets travel
 * along them in that order.
 */
export type ArchNode = { id: string; label: string; x: number; y: number; actor?: boolean };
export type Arch = { short: string; nodes: ArchNode[]; edges: [string, string][] };

export const architectures: Record<string, Arch> = {
  'kestrel-loan-platform': {
    short: 'Kestrel loan platform',
    nodes: [
      { id: 'cust', label: 'Customers', x: 70, y: 210, actor: true },
      { id: 'waf', label: 'AWS WAF', x: 195, y: 210 },
      { id: 'alb', label: 'Load balancer', x: 330, y: 210 },
      { id: 'ecs', label: 'ECS Fargate API', x: 480, y: 210 },
      { id: 'rds', label: 'RDS PostgreSQL', x: 650, y: 95 },
      { id: 'sqs', label: 'SQS queue', x: 590, y: 320 },
      { id: 'lambda', label: 'Lambda scorer', x: 730, y: 320 },
      { id: 'sns', label: 'SNS decision', x: 730, y: 210 },
      { id: 'gha', label: 'GitHub Actions (OIDC)', x: 480, y: 60 },
    ],
    edges: [
      ['cust', 'waf'],
      ['waf', 'alb'],
      ['alb', 'ecs'],
      ['ecs', 'rds'],
      ['ecs', 'sqs'],
      ['sqs', 'lambda'],
      ['lambda', 'sns'],
      ['gha', 'ecs'],
    ],
  },
  'enterprise-staff-portal': {
    short: 'Staff portal',
    nodes: [
      { id: 'staff', label: 'Staff and leaders', x: 80, y: 210, actor: true },
      { id: 'api', label: 'API Gateway', x: 250, y: 210 },
      { id: 'lambda', label: 'Lambda handlers', x: 430, y: 210 },
      { id: 'ddb', label: 'DynamoDB', x: 640, y: 110 },
      { id: 'ses', label: 'Amazon SES', x: 640, y: 310 },
      { id: 'eb', label: 'EventBridge schedules', x: 430, y: 70 },
    ],
    edges: [
      ['staff', 'api'],
      ['api', 'lambda'],
      ['lambda', 'ddb'],
      ['lambda', 'ses'],
      ['eb', 'lambda'],
    ],
  },
  'portfolio-on-s3-cloudfront-route-53': {
    short: 'This portfolio',
    nodes: [
      { id: 'visitor', label: 'You, right now', x: 80, y: 220, actor: true },
      { id: 'r53', label: 'Route 53', x: 250, y: 100 },
      { id: 'cf', label: 'CloudFront + WAF', x: 400, y: 220 },
      { id: 'acm', label: 'ACM certificate', x: 400, y: 340 },
      { id: 's3', label: 'Private S3 bucket', x: 620, y: 220 },
      { id: 'gha', label: 'GitHub Actions (OIDC)', x: 620, y: 80 },
    ],
    edges: [
      ['visitor', 'r53'],
      ['r53', 'cf'],
      ['visitor', 'cf'],
      ['acm', 'cf'],
      ['cf', 's3'],
      ['gha', 's3'],
    ],
  },
  'cloud-contact-center': {
    short: 'Contact centre',
    nodes: [
      { id: 'call', label: 'Callers', x: 80, y: 130, actor: true },
      { id: 'chat', label: 'Web chat', x: 80, y: 300, actor: true },
      { id: 'flow', label: 'Amazon Connect flow', x: 280, y: 215 },
      { id: 'hours', label: 'Lagos hours check', x: 460, y: 215 },
      { id: 'queue', label: 'Agent queue', x: 630, y: 120 },
      { id: 'agent', label: 'Agent', x: 740, y: 215, actor: true },
      { id: 'polly', label: 'Polly closed message', x: 630, y: 320 },
    ],
    edges: [
      ['call', 'flow'],
      ['chat', 'flow'],
      ['flow', 'hours'],
      ['hours', 'queue'],
      ['queue', 'agent'],
      ['hours', 'polly'],
    ],
  },
  'serverless-ai-recruiter-assistant': {
    short: 'AI recruiter bot',
    nodes: [
      { id: 'rec', label: 'Recruiter', x: 80, y: 210, actor: true },
      { id: 'widget', label: 'Chat widget', x: 240, y: 210 },
      { id: 'lex', label: 'Amazon Lex V2', x: 420, y: 210 },
      { id: 'lambda', label: 'Lambda (Python)', x: 620, y: 210 },
      { id: 'cw', label: 'CloudWatch logs', x: 620, y: 340 },
      { id: 'iam', label: 'Least-privilege IAM', x: 620, y: 80 },
    ],
    edges: [
      ['rec', 'widget'],
      ['widget', 'lex'],
      ['lex', 'lambda'],
      ['lambda', 'cw'],
      ['iam', 'lambda'],
    ],
  },
  'highly-available-multi-tier-web-application': {
    short: 'Multi-AZ web app',
    nodes: [
      { id: 'users', label: 'Users', x: 70, y: 210, actor: true },
      { id: 'igw', label: 'Internet gateway', x: 200, y: 210 },
      { id: 'alb', label: 'Load balancer', x: 340, y: 210 },
      { id: 'ec2a', label: 'EC2, zone A', x: 500, y: 110 },
      { id: 'ec2b', label: 'EC2, zone B', x: 500, y: 310 },
      { id: 'rds', label: 'RDS MySQL', x: 690, y: 210 },
      { id: 'sm', label: 'Secrets Manager', x: 690, y: 60 },
    ],
    edges: [
      ['users', 'igw'],
      ['igw', 'alb'],
      ['alb', 'ec2a'],
      ['alb', 'ec2b'],
      ['ec2a', 'rds'],
      ['ec2b', 'rds'],
      ['sm', 'ec2a'],
    ],
  },
  'wordpress-on-lightsail': {
    short: 'WordPress on Lightsail',
    nodes: [
      { id: 'readers', label: 'Readers', x: 90, y: 210, actor: true },
      { id: 'ip', label: 'Static IP + HTTPS', x: 270, y: 210 },
      { id: 'ls', label: 'Lightsail WordPress', x: 470, y: 210 },
      { id: 'db', label: 'MySQL', x: 670, y: 120 },
      { id: 'snap', label: 'Daily snapshots', x: 670, y: 300 },
    ],
    edges: [
      ['readers', 'ip'],
      ['ip', 'ls'],
      ['ls', 'db'],
      ['ls', 'snap'],
    ],
  },
};
