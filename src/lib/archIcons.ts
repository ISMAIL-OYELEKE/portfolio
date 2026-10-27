/**
 * Official AWS Architecture Icons for the live architecture diagrams.
 *
 * Service icons are the coloured tiles exactly as AWS ships them. Resource
 * icons (a load balancer, an internet gateway, a snapshot) are line drawings,
 * so they sit on a tile in their own category colour, drawn in white, which is
 * how they read on both the light and the dark theme. People (customers,
 * callers) are drawn in the text colour inside a ring. GitHub Actions uses its
 * own mark from Simple Icons.
 */
import * as si from 'simple-icons';
import AWSCertificateManager from 'aws-icons/icons/architecture-service/AWSCertificateManager.svg?raw';
import AWSIdentityandAccessManagement from 'aws-icons/icons/architecture-service/AWSIdentityandAccessManagement.svg?raw';
import AWSLambda from 'aws-icons/icons/architecture-service/AWSLambda.svg?raw';
import AWSSecretsManager from 'aws-icons/icons/architecture-service/AWSSecretsManager.svg?raw';
import AWSWAF from 'aws-icons/icons/architecture-service/AWSWAF.svg?raw';
import AmazonAPIGateway from 'aws-icons/icons/architecture-service/AmazonAPIGateway.svg?raw';
import AmazonCloudFront from 'aws-icons/icons/architecture-service/AmazonCloudFront.svg?raw';
import AmazonCloudWatch from 'aws-icons/icons/architecture-service/AmazonCloudWatch.svg?raw';
import AmazonConnect from 'aws-icons/icons/architecture-service/AmazonConnect.svg?raw';
import AmazonDynamoDB from 'aws-icons/icons/architecture-service/AmazonDynamoDB.svg?raw';
import AmazonEC2 from 'aws-icons/icons/architecture-service/AmazonEC2.svg?raw';
import AmazonElasticContainerService from 'aws-icons/icons/architecture-service/AmazonElasticContainerService.svg?raw';
import AmazonEventBridge from 'aws-icons/icons/architecture-service/AmazonEventBridge.svg?raw';
import AmazonLex from 'aws-icons/icons/architecture-service/AmazonLex.svg?raw';
import AmazonLightsail from 'aws-icons/icons/architecture-service/AmazonLightsail.svg?raw';
import AmazonPolly from 'aws-icons/icons/architecture-service/AmazonPolly.svg?raw';
import AmazonRDS from 'aws-icons/icons/architecture-service/AmazonRDS.svg?raw';
import AmazonRoute53 from 'aws-icons/icons/architecture-service/AmazonRoute53.svg?raw';
import AmazonSimpleEmailService from 'aws-icons/icons/architecture-service/AmazonSimpleEmailService.svg?raw';
import AmazonSimpleNotificationService from 'aws-icons/icons/architecture-service/AmazonSimpleNotificationService.svg?raw';
import AmazonSimpleQueueService from 'aws-icons/icons/architecture-service/AmazonSimpleQueueService.svg?raw';
import AmazonSimpleStorageService from 'aws-icons/icons/architecture-service/AmazonSimpleStorageService.svg?raw';
import ResALB from 'aws-icons/icons/resource/ElasticLoadBalancingApplicationLoadBalancer.svg?raw';
import ResIGW from 'aws-icons/icons/resource/AmazonVPCInternetGateway.svg?raw';
import ResSnapshot from 'aws-icons/icons/resource/AmazonElasticBlockStoreSnapshot.svg?raw';
import ResDatabase from 'aws-icons/icons/resource/Database.svg?raw';
import ResInternet from 'aws-icons/icons/resource/Internet.svg?raw';
import ResChat from 'aws-icons/icons/resource/Chat.svg?raw';
import ResUsers from 'aws-icons/icons/resource/Users.svg?raw';
import ResUser from 'aws-icons/icons/resource/User.svg?raw';
import ResClient from 'aws-icons/icons/resource/Client.svg?raw';
import ResMobile from 'aws-icons/icons/resource/Mobileclient.svg?raw';

const services = {
  acm: AWSCertificateManager,
  iam: AWSIdentityandAccessManagement,
  lambda: AWSLambda,
  secrets: AWSSecretsManager,
  waf: AWSWAF,
  apigw: AmazonAPIGateway,
  cloudfront: AmazonCloudFront,
  cloudwatch: AmazonCloudWatch,
  connect: AmazonConnect,
  dynamodb: AmazonDynamoDB,
  ec2: AmazonEC2,
  ecs: AmazonElasticContainerService,
  eventbridge: AmazonEventBridge,
  lex: AmazonLex,
  lightsail: AmazonLightsail,
  polly: AmazonPolly,
  rds: AmazonRDS,
  route53: AmazonRoute53,
  ses: AmazonSimpleEmailService,
  sns: AmazonSimpleNotificationService,
  sqs: AmazonSimpleQueueService,
  s3: AmazonSimpleStorageService,
};

// Resource drawings and the AWS category colour of the tile they sit on.
const resources = {
  alb: { svg: ResALB, tile: '#8C4FFF' },
  igw: { svg: ResIGW, tile: '#8C4FFF' },
  snapshot: { svg: ResSnapshot, tile: '#7AA116' },
  database: { svg: ResDatabase, tile: '#C925D1' },
  internet: { svg: ResInternet, tile: '#8C4FFF' },
  chat: { svg: ResChat, tile: '#01A88D' },
};

const people = { users: ResUsers, user: ResUser, client: ResClient, mobile: ResMobile };

export type ArchIcon = keyof typeof services | keyof typeof resources | keyof typeof people | 'github';

/** The drawing inside an icon file: everything between <svg ...> and </svg>, without its title. */
function inner(raw: string) {
  const body = raw.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  return body.replace(/<title>[\s\S]*?<\/title>/, '');
}
function viewBox(raw: string) {
  return raw.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 48 48';
}
// Inline sizes, because the site-wide `svg { height: auto }` rule would otherwise
// stretch a nested drawing to the whole diagram's height.
const nest = (x: number, y: number, size: number, vb: string, body: string) =>
  `<svg x="${x}" y="${y}" width="${size}" height="${size}" style="width:${size}px;height:${size}px;max-width:none" viewBox="${vb}">${body}</svg>`;
const recolor = (s: string, colour: string) => s.replace(/fill="#[0-9a-fA-F]{3,6}"/g, `fill="${colour}"`);

/** SVG markup for one node icon, `size` units square, centred on 0,0. */
export function archIcon(key: ArchIcon, size = 44): string {
  const h = size / 2;
  if (key in services) {
    const raw = services[key as keyof typeof services];
    return nest(-h, -h, size, viewBox(raw), inner(raw));
  }
  if (key in resources) {
    const { svg, tile } = resources[key as keyof typeof resources];
    const pad = size * 0.14;
    return `<rect x="${-h}" y="${-h}" width="${size}" height="${size}" fill="${tile}"/>${nest(-h + pad, -h + pad, size - pad * 2, viewBox(svg), recolor(inner(svg), '#fff'))}`;
  }
  if (key === 'github') {
    const pad = size * 0.2;
    return `<rect x="${-h}" y="${-h}" width="${size}" height="${size}" fill="#2088FF"/>${nest(-h + pad, -h + pad, size - pad * 2, '0 0 24 24', `<path fill="#fff" d="${si.siGithubactions.path}"/>`)}`;
  }
  const raw = people[key as keyof typeof people];
  const s = size * 0.62;
  return `<circle r="${h}" class="arch__ring"/>${nest(-s / 2, -s / 2, s, viewBox(raw), recolor(inner(raw), 'currentColor'))}`;
}
