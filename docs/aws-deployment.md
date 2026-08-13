# AWS deployment

AWS account: `129405039505`

## Recommended topology

```text
Amplify Hosting (Next.js SSR)
              │ HTTPS JSON
              ▼
ECS Express Mode (NestJS container)
              │
              ▼
JSON seed data + process memory
```

Use Amplify Hosting for the Next.js 15 SSR application and ECS Express Mode for the API. App Runner is no longer open to new AWS customers; ECS Express Mode is its recommended successor and provisions Fargate, load balancing, networking, health checks, and scaling around one container.

Keep the ECS service at one task for this prototype. Mutations are intentionally process-local, so running multiple tasks would give users inconsistent state. Before scaling past one task, replace the in-memory mutation store with persistent storage.

## 1. Deploy the API

The root `Dockerfile` builds only the shared package and NestJS API. It runs on port `4000`, includes the JSON seed files, runs as a non-root user, and exposes `GET /api/health`.

The workflow contains the non-secret deployment identifiers for account `129405039505`, region `us-west-1`, the ECR repository, and the ECS service. GitHub authenticates through OIDC; no long-lived AWS keys are stored in GitHub.

Pushes to `main` automatically run `Deploy API to ECS Express Mode` when API, shared, data, dependency, container, or workflow files change. It builds the image, pushes commit and `latest` tags to ECR, and creates or updates one ECS task. Manual dispatch remains available for redeployment.

For a local container check:

```bash
docker build -t restaurant-intelligence-api .
docker run --rm -p 4000:4000 \
  -e CORS_ORIGINS=http://localhost:3000 \
  restaurant-intelligence-api
curl http://localhost:4000/api/health
```

## 2. Deploy the web application

In Amplify Hosting:

1. Connect this repository and branch.
2. Select **My app is a monorepo**.
3. Set the app root to `apps/web`. Amplify should set `AMPLIFY_MONOREPO_APP_ROOT=apps/web`.
4. Add both environment variables below using the public HTTPS endpoint from ECS Express Mode:

```text
API_BASE_URL=https://your-api-host/api
NEXT_PUBLIC_API_BASE_URL=https://your-api-host/api
```

5. Deploy using the checked-in `amplify.yml`.

Keep Amplify continuous deployment enabled for the connected `main` branch. Amplify then deploys the client automatically on every push to `main`; no separate GitHub Actions workflow is needed for the UI.

`API_BASE_URL` is used by Next.js Server Components during SSR. `NEXT_PUBLIC_API_BASE_URL` is compiled into the focused Client Components for browser mutations. The initial prototype deployment permits every CORS origin so the first Amplify deployment works. After Amplify assigns its URL, replace `CORS_ORIGINS=*` in the workflow with that exact origin.

## 3. Domains and validation

Prefer `app.example.com` for Amplify and `api.example.com` for the ECS load balancer. Configure HTTPS before updating the API variables.

Validate:

```bash
curl https://api.example.com/api/health
curl -I https://app.example.com/dashboard
```

Then test inventory count, approval, PO creation, receiving, and demo reset from the hosted UI.

## Prototype limitation

The container starts from immutable JSON seeds and stores all changes in memory. Any ECS restart or deployment resets the demo. That matches the current prototype design; durable production operation will require a persistent repository implementation.
