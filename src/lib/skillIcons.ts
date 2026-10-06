/**
 * Real logos for the Skills list on the About page.
 *
 * AWS services use the official AWS Architecture Icons (via the aws-icons
 * package): flat colour tiles, shown as they are. Other tools use their own
 * marks from Simple Icons in brand colour. Skills with no logo of their own
 * (SQL, REST APIs, Boto3 and so on) stay as plain text.
 */
import * as si from 'simple-icons';
import AWSAutoScaling from 'aws-icons/icons/architecture-service/AWSAutoScaling.svg?raw';
import AWSCertificateManager from 'aws-icons/icons/architecture-service/AWSCertificateManager.svg?raw';
import AWSCloudFormation from 'aws-icons/icons/architecture-service/AWSCloudFormation.svg?raw';
import AWSFargate from 'aws-icons/icons/architecture-service/AWSFargate.svg?raw';
import AWSIdentityandAccessManagement from 'aws-icons/icons/architecture-service/AWSIdentityandAccessManagement.svg?raw';
import AWSLambda from 'aws-icons/icons/architecture-service/AWSLambda.svg?raw';
import AWSSecretsManager from 'aws-icons/icons/architecture-service/AWSSecretsManager.svg?raw';
import AWSSystemsManager from 'aws-icons/icons/architecture-service/AWSSystemsManager.svg?raw';
import AmazonAPIGateway from 'aws-icons/icons/architecture-service/AmazonAPIGateway.svg?raw';
import AmazonCloudFront from 'aws-icons/icons/architecture-service/AmazonCloudFront.svg?raw';
import AmazonCloudWatch from 'aws-icons/icons/architecture-service/AmazonCloudWatch.svg?raw';
import AmazonConnect from 'aws-icons/icons/architecture-service/AmazonConnect.svg?raw';
import AmazonDynamoDB from 'aws-icons/icons/architecture-service/AmazonDynamoDB.svg?raw';
import AmazonEC2 from 'aws-icons/icons/architecture-service/AmazonEC2.svg?raw';
import AmazonElasticContainerService from 'aws-icons/icons/architecture-service/AmazonElasticContainerService.svg?raw';
import AmazonElasticKubernetesService from 'aws-icons/icons/architecture-service/AmazonElasticKubernetesService.svg?raw';
import AmazonEventBridge from 'aws-icons/icons/architecture-service/AmazonEventBridge.svg?raw';
import AmazonLex from 'aws-icons/icons/architecture-service/AmazonLex.svg?raw';
import AmazonLightsail from 'aws-icons/icons/architecture-service/AmazonLightsail.svg?raw';
import AmazonPolly from 'aws-icons/icons/architecture-service/AmazonPolly.svg?raw';
import AmazonRDS from 'aws-icons/icons/architecture-service/AmazonRDS.svg?raw';
import AmazonRoute53 from 'aws-icons/icons/architecture-service/AmazonRoute53.svg?raw';
import AmazonSimpleEmailService from 'aws-icons/icons/architecture-service/AmazonSimpleEmailService.svg?raw';
import AmazonSimpleStorageService from 'aws-icons/icons/architecture-service/AmazonSimpleStorageService.svg?raw';
import AmazonVirtualPrivateCloud from 'aws-icons/icons/architecture-service/AmazonVirtualPrivateCloud.svg?raw';
import ElasticLoadBalancing from 'aws-icons/icons/architecture-service/ElasticLoadBalancing.svg?raw';

export type SkillIcon =
  | { kind: 'aws'; svg: string }
  | { kind: 'mark'; path: string; color: string };

/** Each AWS tile, keyed by the skill name used in src/data/skills.ts. */
const aws: Record<string, string> = {
  IAM: AWSIdentityandAccessManagement,
  VPC: AmazonVirtualPrivateCloud,
  EC2: AmazonEC2,
  S3: AmazonSimpleStorageService,
  RDS: AmazonRDS,
  Lambda: AWSLambda,
  'API Gateway': AmazonAPIGateway,
  DynamoDB: AmazonDynamoDB,
  CloudFront: AmazonCloudFront,
  'Route 53': AmazonRoute53,
  ACM: AWSCertificateManager,
  CloudWatch: AmazonCloudWatch,
  ECS: AmazonElasticContainerService,
  EKS: AmazonElasticKubernetesService,
  Fargate: AWSFargate,
  SES: AmazonSimpleEmailService,
  EventBridge: AmazonEventBridge,
  'Amazon Connect': AmazonConnect,
  Lex: AmazonLex,
  Polly: AmazonPolly,
  'Secrets Manager': AWSSecretsManager,
  'Systems Manager': AWSSystemsManager,
  ALB: ElasticLoadBalancing,
  'Auto Scaling': AWSAutoScaling,
  Lightsail: AmazonLightsail,
  'AWS CloudFormation': AWSCloudFormation,
  'Amazon ECS': AmazonElasticContainerService,
  'Amazon EKS': AmazonElasticKubernetesService,
  'AWS Fargate': AWSFargate,
  'Amazon CloudWatch': AmazonCloudWatch,
};

/**
 * Simple Icons marks. The colour is the brand's own, except where that
 * colour is too pale to read on the paper page, where the brand's darker
 * variant (or near black) is used instead.
 */
const marks: Record<string, { icon: { path: string; hex: string }; color?: string }> = {
  Terraform: { icon: si.siTerraform },
  Docker: { icon: si.siDocker },
  Kubernetes: { icon: si.siKubernetes },
  'GitHub Actions': { icon: si.siGithubactions },
  Jenkins: { icon: si.siJenkins },
  'GitLab CI': { icon: si.siGitlab },
  Git: { icon: si.siGit },
  GitHub: { icon: si.siGithub },
  Linux: { icon: si.siLinux, color: '#1d1d1b' },
  Bash: { icon: si.siGnubash },
  Python: { icon: si.siPython },
  PostgreSQL: { icon: si.siPostgresql },
  'Next.js': { icon: si.siNextdotjs },
  React: { icon: si.siReact, color: '#087ea4' },
  TypeScript: { icon: si.siTypescript },
  JavaScript: { icon: si.siJavascript, color: '#c9a400' },
  Supabase: { icon: si.siSupabase, color: '#249361' },
  'Tailwind CSS': { icon: si.siTailwindcss, color: '#0891b2' },
  Vercel: { icon: si.siVercel },
  JWT: { icon: si.siJsonwebtokens },
  Postman: { icon: si.siPostman },
};

export const skillIcon = (name: string): SkillIcon | undefined => {
  // The tiles carry AWS's internal file name as a <title>; drop it so it never
  // shows as a tooltip. The visible label beside the tile names the service.
  if (aws[name]) return { kind: 'aws', svg: aws[name].replace(/<title>.*?<\/title>/, '') };
  const m = marks[name];
  return m ? { kind: 'mark', path: m.icon.path, color: m.color ?? `#${m.icon.hex}` } : undefined;
};
