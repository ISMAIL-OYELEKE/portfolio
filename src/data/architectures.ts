/*
 * Simplified request flows for the live architecture diagrams, taken from
 * each project's full diagram in public/diagrams. Each node carries its
 * official AWS icon. x and y place it in an 800 x 400 box for wide screens;
 * tx and ty place it in a 400 wide box (tallH high) for phones, where the
 * flow runs top to bottom so the icons and labels stay readable. Edges run in
 * the direction traffic flows, and packets travel along them in that order.
 */
import type { ArchIcon } from '../lib/archIcons';

export type ArchNode = { id: string; label: string; icon: ArchIcon; x: number; y: number; tx: number; ty: number; actor?: boolean };
export type Arch = { short: string; tallH: number; nodes: ArchNode[]; edges: [string, string][] };

export const architectures: Record<string, Arch> = {
  'kestrel-loan-platform': {
    short: 'Kestrel loan platform',
    tallH: 570,
    nodes: [
      { id: 'cust', label: 'Customers', icon: 'users', x: 70, y: 210, tx: 90, ty: 50, actor: true },
      { id: 'waf', label: 'AWS WAF', icon: 'waf', x: 195, y: 210, tx: 90, ty: 160 },
      { id: 'alb', label: 'Load balancer', icon: 'alb', x: 330, y: 210, tx: 90, ty: 270 },
      { id: 'ecs', label: 'ECS Fargate API', icon: 'ecs', x: 480, y: 210, tx: 300, ty: 270 },
      { id: 'rds', label: 'RDS PostgreSQL', icon: 'rds', x: 650, y: 95, tx: 90, ty: 390 },
      { id: 'sqs', label: 'SQS queue', icon: 'sqs', x: 590, y: 320, tx: 300, ty: 390 },
      { id: 'lambda', label: 'Lambda scorer', icon: 'lambda', x: 730, y: 320, tx: 300, ty: 510 },
      { id: 'sns', label: 'SNS decision', icon: 'sns', x: 730, y: 210, tx: 90, ty: 510 },
      { id: 'gha', label: 'GitHub Actions (OIDC)', icon: 'github', x: 480, y: 60, tx: 300, ty: 50 },
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
    tallH: 460,
    nodes: [
      { id: 'staff', label: 'Staff and leaders', icon: 'users', x: 80, y: 210, tx: 110, ty: 50, actor: true },
      { id: 'api', label: 'API Gateway', icon: 'apigw', x: 250, y: 210, tx: 110, ty: 170 },
      { id: 'lambda', label: 'Lambda handlers', icon: 'lambda', x: 430, y: 210, tx: 300, ty: 290 },
      { id: 'ddb', label: 'DynamoDB', icon: 'dynamodb', x: 640, y: 110, tx: 110, ty: 410 },
      { id: 'ses', label: 'Amazon SES', icon: 'ses', x: 640, y: 310, tx: 300, ty: 410 },
      { id: 'eb', label: 'EventBridge schedules', icon: 'eventbridge', x: 430, y: 70, tx: 300, ty: 50 },
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
    tallH: 460,
    nodes: [
      { id: 'visitor', label: 'You, right now', icon: 'client', x: 80, y: 220, tx: 90, ty: 50, actor: true },
      { id: 'r53', label: 'Route 53', icon: 'route53', x: 250, y: 100, tx: 90, ty: 170 },
      { id: 'cf', label: 'CloudFront + WAF', icon: 'cloudfront', x: 400, y: 220, tx: 200, ty: 290 },
      { id: 'acm', label: 'ACM certificate', icon: 'acm', x: 400, y: 340, tx: 90, ty: 410 },
      { id: 's3', label: 'Private S3 bucket', icon: 's3', x: 620, y: 220, tx: 310, ty: 410 },
      { id: 'gha', label: 'GitHub Actions (OIDC)', icon: 'github', x: 620, y: 80, tx: 310, ty: 50 },
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
    tallH: 580,
    nodes: [
      { id: 'call', label: 'Callers', icon: 'mobile', x: 80, y: 130, tx: 90, ty: 50, actor: true },
      { id: 'chat', label: 'Web chat', icon: 'chat', x: 80, y: 300, tx: 310, ty: 50, actor: true },
      { id: 'flow', label: 'Amazon Connect flow', icon: 'connect', x: 280, y: 215, tx: 200, ty: 170 },
      { id: 'hours', label: 'Lagos hours check', icon: 'connect', x: 460, y: 215, tx: 200, ty: 290 },
      { id: 'queue', label: 'Agent queue', icon: 'connect', x: 630, y: 120, tx: 90, ty: 410 },
      { id: 'agent', label: 'Agent', icon: 'user', x: 740, y: 215, tx: 90, ty: 530, actor: true },
      { id: 'polly', label: 'Polly closed message', icon: 'polly', x: 630, y: 320, tx: 310, ty: 410 },
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
    tallH: 580,
    nodes: [
      { id: 'rec', label: 'Recruiter', icon: 'user', x: 80, y: 210, tx: 140, ty: 50, actor: true },
      { id: 'widget', label: 'Chat widget', icon: 'chat', x: 240, y: 210, tx: 140, ty: 170 },
      { id: 'lex', label: 'Amazon Lex V2', icon: 'lex', x: 420, y: 210, tx: 140, ty: 290 },
      { id: 'lambda', label: 'Lambda (Python)', icon: 'lambda', x: 620, y: 210, tx: 140, ty: 410 },
      { id: 'cw', label: 'CloudWatch logs', icon: 'cloudwatch', x: 620, y: 340, tx: 140, ty: 530 },
      { id: 'iam', label: 'Least-privilege IAM', icon: 'iam', x: 620, y: 80, tx: 320, ty: 410 },
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
    tallH: 570,
    nodes: [
      { id: 'users', label: 'Users', icon: 'users', x: 70, y: 210, tx: 200, ty: 50, actor: true },
      { id: 'igw', label: 'Internet gateway', icon: 'igw', x: 200, y: 210, tx: 200, ty: 160 },
      { id: 'alb', label: 'Load balancer', icon: 'alb', x: 340, y: 210, tx: 200, ty: 270 },
      { id: 'ec2a', label: 'EC2, zone A', icon: 'ec2', x: 500, y: 110, tx: 90, ty: 390 },
      { id: 'ec2b', label: 'EC2, zone B', icon: 'ec2', x: 500, y: 310, tx: 310, ty: 390 },
      { id: 'rds', label: 'RDS MySQL', icon: 'rds', x: 690, y: 210, tx: 200, ty: 520 },
      { id: 'sm', label: 'Secrets Manager', icon: 'secrets', x: 690, y: 60, tx: 80, ty: 270 },
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
    tallH: 460,
    nodes: [
      { id: 'readers', label: 'Readers', icon: 'users', x: 90, y: 210, tx: 200, ty: 50, actor: true },
      { id: 'ip', label: 'Static IP + HTTPS', icon: 'internet', x: 270, y: 210, tx: 200, ty: 170 },
      { id: 'ls', label: 'Lightsail WordPress', icon: 'lightsail', x: 470, y: 210, tx: 200, ty: 290 },
      { id: 'db', label: 'MySQL', icon: 'database', x: 670, y: 120, tx: 90, ty: 410 },
      { id: 'snap', label: 'Daily snapshots', icon: 'snapshot', x: 670, y: 300, tx: 310, ty: 410 },
    ],
    edges: [
      ['readers', 'ip'],
      ['ip', 'ls'],
      ['ls', 'db'],
      ['ls', 'snap'],
    ],
  },
};
