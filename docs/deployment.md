# Deployment

The site is a static build. GitHub Actions builds it and pushes it to S3, then
clears the CloudFront cache. Nothing is deployed by hand, and no AWS access key
is stored in this repository: the workflow gets short-lived credentials from
GitHub's OIDC provider each run.

```
merge to main  ->  GitHub Actions  ->  assume an AWS role via OIDC
                                   ->  aws s3 sync dist s3://<bucket>
                                   ->  cloudfront create-invalidation
                                   ->  live on https://ismailoyeleke.com
```

Everything below is a one-time setup in the AWS console or CLI. Run it as an
account administrator.

---

## 1. The bucket

Create an S3 bucket in `us-east-1` (CloudFront certificates have to live there).
Call it something like `ismailoyeleke.com-site`.

Leave **Block all public access ON**. The bucket stays private. CloudFront reads
from it through Origin Access Control, so nobody can reach the bucket directly
and bypass the CDN. This is the main change from the first version of the site.

Do not enable static website hosting on the bucket. With OAC, CloudFront talks
to the REST endpoint instead.

## 2. The CloudFront distribution

- **Origin:** the bucket, with **Origin access** set to *Origin access control
  settings*. Create a new OAC and let the console copy the generated bucket
  policy for you.
- **Viewer protocol policy:** Redirect HTTP to HTTPS.
- **Default root object:** `index.html`.
- **Alternate domain names:** `ismailoyeleke.com` and `www.ismailoyeleke.com`.
- **Certificate:** an ACM certificate in `us-east-1` covering both names,
  validated through Route 53 DNS.
- **Response headers policy:** create one with the security headers listed in
  section 6.

The build writes real `.html` files (`/about.html`, `/projects/index.html`), and
the site links to clean paths like `/about`. Add a CloudFront Function on the
**viewer request** event so those paths resolve:

```js
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html';
  } else if (!uri.includes('.')) {
    request.uri = uri + '.html';
  }
  return request;
}
```

Set the distribution's custom error responses so a missing page returns the
custom 404 page: HTTP 403 and HTTP 404 both map to `/404.html` with a response
code of 404.

The bucket policy the console generates looks like this. It allows only this
distribution to read, and nobody else:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipalReadOnly",
      "Effect": "Allow",
      "Principal": { "Service": "cloudfront.amazonaws.com" },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::BUCKET_NAME/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
        }
      }
    }
  ]
}
```

## 3. DNS in Route 53

The domain's hosted zone already exists from the first version of the site,
whose apex record points at the old distribution. Pointing those records at the
new distribution is the moment the new site goes live, and pointing them back
is the rollback. If the old ACM certificate already covers both
`ismailoyeleke.com` and `www.ismailoyeleke.com`, the new distribution can reuse
it.

In the hosted zone for `ismailoyeleke.com`:

- An **A record** for the apex, as an **alias** to the CloudFront distribution.
- An **A record** for `www`, also an alias to the same distribution. The old site
  has no `www` record, so this is new.
- The ACM validation CNAME records, which the certificate request creates for you.

## 4. The GitHub OIDC provider

Once per AWS account. Skip if it already exists.

```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com
```

## 5. The deploy role

Create a role named `github-actions-portfolio-deploy`.

**Trust policy.** Replace `ACCOUNT_ID`. The deploy job runs in the
`production` GitHub environment, and when a job uses an environment GitHub puts
the environment in the token's `sub` claim instead of the branch. So the `sub`
condition names the environment. Only `main` can deploy to it once the
environment's branch rule is set (section 7), so a fork or another branch cannot
assume this role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:ISMAIL-OYELEKE/portfolio:environment:production"
        }
      }
    }
  ]
}
```

**Permissions policy.** Only what a deploy needs, on only this bucket and this
distribution:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListTheBucket",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::BUCKET_NAME"
    },
    {
      "Sid": "WriteSiteFiles",
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::BUCKET_NAME/*"
    },
    {
      "Sid": "ClearTheCache",
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
    }
  ]
}
```

## 6. Security headers

Create a CloudFront response headers policy and attach it to the default cache
behaviour:

| Header | Value |
| --- | --- |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-Frame-Options` | `DENY` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), interest-cohort=()` |
| `Content-Security-Policy` | see below |

A policy that fits what the site actually loads:

```
default-src 'self';
script-src 'self' 'sha256-bRrXOZfzkSHqxbwz5Za8TNTsnrMa7Kvk+eW1MqoTxsQ=' https://www.googletagmanager.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https://i.ytimg.com https://www.googletagmanager.com;
font-src 'self';
connect-src 'self' https://api.web3forms.com https://www.google-analytics.com https://region1.google-analytics.com;
frame-src https://www.youtube-nocookie.com;
form-action https://api.web3forms.com;
base-uri 'self';
object-src 'none';
frame-ancestors 'none'
```

Every script ships as its own file except the one-line `no-js` snippet in the
page head, which the hash in `script-src` allows. `node scripts/qa.mjs` fails
the build if any other inline script appears, so the policy cannot silently
break the site. If that snippet ever changes, the check prints the new hash to
put here and in `scripts/qa.mjs`.

## 7. Repository settings on GitHub

Under **Settings, Environments**, create an environment called `production`
(the first deploy creates it if you have not). Under **Deployment branches and
tags**, choose *Selected branches and tags* and add `main`, so only `main` can
deploy. Add these environment secrets:

| Name | Value |
| --- | --- |
| `AWS_DEPLOY_ROLE_ARN` | `arn:aws:iam::ACCOUNT_ID:role/github-actions-portfolio-deploy` |
| `AWS_S3_BUCKET` | the bucket name |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | the distribution id |

Under **Settings, Secrets and variables, Actions**, add these at repository
level, so the preview build can use them too:

| Kind | Name | Value |
| --- | --- | --- |
| Secret | `PUBLIC_WEB3FORMS_KEY` | the access key from web3forms.com, for the contact form |
| Variable | `PUBLIC_GA_ID` | the GA4 measurement id, `G-XXXXXXXXXX` |

`PUBLIC_WEB3FORMS_KEY` and `PUBLIC_GA_ID` end up in the built JavaScript, which
is how they are meant to work: both are public identifiers, not credentials.
Nothing secret is ever shipped to the browser. The AWS values never leave the
runner.

Without a Web3Forms key the contact page shows the email address and WhatsApp
link instead of the form, so a missing key is visible rather than silently
dropping messages.

## 8. After the first deploy

- Add the property in **Google Search Console** and submit
  `https://ismailoyeleke.com/sitemap-index.xml`.
- Do the same in **Bing Webmaster Tools**, which can import from Search Console.
- Create the GA4 property and set data retention to 14 months to match the
  privacy policy.
- Run the live URL through **PageSpeed Insights** and record the numbers.

## Rolling back

S3 object versioning on the bucket gives you a file-level undo. The faster route
is to revert the commit on `main`: the workflow redeploys the previous build and
invalidates the cache, which usually takes two or three minutes.
